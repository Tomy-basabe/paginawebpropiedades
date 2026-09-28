import type { Metadata } from "next";
import "./globals.css";
import { DataProvider } from "@/context/DataContext";
import ClientShell from "@/components/ClientShell";

export const metadata: Metadata = {
  title: "99 PROPIEDADES | Ignacio Valenzuela - Desarrollos & Real Estate",
  description: "99 Propiedades: Comercialización exclusiva de residencias singulares, loteos premium, emprendimientos en pozo y asesoría en créditos hipotecarios UVA.",
  keywords: "99 propiedades, inmobiliaria, propiedades de lujo, nordelta, palermo chico, san isidro, creditos hipotecarios uva, loteos, pozo, ignacio valenzuela",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
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
