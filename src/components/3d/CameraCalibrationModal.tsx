'use client';

import React, { useState, useCallback } from 'react';
import GaussianSplatViewer from './GaussianSplatViewer';
import { 
  X, 
  Save, 
  RotateCcw, 
  Crosshair, 
  Footprints, 
  ArrowUp, 
  ArrowDown, 
  Move, 
  HelpCircle,
  CheckCircle2
} from 'lucide-react';

export interface CameraCalibrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  roomName: string;
  modelUrl: string;
  format?: 'ply' | 'splat' | 'ksplat' | 'embed';
  initialCameraPosition?: [number, number, number];
  initialCameraTarget?: [number, number, number];
  onSave: (
    position: [number, number, number],
    target: [number, number, number]
  ) => void;
}

export default function CameraCalibrationModal({
  isOpen,
  onClose,
  title,
  roomName,
  modelUrl,
  format,
  initialCameraPosition = [-0.3, 0.55, 0.6],
  initialCameraTarget = [-0.3, 0.55, -0.8],
  onSave,
}: CameraCalibrationModalProps) {
  const [currentPosition, setCurrentPosition] = useState<[number, number, number]>(initialCameraPosition);
  const [currentTarget, setCurrentTarget] = useState<[number, number, number]>(initialCameraTarget);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Escuchar actualizaciones continuas de la cámara mientras el admin se mueve
  const handleCameraChange = useCallback(
    (pos: [number, number, number], target: [number, number, number]) => {
      setCurrentPosition(pos);
      setCurrentTarget(target);
    },
    []
  );

  // Restablecer a valores óptimos recomendados por defecto (centro a 1.7m)
  const handleResetRecommended = () => {
    setCurrentPosition([-0.3, 0.55, 0.6]);
    setCurrentTarget([-0.3, 0.55, -0.8]);
  };

  const handleConfirmSave = () => {
    onSave(currentPosition, currentTarget);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  if (!isOpen) return null;

  // Altura aproximada sobre el nivel del piso (-1.1m)
  const estimatedHeightFromFloor = (currentPosition[1] + 1.1).toFixed(2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-5xl bg-neutral-950 border border-gold-500/30 rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[95vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="calibration-title"
      >
        {/* Cabecera del Modal */}
        <div className="p-4 sm:px-6 bg-luxury-black border-b border-white/10 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gold-500/15 border border-gold-400/40 flex items-center justify-center text-gold-400 shrink-0">
              <Crosshair className="w-4 h-4 animate-spin-slow" />
            </div>
            <div>
              <h3 id="calibration-title" className="font-serif text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>Calibrar Punto de Partida & Altura</span>
                <span className="text-gold-400 font-sans text-xs bg-gold-500/10 border border-gold-500/30 px-2 py-0.5 rounded-full font-medium">
                  {roomName || 'Habitación 3D'}
                </span>
              </h3>
              <p className="text-[11px] text-neutral-400">
                Ubicate en el punto exacto donde querés que comience el visitante al entrar.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
            title="Cerrar sin guardar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Barra Informativa de Coordenadas en Vivo */}
        <div className="bg-neutral-900/90 border-b border-white/5 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-neutral-300">
              <span className="text-neutral-500 uppercase tracking-wider font-sans font-bold text-[10px]">Posición:</span>
              <span className="text-amber-300 font-semibold">X: {currentPosition[0].toFixed(2)}m</span>
              <span className="text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.5 rounded text-[11px]">
                Altura: {currentPosition[1].toFixed(2)}m (~{estimatedHeightFromFloor}m del suelo)
              </span>
              <span className="text-blue-300 font-semibold">Z: {currentPosition[2].toFixed(2)}m</span>
            </div>

            <div className="hidden md:flex items-center gap-1.5 font-mono text-[11px] text-neutral-400">
              <span className="text-neutral-500 uppercase tracking-wider font-sans font-bold text-[10px]">Mirada:</span>
              <span>X: {currentTarget[0].toFixed(2)}</span>
              <span>Y: {currentTarget[1].toFixed(2)}</span>
              <span>Z: {currentTarget[2].toFixed(2)}</span>
            </div>
          </div>

          {/* Guía Rápida de Teclas */}
          <div className="hidden sm:flex items-center gap-2 text-[11px] text-neutral-400 bg-black/40 px-3 py-1 rounded-full border border-white/10">
            <span className="text-gold-300 font-semibold">W A S D:</span> Moverse
            <span className="text-neutral-600">•</span>
            <span className="text-amber-300 font-semibold">Q:</span> Bajar
            <span className="text-amber-300 font-semibold">E:</span> Subir
            <span className="text-neutral-600">•</span>
            <span className="text-white font-semibold">Mouse:</span> Mirar
          </div>
        </div>

        {/* Área del Visor 3D Interactivo */}
        <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] bg-black overflow-hidden">
          <GaussianSplatViewer
            modelUrl={modelUrl}
            format={format}
            initialCameraPosition={initialCameraPosition}
            initialCameraTarget={initialCameraTarget}
            className="w-full h-full"
            propertyTitle={`Calibración - ${roomName}`}
            isCalibrating={true}
            onCameraChange={handleCameraChange}
          />
        </div>

        {/* Barra de Acciones Inferior */}
        <div className="p-3 sm:p-4 bg-luxury-black border-t border-white/10 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetRecommended}
              className="text-xs text-neutral-400 hover:text-white px-3 py-2 rounded-lg border border-white/10 hover:border-white/20 transition-all flex items-center gap-1.5"
              title="Volver a los valores sugeridos por defecto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restablecer sugerido (1.7m)</span>
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-neutral-300 hover:text-white px-4 py-2 rounded-lg border border-white/15 hover:bg-white/5 transition-colors font-medium"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={handleConfirmSave}
              className={`text-xs font-bold px-5 py-2.5 rounded-lg transition-all shadow-lg flex items-center gap-2 ${
                savedSuccess
                  ? 'bg-emerald-500 text-luxury-black scale-95'
                  : 'bg-gold-500 hover:bg-gold-400 text-luxury-black shadow-gold-500/20 hover:shadow-gold-500/30'
              }`}
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-luxury-black" />
                  <span>¡Punto de Partida Guardado!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Guardar este Punto de Partida</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
