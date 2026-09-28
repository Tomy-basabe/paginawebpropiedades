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
    const ext = file.type.split("/")[1] || "jpg";
    const fileName = customName || `prop-${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`;
    const filePath = `properties/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("property-images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
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
