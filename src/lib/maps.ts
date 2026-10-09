// Utilidades para integración de Google Maps y autocompletado de ubicaciones

export interface ParsedLocationData {
  address: string;
  neighborhood: string;
  city: string;
  zone: string;
  googleMapsUrl: string;
  embedUrl: string;
}

/**
 * Genera la URL para iframe embed de Google Maps a partir de datos de ubicación o links.
 */
export function getGoogleMapsEmbedUrl(location?: {
  address?: string;
  city?: string;
  neighborhood?: string;
  zone?: string;
  googleMapsUrl?: string;
}): string {
  if (!location) return "";

  const customUrl = (location.googleMapsUrl || "").trim();

  // 1. Si es un iframe HTML, extraer el src
  if (customUrl.includes("<iframe")) {
    const match = customUrl.match(/src=["']([^"']+)["']/i);
    if (match && match[1]) {
      return match[1];
    }
  }

  // 2. Si ya es una URL de embed directa
  if (customUrl.includes("output=embed") || customUrl.includes("maps/embed")) {
    return customUrl;
  }

  // 3. Si contiene coordenadas explícitas @lat,lng
  if (customUrl) {
    const coordMatch = customUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (coordMatch) {
      const lat = coordMatch[1];
      const lng = coordMatch[2];
      return `https://maps.google.com/maps?q=${lat},${lng}&t=&z=16&ie=UTF8&iwloc=&output=embed`;
    }

    // 4. Si contiene /place/Nombre+Direccion/...
    const placeMatch = customUrl.match(/\/place\/([^/@?]+)/);
    if (placeMatch) {
      const decoded = decodeURIComponent(placeMatch[1].replace(/\+/g, " "));
      return `https://maps.google.com/maps?q=${encodeURIComponent(decoded)}&t=&z=16&ie=UTF8&iwloc=&output=embed`;
    }

    // 5. Si contiene q=...
    const qMatch = customUrl.match(/[?&]q=([^&]+)/);
    if (qMatch) {
      const decodedQ = decodeURIComponent(qMatch[1].replace(/\+/g, " "));
      return `https://maps.google.com/maps?q=${encodeURIComponent(decodedQ)}&t=&z=16&ie=UTF8&iwloc=&output=embed`;
    }

    // 6. Si no es un link http, usar como consulta directa
    if (!customUrl.startsWith("http://") && !customUrl.startsWith("https://")) {
      return `https://maps.google.com/maps?q=${encodeURIComponent(customUrl)}&t=&z=16&ie=UTF8&iwloc=&output=embed`;
    }
  }

  // 7. Fallback combinando dirección, barrio, ciudad y zona
  const fallbackQuery = [
    location.address,
    location.neighborhood,
    location.city,
    location.zone || "Argentina",
  ]
    .filter(Boolean)
    .join(", ");

  if (fallbackQuery) {
    return `https://maps.google.com/maps?q=${encodeURIComponent(fallbackQuery)}&t=&z=16&ie=UTF8&iwloc=&output=embed`;
  }

  return "";
}

/**
 * Devuelve un enlace para abrir la ubicación en Google Maps en una pestaña nueva.
 */
export function getGoogleMapsExternalLink(location?: {
  address?: string;
  city?: string;
  neighborhood?: string;
  zone?: string;
  googleMapsUrl?: string;
}): string {
  if (!location) return "https://maps.google.com";

  const customUrl = (location.googleMapsUrl || "").trim();

  // Si es un iframe HTML, extraer el src
  if (customUrl.includes("<iframe")) {
    const match = customUrl.match(/src=["']([^"']+)["']/i);
    if (match && match[1]) return match[1];
  }

  // Si ya es un enlace web válido
  if (customUrl.startsWith("http://") || customUrl.startsWith("https://")) {
    return customUrl;
  }

  const query = [
    customUrl || location.address,
    location.neighborhood,
    location.city,
    location.zone || "Argentina",
  ]
    .filter(Boolean)
    .join(", ");

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/**
 * Procesa una dirección o enlace de Google Maps y autocompleta los campos de ubicación.
 */
export async function parseAndGeocodeLocation(rawInput: string): Promise<ParsedLocationData> {
  const cleanInput = rawInput.trim();
  let extractedUrl = cleanInput;

  // Si viene dentro de un <iframe>
  if (cleanInput.includes("<iframe")) {
    const match = cleanInput.match(/src=["']([^"']+)["']/i);
    if (match && match[1]) {
      extractedUrl = match[1];
    }
  }

  let textToParse = cleanInput;
  let lat: number | null = null;
  let lng: number | null = null;

  // 1. Extraer coordenadas si están en la URL
  const coordMatch = extractedUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (coordMatch) {
    lat = parseFloat(coordMatch[1]);
    lng = parseFloat(coordMatch[2]);
  } else {
    const qCoordMatch = extractedUrl.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (qCoordMatch) {
      lat = parseFloat(qCoordMatch[1]);
      lng = parseFloat(qCoordMatch[2]);
    }
  }

  // 2. Extraer texto de lugar de la URL si existe
  const placeMatch = extractedUrl.match(/\/place\/([^/@?]+)/);
  if (placeMatch) {
    textToParse = decodeURIComponent(placeMatch[1].replace(/\+/g, " "));
  } else {
    const qMatch = extractedUrl.match(/[?&]q=([^&]+)/);
    if (qMatch && !lat) {
      textToParse = decodeURIComponent(qMatch[1].replace(/\+/g, " "));
    }
  }

  if (textToParse.startsWith("http://") || textToParse.startsWith("https://")) {
    textToParse = "";
  }

  let address = "";
  let neighborhood = "";
  let city = "";
  let zone = "";

  // 3. Geocodificación inteligente asistida (OpenStreetMap Nominatim, gratis y rápido)
  try {
    let nominatimUrl = "";
    if (lat !== null && lng !== null) {
      nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`;
    } else if (textToParse) {
      nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(textToParse)}&addressdetails=1&limit=1`;
    }

    if (nominatimUrl) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const res = await fetch(nominatimUrl, {
        headers: { "Accept-Language": "es" },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const item = Array.isArray(data) ? data[0] : data;
        if (item && item.address) {
          const a = item.address;
          const road = a.road || a.pedestrian || a.street || "";
          const houseNumber = a.house_number ? ` ${a.house_number}` : "";
          address = road ? `${road}${houseNumber}` : textToParse.split(",")[0]?.trim() || "";

          neighborhood =
            a.neighbourhood ||
            a.suburb ||
            a.residential ||
            a.quarter ||
            a.city_district ||
            "";

          city =
            a.city ||
            a.town ||
            a.village ||
            a.municipality ||
            a.county ||
            "";

          zone = a.state || a.province || a.region || "";
        }
      }
    }
  } catch {
    // Si falla la conexión externa, se utiliza el extractor sintáctico local
  }

  // 4. Fallback sintáctico local si la geocodificación no completó todos los campos
  if (!address && textToParse) {
    const parts = textToParse
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);

    if (parts.length >= 1) address = parts[0];
    if (parts.length === 2) {
      city = parts[1];
    } else if (parts.length === 3) {
      neighborhood = parts[1];
      city = parts[2];
    } else if (parts.length >= 4) {
      neighborhood = parts[1];
      city = parts[2];
      zone = parts[3];
    }
  }

  const embedUrl = getGoogleMapsEmbedUrl({
    address,
    neighborhood,
    city,
    zone,
    googleMapsUrl: extractedUrl,
  });

  return {
    address: address || textToParse || "",
    neighborhood: neighborhood || "",
    city: city || "",
    zone: zone || "",
    googleMapsUrl: extractedUrl,
    embedUrl,
  };
}
