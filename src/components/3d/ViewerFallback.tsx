'use client';

import React from 'react';

interface ViewerFallbackProps {
  reason: string;
  propertyTitle?: string;
}

export default function ViewerFallback({ reason, propertyTitle }: ViewerFallbackProps) {
  return (
    <div className="relative w-full bg-stone-100 border border-neutral-200 rounded-sm overflow-hidden" style={{ aspectRatio: '16/9' }}>
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
        {/* Icono */}
        <div className="w-14 h-14 rounded-full bg-neutral-200 flex items-center justify-center mb-4">
          <svg className="w-7 h-7 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <h3 className="font-serif text-lg font-semibold text-neutral-800 mb-2">
          Recorrido 3D no disponible
        </h3>

        <p className="text-sm text-neutral-500 max-w-md mb-5 leading-relaxed">
          {reason}
        </p>

        {/* Alternativas */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <a
            href="#galeria"
            className="bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold px-4 py-2.5 rounded-sm transition-colors btn-tactile flex items-center gap-2"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v13.5A1.5 1.5 0 003.75 21z" />
            </svg>
            Ver Galería de Fotos
          </a>
          <a
            href="#contacto"
            className="bg-gold-500 hover:bg-gold-400 text-luxury-black text-xs font-semibold px-4 py-2.5 rounded-sm transition-colors btn-tactile flex items-center gap-2"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
            </svg>
            Solicitar Visita Presencial
          </a>
        </div>
      </div>
    </div>
  );
}
