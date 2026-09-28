"use client";

import React, { useState } from "react";
import { useData } from "@/context/DataContext";
import { X, FileCheck, CheckCircle2, Send } from "lucide-react";
import WhatsAppIcon from "./WhatsAppIcon";

interface ValuationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ValuationModal({ isOpen, onClose }: ValuationModalProps) {
  const { agentProfile } = useData();
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    propertyType: "departamento",
    address: "",
    neighborhood: "",
    totalArea: "",
    rooms: "3",
    condition: "muy_bueno",
    ownerName: "",
    ownerPhone: "",
    ownerEmail: "",
    notes: "",
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    const message = encodeURIComponent(
      `Hola ${agentProfile.name}, solicito tasación profesional para mi propiedad:\n` +
      `• Tipo: ${formData.propertyType}\n` +
      `• Ubicación: ${formData.address}, ${formData.neighborhood}\n` +
      `• Sup. aprox: ${formData.totalArea} m² (${formData.rooms} amb)\n` +
      `• Propietario: ${formData.ownerName} (${formData.ownerPhone})\n` +
      `• Observaciones: ${formData.notes || "Ninguna"}`
    );

    // Abrir WhatsApp con los datos
    window.open(`https://wa.me/${agentProfile.whatsappNumber}?text=${message}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div 
        className="relative bg-white w-full max-w-xl rounded-sm shadow-2xl overflow-hidden border border-neutral-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera */}
        <div className="bg-luxury-black text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-sm bg-gold-500/10 border border-gold-400/40 flex items-center justify-center text-gold-400">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-white">
                Tasación Profesional de Inmuebles
              </h3>
              <p className="text-xs text-neutral-400">
                Dictamen de valor de mercado por {agentProfile.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario */}
        <div className="p-6 sm:p-8">
          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="font-serif text-2xl font-bold text-neutral-900">
                ¡Solicitud Registrada con Éxito!
              </h4>
              <p className="text-xs text-neutral-600 max-w-md mx-auto leading-relaxed">
                Nos hemos comunicado por WhatsApp con el equipo de {agentProfile.name}. Se llevará a cabo un análisis comparativo de mercado y nos contactaremos para coordinar una inspección técnica ocular.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="mt-4 bg-neutral-900 text-white text-xs font-medium px-6 py-2.5 rounded-sm hover:bg-neutral-800 transition-colors"
              >
                Cerrar Ventana
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Tipo de Inmueble *
                  </label>
                  <select
                    value={formData.propertyType}
                    onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-neutral-300 rounded-sm focus:border-gold-500 focus:outline-none"
                    required
                  >
                    <option value="departamento">Departamento</option>
                    <option value="casa">Casa / Chalet</option>
                    <option value="loteo">Lote / Terreno</option>
                    <option value="comercial">Local / Oficina Comercial</option>
                    <option value="desarrollo">Fracción / Terreno para Edificar</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Superficie Aprox. (m²) *
                  </label>
                  <input
                    type="number"
                    placeholder="Ej: 140"
                    value={formData.totalArea}
                    onChange={(e) => setFormData({ ...formData, totalArea: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-neutral-300 rounded-sm focus:border-gold-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Dirección o Calle Aproximada *
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Av. del Libertador al 3000"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-neutral-300 rounded-sm focus:border-gold-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Barrio / Localidad *
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Palermo Chico / Nordelta"
                    value={formData.neighborhood}
                    onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-neutral-300 rounded-sm focus:border-gold-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="border-t border-neutral-200 pt-3">
                <span className="block font-semibold text-neutral-800 mb-2 uppercase text-[10px] tracking-wider">
                  Datos de Contacto del Propietario
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-600 mb-1">Nombre Completo *</label>
                    <input
                      type="text"
                      placeholder="Tu nombre y apellido"
                      value={formData.ownerName}
                      onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                      className="w-full p-2.5 bg-stone-50 border border-neutral-300 rounded-sm focus:border-gold-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-600 mb-1">Teléfono / WhatsApp *</label>
                    <input
                      type="tel"
                      placeholder="+54 9 11 ..."
                      value={formData.ownerPhone}
                      onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })}
                      className="w-full p-2.5 bg-stone-50 border border-neutral-300 rounded-sm focus:border-gold-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-neutral-600 mb-1">Comentarios Adicionales</label>
                <textarea
                  rows={2}
                  placeholder="Detalles sobre cochera, estado de conservación, expensas, urgencia de venta..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-neutral-300 rounded-sm focus:border-gold-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold uppercase tracking-wider py-3.5 rounded-sm transition-all flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg hover:shadow-emerald-500/25 btn-tactile cursor-pointer"
              >
                <WhatsAppIcon className="w-5 h-5 drop-shadow-sm" />
                <span>Enviar Solicitud a Ignacio por WhatsApp</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
