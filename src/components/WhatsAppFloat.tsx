"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useData } from "@/context/DataContext";
import { X } from "lucide-react";
import WhatsAppIcon from "./WhatsAppIcon";

export default function WhatsAppFloat() {
  const { agentProfile } = useData();
  const [showTooltip, setShowTooltip] = useState(true);

  const defaultMsg = encodeURIComponent(
    `Hola ${agentProfile.name}, estoy navegando tu sitio web inmobiliario y quisiera hacerte una consulta.`
  );

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40 flex items-end gap-3 pointer-events-auto">
      {/* Tooltip con saludo del agente en desktop */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-3 bg-white p-3.5 rounded-lg shadow-2xl border border-neutral-200/80 text-xs max-w-xs animate-fade-in backdrop-blur-sm">
          <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 border-2 border-gold-400 shadow-sm">
            <Image
              src={agentProfile.photoUrl}
              alt={agentProfile.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="pr-1">
            <div className="font-semibold text-neutral-900 flex items-center gap-1.5">
              <span>{agentProfile.name}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-[11px] text-neutral-500 leading-tight mt-0.5">
              ¿Buscás comprar o tasar una propiedad? Escribime directo por WhatsApp.
            </p>
          </div>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-neutral-400 hover:text-neutral-700 p-1 rounded hover:bg-neutral-100 transition-colors"
            aria-label="Cerrar mensaje"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Botón Flotante con Logo Oficial de WhatsApp */}
      <a
        href={`https://wa.me/${agentProfile.whatsappNumber}?text=${defaultMsg}`}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white shadow-xl hover:shadow-2xl hover:shadow-emerald-500/40 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
        title={`Contactar a ${agentProfile.name} por WhatsApp`}
        aria-label="Contactar por WhatsApp"
      >
        {/* Efecto de pulso concéntrico */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 animate-ping pointer-events-none group-hover:opacity-0" />
        
        <WhatsAppIcon className="w-8 h-8 drop-shadow-sm transition-transform duration-300 group-hover:scale-105" />
      </a>
    </div>
  );
}
