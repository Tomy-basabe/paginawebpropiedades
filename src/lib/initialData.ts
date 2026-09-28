import { Property, BankRate, FeaturedBanner, AgentProfile } from './types';

export const INITIAL_AGENT_PROFILE: AgentProfile = {
  name: "Ignacio Valenzuela",
  roleTitle: "Consultor Inmobiliario Senior & Director Comercial",
  licenseNumber: "CUCICBA Mat. 6842 / CMCPSI 5910",
  bio: "Con más de 12 años en el mercado inmobiliario de alta gama y desarrollos residenciales en 99 Propiedades, acompaño a inversores, desarrolladores y familias a tomar decisiones patrimoniales estratégicas. Nuestro enfoque combina rigurosidad analítica de mercado, estructuración financiera personalizada y un estándar de comercialización audiovisual de nivel internacional.",
  shortBio: "99 Propiedades: Asesoramiento patrimonial de alta gama, desarrollos inmobiliarios y comercialización exclusiva de propiedades singulares.",
  photoUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80",
  phone: "+54 9 11 4890-7722",
  whatsappNumber: "5491148907722",
  whatsappDisplay: "+54 9 11 4890-7722",
  email: "contacto@99propiedades.com",
  officeAddress: "Av. del Libertador 4480, Belgrano, CABA",
  social: {
    instagram: "https://instagram.com/ignaciovalenzuela.re",
    linkedin: "https://linkedin.com/in/ignaciovalenzuela-propiedades",
    youtube: "https://youtube.com/@ignaciovalenzuelarealestate",
  },
  metrics: {
    yearsExperience: 12,
    volumeSoldUSD: "+48M",
    propertiesClosed: 195,
    clientSatisfactionRate: 99,
  },
  pillars: [
    {
      title: "Tasación de Precisión",
      description: "Modelos comparativos de mercado y análisis de rentabilidad real que defienden el verdadero valor de tu activo."
    },
    {
      title: "Estructuración Financiera",
      description: "Asesoramiento exhaustivo en líneas de crédito hipotecario, permutas, fideicomisos y planes de financiación en pozo."
    },
    {
      title: "Marketing Audiovisual de Vanguardia",
      description: "Producción cinematográfica 4K, tomas con dron, renders inmersivos y difusión directa en nuestra red privada de inversores."
    },
    {
      title: "Confidencialidad & Seguridad Jurídica",
      description: "Acompañamiento legal y notarial estricto en cada instancia de la reserva, boleto y escritura traslativa de dominio."
    }
  ]
};

export const INITIAL_FEATURED_BANNERS: FeaturedBanner[] = [
  {
    id: "banner-1",
    title: "Residencias Terrazas del Golf",
    subtitle: "Desarrollo Exclusivo en Preventa - Nordelta",
    badge: "Oportunidad de Inversión",
    description: "Unidades de 2, 3 y 4 ambientes con vistas panorámicas a la laguna. Anticipo 30% en USD y saldo en 36 cuotas en moneda dura o CAC.",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80",
    ctaText: "Ver Masterplan y Precios",
    ctaLink: "/propiedades?type=desarrollo",
    active: true,
    propertyIdRef: "prop-4"
  },
  {
    id: "banner-2",
    title: "Chacras de San Ignacio",
    subtitle: "Loteos Campestres de 1.800 a 3.500 m²",
    badge: "Lanzamiento Fase 2",
    description: "Entorno natural protegido a solo 45 minutos de Capital. Acceso asfaltado, red de fibra óptica subterránea y club house ecológico.",
    imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1920&q=80",
    ctaText: "Consultar Lotes Disponibles",
    ctaLink: "/propiedades?type=loteo",
    active: true,
    propertyIdRef: "prop-5"
  }
];

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: "prop-1",
    title: "Villa Contemporánea con Muelle Propio",
    slug: "villa-contemporanea-muelle-propio-nordelta",
    type: "casa",
    operation: "venta",
    status: "disponible",
    price: 890000,
    currency: "USD",
    location: {
      city: "Tigre",
      neighborhood: "Nordelta - El Golf",
      address: "Av. del Golf 1200",
      zone: "Zona Norte"
    },
    features: {
      bedrooms: 4,
      bathrooms: 5,
      parkingSpaces: 3,
      totalArea: 650,
      coveredArea: 420,
      yearBuilt: 2023,
      expenses: 320
    },
    amenities: ["Piscina Infinity", "Muelle Privado", "Seguridad 24hs", "Cava de Vinos", "Calefacción por Piso Radiante", "Domótica Total"],
    description: "Imponente residencia de arquitectura minimalista concebida para maximizar las visuales al agua. Living de doble altura con paños vidriados de piso a techo, cocina de diseño con isla en mármol Calacatta y master suite con vestidor doble y terraza privada hacia el canal.",
    highlightSummary: "Vistas directas al lago central, acabados italianos y muelle náutico propio.",
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80"
    ],
    isFeatured: true,
    isOpportunity: false,
    createdAt: "2026-02-15"
  },
  {
    id: "prop-2",
    title: "Penthouse Dúplex con Rooftop Privado y Piscina",
    slug: "penthouse-duplex-rooftop-palermo-chico",
    type: "departamento",
    operation: "venta",
    status: "oportunidad",
    price: 640000,
    currency: "USD",
    location: {
      city: "CABA",
      neighborhood: "Palermo Chico",
      address: "Castex & San Martín de Tours",
      zone: "Capital Federal"
    },
    features: {
      bedrooms: 3,
      bathrooms: 4,
      parkingSpaces: 2,
      totalArea: 310,
      coveredArea: 220,
      yearBuilt: 2022,
      expenses: 280
    },
    amenities: ["Rooftop Privado", "Piscina Climatizada", "Seguridad 24hs", "Gimnasio", "Parrilla en Terraza", "Cocheras Fijas"],
    description: "Exclusivo penthouse en el corazón más distinguido de Palermo Chico. Planta baja con recepción solemne, comedor formal y cocina integrada con mobiliario de origen alemán. Planta superior con terraza propia de 90m², piscina climatizada y quincho gourmet.",
    highlightSummary: "Oportunidad por traslado: valor por m² debajo de la media histórica de la zona.",
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80"
    ],
    isFeatured: true,
    isOpportunity: true,
    opportunityBadge: "Oportunidad Valor Retasado",
    createdAt: "2026-03-01"
  },
  {
    id: "prop-3",
    title: "Residencia Racionalista en Barrancas",
    slug: "residencia-racionalista-barrancas-san-isidro",
    type: "casa",
    operation: "venta",
    status: "disponible",
    price: 1150000,
    currency: "USD",
    location: {
      city: "San Isidro",
      neighborhood: "Barrancas de San Isidro",
      address: "Del Libertador al Río",
      zone: "Zona Norte"
    },
    features: {
      bedrooms: 5,
      bathrooms: 6,
      parkingSpaces: 4,
      totalArea: 1100,
      coveredArea: 580,
      yearBuilt: 2021,
      expenses: 150
    },
    amenities: ["Parque Centenario", "Piscina Semiolímpica", "Quincho Gourmet", "Sauna & Spa", "Grupo Electrógeno", "Seguridad perimetral"],
    description: "Fusión magistral entre naturaleza añosa y líneas puras de hormigón a la vista y madera de lapacho. Amplios ventanales corredizos que integran el jardín y la piscina al área social principal. Suite principal de 80 m² con jacuzzi y vestidor walk-in.",
    highlightSummary: "Ubicación privilegiada en zona de embajadas y colegios internacionales.",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80"
    ],
    isFeatured: true,
    isOpportunity: false,
    createdAt: "2026-01-20"
  },
  {
    id: "prop-4",
    title: "Torre Alvear Boulevard - Preventa en Pozo",
    slug: "torre-alvear-boulevard-pozo-puerto-madero",
    type: "desarrollo",
    operation: "pozo",
    status: "oportunidad",
    price: 245000,
    currency: "USD",
    location: {
      city: "CABA",
      neighborhood: "Puerto Madero",
      address: "Boulevard Azucena Villaflor",
      zone: "Capital Federal"
    },
    features: {
      bedrooms: 2,
      bathrooms: 2,
      parkingSpaces: 1,
      totalArea: 84,
      coveredArea: 76,
      yearBuilt: 2027,
      expenses: 120
    },
    amenities: ["Sky Lounge Piso 35", "Piscina Climatizada In/Out", "Co-working Business Center", "Concierge 24hs", "Gimnasio Technogym"],
    description: "Emprendimiento de vanguardia con certificación LEED Gold. Opciones de 1, 2 y 3 dormitorios ideadas para renta temporal corporativa o residencia permanente. Esquema de financiación sumamente flexible adaptado a inversores.",
    highlightSummary: "Preventa Etapa Cero: Anticipo 25% y 36 cuotas fijas en USD.",
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80"
    ],
    isFeatured: true,
    isOpportunity: true,
    opportunityBadge: "Preventa Pozo - Alta Renta",
    createdAt: "2026-03-10"
  },
  {
    id: "prop-5",
    title: "Chacras Alvear - Lote Perimetral de 2.200 m²",
    slug: "chacras-alvear-lote-canning",
    type: "loteo",
    operation: "venta",
    status: "disponible",
    price: 95000,
    currency: "USD",
    location: {
      city: "Canning",
      neighborhood: "Chacras Alvear Eco-Reserva",
      address: "Ruta 58 Km 14",
      zone: "Zona Sur"
    },
    features: {
      bedrooms: 0,
      bathrooms: 0,
      parkingSpaces: 0,
      totalArea: 2200,
      coveredArea: 0,
      expenses: 90
    },
    amenities: ["Laguna Natural de 7 Has", "Club Náutico sin motor", "Tenis & Pádel", "Seguridad 24hs", "Tendido Eléctrico Subterráneo"],
    description: "Magnífico lote con suave pendiente hacia el espejo de agua y orientación norte ideal para proyectos sustentables. Escrituración inmediata, listo para edificar tu casa de descanso o vivienda permanente en un barrio con +70% de áreas verdes protegidas.",
    highlightSummary: "Financiación directa del desarrollador: 50% anticipo y 24 cuotas sin interés.",
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
    ],
    isFeatured: true,
    isOpportunity: false,
    createdAt: "2026-02-28"
  },
  {
    id: "prop-6",
    title: "Piso Exclusivo en Avenida Alvear",
    slug: "piso-exclusivo-avenida-alvear-recoleta",
    type: "departamento",
    operation: "alquiler",
    status: "disponible",
    price: 3200,
    currency: "USD",
    location: {
      city: "CABA",
      neighborhood: "Recoleta",
      address: "Av. Alvear & Ayacucho",
      zone: "Capital Federal"
    },
    features: {
      bedrooms: 3,
      bathrooms: 4,
      parkingSpaces: 2,
      totalArea: 280,
      coveredArea: 260,
      yearBuilt: 2018,
      expenses: 450
    },
    amenities: ["Palier Privado", "Vigilancia Presencial 24hs", "Balcón Aterrazado", "Dependencia de Servicio", "Calefacción Central"],
    description: "Elegancia señorial en la cuadra más cotizada de Recoleta. Techos altos de 3.20m, pisos de roble de Eslavonia restaurados y carpinterías con doble vidrio hermético (DVH). Amoblado con piezas de colección y equipamiento de primera línea.",
    highlightSummary: "Alquiler diplomático / corporativo totalmente equipado.",
    images: [
      "https://images.unsplash.com/photo-1502005229762-ee1b2da97a0f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80"
    ],
    isFeatured: false,
    isOpportunity: false,
    createdAt: "2026-03-05"
  }
];

export const INITIAL_BANK_RATES: BankRate[] = [
  {
    id: "bank-1",
    bankName: "Banco Nación",
    logoText: "BNA",
    badge: "Tasa Más Baja Clientes",
    creditLine: "Crédito Hipotecario UVA",
    rateUva: 4.5,
    cft: 5.6,
    maxFinancing: 75,
    maxTermYears: 30,
    minIncomeApproxUSD: 1400,
    notes: "Tasa del 4.5% + UVA para clientes con acreditación de haberes en el banco. Para no clientes aplica 8% + UVA.",
    updatedAt: "2026-03-15"
  },
  {
    id: "bank-2",
    bankName: "Banco Galicia",
    logoText: "Galicia",
    badge: "Aprobación 100% Digital",
    creditLine: "Hipotecario Inmobiliario UVA",
    rateUva: 5.5,
    cft: 6.9,
    maxFinancing: 80,
    maxTermYears: 30,
    minIncomeApproxUSD: 1700,
    notes: "Permite sumar ingresos de cónyuge o conviviente. Posibilidad de cancelación anticipada total sin penalidad.",
    updatedAt: "2026-03-20"
  },
  {
    id: "bank-3",
    bankName: "Santander",
    logoText: "Santander",
    badge: "Financiación hasta 80%",
    creditLine: "Super Hipoteca UVA",
    rateUva: 5.8,
    cft: 7.2,
    maxFinancing: 80,
    maxTermYears: 30,
    minIncomeApproxUSD: 1800,
    notes: "Línea aplicable a primera y segunda vivienda permanente o destino inversión residencial.",
    updatedAt: "2026-03-18"
  },
  {
    id: "bank-4",
    bankName: "Banco Ciudad",
    logoText: "Ciudad",
    badge: "Beneficio Zona Sur & Centro",
    creditLine: "Hipotecario Tu Casa UVA",
    rateUva: 3.5,
    cft: 4.8,
    maxFinancing: 75,
    maxTermYears: 25,
    minIncomeApproxUSD: 1300,
    notes: "Tasa preferencial del 3.5% para propiedades radicadas en polígonos del Microcentro y Distrito Tecnológico.",
    updatedAt: "2026-03-22"
  },
  {
    id: "bank-5",
    bankName: "BBVA",
    logoText: "BBVA",
    badge: "Trámite Ágil",
    creditLine: "Hipotecario UVA Adquisición",
    rateUva: 6.2,
    cft: 7.8,
    maxFinancing: 75,
    maxTermYears: 20,
    minIncomeApproxUSD: 1900,
    notes: "Requiere paquete de cuentas Premium. Flexibilidad en peritaje y tasación rápida de obra terminada.",
    updatedAt: "2026-03-12"
  },
  {
    id: "bank-6",
    bankName: "Banco Hipotecario",
    logoText: "Hipotecario",
    badge: "Pionero en Créditos",
    creditLine: "Línea Construcción & Compra UVA",
    rateUva: 6.9,
    cft: 8.4,
    maxFinancing: 80,
    maxTermYears: 30,
    minIncomeApproxUSD: 1600,
    notes: "Ideal para adquisición de terreno y posterior construcción en loteos o barrios cerrados.",
    updatedAt: "2026-03-10"
  }
];
