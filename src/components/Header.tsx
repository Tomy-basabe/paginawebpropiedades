"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useData } from "@/context/DataContext";
import BrandLogo from "./BrandLogo";
import WhatsAppIcon from "./WhatsAppIcon";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { 
  Menu, 
  X, 
  Phone, 
  FileCheck, 
  Home, 
  Building2, 
  Percent, 
  UserCheck, 
  Mail,
  ChevronRight,
  Sparkles
} from "lucide-react";

interface HeaderProps {
  onOpenValuation?: () => void;
}

export default function Header({ onOpenValuation }: HeaderProps) {
  const { agentProfile } = useData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cerrar menú al cambiar de ruta
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "Inicio", href: "/", icon: Home },
    { name: "Propiedades", href: "/propiedades", icon: Building2 },
    { name: "Financiamiento & Tasas", href: "/financiamiento", icon: Percent },
    { name: "Sobre Mí", href: "/sobre-mi", icon: UserCheck },
    { name: "Contacto", href: "/contacto", icon: Mail },
  ];

  const isActive = (path: string) => {
    if (path === "/" && pathname !== "/") return false;
    return pathname.startsWith(path);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-neutral-950/95 backdrop-blur-xl py-3 border-b border-white/[0.08] shadow-md text-white"
          : "bg-neutral-950/85 backdrop-blur-md py-4 border-b border-white/[0.05] text-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo arquitectónico de 99 Propiedades */}
          <Link href="/" className="flex items-center gap-3 group focus:outline-none">
            <BrandLogo size="md" variant="dark" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-[13px] tracking-wide py-1 transition-colors duration-200 relative ${
                    active
                      ? "text-gold-300 font-medium"
                      : "text-neutral-300 hover:text-white font-normal"
                  }`}
                >
                  {link.name}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-400 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href={getWhatsAppUrl(agentProfile.whatsappNumber, `Hola ${agentProfile.name}, quisiera hacerle una consulta`)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-normal tracking-wide btn-tactile-pop"
              title="WhatsApp de consulta directa"
            >
              <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
              <span className="font-mono text-[11px] text-neutral-300">{agentProfile.whatsappDisplay}</span>
            </a>

            {onOpenValuation ? (
              <button
                onClick={onOpenValuation}
                className="bg-gold-500 hover:bg-gold-400 text-neutral-950 font-semibold text-xs tracking-[0.08em] uppercase px-4 py-2 rounded-[3px] shadow-sm hover:shadow-md transition-all flex items-center gap-2 btn-tactile-pop cursor-pointer"
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>Tasación Sin Cargo</span>
              </button>
            ) : (
              <Link
                href="/contacto?asunto=tasacion"
                className="bg-gold-500 hover:bg-gold-400 text-neutral-950 font-semibold text-xs tracking-[0.08em] uppercase px-4 py-2 rounded-[3px] shadow-sm hover:shadow-md transition-all flex items-center gap-2 btn-tactile-pop"
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>Tasación Sin Cargo</span>
              </Link>
            )}
          </div>

          {/* Mobile Actions: WhatsApp rápido + Las 3 Barras Animadas */}
          <div className="flex items-center gap-2.5 lg:hidden">
            <a
              href={getWhatsAppUrl(agentProfile.whatsappNumber, `Hola ${agentProfile.name}, quisiera hacerle una consulta`)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 min-w-[40px] min-h-[40px] text-[#25D366] bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.1] rounded-full flex items-center justify-center btn-tactile-pop cursor-pointer"
              title="WhatsApp Directo"
              aria-label="WhatsApp"
            >
              <WhatsAppIcon className="w-4 h-4 drop-shadow-sm" />
            </a>

            {/* Botón de las 3 Barras con micro-animación fluida */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-10 h-10 min-w-[40px] min-h-[40px] text-neutral-200 hover:text-white bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.1] rounded-full flex items-center justify-center btn-tactile-pop cursor-pointer"
              aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú de navegación"}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-gold-400 rotate-90 transition-transform duration-300" />
              ) : (
                <Menu className="w-5 h-5 transition-transform duration-300" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Desplegable Móvil de Lujo con animación fluida cortina descendente */}
      {mobileMenuOpen && (
        <div className="lg:hidden animate-menu-slide-down bg-neutral-950/98 border-b border-gold-500/20 backdrop-blur-3xl shadow-2xl overflow-hidden">
          <div className="max-w-7xl mx-auto px-5 pt-4 pb-6 space-y-2">
            {/* Encabezado del menú */}
            <div className="pb-2 border-b border-white/[0.08] flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-neutral-400">
              <span>Menú Principal</span>
              <span className="text-gold-400 font-serif lowercase tracking-normal italic text-xs">99 Propiedades</span>
            </div>

            {/* Lista de enlaces con animación escalonada y diseño de lujo */}
            <nav className="py-2 space-y-1">
              {navLinks.map((link, idx) => {
                const IconComponent = link.icon;
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ animationDelay: `${idx * 40}ms` }}
                    className={`animate-menu-item flex items-center justify-between py-3 px-3.5 rounded-lg transition-all duration-200 btn-tactile-pop ${
                      active
                        ? "bg-gold-500/15 text-gold-300 font-semibold border-l-2 border-gold-400"
                        : "text-neutral-200 hover:text-white hover:bg-white/[0.05]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent className={`w-4 h-4 ${active ? "text-gold-400" : "text-neutral-400"}`} />
                      <span className="text-sm font-medium tracking-wide">{link.name}</span>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${active ? "text-gold-400 translate-x-0.5" : "text-neutral-500"}`} />
                  </Link>
                );
              })}
            </nav>

            {/* Acciones principales en el menú móvil */}
            <div className="pt-3 border-t border-white/[0.08] space-y-2.5">
              {onOpenValuation ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenValuation();
                  }}
                  className="w-full text-center bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-neutral-950 font-bold text-xs tracking-wider uppercase py-3.5 rounded-lg shadow-lg shadow-gold-500/20 transition-all flex items-center justify-center gap-2 btn-tactile-pop cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Tasación Profesional Sin Cargo</span>
                </button>
              ) : (
                <Link
                  href="/contacto?asunto=tasacion"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-neutral-950 font-bold text-xs tracking-wider uppercase py-3.5 rounded-lg shadow-lg shadow-gold-500/20 transition-all flex items-center justify-center gap-2 btn-tactile-pop"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Tasación Profesional Sin Cargo</span>
                </Link>
              )}

              <a
                href={getWhatsAppUrl(agentProfile.whatsappNumber, `Hola ${agentProfile.name}, quisiera hacerle una consulta`)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.12] text-white font-medium text-xs tracking-wider uppercase py-3 rounded-lg transition-all flex items-center justify-center gap-2 btn-tactile-pop"
              >
                <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
                <span>Consultar por WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
