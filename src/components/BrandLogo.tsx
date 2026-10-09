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
      {/* Monograma Editorial de Estudio "99" */}
      <div
        className={`relative ${sizeClasses.box} rounded-[4px] flex items-center justify-center font-serif font-bold tracking-tight transition-all duration-300 shrink-0 ${
          isLight
            ? "bg-neutral-900 text-gold-300 border border-gold-400/50 shadow-sm group-hover:border-gold-300 group-hover:text-gold-200"
            : "bg-neutral-900 text-gold-400 border border-neutral-800 shadow-xs group-hover:border-gold-500"
        }`}
      >
        <span className="font-serif leading-none tracking-tighter">99</span>
        <span className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-gold-400 rounded-full" />
      </div>

      {/* Identidad Tipográfica de Marca */}
      <div className="flex flex-col justify-center min-w-0">
        <span
          className={`font-serif font-bold tracking-[0.14em] leading-tight transition-colors duration-200 ${sizeClasses.title} ${
            isLight
              ? "text-white group-hover:text-gold-200"
              : "text-neutral-950 group-hover:text-gold-900"
          }`}
        >
          99 PROPIEDADES
        </span>
        <span
          className={`font-sans uppercase font-semibold tracking-[0.22em] text-[8.5px] sm:text-[9.5px] mt-0.5 leading-none transition-colors duration-200 ${
            isLight ? "text-neutral-300 group-hover:text-white" : "text-neutral-600 group-hover:text-neutral-900"
          }`}
        >
          Desarrollos & Real Estate
        </span>
      </div>
    </div>
  );

  if (withLink) {
    return (
      <Link href="/" className="inline-block transition-transform duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold-400">
        {content}
      </Link>
    );
  }

  return content;
}
