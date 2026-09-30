import type { Metadata } from "next";
import "./globals.css";
import { DataProvider } from "@/context/DataContext";
import ClientShell from "@/components/ClientShell";

export const metadata: Metadata = {
  title: "99 PROPIEDADES | Juan Pablo Pino - Martillero & Corredor Inmobiliario",
  description: "99 Propiedades con Juan Pablo Pino: 10 años de trayectoria líder en ventas. Venta de inmuebles, loteos, administración integral de alquileres, tasaciones sin cargo y gestión de créditos hipotecarios.",
  keywords: "99 propiedades, juan pablo pino, martillero, corredor inmobiliario, venta de propiedades, loteos, creditos hipotecarios uva, tasaciones sin cargo, administracion de alquileres, video tours",
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className="bg-stone-50 text-neutral-900 font-sans antialiased selection:bg-gold-500 selection:text-white">
        <DataProvider>
          <ClientShell>{children}</ClientShell>
        </DataProvider>
      </body>
    </html>
  );
}
