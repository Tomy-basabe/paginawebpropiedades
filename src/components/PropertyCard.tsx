"use client";

import React, { useState, useRef, useEffect } from "react";
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
  Play,
  MoreHorizontal,
  Share2,
  Copy,
  Check,
  Film
} from "lucide-react";
import WhatsAppIcon from "./WhatsAppIcon";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { formatPropertyRef, formatCurrencyPrice } from "@/lib/formatters";

interface PropertyCardProps {
  property: Property;
  onSelectProperty?: (property: Property) => void;
}

export default function PropertyCard({ property, onSelectProperty }: PropertyCardProps) {
  const { agentProfile } = useData();
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const propertyRefCode = formatPropertyRef(property.id);

  // Cerrar menú al hacer click afuera
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    }
    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

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

  const handleCopyLink = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const url = `${window.location.origin}/propiedades/${property.id}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setShowMenu(false);
      }, 1500);
    } catch {
      // Ignorar fallback
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: `${property.title} - ${propertyRefCode}`,
          url: `${window.location.origin}/propiedades/${property.id}`,
        });
      } catch {
        // Fallback silencioso
      }
    } else {
      handleCopyLink(e);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hola ${agentProfile.name}, me interesa recibir más información sobre la propiedad: "${property.title}" (Ref: ${propertyRefCode}) publicada en ${formatCurrencyPrice(property.price, property.currency)}.`
  );

  return (
    <div className="group bg-white rounded-[6px] border border-stone-200 hover:border-gold-400 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative">
      {/* Contenedor de Imagen Arquitectónica */}
      <div 
        className="relative aspect-[16/10] w-full bg-neutral-950 cursor-pointer overflow-hidden"
        onClick={() => onSelectProperty && onSelectProperty(property)}
      >
        <Image
          src={property.images[0] || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"}
          alt={property.title}
          fill
          unoptimized
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Gradiente sutil inferior */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

        {/* Badges superiores - Esquina Izquierda: Estado & Oportunidad */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
          <span className="bg-neutral-950/85 backdrop-blur-md text-white text-[10px] font-semibold uppercase tracking-[0.14em] px-2.5 py-1 rounded-[3px] border border-white/10 shadow-xs">
            {operationLabels[property.operation] || property.operation}
          </span>
          {property.isOpportunity && (
            <span className="bg-gold-600/90 backdrop-blur-md text-white text-[10px] font-semibold uppercase tracking-[0.1em] px-2 py-1 rounded-[3px] shadow-xs">
              Oportunidad
            </span>
          )}
        </div>

        {/* Badges superiores - Esquina Derecha: Video Tour y Menú 3 Puntos */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-20">
          {(property.hasVideoTour || property.videoUrl) && (
            <span className="bg-neutral-950/75 backdrop-blur-md text-white text-[10px] font-medium px-2.5 py-1 rounded-full border border-white/20 flex items-center gap-1 shadow-sm">
              <Play className="w-2.5 h-2.5 fill-white text-white" />
              <span>Video</span>
            </span>
          )}

          {/* Botón de 3 Puntos animado */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="w-8 h-8 rounded-full bg-neutral-950/80 hover:bg-neutral-900 active:scale-90 text-white backdrop-blur-md border border-white/25 flex items-center justify-center transition-all cursor-pointer shadow-md hover:border-gold-400 btn-tactile-pop"
              title="Más opciones"
              aria-label="Más opciones"
            >
              <MoreHorizontal className={`w-4 h-4 transition-transform duration-200 ${showMenu ? "rotate-90 text-gold-400" : ""}`} />
            </button>

            {/* Menú Desplegable con rebote elástico spring */}
            {showMenu && (
              <div 
                className="absolute right-0 top-10 w-48 bg-white/98 backdrop-blur-lg border border-neutral-200 shadow-2xl rounded-lg py-1.5 z-50 animate-popup-spring text-neutral-800"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="w-full text-left px-3.5 py-2 text-xs hover:bg-gold-50 hover:text-gold-700 flex items-center gap-2 transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-semibold">¡Enlace Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-neutral-500" />
                      <span>Copiar Enlace</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="w-full text-left px-3.5 py-2 text-xs hover:bg-gold-50 hover:text-gold-700 flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Compartir</span>
                </button>

                {property.videoUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowMenu(false);
                      onSelectProperty && onSelectProperty(property);
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs hover:bg-red-50 hover:text-red-700 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Film className="w-3.5 h-3.5 text-red-600" />
                    <span>Ver Video Tour 4K</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Tipo de propiedad discreto en la base de la imagen */}
        <div className="absolute bottom-2.5 left-3 z-10">
          <span className="text-[11px] font-semibold text-neutral-200 drop-shadow-md uppercase tracking-wider">
            {typeLabels[property.type] || property.type}
          </span>
        </div>
      </div>

      {/* Cuerpo de la Tarjeta */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Ubicación editorial */}
          <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 uppercase tracking-wider font-semibold mb-1">
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
              {formatCurrencyPrice(property.price, property.currency)}
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

        {/* Botones de Acción con micro-animaciones al tocar */}
        <div className="pt-4 flex items-center gap-2">
          <button
            onClick={() => onSelectProperty && onSelectProperty(property)}
            className="group/btn flex-1 min-h-[42px] bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold py-2.5 px-3 rounded-[4px] shadow-sm hover:shadow-md flex items-center justify-center gap-1.5 btn-tactile-pop cursor-pointer"
          >
            <span>Ver Propiedad</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-gold-400 transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
          </button>

          <a
            href={getWhatsAppUrl(agentProfile.whatsappNumber, `Hola ${agentProfile.name}, quisiera consultar por la propiedad "${property.title}" (Ref: ${propertyRefCode})`)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-[42px] h-[42px] min-w-[42px] min-h-[42px] border border-stone-200 hover:border-emerald-500/50 bg-stone-50 hover:bg-emerald-50 text-neutral-700 hover:text-emerald-700 rounded-[4px] flex items-center justify-center btn-tactile-pop shadow-sm cursor-pointer"
            title={`Consultar por WhatsApp con ${agentProfile.name}`}
            aria-label="Consultar por WhatsApp"
          >
            <WhatsAppIcon className="w-4 h-4 text-[#25D366] transition-transform duration-200 hover:scale-110" />
          </a>
        </div>
      </div>
    </div>
  );
}
