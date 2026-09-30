"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useData } from "@/context/DataContext";
import { 
  Award, 
  ShieldCheck, 
  TrendingUp, 
  MapPin, 
  Phone, 
  Mail, 
  CheckCircle2,
  FileCheck,
  Star
} from "lucide-react";
import WhatsAppIcon from "@/components/WhatsAppIcon";

export default function SobreMiPage() {
  const { agentProfile } = useData();

  const testimonials = [
    {
      name: "Arq. Marcelo Rossi",
      role: "Director de Rossi Desarrollos Urbanos",
      comment: "Juan Pablo lideró la preventa de nuestro último desarrollo residencial. Su criterio comercial, su liderazgo local en ventas y la seriedad con la que defiende el valor de cada metro cuadrado marcaron una diferencia absoluta en los plazos de cierre.",
    },
    {
      name: "Dr. Federico Benítez & Fam.",
      role: "Comprador de Residencia Familiar",
      comment: "Comprar una propiedad exige confianza y acompañamiento integral. Juan Pablo nos asesoró tanto en la negociación y gestión del crédito hipotecario como en la estructuración notarial con una solvencia y compromiso total.",
    },
    {
      name: "Lic. Clara Echeverría",
      role: "Propietaria con Alquileres en Administración",
      comment: "Confío la administración integral de mis propiedades a 99 Propiedades. La rigurosa selección de inquilinos, la puntualidad en los cobros y las tasaciones sin cargo hacen que uno trabaje con absoluta tranquilidad.",
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Encabezado */}
      <div className="border-b border-neutral-200 pb-8">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gold-600 bg-gold-50 px-2.5 py-1 rounded-sm mb-2">
          <Award className="w-3.5 h-3.5" />
          <span>Perfil Institucional & Trayectoria</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900">
          Sobre {agentProfile.name}
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-2 max-w-2xl">
          {agentProfile.roleTitle} • Matrícula {agentProfile.licenseNumber}
        </p>
      </div>

      {/* Grid Principal: Foto y Biografía Editorial */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Columna Izquierda: Retrato y Datos Directos */}
        <div className="lg:col-span-5 space-y-6">
          <div className="relative h-[520px] w-full rounded-sm overflow-hidden shadow-2xl border border-neutral-200">
            <Image
              src={agentProfile.photoUrl}
              alt={agentProfile.name}
              fill
              priority
              className="object-cover object-top"
            />
          </div>

          <div className="bg-white p-6 rounded-sm border border-neutral-200 space-y-4 text-xs">
            <h3 className="font-serif text-sm font-bold text-neutral-900 uppercase tracking-wider">
              Datos de Despacho Profesional
            </h3>
            <div className="space-y-2.5 text-neutral-600">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                <span>{agentProfile.officeAddress}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold-500 shrink-0" />
                <span>{agentProfile.phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gold-500 shrink-0" />
                <a href={`mailto:${agentProfile.email}`} className="hover:text-gold-600 transition-colors">
                  {agentProfile.email}
                </a>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={`https://wa.me/${agentProfile.whatsappNumber}?text=Hola%20${encodeURIComponent(agentProfile.name)},%20quisiera%20coordinar%20una%20reunion`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold text-xs py-3.5 rounded-sm transition-all duration-200 flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg hover:shadow-emerald-500/25 btn-tactile"
              >
                <WhatsAppIcon className="w-4 h-4 drop-shadow-sm" />
                <span>Coordinar Reunión por WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Manifiesto, Métricas y Pilares */}
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-widest text-gold-600 font-semibold">
              Visión & Metodología
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 leading-snug">
              "El mercado inmobiliario contemporáneo premia la especialización técnica y la honestidad analítica."
            </h2>
            <p className="text-sm text-neutral-700 leading-relaxed">
              {agentProfile.bio}
            </p>
            <p className="text-sm text-neutral-700 leading-relaxed">
              En un entorno donde la información suele ser confusa o fragmentada, mi propósito es brindar certidumbre patrimonial a cada cliente. Ya sea evaluando un loteo en preventa, tasando una residencia familiar o asesorando en una estructuración de crédito hipotecario, cada operación recibe una dedicación minuciosa y personalizada.
            </p>
          </div>

          {/* Métricas Auditadas */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-luxury-black text-white rounded-sm">
            <div>
              <span className="block font-serif text-3xl font-bold text-gold-400">
                +{agentProfile.metrics.yearsExperience}
              </span>
              <span className="text-[11px] text-neutral-400 uppercase tracking-wider">
                Años de Experiencia
              </span>
            </div>
            <div>
              <span className="block font-serif text-3xl font-bold text-gold-400">
                USD {agentProfile.metrics.volumeSoldUSD}
              </span>
              <span className="text-[11px] text-neutral-400 uppercase tracking-wider">
                Volumen Transaccionado
              </span>
            </div>
            <div>
              <span className="block font-serif text-3xl font-bold text-gold-400">
                +{agentProfile.metrics.propertiesClosed}
              </span>
              <span className="text-[11px] text-neutral-400 uppercase tracking-wider">
                Operaciones Exitosas
              </span>
            </div>
            <div>
              <span className="block font-serif text-3xl font-bold text-gold-400">
                {agentProfile.metrics.clientSatisfactionRate}%
              </span>
              <span className="text-[11px] text-neutral-400 uppercase tracking-wider">
                Clientes Satisfechos
              </span>
            </div>
          </div>

          {/* Pilares */}
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-bold text-neutral-900">
              Pilares Fundamentales de Mi Gestión
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {agentProfile.pillars.map((pillar, idx) => (
                <div key={idx} className="p-4 bg-white border border-neutral-200/90 rounded-sm card-hover-lift hover:border-gold-400/60">
                  <h4 className="font-serif text-sm font-bold text-neutral-900 mb-1 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-gold-500" />
                    <span>{pillar.title}</span>
                  </h4>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Testimonios */}
      <section className="bg-stone-100 p-8 sm:p-12 rounded-sm border border-neutral-200 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-gold-600">
            Opiniones de Clientes & Desarrolladores
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900">
            Relaciones Construidas sobre Resultados
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div key={idx} className="bg-white p-6 rounded-sm border border-neutral-200/90 shadow-sm flex flex-col justify-between card-hover-lift hover:border-gold-400/60">
              <div>
                <div className="flex gap-1 text-gold-500 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-gold-500" />
                  ))}
                </div>
                <p className="text-xs text-neutral-700 leading-relaxed italic mb-6">
                  "{t.comment}"
                </p>
              </div>
              <div className="border-t border-neutral-100 pt-3">
                <span className="block font-semibold text-neutral-900 text-xs">{t.name}</span>
                <span className="text-[11px] text-neutral-400">{t.role}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
