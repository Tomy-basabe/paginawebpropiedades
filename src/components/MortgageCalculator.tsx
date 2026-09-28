"use client";

import React, { useState, useMemo } from "react";
import { useData } from "@/context/DataContext";
import { 
  Calculator, 
  HelpCircle, 
  CheckCircle2, 
  MessageCircle, 
  ArrowRight, 
  TrendingDown,
  Info
} from "lucide-react";

export default function MortgageCalculator() {
  const { bankRates, agentProfile } = useData();

  // Inputs
  const [propertyPrice, setPropertyPrice] = useState(180000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(25);
  const [termYears, setTermYears] = useState(30);
  const [selectedBankId, setSelectedBankId] = useState<string>(bankRates[0]?.id || "custom");
  const [customRate, setCustomRate] = useState(5.5);

  const activeBank = bankRates.find((b) => b.id === selectedBankId);
  const effectiveRate = activeBank ? activeBank.rateUva : customRate;

  // Cálculos matemáticos de cuota bajo sistema francés
  const calculations = useMemo(() => {
    const downPaymentAmount = propertyPrice * (downPaymentPercent / 100);
    const loanAmount = propertyPrice - downPaymentAmount;
    const monthlyRate = effectiveRate / 100 / 12;
    const totalMonths = termYears * 12;

    let monthlyPayment = 0;
    if (monthlyRate > 0) {
      monthlyPayment =
        (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) /
        (Math.pow(1 + monthlyRate, totalMonths) - 1);
    } else {
      monthlyPayment = loanAmount / totalMonths;
    }

    const totalPaid = monthlyPayment * totalMonths;
    const totalInterest = totalPaid - loanAmount;
    const minRequiredIncome = monthlyPayment / 0.25; // 25% afectación de ingresos demostrables

    return {
      downPaymentAmount,
      loanAmount,
      monthlyPayment,
      totalPaid,
      totalInterest,
      minRequiredIncome,
    };
  }, [propertyPrice, downPaymentPercent, termYears, effectiveRate]);

  const whatsappMessage = encodeURIComponent(
    `Hola ${agentProfile.name}, estuve usando el simulador hipotecario en tu sitio web para un inmueble de USD ${propertyPrice.toLocaleString("es-AR")}. Con un anticipo del ${downPaymentPercent}%, la cuota estimada ronda USD ${Math.round(calculations.monthlyPayment)}. Quisiera evaluar la precalificación bancaria y propiedades disponibles para este perfil.`
  );

  return (
    <div className="bg-white rounded-sm border border-neutral-200 shadow-md p-6 sm:p-8 md:p-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-neutral-200">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gold-600 bg-gold-50 px-2.5 py-1 rounded-sm mb-2">
            <Calculator className="w-3.5 h-3.5" />
            <span>Simulador Financiero Hipotecario</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900">
            Calculá tu Cuota & Capacidad de Compra
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Herramienta interactiva para proyectar cuotas mensuales bajo líneas de crédito UVA de la banca argentina actual.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3.5 py-2 rounded-sm text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Tasas bancarias vigentes 2026</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
        {/* Panel Izquierdo: Controles */}
        <div className="lg:col-span-7 space-y-6">
          {/* Valor de la propiedad */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700">
                Valor Estimado de la Propiedad (USD)
              </label>
              <div className="font-serif text-lg font-bold text-neutral-900">
                USD {propertyPrice.toLocaleString("es-AR")}
              </div>
            </div>
            <input
              type="range"
              min="50000"
              max="1500000"
              step="10000"
              value={propertyPrice}
              onChange={(e) => setPropertyPrice(Number(e.target.value))}
              className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-gold-500"
            />
            <div className="flex justify-between text-[11px] text-neutral-400 mt-1.5">
              <span>USD 50k</span>
              <span>USD 500k</span>
              <span>USD 1.5M+</span>
            </div>
          </div>

          {/* Anticipo inicial */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700">
                Anticipo Inicial ({downPaymentPercent}%)
              </label>
              <span className="text-xs font-mono font-medium text-neutral-600">
                USD {calculations.downPaymentAmount.toLocaleString("es-AR")}
              </span>
            </div>
            <input
              type="range"
              min="15"
              max="60"
              step="5"
              value={downPaymentPercent}
              onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
              className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-gold-500"
            />
            <div className="flex justify-between text-[11px] text-neutral-400 mt-1.5">
              <span>15% (Mínimo BNA)</span>
              <span>25% (Recomendado)</span>
              <span>60%</span>
            </div>
          </div>

          {/* Plazo del crédito */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-2">
                Plazo en Años
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[10, 15, 20, 30].map((years) => (
                  <button
                    key={years}
                    type="button"
                    onClick={() => setTermYears(years)}
                    className={`py-2 text-xs font-medium rounded-sm border transition-colors ${
                      termYears === years
                        ? "bg-neutral-900 text-white border-neutral-900"
                        : "bg-white text-neutral-700 border-neutral-300 hover:border-neutral-500"
                    }`}
                  >
                    {years}a
                  </button>
                ))}
              </div>
            </div>

            {/* Banco o entidad */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-2">
                Entidad Financiera
              </label>
              <select
                value={selectedBankId}
                onChange={(e) => setSelectedBankId(e.target.value)}
                className="w-full text-xs p-2.5 bg-white border border-neutral-300 rounded-sm focus:outline-none focus:border-gold-500"
              >
                {bankRates.map((bank) => (
                  <option key={bank.id} value={bank.id}>
                    {bank.bankName} — TNA: {bank.rateUva}% + UVA
                  </option>
                ))}
                <option value="custom">Tasa Manual Personalizada</option>
              </select>
            </div>
          </div>

          {/* Tasa manual si se seleccionó personalizada */}
          {selectedBankId === "custom" && (
            <div className="p-3 bg-stone-50 border border-neutral-200 rounded-sm">
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Tasa Nominal Anual personalizada (% sobre UVA)
              </label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="20"
                value={customRate}
                onChange={(e) => setCustomRate(Number(e.target.value))}
                className="w-32 text-xs p-2 bg-white border border-neutral-300 rounded-sm focus:outline-none focus:border-gold-500"
              />
            </div>
          )}

          {activeBank && (
            <div className="p-3.5 bg-stone-50 border border-neutral-200 rounded-sm text-xs text-neutral-600 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-gold-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-neutral-800">{activeBank.bankName}: </span>
                {activeBank.notes}
              </div>
            </div>
          )}
        </div>

        {/* Panel Derecho: Métricas de Resultados */}
        <div className="lg:col-span-5 bg-stone-50 border border-neutral-200 rounded-sm p-6 flex flex-col justify-between">
          <div className="space-y-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Proyección de Cuota & Requisitos
            </h3>

            {/* Cuota Principal */}
            <div className="bg-white p-5 rounded-sm border border-neutral-200 shadow-sm">
              <span className="text-xs text-neutral-500 block mb-1">
                Cuota Mensual Inicial Estimada
              </span>
              <div className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 text-gold-600">
                USD {Math.round(calculations.monthlyPayment).toLocaleString("es-AR")}
              </div>
              <span className="text-[11px] text-neutral-400 mt-1 block">
                Calculada con TNA del {effectiveRate}% + ajuste mensual UVA
              </span>
            </div>

            {/* Desglose */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-neutral-200">
                <span className="text-neutral-500">Monto total a financiar:</span>
                <span className="font-semibold text-neutral-800">
                  USD {Math.round(calculations.loanAmount).toLocaleString("es-AR")}
                </span>
              </div>

              <div className="flex justify-between py-2 border-b border-neutral-200">
                <span className="text-neutral-500">Ingresos netos requeridos (hogar):</span>
                <span className="font-semibold text-emerald-700">
                  ~USD {Math.round(calculations.minRequiredIncome).toLocaleString("es-AR")}
                </span>
              </div>

              <div className="flex justify-between py-2 border-b border-neutral-200">
                <span className="text-neutral-500">Plazo pactado:</span>
                <span className="font-semibold text-neutral-800">
                  {termYears} años ({termYears * 12} cuotas)
                </span>
              </div>

              <div className="flex justify-between py-2">
                <span className="text-neutral-500">Afectación de ingresos:</span>
                <span className="font-semibold text-neutral-800">
                  Hasta 25% del salario demostrado
                </span>
              </div>
            </div>
          </div>

          {/* CTA de Asesoría Financiera con el Agente */}
          <div className="pt-6 mt-6 border-t border-neutral-200">
            <a
              href={`https://wa.me/${agentProfile.whatsappNumber}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs py-3 px-4 rounded-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Evaluar esta Calificación con Ignacio</span>
            </a>
            <p className="text-[10px] text-neutral-400 text-center mt-2">
              Valores informativos y orientativos. Cada solicitud bancaria se encuentra sujeta a aprobación crediticia.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
