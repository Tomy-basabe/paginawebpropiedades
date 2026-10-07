"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useData } from "@/context/DataContext";
import PropertyCard from "@/components/PropertyCard";
import PropertyDetailModal from "@/components/PropertyDetailModal";
import BannerHero from "@/components/BannerHero";
import MortgageCalculator from "@/components/MortgageCalculator";
import BankRatesTable from "@/components/BankRatesTable";
import { Property } from "@/lib/types";
import { 
  Search, 
  MapPin, 
  Building, 
  ArrowRight, 
  Award, 
  ShieldCheck, 
  TrendingUp, 
  CheckCircle2, 
  FileText,
  Phone,
  Sparkles,
  ChevronDown
} from "lucide-react";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { getWhatsAppUrl } from "@/lib/whatsapp";

export default function HomePage() {
  const router = useRouter();
  const { properties, agentProfile } = useData();
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // Filtros rápidos del Hero
  const [heroOperation, setHeroOperation] = useState("venta");
  const [heroType, setHeroType] = useState("todos");
  const [heroLocation, setHeroLocation] = useState("");

  // Conteos dinámicos por operación
  const countVenta = useMemo(() => properties.filter((p) => p.operation === "venta").length, [properties]);
  const countAlquiler = useMemo(() => properties.filter((p) => p.operation === "alquiler").length, [properties]);
  const countPozo = useMemo(() => properties.filter((p) => p.operation === "pozo").length, [properties]);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (heroOperation) params.set("operation", heroOperation);
    if (heroType && heroType !== "todos") params.set("type", heroType);
    if (heroLocation) params.set("location", heroLocation.trim());
    router.push(`/propiedades?${params.toString()}`);
  };

  const handleTabClick = (opId: string) => {
    if (heroOperation === opId) {
      // Si ya está activo, navegar directamente al catálogo de esa operación
      router.push(`/propiedades?operation=${opId}`);
    } else {
      setHeroOperation(opId);
    }
  };

  // Propiedades destacadas reactivas según la operación elegida en el Hero
  const featuredProperties = useMemo(() => {
    const matching = properties.filter((p) => p.operation === heroOperation);
    if (matching.length > 0) {
      const feat = matching.filter((p) => p.isFeatured);
      return feat.length > 0 ? feat.slice(0, 6) : matching.slice(0, 6);
    }
    return properties.filter((p) => p.isFeatured).slice(0, 6);
  }, [properties, heroOperation]);

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 1. HERO SECTION PRINCIPAL DE ALTA GAMA */}
      <section className="relative min-h-[85vh] flex items-center justify-center -mt-20 pt-28 pb-16 bg-luxury-black text-white overflow-hidden">
        {/* Fondo con imagen arquitectónica sublime */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85"
            alt="Arquitectura moderna y residencial de lujo"
            fill
            priority
            className="object-cover opacity-25 scale-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/70 to-luxury-black/90" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Badge institucional de alta gama */}
          <div className="inline-flex items-center gap-2.5 bg-luxury-dark/90 border border-gold-400/30 px-5 py-2 rounded-full text-xs tracking-[0.2em] uppercase text-gold-300 backdrop-blur-md shadow-lg transition-all duration-300 hover:border-gold-400 hover:scale-105">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
            <span className="font-medium">99 PROPIEDADES • DESARROLLOS & BIENES RAÍCES</span>
          </div>

          {/* Título de impacto editorial */}
          <div className="space-y-4">
            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight text-white">
              Propiedades Singulares & <br />
              <span className="text-gold-400 italic">Estrategia Inmobiliaria</span>
            </h1>
            <p className="max-w-2xl mx-auto text-sm sm:text-base text-neutral-300 leading-relaxed font-light">
              Gestión inmobiliaria personalizada dirigida por {agentProfile.name}. Comercialización exclusiva de residencias, loteos campestres y desarrollos en pozo con respaldo financiero.
            </p>

            {/* Botón directo de Ver Todas las Propiedades */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/propiedades"
                className="bg-gold-500 hover:bg-gold-400 text-luxury-black font-bold text-xs sm:text-sm uppercase tracking-wider px-6 py-3.5 rounded-sm transition-all shadow-lg hover:shadow-gold-500/30 flex items-center gap-2.5 group"
              >
                <Building className="w-4 h-4 text-luxury-black" />
                <span>Ver Todas las Propiedades</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Motor de Búsqueda Rápida Integrado */}
          <div className="bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-sm shadow-2xl text-neutral-900 text-left border border-white/20 max-w-4xl mx-auto">
            {/* Tabs de Operación */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4 border-b border-neutral-200 pb-3">
              <div className="flex gap-2">
                {[
                  { id: "venta", label: "Comprar", count: countVenta },
                  { id: "alquiler", label: "Alquilar", count: countAlquiler },
                  { id: "pozo", label: "Preventa en Pozo", count: countPozo },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleTabClick(tab.id)}
                    title={heroOperation === tab.id ? `Ver catálogo de ${tab.label}` : `Filtrar por ${tab.label}`}
                    className={`text-xs font-semibold uppercase tracking-wider px-3.5 py-2 rounded-sm transition-all flex items-center gap-1.5 cursor-pointer ${
                      heroOperation === tab.id
                        ? "bg-neutral-900 text-white shadow-sm ring-1 ring-neutral-900"
                        : "text-neutral-500 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200"
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                        heroOperation === tab.id
                          ? "bg-gold-500 text-luxury-black"
                          : "bg-neutral-200 text-neutral-600"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Enlace directo rápido a la categoría */}
              <Link
                href={`/propiedades?operation=${heroOperation}`}
                className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-gold-600 hover:text-gold-700 uppercase tracking-wider transition-colors"
              >
                <span>Ver catálogo ({heroOperation === "alquiler" ? "Alquiler" : heroOperation === "pozo" ? "En Pozo" : "Venta"})</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Formulario de Búsqueda */}
            <form onSubmit={handleHeroSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-5">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mb-1">
                  Ubicación o Barrio
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Ej: Nordelta, Palermo, San Isidro..."
                    value={heroLocation}
                    onChange={(e) => setHeroLocation(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-stone-50 border border-neutral-300 rounded-sm focus:outline-none focus:border-gold-500 text-neutral-800"
                  />
                </div>
              </div>

              <div className="sm:col-span-4">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mb-1">
                  Tipo de Propiedad
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                  <select
                    value={heroType}
                    onChange={(e) => setHeroType(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-stone-50 border border-neutral-300 rounded-sm focus:outline-none focus:border-gold-500 text-neutral-800"
                  >
                    <option value="todos">Todos los Tipos</option>
                    <option value="casa">Casas & Residencias</option>
                    <option value="departamento">Departamentos & Penthouses</option>
                    <option value="loteo">Loteos & Terrenos</option>
                    <option value="desarrollo">Desarrollos & Emprendimientos</option>
                    <option value="comercial">Comerciales</option>
                  </select>
                </div>
              </div>

              <div className="sm:col-span-3 flex items-end">
                <button
                  type="submit"
                  className="w-full bg-gold-500 hover:bg-gold-600 text-luxury-black font-semibold text-xs uppercase tracking-wider py-3 px-4 rounded-sm transition-all shadow-md hover:shadow-gold-500/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>
                    {heroOperation === "alquiler"
                      ? "Buscar Alquileres"
                      : heroOperation === "pozo"
                      ? "Buscar en Pozo"
                      : "Buscar en Venta"}
                  </span>
                </button>
              </div>
            </form>

            {/* Acceso directo contextualizado según la pestaña */}
            <div className="mt-3 pt-3 border-t border-neutral-200/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
              <span className="text-neutral-500 text-[11px]">
                {heroOperation === "alquiler"
                  ? "¿Buscás residencias o departamentos en alquiler?"
                  : heroOperation === "pozo"
                  ? "¿Buscás oportunidades de inversión o preventa en pozo?"
                  : "¿Querés ver todas las opciones disponibles sin filtrar?"}
              </span>
              <Link
                href={`/propiedades?operation=${heroOperation}`}
                className="inline-flex items-center gap-1.5 font-bold text-neutral-900 hover:text-gold-600 transition-colors uppercase tracking-wider text-[11px]"
              >
                <span>
                  {heroOperation === "alquiler"
                    ? `Ver catálogo de propiedades en Alquiler (${countAlquiler})`
                    : heroOperation === "pozo"
                    ? `Ver catálogo de proyectos en Pozo (${countPozo})`
                    : `Ver catálogo de propiedades en Venta (${countVenta})`}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Quick Metrics debajo del hero */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-4 text-neutral-300 border-t border-white/10 max-w-4xl mx-auto">
            <div>
              <span className="block font-serif text-2xl font-bold text-gold-400">
                +{agentProfile.metrics.yearsExperience} Años
              </span>
              <span className="text-[11px] uppercase tracking-wider text-neutral-400">
                Trayectoria en el sector
              </span>
            </div>
            <div>
              <span className="block font-serif text-2xl font-bold text-gold-400">
                USD {agentProfile.metrics.volumeSoldUSD}
              </span>
              <span className="text-[11px] uppercase tracking-wider text-neutral-400">
                Volumen transaccionado
              </span>
            </div>
            <div>
              <span className="block font-serif text-2xl font-bold text-gold-400">
                +{agentProfile.metrics.propertiesClosed}
              </span>
              <span className="text-[11px] uppercase tracking-wider text-neutral-400">
                Operaciones concluidas
              </span>
            </div>
            <div>
              <span className="block font-serif text-2xl font-bold text-gold-400">
                {agentProfile.metrics.clientSatisfactionRate}%
              </span>
              <span className="text-[11px] uppercase tracking-wider text-neutral-400">
                Satisfacción auditada
              </span>
            </div>
          </div>

          {/* Indicador visual e interactivo de Scroll hacia abajo */}
          <div className="pt-6 sm:pt-10 flex flex-col items-center justify-center">
            <button
              onClick={() => {
                const target = document.getElementById("contenido-principal");
                target?.scrollIntoView({ behavior: "smooth" });
              }}
              className="group inline-flex flex-col items-center gap-2 text-neutral-300 hover:text-gold-400 transition-all cursor-pointer focus:outline-none"
              aria-label="Deslizar hacia abajo para seguir viendo contenido"
            >
              <span className="text-[11px] sm:text-xs uppercase tracking-[0.2em] font-medium text-neutral-300 group-hover:text-gold-400 transition-colors flex items-center gap-1.5">
                <span>Desliza para ver más contenido</span>
              </span>
              <div className="w-5 h-9 border-2 border-gold-400/60 rounded-full flex justify-center p-1 group-hover:border-gold-400 transition-colors shadow-sm bg-luxury-black/40 backdrop-blur-xs">
                <div className="w-1.5 h-2 bg-gold-400 rounded-full animate-bounce" />
              </div>
              <ChevronDown className="w-4 h-4 text-gold-400 animate-bounce -mt-1 group-hover:scale-125 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* 2. SECCIÓN DESTACADA DINÁMICA: OPORTUNIDADES & DESARROLLOS */}
      <section id="contenido-principal" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <BannerHero />
      </section>

      {/* 3. CATÁLOGO INTERACTIVO: PROPIEDADES DESTACADAS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gold-600 bg-gold-50 px-2.5 py-1 rounded-sm mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {heroOperation === "alquiler"
                  ? "Alquileres Destacados"
                  : heroOperation === "pozo"
                  ? "Lanzamientos en Pozo"
                  : "Colección Exclusiva"}
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900">
              {heroOperation === "alquiler"
                ? "Propiedades en Alquiler"
                : heroOperation === "pozo"
                ? "Desarrollos & Preventas en Pozo"
                : "Inmuebles Seleccionados en Venta"}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              {heroOperation === "alquiler"
                ? "Departamentos y residencias en alquiler tradicional y corporativo con administración integral."
                : heroOperation === "pozo"
                ? "Emprendimientos y desarrollos en preventa con esquemas de cuotas y alta rentabilidad."
                : "Cartera curada de propiedades residenciales, comerciales y loteos en las ubicaciones más codiciadas."}
            </p>
          </div>

          <Link
            href={`/propiedades?operation=${heroOperation}`}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-900 hover:text-gold-600 border-b border-neutral-900 hover:border-gold-600 pb-1 transition-colors"
          >
            <span>
              {heroOperation === "alquiler"
                ? `Ver Todos los Alquileres (${countAlquiler})`
                : heroOperation === "pozo"
                ? `Ver Todas las Preventas en Pozo (${countPozo})`
                : `Ver Catálogo en Venta (${countVenta})`}
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Grid de Propiedades */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProperties.map((prop) => (
            <PropertyCard
              key={prop.id}
              property={prop}
              onSelectProperty={(p) => setSelectedProperty(p)}
            />
          ))}
        </div>

        {/* CTA centrado para acceder al catálogo completo */}
        <div className="pt-4 text-center">
          <Link
            href="/propiedades"
            className="inline-flex items-center justify-center gap-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs sm:text-sm uppercase tracking-wider px-8 py-3.5 rounded-sm transition-all shadow-md hover:shadow-lg border border-neutral-800 group"
          >
            <Building className="w-4 h-4 text-gold-400" />
            <span>Ver Todas las Propiedades ({properties.length})</span>
            <ArrowRight className="w-4 h-4 text-gold-400 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* 4. MARCA PERSONAL & VALOR AGREGADO: SECCIÓN "SOBRE MÍ" */}
      <section className="bg-stone-100 py-16 sm:py-24 border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Fotografía y credenciales del agente */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative h-[480px] w-full rounded-sm overflow-hidden shadow-xl border border-neutral-300">
                <Image
                  src={agentProfile.photoUrl}
                  alt={agentProfile.name}
                  fill
                  className="object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <div className="font-serif text-2xl font-bold">{agentProfile.name}</div>
                  <div className="text-xs text-gold-400 font-medium tracking-wide">
                    {agentProfile.roleTitle}
                  </div>
                  <div className="text-[11px] text-neutral-300 font-mono mt-1">
                    {agentProfile.licenseNumber}
                  </div>
                </div>
              </div>
            </div>

            {/* Biografía y Pilares */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gold-600 bg-gold-50 px-2.5 py-1 rounded-sm">
                <Award className="w-3.5 h-3.5" />
                <span>Marca Personal & Trayectoria</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 leading-tight">
                Asesoramiento Estratégico, Rigor Técnico y Respaldo Personal
              </h2>

              <p className="text-sm text-neutral-700 leading-relaxed">
                {agentProfile.bio}
              </p>

              {/* Pilares de trabajo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {agentProfile.pillars.map((pillar, idx) => (
                  <div key={idx} className="p-4 bg-white border border-neutral-200 rounded-sm">
                    <h4 className="font-serif text-sm font-bold text-neutral-900 mb-1 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />
                      {pillar.title}
                    </h4>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* CTAs de Contacto */}
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <Link
                  href="/contacto"
                  className="bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-wider px-6 py-3 rounded-sm transition-colors"
                >
                  Agendar Consulta Privada
                </Link>

                <a
                  href={getWhatsAppUrl(agentProfile.whatsappNumber, `Hola ${agentProfile.name}, quisiera conversar sobre asesoramiento inmobiliario`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 hover:text-emerald-900 font-semibold text-xs flex items-center gap-2 px-4 py-3 rounded-sm border border-emerald-600/30 hover:border-emerald-600 bg-emerald-50/60 hover:bg-emerald-50 transition-all btn-tactile"
                >
                  <WhatsAppIcon className="w-4 h-4 text-[#25D366] drop-shadow-sm" />
                  <span>Conversar directamente por WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SECCIÓN INFORMATIVA / FINANCIERA: SIMULADOR & COMPARADOR DE TASAS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <MortgageCalculator />
        <BankRatesTable />
      </section>

      {/* 6. BANNER DE TASACIÓN PROFESIONAL & SERVICIOS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-luxury-black text-white p-8 sm:p-12 rounded-sm border border-gold-500/20 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="relative z-10 max-w-xl space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest text-gold-400 font-semibold">
                Servicio Exclusivo para Propietarios
              </span>
              <span className="text-[10px] bg-gold-500/20 text-gold-300 border border-gold-500/40 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                Siempre Sin Cargo
              </span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              ¿Deseas conocer el valor real de mercado de tu propiedad o loteo?
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              Realizamos tasaciones profesionales <strong>100% sin cargo</strong> con rigor técnico, valores de cierre efectivo y estudio comparativo de mercado. Además, administramos integralmente tus alquileres y gestionamos créditos hipotecarios con las mejores tasas bancarias.
            </p>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <Link
              href="/contacto?asunto=tasacion"
              className="w-full sm:w-auto text-center bg-gold-500 hover:bg-gold-600 text-luxury-black font-bold text-xs uppercase tracking-wider px-6 py-4 rounded-sm transition-all shadow-lg hover:shadow-gold-500/30 flex items-center justify-center gap-2"
            >
              <span>Solicitar Tasación Sin Cargo</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Modal de Detalle de Propiedad */}
      <PropertyDetailModal
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
      />
    </div>
  );
}
