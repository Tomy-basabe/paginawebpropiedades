"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, CheckCircle, Loader2, Video, AlertCircle } from "lucide-react";

type UploadState = "idle" | "uploading" | "processing" | "success" | "error";

export function PropertyVirtualTourUploader({
  propertyId,
  onUploadSuccess,
}: {
  propertyId: string;
  onUploadSuccess?: (artifactUrl: string) => void;
}) {
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.includes("video/mp4") && !file.type.includes("video/quicktime")) {
      setUploadState("error");
      setErrorMessage("Por favor, sube un video MP4 o MOV.");
      return;
    }

    try {
      setUploadState("uploading");
      
      // Simulación de subida a Supabase
      for (let i = 0; i <= 100; i += 10) {
        await new Promise((res) => setTimeout(res, 200));
        setProgress(i);
      }

      setUploadState("processing");

      // Llamada al backend para procesar en Luma AI
      const response = await fetch("/api/generate-tour", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId,
          videoUrl: "https://ejemplo.com/video-simulado.mp4", // Aquí iría la URL real de Supabase
        }),
      });

      if (!response.ok) throw new Error("Error en el procesamiento 3D");

      const data = await response.json();
      
      setUploadState("success");
      if (onUploadSuccess) onUploadSuccess(data.artifactUrl);

    } catch (err) {
      setUploadState("error");
      setErrorMessage("Hubo un error al generar el recorrido 3D.");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-100">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Generar Recorrido 3D</h3>
      
      <div 
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          uploadState === "idle" ? "border-blue-300 hover:border-blue-500 bg-blue-50 cursor-pointer" : "border-gray-200 bg-gray-50"
        }`}
        onClick={() => uploadState === "idle" && fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="video/mp4,video/quicktime"
          onChange={handleFileChange}
        />

        <AnimatePresence mode="wait">
          {uploadState === "idle" && (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center">
              <UploadCloud className="w-12 h-12 text-blue-500 mb-3" />
              <p className="text-sm text-gray-600 font-medium">Arrastra tu video aquí o haz clic para explorar</p>
              <p className="text-xs text-gray-400 mt-1">Soporta MP4 y MOV de tu smartphone</p>
            </motion.div>
          )}

          {uploadState === "uploading" && (
            <motion.div key="uploading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center">
              <Video className="w-12 h-12 text-blue-500 mb-3 animate-pulse" />
              <p className="text-sm text-gray-700 font-medium mb-2">Subiendo a Supabase...</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">{progress}%</p>
            </motion.div>
          )}

          {uploadState === "processing" && (
            <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center">
              <Loader2 className="w-12 h-12 text-purple-500 mb-3 animate-spin" />
              <p className="text-sm text-gray-700 font-medium">Procesando en IA...</p>
              <p className="text-xs text-purple-600 mt-1 animate-pulse">Renderizando modelo 3D (Esto puede tomar unos minutos)</p>
            </motion.div>
          )}

          {uploadState === "success" && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center">
              <CheckCircle className="w-12 h-12 text-green-500 mb-3" />
              <p className="text-sm text-green-700 font-medium">¡Recorrido 3D generado con éxito!</p>
            </motion.div>
          )}

          {uploadState === "error" && (
            <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
              <AlertCircle className="w-12 h-12 text-red-500 mb-3" />
              <p className="text-sm text-red-700 font-medium">{errorMessage}</p>
              <button 
                onClick={(e) => { e.stopPropagation(); setUploadState("idle"); }}
                className="mt-3 text-xs text-blue-600 underline"
              >
                Intentar nuevamente
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
