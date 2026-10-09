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
  FileCheck
} from "lucide-react";
import WhatsAppIcon from "./WhatsAppIcon";
import { getWhatsAppUrl } from "@/lib/whatsapp";

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
          ? "bg-neutral-950/90 backdrop-blur-xl py-3 border-b border-white/[0.08] shadow-md text-white"
          : "bg-neutral-950/75 backdrop-blur-md py-4 border-b border-white/[0.05] text-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo y Marca Personal Tipográfica */}
          <BrandLogo variant="light" size="md" />

          {/* Desktop Nav con tipografía refinada */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-[13px] tracking-wide py-1 transition-colors duration-200 relative ${
                    active
                      ? "text-gold-300 font-medium after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-gold-400"
                      : "text-neutral-300 hover:text-white font-normal"
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
              href={getWhatsAppUrl(agentProfile.whatsappNumber, `Hola ${agentProfile.name}, quisiera hacerle una consulta`)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-neutral-200 hover:text-white bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] hover:border-emerald-500/40 transition-all duration-200 flex items-center gap-2 px-3.5 py-2 rounded-[3px] btn-tactile group"
              title="Chat directo por WhatsApp"
            >
              <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366] group-hover:scale-110 transition-transform" />
              <span className="font-medium tracking-wide">WhatsApp</span>
            </a>

            {onOpenValuation ? (
              <button
                onClick={onOpenValuation}
                className="bg-gold-500 hover:bg-gold-400 text-neutral-950 font-semibold text-xs tracking-[0.08em] uppercase px-4 py-2 rounded-[3px] shadow-xs hover:shadow-sm transition-all flex items-center gap-2 btn-tactile cursor-pointer"
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>Tasación Sin Cargo</span>
              </button>
            ) : (
              <Link
                href="/contacto?asunto=tasacion"
                className="bg-gold-500 hover:bg-gold-400 text-neutral-950 font-semibold text-xs tracking-[0.08em] uppercase px-4 py-2 rounded-[3px] shadow-xs hover:shadow-sm transition-all flex items-center gap-2 btn-tactile"
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>Tasación Sin Cargo</span>
              </Link>
            )}
          </div>

          {/* Mobile Actions: WhatsApp rápido + Menú */}
          <div className="flex items-center gap-2 lg:hidden">
            <a
              href={getWhatsAppUrl(agentProfile.whatsappNumber, `Hola ${agentProfile.name}, quisiera hacerle una consulta`)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 min-w-[40px] min-h-[40px] text-[#25D366] bg-white/[0.06] border border-white/[0.08] active:scale-95 rounded-[3px] transition-all flex items-center justify-center"
              title="WhatsApp Directo"
              aria-label="WhatsApp"
            >
              <WhatsAppIcon className="w-4 h-4 drop-shadow-xs" />
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-10 h-10 min-w-[40px] min-h-[40px] text-neutral-200 hover:text-white bg-white/[0.06] border border-white/[0.08] active:scale-95 rounded-[3px] transition-all flex items-center justify-center"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-neutral-950/95 border-b border-white/[0.08] px-5 pt-3 pb-6 space-y-3 backdrop-blur-2xl">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block py-2 text-sm tracking-wide ${
                isActive(link.href)
                  ? "text-gold-300 font-medium border-l-2 border-gold-400 pl-2.5"
                  : "text-neutral-300 hover:text-white"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-white/[0.08] flex flex-col gap-3">
            <a
              href={getWhatsAppUrl(agentProfile.whatsappNumber, `Hola ${agentProfile.name}, quisiera hacerle una consulta`)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center bg-white/[0.08] hover:bg-white/[0.12] border border-white/[0.1] text-white font-medium text-xs tracking-wider uppercase py-3 rounded-[3px] transition-all flex items-center justify-center gap-2"
            >
              <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
              <span>Chatear por WhatsApp</span>
            </a>
            {onOpenValuation ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenValuation();
                }}
                className="w-full text-center bg-gold-500 hover:bg-gold-400 text-neutral-950 font-semibold text-xs tracking-wider uppercase py-3 rounded-[3px] transition-all"
              >
                Tasación Sin Cargo
              </button>
            ) : (
              <Link
                href="/contacto?asunto=tasacion"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center bg-gold-500 hover:bg-gold-400 text-neutral-950 font-semibold text-xs tracking-wider uppercase py-3 rounded-[3px] transition-all"
              >
                Tasación Sin Cargo
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
