"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useData } from "@/context/DataContext";
import { 
  Home, 
  Search, 
  Percent, 
  FileCheck,
  Box
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
    { label: "Catálogo", href: "/propiedades", icon: Search },
    { label: "Tours 3D", href: "/propiedades?tour3d=true", icon: Box, highlight: true },
    { label: "Tasas", href: "/financiamiento", icon: Percent },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-neutral-950/95 backdrop-blur-xl border-t border-white/[0.08] md:hidden px-3 pt-1.5 safe-area-bottom-bar shadow-[0_-5px_20px_rgba(0,0,0,0.3)]">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.href === "/propiedades?tour3d=true"
            ? pathname === "/propiedades"
            : pathname === item.href;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-2 min-h-[44px] min-w-[44px] rounded-[3px] transition-all active:scale-95 ${
                isActive
                  ? "text-gold-300 font-medium"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <div className="relative">
                <Icon className={`w-4.5 h-4.5 mb-0.5 ${item.highlight ? "text-gold-400" : ""}`} />
                {item.highlight && (
                  <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-gold-400" />
                )}
              </div>
              <span className="text-[10px] tracking-wide">{item.label}</span>
            </Link>
          );
        })}

        {/* WhatsApp Directo para móviles */}
        <a
          href={getWhatsAppUrl(agentProfile.whatsappNumber, `Hola ${agentProfile.name}, estoy navegando tu sitio web inmobiliario y quisiera hacerte una consulta.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-1 px-3 bg-white/[0.08] active:bg-white/[0.15] border border-white/[0.1] text-white rounded-[4px] transform active:scale-95 transition-all min-h-[42px] touch-target"
          title="WhatsApp Directo"
          aria-label="Contactar por WhatsApp"
        >
          <WhatsAppIcon className="w-4.5 h-4.5 text-[#25D366] drop-shadow-xs" />
          <span className="text-[9px] font-medium tracking-wider uppercase text-neutral-200">Chat</span>
        </a>
      </div>
    </nav>
  );
}
