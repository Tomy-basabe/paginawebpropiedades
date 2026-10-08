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
    <div className="relative w-full overflow-hidden bg-neutral-950 py-12 md:py-16 rounded-[4px] border border-white/[0.1] shadow-xl">
      {/* Background con imagen y overlay arquitectónico */}
      <div className="absolute inset-0 z-0">
        <Image
          src={current.imageUrl}
          alt={current.title}
          fill
          priority
          className="object-cover opacity-25 transition-all duration-1000 scale-100"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/85 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
        <div className="max-w-2xl">
          {/* Badge de Oportunidad Destacada */}
          <div className="inline-flex items-center gap-2 bg-white/[0.06] border border-gold-400/30 text-gold-300 px-3 py-1 rounded-[2px] text-[11px] font-medium tracking-[0.15em] uppercase mb-4 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
            <span>{current.badge}</span>
          </div>

          {/* Subtítulo & Título Editorial */}
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-400 font-medium mb-2">
            {current.subtitle}
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-white tracking-tight leading-tight mb-4">
            {current.title}
          </h2>

          {/* Descripción */}
          <p className="text-sm text-neutral-300 leading-relaxed font-light mb-8 max-w-xl">
            {current.description}
          </p>

          {/* Botones de Acción */}
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href={current.ctaLink || "/propiedades"}
              className="bg-gold-500 hover:bg-gold-400 text-neutral-950 font-semibold text-xs uppercase tracking-wider px-6 py-3.5 rounded-[3px] transition-all duration-200 shadow-sm flex items-center gap-2 btn-tactile group"
            >
              <span>{current.ctaText || "Descubrir Oportunidad"}</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>

            <Link
              href="/contacto?asunto=desarrollo"
              className="text-neutral-300 hover:text-white text-xs font-medium tracking-wider uppercase border-b border-white/20 hover:border-gold-300 pb-1 transition-all duration-200"
            >
              Solicitar Dossier de Inversión
            </Link>
          </div>
        </div>

        {/* Controles de Slide si hay más de 1 banner activo */}
        {activeBanners.length > 1 && (
          <div className="absolute bottom-6 right-6 sm:right-10 flex items-center gap-3 z-20">
            <div className="text-[11px] font-mono text-neutral-400 tracking-widest mr-2">
              0{currentIndex + 1} / 0{activeBanners.length}
            </div>
            <button
              onClick={handlePrev}
              className="w-8 h-8 rounded-[2px] bg-white/[0.08] hover:bg-white/[0.15] text-white backdrop-blur-sm border border-white/[0.1] transition-colors flex items-center justify-center cursor-pointer"
              aria-label="Anterior oportunidad"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="w-8 h-8 rounded-[2px] bg-white/[0.08] hover:bg-white/[0.15] text-white backdrop-blur-sm border border-white/[0.1] transition-colors flex items-center justify-center cursor-pointer"
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
