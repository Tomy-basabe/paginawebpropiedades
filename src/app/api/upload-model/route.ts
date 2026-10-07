import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No se proporcionó ningún archivo" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = path.join(process.cwd(), "public", "uploads", "models3d");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const rawExt = file.name.split(".").pop()?.toLowerCase() || "ply";
    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueFileName = `splat-${Date.now()}-${cleanName}`;
    const filePath = path.join(uploadsDir, uniqueFileName);

    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/models3d/${uniqueFileName}`;
    const format = rawExt === "ksplat" ? "ksplat" : rawExt === "splat" ? "splat" : "ply";

    return NextResponse.json({
      url: publicUrl,
      format,
      fileName: file.name,
      sizeMB: (file.size / (1024 * 1024)).toFixed(1),
    });
  } catch (error: any) {
    console.error("Error al guardar archivo 3D local:", error);
    return NextResponse.json(
      { error: error?.message || "Error al procesar el archivo 3D en el servidor" },
      { status: 500 }
    );
  }
}
