'use client';

import React from 'react';

interface ViewerLoaderProps {
  progress: number;
}

export default function ViewerLoader({ progress }: ViewerLoaderProps) {
  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-luxury-black">
      {/* Animación de carga */}
      <div className="relative w-16 h-16 mb-6">
        <div className="absolute inset-0 rounded-full border-2 border-white/10" />
        <div
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-gold-500 animate-spin"
          style={{ animationDuration: '1.2s' }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-6 h-6 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
      </div>

      {/* Texto de estado */}
      <h4 className="font-serif text-base font-semibold text-white mb-2">
        Preparando recorrido 3D...
      </h4>
      <p className="text-xs text-neutral-500 mb-5">
        Cargando modelo fotorealista
      </p>

      {/* Barra de progreso */}
      <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-gold-600 to-gold-400 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="text-[10px] text-neutral-600 mt-2 tabular-nums">
        {progress}%
      </span>
    </div>
  );
}
