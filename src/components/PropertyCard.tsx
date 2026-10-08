"use client";

import React from "react";
import Image from "next/image";
import { Property } from "@/lib/types";
import { useData } from "@/context/DataContext";
import { 
  Bed, 
  Bath, 
  Maximize2, 
  MapPin, 
  Sparkles, 
  ArrowUpRight,
  Car,
  Play,
  Video,
  Box
} from "lucide-react";
import WhatsAppIcon from "./WhatsAppIcon";
import { getWhatsAppUrl } from "@/lib/whatsapp";

interface PropertyCardProps {
  property: Property;
  onSelectProperty?: (property: Property) => void;
}

export default function PropertyCard({ property, onSelectProperty }: PropertyCardProps) {
  const { agentProfile } = useData();

  const formatPrice = (price: number, currency: string) => {
    return `${currency === "USD" ? "USD" : "$"} ${price.toLocaleString("es-AR")}`;
  };

  const operationLabels: Record<string, string> = {
    venta: "Venta",
    alquiler: "Alquiler",
    pozo: "En Pozo",
  };

  const typeLabels: Record<string, string> = {
    casa: "Casa",
    departamento: "Departamento",
    loteo: "Lote / Terreno",
    comercial: "Comercial",
    desarrollo: "Emprendimiento",
  };

  const whatsappMessage = encodeURIComponent(
    `Hola ${agentProfile.name}, me interesa recibir más información sobre la propiedad: "${property.title}" (Ref: ${property.id}) publicada en USD ${property.price.toLocaleString("es-AR")}.`
  );

  return (
    <div className="group bg-white rounded-[4px] border border-stone-200/90 hover:border-gold-400/80 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden">
      {/* Contenedor de Imagen Arquitectónica */}
      <div 
        className="relative aspect-[16/10] w-full bg-neutral-950 cursor-pointer overflow-hidden"
        onClick={() => onSelectProperty && onSelectProperty(property)}
      >
        <Image
          src={property.images[0] || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"}
          alt={property.title}
          fill
          unoptimized={property.images[0]?.startsWith("data:")}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Gradiente sutil inferior */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/50 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

        {/* Badges superiores - Esquina Izquierda: Estado & Tipo */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
          <span className="bg-neutral-950/85 backdrop-blur-md text-white text-[10px] font-medium uppercase tracking-[0.12em] px-2.5 py-1 rounded-[2px] border border-white/10 shadow-xs">
            {operationLabels[property.operation] || property.operation}
          </span>
          {property.isOpportunity && (
            <span className="bg-gold-500 text-neutral-950 text-[10px] font-semibold tracking-wide px-2 py-1 rounded-[2px] flex items-center gap-1 shadow-xs">
              <Sparkles className="w-2.5 h-2.5" />
              <span>{property.opportunityBadge || "Destacada"}</span>
            </span>
          )}
        </div>

        {/* Badges superiores - Esquina Derecha: Medios Inmersivos (3D / Video) */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          {(property.has3DTour || property.model3D?.url) && (
            <span className="bg-neutral-950/85 backdrop-blur-md border border-gold-400/40 text-gold-300 text-[10px] font-medium px-2 py-1 rounded-[2px] flex items-center gap-1 shadow-xs">
              <Box className="w-3 h-3 text-gold-400" />
              <span>Tour 3D</span>
            </span>
          )}
          {(property.hasVideoTour || property.videoUrl) && (
            <span className="bg-neutral-950/85 backdrop-blur-md border border-white/10 text-white text-[10px] font-medium px-2 py-1 rounded-[2px] flex items-center gap-1 shadow-xs">
              <Play className="w-2.5 h-2.5 fill-current text-neutral-200" />
              <span>Video</span>
            </span>
          )}
        </div>

        {/* Tipo de propiedad discreto en la base de la imagen */}
        <div className="absolute bottom-2.5 left-3 z-10">
          <span className="text-[11px] font-medium text-neutral-200 drop-shadow-sm uppercase tracking-wider">
            {typeLabels[property.type] || property.type}
          </span>
        </div>
      </div>

      {/* Cuerpo de la Tarjeta */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Ubicación editorial */}
          <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 uppercase tracking-wider font-medium mb-1">
            <MapPin className="w-3.5 h-3.5 text-gold-600 shrink-0" />
            <span className="truncate">
              {property.location.neighborhood}, {property.location.city}
            </span>
          </div>

          {/* Título de la propiedad */}
          <h3 
            onClick={() => onSelectProperty && onSelectProperty(property)}
            className="text-[15px] font-semibold text-neutral-900 hover:text-gold-700 transition-colors duration-200 line-clamp-1 cursor-pointer mb-2"
            title={property.title}
          >
            {property.title}
          </h3>

          {/* Precio y Expensas */}
          <div className="flex items-baseline justify-between mb-3">
            <div className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 group-hover:text-gold-700 transition-colors duration-200">
              {formatPrice(property.price, property.currency)}
            </div>
            {property.features.expenses && property.features.expenses > 0 && (
              <span className="text-[11px] text-neutral-400 font-sans">
                + Exp. ${property.features.expenses} USD
              </span>
            )}
          </div>

          {/* Breve resumen editorial */}
          <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed mb-4 min-h-[2rem]">
            {property.highlightSummary || property.description}
          </p>

          {/* Ficha técnica compacta */}
          <div className="grid grid-cols-3 gap-2 py-3 border-y border-stone-100 text-neutral-600 text-xs">
            {property.features.bedrooms > 0 ? (
              <div className="flex items-center gap-1.5" title="Dormitorios">
                <Bed className="w-3.5 h-3.5 text-neutral-400" />
                <span className="font-medium text-neutral-700">{property.features.bedrooms} dorm.</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5" title="Lote exclusivo">
                <Maximize2 className="w-3.5 h-3.5 text-neutral-400" />
                <span className="font-medium text-neutral-700">Lote</span>
              </div>
            )}

            {property.features.bathrooms > 0 && (
              <div className="flex items-center gap-1.5" title="Baños">
                <Bath className="w-3.5 h-3.5 text-neutral-400" />
                <span className="font-medium text-neutral-700">{property.features.bathrooms} baños</span>
              </div>
            )}

            <div className="flex items-center gap-1.5 justify-end" title="Superficie total">
              <Maximize2 className="w-3.5 h-3.5 text-neutral-400" />
              <span className="font-medium text-neutral-700">{property.features.totalArea} m²</span>
            </div>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="pt-4 flex items-center gap-2">
          <button
            onClick={() => onSelectProperty && onSelectProperty(property)}
            className="group/btn flex-1 min-h-[40px] bg-neutral-900 hover:bg-neutral-800 active:scale-[0.98] text-white text-xs font-medium py-2.5 px-3 rounded-[3px] transition-all duration-200 flex items-center justify-center gap-1.5 btn-tactile shadow-2xs hover:shadow-xs"
          >
            <span>Ver Propiedad</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-gold-400 transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
          </button>

          <a
            href={getWhatsAppUrl(agentProfile.whatsappNumber, `Hola ${agentProfile.name}, quisiera consultar por la propiedad "${property.title}" (Ref: ${property.id})`)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-[40px] h-[40px] min-w-[40px] min-h-[40px] border border-stone-200 hover:border-emerald-500/50 active:scale-[0.95] bg-stone-50 hover:bg-emerald-50 text-neutral-700 hover:text-emerald-700 rounded-[3px] transition-all duration-200 flex items-center justify-center btn-tactile shadow-2xs"
            title={`Consultar por WhatsApp con ${agentProfile.name}`}
            aria-label="Consultar por WhatsApp"
          >
            <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
          </a>
        </div>
      </div>
    </div>
  );
}
