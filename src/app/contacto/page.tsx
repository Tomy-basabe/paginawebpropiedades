"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useData } from "@/context/DataContext";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Send,
  Building2,
  FileCheck
} from "lucide-react";
import WhatsAppIcon from "@/components/WhatsAppIcon";

function ContactoContent() {
  const searchParams = useSearchParams();
  const initialSubject = searchParams.get("asunto") || "consulta_general";
  const { agentProfile } = useData();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: initialSubject,
    message: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    const subjectLabels: Record<string, string> = {
      tasacion: "Tasación de Propiedad (Siempre Sin Cargo)",
      credito: "Gestión de Crédito Hipotecario UVA",
      alquileres: "Alquileres y Administración Integral",
      loteos: "Venta de Inmuebles y Loteos",
      compra: "Búsqueda y Compra de Inmueble",
      consulta_general: "Consulta General Inmobiliaria",
    };

    const text = encodeURIComponent(
      `Hola ${agentProfile.name},\n` +
      `Mi nombre es ${formData.name}.\n` +
      `• Asunto: ${subjectLabels[formData.subject] || formData.subject}\n` +
      `• Teléfono: ${formData.phone}\n` +
      `• Email: ${formData.email}\n` +
      `• Mensaje: ${formData.message}`
    );

    window.open(`https://wa.me/${agentProfile.whatsappNumber}?text=${text}`, "_blank");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Encabezado */}
      <div className="border-b border-neutral-200 pb-8">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gold-600 bg-gold-50 px-2.5 py-1 rounded-sm mb-2">
          <Mail className="w-3.5 h-3.5" />
          <span>Atención Directa & Despacho</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900">
          Contacto & Asesoramiento Privado
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-1 max-w-2xl">
          Comuníquese directamente con {agentProfile.name} para coordinar visitas, solicitar tasaciones o estructurar su próxima inversión.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Columna Izquierda: Formulario de Contacto */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-sm border border-neutral-200 shadow-sm">
          {isSubmitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-neutral-900">
                ¡Mensaje Enviado con Éxito!
              </h3>
              <p className="text-xs text-neutral-600 max-w-md mx-auto leading-relaxed">
                Hemos canalizado su solicitud directamente al WhatsApp del agente para responderle en el menor tiempo posible.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="mt-4 bg-neutral-900 text-white text-xs font-medium px-6 py-2.5 rounded-sm hover:bg-neutral-800 transition-colors"
              >
                Enviar otra consulta
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <h2 className="font-serif text-lg font-bold text-neutral-900 mb-2">
                Envíenos su Consulta
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Nombre y Apellido *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Martín Rodríguez"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-neutral-300 rounded-sm focus:border-gold-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Teléfono / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+54 9 11 ..."
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-neutral-300 rounded-sm focus:border-gold-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="nombre@ejemplo.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-neutral-300 rounded-sm focus:border-gold-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Motivo de Consulta *
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-neutral-300 rounded-sm focus:border-gold-500 focus:outline-none"
                  >
                    <option value="consulta_general">Consulta General</option>
                    <option value="tasacion">Solicitar Tasación (Siempre Sin Cargo)</option>
                    <option value="credito">Gestión de Crédito Hipotecario UVA</option>
                    <option value="alquileres">Alquileres & Administración Integral</option>
                    <option value="loteos">Venta de Inmuebles & Loteos</option>
                    <option value="compra">Interés en Comprar una Propiedad</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Mensaje o Detalle del Requerimiento *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Detállenos qué tipo de inmueble busca, presupuesto estimado, ubicación de interés o datos de su inmueble si desea vender..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-neutral-300 rounded-sm focus:border-gold-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gold-500 hover:bg-gold-600 text-luxury-black font-semibold uppercase tracking-wider py-3.5 rounded-sm transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-gold-500/20"
              >
                <Send className="w-4 h-4" />
                <span>Enviar Consulta Directa</span>
              </button>
            </form>
          )}
        </div>

        {/* Columna Derecha: Canales Directos e Información de Despacho */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-luxury-black text-white p-6 sm:p-8 rounded-sm border border-white/10 space-y-6 text-xs">
            <h3 className="font-serif text-lg font-bold text-white uppercase tracking-wider">
              Despacho Central
            </h3>

            <div className="space-y-4 text-neutral-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Dirección</span>
                  <span>{agentProfile.officeAddress}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Teléfono Principal</span>
                  <span>{agentProfile.phone}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Email Directo</span>
                  <a href={`mailto:${agentProfile.email}`} className="text-gold-400 hover:underline">
                    {agentProfile.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Horario de Atención</span>
                  <span>Lunes a Viernes de 09:00 a 19:00 hs.<br />Sábados con guardia activa previa cita.</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <a
                href={`https://wa.me/${agentProfile.whatsappNumber}?text=Hola%20${encodeURIComponent(agentProfile.name)},%20quisiera%20conversar%20sobre%20una%20propiedad`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold py-3.5 rounded-sm transition-all duration-200 flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-500/25 btn-tactile"
              >
                <WhatsAppIcon className="w-5 h-5 drop-shadow-sm" />
                <span>Iniciar Chat Inmediato por WhatsApp</span>
              </a>
            </div>
          </div>

          <div className="p-5 bg-stone-50 border border-neutral-200 rounded-sm text-xs text-neutral-600 space-y-2">
            <span className="font-semibold text-neutral-900 block flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-gold-600" />
              <span>Matrícula & Legalidad</span>
            </span>
            <p className="leading-relaxed">
              Todas las operaciones son concluidas exclusivamente bajo la firma de {agentProfile.name}, matriculado {agentProfile.licenseNumber}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ContactoPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-neutral-500">Cargando contacto...</div>}>
      <ContactoContent />
    </Suspense>
  );
}
