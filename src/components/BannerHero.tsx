"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useData } from "@/context/DataContext";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

export default function BannerHero() {
  const { banners } = useData();
  const activeBanners = banners.filter((b) => b.active);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
  }, [activeBanners.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
  }, [activeBanners.length]);

  // Autoplay con temporizador de 7s que se pausa al pasar el cursor
  useEffect(() => {
    if (activeBanners.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 7000);
    return () => clearInterval(timer);
  }, [activeBanners.length, isPaused, nextSlide, currentIndex]);

  if (activeBanners.length === 0) return null;

  const current = activeBanners[currentIndex] || activeBanners[0];

  // Soporte para swipe táctil en móviles
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) {
      nextSlide();
    } else if (diff < -50) {
      prevSlide();
    }
    touchStartX.current = null;
  };

  return (
    <div
      className="relative w-full overflow-hidden bg-neutral-950 py-12 md:py-16 rounded-[6px] border border-white/[0.08] shadow-2xl transition-all duration-500 group select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background con transiciones cinematográficas entre banners */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {activeBanners.map((banner, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
              }`}
            >
              <Image
                src={banner.imageUrl}
                alt={banner.title}
                fill
                priority={index === 0}
                className={`object-cover transition-transform duration-[8000ms] ease-out ${
                  isActive ? "scale-105" : "scale-100"
                }`}
                style={{ filter: "brightness(0.38) contrast(1.15)" }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent" />
              <div className="absolute inset-0 bg-radial-at-c from-transparent via-neutral-950/40 to-neutral-950/90" />
            </div>
          );
        })}
      </div>

      {/* Contenido animado al cambiar de slide */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
        <div key={current.id} className="max-w-2xl animate-banner-text">
          {/* Badge de Oportunidad Destacada */}
          <div className="inline-flex items-center gap-2 bg-white/[0.08] border border-gold-400/40 text-gold-300 px-3.5 py-1.5 rounded-[3px] text-[11px] font-semibold tracking-[0.16em] uppercase mb-4 backdrop-blur-md shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
            <span>{current.badge || "Oportunidad de Inversión"}</span>
          </div>

          {/* Subtítulo & Título Editorial */}
          <p className="text-xs uppercase tracking-[0.22em] text-neutral-300 font-medium mb-2.5 drop-shadow-sm">
            {current.subtitle}
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-white tracking-tight leading-tight mb-4 drop-shadow-md">
            {current.title}
          </h2>

          {/* Descripción */}
          <p className="text-sm text-neutral-200/90 leading-relaxed font-light mb-8 max-w-xl drop-shadow-sm">
            {current.description}
          </p>

          {/* Botones de Acción con micro-animaciones táctiles */}
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href={current.ctaLink || "/propiedades"}
              className="bg-gold-500 hover:bg-gold-400 active:scale-95 text-neutral-950 font-semibold text-xs uppercase tracking-wider px-6 py-3.5 rounded-[3px] transition-all duration-200 shadow-md hover:shadow-gold-500/20 flex items-center gap-2 btn-tactile group/btn cursor-pointer"
            >
              <span>{current.ctaText || "Descubrir Oportunidad"}</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
            </Link>

            <Link
              href="/contacto?asunto=desarrollo"
              className="text-neutral-200 hover:text-white text-xs font-medium tracking-wider uppercase border-b border-white/30 hover:border-gold-300 pb-1 transition-all duration-200 hover:-translate-y-0.5 active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <span>Solicitar Dossier de Inversión</span>
            </Link>
          </div>
        </div>

        {/* Controles de Slide: Los 3 Puntos Animados y Flechas Táctiles */}
        {activeBanners.length > 1 && (
          <div className="mt-10 sm:mt-0 sm:absolute sm:bottom-7 sm:right-10 flex items-center justify-between sm:justify-end gap-5 z-20">
            {/* Los 3 PUNTOS indicadores del banner con animación de píldora expandida */}
            <div className="flex items-center gap-2 bg-neutral-950/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-lg">
              {activeBanners.map((_, dotIdx) => {
                const isActive = dotIdx === currentIndex;
                return (
                  <button
                    key={dotIdx}
                    onClick={() => setCurrentIndex(dotIdx)}
                    className={`relative transition-all duration-500 ease-out rounded-full cursor-pointer focus:outline-none focus:ring-1 focus:ring-gold-400 ${
                      isActive
                        ? "w-7 h-2 bg-gold-400 shadow-md shadow-gold-500/40"
                        : "w-2 h-2 bg-white/30 hover:bg-white/70 hover:scale-125"
                    }`}
                    aria-label={`Ir a oportunidad ${dotIdx + 1}`}
                  >
                    {isActive && (
                      <span className="sr-only">Activo</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Contador numérico de banners */}
            <div className="text-[11px] font-mono text-neutral-400 tracking-widest hidden sm:block">
              0{currentIndex + 1} / 0{activeBanners.length}
            </div>

            {/* Flechas de navegación con micro-interacción */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={prevSlide}
                className="w-9 h-9 rounded-[3px] bg-white/[0.08] hover:bg-white/[0.18] active:scale-90 text-white backdrop-blur-md border border-white/[0.12] transition-all duration-200 flex items-center justify-center cursor-pointer hover:border-gold-400/50"
                aria-label="Oportunidad anterior"
              >
                <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
              </button>
              <button
                onClick={nextSlide}
                className="w-9 h-9 rounded-[3px] bg-white/[0.08] hover:bg-white/[0.18] active:scale-90 text-white backdrop-blur-md border border-white/[0.12] transition-all duration-200 flex items-center justify-center cursor-pointer hover:border-gold-400/50"
                aria-label="Siguiente oportunidad"
              >
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
