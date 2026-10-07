"use client";

import React, { useRef, useEffect, useState } from "react";
import { Canvas, extend, useThree } from "@react-three/fiber";
// @ts-ignore
import { OrbitControls as ThreeOrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { LumaSplatsThree } from "@lumaai/luma-web";
import { Maximize2, Minimize2, ExternalLink } from "lucide-react";

import dynamic from "next/dynamic";

const GaussianSplatViewer = dynamic(
  () => import("@/components/3d/GaussianSplatViewer"),
  { ssr: false }
);

extend({ OrbitControls: ThreeOrbitControls });

function Controls() {
  const { camera, gl } = useThree();
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      controlsRef.current?.dispose();
    };
  }, []);

  return (
    // @ts-ignore
    <orbitControls
      ref={controlsRef}
      args={[camera, gl.domElement]}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      autoRotate={false}
      maxPolarAngle={Math.PI / 2}
    />
  );
}

function LumaSplats({ url }: { url: string }) {
  const splatRef = useRef<LumaSplatsThree | null>(null);

  useEffect(() => {
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

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  if (artifactUrl.endsWith('.splat') || artifactUrl.endsWith('.ply') || artifactUrl.startsWith('/models/')) {
    return (
      <div ref={containerRef} className="relative w-full rounded-sm overflow-hidden bg-luxury-black shadow-2xl">
        <GaussianSplatViewer modelUrl={artifactUrl} propertyTitle="Recorrido 3D Inmobiliario" />
      </div>
    );
  }

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
        Recorrido 3D Interactivo (Luma Splats)
      </div>

      <Canvas
        camera={{ position: [0, 1.5, 4], fov: 65 }}
        gl={{ antialias: false, powerPreference: "high-performance" }}
      >
        <Controls />
        <LumaSplats url={artifactUrl} />
      </Canvas>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-black/60 text-white text-xs rounded-full backdrop-blur-sm pointer-events-none">
        Usa el ratón o táctil para rotar, acercar y recorrer
      </div>
    </div>
  );
}
