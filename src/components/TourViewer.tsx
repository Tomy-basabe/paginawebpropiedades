"use client";

import React, { useRef, useState } from "react";
import { Maximize2, Minimize2, ExternalLink } from "lucide-react";

export function TourViewer({ artifactUrl }: { artifactUrl: string }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch((err) => {
        console.error(`Error al intentar pantalla completa: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Formatear URL de Luma a embed si aplica
  const embedUrl = artifactUrl.includes("lumalabs.ai") && !artifactUrl.includes("embed")
    ? artifactUrl.replace("/capture/", "/embed/")
    : artifactUrl;

  return (
    <div 
      ref={containerRef} 
      className={`relative w-full overflow-hidden bg-black rounded-xl shadow-2xl ${
        isFullscreen ? "h-screen" : "h-[500px]"
      }`}
    >
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <a
          href={artifactUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 bg-black/60 hover:bg-black/90 text-white rounded-full backdrop-blur-sm transition-all shadow-md"
          title="Abrir en ventana externa"
        >
          <ExternalLink size={18} />
        </a>
        <button
          onClick={toggleFullscreen}
          className="p-2 bg-black/60 hover:bg-black/90 text-white rounded-full backdrop-blur-sm transition-all shadow-md"
          title="Pantalla Completa"
        >
          {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
        </button>
      </div>

      <div className="absolute top-4 left-4 z-10 px-3 py-1.5 bg-black/60 text-white text-xs rounded-full backdrop-blur-sm font-medium border border-white/10 shadow-md">
        Recorrido 3D Interactivo
      </div>

      <iframe
        src={embedUrl}
        title="Recorrido 3D Interactivo"
        className="w-full h-full border-0"
        allow="accelerometer; autoplay; camera; gyroscope; vr; xr; xr-spatial-tracking; fullscreen"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
}
