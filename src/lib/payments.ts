import { AppMonthlyPayment } from "./types";

export const MONTH_NAMES_ES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

export const PAYMENTS_STORAGE_KEY = "aurea_app_monthly_payments_v1";

/**
 * Genera la lista de los 12 meses de un año dado, fusionando con los pagos ya registrados.
 */
export function buildYearPayments(year: number, existingPayments: AppMonthlyPayment[] = []): AppMonthlyPayment[] {
  const existingMap = new Map<string, AppMonthlyPayment>();
  for (const p of existingPayments) {
    existingMap.set(p.id, p);
  }

  const result: AppMonthlyPayment[] = [];
  for (let m = 1; m <= 12; m++) {
    const id = `${year}-${String(m).padStart(2, "0")}`;
    const found = existingMap.get(id);
    if (found) {
      result.push({
        ...found,
        monthName: MONTH_NAMES_ES[m - 1],
      });
    } else {
      result.push({
        id,
        year,
        month: m,
        monthName: MONTH_NAMES_ES[m - 1],
        isPaid: false,
      });
    }
  }

  return result;
}

export interface PaymentLockStatus {
  isBlocked: boolean; // Si hoy es >= 10 y el mes corriente (o un mes previo) no está pagado
  pendingMonthName: string;
  pendingYear: number;
  dueDateStr: string;
  isApproachingDue: boolean; // Si estamos en el mes actual pero aún es antes del 10 y no está pagado
  daysUntilDue: number;
}

/**
 * Comprueba si la aplicación está bloqueada para modificaciones por falta de pago.
 * Regla:
 * - El vencimiento es el día 10 de cada mes.
 * - Si hoy es día 10 o posterior de un mes y dicho mes no está marcado como pagado,
 *   o si algún mes anterior del año en curso no está pagado,
 *   la aplicación se bloquea para modificaciones (isBlocked = true).
 */
export function checkAppPaymentLock(
  payments: AppMonthlyPayment[],
  referenceDate: Date = new Date()
): PaymentLockStatus {
  const currentYear = referenceDate.getFullYear();
  const currentMonth = referenceDate.getMonth() + 1; // 1 a 12
  const currentDay = referenceDate.getDate();

  const paymentMap = new Map<string, AppMonthlyPayment>();
  for (const p of payments) {
    paymentMap.set(p.id, p);
  }

  // 1. Revisar si hay meses anteriores del año en curso sin pagar
  for (let m = 1; m < currentMonth; m++) {
    const id = `${currentYear}-${String(m).padStart(2, "0")}`;
    const entry = paymentMap.get(id);
    if (!entry || !entry.isPaid) {
      return {
        isBlocked: true,
        pendingMonthName: MONTH_NAMES_ES[m - 1],
        pendingYear: currentYear,
        dueDateStr: `10 de ${MONTH_NAMES_ES[m - 1]} de ${currentYear}`,
        isApproachingDue: false,
        daysUntilDue: 0,
      };
    }
  }

  // 2. Revisar el mes corriente
  const currentId = `${currentYear}-${String(currentMonth).padStart(2, "0")}`;
  const currentEntry = paymentMap.get(currentId);
  const isCurrentPaid = currentEntry ? Boolean(currentEntry.isPaid) : false;

  const currentMonthName = MONTH_NAMES_ES[currentMonth - 1];
  const dueDateStr = `10 de ${currentMonthName} de ${currentYear}`;

  if (!isCurrentPaid) {
    if (currentDay >= 10) {
      // Vencido y sin pagar -> BLOQUEADO
      return {
        isBlocked: true,
        pendingMonthName: currentMonthName,
        pendingYear: currentYear,
        dueDateStr,
        isApproachingDue: false,
        daysUntilDue: 0,
      };
    } else {
      // Falta pagar pero aún está en plazo (antes del 10)
      return {
        isBlocked: false,
        pendingMonthName: currentMonthName,
        pendingYear: currentYear,
        dueDateStr,
        isApproachingDue: true,
        daysUntilDue: 10 - currentDay,
      };
    }
  }

  // Al día
  return {
    isBlocked: false,
    pendingMonthName: currentMonthName,
    pendingYear: currentYear,
    dueDateStr,
    isApproachingDue: false,
    daysUntilDue: 0,
  };
}

/**
 * Obtiene los pagos almacenados localmente de forma segura.
 */
export function getLocalStoredPayments(): AppMonthlyPayment[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(PAYMENTS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

/**
 * Guarda los pagos localmente.
 */
export function saveLocalStoredPayments(payments: AppMonthlyPayment[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PAYMENTS_STORAGE_KEY, JSON.stringify(payments));
  } catch (err) {
    console.error("Error al guardar pagos locales:", err);
  }
}
