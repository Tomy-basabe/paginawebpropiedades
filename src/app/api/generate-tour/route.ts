import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";

// Validación de URL para evitar ataques SSRF
function isValidVideoUrl(urlStr: string): boolean {
  try {
    const parsed = new URL(urlStr);
    // Solo permitir protocolo https
    if (parsed.protocol !== "https:") return false;

    // Bloquear localhost, direcciones privadas o metadatos de nube
    const host = parsed.hostname.toLowerCase();
    if (
      host === "localhost" ||
      host === "127.0.0.1" ||
      host === "0.0.0.0" ||
      host.startsWith("192.168.") ||
      host.startsWith("10.") ||
      host.endsWith(".internal") ||
      host === "169.254.169.254" // AWS/Cloud metadata
    ) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    // 1. Verificar autenticación de administrador
    const sessionCookie = req.cookies.get("aurea_admin_session")?.value;
    if (!sessionCookie) {
      return NextResponse.json(
        { error: "Acceso no autorizado. Inicie sesión para generar recorridos." },
        { status: 401 }
      );
    }
    const session = await verifySessionToken(sessionCookie);
    if (!session) {
      return NextResponse.json(
        { error: "Sesión inválida o expirada." },
        { status: 401 }
      );
    }

    // 2. Extraer y validar body
    const body = await req.json().catch(() => ({}));
    const { propertyId, videoUrl } = body;

    if (!propertyId || typeof propertyId !== "string" || !videoUrl || typeof videoUrl !== "string") {
      return NextResponse.json(
        { error: "propertyId y videoUrl válidos son requeridos." },
        { status: 400 }
      );
    }

    if (!isValidVideoUrl(videoUrl)) {
      return NextResponse.json(
        { error: "La URL del video debe ser una dirección HTTPS pública y válida." },
        { status: 400 }
      );
    }

    const LUMA_API_KEY = process.env.LUMA_API_KEY || "simulacion";

    // Modo simulación seguro
    if (LUMA_API_KEY === "simulacion") {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      return NextResponse.json({
        success: true,
        message: "Recorrido 3D arquitectónico generado con éxito (Modo Simulación)",
        artifactId: `luma-prop-${propertyId.replace(/[^a-zA-Z0-9_-]/g, "")}`,
        artifactUrl: "/models/demo-fast.splat",
      });
    }

    // Petición externa a Luma Labs AI
    const captureResponse = await fetch("https://api.lumalabs.ai/api/v2/capture", {
      method: "POST",
      headers: {
        Authorization: `luma-api-key=${LUMA_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: `Propiedad: ${propertyId}`,
        video_url: videoUrl,
      }),
    });

    if (!captureResponse.ok) {
      throw new Error(`Error en el servicio de generación 3D: ${captureResponse.statusText}`);
    }

    const captureData = await captureResponse.json();
    const slug = captureData.slug;

    return NextResponse.json({
      success: true,
      artifactId: slug,
      artifactUrl: `https://lumalabs.ai/capture/${slug}`,
    });
  } catch (error) {
    console.error("Error generando tour 3D:", error);
    return NextResponse.json(
      { error: "Error interno al procesar el recorrido 3D." },
      { status: 500 }
    );
  }
}
