import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";
import { AppMonthlyPayment } from "@/lib/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mjxywapawhtcrdenslma.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const serverSupabase = createClient(supabaseUrl, supabaseKey);

// En caso de que la tabla de Supabase aún no esté creada, almacenamos en memoria de proceso del servidor
let inMemoryPayments: AppMonthlyPayment[] = [];

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
        return NextResponse.json({ success: true, payments: mapped });
      }
    } catch {
      // Ignorar si la tabla no existe en Supabase y usar fallback
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
      // Actualizar en memoria
      const existingIdx = inMemoryPayments.findIndex((p) => p.id === payment.id);
      if (existingIdx >= 0) {
        inMemoryPayments[existingIdx] = payment;
      } else {
        inMemoryPayments.push(payment);
      }

      // Intentar persistir en Supabase
      try {
        await serverSupabase.from("app_payments").upsert({
          id: payment.id,
          year: payment.year,
          month: payment.month,
          month_name: payment.monthName,
          is_paid: payment.isPaid,
          paid_at: payment.paidAt || null,
          paid_by: payment.paidBy || session.username,
          amount: payment.amount || null,
          notes: payment.notes || null,
          updated_at: new Date().toISOString(),
        });
      } catch {
        // Fallback silencioso si la tabla no existe
      }

      return NextResponse.json({ success: true, payment });
    }

    if (action === "sync" && Array.isArray(payments)) {
      inMemoryPayments = payments;
      return NextResponse.json({ success: true, count: payments.length });
    }

    return NextResponse.json({ error: "Acción no válida." }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Error al procesar pago." }, { status: 500 });
  }
}
