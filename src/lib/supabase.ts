import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mjxywapawhtcrdenslma.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qeHl3YXBhd2h0Y3JkZW5zbG1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1NjkxMzIsImV4cCI6MjEwNjE0NTEzMn0.zsAjbOkIGUA4i7EPgS_cuABoHGRMsqSbHh-jts5ce1Q";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Sube una imagen (File o Blob o base64 Data URL) al bucket 'property-images' de Supabase
 * y retorna la URL pública del CDN.
 */
export async function uploadPropertyImage(file: File | Blob, customName?: string): Promise<string> {
  try {
    const mime = file.type || "image/jpeg";
    const ext = mime.includes("/") ? mime.split("/")[1].replace("jpeg", "jpg") : "jpg";
    const fileName = customName || `prop-${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`;
    const filePath = `properties/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("property-images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
        contentType: mime,
      });

    if (uploadError) {
      console.warn("Aviso al subir imagen a Supabase Storage:", uploadError.message);
      throw uploadError;
    }

    const { data: publicUrlData } = supabase.storage
      .from("property-images")
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  } catch (err) {
    console.error("Fallo al subir a Supabase Storage, usando fallback:", err);
    throw err;
  }
}

/**
 * Comprime un video en el browser usando Canvas + MediaRecorder con codec WebM/VP8 o VP9.
 * Detecta orientación horizontal vs vertical (Reels móviles) para mantener máxima nitidez
 * sin exceder peso excesivo.
 * onProgress(0–100) se llama durante la compresión.
 */
export async function compressVideoInBrowser(
  file: File,
  onProgress?: (pct: number) => void
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    // Verificar soporte de MediaRecorder con WebM
    const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
      ? "video/webm;codecs=vp9"
      : MediaRecorder.isTypeSupported("video/webm;codecs=vp8")
      ? "video/webm;codecs=vp8"
      : "video/webm";

    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";

    const objectUrl = URL.createObjectURL(file);
    video.src = objectUrl;

    video.onloadedmetadata = () => {
      const isVertical = video.videoHeight > video.videoWidth;

      // Límites óptimos según orientación:
      // Vertical (Reels móviles): max 720x1280 (HD vertical nítido)
      // Horizontal: max 1280x720 (HD widescreen nítido)
      const MAX_W = isVertical ? 720 : 1280;
      const MAX_H = isVertical ? 1280 : 720;

      const ratio = Math.min(
        MAX_W / video.videoWidth,
        MAX_H / video.videoHeight,
        1 // No ampliar si ya es más pequeño
      );
      const w = Math.round((video.videoWidth * ratio) / 2) * 2;
      const h = Math.round((video.videoHeight * ratio) / 2) * 2;

      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d")!;

      // Bitrate adaptativo optimizado: 2.8 Mbps para nitidez cristalina en detalles de inmuebles
      const pixels = w * h;
      const bitsPerSecond = pixels >= 1280 * 720 ? 2_800_000 : pixels >= 854 * 480 ? 1_800_000 : 1_200_000;

      const stream = canvas.captureStream(30);

      // Añadir pista de audio si existe
      try {
        // @ts-ignore - capturar audio del elemento video si el browser lo soporta
        const audioCtx = new AudioContext();
        const source = audioCtx.createMediaElementSource(video);
        const dest = audioCtx.createMediaStreamDestination();
        source.connect(dest);
        source.connect(audioCtx.destination);
        dest.stream.getAudioTracks().forEach((t) => stream.addTrack(t));
      } catch {
        // Sin audio o no soportado — continuar sin él
      }

      const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: bitsPerSecond });
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        URL.revokeObjectURL(objectUrl);
        const compressed = new Blob(chunks, { type: mimeType });
        resolve(compressed);
      };

      recorder.onerror = (e) => {
        URL.revokeObjectURL(objectUrl);
        reject(e);
      };

      recorder.start(200); // chunk cada 200ms

      const duration = video.duration;
      let lastTime = -1;

      const drawFrame = () => {
        if (video.ended || video.paused) {
          recorder.stop();
          return;
        }
        if (video.currentTime !== lastTime) {
          ctx.drawImage(video, 0, 0, w, h);
          lastTime = video.currentTime;
          if (onProgress && duration > 0) {
            onProgress(Math.round((video.currentTime / duration) * 100));
          }
        }
        requestAnimationFrame(drawFrame);
      };

      video.onended = () => {
        recorder.stop();
        onProgress?.(100);
      };

      video.play().then(() => {
        requestAnimationFrame(drawFrame);
      }).catch(reject);
    };

    video.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("No se pudo cargar el video para comprimir."));
    };
  });
}

/**
 * Sube un video al bucket 'property-videos' de Supabase con compresión previa en browser.
 * Retorna la URL pública del CDN.
 */
export async function uploadPropertyVideo(
  file: File,
  onProgress?: (pct: number) => void,
  onStatus?: (status: string) => void
): Promise<string> {
  let blobToUpload: Blob = file;
  let ext = "webm";

  // Intentar crear el bucket si no existe (operación idempotente, falla silenciosamente si ya existe)
  await supabase.storage.createBucket("property-videos", {
    public: true,
    allowedMimeTypes: ["video/mp4", "video/webm", "video/ogg", "video/quicktime", "video/avi", "video/*"],
    fileSizeLimit: 524288000, // 500 MB max
  }).catch(() => { /* ya existe, ignorar */ });

  try {
    onStatus?.("Comprimiendo video...");
    // Comprimir si el video es grande (>10MB) o si MediaRecorder está disponible
    if (typeof MediaRecorder !== "undefined" && file.size > 1_000_000) {
      const compressed = await compressVideoInBrowser(file, onProgress);
      // Solo usar comprimido si realmente bajó de peso
      if (compressed.size < file.size) {
        blobToUpload = compressed;
        ext = "webm";
        console.log(
          `Video comprimido: ${(file.size / 1024 / 1024).toFixed(1)}MB → ${(compressed.size / 1024 / 1024).toFixed(1)}MB`
        );
      } else {
        // Si comprimido es mayor (raro), subir el original
        blobToUpload = file;
        ext = file.name.split(".").pop() || "mp4";
      }
    } else {
      ext = file.name.split(".").pop() || "mp4";
    }
  } catch (compressionErr) {
    console.warn("Compresión falló, subiendo original:", compressionErr);
    blobToUpload = file;
    ext = file.name.split(".").pop() || "mp4";
  }

  onStatus?.("Subiendo video a la nube...");
  onProgress?.(0);

  const fileName = `video-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
  const filePath = `tours/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("property-videos")
    .upload(filePath, blobToUpload, {
      cacheControl: "3600",
      upsert: true,
      contentType: blobToUpload.type || `video/${ext}`,
    });

  if (uploadError) {
    console.error("Error al subir video a Supabase:", uploadError.message);
    throw new Error(`Error al subir video: ${uploadError.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from("property-videos")
    .getPublicUrl(filePath);

  onProgress?.(100);
  onStatus?.("¡Video subido con éxito!");

  return publicUrlData.publicUrl;
}
