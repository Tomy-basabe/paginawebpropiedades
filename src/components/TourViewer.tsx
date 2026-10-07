"use client";

import React, { useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { LumaSplatsThree } from "@lumaai/luma-web";
import { Maximize2, Minimize2 } from "lucide-react";

export function TourViewer({ artifactUrl }: { artifactUrl: string }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
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

  return (
    <div 
      ref={containerRef} 
      className={`relative w-full overflow-hidden bg-black rounded-xl shadow-2xl ${
        isFullscreen ? "h-screen" : "h-[500px]"
      }`}
    >
      <button
        onClick={toggleFullscreen}
        className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full backdrop-blur-sm transition-all"
        title="Pantalla Completa"
      >
        {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
      </button>

      <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-black/50 text-white text-sm rounded-full backdrop-blur-sm font-medium">
        Recorrido 3D Interactivo
      </div>

      <Canvas
        camera={{ position: [0, 0, 5], fov: 65 }}
        gl={{ antialias: false }} // Optimización para splats
      >
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          autoRotate={false}
          maxPolarAngle={Math.PI / 2} // Restringe a no ver debajo del piso
        />
        <LumaSplatsComponent url={artifactUrl} />
      </Canvas>
      
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-black/60 text-white text-xs rounded-full backdrop-blur-sm pointer-events-none">
        Usa el ratón o táctil para explorar
      </div>
    </div>
  );
}

// Componente wrapper para el splat de Luma AI
function LumaSplatsComponent({ url }: { url: string }) {
  const splatRef = useRef<LumaSplatsThree | null>(null);

  React.useEffect(() => {
    const splat = new LumaSplatsThree({
      source: url,
    });
    splatRef.current = splat;
    
    return () => {
      splat.dispose();
    };
  }, [url]);

  if (!splatRef.current) return null;

  return <primitive object={splatRef.current} />;
}
