'use client';

import React, { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useData } from '@/context/DataContext';
import { Property } from '@/lib/types';
import {
  ArrowLeft,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Car,
  Calendar,
  Check,
  Phone,
  Share2,
  Sparkles,
  Play,
  Eye,
} from 'lucide-react';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import { getWhatsAppUrl } from '@/lib/whatsapp';

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { properties, agentProfile } = useData();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeMediaTab, setActiveMediaTab] = useState<'video' | 'photos'>('photos');

  const propertyId = params?.id as string;

  const property = useMemo(() => {
    return properties.find((p) => p.id === propertyId || p.slug === propertyId);
  }, [properties, propertyId]);

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
          className="bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold px-5 py-2.5 rounded-sm transition-colors btn-tactile cursor-pointer"
        >
          Volver al Catálogo
        </button>
      </div>
    );
  }

  const hasVideo = !!property.videoUrl;
  const effectiveTab = activeMediaTab === 'video' && !hasVideo ? 'photos' : activeMediaTab;

  const formatPrice = (price: number) =>
    `${property.currency === 'ARS' ? '$' : 'USD'} ${price.toLocaleString('es-AR')}`;

  const whatsappMessage = `Hola ${agentProfile.name}, me interesa la propiedad "${property.title}" (Ref: ${property.id}). ¿Podrías darme más información?`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: property.highlightSummary,
          url: window.location.href,
        });
      } catch {
        // Ignorar
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Enlace copiado al portapapeles');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in pb-24 md:pb-8">
      {/* Barra superior de navegación */}
      <div className="flex items-center justify-between gap-4 border-b border-neutral-200 pb-4">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition-colors btn-tactile cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Catálogo</span>
        </button>
        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 text-xs text-neutral-600 hover:text-neutral-900 px-3 py-1.5 rounded-sm border border-neutral-200 hover:border-neutral-300 transition-colors btn-tactile cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Compartir</span>
        </button>
      </div>

      {/* Breadcrumb */}
      <div className="text-xs text-neutral-400 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1.5">
          <span className="hover:text-neutral-600 cursor-pointer" onClick={() => router.push('/')}>Inicio</span>
          <span>/</span>
          <span className="hover:text-neutral-600 cursor-pointer" onClick={() => router.push('/propiedades')}>Propiedades</span>
          <span>/</span>
          <span className="text-neutral-600 font-medium truncate max-w-[200px]">
            {property.title}
          </span>
        </div>
      </div>

      {/* Sección multimedia principal */}
      <div className="space-y-3">
        {hasVideo && (
          <div className="flex items-center gap-2 border-b border-neutral-200 pb-2">
            <button
              type="button"
              onClick={() => setActiveMediaTab('video')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-sm transition-all btn-tactile cursor-pointer ${
                effectiveTab === 'video'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Video Tour</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveMediaTab('photos')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-sm transition-all btn-tactile cursor-pointer ${
                effectiveTab === 'photos'
                  ? 'bg-neutral-900 text-white shadow-md'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Fotografías (${property.images.length})</span>
            </button>
          </div>
        )}

        {effectiveTab === 'video' && property.videoUrl ? (
          <div className="relative w-full rounded-sm overflow-hidden bg-black border border-neutral-800 shadow-2xl" style={{ aspectRatio: '16/9' }}>
            <video
              src={property.videoUrl}
              controls
              playsInline
              className="w-full h-full object-contain"
            >
              Tu navegador no soporta reproducción de video.
            </video>
            <div className="absolute top-3 left-3 bg-red-600/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-sm shadow flex items-center gap-1.5 backdrop-blur-sm pointer-events-none">
              <Play className="w-3 h-3 fill-white" />
              <span>Video Tour 99 Propiedades</span>
            </div>
          </div>
        ) : (
          <div className="space-y-3" id="galeria">
            <div className="relative w-full rounded-sm overflow-hidden bg-neutral-900 shadow-2xl" style={{ aspectRatio: '16/9' }}>
              <Image
                src={property.images[activeImageIndex] || property.images[0]}
                alt={property.title}
                fill
                priority
                unoptimized={(property.images[activeImageIndex] || property.images[0])?.startsWith('data:')}
                className="object-cover transition-opacity duration-300"
              />
              <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-sm">
                Foto ${activeImageIndex + 1} de ${property.images.length}
              </div>
            </div>
            {property.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {property.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-16 shrink-0 rounded-sm overflow-hidden border-2 transition-all cursor-pointer ${
                      activeImageIndex === idx
                        ? 'border-gold-500 scale-95'
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
            )}
          </div>
        )}
      </div>

      {/* Info de la propiedad */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className="text-xs font-mono font-medium text-neutral-400">REF #${property.id}</span>
            <span className="text-neutral-300">•</span>
            <span className="text-xs font-medium uppercase tracking-wider text-gold-600 bg-gold-50 px-2 py-0.5 rounded-sm">
              ${property.operation}
            </span>
            {property.isOpportunity && (
              <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-sm flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                ${property.opportunityBadge || 'Oportunidad'}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-neutral-400 text-sm mb-2">
            <MapPin className="w-4 h-4 text-gold-500" />
            <span>
              ${property.location.address}, ${property.location.neighborhood}, ${property.location.city}
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900">
            ${property.title}
          </h1>
        </div>
        <div className="text-left md:text-right">
          <span className="block text-xs uppercase tracking-wider text-neutral-400">
            Valor de Publicación
          </span>
          <span className="font-serif text-3xl font-bold text-gold-600">
            ${formatPrice(property.price)}
          </span>
          {property.features.expenses && property.features.expenses > 0 && (
            <span className="block text-xs text-neutral-400 mt-1">
              Expensas: ~$${property.features.expenses} USD / mes
            </span>
          )}
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 py-4">
        {[
          { label: 'Sup. Total', value: `${property.features.totalArea} m²` },
          { label: 'Sup. Cubierta', value: `${property.features.coveredArea} m²` },
          { label: 'Dormitorios', value: String(property.features.bedrooms) },
          { label: 'Baños', value: String(property.features.bathrooms) },
          { label: 'Cocheras', value: String(property.features.parkingSpaces) },
          { label: 'Año / Estado', value: String(property.features.yearBuilt || 'A estrenar') },
        ].map((metric) => (
          <div key={metric.label} className="p-3.5 bg-stone-50 border border-neutral-200/80 rounded-sm text-center">
            <span className="block text-[11px] text-neutral-400 uppercase tracking-wider mb-1">
              ${metric.label}
            </span>
            <span className="text-base font-semibold text-neutral-800">
              ${metric.value}
            </span>
          </div>
        ))}
      </div>

      {/* Descripción */}
      <div className="space-y-3">
        <h2 className="font-serif text-xl font-bold text-neutral-900">
          Memoria Descriptiva
        </h2>
        <p className="text-sm leading-relaxed text-neutral-700 whitespace-pre-line">
          ${property.description}
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
                className="flex items-center gap-2 p-2.5 bg-white border border-neutral-200/80 rounded-sm text-xs text-neutral-800"
              >
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>${amenity}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contacto */}
      <div className="bg-luxury-black text-white p-6 rounded-sm flex flex-col md:flex-row items-center justify-between gap-6 border border-white/10" id="contacto">
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
            <h3 className="font-serif text-lg font-bold text-white">
              ${agentProfile.name}
            </h3>
            <p className="text-xs text-neutral-400">
              ${agentProfile.roleTitle} • ${agentProfile.licenseNumber}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <a
            href={getWhatsAppUrl(agentProfile.whatsappNumber, whatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 md:flex-initial bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold px-5 py-3 rounded-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 btn-tactile cursor-pointer"
          >
            <WhatsAppIcon className="w-4 h-4 drop-shadow-sm" />
            <span>Coordinar Visita</span>
          </a>
          <a
            href={`tel:${agentProfile.phone}`}
            className="flex-1 md:flex-initial bg-white/10 hover:bg-white/20 text-white text-xs font-medium px-4 py-3 rounded-sm transition-colors flex items-center justify-center gap-2 border border-white/20 btn-tactile cursor-pointer"
          >
            <Phone className="w-4 h-4" />
            <span>Llamar</span>
          </a>
        </div>
      </div>

      {/* Barra inferior mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-neutral-200 p-3 px-4 safe-area-bottom-bar flex items-center justify-between gap-3 md:hidden z-30 shadow-[0_-10px_20px_rgba(0,0,0,0.1)]">
        <div>
          <span className="block text-[10px] text-neutral-400 uppercase font-medium">Valor</span>
          <span className="font-serif text-lg font-bold text-gold-600">${formatPrice(property.price)}</span>
        </div>
        <a
          href={getWhatsAppUrl(agentProfile.whatsappNumber, whatsappMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-[#25D366] hover:bg-[#20ba59] active:scale-95 text-white text-xs font-semibold py-3 px-4 rounded-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all min-h-[44px] touch-target"
        >
          <WhatsAppIcon className="w-4 h-4 drop-shadow-sm" />
          <span>Consultar</span>
        </a>
      </div>
    </div>
  );
}
