"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Property } from "@/lib/types";
import { useData } from "@/context/DataContext";
import { 
  X, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize2, 
  Check, 
  Phone, 
  Calculator, 
  Share2, 
  Sparkles,
  Play,
  Camera,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Copy
} from "lucide-react";
import WhatsAppIcon from "./WhatsAppIcon";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { formatPropertyRef, formatCurrencyPrice } from "@/lib/formatters";

interface PropertyDetailModalProps {
  property: Property | null;
  onClose: () => void;
}

export default function PropertyDetailModal({ property, onClose }: PropertyDetailModalProps) {
  const { agentProfile, bankRates } = useData();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isVideoMode, setIsVideoMode] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [copied, setCopied] = useState(false);
  const optionsRef = useRef<HTMLDivElement>(null);

  // Inicializar en modo video si tiene video, de lo contrario fotos
  useEffect(() => {
    if (property?.videoUrl) {
      setIsVideoMode(true);
    } else {
      setIsVideoMode(false);
    }
    setActiveImageIndex(0);
  }, [property?.id, property?.videoUrl]);

  // Cerrar menú de 3 puntos al clickear afuera
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (optionsRef.current && !optionsRef.current.contains(e.target as Node)) {
        setShowOptions(false);
      }
    }
    if (showOptions) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showOptions]);

  // Cerrar modal con tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Mini-calculadora hipotecaria
  const [downPaymentPercent, setDownPaymentPercent] = useState(25);
  const [loanYears, setLoanYears] = useState(30);
  const [selectedBankId, setSelectedBankId] = useState(bankRates[0]?.id || "custom");

  if (!property) return null;

  const refCode = formatPropertyRef(property.id);

  const formatPrice = (price: number) => {
    return formatCurrencyPrice(price, property.currency);
  };

  // Cálculo de hipoteca
  const selectedBank = bankRates.find((b) => b.id === selectedBankId);
  const annualInterestRate = selectedBank ? selectedBank.rateUva : 5.5;
  const loanAmount = property.price * (1 - downPaymentPercent / 100);
  const monthlyRate = annualInterestRate / 100 / 12;
  const totalMonths = loanYears * 12;
  const estimatedMonthlyPayment =
    monthlyRate > 0
      ? (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) /
        (Math.pow(1 + monthlyRate, totalMonths) - 1)
      : loanAmount / totalMonths;

  const minRequiredIncome = estimatedMonthlyPayment / 0.25;

  const whatsappMessage = encodeURIComponent(
    `Hola ${agentProfile.name}, quisiera coordinar una visita a la propiedad "${property.title}" (Ref: ${refCode}) en ${property.location.neighborhood}. ¿Qué días y horarios tiene disponibles?`
  );

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVideoMode(false);
    setActiveImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVideoMode(false);
    setActiveImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  const handleCopyLink = async () => {
    try {
      const url = `${window.location.origin}/propiedades/${property.id}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setShowOptions(false);
      }, 1500);
    } catch {
      // Ignorar fallback
    }
  };

  const handleShare = async () => {
    setShowOptions(false);
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: `${property.title} - ${refCode}`,
          url: `${window.location.origin}/propiedades/${property.id}`,
        });
      } catch {
        // Fallback
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative bg-white w-full h-[100dvh] sm:h-auto sm:max-h-[92vh] sm:max-w-4xl rounded-t-2xl sm:rounded-xl shadow-2xl overflow-hidden flex flex-col justify-between border border-neutral-200 animate-sheet-up sm:animate-modal-pop"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Barra superior de navegación limpia y exclusiva */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md z-30 px-4 sm:px-6 py-3 border-b border-neutral-200 flex items-center justify-between safe-area-top shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-gold-700 bg-gold-50 border border-gold-200 px-3 py-1 rounded-[4px]">
              {property.operation}
            </span>
            {property.isOpportunity && (
              <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-[4px] inline-flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>{property.opportunityBadge || "Oportunidad"}</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Botón de 3 Puntos animado */}
            <div className="relative" ref={optionsRef}>
              <button
                type="button"
                onClick={() => setShowOptions(!showOptions)}
                className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-neutral-700 flex items-center justify-center cursor-pointer btn-tactile-pop"
                title="Más opciones"
                aria-label="Más opciones"
              >
                <MoreHorizontal className={`w-4 h-4 transition-transform duration-200 ${showOptions ? "rotate-90 text-gold-600" : ""}`} />
              </button>

              {showOptions && (
                <div className="absolute right-0 top-11 w-48 bg-white/98 backdrop-blur-lg border border-neutral-200 shadow-2xl rounded-lg py-1.5 z-50 animate-popup-spring text-neutral-800">
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="w-full text-left px-3.5 py-2 text-xs hover:bg-gold-50 hover:text-gold-700 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-semibold">¡Copiado!</span>
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
                  <Link
                    href={`/propiedades/${property.id}`}
                    className="w-full text-left px-3.5 py-2 text-xs hover:bg-gold-50 hover:text-gold-700 flex items-center gap-2 transition-colors cursor-pointer border-t border-neutral-100"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
                    <span>Ver Página Completa</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Botón de Cierre 'X' prominente y accesible */}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-neutral-700 flex items-center justify-center cursor-pointer btn-tactile-pop"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5 hover:rotate-90 transition-transform duration-200" />
            </button>
          </div>
        </div>

        {/* Contenido scrolleable */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6">
          {/* Visor Multimedia Cinemático (Sin botones toscos de 3D/video arriba) */}
          <div className="relative w-full rounded-xl overflow-hidden bg-neutral-950 shadow-lg">
            {isVideoMode && property.videoUrl ? (
              /* Reproductor de Video Adaptable (soporta videos verticales y horizontales de manera estética) */
              <div className="relative w-full max-h-[58vh] sm:max-h-[480px] flex items-center justify-center bg-black/95">
                <video
                  src={property.videoUrl}
                  controls
                  autoPlay
                  playsInline
                  preload="metadata"
                  poster={property.images?.[0]}
                  className="max-h-[58vh] sm:max-h-[480px] w-auto max-w-full object-contain mx-auto"
                >
                  Tu navegador no soporta reproducción de video.
                </video>

                {/* Botón flotante para volver a ver las fotos */}
                {property.images?.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setIsVideoMode(false)}
                    className="absolute top-3 right-3 bg-neutral-950/75 hover:bg-neutral-900 active:scale-90 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20 flex items-center gap-1.5 shadow-md btn-tactile-pop cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Ver Fotos ({property.images.length})</span>
                  </button>
                )}
              </div>
            ) : (
              /* Visor de Fotos con Navegación Táctil */
              <div className="relative aspect-[16/10] sm:h-[420px] w-full group">
                <Image
                  src={property.images[activeImageIndex] || property.images[0]}
                  alt={property.title}
                  fill
                  priority
                  unoptimized={(property.images[activeImageIndex] || property.images[0])?.startsWith("data:")}
                  className="object-cover"
                />

                {/* Flechas de navegación rápida */}
                {property.images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={handlePrevPhoto}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all cursor-pointer btn-tactile-pop z-10"
                      aria-label="Foto anterior"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <button
                      type="button"
                      onClick={handleNextPhoto}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all cursor-pointer btn-tactile-pop z-10"
                      aria-label="Foto siguiente"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Contador de fotos en esquina inferior */}
                <div className="absolute bottom-3 right-3 bg-neutral-950/80 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full font-mono">
                  {String(activeImageIndex + 1).padStart(2, "0")} / {String(property.images.length).padStart(2, "0")}
                </div>

                {/* Botón flotante para ver Video Tour si existe */}
                {property.videoUrl && (
                  <button
                    type="button"
                    onClick={() => setIsVideoMode(true)}
                    className="absolute top-3 left-3 bg-red-600/90 hover:bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg btn-tactile-pop cursor-pointer backdrop-blur-sm"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Reproducir Video Tour</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Tira de Miniaturas Multimedia: Fotos + Video */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {property.videoUrl && (
              <button
                type="button"
                onClick={() => setIsVideoMode(true)}
                className={`relative w-20 h-14 shrink-0 rounded-lg overflow-hidden border-2 transition-all flex items-center justify-center bg-neutral-900 cursor-pointer btn-tactile-pop ${
                  isVideoMode ? "border-red-500 scale-95 shadow-md" : "border-transparent opacity-80 hover:opacity-100"
                }`}
              >
                <div className="flex flex-col items-center justify-center text-white">
                  <Play className="w-4 h-4 fill-red-500 text-red-500" />
                  <span className="text-[9px] font-bold mt-0.5">Video</span>
                </div>
              </button>
            )}

            {property.images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setIsVideoMode(false);
                  setActiveImageIndex(idx);
                }}
                className={`relative w-20 h-14 shrink-0 rounded-lg overflow-hidden border-2 transition-all cursor-pointer btn-tactile-pop ${
                  !isVideoMode && activeImageIndex === idx
                    ? "border-gold-500 scale-95 shadow-md"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <Image
                  src={img}
                  alt={`Miniatura ${idx + 1}`}
                  fill
                  unoptimized={img.startsWith("data:")}
                  className="object-cover"
                />
              </button>
            ))}
          </div>

          {/* Encabezado: Título y Precios */}
          <div className="pb-4 border-b border-neutral-200">
            <div className="flex items-center gap-1.5 text-neutral-500 text-xs mb-1.5 font-medium">
              <MapPin className="w-4 h-4 text-gold-600 shrink-0" />
              <span>
                {property.location.address}, {property.location.neighborhood}, {property.location.city}
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 leading-tight">
              {property.title}
            </h2>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-gold-700">
                {formatPrice(property.price)}
              </span>
              {property.features.expenses && property.features.expenses > 0 && (
                <span className="text-xs text-neutral-400">
                  + Exp. ${property.features.expenses} USD
                </span>
              )}
            </div>
          </div>

          {/* Métricas Técnicas */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 py-1">
            <div className="p-3 bg-stone-50 border border-neutral-200 rounded-lg text-center">
              <span className="block text-[10px] text-neutral-400 uppercase font-medium">Sup. Total</span>
              <span className="text-sm font-semibold text-neutral-800">{property.features.totalArea} m²</span>
            </div>
            <div className="p-3 bg-stone-50 border border-neutral-200 rounded-lg text-center">
              <span className="block text-[10px] text-neutral-400 uppercase font-medium">Cubierta</span>
              <span className="text-sm font-semibold text-neutral-800">{property.features.coveredArea} m²</span>
            </div>
            <div className="p-3 bg-stone-50 border border-neutral-200 rounded-lg text-center">
              <span className="block text-[10px] text-neutral-400 uppercase font-medium">Dormitorios</span>
              <span className="text-sm font-semibold text-neutral-800">{property.features.bedrooms}</span>
            </div>
            <div className="p-3 bg-stone-50 border border-neutral-200 rounded-lg text-center">
              <span className="block text-[10px] text-neutral-400 uppercase font-medium">Baños</span>
              <span className="text-sm font-semibold text-neutral-800">{property.features.bathrooms}</span>
            </div>
            <div className="p-3 bg-stone-50 border border-neutral-200 rounded-lg text-center">
              <span className="block text-[10px] text-neutral-400 uppercase font-medium">Cocheras</span>
              <span className="text-sm font-semibold text-neutral-800">{property.features.parkingSpaces}</span>
            </div>
            <div className="p-3 bg-stone-50 border border-neutral-200 rounded-lg text-center">
              <span className="block text-[10px] text-neutral-400 uppercase font-medium">Estado</span>
              <span className="text-sm font-semibold text-neutral-800">{property.features.yearBuilt || "A estrenar"}</span>
            </div>
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <h3 className="font-serif text-lg font-bold text-neutral-900">
              Memoria Descriptiva
            </h3>
            <p className="text-sm leading-relaxed text-neutral-700 whitespace-pre-line font-light">
              {property.description}
            </p>
          </div>

          {/* Amenities */}
          {property.amenities?.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-serif text-lg font-bold text-neutral-900">
                Comodidades & Amenities
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {property.amenities.map((amenity, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2.5 bg-stone-50 border border-neutral-200 rounded-lg text-xs text-neutral-800"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Módulo Financiero UVA */}
          <div className="bg-stone-50 border border-neutral-200 p-5 rounded-xl space-y-4">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-gold-600" />
              <h3 className="font-serif text-base font-bold text-neutral-900">
                Simulador de Cuota Hipotecaria UVA
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Anticipo ({downPaymentPercent}% = USD {(property.price * (downPaymentPercent / 100)).toLocaleString("es-AR")})
                </label>
                <input
                  type="range"
                  min="15"
                  max="60"
                  step="5"
                  value={downPaymentPercent}
                  onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                  className="w-full accent-gold-600 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Plazo ({loanYears} años)
                </label>
                <select
                  value={loanYears}
                  onChange={(e) => setLoanYears(Number(e.target.value))}
                  className="w-full text-xs p-2 bg-white border border-neutral-300 rounded-lg focus:outline-none"
                >
                  <option value={10}>10 Años</option>
                  <option value={15}>15 Años</option>
                  <option value={20}>20 Años</option>
                  <option value={25}>25 Años</option>
                  <option value={30}>30 Años</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Banco Referencia
                </label>
                <select
                  value={selectedBankId}
                  onChange={(e) => setSelectedBankId(e.target.value)}
                  className="w-full text-xs p-2 bg-white border border-neutral-300 rounded-lg focus:outline-none"
                >
                  {bankRates.map((bank) => (
                    <option key={bank.id} value={bank.id}>
                      {bank.bankName} ({bank.rateUva}%)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-3 bg-white border border-neutral-200 rounded-lg flex items-center justify-between gap-4">
              <div>
                <span className="block text-[10px] text-neutral-400 uppercase">Cuota Mensual Estimada</span>
                <span className="font-serif text-lg font-bold text-neutral-900">
                  USD {Math.round(estimatedMonthlyPayment).toLocaleString("es-AR")}
                </span>
              </div>
              <div className="text-right">
                <span className="block text-[10px] text-neutral-400 uppercase">Ingreso Familiar Req.</span>
                <span className="text-sm font-semibold text-emerald-700">
                  ~USD {Math.round(minRequiredIncome).toLocaleString("es-AR")}
                </span>
              </div>
            </div>
          </div>

          {/* Contacto con el Martillero */}
          <div className="bg-neutral-950 text-white p-5 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gold-400 shrink-0">
                <Image
                  src={agentProfile.photoUrl}
                  alt={agentProfile.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="font-serif text-sm font-bold text-white">{agentProfile.name}</h4>
                <p className="text-[11px] text-neutral-400">{agentProfile.roleTitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <a
                href={getWhatsAppUrl(agentProfile.whatsappNumber, whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 btn-tactile-pop cursor-pointer"
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
              <a
                href={`tel:${agentProfile.phone}`}
                className="flex-1 sm:flex-initial bg-white/10 hover:bg-white/20 text-white text-xs font-medium px-4 py-2.5 rounded-lg flex items-center justify-center gap-1.5 border border-white/20 btn-tactile-pop cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Llamar</span>
              </a>
            </div>
          </div>
        </div>

        {/* Barra inferior fija para móviles (despejada, sin tapar precio) */}
        <div className="sticky bottom-0 bg-white/98 backdrop-blur-md border-t border-neutral-200 px-4 py-3 pb-6 flex items-center justify-between gap-3 sm:hidden z-30 shrink-0">
          <div>
            <span className="block text-[10px] text-neutral-400 uppercase font-semibold">Valor</span>
            <span className="font-serif text-base font-bold text-neutral-900 leading-tight">
              {formatPrice(property.price)}
            </span>
          </div>
          <a
            href={getWhatsAppUrl(agentProfile.whatsappNumber, whatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md btn-tactile-pop cursor-pointer"
          >
            <WhatsAppIcon className="w-4 h-4 drop-shadow-sm" />
            <span>Consultar por WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
