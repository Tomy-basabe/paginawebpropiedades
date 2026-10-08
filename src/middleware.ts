import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Redirección canónica de /admin hacia el panel
  if (pathname === "/admin") {
    return NextResponse.redirect(new URL("/99propiedades", req.url));
  }

  // 2. Proteger endpoints de API sensibles que solo el administrador debe invocar
  if (
    pathname.startsWith("/api/upload-model") ||
    pathname.startsWith("/api/generate-tour") ||
    pathname.startsWith("/api/admin/properties")
  ) {
    const sessionCookie = req.cookies.get("aurea_admin_session")?.value;
    if (!sessionCookie) {
      return NextResponse.json(
        { error: "No autorizado. Se requiere sesión de administrador activa." },
        { status: 401 }
      );
    }

    const payload = await verifySessionToken(sessionCookie);
    if (!payload || (payload.role !== "admin" && payload.role !== "asesor")) {
      return NextResponse.json(
        { error: "Sesión inválida o expirada." },
        { status: 403 }
      );
    }
  }

  // 3. Inyectar Cabeceras de Seguridad HTTP Globales
  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-XSS-Protection", "1; mode=block");

  return response;
}

export const config = {
  matcher: [
    "/admin",
    "/api/upload-model",
    "/api/generate-tour",
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
