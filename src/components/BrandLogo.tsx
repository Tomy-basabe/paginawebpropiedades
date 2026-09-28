"use client";

import React from "react";
import Link from "next/link";

interface BrandLogoProps {
  variant?: "light" | "dark";
  size?: "sm" | "md" | "lg";
  withLink?: boolean;
}

export default function BrandLogo({
  variant = "light",
  size = "md",
  withLink = true,
}: BrandLogoProps) {
  const isLight = variant === "light";

  const sizeClasses = {
    sm: {
      box: "w-8 h-8 text-sm",
      title: "text-sm",
      subtitle: "text-[8px] tracking-[0.2em]",
    },
    md: {
      box: "w-10 h-10 text-base",
      title: "text-base sm:text-lg",
      subtitle: "text-[9px] tracking-[0.25em]",
    },
    lg: {
      box: "w-14 h-14 text-xl",
      title: "text-xl sm:text-2xl",
      subtitle: "text-[10px] tracking-[0.3em]",
    },
  }[size];

  const content = (
    <div className="flex items-center gap-3 group select-none">
      {/* Monograma Editorial de Lujo "99" */}
      <div
        className={`relative ${sizeClasses.box} rounded-sm flex items-center justify-center font-serif font-bold transition-all duration-300 ${
          isLight
            ? "bg-gradient-to-br from-neutral-900 to-luxury-black text-gold-400 border border-gold-400/40 shadow-sm group-hover:border-gold-400 group-hover:shadow-[0_0_15px_rgba(181,142,85,0.25)]"
            : "bg-white text-neutral-900 border border-neutral-300 shadow-sm group-hover:border-gold-500 group-hover:shadow-md"
        }`}
      >
        <span className="tracking-tighter">99</span>
        {/* Detalle en esquina tipo sello de arquitectura */}
        <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-gold-400 rounded-full opacity-80" />
      </div>

      {/* Tipografía de Marca */}
      <div className="flex flex-col">
        <span
          className={`font-serif font-bold tracking-wider leading-none transition-colors duration-200 ${sizeClasses.title} ${
            isLight
              ? "text-white group-hover:text-gold-300"
              : "text-neutral-900 group-hover:text-gold-700"
          }`}
        >
          99 PROPIEDADES
        </span>
        <span
          className={`font-sans uppercase font-medium mt-1 leading-none ${sizeClasses.subtitle} ${
            isLight ? "text-neutral-400" : "text-neutral-500"
          }`}
        >
          Estudio Inmobiliario
        </span>
      </div>
    </div>
  );

  if (withLink) {
    return (
      <Link href="/" className="inline-block transition-transform duration-200 group-hover:scale-[1.01]">
        {content}
      </Link>
    );
  }

  return content;
}
