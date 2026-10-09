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
  const [progress, setProgress] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const SLIDE_DURATION = 5000; // 5 segundos para un movimiento dinámico

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    setProgress(0);
  }, [activeBanners.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
    setProgress(0);
  }, [activeBanners.length]);

  // Temporizador de movimiento continuo con barra de progreso visible
  useEffect(() => {
    if (activeBanners.length <= 1) return;
    if (isPaused) return;

    const intervalTime = 50; // actualizar cada 50ms
    const step = (intervalTime / SLIDE_DURATION) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextSlide();
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [activeBanners.length, isPaused, nextSlide]);

  if (activeBanners.length === 0) return null;

  // Swipe táctil en móviles
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 40) {
      nextSlide();
    } else if (diff < -40) {
      prevSlide();
    }
    touchStartX.current = null;
  };

  return (
    <div
      className="relative w-full overflow-hidden bg-neutral-950 rounded-xl border border-white/[0.1] shadow-2xl select-none group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Barra de progreso de animación visible arriba */}
      {activeBanners.length > 1 && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/10 z-30 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-gold-500 via-amber-400 to-gold-300 transition-all duration-75 ease-linear shadow-sm shadow-gold-500/50"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Pista de banners con desplazamiento físico horizontal continuo */}
      <div
        className="flex w-full transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-transform"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {activeBanners.map((banner, index) => {
          const isCurrent = index === currentIndex;
          return (
            <div
              key={banner.id}
              className="w-full shrink-0 min-w-full relative py-12 sm:py-16 md:py-20 px-6 sm:px-10 lg:px-14 overflow-hidden"
            >
              {/* Imagen con zoom y overlay cinemático */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={banner.imageUrl}
                  alt={banner.title}
                  fill
                  priority={index === 0}
                  className={`object-cover transition-transform duration-[6000ms] ease-out ${
                    isCurrent ? "scale-108" : "scale-100"
                  }`}
                  style={{ filter: "brightness(0.32) contrast(1.15)" }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/85 to-transparent" />
              </div>

              {/* Contenido textual con animación */}
              <div className="relative z-10 max-w-2xl">
                <div className="inline-flex items-center gap-2 bg-white/[0.08] border border-gold-400/40 text-gold-300 px-3.5 py-1.5 rounded-md text-[11px] font-semibold tracking-[0.16em] uppercase mb-4 backdrop-blur-md shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-gold-400 animate-ping" />
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
                    className="bg-gold-500 hover:bg-gold-400 text-neutral-950 font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-lg shadow-lg shadow-gold-500/20 flex items-center gap-2 btn-tactile-pop cursor-pointer"
                  >
                    <span>{banner.ctaText || "Descubrir Oportunidad"}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>

                  <Link
                    href="/contacto?asunto=desarrollo"
                    className="text-neutral-200 hover:text-white text-xs font-semibold tracking-wider uppercase border-b border-white/30 hover:border-gold-300 pb-1 transition-all btn-tactile-pop flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Solicitar Dossier</span>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Flechas laterales táctiles siempre visibles */}
      {activeBanners.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-neutral-950/60 hover:bg-neutral-900/90 active:scale-90 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all z-20 btn-tactile-pop cursor-pointer shadow-lg"
            aria-label="Banner anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-neutral-950/60 hover:bg-neutral-900/90 active:scale-90 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all z-20 btn-tactile-pop cursor-pointer shadow-lg"
            aria-label="Siguiente banner"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Los 3 Puntos interactivos animados abajo */}
      {activeBanners.length > 1 && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-10 flex items-center gap-2.5 z-20 bg-neutral-950/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 shadow-xl">
          {activeBanners.map((_, dotIdx) => {
            const isActive = dotIdx === currentIndex;
            return (
              <button
                key={dotIdx}
                onClick={() => {
                  setCurrentIndex(dotIdx);
                  setProgress(0);
                }}
                className={`transition-all duration-300 ease-out rounded-full cursor-pointer btn-tactile-pop ${
                  isActive
                    ? "w-8 h-2.5 bg-gradient-to-r from-gold-400 to-amber-300 shadow-md shadow-gold-500/50"
                    : "w-2.5 h-2.5 bg-white/30 hover:bg-white/60"
                }`}
                aria-label={`Ir al banner ${dotIdx + 1}`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
