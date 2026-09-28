"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useData } from "@/context/DataContext";
import { MessageCircle, X } from "lucide-react";

export default function WhatsAppFloat() {
  const { agentProfile } = useData();
  const [showTooltip, setShowTooltip] = useState(true);

  const defaultMsg = encodeURIComponent(
    `Hola ${agentProfile.name}, estoy navegando tu sitio web inmobiliario y quisiera hacerte una consulta.`
  );

  return (
    <div className="hidden md:flex fixed bottom-6 right-6 z-40 items-end gap-3">
      {/* Tooltip con saludo del agente */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-3 bg-white p-3 rounded-sm shadow-xl border border-neutral-200 text-xs max-w-xs animate-fade-in">
          <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 border border-gold-400">
            <Image
              src={agentProfile.photoUrl}
              alt={agentProfile.name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <div className="font-semibold text-neutral-900 flex items-center gap-1.5">
              <span>{agentProfile.name}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-[11px] text-neutral-500">
              ¿Buscás comprar o tasar una propiedad? Hablemos directo.
            </p>
          </div>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-neutral-400 hover:text-neutral-700 ml-1"
            aria-label="Cerrar mensaje"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Botón Flotante */}
      <a
        href={`https://wa.me/${agentProfile.whatsappNumber}?text=${defaultMsg}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-emerald-600/30 flex items-center justify-center transition-all duration-300 hover:scale-105"
        title="Contactar a Ignacio por WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
      </a>
    </div>
  );
}
