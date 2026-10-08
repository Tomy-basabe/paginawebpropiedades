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
  const { properties, agentProfile, hideSoldProperties } = useData();
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // Propiedades visibles (respetando si el admin decidió ocultar vendidas)
  const activeProperties = useMemo(() => {
    return hideSoldProperties ? properties.filter((p) => p.status !== "vendido") : properties;
  }, [properties, hideSoldProperties]);

  // Filtros rápidos del Hero
  const [heroOperation, setHeroOperation] = useState("venta");
  const [heroType, setHeroType] = useState("todos");
  const [heroLocation, setHeroLocation] = useState("");

  // Conteos dinámicos por operación
  const countVenta = useMemo(() => activeProperties.filter((p) => p.operation === "venta").length, [activeProperties]);
  const countAlquiler = useMemo(() => activeProperties.filter((p) => p.operation === "alquiler").length, [activeProperties]);
  const countPozo = useMemo(() => activeProperties.filter((p) => p.operation === "pozo").length, [activeProperties]);

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
    const matching = activeProperties.filter((p) => p.operation === heroOperation);
    if (matching.length > 0) {
      const feat = matching.filter((p) => p.isFeatured);
      return feat.length > 0 ? feat.slice(0, 6) : matching.slice(0, 6);
    }
    return activeProperties.filter((p) => p.isFeatured).slice(0, 6);
  }, [activeProperties, heroOperation]);

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 1. HERO SECTION PRINCIPAL DE ALTA GAMA */}
      <section className="relative min-h-[82vh] flex items-center justify-center -mt-20 pt-28 pb-16 bg-neutral-950 text-white overflow-hidden">
        {/* Fondo arquitectónico con velo sutil */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85"
            alt="Arquitectura residencial contemporánea"
            fill
            priority
            className="object-cover opacity-20 scale-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-neutral-950/90" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Badge institucional sobrio */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[2px] bg-white/[0.05] border border-white/[0.1] text-neutral-300 text-[11px] tracking-[0.2em] uppercase font-medium backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
            <span>99 Propiedades • Desarrollos & Bienes Raíces</span>
          </div>

          {/* Título de impacto editorial sobrio */}
          <div className="space-y-4">
            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-normal tracking-tight leading-[1.15] text-white">
              Propiedades singulares, desarrollos <br className="hidden sm:block" />
              y asesoramiento inmobiliario de excelencia.
            </h1>
            <p className="max-w-2xl mx-auto text-sm sm:text-base text-neutral-300 leading-relaxed font-light">
              Gestión inmobiliaria personalizada a cargo de {agentProfile.name}. Comercialización exclusiva de residencias, loteos campestres y emprendimientos en pozo con respaldo financiero.
            </p>

            {/* Acceso directo al catálogo */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/propiedades"
                className="bg-gold-500 hover:bg-gold-400 text-neutral-950 font-semibold text-xs sm:text-sm uppercase tracking-wider px-6 py-3.5 rounded-[3px] transition-all shadow-sm hover:shadow-md flex items-center gap-2.5 group"
              >
                <Building className="w-4 h-4 text-neutral-950" />
                <span>Explorar Catálogo Completo</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Consola de Búsqueda Integrada de Alta Gama */}
          <div className="bg-neutral-950/85 backdrop-blur-xl p-4 sm:p-6 rounded-[4px] shadow-2xl text-white text-left border border-white/[0.12] max-w-4xl mx-auto">
            {/* Tabs de Operación */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4 border-b border-white/[0.08] pb-3">
              <div className="flex gap-1.5 sm:gap-2">
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
                    className={`text-xs font-medium uppercase tracking-wider px-3.5 py-2 rounded-[2px] transition-all flex items-center gap-1.5 cursor-pointer ${
                      heroOperation === tab.id
                        ? "bg-white text-neutral-950 font-semibold shadow-xs"
                        : "text-neutral-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08]"
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                        heroOperation === tab.id
                          ? "bg-gold-500 text-neutral-950"
                          : "bg-white/[0.08] text-neutral-300"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Enlace directo a la categoría */}
              <Link
                href={`/propiedades?operation=${heroOperation}`}
                className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-medium text-gold-300 hover:text-gold-200 uppercase tracking-wider transition-colors"
              >
                <span>Ver catálogo ({heroOperation === "alquiler" ? "Alquiler" : heroOperation === "pozo" ? "En Pozo" : "Venta"})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Formulario de Búsqueda */}
            <form onSubmit={handleHeroSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-5">
                <label className="block text-[11px] font-medium uppercase tracking-wider text-neutral-400 mb-1.5">
                  Ubicación o Barrio
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Ej: Nordelta, Palermo, San Isidro..."
                    value={heroLocation}
                    onChange={(e) => setHeroLocation(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-white/[0.05] border border-white/[0.12] rounded-[3px] focus:outline-none focus:border-gold-400 text-white placeholder:text-neutral-500"
                  />
                </div>
              </div>

              <div className="sm:col-span-4">
                <label className="block text-[11px] font-medium uppercase tracking-wider text-neutral-400 mb-1.5">
                  Tipo de Propiedad
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                  <select
                    value={heroType}
                    onChange={(e) => setHeroType(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-white/[0.05] border border-white/[0.12] rounded-[3px] focus:outline-none focus:border-gold-400 text-white [&>option]:text-neutral-900"
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
                  className="w-full bg-gold-500 hover:bg-gold-400 text-neutral-950 font-semibold text-xs uppercase tracking-wider py-3 px-4 rounded-[3px] transition-all shadow-xs hover:shadow-sm flex items-center justify-center gap-2 cursor-pointer btn-tactile"
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

            {/* Pie del buscador con micro-enlace */}
            <div className="mt-3 pt-3 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
              <span className="text-neutral-400 text-[11px]">
                {heroOperation === "alquiler"
                  ? "Residencias y departamentos en alquiler tradicional y corporativo."
                  : heroOperation === "pozo"
                  ? "Oportunidades de inversión con esquemas de financiación directa."
                  : "Catálogo selecto de propiedades verificadas y tasadas a valor real."}
              </span>
              <Link
                href={`/propiedades?operation=${heroOperation}`}
                className="inline-flex items-center gap-1.5 font-medium text-gold-300 hover:text-white transition-colors uppercase tracking-wider text-[11px]"
              >
                <span>
                  {heroOperation === "alquiler"
                    ? `Ver catálogo de Alquiler (${countAlquiler})`
                    : heroOperation === "pozo"
                    ? `Ver proyectos en Pozo (${countPozo})`
                    : `Ver catálogo de Venta (${countVenta})`}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Quick Metrics debajo del hero */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 text-neutral-300 border-t border-white/[0.08] max-w-4xl mx-auto">
            <div>
              <span className="block font-serif text-2xl sm:text-3xl font-light text-gold-300">
                +{agentProfile.metrics.yearsExperience} Años
              </span>
              <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium">
                Trayectoria en el sector
              </span>
            </div>
            <div>
              <span className="block font-serif text-2xl sm:text-3xl font-light text-gold-300">
                USD {agentProfile.metrics.volumeSoldUSD}
              </span>
              <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium">
                Volumen transaccionado
              </span>
            </div>
            <div>
              <span className="block font-serif text-2xl sm:text-3xl font-light text-gold-300">
                +{agentProfile.metrics.propertiesClosed}
              </span>
              <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium">
                Operaciones concluidas
              </span>
            </div>
            <div>
              <span className="block font-serif text-2xl sm:text-3xl font-light text-gold-300">
                {agentProfile.metrics.clientSatisfactionRate}%
              </span>
              <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium">
                Satisfacción auditada
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SECCIÓN DESTACADA DINÁMICA: OPORTUNIDADES & DESARROLLOS */}
      <section id="contenido-principal" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <BannerHero />
      </section>

      {/* 3. CATÁLOGO INTERACTIVO: PROPIEDADES DESTACADAS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200 pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-gold-700 bg-gold-50/80 px-2.5 py-1 rounded-[2px] mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {heroOperation === "alquiler"
                  ? "Alquileres Destacados"
                  : heroOperation === "pozo"
                  ? "Lanzamientos en Pozo"
                  : "Colección Exclusiva"}
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-normal text-neutral-900 tracking-tight">
              {heroOperation === "alquiler"
                ? "Propiedades en Alquiler"
                : heroOperation === "pozo"
                ? "Desarrollos & Preventas en Pozo"
                : "Inmuebles Seleccionados en Venta"}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1 max-w-2xl font-light leading-relaxed">
              {heroOperation === "alquiler"
                ? "Departamentos y residencias en alquiler tradicional y corporativo con administración integral."
                : heroOperation === "pozo"
                ? "Emprendimientos y desarrollos en preventa con esquemas de cuotas y alta rentabilidad."
                : "Cartera curada de propiedades residenciales, comerciales y loteos en las ubicaciones más codiciadas."}
            </p>
          </div>

          <Link
            href={`/propiedades?operation=${heroOperation}`}
            className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-neutral-900 hover:text-gold-700 pb-1 border-b border-neutral-900 hover:border-gold-700 transition-colors"
          >
            <span>
              {heroOperation === "alquiler"
                ? `Ver Todos (${countAlquiler})`
                : heroOperation === "pozo"
                ? `Ver Todas (${countPozo})`
                : `Ver Catálogo (${countVenta})`}
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Grid de Propiedades */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
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
            className="inline-flex items-center justify-center gap-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-xs sm:text-sm uppercase tracking-wider px-8 py-3.5 rounded-[3px] transition-all shadow-xs hover:shadow-sm group"
          >
            <Building className="w-4 h-4 text-gold-400" />
            <span>Ver Todas las Propiedades ({properties.length})</span>
            <ArrowRight className="w-4 h-4 text-gold-400 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* 4. MARCA PERSONAL & VALOR AGREGADO: SECCIÓN "SOBRE MÍ" */}
      <section className="bg-[#FAF8F5] py-16 sm:py-24 border-y border-stone-200/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Fotografía y credenciales del agente */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative h-[490px] w-full rounded-[4px] overflow-hidden shadow-lg border border-stone-300/80">
                <Image
                  src={agentProfile.photoUrl}
                  alt={agentProfile.name}
                  fill
                  className="object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <div className="font-serif text-2xl font-normal tracking-wide">{agentProfile.name}</div>
                  <div className="text-xs text-gold-300 font-medium tracking-wider uppercase mt-0.5">
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
              <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-gold-700 bg-gold-50/80 px-2.5 py-1 rounded-[2px]">
                <Award className="w-3.5 h-3.5" />
                <span>Marca Personal & Trayectoria</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl font-normal text-neutral-900 leading-tight">
                Asesoramiento estratégico, rigor técnico y compromiso personal.
              </h2>

              <p className="text-sm text-neutral-600 leading-relaxed font-light">
                {agentProfile.bio}
              </p>

              {/* Pilares de trabajo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {agentProfile.pillars.map((pillar, idx) => (
                  <div key={idx} className="p-4 bg-white border border-stone-200/90 rounded-[3px] shadow-2xs">
                    <h4 className="font-serif text-sm font-semibold text-neutral-900 mb-1 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />
                      {pillar.title}
                    </h4>
                    <p className="text-xs text-neutral-500 leading-relaxed font-light">
                      {pillar.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* CTAs de Contacto */}
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <Link
                  href="/contacto"
                  className="bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-wider px-6 py-3.5 rounded-[3px] transition-colors btn-tactile"
                >
                  Agendar Consulta Privada
                </Link>

                <a
                  href={getWhatsAppUrl(agentProfile.whatsappNumber, `Hola ${agentProfile.name}, quisiera conversar sobre asesoramiento inmobiliario`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-700 hover:text-neutral-900 font-medium text-xs flex items-center gap-2 px-4 py-3.5 rounded-[3px] border border-stone-300 hover:border-emerald-600/40 bg-white hover:bg-emerald-50/40 transition-all btn-tactile"
                >
                  <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
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
        <div className="bg-neutral-950 text-white p-8 sm:p-12 rounded-[4px] border border-white/[0.1] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="relative z-10 max-w-xl space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-[0.2em] text-gold-300 font-medium">
                Servicio Exclusivo para Propietarios
              </span>
              <span className="text-[10px] bg-white/[0.08] text-white border border-white/[0.15] px-2 py-0.5 rounded-[2px] font-medium uppercase tracking-wider">
                Siempre Sin Cargo
              </span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-normal text-white">
              ¿Deseas conocer el valor real de mercado de tu propiedad o loteo?
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-light">
              Realizamos tasaciones profesionales <strong>100% sin cargo</strong> con rigor técnico, valores de cierre efectivo y estudio comparativo de mercado. Además, administramos integralmente tus alquileres y gestionamos créditos hipotecarios con las mejores tasas bancarias.
            </p>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <Link
              href="/contacto?asunto=tasacion"
              className="w-full sm:w-auto text-center bg-gold-500 hover:bg-gold-400 text-neutral-950 font-semibold text-xs uppercase tracking-wider px-7 py-4 rounded-[3px] transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 btn-tactile"
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
