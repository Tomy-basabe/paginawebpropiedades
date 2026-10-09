import type { Metadata } from "next";
import "./globals.css";
import { DataProvider } from "@/context/DataContext";
import ClientShell from "@/components/ClientShell";

export const metadata: Metadata = {
  metadataBase: new URL("https://99propiedades.com.ar"),
  title: {
    default: "99 Propiedades | Inmobiliaria en Santa Cruz - Casas, Alquiler y Terrenos",
    template: "%s | 99 Propiedades - Inmobiliaria Santa Cruz",
  },
  description:
    "Inmobiliaria líder en Santa Cruz con Juan Pablo Pino. Venta y alquiler de casas, departamentos, terrenos y loteos en Río Gallegos, El Calafate y toda la provincia de Santa Cruz. Tasaciones sin cargo y asesoramiento en créditos hipotecarios UVA.",
  keywords: [
    "propiedades santa cruz",
    "inmobiliaria santa cruz",
    "casas en venta santa cruz",
    "alquiler santa cruz",
    "alquileres santa cruz",
    "terrenos en venta santa cruz",
    "terrenos santa cruz",
    "loteos santa cruz",
    "casas en venta rio gallegos",
    "inmobiliarias rio gallegos",
    "alquileres rio gallegos santa cruz",
    "terrenos el calafate",
    "propiedades el calafate santa cruz",
    "venta de casas santa cruz argentina",
    "99 propiedades",
    "juan pablo pino",
    "tasaciones santa cruz",
    "creditos hipotecarios santa cruz",
  ],
  authors: [{ name: "Juan Pablo Pino", url: "https://99propiedades.com.ar" }],
  creator: "99 Propiedades",
  publisher: "99 Propiedades",
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },
  alternates: {
    canonical: "https://99propiedades.com.ar",
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "https://99propiedades.com.ar",
    siteName: "99 Propiedades Santa Cruz",
    title: "99 Propiedades | Inmobiliaria en Santa Cruz - Casas, Alquiler y Terrenos",
    description:
      "Líder inmobiliario en Santa Cruz. Casas, departamentos, terrenos y loteos en Río Gallegos y toda la provincia con Juan Pablo Pino. Video tours y tasaciones sin cargo.",
    images: [
      {
        url: "/images/og-share.jpg",
        width: 1200,
        height: 630,
        alt: "99 Propiedades - Inmobiliaria en Santa Cruz",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "99 Propiedades | Inmobiliaria en Santa Cruz",
    description:
      "Venta y alquiler de casas, departamentos y terrenos en Santa Cruz con Juan Pablo Pino.",
    images: ["/images/og-share.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  verification: {
    google: "LbzhnE2q4apN3wsUj5tpzniJj6NJYxlEvDNkUt9OjzI",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "RealEstateAgent",
        "@id": "https://99propiedades.com.ar/#agent",
        "name": "99 Propiedades - Juan Pablo Pino",
        "alternateName": "99 Propiedades Santa Cruz",
        "url": "https://99propiedades.com.ar",
        "logo": "https://99propiedades.com.ar/favicon.svg",
        "image": "https://99propiedades.com.ar/images/og-share.jpg",
        "description":
          "Inmobiliaria líder en la provincia de Santa Cruz con Juan Pablo Pino. Venta y alquiler de casas, departamentos, terrenos, loteos y campos en Río Gallegos, El Calafate y toda la Patagonia argentina. Tasaciones sin cargo y gestión de créditos hipotecarios UVA.",
        "telephone": "+54 9 11 4890-7722",
        "priceRange": "$$",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Río Gallegos",
          "addressRegion": "Santa Cruz",
          "addressCountry": "AR",
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": -51.6226,
          "longitude": -69.2181,
        },
        "areaServed": [
          {
            "@type": "AdministrativeArea",
            "name": "Provincia de Santa Cruz",
          },
          {
            "@type": "City",
            "name": "Río Gallegos",
          },
          {
            "@type": "City",
            "name": "El Calafate",
          },
          {
            "@type": "City",
            "name": "Caleta Olivia",
          },
          {
            "@type": "City",
            "name": "Pico Truncado",
          },
        ],
        "knowsAbout": [
          "Venta de propiedades en Santa Cruz",
          "Alquiler de casas en Santa Cruz",
          "Venta de terrenos y loteos en Santa Cruz",
          "Tasaciones inmobiliarias en Río Gallegos",
          "Créditos Hipotecarios UVA",
        ],
      },
      {
        "@type": "WebSite",
        "@id": "https://99propiedades.com.ar/#website",
        "url": "https://99propiedades.com.ar",
        "name": "99 Propiedades",
        "publisher": {
          "@id": "https://99propiedades.com.ar/#agent",
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://99propiedades.com.ar/propiedades?location={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-stone-50 text-neutral-900 font-sans antialiased selection:bg-gold-500 selection:text-white">
        <DataProvider>
          <ClientShell>{children}</ClientShell>
        </DataProvider>
      </body>
    </html>
  );
}
