"use client";

import React, { useState } from "react";
import { Share2, Check, Copy, MessageCircle, X } from "lucide-react";
import { getSiteShareData } from "@/lib/share";

interface ShareSiteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShareSiteModal({ isOpen, onClose }: ShareSiteModalProps) {
  const [copied, setCopied] = useState(false);
  const shareData = getSiteShareData();

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareData.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-neutral-900 border border-neutral-700 w-full max-w-md rounded-md shadow-2xl overflow-hidden flex flex-col text-neutral-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800 bg-neutral-950">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-gold-400" />
            <h3 className="font-serif font-bold text-white text-sm">
              Compartir 99 Propiedades
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-5 space-y-4 text-xs">
          <p className="text-neutral-400">
            Comparte el catálogo oficial de propiedades y servicios inmobiliarios con este mensaje profesional:
          </p>

          {/* Vista previa del mensaje */}
          <div className="bg-neutral-950 border border-neutral-800 rounded p-3 text-[11px] font-mono leading-relaxed text-neutral-300 whitespace-pre-line max-h-48 overflow-y-auto select-all">
            {shareData.text}
          </div>

          {/* Botones de Acción */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
            <a
              href={shareData.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Enviar por WhatsApp</span>
            </a>

            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white font-semibold transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-gold-400" />
                  <span>Copiar Mensaje</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
