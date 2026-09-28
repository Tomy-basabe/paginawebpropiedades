import type { Metadata } from "next";
import "./globals.css";
import { DataProvider } from "@/context/DataContext";
import ClientShell from "@/components/ClientShell";

export const metadata: Metadata = {
  title: "ÁUREA | Ignacio Valenzuela - Consultoría Inmobiliaria & Desarrollos",
  description: "Estudio inmobiliario de alta gama especializado en residencias singulares, loteos premium, emprendimientos en pozo y asesoría en créditos hipotecarios UVA.",
  keywords: "inmobiliaria, propiedades de lujo, nordelta, palermo chico, san isidro, creditos hipotecarios uva, loteos, pozo, ignacio valenzuela",
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
