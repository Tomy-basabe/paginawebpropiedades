import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";
import { AdminUser, AdminModule } from "@/lib/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mjxywapawhtcrdenslma.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const serverSupabase = createClient(supabaseUrl, supabaseKey);

const USERS_CONFIG_ID = "__sys_admin_users_config__";

const ALL_MODULES: AdminModule[] = ["propiedades", "banners", "tasas", "perfil", "usuarios", "pagos"];

const DEFAULT_USERS: AdminUser[] = [
  {
    id: "admin-root",
    username: "admin",
    password: "••••••••",
    name: "Administrador",
    role: "admin",
    permissions: ALL_MODULES,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "user-99propiedades",
    username: "99propiedades",
    password: "••••••••",
    name: "99 Propiedades",
    role: "asesor",
    permissions: ["propiedades", "banners", "tasas", "perfil"],
    createdAt: "2026-01-01T00:00:00.000Z",
  },
];

async function checkAuth(req: NextRequest) {
  const token = req.cookies.get("aurea_admin_session")?.value;
  if (!token) return null;
  return await verifySessionToken(token);
}

export async function GET(req: NextRequest) {
  try {
    const session = await checkAuth(req);
    if (!session) {
      return NextResponse.json({ error: "No autorizado." }, { status: 401 });
    }

    try {
      const { data: configRow } = await serverSupabase
        .from("bank_rates")
        .select("data")
        .eq("id", USERS_CONFIG_ID)
        .maybeSingle();

      if (configRow?.data?.users && Array.isArray(configRow.data.users) && configRow.data.users.length > 0) {
        // Enmascarar contraseñas si no es el admin root
        const sanitized = configRow.data.users.map((u: AdminUser) => ({
          ...u,
          password: "••••••••",
        }));
        return NextResponse.json({ success: true, users: sanitized });
      }
    } catch (err) {
      console.warn("Aviso al leer usuarios de Supabase:", err);
    }

    return NextResponse.json({ success: true, users: DEFAULT_USERS });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Error al obtener usuarios." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await checkAuth(req);
    if (!session) {
      return NextResponse.json({ error: "No autorizado." }, { status: 401 });
    }

    // Solo admin puede modificar usuarios o permisos
    if (session.role !== "admin") {
      return NextResponse.json({ error: "Permiso denegado. Solo administradores pueden gestionar usuarios." }, { status: 403 });
    }

    const body = await req.json();
    const { users } = body;

    if (!Array.isArray(users)) {
      return NextResponse.json({ error: "Lista de usuarios requerida." }, { status: 400 });
    }

    // Leer los usuarios actuales de Supabase para no sobreescribir contraseñas si vienen con '••••••••'
    let currentStoredUsers: AdminUser[] = [];
    try {
      const { data: configRow } = await serverSupabase
        .from("bank_rates")
        .select("data")
        .eq("id", USERS_CONFIG_ID)
        .maybeSingle();
      if (configRow?.data?.users && Array.isArray(configRow.data.users)) {
        currentStoredUsers = configRow.data.users;
      }
    } catch {
      // ignore
    }

    const mergedUsers: AdminUser[] = users.map((incoming: AdminUser) => {
      const existing = currentStoredUsers.find((e) => e.id === incoming.id || e.username.toLowerCase() === incoming.username.toLowerCase());
      let finalPassword = incoming.password;
      if (!finalPassword || finalPassword === "••••••••") {
        finalPassword = existing?.password || (incoming.username === "admin" ? "Tomas2812" : "123456");
      }

      return {
        id: incoming.id || existing?.id || `user-${Date.now()}`,
        username: incoming.username.trim().toLowerCase(),
        password: finalPassword,
        name: incoming.name.trim(),
        role: incoming.role || "asesor",
        permissions: Array.isArray(incoming.permissions) ? incoming.permissions : ALL_MODULES,
        createdAt: incoming.createdAt || existing?.createdAt || new Date().toISOString(),
      };
    });

    // Persistir de forma garantizada en Supabase
    await serverSupabase.from("bank_rates").upsert({
      id: USERS_CONFIG_ID,
      bank_name: "__SYSTEM_USERS__",
      tna: 0,
      cft: 0,
      max_financing_percent: 0,
      max_years_term: 0,
      logo_url: "",
      bank_type: "system",
      is_active: false,
      requirements: [],
      data: { users: mergedUsers, updatedAt: new Date().toISOString() },
    });

    const sanitized = mergedUsers.map((u) => ({ ...u, password: "••••••••" }));
    return NextResponse.json({ success: true, users: sanitized });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Error al guardar usuarios." }, { status: 500 });
  }
}
