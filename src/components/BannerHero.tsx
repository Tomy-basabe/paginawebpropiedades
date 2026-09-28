"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useData } from "@/context/DataContext";
import { Sparkles, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

export default function BannerHero() {
  const { banners } = useData();
  const activeBanners = banners.filter((b) => b.active);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [activeBanners.length]);

  if (activeBanners.length === 0) return null;

  const current = activeBanners[currentIndex] || activeBanners[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
  };

  return (
    <div className="relative w-full overflow-hidden bg-neutral-950 py-12 md:py-16 border-y border-gold-500/20">
      {/* Background con imagen y overlay de lujo */}
      <div className="absolute inset-0 z-0">
        <Image
          src={current.imageUrl}
          alt={current.title}
          fill
          priority
          className="object-cover opacity-30 transition-all duration-1000 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-luxury-black via-luxury-black/85 to-transparent" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/40 to-black/90" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          {/* Badge de Oportunidad Destacada */}
          <div className="inline-flex items-center gap-2 bg-gold-500/20 border border-gold-400/40 text-gold-300 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase mb-4 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-gold-400 animate-pulse" />
            <span>{current.badge}</span>
          </div>

          {/* Subtítulo & Título Editorial */}
          <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-neutral-400 font-medium mb-2">
            {current.subtitle}
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight mb-4">
            {current.title}
          </h2>

          {/* Descripción */}
          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed mb-8">
            {current.description}
          </p>

          {/* Botón CTA de Acción Comercial */}
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href={current.ctaLink || "/propiedades"}
              className="group bg-gold-500 hover:bg-gold-400 text-luxury-black font-semibold text-xs uppercase tracking-wider px-6 py-3.5 rounded-sm transition-all duration-200 shadow-lg shadow-gold-500/10 hover:shadow-xl hover:shadow-gold-500/30 flex items-center gap-2 btn-tactile"
            >
              <span>{current.ctaText || "Descubrir Oportunidad"}</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>

            <Link
              href="/contacto?asunto=desarrollo"
              className="text-white hover:text-gold-300 text-xs font-medium tracking-wide border-b border-white/30 hover:border-gold-300 pb-1 transition-all duration-200 hover:translate-x-0.5"
            >
              Solicitar Dossier de Inversión
            </Link>
          </div>
        </div>

        {/* Controles de Slide si hay más de 1 banner activo */}
        {activeBanners.length > 1 && (
          <div className="absolute bottom-4 right-4 sm:right-8 flex items-center gap-2 z-20">
            <button
              onClick={handlePrev}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/20 transition-colors"
              aria-label="Anterior oportunidad"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex gap-1.5 px-2">
              {activeBanners.map((_, idx) => (
                <span
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`block h-1.5 rounded-full transition-all cursor-pointer ${
                    currentIndex === idx ? "w-6 bg-gold-400" : "w-1.5 bg-white/30"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={handleNext}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/20 transition-colors"
              aria-label="Siguiente oportunidad"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
