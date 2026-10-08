"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useData } from "@/context/DataContext";
import { X } from "lucide-react";
import WhatsAppIcon from "./WhatsAppIcon";
import { getWhatsAppUrl } from "@/lib/whatsapp";

export default function WhatsAppFloat() {
  const { agentProfile } = useData();
  const [showTooltip, setShowTooltip] = useState(true);

  const defaultMsg = `Hola ${agentProfile.name}, estoy navegando tu sitio web inmobiliario y quisiera hacerte una consulta.`;
  const whatsappUrl = getWhatsAppUrl(agentProfile.whatsappNumber, defaultMsg);

  return (
    <div className="hidden md:flex fixed bottom-6 right-6 z-40 items-end gap-3 pointer-events-auto">
      {/* Tooltip con saludo del agente en desktop */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-3 bg-white p-3 rounded-[4px] shadow-lg border border-stone-200/90 text-xs max-w-xs animate-fade-in">
          <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 border border-gold-400/60 shadow-xs">
            <Image
              src={agentProfile.photoUrl}
              alt={agentProfile.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="pr-1">
            <div className="font-medium text-neutral-900 flex items-center gap-1.5">
              <span>{agentProfile.name}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </div>
            <p className="text-[11px] text-neutral-500 leading-tight mt-0.5 font-light">
              ¿Buscás comprar o tasar una propiedad? Escribime directo por WhatsApp.
            </p>
          </div>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-neutral-400 hover:text-neutral-700 p-1 rounded-sm hover:bg-neutral-100 transition-colors cursor-pointer"
            aria-label="Cerrar mensaje"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Botón Flotante con Logo Oficial de WhatsApp */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative w-13 h-13 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white shadow-lg hover:shadow-xl hover:shadow-emerald-500/25 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95"
        title={`Contactar a ${agentProfile.name} por WhatsApp`}
        aria-label="Contactar por WhatsApp"
      >
        <WhatsAppIcon className="w-7 h-7 drop-shadow-xs transition-transform duration-300 group-hover:scale-105" />
      </a>
    </div>
  );
}
