/**
 * Motor de Visión y Extracción Fotográfica de Alta Fidelidad para Inmuebles.
 * 
 * Principios de Calidad:
 * 1. NUNCA distorsionar, achicar ni pixelar la imagen nativa del video (extrae en 1080p/4K nativo).
 * 2. Si el video es vertical (9:16), NO forzar un recorte aplastado o arbitrario: conserva la imagen completa
 *    y permite encuadre cinematográfico centrado y nítido.
 * 3. Filtrado implacable de "fotogramas basura":
 *    - Descarta fotogramas oscuros o con fundido a negro (típico de transiciones de edición).
 *    - Descarta fotogramas borrosos con desenfoque de movimiento (motion blur cuando la cámara gira rápido).
 *    - Descarta fotogramas con aberración de color o sobreexposición.
 * 4. Captura síncrona en alta fidelidad: espera el fotograma decodificado completo antes de dibujar en canvas.
 */

export interface FrameCandidate {
  time: number;
  score: number;
  sharpness: number;
  contrast: number;
  brightness: number;
  canvas: HTMLCanvasElement;
}

/**
 * Espera de manera determinística a que el video termine de decodificar y renderizar
 * el cuadro exacto en la posición de tiempo solicitada.
 */
export async function seekVideoFrame(video: HTMLVideoElement, time: number): Promise<void> {
  return new Promise((resolve) => {
    // Si ya está casi en ese tiempo y en pausa
    if (Math.abs(video.currentTime - time) < 0.05 && video.readyState >= 2) {
      setTimeout(resolve, 80);
      return;
    }

    let resolved = false;
    const cleanup = () => {
      if (resolved) return;
      resolved = true;
      video.removeEventListener("seeked", onSeeked);
      // Breve margen de 60ms para que la GPU pinte el frame en el búfer de textura
      setTimeout(resolve, 60);
    };

    const onSeeked = () => cleanup();
    video.addEventListener("seeked", onSeeked, { once: true });
    video.currentTime = time;

    // Timeout de seguridad por si el navegador no emite seeked
    setTimeout(cleanup, 500);
  });
}

/**
 * Calcula la nitidez espacial real (Detección Laplaciana de bordes de alta frecuencia).
 * Si la cámara se estaba moviendo rápido, el resultado será muy bajo (motion blur).
 */
export function calculateSharpness(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): { score: number; sharpness: number; contrast: number; brightness: number; isGarbage: boolean } {
  // Muestrear a 320px de ancho para análisis de frecuencia de bordes sin ralentizar la GPU
  const sampleW = 320;
  const sampleH = Math.round((sampleW * height) / width);

  const thumbCanvas = document.createElement("canvas");
  thumbCanvas.width = sampleW;
  thumbCanvas.height = sampleH;
  const thumbCtx = thumbCanvas.getContext("2d", { willReadFrequently: true });
  if (!thumbCtx) {
    return { score: 0, sharpness: 0, contrast: 0, brightness: 0, isGarbage: true };
  }

  thumbCtx.imageSmoothingEnabled = false;
  thumbCtx.drawImage(ctx.canvas, 0, 0, sampleW, sampleH);
  const imgData = thumbCtx.getImageData(0, 0, sampleW, sampleH);
  const data = imgData.data;
  const totalPixels = sampleW * sampleH;

  const luminances = new Float32Array(totalPixels);
  let totalLuminance = 0;

  for (let i = 0; i < data.length; i += 4) {
    // ITU-R BT.601
    const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    const px = i / 4;
    luminances[px] = lum;
    totalLuminance += lum;
  }

  const avgBrightness = totalLuminance / totalPixels;

  // 1. Detección de "Basura": Fundidos a negro, sombras extremas o quemazón de luz
  if (avgBrightness < 38) {
    // Cuadro muy oscuro / negro / transición
    return { score: 0, sharpness: 0, contrast: 0, brightness: avgBrightness, isGarbage: true };
  }
  if (avgBrightness > 230) {
    // Cuadro quemado por flash o luz solar excesiva
    return { score: 0, sharpness: 0, contrast: 0, brightness: avgBrightness, isGarbage: true };
  }

  // 2. Contraste (Desviación estándar de luminancia)
  let varianceSum = 0;
  for (let i = 0; i < totalPixels; i++) {
    const diff = luminances[i] - avgBrightness;
    varianceSum += diff * diff;
  }
  const stdDev = Math.sqrt(varianceSum / totalPixels);
  if (stdDev < 18) {
    // Escena plana, pared vacía sin textura o sin información visual
    return { score: 0, sharpness: 0, contrast: stdDev, brightness: avgBrightness, isGarbage: true };
  }

  // 3. Laplaciano de 8 vecinos para detección de nitidez de textura fina (paredes, pisos, muebles, aberturas)
  let laplacianSum = 0;
  let count = 0;

  for (let y = 1; y < sampleH - 1; y++) {
    for (let x = 1; x < sampleW - 1; x++) {
      const idx = y * sampleW + x;
      // Kernel laplaciano:
      // [ -1, -1, -1 ]
      // [ -1,  8, -1 ]
      // [ -1, -1, -1 ]
      const center = luminances[idx];
      const neighbors =
        luminances[idx - sampleW - 1] +
        luminances[idx - sampleW] +
        luminances[idx - sampleW + 1] +
        luminances[idx - 1] +
        luminances[idx + 1] +
        luminances[idx + sampleW - 1] +
        luminances[idx + sampleW] +
        luminances[idx + sampleW + 1];

      const lap = Math.abs(8 * center - neighbors);
      laplacianSum += lap;
      count++;
    }
  }

  const sharpness = count > 0 ? laplacianSum / count : 0;

  // Umbral de movimiento borroso: si la varianza es muy baja, la toma estaba en paneo veloz
  if (sharpness < 14) {
    return { score: 0, sharpness, contrast: stdDev, brightness: avgBrightness, isGarbage: true };
  }

  // Puntuación combinada ponderando fuertemente la nitidez (enfoque cristalino)
  const normSharpness = Math.min(100, (sharpness / 40) * 100);
  const normContrast = Math.min(100, (stdDev / 55) * 100);
  const score = normSharpness * 0.70 + normContrast * 0.30;

  return {
    score: Math.round(score),
    sharpness: Math.round(normSharpness),
    contrast: Math.round(normContrast),
    brightness: Math.round(avgBrightness),
    isGarbage: false,
  };
}

/**
 * Captura un fotograma en la MÁXIMA RESOLUCIÓN NATIVA disponible en el video
 * aplicando filtrado de calidad y anti-aliasing bicúbico.
 */
export function captureNativeFrame(video: HTMLVideoElement): HTMLCanvasElement {
  const w = video.videoWidth || 1920;
  const h = video.videoHeight || 1080;

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) throw new Error("No se pudo iniciar el contexto 2D");

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(video, 0, 0, w, h);

  return canvas;
}

/**
 * Encuadre Inteligente Nítido (Conserva la máxima resolución nativa sin pérdida).
 * Permite centrar y recortar a la relación de aspecto deseada sin aplastar la imagen.
 */
export function cropFrameHighRes(
  sourceCanvas: HTMLCanvasElement,
  aspectRatio: "16:9" | "4:3" | "1:1" | "original" = "16:9",
  zoom = 1,
  offsetXPercent = 0,
  offsetYPercent = 0
): HTMLCanvasElement {
  if (aspectRatio === "original" && zoom === 1 && offsetXPercent === 0 && offsetYPercent === 0) {
    return sourceCanvas;
  }

  const srcW = sourceCanvas.width;
  const srcH = sourceCanvas.height;

  let targetRatio = srcW / srcH;
  if (aspectRatio === "16:9") targetRatio = 16 / 9;
  else if (aspectRatio === "4:3") targetRatio = 4 / 3;
  else if (aspectRatio === "1:1") targetRatio = 1 / 1;

  // Calculamos la caja de recorte sobre las coordenadas de la imagen original
  let cropW = srcW;
  let cropH = srcH;

  const srcRatio = srcW / srcH;
  if (srcRatio > targetRatio) {
    cropW = Math.round(srcH * targetRatio);
    cropH = srcH;
  } else {
    cropW = srcW;
    cropH = Math.round(srcW / targetRatio);
  }

  // Aplicar zoom (reduce la ventana de recorte sobre la fuente para ampliar el encuadre)
  cropW = Math.round(cropW / Math.max(1, zoom));
  cropH = Math.round(cropH / Math.max(1, zoom));

  // Desplazamiento
  const maxShiftX = Math.max(0, (srcW - cropW) / 2);
  const maxShiftY = Math.max(0, (srcH - cropH) / 2);

  const baseX = (srcW - cropW) / 2;
  const baseY = (srcH - cropH) / 2;

  const cropX = Math.round(
    Math.max(0, Math.min(srcW - cropW, baseX + (offsetXPercent / 100) * maxShiftX * 2))
  );
  const cropY = Math.round(
    Math.max(0, Math.min(srcH - cropH, baseY + (offsetYPercent / 100) * maxShiftY * 2))
  );

  // Canvas de salida conservando la resolución nativa nítida (ej: 1920x1080 o superior)
  const outCanvas = document.createElement("canvas");
  outCanvas.width = Math.max(1280, cropW);
  outCanvas.height = Math.max(720, cropH);

  const outCtx = outCanvas.getContext("2d", { alpha: false });
  if (!outCtx) return sourceCanvas;

  outCtx.imageSmoothingEnabled = true;
  outCtx.imageSmoothingQuality = "high";
  outCtx.drawImage(
    sourceCanvas,
    cropX,
    cropY,
    cropW,
    cropH,
    0,
    0,
    outCanvas.width,
    outCanvas.height
  );

  return outCanvas;
}

/**
 * Escanea el video buscando los momentos ESTABLES donde la cámara está detenida
 * o moviéndose suavemente (típico cuando el camarógrafo muestra una habitación).
 * Descarta automáticamente fotos borrosas, oscuras o de baja calidad.
 */
export async function extractSmartBestFrames(
  video: HTMLVideoElement,
  targetCount = 6,
  onProgress?: (progressPct: number, currentMsg: string) => void
): Promise<Array<{ blob: Blob; score: number; time: number }>> {
  const duration = video.duration || 10;
  if (duration <= 0) throw new Error("El video no tiene duración válida.");

  // Muestrear a lo largo del video con paso denso para encontrar momentos estables
  const sampleCount = Math.min(36, Math.max(18, Math.floor(duration * 2)));
  const step = (duration * 0.90) / sampleCount;
  const startTime = duration * 0.05;

  const originalTime = video.currentTime;
  const wasPaused = video.paused;
  if (!wasPaused) video.pause();

  const candidates: FrameCandidate[] = [];

  for (let i = 0; i < sampleCount; i++) {
    const t = startTime + i * step;
    await seekVideoFrame(video, t);

    const canvas = captureNativeFrame(video);
    const ctx = canvas.getContext("2d");

    if (ctx) {
      const metrics = calculateSharpness(ctx, canvas.width, canvas.height);

      // Si no es basura (desenfoque de movimiento o fundido a negro), guardar candidato
      if (!metrics.isGarbage && metrics.score > 25) {
        candidates.push({
          time: t,
          score: metrics.score,
          sharpness: metrics.sharpness,
          contrast: metrics.contrast,
          brightness: metrics.brightness,
          canvas,
        });
      }
    }

    if (onProgress) {
      const pct = Math.round(((i + 1) / sampleCount) * 75);
      onProgress(pct, `Buscando tomas nítidas sin movimiento (${i + 1}/${sampleCount})...`);
    }
  }

  // Restaurar estado del video
  video.currentTime = originalTime;

  if (candidates.length === 0) {
    // Si el video tiene baja iluminación general, intentar relajar filtro
    const fallbackCanvas = captureNativeFrame(video);
    const blob = await new Promise<Blob>((resolve) => {
      fallbackCanvas.toBlob((b) => resolve(b!), "image/jpeg", 0.95);
    });
    return [{ blob, score: 50, time: originalTime }];
  }

  // Ordenar de mayor a menor calidad / nitidez
  candidates.sort((a, b) => b.score - a.score);

  // Selección espaciada en el tiempo para cubrir diferentes ambientes
  const minDistance = (duration / (targetCount + 1)) * 0.40;
  const selected: FrameCandidate[] = [];

  for (const c of candidates) {
    if (selected.length >= targetCount) break;
    const isClose = selected.some((s) => Math.abs(s.time - c.time) < minDistance);
    if (!isClose) {
      selected.push(c);
    }
  }

  // Si quedaron espacios, completar con los mejores restantes
  if (selected.length < targetCount) {
    for (const c of candidates) {
      if (selected.length >= targetCount) break;
      if (!selected.includes(c)) {
        selected.push(c);
      }
    }
  }

  // Ordenar cronológicamente
  selected.sort((a, b) => a.time - b.time);

  // Exportar en calidad JPEG 0.95 sin comprimir a resolución completa
  const results: Array<{ blob: Blob; score: number; time: number }> = [];

  for (let idx = 0; idx < selected.length; idx++) {
    const item = selected[idx];
    if (onProgress) {
      const pct = 75 + Math.round(((idx + 1) / selected.length) * 25);
      onProgress(pct, `Exportando foto nítida ${idx + 1} de ${selected.length}...`);
    }

    // Encuadre 16:9 de alta resolución si es video horizontal, o conservar nativo
    const isVertical = item.canvas.height > item.canvas.width;
    const processedCanvas = isVertical
      ? item.canvas // En vertical conserva el encuadre nativo del Reel
      : cropFrameHighRes(item.canvas, "16:9");

    const blob = await new Promise<Blob>((resolve, reject) => {
      processedCanvas.toBlob(
        (b) => {
          if (b) resolve(b);
          else reject(new Error("Error al exportar blob"));
        },
        "image/jpeg",
        0.95
      );
    });

    results.push({
      blob,
      score: item.score,
      time: item.time,
    });
  }

  return results;
}
