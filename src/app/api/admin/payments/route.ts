import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";
import { AppMonthlyPayment } from "@/lib/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mjxywapawhtcrdenslma.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const serverSupabase = createClient(supabaseUrl, supabaseKey);

// ID especial para almacenar la configuración de pagos en Supabase con persistencia real compartida
const PAYMENTS_CONFIG_ID = "__sys_app_payments_config__";

// En memoria como fallback temporal de proceso
let inMemoryPayments: AppMonthlyPayment[] = [];

async function checkAuth(req: NextRequest) {
  const token = req.cookies.get("aurea_admin_session")?.value;
  if (!token) return null;
  return await verifySessionToken(token);
}

// Guarda de forma persistente en Supabase (bank_rates config row y app_payments si existe)
async function persistPaymentsToSupabase(payments: AppMonthlyPayment[]) {
  try {
    // 1. Guardar de forma garantizada en la tabla bank_rates (soporta JSONB y está activa en Supabase)
    await serverSupabase.from("bank_rates").upsert({
      id: PAYMENTS_CONFIG_ID,
      bank_name: "__SYSTEM_PAYMENTS__",
      tna: 0,
      cft: 0,
      max_financing_percent: 0,
      max_years_term: 0,
      logo_url: "",
      bank_type: "system",
      is_active: false,
      requirements: [],
      data: { payments, updatedAt: new Date().toISOString() },
    });
  } catch (err) {
    console.warn("Aviso al guardar en bank_rates config:", err);
  }

  // 2. Intentar también guardar en app_payments si la tabla estuviera disponible
  try {
    if (payments.length > 0) {
      const rows = payments.map((p) => ({
        id: p.id,
        year: p.year,
        month: p.month,
        month_name: p.monthName,
        is_paid: p.isPaid,
        paid_at: p.paidAt || null,
        paid_by: p.paidBy || "admin",
        amount: p.amount || null,
        notes: p.notes || null,
        updated_at: new Date().toISOString(),
      }));
      await serverSupabase.from("app_payments").upsert(rows);
    }
  } catch {
    // Silencioso si la tabla no existe en el schema cache
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await checkAuth(req);
    if (!session) {
      return NextResponse.json({ error: "No autorizado." }, { status: 401 });
    }

    // 1. Intentar leer desde Supabase bank_rates config (fuente garantizada compartida)
    try {
      const { data: configRow } = await serverSupabase
        .from("bank_rates")
        .select("data")
        .eq("id", PAYMENTS_CONFIG_ID)
        .maybeSingle();

      if (configRow?.data?.payments && Array.isArray(configRow.data.payments) && configRow.data.payments.length > 0) {
        inMemoryPayments = configRow.data.payments;
        return NextResponse.json({ success: true, payments: inMemoryPayments });
      }
    } catch (err) {
      console.warn("Aviso al leer config de pagos en Supabase:", err);
    }

    // 2. Intentar leer desde la tabla app_payments de Supabase si existiera
    try {
      const { data, error } = await serverSupabase
        .from("app_payments")
        .select("*")
        .order("id", { ascending: true });

      if (!error && data && data.length > 0) {
        const mapped: AppMonthlyPayment[] = data.map((row) => ({
          id: row.id,
          year: row.year,
          month: row.month,
          monthName: row.month_name || "",
          isPaid: Boolean(row.is_paid),
          paidAt: row.paid_at,
          paidBy: row.paid_by,
          amount: row.amount,
          notes: row.notes,
        }));
        inMemoryPayments = mapped;
        return NextResponse.json({ success: true, payments: mapped });
      }
    } catch {
      // Ignorar si la tabla no existe en Supabase
    }

    return NextResponse.json({ success: true, payments: inMemoryPayments });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Error al obtener pagos." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await checkAuth(req);
    if (!session) {
      return NextResponse.json({ error: "No autorizado." }, { status: 401 });
    }

    if (session.role !== "admin" || session.username !== "admin") {
      return NextResponse.json(
        { error: "Acceso denegado: Solo el usuario administrador puede modificar el estado de pagos del sistema." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { action, payment, payments } = body;

    if (action === "toggle" && payment) {
      // Actualizar en memoria y lista
      const existingIdx = inMemoryPayments.findIndex((p) => p.id === payment.id);
      if (existingIdx >= 0) {
        inMemoryPayments[existingIdx] = payment;
      } else {
        inMemoryPayments.push(payment);
      }

      await persistPaymentsToSupabase(inMemoryPayments);
      return NextResponse.json({ success: true, payment, payments: inMemoryPayments });
    }

    if ((action === "sync" || action === "pay_all") && Array.isArray(payments)) {
      inMemoryPayments = payments;
      await persistPaymentsToSupabase(inMemoryPayments);
      return NextResponse.json({ success: true, count: payments.length, payments: inMemoryPayments });
    }

    return NextResponse.json({ error: "Acción no válida." }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Error al procesar pago." }, { status: 500 });
  }
}
