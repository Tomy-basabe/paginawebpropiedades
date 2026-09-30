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
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-luxury-black/95 backdrop-blur-xl border-t border-white/10 md:hidden px-3 pt-1.5 safe-area-bottom-bar shadow-[0_-10px_25px_rgba(0,0,0,0.5)]">
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
              className={`flex flex-col items-center justify-center py-1 px-2 min-h-[44px] min-w-[44px] rounded-lg transition-all active:scale-90 ${
                isActive
                  ? "text-gold-400 font-semibold"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 mb-0.5 ${item.highlight ? "text-amber-400 animate-pulse" : ""}`} />
                {item.highlight && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-gold-400" />
                )}
              </div>
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </Link>
          );
        })}

        {/* WhatsApp Directo destacadísimo para móviles */}
        <a
          href={getWhatsAppUrl(agentProfile.whatsappNumber, `Hola ${agentProfile.name}, estoy navegando tu sitio web inmobiliario y quisiera hacerte una consulta.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-1 px-3.5 bg-[#25D366] active:bg-[#20ba59] text-white rounded-full shadow-lg shadow-emerald-500/30 transform active:scale-90 transition-all min-h-[42px] touch-target"
          title="WhatsApp Directo"
          aria-label="Contactar por WhatsApp"
        >
          <WhatsAppIcon className="w-5 h-5 drop-shadow-sm" />
          <span className="text-[9px] font-bold tracking-tight uppercase">Chat</span>
        </a>
      </div>
    </nav>
  );
}
