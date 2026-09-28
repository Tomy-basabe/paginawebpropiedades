"use client";

import React, { useState } from "react";
import { useData } from "@/context/DataContext";
import { 
  Building2, 
  TrendingUp, 
  Calendar, 
  Info, 
  Check, 
  ArrowUpDown, 
  ShieldCheck,
  Percent
} from "lucide-react";

export default function BankRatesTable() {
  const { bankRates } = useData();
  const [sortField, setSortField] = useState<"rateUva" | "maxFinancing" | "bankName">("rateUva");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const sortedRates = [...bankRates].sort((a, b) => {
    if (sortField === "bankName") {
      return sortOrder === "asc"
        ? a.bankName.localeCompare(b.bankName)
        : b.bankName.localeCompare(a.bankName);
    }
    return sortOrder === "asc"
      ? a[sortField] - b[sortField]
      : b[sortField] - a[sortField];
  });

  const handleSort = (field: "rateUva" | "maxFinancing" | "bankName") => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gold-600 bg-gold-50 px-2.5 py-1 rounded-sm mb-2">
            <Percent className="w-3.5 h-3.5" />
            <span>Monitoreo Financiero Semanal</span>
          </div>
          <h3 className="font-serif text-2xl font-bold text-neutral-900">
            Comparador de Tasas Hipotecarias UVA
          </h3>
          <p className="text-xs sm:text-sm text-neutral-500">
            Relevamiento independiente de las condiciones crediticias de las principales entidades bancarias.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <Calendar className="w-4 h-4 text-gold-500" />
          <span>Actualizado al ciclo corriente</span>
        </div>
      </div>

      {/* Vista de Tarjetas para Móviles (Thumb-friendly & Legible) */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {sortedRates.map((bank) => (
          <div key={bank.id} className="bg-white p-4 rounded-sm border border-neutral-200/90 shadow-sm space-y-3 card-hover-lift hover:border-gold-400/60">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="font-bold text-neutral-900 text-sm">{bank.bankName}</h4>
                <span className="text-[11px] text-neutral-400 block">{bank.creditLine}</span>
              </div>
              {bank.badge && (
                <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-sm border border-emerald-200 shrink-0">
                  {bank.badge}
                </span>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-stone-50 rounded-sm border border-neutral-100 text-center">
              <div>
                <span className="block text-[10px] text-neutral-400 uppercase font-medium">TNA UVA</span>
                <span className="font-serif text-base font-bold text-gold-600">{bank.rateUva}%</span>
              </div>
              <div>
                <span className="block text-[10px] text-neutral-400 uppercase font-medium">Financ. Máx</span>
                <span className="text-xs font-bold text-neutral-800">{bank.maxFinancing}%</span>
              </div>
              <div>
                <span className="block text-[10px] text-neutral-400 uppercase font-medium">Plazo</span>
                <span className="text-xs font-semibold text-neutral-700">{bank.maxTermYears}a</span>
              </div>
            </div>

            <p className="text-[11px] text-neutral-600 leading-relaxed">
              {bank.notes}
            </p>
          </div>
        ))}
      </div>

      {/* Tabla completa para pantallas medianas y grandes (Desktop & Tablet) */}
      <div className="hidden md:block overflow-x-auto rounded-sm border border-neutral-200 bg-white shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-stone-50 border-b border-neutral-200 text-[11px] font-semibold uppercase tracking-wider text-neutral-600">
              <th 
                className="py-3.5 px-4 cursor-pointer hover:text-neutral-900 transition-colors"
                onClick={() => handleSort("bankName")}
              >
                <div className="flex items-center gap-1.5">
                  <span>Banco / Entidad</span>
                  <ArrowUpDown className="w-3 h-3 text-neutral-400" />
                </div>
              </th>
              <th 
                className="py-3.5 px-4 cursor-pointer hover:text-neutral-900 transition-colors text-center"
                onClick={() => handleSort("rateUva")}
              >
                <div className="flex items-center justify-center gap-1.5">
                  <span>TNA (+ UVA)</span>
                  <ArrowUpDown className="w-3 h-3 text-neutral-400" />
                </div>
              </th>
              <th className="py-3.5 px-4 text-center">
                <span>CFT Estimado</span>
              </th>
              <th 
                className="py-3.5 px-4 cursor-pointer hover:text-neutral-900 transition-colors text-center"
                onClick={() => handleSort("maxFinancing")}
              >
                <div className="flex items-center justify-center gap-1.5">
                  <span>Financiación Máx.</span>
                  <ArrowUpDown className="w-3 h-3 text-neutral-400" />
                </div>
              </th>
              <th className="py-3.5 px-4 text-center">
                <span>Plazo Máx.</span>
              </th>
              <th className="py-3.5 px-4">
                <span>Condición Especial & Destino</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 text-xs">
            {sortedRates.map((bank) => (
              <tr key={bank.id} className="hover:bg-stone-50/70 transition-colors">
                {/* Entidad */}
                <td className="py-4 px-4">
                  <div className="font-semibold text-neutral-900 text-sm">
                    {bank.bankName}
                  </div>
                  <div className="text-[11px] text-neutral-400">
                    {bank.creditLine}
                  </div>
                  {bank.badge && (
                    <span className="inline-block mt-1 text-[10px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-sm border border-emerald-200">
                      {bank.badge}
                    </span>
                  )}
                </td>

                {/* Tasa UVA */}
                <td className="py-4 px-4 text-center">
                  <div className="font-serif text-base font-bold text-neutral-900 text-gold-600">
                    {bank.rateUva}%
                  </div>
                  <div className="text-[10px] text-neutral-400 font-sans">
                    + inflac. UVA
                  </div>
                </td>

                {/* CFT */}
                <td className="py-4 px-4 text-center font-medium text-neutral-600">
                  ~{bank.cft}%
                </td>

                {/* Financiación */}
                <td className="py-4 px-4 text-center font-semibold text-neutral-800">
                  {bank.maxFinancing}%
                </td>

                {/* Plazo */}
                <td className="py-4 px-4 text-center text-neutral-700">
                  Hasta {bank.maxTermYears} años
                </td>

                {/* Notas / Condiciones */}
                <td className="py-4 px-4 text-neutral-600 text-xs max-w-xs">
                  <p className="line-clamp-2 leading-relaxed">
                    {bank.notes}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Guía informativa de requisitos esenciales para crédito hipotecario */}
      <div className="bg-stone-50 border border-neutral-200 p-6 rounded-sm space-y-4">
        <h4 className="font-serif text-base font-bold text-neutral-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-gold-600" />
          <span>Requisitos Clave para Calificar a un Crédito Hipotecario</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-neutral-600">
          <div className="bg-white p-3.5 border border-neutral-200 rounded-sm">
            <span className="font-semibold text-neutral-900 block mb-1">
              1. Relación Cuota-Ingreso (DTI)
            </span>
            <p>
              La cuota mensual del crédito no puede exceder entre el 20% y el 25% de los ingresos netos declarados del grupo familiar conviviente.
            </p>
          </div>

          <div className="bg-white p-3.5 border border-neutral-200 rounded-sm">
            <span className="font-semibold text-neutral-900 block mb-1">
              2. Situación Crediticia Impecable
            </span>
            <p>
              Estar calificado en Situación 1 (Normal) en la central de deudores del Banco Central (BCRA) sin antecedentes negativos o juicios comerciales.
            </p>
          </div>

          <div className="bg-white p-3.5 border border-neutral-200 rounded-sm">
            <span className="font-semibold text-neutral-900 block mb-1">
              3. Título Perfecto & Tasación Aprobada
            </span>
            <p>
              El inmueble seleccionado debe poseer escritura pública sin gravámenes y ser tasado por perito del banco con aprobación técnica favorable.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
