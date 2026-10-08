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
        className={`relative ${sizeClasses.box} rounded-[3px] flex items-center justify-center font-serif font-semibold tracking-tight transition-all duration-300 ${
          isLight
            ? "bg-neutral-950 text-gold-400 border border-gold-400/40 shadow-xs group-hover:border-gold-400 group-hover:text-gold-300"
            : "bg-neutral-900 text-gold-400 border border-neutral-800 shadow-xs group-hover:border-gold-500"
        }`}
      >
        <span className="font-serif leading-none tracking-tighter">99</span>
        <span className="absolute bottom-1 right-1 w-1 h-1 bg-gold-400/80 rounded-full" />
      </div>

      {/* Identidad Tipográfica de Marca */}
      <div className="flex flex-col justify-center">
        <span
          className={`font-serif font-semibold tracking-[0.12em] leading-tight transition-colors duration-200 ${sizeClasses.title} ${
            isLight
              ? "text-white group-hover:text-gold-300"
              : "text-neutral-900 group-hover:text-gold-800"
          }`}
        >
          99 PROPIEDADES
        </span>
        <span
          className={`font-sans uppercase font-medium tracking-[0.22em] text-[8px] sm:text-[9px] mt-0.5 leading-none transition-colors duration-200 ${
            isLight ? "text-neutral-400 group-hover:text-neutral-300" : "text-neutral-500 group-hover:text-neutral-700"
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
