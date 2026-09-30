"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useData } from "@/context/DataContext";
import { 
  Home, 
  Search, 
  Percent, 
  FileCheck 
} from "lucide-react";
import WhatsAppIcon from "./WhatsAppIcon";
import { getWhatsAppUrl } from "@/lib/whatsapp";

interface MobileBottomNavProps {
  onOpenValuation?: () => void;
}

export default function MobileBottomNav({ onOpenValuation }: MobileBottomNavProps) {
  const pathname = usePathname();
  const { agentProfile } = useData();

  const navItems = [
    { label: "Inicio", href: "/", icon: Home },
    { label: "Buscar", href: "/propiedades", icon: Search },
    { label: "Créditos", href: "/financiamiento", icon: Percent },
  ];

  const defaultMsg = encodeURIComponent(
    `Hola ${agentProfile.name}, estoy navegando la web de 99 Propiedades desde mi teléfono y quisiera hacerle una consulta.`
  );

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-luxury-black/95 backdrop-blur-lg border-t border-white/10 md:hidden px-2 py-1.5 shadow-2xl safe-area-bottom">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-sm transition-colors ${
                isActive ? "text-gold-400 font-semibold" : "text-neutral-400 hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </Link>
          );
        })}

        {/* Botón Tasar */}
        {onOpenValuation ? (
          <button
            onClick={onOpenValuation}
            className="flex flex-col items-center justify-center py-1 px-2.5 text-neutral-400 hover:text-white transition-colors"
          >
            <FileCheck className="w-5 h-5 mb-0.5 text-gold-400" />
            <span className="text-[10px] tracking-tight">Tasar</span>
          </button>
        ) : (
          <Link
            href="/contacto?asunto=tasacion"
            className="flex flex-col items-center justify-center py-1 px-2.5 text-neutral-400 hover:text-white transition-colors"
          >
            <FileCheck className="w-5 h-5 mb-0.5 text-gold-400" />
            <span className="text-[10px] tracking-tight">Tasar</span>
          </Link>
        )}

        {/* WhatsApp Directo destacadísimo para móviles */}
        <a
          href={getWhatsAppUrl(agentProfile.whatsappNumber, `Hola ${agentProfile.name}, estoy navegando tu sitio web inmobiliario y quisiera hacerte una consulta.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-1 px-3 bg-[#25D366] active:bg-[#20ba59] text-white rounded-full shadow-lg shadow-emerald-500/25 transform active:scale-95 transition-all"
          title="WhatsApp Directo"
        >
          <WhatsAppIcon className="w-5 h-5 drop-shadow-sm" />
          <span className="text-[9px] font-bold tracking-tight uppercase">Chat</span>
        </a>
      </div>
    </nav>
  );
}
