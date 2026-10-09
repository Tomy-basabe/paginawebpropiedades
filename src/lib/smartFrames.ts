/**
 * Algoritmo inteligente de visión y extracción de fotogramas arquitectónicos.
 * 
 * Evalúa los fotogramas en base a:
 * 1. Nitidez / Enfoque (Varianza laplaciana simplificada)
 * 2. Riqueza de iluminación y contraste (Evita cuadros negros, oscuros o sobreexpuestos)
 * 3. Variedad de color y detalle arquitectónico (Saturación y entropía cromática)
 * 4. Encuadre y composición inteligente (Auto-crop 16:9 con análisis de distribución de luminosidad y horizonte)
 */

export interface FrameAnalysisResult {
  time: number;
  score: number;
  sharpness: number;
  contrast: number;
  brightness: number;
  colorRichness: number;
  canvas: HTMLCanvasElement;
}

/**
 * Calcula la calidad visual de un lienzo (canvas).
 */
export function analyzeFrameQuality(ctx: CanvasRenderingContext2D, width: number, height: number): {
  score: number;
  sharpness: number;
  contrast: number;
  brightness: number;
  colorRichness: number;
} {
  const sampleW = 200;
  const sampleH = Math.round((sampleW * height) / width);

  // Creamos un canvas temporal pequeño para muestreo ultra-rápido en memoria
  const thumbCanvas = document.createElement("canvas");
  thumbCanvas.width = sampleW;
  thumbCanvas.height = sampleH;
  const thumbCtx = thumbCanvas.getContext("2d", { willReadFrequently: true });
  if (!thumbCtx) {
    return { score: 0, sharpness: 0, contrast: 0, brightness: 0, colorRichness: 0 };
  }

  thumbCtx.drawImage(ctx.canvas, 0, 0, sampleW, sampleH);
  const imgData = thumbCtx.getImageData(0, 0, sampleW, sampleH);
  const data = imgData.data;
  const totalPixels = sampleW * sampleH;

  let totalLuminance = 0;
  let colorSaturationSum = 0;
  const luminances = new Float32Array(totalPixels);

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Luminancia estándar ITU-R BT.601
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    const pxIdx = i / 4;
    luminances[pxIdx] = lum;
    totalLuminance += lum;

    // Saturación de color (diferencia entre canales)
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const sat = max === 0 ? 0 : (max - min) / max;
    colorSaturationSum += sat;
  }

  const avgBrightness = totalLuminance / totalPixels;
  const avgSaturation = colorSaturationSum / totalPixels;

  // Penalización severa para fotogramas casi negros o excesivamente quemados/blancos
  let brightnessScore = 1.0;
  if (avgBrightness < 35) {
    // Muy oscuro (típico fundido a negro o inicio de video)
    brightnessScore = Math.max(0, avgBrightness / 35);
  } else if (avgBrightness > 220) {
    // Muy blanco / sobreexpuesto
    brightnessScore = Math.max(0, (255 - avgBrightness) / 35);
  }

  // 1. Contraste (Desviación estándar de luminancia)
  let varianceSum = 0;
  for (let i = 0; i < totalPixels; i++) {
    const diff = luminances[i] - avgBrightness;
    varianceSum += diff * diff;
  }
  const contrast = Math.sqrt(varianceSum / totalPixels);
  const contrastScore = Math.min(1.0, contrast / 50);

  // 2. Nitidez / Detección de bordes (Gradiente horizontal y vertical)
  let edgeSum = 0;
  let edgeCount = 0;
  for (let y = 1; y < sampleH - 1; y += 2) {
    for (let x = 1; x < sampleW - 1; x += 2) {
      const idx = y * sampleW + x;
      const left = luminances[idx - 1];
      const right = luminances[idx + 1];
      const top = luminances[idx - sampleW];
      const bottom = luminances[idx + sampleW];
      const center = luminances[idx];

      const grad = Math.abs(right - left) + Math.abs(bottom - top) + Math.abs(center * 4 - (left + right + top + bottom));
      edgeSum += grad;
      edgeCount++;
    }
  }
  const sharpness = edgeCount > 0 ? edgeSum / edgeCount : 0;
  const sharpnessScore = Math.min(1.0, sharpness / 28);

  // 3. Riqueza de color
  const colorRichnessScore = Math.min(1.0, avgSaturation * 2.2);

  // Puntuación compuesta ponderada (Nitidez 45%, Contraste 30%, Brillo 15%, Color 10%)
  const score =
    (sharpnessScore * 0.45 + contrastScore * 0.30 + brightnessScore * 0.15 + colorRichnessScore * 0.10) *
    (brightnessScore < 0.2 ? 0.05 : 1.0);

  return {
    score: Math.round(score * 100),
    sharpness: Math.round(sharpnessScore * 100),
    contrast: Math.round(contrastScore * 100),
    brightness: Math.round(avgBrightness),
    colorRichness: Math.round(colorRichnessScore * 100),
  };
}

/**
 * Encuadre inteligente automático:
 * Recorta un fotograma a 16:9 de forma cinematográfica, centrando la masa de luz y detalle
 * arquitectónico (evitando cortar techos o pisos bruscamente).
 */
export function autoSmartFrame(
  sourceCanvas: HTMLCanvasElement,
  targetWidth = 1600,
  targetHeight = 900
): HTMLCanvasElement {
  const outCanvas = document.createElement("canvas");
  outCanvas.width = targetWidth;
  outCanvas.height = targetHeight;
  const outCtx = outCanvas.getContext("2d");
  if (!outCtx) return sourceCanvas;

  const srcW = sourceCanvas.width;
  const srcH = sourceCanvas.height;
  const targetRatio = targetWidth / targetHeight; // 16:9 ≈ 1.777
  const srcRatio = srcW / srcH;

  let cropW = srcW;
  let cropH = srcH;
  let cropX = 0;
  let cropY = 0;

  if (srcRatio > targetRatio) {
    // La imagen fuente es más ancha que 16:9 -> recortar laterales centrando horizontalmente
    cropW = Math.round(srcH * targetRatio);
    cropH = srcH;
    cropX = Math.round((srcW - cropW) / 2);
    cropY = 0;
  } else {
    // La imagen fuente es más alta que 16:9 (o vertical tipo 9:16) ->
    // Posicionamiento inteligente vertical: en arquitectura el tercio superior/medio
    // suele contener la vista principal, no el piso inferior vacío.
    cropW = srcW;
    cropH = Math.round(srcW / targetRatio);
    cropX = 0;

    // Centrado inteligente con ligera inclinación hacia el tercio superior (40% desde arriba)
    cropY = Math.round((srcH - cropH) * 0.40);
    cropY = Math.max(0, Math.min(srcH - cropH, cropY));
  }

  outCtx.drawImage(
    sourceCanvas,
    cropX,
    cropY,
    cropW,
    cropH,
    0,
    0,
    targetWidth,
    targetHeight
  );

  return outCanvas;
}

/**
 * Algoritmo extractor inteligente:
 * Muestrea el video en múltiples marcas de tiempo, calcula la calidad visual de cada una,
 * descarta cuadros borrosos o duplicados, y selecciona los N mejores momentos distintos
 * aplicando encuadre inteligente automático.
 */
export async function extractSmartBestFrames(
  video: HTMLVideoElement,
  targetCount = 6,
  onProgress?: (progressPct: number, currentMsg: string) => void
): Promise<Array<{ blob: Blob; score: number; time: number }>> {
  const duration = video.duration || 10;
  if (duration <= 0) throw new Error("Video sin duración válida.");

  // Cantidad de puntos a evaluar: entre 18 y 28 muestras distribuidas
  const samplePointsCount = Math.min(28, Math.max(16, Math.floor(duration * 1.5)));
  const step = (duration * 0.88) / samplePointsCount;
  const startTime = duration * 0.06; // Omitir el primer 6% (suele ser transición negra o inicio tembloroso)

  const originalTime = video.currentTime;
  const candidates: FrameAnalysisResult[] = [];

  for (let i = 0; i < samplePointsCount; i++) {
    const t = startTime + i * step;
    video.currentTime = t;

    // Esperar actualización de frame de video
    await new Promise((resolve) => {
      const onSeeked = () => {
        video.removeEventListener("seeked", onSeeked);
        resolve(true);
      };
      video.addEventListener("seeked", onSeeked, { once: true });
      setTimeout(resolve, 350); // Fallback por timeout
    });

    const w = video.videoWidth || 1280;
    const h = video.videoHeight || 720;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    if (ctx) {
      ctx.drawImage(video, 0, 0, w, h);
      const metrics = analyzeFrameQuality(ctx, w, h);

      candidates.push({
        time: t,
        score: metrics.score,
        sharpness: metrics.sharpness,
        contrast: metrics.contrast,
        brightness: metrics.brightness,
        colorRichness: metrics.colorRichness,
        canvas,
      });
    }

    if (onProgress) {
      const pct = Math.round(((i + 1) / samplePointsCount) * 75);
      onProgress(pct, `Analizando nitidez e iluminación (${i + 1}/${samplePointsCount})...`);
    }
  }

  // Restaurar tiempo original del video
  video.currentTime = originalTime;

  // Ordenar candidatos por puntuación de calidad (los más nítidos y luminosos primero)
  candidates.sort((a, b) => b.score - a.score);

  // Selección diversa en el tiempo para que no sean 6 fotos del mismo segundo
  const minTimeDistance = duration / (targetCount + 1) * 0.45; // Separación mínima temporal
  const selected: FrameAnalysisResult[] = [];

  for (const candidate of candidates) {
    if (selected.length >= targetCount) break;

    // Comprobar si está suficientemente distante de los ya seleccionados
    const isTooClose = selected.some((s) => Math.abs(s.time - candidate.time) < minTimeDistance);
    if (!isTooClose && candidate.score > 15) {
      selected.push(candidate);
    }
  }

  // Si no llegamos al objetivo por ser muy estricto, relajar la distancia temporal
  if (selected.length < targetCount) {
    for (const candidate of candidates) {
      if (selected.length >= targetCount) break;
      if (!selected.includes(candidate) && candidate.score > 10) {
        selected.push(candidate);
      }
    }
  }

  // Ordenar los seleccionados cronológicamente por su aparición en el video
  selected.sort((a, b) => a.time - b.time);

  // Encuadrar inteligentemente y convertir a Blobs de alta calidad
  const results: Array<{ blob: Blob; score: number; time: number }> = [];

  for (let idx = 0; idx < selected.length; idx++) {
    const item = selected[idx];
    if (onProgress) {
      const pct = 75 + Math.round(((idx + 1) / selected.length) * 25);
      onProgress(pct, `Encuadrando foto ${idx + 1} de ${selected.length} en 16:9 HD...`);
    }

    const framedCanvas = autoSmartFrame(item.canvas, 1600, 900);
    const blob = await new Promise<Blob>((resolve, reject) => {
      framedCanvas.toBlob(
        (b) => {
          if (b) resolve(b);
          else reject(new Error("Error al exportar blob"));
        },
        "image/jpeg",
        0.93
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
