'use client';

import React, { useState, useEffect } from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight,
  Eye,
  Footprints,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

export type WalkDirection = 'forward' | 'backward' | 'left' | 'right' | 'up' | 'down';

interface WalkNavigationOverlayProps {
  onMoveStart: (direction: WalkDirection) => void;
  onMoveEnd: (direction: WalkDirection) => void;
  activeDirections: {
    forward: boolean;
    backward: boolean;
    left: boolean;
    right: boolean;
    up?: boolean;
    down?: boolean;
  };
  isWalking: boolean;
  isCalibrating?: boolean;
}

export default function WalkNavigationOverlay({
  onMoveStart,
  onMoveEnd,
  activeDirections,
  isWalking,
  isCalibrating = false,
}: WalkNavigationOverlayProps) {
  const [showHint, setShowHint] = useState(true);

  // Ocultar hint automático luego de unos segundos de interacción
  useEffect(() => {
    if (isWalking) {
      const timer = setTimeout(() => setShowHint(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isWalking]);

  const handlePointerDown = (dir: WalkDirection, e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onMoveStart(dir);
  };

  const handlePointerUp = (dir: WalkDirection, e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onMoveEnd(dir);
  };

  const handlePointerLeave = (dir: WalkDirection, e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onMoveEnd(dir);
  };

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-15">
      {/* Badge Superior: POV Primera Persona o Modo Calibración */}
      <div className="absolute top-3 left-3 pointer-events-auto">
        <div className={`inline-flex items-center gap-2 backdrop-blur-md border px-3 py-1.5 rounded-full text-[11px] shadow-lg ${
          isCalibrating 
            ? 'bg-amber-950/90 border-amber-400 text-amber-200' 
            : 'bg-black/75 border-gold-400/30 text-white'
        }`}>
          <span className={`w-2 h-2 rounded-full ${
            isCalibrating 
              ? 'bg-amber-400 animate-pulse' 
              : isWalking 
              ? 'bg-gold-400 animate-ping' 
              : 'bg-emerald-400 animate-pulse'
          }`} />
          <span className="font-semibold flex items-center gap-1.5">
            <Footprints className="w-3.5 h-3.5 text-gold-400" />
            <span>{isCalibrating ? 'Modo Calibración POV' : 'POV Humano'}</span>
          </span>
          <span className="text-neutral-400 text-[10px] hidden sm:inline">
            {isCalibrating ? '• W A S D: Moverse | Q E: Altura' : '• Altura de ojos fija'}
          </span>
        </div>
      </div>

      {/* Cruceta de Navegación interactiva + Controles de Altura si está calibrando */}
      <div className="absolute bottom-4 left-4 pointer-events-auto flex items-end gap-2">
        {/* Cruceta WASD / Flechas */}
        <div className="bg-luxury-black/85 backdrop-blur-md p-2 rounded-2xl border border-white/20 shadow-2xl flex flex-col items-center gap-1">
          {/* Flecha Arriba (Avanzar) */}
          <button
            type="button"
            onPointerDown={(e) => handlePointerDown('forward', e)}
            onPointerUp={(e) => handlePointerUp('forward', e)}
            onPointerLeave={(e) => handlePointerLeave('forward', e)}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
              activeDirections.forward
                ? 'bg-gold-500 text-luxury-black scale-95 shadow-md shadow-gold-500/50'
                : 'bg-white/10 hover:bg-white/20 active:bg-gold-500 active:text-luxury-black text-white'
            }`}
            title="Avanzar (W o Flecha Arriba)"
            aria-label="Avanzar"
          >
            <ChevronUp className="w-6 h-6" strokeWidth={2.5} />
          </button>

          {/* Fila Central: Izquierda - Ojos/POV - Derecha */}
          <div className="flex items-center gap-1">
            {/* Flecha Izquierda */}
            <button
              type="button"
              onPointerDown={(e) => handlePointerDown('left', e)}
              onPointerUp={(e) => handlePointerUp('left', e)}
              onPointerLeave={(e) => handlePointerLeave('left', e)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                activeDirections.left
                  ? 'bg-gold-500 text-luxury-black scale-95 shadow-md shadow-gold-500/50'
                  : 'bg-white/10 hover:bg-white/20 active:bg-gold-500 active:text-luxury-black text-white'
              }`}
              title="Paso a la izquierda (A o Flecha Izquierda)"
              aria-label="Paso a la izquierda"
            >
              <ChevronLeft className="w-6 h-6" strokeWidth={2.5} />
            </button>

            {/* Centro: Indicador POV de los Ojos */}
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors border ${
                isWalking
                  ? 'bg-gold-500/20 border-gold-400 text-gold-400'
                  : 'bg-black/40 border-white/10 text-neutral-400'
              }`}
              title="Punto de vista a la altura de los ojos humanos"
            >
              <Eye className="w-5 h-5 animate-pulse" />
            </div>

            {/* Flecha Derecha */}
            <button
              type="button"
              onPointerDown={(e) => handlePointerDown('right', e)}
              onPointerUp={(e) => handlePointerUp('right', e)}
              onPointerLeave={(e) => handlePointerLeave('right', e)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                activeDirections.right
                  ? 'bg-gold-500 text-luxury-black scale-95 shadow-md shadow-gold-500/50'
                  : 'bg-white/10 hover:bg-white/20 active:bg-gold-500 active:text-luxury-black text-white'
              }`}
              title="Paso a la derecha (D o Flecha Derecha)"
              aria-label="Paso a la derecha"
            >
              <ChevronRight className="w-6 h-6" strokeWidth={2.5} />
            </button>
          </div>

          {/* Flecha Abajo (Retroceder) */}
          <button
            type="button"
            onPointerDown={(e) => handlePointerDown('backward', e)}
            onPointerUp={(e) => handlePointerUp('backward', e)}
            onPointerLeave={(e) => handlePointerLeave('backward', e)}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
              activeDirections.backward
                ? 'bg-gold-500 text-luxury-black scale-95 shadow-md shadow-gold-500/50'
                : 'bg-white/10 hover:bg-white/20 active:bg-gold-500 active:text-luxury-black text-white'
            }`}
            title="Retroceder (S o Flecha Abajo)"
            aria-label="Retroceder"
          >
            <ChevronDown className="w-6 h-6" strokeWidth={2.5} />
          </button>
        </div>

        {/* Columna de Controles de Altura (Solo en Modo Calibración) */}
        {isCalibrating && (
          <div className="bg-luxury-black/90 backdrop-blur-md p-2 rounded-2xl border border-amber-400/40 shadow-2xl flex flex-col items-center gap-1">
            <span className="text-[9px] font-bold text-amber-400 uppercase tracking-wider mb-0.5">Altura</span>
            
            {/* Subir Altura (E) */}
            <button
              type="button"
              onPointerDown={(e) => handlePointerDown('up', e)}
              onPointerUp={(e) => handlePointerUp('up', e)}
              onPointerLeave={(e) => handlePointerLeave('up', e)}
              className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center transition-all ${
                activeDirections.up
                  ? 'bg-amber-400 text-luxury-black scale-95 shadow-md'
                  : 'bg-white/10 hover:bg-amber-500/20 active:bg-amber-400 active:text-luxury-black text-white border border-white/10'
              }`}
              title="Subir Altura (Tecla E)"
              aria-label="Subir Altura (E)"
            >
              <ArrowUp className="w-4 h-4" strokeWidth={2.5} />
              <span className="text-[9px] font-bold">E</span>
            </button>

            {/* Bajar Altura (Q) */}
            <button
              type="button"
              onPointerDown={(e) => handlePointerDown('down', e)}
              onPointerUp={(e) => handlePointerUp('down', e)}
              onPointerLeave={(e) => handlePointerLeave('down', e)}
              className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center transition-all ${
                activeDirections.down
                  ? 'bg-amber-400 text-luxury-black scale-95 shadow-md'
                  : 'bg-white/10 hover:bg-amber-500/20 active:bg-amber-400 active:text-luxury-black text-white border border-white/10'
              }`}
              title="Bajar Altura (Tecla Q)"
              aria-label="Bajar Altura (Q)"
            >
              <ArrowDown className="w-4 h-4" strokeWidth={2.5} />
              <span className="text-[9px] font-bold">Q</span>
            </button>
          </div>
        )}
      </div>

      {/* Cartel flotante de ayuda / instrucciones */}
      {showHint && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-auto">
          <div className="bg-black/85 backdrop-blur-md text-white text-[11px] sm:text-xs px-4 py-2 rounded-full border border-white/20 shadow-xl flex items-center gap-2.5">
            <span className={`w-2 h-2 rounded-full ${isCalibrating ? 'bg-amber-400' : 'bg-gold-400'}`} />
            <span>
              {isCalibrating ? (
                <>
                  <strong className="text-amber-300">W A S D</strong> para moverte • <strong className="text-amber-300">Q / E</strong> para altura • Arrastrá para mirar
                </>
              ) : (
                <>
                  <strong className="text-gold-300">W A S D</strong> o <strong className="text-gold-300">Flechas</strong> para caminar • Arrastrá para mirar
                </>
              )}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
