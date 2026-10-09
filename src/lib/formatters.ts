/**
 * Formateador profesional de referencias inmobiliarias de 99 Propiedades.
 * Convierte slugs y códigos internos crudos (como "prop-tour-13" o "prop-01")
 * en códigos de catálogo exclusivos de alta gama como "REF-013" o "REF-001".
 */
export function formatPropertyRef(id: string | undefined | null): string {
  if (!id) return "REF-001";
  
  // Extraer el número final si existe (e.g. prop-tour-13 -> 13, prop-02 -> 02, prop-4 -> 4)
  const numbers = id.match(/\d+/g);
  if (numbers && numbers.length > 0) {
    const lastNum = numbers[numbers.length - 1];
    // Rellenar a mínimo 3 dígitos (e.g. "13" -> "013", "1" -> "001")
    const padded = lastNum.length < 3 ? lastNum.padStart(3, "0") : lastNum;
    return `REF-${padded}`;
  }
  
  // Si no tiene números, limpiar prefijos crudos y presentar en mayúsculas limpias
  const clean = id
    .replace(/^(prop-|tour-|banner-)/gi, "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase();
  return `REF-${clean.slice(0, 6) || "001"}`;
}

/**
 * Formatea el precio con separadores de miles y símbolo de moneda.
 */
export function formatCurrencyPrice(price: number, currency: "USD" | "ARS" = "USD"): string {
  return `${currency === "USD" ? "USD" : "$"} ${price.toLocaleString("es-AR")}`;
}
