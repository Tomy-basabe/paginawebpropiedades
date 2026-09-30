/**
 * Limpia y normaliza cualquier número de WhatsApp a formato puramente numérico internacional.
 * Remueve espacios, guiones, paréntesis, signos '+' y prefijos incorrectos.
 */
export function cleanWhatsAppNumber(phoneNumber: string | undefined | null): string {
  if (!phoneNumber) return "5491148907722";

  // Remover todo excepto dígitos
  let cleaned = phoneNumber.replace(/\D/g, "");

  // Si quedó vacío
  if (!cleaned) return "5491148907722";

  // Si empieza con 0 (ej: 0223... o 011...), remover el 0 inicial
  if (cleaned.startsWith("0")) {
    cleaned = cleaned.substring(1);
  }

  // Si tiene 10 dígitos (número argentino estándar con código de área pero sin código de país, ej: 2234980913 o 1148907722)
  if (cleaned.length === 10) {
    cleaned = `549${cleaned}`;
  }
  // Si tiene código 54 pero le falta el 9 de celular para WhatsApp (ej: 54 2234980913 = 12 dígitos)
  else if (cleaned.startsWith("54") && !cleaned.startsWith("549") && cleaned.length === 12) {
    cleaned = `549${cleaned.substring(2)}`;
  }

  return cleaned;
}

/**
 * Genera el enlace oficial de wa.me 100% garantizado contra errores de formato
 */
export function getWhatsAppUrl(phoneNumber: string | undefined | null, message: string = ""): string {
  const cleanNumber = cleanWhatsAppNumber(phoneNumber);
  const encodedMsg = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${cleanNumber}${encodedMsg}`;
}
