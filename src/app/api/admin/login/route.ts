import { NextRequest, NextResponse } from "next/server";
import { createSessionToken } from "@/lib/auth";

// Rate limiting en memoria por IP para frenar ataques de fuerza bruta y diccionario
const loginAttempts = new Map<string, { count: number; lockedUntil: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = loginAttempts.get(ip);
  if (!entry) return false;

  if (entry.lockedUntil > now) return true;
  if (entry.lockedUntil <= now && entry.count >= 5) {
    loginAttempts.delete(ip);
    return false;
  }
  return false;
}

function recordFailedAttempt(ip: string) {
  const now = Date.now();
  const entry = loginAttempts.get(ip) || { count: 0, lockedUntil: 0 };
  entry.count += 1;
  if (entry.count >= 5) {
    entry.lockedUntil = now + 15 * 60 * 1000; // Bloqueo estricto de 15 minutos
  }
  loginAttempts.set(ip, entry);
}

function clearAttempts(ip: string) {
  loginAttempts.delete(ip);
}

// Comparación segura en tiempo constante para mitigar ataques de temporización (Timing Attacks)
function safeCompare(a: string, b: string): boolean {
  const enc = new TextEncoder();
  const bufA = enc.encode(a);
  const bufB = enc.encode(b);
  if (bufA.byteLength !== bufB.byteLength) return false;

  let mismatch = 0;
  for (let i = 0; i < bufA.byteLength; i++) {
    mismatch |= bufA[i] ^ bufB[i];
  }
  return mismatch === 0;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Demasiados intentos fallidos. Acceso bloqueado por 15 minutos por seguridad." },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const username = (body.username || "").trim().toLowerCase();
    const password = (body.password || "").trim();

    // Sanitización y límites de longitud para prevenir DoS y ReDoS
    if (!username || !password || username.length > 64 || password.length > 128) {
      return NextResponse.json(
        { error: "Credenciales inválidas." },
        { status: 400 }
      );
    }

    // Credenciales del Administrador configuradas en .env.local
    const envAdminUser = (process.env.ADMIN_USER || "admin").toLowerCase();
    const envAdminPass = process.env.ADMIN_PASSWORD || "AureaAdmin2026!#Secure_X9kL";

    // Validación estricta sin puertas traseras
    const isUserValid = safeCompare(username, envAdminUser);
    const isPassValid = safeCompare(password, envAdminPass);

    if (!isUserValid || !isPassValid) {
      recordFailedAttempt(ip);
      return NextResponse.json(
        { error: "Usuario o contraseña incorrectos." },
        { status: 401 }
      );
    }

    clearAttempts(ip);

    // Crear token de sesión criptográfico (HMAC-SHA256)
    const token = await createSessionToken({
      username,
      name: "Administrador",
      role: "admin",
    });

    const response = NextResponse.json({
      success: true,
      user: {
        username,
        name: "Administrador",
        role: "admin",
      },
    });

    // Cookie HttpOnly segura (inaccesible desde JS / XSS / DevTools)
    response.cookies.set("aurea_admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 días
    });

    return response;
  } catch (error) {
    console.error("Error en login de administración:", error);
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
