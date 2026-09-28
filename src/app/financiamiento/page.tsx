"use client";

import React from "react";
import MortgageCalculator from "@/components/MortgageCalculator";
import BankRatesTable from "@/components/BankRatesTable";
import { useData } from "@/context/DataContext";
import { 
  Building2, 
  Percent, 
  HelpCircle, 
  CheckCircle2, 
  ArrowRight, 
  MessageCircle, 
  FileCheck,
  ShieldCheck,
  TrendingUp,
  AlertCircle
} from "lucide-react";

export default function FinanciamientoPage() {
  const { agentProfile } = useData();

  const whatsappMessage = encodeURIComponent(
    `Hola ${agentProfile.name}, quisiera recibir asesoramiento financiero para la compra de una propiedad a través de crédito hipotecario.`
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Encabezado */}
      <div className="border-b border-neutral-200 pb-8">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gold-600 bg-gold-50 px-2.5 py-1 rounded-sm mb-2">
          <Percent className="w-3.5 h-3.5" />
          <span>Estructuración Financiera & Crédito</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900">
          Créditos Hipotecarios & Asesoramiento Financiero
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-1 max-w-3xl leading-relaxed">
          Comprender las variables del financiamiento es el factor determinante para maximizar su capacidad de compra. Ponemos a su disposición nuestro simulador en tiempo real, la comparativa de tasas bancarias vigentes y el acompañamiento profesional para tramitar su crédito.
        </p>
      </div>

      {/* 1. Simulador Hipotecario Principal */}
      <section>
        <MortgageCalculator />
      </section>

      {/* 2. Tabla Comparativa de Bancos */}
      <section id="tasas">
        <BankRatesTable />
      </section>

      {/* 3. Guía Paso a Paso para Comprar con Crédito */}
      <section id="requisitos" className="bg-white border border-neutral-200 p-8 rounded-sm space-y-8">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-gold-600">
            Guía Práctica para el Comprador
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 mt-1">
            El Proceso de Compra con Hipoteca en 4 Etapas
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
          <div className="p-5 bg-stone-50 border border-neutral-200 rounded-sm relative">
            <span className="text-2xl font-serif font-bold text-gold-500 block mb-2">01</span>
            <h3 className="font-serif text-sm font-bold text-neutral-900 mb-2">
              Precalificación Bancaria
            </h3>
            <p className="text-neutral-600 leading-relaxed">
              Presentación de recibos de sueldo, balances o declaraciones de Ganancias ante la entidad para obtener el monto máximo de endeudamiento autorizado.
            </p>
          </div>

          <div className="p-5 bg-stone-50 border border-neutral-200 rounded-sm relative">
            <span className="text-2xl font-serif font-bold text-gold-500 block mb-2">02</span>
            <h3 className="font-serif text-sm font-bold text-neutral-900 mb-2">
              Búsqueda de Inmueble Apto
            </h3>
            <p className="text-neutral-600 leading-relaxed">
              Selección de propiedades con planos aprobados, reglamento de copropiedad e inscripción dominial en regla. Se formaliza una Reserva ad-referéndum.
            </p>
          </div>

          <div className="p-5 bg-stone-50 border border-neutral-200 rounded-sm relative">
            <span className="text-2xl font-serif font-bold text-gold-500 block mb-2">03</span>
            <h3 className="font-serif text-sm font-bold text-neutral-900 mb-2">
              Tasación Oficial del Perito
            </h3>
            <p className="text-neutral-600 leading-relaxed">
              El tasador designado por el banco inspecciona la propiedad. El monto prestable se fija sobre el menor valor entre el precio pactado y la tasación pericial.
            </p>
          </div>

          <div className="p-5 bg-stone-50 border border-neutral-200 rounded-sm relative">
            <span className="text-2xl font-serif font-bold text-gold-500 block mb-2">04</span>
            <h3 className="font-serif text-sm font-bold text-neutral-900 mb-2">
              Escrituración Simultánea
            </h3>
            <p className="text-neutral-600 leading-relaxed">
              Firma conjunta ante escribano de la compraventa y constitución de la hipoteca, liquidación del crédito en el acto y toma de posesión del inmueble.
            </p>
          </div>
        </div>

        {/* Advertencia / Tip profesional */}
        <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block mb-0.5">Nota sobre la Reserva Inmobiliaria Ad-Referéndum</span>
            Siempre asegúrese de que su oferta de reserva aclare expresamente que queda sujeta a la aprobación final del crédito hipotecario por parte del banco, protegiendo así el 100% de su depósito de garantía.
          </div>
        </div>
      </section>

      {/* 4. Banner Asesoramiento Personalizado */}
      <section className="bg-luxury-black text-white p-8 sm:p-12 rounded-sm border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-3 max-w-xl">
          <span className="text-xs uppercase tracking-widest text-gold-400 font-semibold">
            Asesoría Especializada
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            ¿Necesitas ayuda para estructurar tu compra?
          </h3>
          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
            Te asesoramos en la elección del banco más conveniente según tu perfil de ingresos y te presentamos las propiedades 100% aptas crédito disponibles en nuestra cartera.
          </p>
        </div>

        <a
          href={`https://wa.me/${agentProfile.whatsappNumber}?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs uppercase tracking-wider px-6 py-3.5 rounded-sm transition-all flex items-center gap-2 shadow-md shrink-0"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Conversar con Ignacio</span>
        </a>
      </section>
    </div>
  );
}
