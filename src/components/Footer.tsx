"use client";

import React from "react";
import Link from "next/link";
import { useData } from "@/context/DataContext";
import BrandLogo from "./BrandLogo";
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Instagram, 
  Linkedin, 
  Youtube,
  ArrowUpRight
} from "lucide-react";
import WhatsAppIcon from "./WhatsAppIcon";
import { getWhatsAppUrl } from "@/lib/whatsapp";

export default function Footer() {
  const { agentProfile } = useData();

  return (
    <footer className="bg-luxury-black text-neutral-400 border-t border-white/10 pt-16 pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Columna 1: Marca y Autoridad */}
          <div className="space-y-4">
            <BrandLogo variant="light" size="md" />
            <p className="text-xs leading-relaxed text-neutral-400">
              {agentProfile.shortBio}
            </p>
            <div className="pt-2 text-[11px] text-neutral-400 font-mono">
              <span className="text-gold-400 font-medium">{agentProfile.licenseNumber}</span>
            </div>
            {/* Redes sociales */}
            <div className="flex items-center gap-3 pt-2">
              {agentProfile.social.instagram && (
                <a
                  href={agentProfile.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 hover:text-gold-400 hover:border-gold-400/40 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {agentProfile.social.linkedin && (
                <a
                  href={agentProfile.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 hover:text-gold-400 hover:border-gold-400/40 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {agentProfile.social.youtube && (
                <a
                  href={agentProfile.social.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 hover:text-gold-400 hover:border-gold-400/40 transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Columna 2: Navegación Rápida */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-widest mb-4">
              Explorar Catálogo
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/propiedades?operation=venta" className="hover:text-gold-400 transition-colors flex items-center justify-between">
                  <span>Propiedades en Venta</span>
                  <ArrowUpRight className="w-3 h-3 text-neutral-400" />
                </Link>
              </li>
              <li>
                <Link href="/propiedades?type=desarrollo" className="hover:text-gold-400 transition-colors flex items-center justify-between">
                  <span>Desarrollos & Pozo</span>
                  <ArrowUpRight className="w-3 h-3 text-neutral-400" />
                </Link>
              </li>
              <li>
                <Link href="/propiedades?type=loteo" className="hover:text-gold-400 transition-colors flex items-center justify-between">
                  <span>Loteos & Terrenos Premium</span>
                  <ArrowUpRight className="w-3 h-3 text-neutral-400" />
                </Link>
              </li>
              <li>
                <Link href="/propiedades?status=oportunidad" className="hover:text-gold-400 transition-colors flex items-center justify-between">
                  <span>Oportunidades Destacadas</span>
                  <ArrowUpRight className="w-3 h-3 text-neutral-400" />
                </Link>
              </li>
              <li>
                <Link href="/financiamiento" className="hover:text-gold-400 transition-colors flex items-center justify-between">
                  <span>Simulador de Créditos UVA</span>
                  <ArrowUpRight className="w-3 h-3 text-neutral-400" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Información Financiera */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-widest mb-4">
              Herramientas & Asesoría
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/financiamiento#tasas" className="hover:text-gold-400 transition-colors">
                  Comparador de Tasas Bancarias
                </Link>
              </li>
              <li>
                <Link href="/financiamiento#requisitos" className="hover:text-gold-400 transition-colors">
                  Requisitos para Crédito Hipotecario
                </Link>
              </li>
              <li>
                <Link href="/sobre-mi#metodologia" className="hover:text-gold-400 transition-colors">
                  Metodología de Valuación de Activos
                </Link>
              </li>
              <li>
                <Link href="/contacto?asunto=tasacion" className="hover:text-gold-400 transition-colors">
                  Solicitar Tasación Profesional
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 4: Contacto Institucional */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-semibold uppercase tracking-widest mb-4">
              Atención Personalizada
            </h4>
            <div className="flex items-start gap-2.5 text-xs">
              <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
              <span>{agentProfile.officeAddress}</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs">
              <Phone className="w-4 h-4 text-gold-400 shrink-0" />
              <span>{agentProfile.phone}</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs">
              <Mail className="w-4 h-4 text-gold-400 shrink-0" />
              <a href={`mailto:${agentProfile.email}`} className="hover:text-gold-400 transition-colors">
                {agentProfile.email}
              </a>
            </div>
            <div className="pt-3">
              <a
                href={getWhatsAppUrl(agentProfile.whatsappNumber, `Hola ${agentProfile.name}, deseo hacerle una consulta inmobiliaria`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#25D366] hover:text-[#20ba59] border-b border-[#25D366]/40 pb-0.5 transition-colors"
              >
                <WhatsAppIcon className="w-4 h-4 drop-shadow-sm" />
                <span>Chatear por WhatsApp directo</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Línea divisoria y aviso legal */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-neutral-400">
          <p>
            © {new Date().getFullYear()} ÁUREA Real Estate. Dirección comercial y corretaje por {agentProfile.name} ({agentProfile.licenseNumber}). Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-6">
            <span>Operaciones sujetas a verificación registral y notarial</span>
            <Link href="/sobre-mi" className="hover:text-neutral-400">
              Marco Regulatorio
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
