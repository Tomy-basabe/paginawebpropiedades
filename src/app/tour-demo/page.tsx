import React from "react";
import { PropertyVirtualTourUploader } from "@/components/PropertyVirtualTourUploader";
import { TourViewer } from "@/components/TourViewer";

export default function TourDemoPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Demo: Visor 3D Inmobiliario</h1>
          <p className="text-gray-500 mt-2">Sube un video para generar el modelo o visualiza el ejemplo.</p>
        </header>

        <section>
          <PropertyVirtualTourUploader propertyId="prop-123" />
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">Visualizador (Luma AI Gaussian Splats)</h2>
          <p className="text-sm text-gray-500">Ejemplo de un renderizado 3D (Gaussian Splatting) usando React Three Fiber y Luma Web.</p>
          {/* Recorrido arquitectónico de demostración */}
          <TourViewer artifactUrl="/models/demo-fast.splat" />
        </section>
      </div>
    </div>
  );
}
