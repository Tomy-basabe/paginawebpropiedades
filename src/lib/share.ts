import { Property } from "./types";
import { formatCurrencyPrice } from "./formatters";

export interface ShareDataResult {
  url: string;
  title: string;
  text: string;
  whatsappUrl: string;
}

/**
 * Mensaje profesional y estructurado para compartir el sitio web oficial 99propiedades.com.ar
 */
export function getSiteShareData(): ShareDataResult {
  const url = "https://99propiedades.com.ar";
  const title = "99 Propiedades | Inmobiliaria en Santa Cruz";
  const text = `🏛️ *99 Propiedades | Servicios Inmobiliarios en Santa Cruz*

Te comparto el sitio oficial de 99 Propiedades. Acá podés ver el catálogo exclusivo de casas, departamentos, terrenos y desarrollos con video tours en alta definición y tasaciones profesionales:

👉 https://99propiedades.com.ar

Asesoramiento integral y créditos hipotecarios UVA con Juan Pablo Pino.`;

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;

  return { url, title, text, whatsappUrl };
}

/**
 * Mensaje profesional y estructurado para compartir una propiedad específica
 */
export function getPropertyShareData(property: Property): ShareDataResult {
  const url = `https://99propiedades.com.ar/propiedades/${property.id}`;
  const priceFormatted = formatCurrencyPrice(property.price, property.currency);
  const location = [property.location?.neighborhood, property.location?.city || "Santa Cruz"]
    .filter(Boolean)
    .join(", ");

  const operationText =
    property.operation === "alquiler"
      ? "En Alquiler"
      : property.operation === "pozo"
      ? "En Pozo / Preventa"
      : "En Venta";

  const area = property.features?.totalArea || property.features?.coveredArea;
  const areaText = area ? `📐 *Superficie:* ${area} m²\n` : "";
  const roomsText = property.features?.bedrooms ? `🛏️ *Dormitorios:* ${property.features.bedrooms}\n` : "";

  const text = `🏡 *99 Propiedades | ${property.title}*
🏷️ *Operación:* ${operationText}
📍 *Ubicación:* ${location}
💰 *Valor:* ${priceFormatted}
${roomsText}${areaText}
👉 *Mirá el recorrido en video y fotos en alta calidad:*
${url}

Asesoramiento personalizado con Juan Pablo Pino.`;

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;

  return {
    url,
    title: `99 Propiedades - ${property.title}`,
    text,
    whatsappUrl,
  };
}

/**
 * Disparador unificado de compartir (intenta Web Share API nativo del dispositivo y fallback a copiar texto)
 */
export async function shareContent(data: ShareDataResult): Promise<"shared" | "copied"> {
  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share({
        title: data.title,
        text: data.text,
        url: data.url,
      });
      return "shared";
    } catch (err: any) {
      if (err.name === "AbortError") return "shared";
    }
  }

  // Fallback a copiar al portapapeles
  if (typeof navigator !== "undefined" && navigator.clipboard) {
    await navigator.clipboard.writeText(data.text);
    return "copied";
  }

  return "copied";
}
