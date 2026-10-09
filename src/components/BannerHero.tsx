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

  // Autoplay con temporizador de 6s
  useEffect(() => {
    if (activeBanners.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [activeBanners.length, isPaused, nextSlide, currentIndex]);

  if (activeBanners.length === 0) return null;

  // Swipe táctil en móviles
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 45) {
      nextSlide();
    } else if (diff < -45) {
      prevSlide();
    }
    touchStartX.current = null;
  };

  return (
    <div
      className="relative w-full overflow-hidden bg-neutral-950 rounded-[8px] border border-white/[0.1] shadow-2xl transition-all select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pista deslizante física con animación visible de traslación horizontal */}
      <div
        className="flex w-full transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {activeBanners.map((banner, index) => (
          <div
            key={banner.id}
            className="w-full shrink-0 min-w-full relative py-12 sm:py-16 md:py-20 px-6 sm:px-10 lg:px-14 overflow-hidden"
          >
            {/* Imagen de fondo con overlay cinemático */}
            <div className="absolute inset-0 z-0">
              <Image
                src={banner.imageUrl}
                alt={banner.title}
                fill
                priority={index === 0}
                className="object-cover scale-105"
                style={{ filter: "brightness(0.32) contrast(1.15)" }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent" />
            </div>

            {/* Contenido textual del banner */}
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-white/[0.08] border border-gold-400/40 text-gold-300 px-3.5 py-1.5 rounded-[3px] text-[11px] font-semibold tracking-[0.16em] uppercase mb-4 backdrop-blur-md shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
                <span>{banner.badge || "Oportunidad de Inversión"}</span>
              </div>

              <p className="text-xs uppercase tracking-[0.22em] text-neutral-300 font-medium mb-2.5 drop-shadow-sm">
                {banner.subtitle}
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-white tracking-tight leading-tight mb-4 drop-shadow-md">
                {banner.title}
              </h2>

              <p className="text-sm text-neutral-200/90 leading-relaxed font-light mb-8 max-w-xl drop-shadow-sm">
                {banner.description}
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href={banner.ctaLink || "/propiedades"}
                  className="bg-gold-500 hover:bg-gold-400 text-neutral-950 font-semibold text-xs uppercase tracking-wider px-6 py-3.5 rounded-[4px] shadow-md hover:shadow-gold-500/20 flex items-center gap-2 btn-tactile-pop cursor-pointer"
                >
                  <span>{banner.ctaText || "Descubrir Oportunidad"}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/contacto?asunto=desarrollo"
                  className="text-neutral-200 hover:text-white text-xs font-medium tracking-wider uppercase border-b border-white/30 hover:border-gold-300 pb-1 transition-all btn-tactile-pop flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Solicitar Dossier</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controles de Slide: Los 3 Puntos Animados y Flechas */}
      {activeBanners.length > 1 && (
        <div className="absolute bottom-6 right-6 sm:right-10 flex items-center gap-4 z-20">
          {/* Los 3 Puntos interactivos con animación elástica de estiramiento */}
          <div className="flex items-center gap-2 bg-neutral-950/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 shadow-lg">
            {activeBanners.map((_, dotIdx) => {
              const isActive = dotIdx === currentIndex;
              return (
                <button
                  key={dotIdx}
                  onClick={() => setCurrentIndex(dotIdx)}
                  className={`transition-all duration-300 ease-out rounded-full cursor-pointer btn-tactile-pop ${
                    isActive
                      ? "w-8 h-2.5 bg-gold-400 shadow-md shadow-gold-500/50"
                      : "w-2.5 h-2.5 bg-white/35 hover:bg-white/70"
                  }`}
                  aria-label={`Ir a banner ${dotIdx + 1}`}
                />
              );
            })}
          </div>

          {/* Flechas Táctiles con micro-rebote */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={prevSlide}
              className="w-9 h-9 rounded-full bg-white/[0.1] hover:bg-white/[0.2] text-white backdrop-blur-md border border-white/[0.15] flex items-center justify-center cursor-pointer btn-tactile-pop"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextSlide}
              className="w-9 h-9 rounded-full bg-white/[0.1] hover:bg-white/[0.2] text-white backdrop-blur-md border border-white/[0.15] flex items-center justify-center cursor-pointer btn-tactile-pop"
              aria-label="Siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
