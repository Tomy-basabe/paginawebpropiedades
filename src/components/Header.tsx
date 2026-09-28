"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useData } from "@/context/DataContext";
import BrandLogo from "./BrandLogo";
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
import WhatsAppIcon from "./WhatsAppIcon";

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
          {/* Logo y Marca Personal Tipográfica de Alta Gama */}
          <BrandLogo variant="light" size="md" />

          {/* Desktop Nav con Microinteracciones Subrayadas Fluidas */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm tracking-wide py-1 nav-link-hover ${
                    active
                      ? "active text-gold-400 font-semibold"
                      : "text-neutral-300 hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Botones de Acción */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={`https://wa.me/${agentProfile.whatsappNumber}?text=Hola%20${encodeURIComponent(agentProfile.name)},%20quisiera%20hacerle%20una%20consulta`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#25D366] hover:text-white transition-all duration-200 flex items-center gap-1.5 px-3 py-2 rounded-sm border border-[#25D366]/40 hover:border-[#25D366] hover:bg-[#25D366] btn-tactile group/wa"
              title="Chat directo por WhatsApp"
            >
              <WhatsAppIcon className="w-3.5 h-3.5 group-hover/wa:scale-110 transition-transform" />
              <span className="font-semibold text-neutral-200 group-hover/wa:text-white">WhatsApp</span>
            </a>

            <Link
              href="/admin"
              className="text-xs text-neutral-400 hover:text-gold-400 transition-all duration-200 flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-white/10 hover:border-gold-400/40 hover:bg-white/5 btn-tactile"
              title="Panel de Gestión de Contenido"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-45" />
              <span>Admin</span>
            </Link>

            {onOpenValuation ? (
              <button
                onClick={onOpenValuation}
                className="bg-gold-500 hover:bg-gold-400 text-luxury-black font-semibold text-xs tracking-wider uppercase px-4 py-2.5 rounded-sm shadow-sm hover:shadow-lg hover:shadow-gold-500/20 flex items-center gap-2 btn-tactile cursor-pointer"
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>Tasá tu Propiedad</span>
              </button>
            ) : (
              <Link
                href="/contacto?asunto=tasacion"
                className="bg-gold-500 hover:bg-gold-400 text-luxury-black font-semibold text-xs tracking-wider uppercase px-4 py-2.5 rounded-sm shadow-sm hover:shadow-lg hover:shadow-gold-500/20 flex items-center gap-2 btn-tactile"
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>Tasá tu Propiedad</span>
              </Link>
            )}
          </div>

          {/* Mobile Actions: WhatsApp rápido + Menú */}
          <div className="flex items-center gap-1.5 lg:hidden">
            <a
              href={`https://wa.me/${agentProfile.whatsappNumber}?text=Hola%20${encodeURIComponent(agentProfile.name)},%20quisiera%20hacerle%20una%20consulta`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-[#25D366] hover:text-white hover:bg-white/10 rounded-full transition-colors flex items-center justify-center"
              title="WhatsApp Directo"
              aria-label="WhatsApp"
            >
              <WhatsAppIcon className="w-5 h-5 drop-shadow-sm" />
            </a>
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
            <a
              href={`https://wa.me/${agentProfile.whatsappNumber}?text=Hola%20${encodeURIComponent(agentProfile.name)},%20quisiera%20hacerle%20una%20consulta`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold text-xs tracking-wider uppercase py-3 rounded-sm transition-all flex items-center justify-center gap-2 shadow-md"
            >
              <WhatsAppIcon className="w-4 h-4" />
              <span>Chatear por WhatsApp</span>
            </a>
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
