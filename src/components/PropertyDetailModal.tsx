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
  Eye,
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
  const [showOptions, setShowOptions] = useState(false);
  const [copied, setCopied] = useState(false);
  const optionsRef = useRef<HTMLDivElement>(null);

  const [activeMediaTab, setActiveMediaTab] = useState<"video" | "photos">(
    property?.videoUrl ? "video" : "photos"
  );

  useEffect(() => {
    if (property?.videoUrl) {
      setActiveMediaTab("video");
    } else {
      setActiveMediaTab("photos");
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

  // Estados para la mini-calculadora hipotecaria
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
    setActiveImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
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
      // Ignore
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
      className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-0 sm:p-4 md:p-6 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative bg-white w-full max-w-5xl h-[100dvh] sm:h-auto sm:max-h-[92vh] rounded-none sm:rounded-[6px] shadow-2xl overflow-hidden my-0 sm:my-6 border border-neutral-200 flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Barra superior con opciones de lujo */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md z-30 px-4 sm:px-6 py-3.5 border-b border-neutral-200 flex items-center justify-between safe-area-top">
          <div className="flex items-center gap-2.5">
            {/* Código de referencia exclusivo */}
            <span className="text-xs font-mono font-bold tracking-wider text-neutral-800 bg-stone-100 border border-stone-200 px-2.5 py-1 rounded-[3px] shadow-2xs">
              {refCode}
            </span>
            <span className="text-neutral-300">•</span>
            <span className="text-xs font-semibold uppercase tracking-wider text-gold-700 bg-gold-50 border border-gold-200 px-2.5 py-1 rounded-[3px]">
              {property.operation}
            </span>
            {property.isOpportunity && (
              <span className="text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-[3px] flex items-center gap-1 shadow-2xs">
                <Sparkles className="w-3 h-3 text-amber-600" />
                {property.opportunityBadge || "Oportunidad"}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Botón de 3 Puntos animado */}
            <div className="relative" ref={optionsRef}>
              <button
                type="button"
                onClick={() => setShowOptions(!showOptions)}
                className="p-2 min-h-[38px] min-w-[38px] flex items-center justify-center text-neutral-600 hover:text-neutral-900 rounded-full hover:bg-neutral-100 active:scale-90 transition-all cursor-pointer"
                title="Más opciones"
                aria-label="Más opciones"
              >
                <MoreHorizontal className={`w-4 h-4 transition-transform duration-200 ${showOptions ? "rotate-90 text-gold-600" : ""}`} />
              </button>

              {showOptions && (
                <div className="absolute right-0 top-10 w-48 bg-white/95 backdrop-blur-md border border-neutral-200 shadow-xl rounded-[4px] py-1.5 z-40 animate-scale-in">
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="w-full text-left px-3.5 py-2 text-xs text-neutral-700 hover:bg-gold-50 hover:text-gold-700 flex items-center gap-2 transition-colors cursor-pointer"
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
                    className="w-full text-left px-3.5 py-2 text-xs text-neutral-700 hover:bg-gold-50 hover:text-gold-700 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5 text-neutral-500" />
                    <span>Compartir</span>
                  </button>
                </div>
              )}
            </div>

            <Link
              href={`/propiedades/${property.id}`}
              className="text-xs text-neutral-600 hover:text-gold-700 font-medium flex items-center gap-1.5 px-3 py-1.5 rounded-[3px] border border-neutral-200 hover:border-gold-300 transition-all min-h-[38px] btn-tactile cursor-pointer"
              title="Abrir en página completa dedicada"
            >
              <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
              <span className="hidden sm:inline">Página Completa</span>
            </Link>

            <button
              onClick={onClose}
              className="p-2 min-h-[38px] min-w-[38px] flex items-center justify-center text-neutral-400 hover:text-neutral-900 rounded-full hover:bg-neutral-100 active:scale-90 transition-all cursor-pointer"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5 hover:rotate-90 transition-transform duration-200" />
            </button>
          </div>
        </div>

        {/* Contenido scrolleable */}
        <div className="max-h-[82vh] overflow-y-auto p-5 sm:p-6 md:p-8 space-y-8">
          {/* Galería Multimedia Cinemática: Video Tour y Fotos */}
          <div className="space-y-3">
            {/* Barra de Tabs Multimedia con diseño switcher de lujo */}
            {property.videoUrl && (
              <div className="flex items-center gap-2 border-b border-neutral-200 pb-2">
                <button
                  type="button"
                  onClick={() => setActiveMediaTab("video")}
                  className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-[3px] transition-all duration-200 btn-tactile cursor-pointer ${
                    activeMediaTab === "video"
                      ? "bg-red-600 text-white shadow-md shadow-red-600/30 scale-100"
                      : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                  }`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Video Tour Inmersivo</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveMediaTab("photos")}
                  className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-[3px] transition-all duration-200 btn-tactile cursor-pointer ${
                    activeMediaTab === "photos"
                      ? "bg-neutral-900 text-white shadow-md scale-100"
                      : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Fotografías de Alta Resolución ({property.images.length})</span>
                </button>
              </div>
            )}

            {activeMediaTab === "video" && property.videoUrl ? (
              /* Reproductor Cinemático de Video Tour */
              <div className="relative h-80 sm:h-96 md:h-[490px] w-full rounded-[4px] overflow-hidden bg-neutral-950 flex items-center justify-center border border-neutral-800 shadow-2xl group">
                <video
                  src={property.videoUrl}
                  controls
                  autoPlay
                  playsInline
                  preload="metadata"
                  poster={property.images && property.images.length > 0 ? property.images[0] : undefined}
                  className="w-full h-full object-contain"
                >
                  Tu navegador no soporta reproducción directa de video.
                </video>
                <div className="absolute top-3 left-3 bg-red-600/95 text-white text-[11px] font-bold px-3 py-1.5 rounded-[3px] shadow-lg flex items-center gap-2 backdrop-blur-md pointer-events-none">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  <span>VIDEO TOUR 4K • 99 PROPIEDADES</span>
                </div>
              </div>
            ) : (
              /* Galería de Fotos Principal con Flechas Cinemáticas */
              <div className="space-y-3">
                <div className="relative h-80 sm:h-96 md:h-[470px] w-full rounded-[4px] overflow-hidden bg-neutral-950 group">
                  <Image
                    src={property.images[activeImageIndex] || property.images[0]}
                    alt={property.title}
                    fill
                    priority
                    unoptimized={(property.images[activeImageIndex] || property.images[0])?.startsWith("data:")}
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-102"
                  />

                  {/* Flechas de navegación rápida sobre la foto */}
                  {property.images.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={handlePrevPhoto}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 active:scale-90 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all cursor-pointer opacity-90 hover:opacity-100 z-10"
                        aria-label="Foto anterior"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>

                      <button
                        type="button"
                        onClick={handleNextPhoto}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 active:scale-90 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all cursor-pointer opacity-90 hover:opacity-100 z-10"
                        aria-label="Foto siguiente"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}

                  {/* Contador de fotos estilo visor arquitectónico */}
                  <div className="absolute bottom-3 right-3 bg-neutral-950/80 backdrop-blur-md text-white text-xs px-3.5 py-1.5 rounded-[3px] border border-white/10 font-mono">
                    {String(activeImageIndex + 1).padStart(2, "0")} / {String(property.images.length).padStart(2, "0")}
                  </div>
                </div>

                {/* Miniaturas de Fotos con anillo activo dorado */}
                {property.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                    {property.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`relative w-20 h-16 shrink-0 rounded-[3px] overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
                          activeImageIndex === idx
                            ? "border-gold-500 scale-98 shadow-md"
                            : "border-transparent opacity-65 hover:opacity-100 hover:border-neutral-300"
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
                )}
              </div>
            )}
          </div>

          {/* Encabezado: Título y Precios */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-neutral-200">
            <div>
              <div className="flex items-center gap-1.5 text-neutral-500 text-sm mb-2 font-medium">
                <MapPin className="w-4 h-4 text-gold-600 shrink-0" />
                <span>
                  {property.location.address}, {property.location.neighborhood}, {property.location.city}
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
                {property.title}
              </h2>
            </div>
            <div className="text-left md:text-right shrink-0">
              <span className="block text-xs uppercase tracking-wider text-neutral-400 font-medium">
                Valor de Publicación
              </span>
              <span className="font-serif text-3xl font-bold text-neutral-900">
                {formatPrice(property.price)}
              </span>
              {property.features.expenses && property.features.expenses > 0 && (
                <span className="block text-xs text-neutral-400 mt-1">
                  Expensas: ~${property.features.expenses} USD / mes
                </span>
              )}
            </div>
          </div>

          {/* Cuadrícula de Métricas y Características */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 py-2">
            <div className="p-3.5 bg-stone-50 border border-neutral-200 rounded-[3px] text-center hover:border-gold-300 transition-colors">
              <span className="block text-[11px] text-neutral-400 uppercase tracking-wider mb-1 font-medium">
                Sup. Total
              </span>
              <span className="text-base font-semibold text-neutral-800">
                {property.features.totalArea} m²
              </span>
            </div>

            <div className="p-3.5 bg-stone-50 border border-neutral-200 rounded-[3px] text-center hover:border-gold-300 transition-colors">
              <span className="block text-[11px] text-neutral-400 uppercase tracking-wider mb-1 font-medium">
                Sup. Cubierta
              </span>
              <span className="text-base font-semibold text-neutral-800">
                {property.features.coveredArea} m²
              </span>
            </div>

            <div className="p-3.5 bg-stone-50 border border-neutral-200 rounded-[3px] text-center hover:border-gold-300 transition-colors">
              <span className="block text-[11px] text-neutral-400 uppercase tracking-wider mb-1 font-medium">
                Dormitorios
              </span>
              <span className="text-base font-semibold text-neutral-800">
                {property.features.bedrooms}
              </span>
            </div>

            <div className="p-3.5 bg-stone-50 border border-neutral-200 rounded-[3px] text-center hover:border-gold-300 transition-colors">
              <span className="block text-[11px] text-neutral-400 uppercase tracking-wider mb-1 font-medium">
                Baños
              </span>
              <span className="text-base font-semibold text-neutral-800">
                {property.features.bathrooms}
              </span>
            </div>

            <div className="p-3.5 bg-stone-50 border border-neutral-200 rounded-[3px] text-center hover:border-gold-300 transition-colors">
              <span className="block text-[11px] text-neutral-400 uppercase tracking-wider mb-1 font-medium">
                Cocheras
              </span>
              <span className="text-base font-semibold text-neutral-800">
                {property.features.parkingSpaces}
              </span>
            </div>

            <div className="p-3.5 bg-stone-50 border border-neutral-200 rounded-[3px] text-center hover:border-gold-300 transition-colors">
              <span className="block text-[11px] text-neutral-400 uppercase tracking-wider mb-1 font-medium">
                Año / Estado
              </span>
              <span className="text-base font-semibold text-neutral-800">
                {property.features.yearBuilt || "A estrenar"}
              </span>
            </div>
          </div>

          {/* Descripción Detallada */}
          <div className="space-y-3">
            <h3 className="font-serif text-xl font-bold text-neutral-900">
              Memoria Descriptiva
            </h3>
            <p className="text-sm leading-relaxed text-neutral-700 whitespace-pre-line font-light">
              {property.description}
            </p>
          </div>

          {/* Amenities y Equipamiento */}
          {property.amenities.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-serif text-xl font-bold text-neutral-900">
                Comodidades & Amenities
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {property.amenities.map((amenity, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-3 bg-stone-50/80 border border-neutral-200/90 rounded-[3px] text-xs text-neutral-800"
                  >
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-medium">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Módulo Financiero Integrado: Simulador de Cuota UVA */}
          <div className="bg-stone-50 border border-neutral-200 p-6 rounded-[4px] space-y-4">
            <div className="flex items-center gap-2.5">
              <Calculator className="w-5 h-5 text-gold-600" />
              <div>
                <h3 className="font-serif text-lg font-bold text-neutral-900">
                  Simulación de Cuota Hipotecaria Estimada
                </h3>
                <p className="text-xs text-neutral-500 font-light">
                  Calculá tu cuota mensual estimada bajo líneas de crédito UVA y bancarias.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {/* Anticipo */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Anticipo Inicial ({downPaymentPercent}% = USD {(property.price * (downPaymentPercent / 100)).toLocaleString("es-AR")})
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
                <div className="flex justify-between text-[10px] text-neutral-400 mt-1 font-mono">
                  <span>15%</span>
                  <span>30%</span>
                  <span>60%</span>
                </div>
              </div>

              {/* Plazo */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Plazo del Crédito ({loanYears} años)
                </label>
                <select
                  value={loanYears}
                  onChange={(e) => setLoanYears(Number(e.target.value))}
                  className="w-full text-xs p-2.5 bg-white border border-neutral-300 rounded-[3px] focus:outline-none focus:border-gold-500 cursor-pointer"
                >
                  <option value={10}>10 Años (120 cuotas)</option>
                  <option value={15}>15 Años (180 cuotas)</option>
                  <option value={20}>20 Años (240 cuotas)</option>
                  <option value={25}>25 Años (300 cuotas)</option>
                  <option value={30}>30 Años (360 cuotas)</option>
                </select>
              </div>

              {/* Banco de Referencia */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Banco / Tasa de Referencia
                </label>
                <select
                  value={selectedBankId}
                  onChange={(e) => setSelectedBankId(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white border border-neutral-300 rounded-[3px] focus:outline-none focus:border-gold-500 cursor-pointer"
                >
                  {bankRates.map((bank) => (
                    <option key={bank.id} value={bank.id}>
                      {bank.bankName} (Tasa: {bank.rateUva}% + UVA)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Resultado de la simulación */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-white border border-neutral-200 rounded-[3px] mt-4 shadow-2xs">
              <div>
                <span className="block text-[11px] text-neutral-400 uppercase font-medium">
                  Cuota Mensual Estimada
                </span>
                <span className="font-serif text-xl font-bold text-neutral-900">
                  USD {Math.round(estimatedMonthlyPayment).toLocaleString("es-AR")}
                </span>
                <span className="text-[10px] text-neutral-400 block mt-0.5">
                  + ajuste UVA periódico
                </span>
              </div>

              <div>
                <span className="block text-[11px] text-neutral-400 uppercase font-medium">
                  Monto a Financiar
                </span>
                <span className="text-base font-semibold text-neutral-800">
                  USD {Math.round(loanAmount).toLocaleString("es-AR")}
                </span>
                <span className="text-[10px] text-neutral-400 block mt-0.5">
                  ({100 - downPaymentPercent}% del valor total)
                </span>
              </div>

              <div>
                <span className="block text-[11px] text-neutral-400 uppercase font-medium">
                  Ingreso Familiar Requerido
                </span>
                <span className="text-base font-semibold text-emerald-700">
                  ~USD {Math.round(minRequiredIncome).toLocaleString("es-AR")}
                </span>
                <span className="text-[10px] text-neutral-400 block mt-0.5">
                  Relación cuota / ingreso del 25%
                </span>
              </div>
            </div>
          </div>

          {/* Tarjeta de Contacto Directo con el Agente */}
          <div className="bg-neutral-950 text-white p-6 rounded-[4px] flex flex-col md:flex-row items-center justify-between gap-6 border border-white/10 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-gold-400 shrink-0">
                <Image
                  src={agentProfile.photoUrl}
                  alt={agentProfile.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-gold-400 font-semibold">
                  Atención Personalizada
                </span>
                <h4 className="font-serif text-lg font-bold text-white">
                  {agentProfile.name}
                </h4>
                <p className="text-xs text-neutral-400">
                  {agentProfile.roleTitle} • {agentProfile.licenseNumber}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <a
                href={getWhatsAppUrl(agentProfile.whatsappNumber, whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 md:flex-initial bg-[#25D366] hover:bg-[#20ba59] active:scale-95 text-white text-xs font-semibold px-5 py-3 rounded-[3px] transition-all shadow-md hover:shadow-emerald-500/20 flex items-center justify-center gap-2 btn-tactile cursor-pointer"
              >
                <WhatsAppIcon className="w-4 h-4 drop-shadow-sm" />
                <span>Coordinar Visita por WhatsApp</span>
              </a>
              <a
                href={`tel:${agentProfile.phone}`}
                className="flex-1 md:flex-initial bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs font-medium px-4 py-3 rounded-[3px] transition-all flex items-center justify-center gap-2 border border-white/20 btn-tactile cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>Llamar</span>
              </a>
            </div>
          </div>
        </div>

        {/* Barra inferior fija de conversión en teléfonos con feedback táctil */}
        <div className="sticky bottom-0 bg-white/95 backdrop-blur-md border-t border-neutral-200 p-3 px-4 safe-area-bottom-bar flex items-center justify-between gap-3 md:hidden z-30 shadow-[0_-10px_20px_rgba(0,0,0,0.1)] shrink-0">
          <div>
            <span className="block text-[10px] text-neutral-400 uppercase font-medium">Valor Inmueble</span>
            <span className="font-serif text-lg font-bold text-neutral-900">{formatPrice(property.price)}</span>
          </div>
          <a
            href={getWhatsAppUrl(agentProfile.whatsappNumber, whatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-[#25D366] hover:bg-[#20ba59] active:scale-95 text-white text-xs font-semibold py-3 px-4 rounded-[3px] flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all min-h-[44px] touch-target"
          >
            <WhatsAppIcon className="w-4 h-4 drop-shadow-sm" />
            <span>Consultar por WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
