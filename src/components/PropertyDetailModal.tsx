"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Property } from "@/lib/types";
import { useData } from "@/context/DataContext";
import { 
  X, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize2, 
  Car, 
  Calendar, 
  Check, 
  Phone, 
  Calculator, 
  Share2, 
  Clock,
  Sparkles,
  Play,
  Video,
  Film,
  Eye
} from "lucide-react";
import WhatsAppIcon from "./WhatsAppIcon";

interface PropertyDetailModalProps {
  property: Property | null;
  onClose: () => void;
}

export default function PropertyDetailModal({ property, onClose }: PropertyDetailModalProps) {
  const { agentProfile, bankRates } = useData();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeMediaTab, setActiveMediaTab] = useState<"photos" | "video">(
    property?.videoUrl ? "video" : "photos"
  );

  // Estados para la mini-calculadora hipotecaria dentro de la propiedad
  const [downPaymentPercent, setDownPaymentPercent] = useState(25);
  const [loanYears, setLoanYears] = useState(30);
  const [selectedBankId, setSelectedBankId] = useState(bankRates[0]?.id || "custom");

  if (!property) return null;

  const formatPrice = (price: number) => {
    return `USD ${price.toLocaleString("es-AR")}`;
  };

  // Cálculo de hipoteca
  const selectedBank = bankRates.find((b) => b.id === selectedBankId);
  const annualInterestRate = selectedBank ? selectedBank.rateUva : 5.5; // TNA de referencia
  const loanAmount = property.price * (1 - downPaymentPercent / 100);
  const monthlyRate = annualInterestRate / 100 / 12;
  const totalMonths = loanYears * 12;
  const estimatedMonthlyPayment =
    monthlyRate > 0
      ? (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) /
        (Math.pow(1 + monthlyRate, totalMonths) - 1)
      : loanAmount / totalMonths;

  const minRequiredIncome = estimatedMonthlyPayment / 0.25; // Asumiendo cuota máxima 25% del ingreso familiar

  const whatsappMessage = encodeURIComponent(
    `Hola ${agentProfile.name}, quisiera coordinar una visita a la propiedad "${property.title}" (Ref #${property.id}) en ${property.location.neighborhood}. ¿Qué días y horarios tiene disponibles?`
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-0 sm:p-4 md:p-6 animate-fade-in">
      <div 
        className="relative bg-white w-full max-w-5xl h-[100dvh] sm:h-auto sm:max-h-[92vh] rounded-none sm:rounded-sm shadow-2xl overflow-hidden my-0 sm:my-6 border border-neutral-200 flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Barra superior con cierre */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md z-30 px-4 sm:px-6 py-3.5 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-medium text-neutral-400">
              REF #{property.id}
            </span>
            <span className="text-neutral-300">•</span>
            <span className="text-xs font-medium uppercase tracking-wider text-gold-600 bg-gold-50 px-2 py-0.5 rounded-sm">
              {property.operation}
            </span>
            {property.isOpportunity && (
              <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-sm flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                {property.opportunityBadge || "Oportunidad"}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-full hover:bg-neutral-100 transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido scrolleable */}
        <div className="max-h-[82vh] overflow-y-auto p-6 md:p-8 space-y-8">
          {/* Galería Multimedia: Video Tour Prioritario y Fotos */}
          <div className="space-y-3">
            {/* Barra de Tabs Multimedia (Si la propiedad cuenta con Video Tour) */}
            {property.videoUrl && (
              <div className="flex items-center gap-2 border-b border-neutral-200 pb-2">
                <button
                  type="button"
                  onClick={() => setActiveMediaTab("video")}
                  className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-sm transition-all btn-tactile ${
                    activeMediaTab === "video"
                      ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                      : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                  }`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Video Tour Oficial (Prioritario)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveMediaTab("photos")}
                  className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-sm transition-all btn-tactile ${
                    activeMediaTab === "photos"
                      ? "bg-neutral-900 text-white shadow-md"
                      : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Fotografías ({property.images.length})</span>
                </button>
              </div>
            )}

            {/* Vista de Video Tour */}
            {activeMediaTab === "video" && property.videoUrl ? (
              <div className="relative h-80 sm:h-96 md:h-[480px] w-full rounded-sm overflow-hidden bg-black flex items-center justify-center border border-neutral-800 shadow-2xl">
                <video
                  src={property.videoUrl}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                >
                  Tu navegador no soporta reproducción directa de video.
                </video>
                <div className="absolute top-3 left-3 bg-red-600/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-sm shadow flex items-center gap-1.5 backdrop-blur-sm pointer-events-none">
                  <Play className="w-3 h-3 fill-white" />
                  <span>Video Tour 99 Propiedades</span>
                </div>
              </div>
            ) : (
              /* Galería de Fotos Principal */
              <div className="space-y-3">
                <div className="relative h-80 sm:h-96 md:h-[460px] w-full rounded-sm overflow-hidden bg-neutral-900">
                  <Image
                    src={property.images[activeImageIndex] || property.images[0]}
                    alt={property.title}
                    fill
                    priority
                    unoptimized={(property.images[activeImageIndex] || property.images[0])?.startsWith("data:")}
                    className="object-cover transition-opacity duration-300"
                  />
                  <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-sm">
                    Foto {activeImageIndex + 1} de {property.images.length}
                  </div>
                </div>

                {/* Miniaturas de Fotos */}
                {property.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {property.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`relative w-20 h-16 shrink-0 rounded-sm overflow-hidden border-2 transition-all ${
                          activeImageIndex === idx
                            ? "border-gold-500 scale-95"
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
                )}
              </div>
            )}
          </div>

          {/* Encabezado: Título y Precios */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-neutral-200">
            <div>
              <div className="flex items-center gap-1.5 text-neutral-400 text-sm mb-2">
                <MapPin className="w-4 h-4 text-gold-500" />
                <span>
                  {property.location.address}, {property.location.neighborhood}, {property.location.city}
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900">
                {property.title}
              </h2>
            </div>
            <div className="text-left md:text-right">
              <span className="block text-xs uppercase tracking-wider text-neutral-400">
                Valor de Publicación
              </span>
              <span className="font-serif text-3xl font-bold text-neutral-900 text-gold-600">
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
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 py-4">
            <div className="p-3.5 bg-stone-50 border border-neutral-200/80 rounded-sm text-center">
              <span className="block text-[11px] text-neutral-400 uppercase tracking-wider mb-1">
                Sup. Total
              </span>
              <span className="text-base font-semibold text-neutral-800">
                {property.features.totalArea} m²
              </span>
            </div>

            <div className="p-3.5 bg-stone-50 border border-neutral-200/80 rounded-sm text-center">
              <span className="block text-[11px] text-neutral-400 uppercase tracking-wider mb-1">
                Sup. Cubierta
              </span>
              <span className="text-base font-semibold text-neutral-800">
                {property.features.coveredArea} m²
              </span>
            </div>

            <div className="p-3.5 bg-stone-50 border border-neutral-200/80 rounded-sm text-center">
              <span className="block text-[11px] text-neutral-400 uppercase tracking-wider mb-1">
                Dormitorios
              </span>
              <span className="text-base font-semibold text-neutral-800">
                {property.features.bedrooms}
              </span>
            </div>

            <div className="p-3.5 bg-stone-50 border border-neutral-200/80 rounded-sm text-center">
              <span className="block text-[11px] text-neutral-400 uppercase tracking-wider mb-1">
                Baños
              </span>
              <span className="text-base font-semibold text-neutral-800">
                {property.features.bathrooms}
              </span>
            </div>

            <div className="p-3.5 bg-stone-50 border border-neutral-200/80 rounded-sm text-center">
              <span className="block text-[11px] text-neutral-400 uppercase tracking-wider mb-1">
                Cocheras
              </span>
              <span className="text-base font-semibold text-neutral-800">
                {property.features.parkingSpaces}
              </span>
            </div>

            <div className="p-3.5 bg-stone-50 border border-neutral-200/80 rounded-sm text-center">
              <span className="block text-[11px] text-neutral-400 uppercase tracking-wider mb-1">
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
            <p className="text-sm leading-relaxed text-neutral-700 whitespace-pre-line">
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
                    className="flex items-center gap-2 p-2.5 bg-white border border-neutral-200/80 rounded-sm text-xs text-neutral-800"
                  >
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Módulo Financiero Integrado: Simulador de Cuota para esta propiedad */}
          <div className="bg-stone-50 border border-neutral-200 p-6 rounded-sm space-y-4">
            <div className="flex items-center gap-2.5">
              <Calculator className="w-5 h-5 text-gold-600" />
              <div>
                <h3 className="font-serif text-lg font-bold text-neutral-900">
                  Simulación de Cuota Hipotecaria Estimada
                </h3>
                <p className="text-xs text-neutral-400">
                  Calculá tu cuota mensual estimada bajo líneas de crédito UVA o bancarias tradicionales.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {/* Anticipo */}
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Anticipo Inicial ({downPaymentPercent}% = USD {(property.price * (downPaymentPercent / 100)).toLocaleString("es-AR")})
                </label>
                <input
                  type="range"
                  min="15"
                  max="60"
                  step="5"
                  value={downPaymentPercent}
                  onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                  className="w-full accent-gold-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
                  <span>15%</span>
                  <span>30%</span>
                  <span>60%</span>
                </div>
              </div>

              {/* Plazo */}
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Plazo del Crédito ({loanYears} años)
                </label>
                <select
                  value={loanYears}
                  onChange={(e) => setLoanYears(Number(e.target.value))}
                  className="w-full text-xs p-2.5 bg-white border border-neutral-300 rounded-sm focus:outline-none focus:border-gold-500"
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
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Banco / Tasa de Referencia
                </label>
                <select
                  value={selectedBankId}
                  onChange={(e) => setSelectedBankId(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white border border-neutral-300 rounded-sm focus:outline-none focus:border-gold-500"
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-white border border-neutral-200/90 rounded-sm mt-4">
              <div>
                <span className="block text-[11px] text-neutral-400 uppercase">
                  Cuota Mensual Estimada
                </span>
                <span className="font-serif text-xl font-bold text-neutral-900 text-gold-600">
                  USD {Math.round(estimatedMonthlyPayment).toLocaleString("es-AR")}
                </span>
                <span className="text-[10px] text-neutral-400 block mt-0.5">
                  + ajuste UVA periódico
                </span>
              </div>

              <div>
                <span className="block text-[11px] text-neutral-400 uppercase">
                  Monto a Financiar
                </span>
                <span className="text-base font-semibold text-neutral-800">
                  USD {Math.round(loanAmount).toLocaleString("es-AR")}
                </span>
                <span className="text-[10px] text-neutral-400 block mt-0.5">
                  ({100 - downPaymentPercent}% del valor de tasación)
                </span>
              </div>

              <div>
                <span className="block text-[11px] text-neutral-400 uppercase">
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
          <div className="bg-luxury-black text-white p-6 rounded-sm flex flex-col md:flex-row items-center justify-between gap-6 border border-white/10">
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
                <span className="text-xs uppercase tracking-wider text-gold-400 font-medium">
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
                href={`https://wa.me/${agentProfile.whatsappNumber}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 md:flex-initial bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold px-5 py-3 rounded-sm transition-all shadow-md hover:shadow-lg hover:shadow-emerald-500/20 flex items-center justify-center gap-2 btn-tactile"
              >
                <WhatsAppIcon className="w-4 h-4 drop-shadow-sm" />
                <span>Coordinar Visita por WhatsApp</span>
              </a>
              <a
                href={`tel:${agentProfile.phone}`}
                className="flex-1 md:flex-initial bg-white/10 hover:bg-white/20 text-white text-xs font-medium px-4 py-3 rounded-sm transition-colors flex items-center justify-center gap-2 border border-white/20 btn-tactile"
              >
                <Phone className="w-4 h-4" />
                <span>Llamar</span>
              </a>
            </div>
          </div>
        </div>

        {/* Barra inferior fija de conversión en teléfonos (Thumb-friendly) */}
        <div className="sticky bottom-0 bg-white/95 backdrop-blur-md border-t border-neutral-200 p-3 px-4 flex items-center justify-between gap-3 md:hidden z-30 shadow-2xl shrink-0">
          <div>
            <span className="block text-[10px] text-neutral-400 uppercase font-medium">Valor Inmueble</span>
            <span className="font-serif text-lg font-bold text-neutral-900 text-gold-600">{formatPrice(property.price)}</span>
          </div>
          <a
            href={`https://wa.me/${agentProfile.whatsappNumber}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-[#25D366] hover:bg-[#20ba59] active:scale-95 text-white text-xs font-semibold py-3 px-4 rounded-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all"
          >
            <WhatsAppIcon className="w-4 h-4 drop-shadow-sm" />
            <span>Consultar por WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
