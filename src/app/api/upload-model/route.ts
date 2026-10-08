import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { verifySessionToken } from "@/lib/auth";

// Extensiones estrictamente permitidas para modelos 3D Gaussian Splatting
const ALLOWED_EXTENSIONS = new Set(["ply", "splat", "ksplat"]);
const MAX_FILE_SIZE = 60 * 1024 * 1024; // 60 MB máximo

export async function POST(req: NextRequest) {
  try {
    // 1. Defensa en profundidad: Verificar sesión administrativa activa
    const sessionCookie = req.cookies.get("aurea_admin_session")?.value;
    if (!sessionCookie) {
      return NextResponse.json(
        { error: "Acceso no autorizado. Debe iniciar sesión." },
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

    // 2. Extraer archivo de FormData
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No se proporcionó ningún archivo." },
        { status: 400 }
      );
    }

    // 3. Validar tamaño de archivo
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "El archivo supera el tamaño máximo permitido de 60 MB." },
        { status: 413 }
      );
    }

    // 4. Validar extensión de forma estricta contra allowlist
    const fileNameParts = file.name.split(".");
    if (fileNameParts.length < 2) {
      return NextResponse.json(
        { error: "El archivo no tiene una extensión válida." },
        { status: 400 }
      );
    }
    const ext = fileNameParts.pop()?.toLowerCase() || "";
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return NextResponse.json(
        {
          error:
            "Formato de archivo no permitido. Solo se aceptan modelos 3D (.ply, .splat, .ksplat).",
        },
        { status: 415 }
      );
    }

    // 5. Sanitizar nombre de archivo para prevenir Path Traversal
    const safeBaseName = fileNameParts
      .join("_")
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .substring(0, 50);
    const uniqueFileName = `splat-${Date.now()}-${safeBaseName}.${ext}`;

    const uploadsDir = path.join(process.cwd(), "public", "uploads", "models3d");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, uniqueFileName);

    // Verificación de seguridad de ruta (evita escape del directorio de uploads)
    if (!filePath.startsWith(uploadsDir)) {
      return NextResponse.json(
        { error: "Ruta de archivo no válida." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/models3d/${uniqueFileName}`;
    const format = ext === "ksplat" ? "ksplat" : ext === "splat" ? "splat" : "ply";

    return NextResponse.json({
      url: publicUrl,
      format,
      fileName: file.name,
      sizeMB: (file.size / (1024 * 1024)).toFixed(1),
    });
  } catch (error: any) {
    console.error("Error al guardar archivo 3D:", error);
    return NextResponse.json(
      { error: "Error al procesar el archivo 3D de forma segura." },
      { status: 500 }
    );
  }
}
