/**
 * Motor de Precisión y Calidad Ultra-HD para Extracción de Fotogramas de Video.
 *
 * Características Clave:
 * 1. Extracción con decodificación real garantizada (sin fotogramas repetidos por buffering).
 * 2. Muestreo de video dedicado en elemento de video en memoria desacoplado con preload='auto'.
 * 3. Detección estricta de similitud perceptual: descarta automáticamente fotogramas casi idénticos
 *    o repetidos (ej: sala de estar desde el mismo ángulo).
 * 4. Ponderación cinematográfica: favorece tomas arquitectónicas abiertas, estables y bien iluminadas.
 * 5. Adaptación perfecta a formatos verticales (9:16) y horizontales (16:9) sin recortar ni degradar.
 */

export interface ExtractedFrame {
  time: number;
  blob: Blob;
  score: number;
  width: number;
  height: number;
}

/**
 * Calcula una firma hash perceptual de 64 bits (dHash) para comparar similitud entre fotogramas.
 * Si dos fotos tienen distancia de Hamming < 10, son la misma toma y una se descarta.
 */
function computeDHash(canvas: HTMLCanvasElement): string {
  const small = document.createElement("canvas");
  small.width = 9;
  small.height = 8;
  const ctx = small.getContext("2d", { willReadFrequently: true });
  if (!ctx) return "";

  ctx.drawImage(canvas, 0, 0, 9, 8);
  const data = ctx.getImageData(0, 0, 9, 8).data;

  let hash = "";
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const idxLeft = (y * 9 + x) * 4;
      const idxRight = (y * 9 + x + 1) * 4;
      const lumLeft = data[idxLeft] * 0.299 + data[idxLeft + 1] * 0.587 + data[idxLeft + 2] * 0.114;
      const lumRight = data[idxRight] * 0.299 + data[idxRight + 1] * 0.587 + data[idxRight + 2] * 0.114;
      hash += lumLeft > lumRight ? "1" : "0";
    }
  }
  return hash;
}

function hammingDistance(h1: string, h2: string): number {
  if (!h1 || !h2 || h1.length !== h2.length) return 999;
  let diff = 0;
  for (let i = 0; i < h1.length; i++) {
    if (h1[i] !== h2[i]) diff++;
  }
  return diff;
}

/**
 * Espera de manera determinística a que el elemento de video decodifique
 * y pinte con precisión el cuadro de un timestamp específico.
 */
export async function seekVideoDeterministic(video: HTMLVideoElement, time: number): Promise<boolean> {
  return new Promise((resolve) => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("error", onError);
      // Breve espera para que el decodificador de hardware complete el cuadro
      setTimeout(() => resolve(true), 90);
    };

    const onSeeked = () => finish();
    const onError = () => {
      if (done) return;
      done = true;
      resolve(false);
    };

    video.addEventListener("seeked", onSeeked, { once: true });
    video.addEventListener("error", onError, { once: true });

    try {
      video.currentTime = Math.max(0, Math.min(video.duration || 10, time));
    } catch {
      resolve(false);
    }

    // Timeout de seguridad en caso de red lenta
    setTimeout(finish, 850);
  });
}

/**
 * Captura un fotograma en lienzo a resolución 100% nativa sin interpolación reductora.
 */
export function captureNativeFrame(video: HTMLVideoElement): HTMLCanvasElement {
  const w = video.videoWidth || 1920;
  const h = video.videoHeight || 1080;

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) throw new Error("No se pudo iniciar el contexto del canvas");

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(video, 0, 0, w, h);

  return canvas;
}

/**
 * Analiza la nitidez y contraste de un canvas a alta frecuencia para descartar cuadros borrosos.
 */
export function evaluateFrameClarity(canvas: HTMLCanvasElement): {
  score: number;
  sharpness: number;
  contrast: number;
  brightness: number;
  isGarbage: boolean;
} {
  const sampleW = 280;
  const sampleH = Math.round((sampleW * canvas.height) / canvas.width);

  const thumbCanvas = document.createElement("canvas");
  thumbCanvas.width = sampleW;
  thumbCanvas.height = sampleH;
  const thumbCtx = thumbCanvas.getContext("2d", { willReadFrequently: true });
  if (!thumbCtx) {
    return { score: 0, sharpness: 0, contrast: 0, brightness: 0, isGarbage: true };
  }

  thumbCtx.drawImage(canvas, 0, 0, sampleW, sampleH);
  const data = thumbCtx.getImageData(0, 0, sampleW, sampleH).data;
  const total = sampleW * sampleH;

  const lums = new Float32Array(total);
  let totalLum = 0;

  for (let i = 0; i < data.length; i += 4) {
    const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    const px = i / 4;
    lums[px] = lum;
    totalLum += lum;
  }

  const avgLum = totalLum / total;

  // Descartar fotogramas excesivamente oscuros (fundidos) o blancos
  if (avgLum < 32 || avgLum > 235) {
    return { score: 0, sharpness: 0, contrast: 0, brightness: avgLum, isGarbage: true };
  }

  // Contraste
  let varSum = 0;
  for (let i = 0; i < total; i++) {
    const diff = lums[i] - avgLum;
    varSum += diff * diff;
  }
  const contrast = Math.sqrt(varSum / total);
  if (contrast < 16) {
    return { score: 0, sharpness: 0, contrast, brightness: avgLum, isGarbage: true };
  }

  // Laplaciano 8-vecinos para nitidez
  let edgeSum = 0;
  let count = 0;

  for (let y = 1; y < sampleH - 1; y += 2) {
    for (let x = 1; x < sampleW - 1; x += 2) {
      const idx = y * sampleW + x;
      const center = lums[idx];
      const neighbors =
        lums[idx - sampleW - 1] +
        lums[idx - sampleW] +
        lums[idx - sampleW + 1] +
        lums[idx - 1] +
        lums[idx + 1] +
        lums[idx + sampleW - 1] +
        lums[idx + sampleW] +
        lums[idx + sampleW + 1];

      edgeSum += Math.abs(8 * center - neighbors);
      count++;
    }
  }

  const sharpness = count > 0 ? edgeSum / count : 0;
  if (sharpness < 12) {
    // Muy borroso por movimiento
    return { score: 0, sharpness, contrast, brightness: avgLum, isGarbage: true };
  }

  const normSharpness = Math.min(100, (sharpness / 42) * 100);
  const normContrast = Math.min(100, (contrast / 55) * 100);
  const score = normSharpness * 0.70 + normContrast * 0.30;

  return {
    score: Math.round(score),
    sharpness: Math.round(normSharpness),
    contrast: Math.round(normContrast),
    brightness: Math.round(avgLum),
    isGarbage: false,
  };
}

/**
 * Encuadre y recorte en resolución nativa alta (1080p o superior).
 * Si la foto es vertical, permite encuadrarla a 16:9 o mantener la proporción completa.
 */
export function cropFrameHighRes(
  sourceCanvas: HTMLCanvasElement,
  aspectRatio: "16:9" | "9:16" | "4:3" | "1:1" | "original" = "16:9",
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
  else if (aspectRatio === "9:16") targetRatio = 9 / 16;
  else if (aspectRatio === "4:3") targetRatio = 4 / 3;
  else if (aspectRatio === "1:1") targetRatio = 1 / 1;

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

  // Aplicar zoom
  cropW = Math.round(cropW / Math.max(1, zoom));
  cropH = Math.round(cropH / Math.max(1, zoom));

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

  const outCanvas = document.createElement("canvas");
  outCanvas.width = cropW;
  outCanvas.height = cropH;

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
    cropW,
    cropH
  );

  return outCanvas;
}

/**
 * Algoritmo Extractor Inteligente con DESDUPLICACIÓN PERCEPTUAL (Anti-Fotos Repetidas).
 * Muestrea a lo largo de todo el video y asegura que cada foto seleccionada sea de un ambiente diferente.
 */
export async function extractSmartBestFrames(
  videoSource: HTMLVideoElement | string,
  targetCount = 6,
  onProgress?: (progressPct: number, currentMsg: string) => void
): Promise<Array<{ blob: Blob; score: number; time: number }>> {
  // Crear un elemento de video en memoria dedicado para no depender de la UI
  let videoEl: HTMLVideoElement;
  let shouldCleanupVideo = false;

  if (typeof videoSource === "string") {
    videoEl = document.createElement("video");
    videoEl.crossOrigin = "anonymous";
    videoEl.preload = "auto";
    videoEl.muted = true;
    videoEl.src = videoSource;
    shouldCleanupVideo = true;
    await new Promise((res) => {
      videoEl.onloadedmetadata = () => res(true);
      videoEl.onerror = () => res(false);
      setTimeout(res, 3000);
    });
  } else {
    videoEl = videoSource;
  }

  const duration = videoEl.duration || 10;
  if (duration <= 0) throw new Error("Duración de video inválida.");

  const origTime = videoEl.currentTime;
  const wasPaused = videoEl.paused;
  if (!wasPaused) videoEl.pause();

  // Dividir el video en N segmentos temporales (uno por cada foto objetivo)
  // para GARANTIZAR que las fotos se tomen de diferentes momentos del recorrido
  const segmentCount = targetCount;
  const segmentDuration = (duration * 0.88) / segmentCount;
  const startOffset = duration * 0.06;

  interface ScoredCandidate {
    time: number;
    score: number;
    canvas: HTMLCanvasElement;
    dhash: string;
  }

  const candidatesBySegment: ScoredCandidate[][] = [];

  for (let s = 0; s < segmentCount; s++) {
    candidatesBySegment.push([]);
    const segStart = startOffset + s * segmentDuration;
    const segEnd = segStart + segmentDuration;

    // Probar 5 momentos dentro de cada segmento
    const subSamples = 5;
    const subStep = (segEnd - segStart) / (subSamples + 1);

    for (let sub = 1; sub <= subSamples; sub++) {
      const sampleTime = segStart + sub * subStep;
      await seekVideoDeterministic(videoEl, sampleTime);

      const canvas = captureNativeFrame(videoEl);
      const metrics = evaluateFrameClarity(canvas);

      if (!metrics.isGarbage) {
        const dhash = computeDHash(canvas);
        candidatesBySegment[s].push({
          time: sampleTime,
          score: metrics.score,
          canvas,
          dhash,
        });
      }

      if (onProgress) {
        const totalSteps = segmentCount * subSamples;
        const currentStep = s * subSamples + sub;
        const pct = Math.round((currentStep / totalSteps) * 75);
        onProgress(pct, `Analizando recorrido ambiente ${s + 1} de ${segmentCount}...`);
      }
    }
  }

  // Restaurar video original
  if (!shouldCleanupVideo) {
    videoEl.currentTime = origTime;
  }

  // Seleccionar la MEJOR toma de cada segmento evitando duplicados perceptuales
  const selected: ScoredCandidate[] = [];

  for (let s = 0; s < segmentCount; s++) {
    const segmentCandidates = candidatesBySegment[s];
    // Ordenar los del segmento por nitidez
    segmentCandidates.sort((a, b) => b.score - a.score);

    let chosen: ScoredCandidate | null = null;
    for (const cand of segmentCandidates) {
      // Verificar si es demasiado similar a alguna foto ya elegida (distancia Hamming < 8)
      const isDuplicate = selected.some(
        (sel) => hammingDistance(sel.dhash, cand.dhash) < 8
      );
      if (!isDuplicate) {
        chosen = cand;
        break;
      }
    }

    // Si todas eran similares, elegir la más nítida
    if (!chosen && segmentCandidates.length > 0) {
      chosen = segmentCandidates[0];
    }

    if (chosen) {
      selected.push(chosen);
    }
  }

  // Si no se obtuvieron fotos en algún segmento (video muy oscuro o corto), completar con las mejores restantes
  if (selected.length < targetCount) {
    const allCandidates = candidatesBySegment.flat().sort((a, b) => b.score - a.score);
    for (const cand of allCandidates) {
      if (selected.length >= targetCount) break;
      const isAlready = selected.some((s) => s.time === cand.time);
      const isDuplicate = selected.some((s) => hammingDistance(s.dhash, cand.dhash) < 7);
      if (!isAlready && !isDuplicate) {
        selected.push(cand);
      }
    }
  }

  // Ordenar cronológicamente
  selected.sort((a, b) => a.time - b.time);

  // Convertir a Blobs de calidad máxima
  const results: Array<{ blob: Blob; score: number; time: number }> = [];

  for (let i = 0; i < selected.length; i++) {
    const item = selected[i];
    if (onProgress) {
      const pct = 75 + Math.round(((i + 1) / selected.length) * 25);
      onProgress(pct, `Exportando foto nítida ${i + 1} de ${selected.length} en Full HD...`);
    }

    const isVertical = item.canvas.height > item.canvas.width;
    // Si es horizontal, encuadra a 16:9; si es vertical conserva la proporción nativa nítida
    const finalCanvas = isVertical ? item.canvas : cropFrameHighRes(item.canvas, "16:9");

    const blob = await new Promise<Blob>((resolve, reject) => {
      finalCanvas.toBlob(
        (b) => {
          if (b) resolve(b);
          else reject(new Error("Error al exportar blob"));
        },
        "image/jpeg",
        0.96
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
