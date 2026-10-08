// Biblioteca criptográfica y de autenticación segura usando Web Crypto API nativa

const SECRET_KEY_RAW =
  process.env.ADMIN_AUTH_SECRET ||
  "aurea_real_estate_ultra_secure_jwt_secret_key_2026_xyz_789456123";

const TOKEN_EXPIRY_SECONDS = 60 * 60 * 24 * 7; // 7 días

// Obtener clave HMAC a partir del secreto
async function getHmacKey(): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    enc.encode(SECRET_KEY_RAW),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

// Convertir Uint8Array a Base64Url
function bufferToBase64Url(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

// Convertir Base64Url a Uint8Array
function base64UrlToBuffer(base64url: string): Uint8Array {
  const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
  const padLen = (4 - (base64.length % 4)) % 4;
  const padded = base64 + "=".repeat(padLen);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export interface SessionPayload {
  username: string;
  name: string;
  role: "admin" | "asesor";
  exp: number; // timestamp en segundos
}

/**
 * Crea un token de sesión criptográficamente firmado (HMAC-SHA256).
 */
export async function createSessionToken(user: {
  username: string;
  name: string;
  role: "admin" | "asesor";
}): Promise<string> {
  const payload: SessionPayload = {
    username: user.username,
    name: user.name,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + TOKEN_EXPIRY_SECONDS,
  };

  const enc = new TextEncoder();
  const payloadString = JSON.stringify(payload);
  const payloadBase64 = bufferToBase64Url(enc.encode(payloadString).buffer);

  const key = await getHmacKey();
  const signatureBuf = await crypto.subtle.sign(
    "HMAC",
    key,
    enc.encode(payloadBase64)
  );
  const signatureBase64 = bufferToBase64Url(signatureBuf);

  return `${payloadBase64}.${signatureBase64}`;
}

/**
 * Verifica la firma y la fecha de expiración de un token de sesión.
 */
export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    if (!token || !token.includes(".")) return null;
    const [payloadBase64, signatureBase64] = token.split(".");
    if (!payloadBase64 || !signatureBase64) return null;

    const key = await getHmacKey();
    const enc = new TextEncoder();
    const signatureBytes = base64UrlToBuffer(signatureBase64);

    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes as unknown as BufferSource,
      enc.encode(payloadBase64)
    );

    if (!isValid) return null;

    const payloadBytes = base64UrlToBuffer(payloadBase64);
    const dec = new TextDecoder();
    const payload: SessionPayload = JSON.parse(dec.decode(payloadBytes));

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) {
      return null; // Token expirado
    }

    return payload;
  } catch (err) {
    return null;
  }
}

/**
 * Genera un hash seguro SHA-256 con Salt aleatorio para contraseñas.
 */
export async function hashPassword(password: string): Promise<string> {
  const enc = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const saltHex = Array.from(salt)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const combined = enc.encode(`${saltHex}:${password}`);
  const hashBuf = await crypto.subtle.digest("SHA-256", combined);
  const hashHex = Array.from(new Uint8Array(hashBuf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return `${saltHex}:${hashHex}`;
}

/**
 * Compara una contraseña en texto plano contra un hash con salt almacenado.
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  try {
    const [saltHex, expectedHashHex] = storedHash.split(":");
    if (!saltHex || !expectedHashHex) return false;

    const enc = new TextEncoder();
    const combined = enc.encode(`${saltHex}:${password}`);
    const hashBuf = await crypto.subtle.digest("SHA-256", combined);
    const computedHashHex = Array.from(new Uint8Array(hashBuf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    return computedHashHex === expectedHashHex;
  } catch {
    return false;
  }
}
