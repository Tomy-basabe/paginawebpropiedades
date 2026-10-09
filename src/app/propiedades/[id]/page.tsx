'use client';

import React, { useMemo, useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useData } from '@/context/DataContext';
import { Property } from '@/lib/types';
import {
  ArrowLeft,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Check,
  Phone,
  Share2,
  Sparkles,
  Play,
  Eye,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Copy,
  Calculator,
  ExternalLink
} from 'lucide-react';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import { getWhatsAppUrl } from '@/lib/whatsapp';
import { formatPropertyRef, formatCurrencyPrice } from '@/lib/formatters';
import { getGoogleMapsEmbedUrl, getGoogleMapsExternalLink } from '@/lib/maps';

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { properties, agentProfile, bankRates } = useData();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showOptions, setShowOptions] = useState(false);
  const [copied, setCopied] = useState(false);
  const optionsRef = useRef<HTMLDivElement>(null);

  const propertyId = params?.id as string;

  const property = useMemo(() => {
    return properties.find((p) => p.id === propertyId || p.slug === propertyId);
  }, [properties, propertyId]);

  const [activeMediaTab, setActiveMediaTab] = useState<'video' | 'photos'>('photos');

  useEffect(() => {
    if (property?.videoUrl) {
      setActiveMediaTab('video');
    } else {
      setActiveMediaTab('photos');
    }
  }, [property?.videoUrl]);

  // Cerrar menú de 3 puntos al clickear afuera
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (optionsRef.current && !optionsRef.current.contains(e.target as Node)) {
        setShowOptions(false);
      }
    }
    if (showOptions) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showOptions]);

  // Mini calculadora
  const [downPaymentPercent, setDownPaymentPercent] = useState(25);
  const [loanYears, setLoanYears] = useState(30);
  const [selectedBankId, setSelectedBankId] = useState(bankRates[0]?.id || "custom");

  if (!property) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-6">
          <MapPin className="w-7 h-7 text-neutral-400" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-neutral-800 mb-3">
          Propiedad no encontrada
        </h1>
        <p className="text-sm text-neutral-500 mb-6">
          La propiedad que buscás no existe o fue removida del catálogo.
        </p>
        <button
          onClick={() => router.push('/propiedades')}
          className="bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold px-5 py-2.5 rounded-[3px] transition-all btn-tactile cursor-pointer"
        >
          Volver al Catálogo
        </button>
      </div>
    );
  }

  const refCode = formatPropertyRef(property.id);
  const hasVideo = !!property.videoUrl;
  const effectiveTab = activeMediaTab === 'video' && !hasVideo ? 'photos' : activeMediaTab;

  const formatPrice = (price: number) => {
    return formatCurrencyPrice(price, property.currency);
  };

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

  const whatsappMessage = `Hola ${agentProfile.name}, me interesa la propiedad "${property.title}" (Ref: ${refCode}). ¿Podrías brindarme más detalles y coordinar una visita?`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
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
          url: window.location.href,
        });
      } catch {
        // Ignorar
      }
    } else {
      handleCopyLink();
    }
  };

  const handleNextPhoto = () => {
    setActiveImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const handlePrevPhoto = () => {
    setActiveImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  const propertyJsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: `${property.title} - ${property.location.city}, Santa Cruz`,
    description: property.description,
    url: `https://99propiedades.com.ar/propiedades/${property.id}`,
    image: property.images,
    offers: {
      "@type": "Offer",
      price: property.price,
      priceCurrency: property.currency,
      availability:
        property.status === "disponible"
          ? "https://schema.org/InStock"
          : "https://schema.org/SoldOut",
    },
    spatialCoverage: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        streetAddress: property.location.address,
        addressLocality: property.location.city,
        addressRegion: property.location.zone || "Santa Cruz",
        addressCountry: "AR",
      },
    },
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in pb-28 md:pb-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(propertyJsonLd) }}
      />
      {/* Barra superior de navegación y acciones */}
      <div className="flex items-center justify-between gap-4 border-b border-neutral-200 pb-4">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition-colors btn-tactile cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Catálogo</span>
        </button>

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

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 text-xs text-neutral-700 hover:text-neutral-950 px-3.5 py-1.5 rounded-[3px] border border-neutral-200 hover:border-neutral-300 transition-all btn-tactile cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Compartir</span>
          </button>
        </div>
      </div>

      {/* Breadcrumb refinado */}
      <div className="text-xs text-neutral-400 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1.5">
          <Link href="/" className="hover:text-neutral-700 transition-colors">Inicio</Link>
          <span>/</span>
          <Link href="/propiedades" className="hover:text-neutral-700 transition-colors">Propiedades</Link>
          <span>/</span>
          <span className="text-neutral-700 font-medium truncate max-w-[240px]">
            {property.title}
          </span>
        </div>
      </div>

      {/* Sección multimedia principal limpia y cinematográfica */}
      <div className="space-y-3">
        <div className="relative w-full rounded-xl overflow-hidden bg-neutral-950 shadow-xl">
          {effectiveTab === 'video' && property.videoUrl ? (
            /* Reproductor Cinemático de Video Adaptable */
            <div className="relative w-full max-h-[62vh] sm:max-h-[520px] flex items-center justify-center bg-black/95">
              <video
                src={property.videoUrl}
                controls
                autoPlay
                playsInline
                preload="metadata"
                poster={property.images?.[0]}
                className="max-h-[62vh] sm:max-h-[520px] w-auto max-w-full object-contain mx-auto"
              >
                Tu navegador no soporta reproducción de video.
              </video>

              {property.images?.length > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveMediaTab('photos')}
                  className="absolute top-4 right-4 bg-neutral-950/80 hover:bg-neutral-900 active:scale-90 text-white text-xs font-semibold px-3.5 py-1.5 rounded-full border border-white/20 flex items-center gap-1.5 shadow-md btn-tactile-pop cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Ver Fotografías ({property.images.length})</span>
                </button>
              )}
            </div>
          ) : (
            /* Galería de Fotografías con Navegación Táctil */
            <div className="relative aspect-[16/10] sm:h-[480px] w-full group">
              <Image
                src={property.images[activeImageIndex] || property.images[0]}
                alt={property.title}
                fill
                priority
                unoptimized={(property.images[activeImageIndex] || property.images[0])?.startsWith('data:')}
                className="object-cover"
              />

              {property.images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevPhoto}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all cursor-pointer btn-tactile-pop z-10"
                    aria-label="Foto anterior"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    type="button"
                    onClick={handleNextPhoto}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all cursor-pointer btn-tactile-pop z-10"
                    aria-label="Foto siguiente"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              <div className="absolute bottom-3 right-3 bg-neutral-950/80 backdrop-blur-md text-white text-xs px-3.5 py-1.5 rounded-full font-mono">
                {String(activeImageIndex + 1).padStart(2, '0')} / {String(property.images.length).padStart(2, '0')}
              </div>

              {property.videoUrl && (
                <button
                  type="button"
                  onClick={() => setActiveMediaTab('video')}
                  className="absolute top-4 left-4 bg-red-600/90 hover:bg-red-600 text-white text-xs font-bold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg btn-tactile-pop cursor-pointer backdrop-blur-sm"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Reproducir Video Tour</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Tira de Miniaturas Integrada */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {property.videoUrl && (
            <button
              type="button"
              onClick={() => setActiveMediaTab('video')}
              className={`relative w-20 h-14 shrink-0 rounded-lg overflow-hidden border-2 transition-all flex items-center justify-center bg-neutral-900 cursor-pointer btn-tactile-pop ${
                effectiveTab === 'video' ? 'border-red-500 scale-95 shadow-md' : 'border-transparent opacity-80 hover:opacity-100'
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
                setActiveMediaTab('photos');
                setActiveImageIndex(idx);
              }}
              className={`relative w-20 h-14 shrink-0 rounded-lg overflow-hidden border-2 transition-all cursor-pointer btn-tactile-pop ${
                effectiveTab === 'photos' && activeImageIndex === idx
                  ? 'border-gold-500 scale-95 shadow-md'
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <Image
                src={img}
                alt={`Miniatura ${idx + 1}`}
                fill
                unoptimized={img.startsWith('data:')}
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Info Principal de la propiedad */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap mb-2.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-gold-700 bg-gold-50 border border-gold-200 px-3 py-1 rounded-[3px]">
              {property.operation}
            </span>
            {property.isOpportunity && (
              <span className="text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-[3px] flex items-center gap-1">
                {property.opportunityBadge || 'Oportunidad'}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-neutral-500 text-sm mb-2 font-medium">
            <MapPin className="w-4 h-4 text-gold-600 shrink-0" />
            <span>
              {property.location.address}, {property.location.neighborhood}, {property.location.city}
            </span>
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-900 tracking-tight">
            {property.title}
          </h1>
        </div>

        <div className="text-left md:text-right shrink-0">
          <span className="block text-xs uppercase tracking-wider text-neutral-400 font-medium">
            Valor de Publicación
          </span>
          <span className="font-serif text-3xl md:text-4xl font-bold text-neutral-900">
            {formatPrice(property.price)}
          </span>
          {property.features.expenses && property.features.expenses > 0 && (
            <span className="block text-xs text-neutral-400 mt-1">
              Expensas: ~${property.features.expenses} USD / mes
            </span>
          )}
        </div>
      </div>

      {/* Métricas Técnicas */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 py-2">
        {[
          { label: 'Sup. Total', value: `${property.features.totalArea} m²` },
          { label: 'Sup. Cubierta', value: `${property.features.coveredArea} m²` },
          { label: 'Dormitorios', value: String(property.features.bedrooms) },
          { label: 'Baños', value: String(property.features.bathrooms) },
          { label: 'Cocheras', value: String(property.features.parkingSpaces) },
          { label: 'Año / Estado', value: String(property.features.yearBuilt || 'A estrenar') },
        ].map((metric) => (
          <div key={metric.label} className="p-3.5 bg-stone-50 border border-neutral-200 rounded-[3px] text-center hover:border-gold-300 transition-colors">
            <span className="block text-[11px] text-neutral-400 uppercase tracking-wider mb-1 font-medium">
              {metric.label}
            </span>
            <span className="text-base font-semibold text-neutral-800">
              {metric.value}
            </span>
          </div>
        ))}
      </div>

      {/* Descripción */}
      <div className="space-y-3">
        <h2 className="font-serif text-xl font-bold text-neutral-900">
          Memoria Descriptiva
        </h2>
        <p className="text-sm leading-relaxed text-neutral-700 whitespace-pre-line font-light">
          {property.description}
        </p>
      </div>

      {/* Amenities */}
      {property.amenities.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-neutral-900">
            Comodidades & Amenities
          </h2>
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

      {/* Ubicación y Mapa en Google Maps */}
      <div className="bg-white border border-neutral-200 p-6 rounded-[4px] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-3">
          <div className="flex items-center gap-2.5">
            <MapPin className="w-5 h-5 text-gold-600 shrink-0" />
            <div>
              <h3 className="font-serif text-lg font-bold text-neutral-900">
                Ubicación en Google Maps
              </h3>
              <p className="text-xs text-neutral-500">
                {[property.location.address, property.location.neighborhood, property.location.city, property.location.zone].filter(Boolean).join(", ")}
              </p>
            </div>
          </div>
          <a
            href={getGoogleMapsExternalLink(property.location)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-800 hover:text-gold-600 px-3.5 py-2 bg-stone-100 hover:bg-stone-200 border border-neutral-200 rounded transition-colors self-start sm:self-auto cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-gold-600" />
            <span>Ver en Google Maps</span>
          </a>
        </div>
        <div className="w-full h-72 sm:h-96 rounded overflow-hidden border border-neutral-200 relative bg-stone-100">
          <iframe
            src={getGoogleMapsEmbedUrl(property.location)}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`Ubicación de ${property.title}`}
            className="w-full h-full"
          />
        </div>
      </div>

      {/* Simulador Hipotecario UVA Integrado */}
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
              className="w-full text-xs p-2.5 bg-white border border-neutral-300 rounded-[3px] focus:outline-none focus:border-gold-500 cursor-pointer"
            >
              <option value={10}>10 Años (120 cuotas)</option>
              <option value={15}>15 Años (180 cuotas)</option>
              <option value={20}>20 Años (240 cuotas)</option>
              <option value={25}>25 Años (300 cuotas)</option>
              <option value={30}>30 Años (360 cuotas)</option>
            </select>
          </div>

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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-white border border-neutral-200 rounded-[3px] mt-4 shadow-2xs">
          <div>
            <span className="block text-[11px] text-neutral-400 uppercase font-medium">Cuota Mensual</span>
            <span className="font-serif text-xl font-bold text-neutral-900">
              USD {Math.round(estimatedMonthlyPayment).toLocaleString("es-AR")}
            </span>
          </div>
          <div>
            <span className="block text-[11px] text-neutral-400 uppercase font-medium">Monto Financiado</span>
            <span className="text-base font-semibold text-neutral-800">
              USD {Math.round(loanAmount).toLocaleString("es-AR")}
            </span>
          </div>
          <div>
            <span className="block text-[11px] text-neutral-400 uppercase font-medium">Ingreso Mínimo Req.</span>
            <span className="text-base font-semibold text-emerald-700">
              ~USD {Math.round(minRequiredIncome).toLocaleString("es-AR")}
            </span>
          </div>
        </div>
      </div>

      {/* Contacto Directo */}
      <div className="bg-neutral-950 text-white p-6 rounded-[4px] flex flex-col md:flex-row items-center justify-between gap-6 border border-white/10 shadow-xl" id="contacto">
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
            <h3 className="font-serif text-lg font-bold text-white">
              {agentProfile.name}
            </h3>
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

      {/* Barra inferior mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-neutral-200 p-3 px-4 safe-area-bottom-bar flex items-center justify-between gap-3 md:hidden z-30 shadow-[0_-10px_20px_rgba(0,0,0,0.1)]">
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
          <span>Consultar</span>
        </a>
      </div>
    </div>
  );
}

