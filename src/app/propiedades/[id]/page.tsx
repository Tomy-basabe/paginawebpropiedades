'use client';

import React, { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
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
  Box,
} from 'lucide-react';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import { getWhatsAppUrl } from '@/lib/whatsapp';

// Lazy load del visor 3D — solo se carga cuando se necesita
const GaussianSplatViewer = dynamic(
  () => import('@/components/3d/GaussianSplatViewer'),
  {
    ssr: false,
    loading: () => (
      <div
        className="w-full bg-luxury-black rounded-sm flex items-center justify-center"
        style={{ aspectRatio: '16/9' }}
      >
        <div className="text-center">
          <div className="w-10 h-10 rounded-full border-2 border-transparent border-t-gold-500 animate-spin mx-auto mb-3" />
          <p className="text-xs text-neutral-500">Cargando visor 3D...</p>
        </div>
      </div>
    ),
  }
);

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { properties, agentProfile } = useData();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeMediaTab, setActiveMediaTab] = useState<'3d' | 'video' | 'photos'>('3d');

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
          className="bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold px-5 py-2.5 rounded-sm transition-colors btn-tactile"
        >
          Volver al Catálogo
        </button>
      </div>
    );
  }

  const has3D = !!(property.model3D?.url || property.has3DTour);
  const hasVideo = !!(property.videoUrl);

  // Determinar tab inicial según contenido disponible
  const effectiveTab = activeMediaTab === '3d' && !has3D
    ? (hasVideo ? 'video' : 'photos')
    : activeMediaTab === 'video' && !hasVideo
    ? (has3D ? '3d' : 'photos')
    : activeMediaTab;

  const formatPrice = (price: number) => `USD ${price.toLocaleString('es-AR')}`;

  const whatsappMessage = `Hola ${agentProfile.name}, quisiera coordinar una visita a la propiedad "${property.title}" (Ref #${property.id}) en ${property.location.neighborhood}. ¿Qué días y horarios tiene disponibles?`;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-28 sm:pb-10 space-y-8">
      {/* Breadcrumb / Volver */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-neutral-500 hover:text-neutral-900 active:bg-neutral-200 rounded-sm hover:bg-neutral-100 transition-colors"
          aria-label="Volver"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <button onClick={() => router.push('/propiedades')} className="hover:text-gold-600 transition-colors">
            Propiedades
          </button>
          <span>/</span>
          <span className="text-neutral-600 font-medium truncate max-w-[200px]">
            {property.title}
          </span>
        </div>
      </div>

      {/* Sección multimedia principal */}
      <div className="space-y-3">
        {/* Tabs multimedia — solo si hay más de un tipo de contenido */}
        {(has3D || hasVideo) && (
          <div className="flex items-center gap-2 border-b border-neutral-200 pb-2">
            {has3D && (
              <button
                type="button"
                onClick={() => setActiveMediaTab('3d')}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-sm transition-all btn-tactile ${
                  effectiveTab === '3d'
                    ? 'bg-gold-500 text-luxury-black shadow-md shadow-gold-500/20'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                <Box className="w-3.5 h-3.5" />
                <span>Recorrido 3D</span>
              </button>
            )}
            {hasVideo && (
              <button
                type="button"
                onClick={() => setActiveMediaTab('video')}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-sm transition-all btn-tactile ${
                  effectiveTab === 'video'
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Video Tour</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setActiveMediaTab('photos')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-sm transition-all btn-tactile ${
                effectiveTab === 'photos'
                  ? 'bg-neutral-900 text-white shadow-md'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Fotografías ({property.images.length})</span>
            </button>
          </div>
        )}

        {/* Contenido multimedia */}
        {effectiveTab === '3d' && property.model3D?.url ? (
          <GaussianSplatViewer
            modelUrl={property.model3D.url}
            format={property.model3D.format}
            initialCameraPosition={property.model3D.initialCameraPosition}
            initialCameraTarget={property.model3D.initialCameraTarget}
            propertyTitle={property.title}
            className="shadow-2xl"
          />
        ) : effectiveTab === 'video' && property.videoUrl ? (
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
          /* Galería de fotos */
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
                Foto {activeImageIndex + 1} de {property.images.length}
              </div>
            </div>
            {property.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {property.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-16 shrink-0 rounded-sm overflow-hidden border-2 transition-all ${
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
            <span className="text-xs font-mono font-medium text-neutral-400">REF #{property.id}</span>
            <span className="text-neutral-300">•</span>
            <span className="text-xs font-medium uppercase tracking-wider text-gold-600 bg-gold-50 px-2 py-0.5 rounded-sm">
              {property.operation}
            </span>
            {property.isOpportunity && (
              <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-sm flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                {property.opportunityBadge || 'Oportunidad'}
              </span>
            )}
            {has3D && (
              <span className="text-xs font-medium text-gold-700 bg-gold-50 px-2 py-0.5 rounded-sm flex items-center gap-1">
                <Box className="w-3 h-3" />
                Recorrido 3D
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-neutral-400 text-sm mb-2">
            <MapPin className="w-4 h-4 text-gold-500" />
            <span>
              {property.location.address}, {property.location.neighborhood}, {property.location.city}
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900">
            {property.title}
          </h1>
        </div>
        <div className="text-left md:text-right">
          <span className="block text-xs uppercase tracking-wider text-neutral-400">
            Valor de Publicación
          </span>
          <span className="font-serif text-3xl font-bold text-gold-600">
            {formatPrice(property.price)}
          </span>
          {property.features.expenses && property.features.expenses > 0 && (
            <span className="block text-xs text-neutral-400 mt-1">
              Expensas: ~${property.features.expenses} USD / mes
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
        <p className="text-sm leading-relaxed text-neutral-700 whitespace-pre-line">
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
                className="flex items-center gap-2 p-2.5 bg-white border border-neutral-200/80 rounded-sm text-xs text-neutral-800"
              >
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{amenity}</span>
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
            className="flex-1 md:flex-initial bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold px-5 py-3 rounded-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 btn-tactile"
          >
            <WhatsAppIcon className="w-4 h-4 drop-shadow-sm" />
            <span>Coordinar Visita</span>
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

      {/* Barra inferior fija en mobile con safe-area para iOS/Android */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-neutral-200 p-3 px-4 safe-area-bottom-bar flex items-center justify-between gap-3 md:hidden z-30 shadow-[0_-10px_20px_rgba(0,0,0,0.1)]">
        <div>
          <span className="block text-[10px] text-neutral-400 uppercase font-medium">Valor</span>
          <span className="font-serif text-lg font-bold text-gold-600">{formatPrice(property.price)}</span>
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
