import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mjxywapawhtcrdenslma.supabase.co";
// Si se configura la service role key en producción, se usa; de lo contrario fallback a anon
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const serverSupabase = createClient(supabaseUrl, supabaseKey);

// Helper para verificar sesión en el servidor
async function checkAuth(req: NextRequest) {
  const cookieToken = req.cookies.get("aurea_admin_session")?.value;
  const headerToken = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const token = cookieToken || headerToken;
  if (!token) return null;
  return await verifySessionToken(token);
}

export async function POST(req: NextRequest) {
  try {
    const session = await checkAuth(req);
    if (!session) {
      return NextResponse.json({ error: "No autorizado." }, { status: 401 });
    }

    const body = await req.json();
    const { action, property, id } = body;

    if (action === "save") {
      if (!property || !property.id || !property.title) {
        return NextResponse.json({ error: "Datos de propiedad incompletos." }, { status: 400 });
      }

      const { error } = await serverSupabase.from("properties").upsert({
        id: property.id,
        title: property.title,
        operation: property.operation,
        type: property.type,
        status: property.status,
        price: property.price,
        currency: property.currency,
        location: property.location,
        features: property.features,
        images: property.images,
        description: property.description,
        is_featured: property.isFeatured,
        is_opportunity: property.isOpportunity,
        data: property,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        console.error("Error al guardar propiedad:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, id: property.id });
    }

    if (action === "delete") {
      if (!id) {
        return NextResponse.json({ error: "ID requerido para eliminar." }, { status: 400 });
      }

      const { error } = await serverSupabase.from("properties").delete().eq("id", id);
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, id });
    }

    return NextResponse.json({ error: "Acción no reconocida." }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Error del servidor." }, { status: 500 });
  }
}
