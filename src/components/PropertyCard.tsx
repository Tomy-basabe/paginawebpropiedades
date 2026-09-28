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
  MessageCircle,
  Car
} from "lucide-react";

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
    <div className="group bg-white rounded-sm border border-neutral-200/80 hover:border-gold-400/50 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
      {/* Contenedor de Imagen */}
      <div 
        className="relative h-64 w-full bg-neutral-900 cursor-pointer overflow-hidden"
        onClick={() => onSelectProperty && onSelectProperty(property)}
      >
        <Image
          src={property.images[0] || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"}
          alt={property.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Gradiente sutil inferior para legibilidad */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Badges superiores */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <span className="bg-luxury-black/85 backdrop-blur-md text-white text-[11px] font-medium uppercase tracking-wider px-2.5 py-1 rounded-sm border border-white/10">
            {operationLabels[property.operation] || property.operation}
          </span>
          <span className="bg-white/90 backdrop-blur-md text-neutral-800 text-[11px] font-medium tracking-wide px-2.5 py-1 rounded-sm">
            {typeLabels[property.type] || property.type}
          </span>
          {property.isOpportunity && (
            <span className="bg-gold-500 text-luxury-black text-[11px] font-bold tracking-wide px-2.5 py-1 rounded-sm flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3 h-3" />
              {property.opportunityBadge || "Oportunidad"}
            </span>
          )}
        </div>

        {/* Ubicación en overlay inferior */}
        <div className="absolute bottom-3 left-3 right-3 text-white z-10 flex items-center gap-1.5 text-xs drop-shadow-md">
          <MapPin className="w-3.5 h-3.5 text-gold-400 shrink-0" />
          <span className="truncate font-medium">
            {property.location.neighborhood}, {property.location.city}
          </span>
        </div>
      </div>

      {/* Cuerpo de la Tarjeta */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Precio y Estado */}
          <div className="flex items-baseline justify-between mb-2">
            <div className="font-serif text-2xl font-bold tracking-tight text-neutral-900">
              {formatPrice(property.price, property.currency)}
            </div>
            {property.features.expenses && property.features.expenses > 0 && (
              <span className="text-[11px] text-neutral-400 font-sans">
                + Expensas aprox. ${property.features.expenses} USD
              </span>
            )}
          </div>

          {/* Título de la propiedad */}
          <h3 
            onClick={() => onSelectProperty && onSelectProperty(property)}
            className="text-base font-semibold text-neutral-800 hover:text-gold-600 transition-colors line-clamp-1 cursor-pointer mb-2"
            title={property.title}
          >
            {property.title}
          </h3>

          {/* Breve resumen / highlight */}
          <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed mb-4">
            {property.highlightSummary || property.description}
          </p>

          {/* Ficha técnica compacta */}
          <div className="grid grid-cols-3 gap-2 py-3 border-y border-neutral-100 text-neutral-700 text-xs">
            {property.features.bedrooms > 0 ? (
              <div className="flex items-center gap-1.5" title="Dormitorios">
                <Bed className="w-4 h-4 text-neutral-400" />
                <span>{property.features.bedrooms} dorm.</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5" title="Lote exclusivo">
                <Maximize2 className="w-4 h-4 text-neutral-400" />
                <span>Loteo</span>
              </div>
            )}

            {property.features.bathrooms > 0 && (
              <div className="flex items-center gap-1.5" title="Baños">
                <Bath className="w-4 h-4 text-neutral-400" />
                <span>{property.features.bathrooms} baños</span>
              </div>
            )}

            <div className="flex items-center gap-1.5 justify-end" title="Superficie total">
              <Maximize2 className="w-4 h-4 text-neutral-400" />
              <span>{property.features.totalArea} m² tot.</span>
            </div>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="pt-4 flex items-center gap-2">
          <button
            onClick={() => onSelectProperty && onSelectProperty(property)}
            className="flex-1 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium py-2.5 px-3 rounded-sm transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Ver Ficha Técnica</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-gold-400" />
          </button>

          <a
            href={`https://wa.me/${agentProfile.whatsappNumber}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 border border-emerald-600/30 hover:border-emerald-600 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-sm transition-colors flex items-center justify-center"
            title="Consultar por WhatsApp con Ignacio"
          >
            <MessageCircle className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
