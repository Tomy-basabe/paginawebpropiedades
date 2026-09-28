"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useData } from "@/context/DataContext";
import { 
  Building2, 
  Menu, 
  X, 
  Phone, 
  TrendingUp, 
  ShieldCheck, 
  SlidersHorizontal,
  FileCheck
} from "lucide-react";

interface HeaderProps {
  onOpenValuation?: () => void;
}

export default function Header({ onOpenValuation }: HeaderProps) {
  const { agentProfile } = useData();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Inicio", href: "/" },
    { name: "Propiedades", href: "/propiedades" },
    { name: "Financiamiento & Tasas", href: "/financiamiento" },
    { name: "Sobre Mí", href: "/sobre-mi" },
    { name: "Contacto", href: "/contacto" },
  ];

  const isActive = (path: string) => {
    if (path === "/" && pathname !== "/") return false;
    return pathname.startsWith(path);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-luxury-black/95 backdrop-blur-md py-3 border-b border-white/10 shadow-lg text-white"
          : "bg-luxury-black/80 backdrop-blur-sm py-4 border-b border-white/5 text-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo y Marca Personal */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-sm bg-gold-500/10 border border-gold-400/40 flex items-center justify-center text-gold-400 transition-colors group-hover:border-gold-400">
              <span className="font-serif text-xl font-bold tracking-wider">A</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg sm:text-xl font-semibold tracking-wider text-white group-hover:text-gold-300 transition-colors">
                ÁUREA
              </span>
              <span className="text-[10px] tracking-[0.2em] text-neutral-400 uppercase font-sans">
                {agentProfile.name} • Bienes Raíces
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm tracking-wide transition-colors ${
                  isActive(link.href)
                    ? "text-gold-400 font-medium"
                    : "text-neutral-300 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Botones de Acción */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/admin"
              className="text-xs text-neutral-400 hover:text-gold-400 transition-colors flex items-center gap-1.5 px-2.5 py-1 rounded border border-white/10 hover:border-gold-400/30"
              title="Panel de Gestión de Contenido"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Admin</span>
            </Link>

            {onOpenValuation ? (
              <button
                onClick={onOpenValuation}
                className="bg-gold-500 hover:bg-gold-600 text-luxury-black font-medium text-xs tracking-wider uppercase px-4 py-2.5 rounded-sm transition-all shadow-sm hover:shadow hover:shadow-gold-500/20 flex items-center gap-2"
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>Tasá tu Propiedad</span>
              </button>
            ) : (
              <Link
                href="/contacto?asunto=tasacion"
                className="bg-gold-500 hover:bg-gold-600 text-luxury-black font-medium text-xs tracking-wider uppercase px-4 py-2.5 rounded-sm transition-all shadow-sm hover:shadow hover:shadow-gold-500/20 flex items-center gap-2"
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>Tasá tu Propiedad</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-neutral-300 hover:text-white"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-luxury-dark/95 border-b border-white/10 px-4 pt-3 pb-6 space-y-3 backdrop-blur-xl">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block py-2 text-sm ${
                isActive(link.href)
                  ? "text-gold-400 font-semibold"
                  : "text-neutral-300 hover:text-white"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
            {onOpenValuation ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenValuation();
                }}
                className="w-full text-center bg-gold-500 hover:bg-gold-600 text-luxury-black font-medium text-xs tracking-wider uppercase py-3 rounded-sm transition-all"
              >
                Tasá tu Propiedad
              </button>
            ) : (
              <Link
                href="/contacto?asunto=tasacion"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center bg-gold-500 hover:bg-gold-600 text-luxury-black font-medium text-xs tracking-wider uppercase py-3 rounded-sm transition-all"
              >
                Tasá tu Propiedad
              </Link>
            )}
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center text-xs text-neutral-400 hover:text-white py-2 rounded border border-white/10"
            >
              Acceso Panel Administrador
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
