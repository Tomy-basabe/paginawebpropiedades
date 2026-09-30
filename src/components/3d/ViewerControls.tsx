'use client';

import React from 'react';

interface ViewerControlsProps {
  onResetCamera: () => void;
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
}

export default function ViewerControls({
  onResetCamera,
  onToggleFullscreen,
  isFullscreen,
}: ViewerControlsProps) {
  return (
    <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-2 opacity-0 group-hover/viewer:opacity-100 transition-opacity duration-300 sm:opacity-100">
      {/* Fullscreen */}
      <button
        onClick={onToggleFullscreen}
        className="w-10 h-10 bg-black/60 hover:bg-black/80 backdrop-blur-sm text-white rounded-sm border border-white/15 hover:border-white/30 transition-all flex items-center justify-center btn-tactile shadow-lg"
        aria-label={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
        title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
      >
        {isFullscreen ? (
          <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
          </svg>
        ) : (
          <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
          </svg>
        )}
      </button>

      {/* Reset cámara */}
      <button
        onClick={onResetCamera}
        className="w-10 h-10 bg-black/60 hover:bg-black/80 backdrop-blur-sm text-white rounded-sm border border-white/15 hover:border-white/30 transition-all flex items-center justify-center btn-tactile shadow-lg"
        aria-label="Restablecer vista"
        title="Restablecer vista"
      >
        <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
        </svg>
      </button>
    </div>
  );
}
