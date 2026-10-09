import { Property, BankRate, FeaturedBanner, AgentProfile } from './types';

export const INITIAL_AGENT_PROFILE: AgentProfile = {
  name: "Juan Pablo Pino",
  roleTitle: "Martillero, Corredor Público e Inmobiliario",
  licenseNumber: "Mat. Profesional N° 7824 - 99 Propiedades",
  bio: "Con 10 años de trayectoria y posicionamiento como líder local en ventas, Juan Pablo Pino (34 años) lidera 99 Propiedades brindando una atención personalizada, comprometida y un acompañamiento integral. Especialista en la comercialización de viviendas, loteos y desarrollos, administración integral de alquileres y asesoramiento experto en gestión de créditos hipotecarios bancarios.",
  shortBio: "99 Propiedades: 10 años de trayectoria y liderazgo local en ventas con Juan Pablo Pino. Martillero, Corredor Público e Inmobiliario.",
  photoUrl: "/images/juan-pablo-pino.jpg",
  phone: "+54 9 11 4890-7722",
  whatsappNumber: "5491148907722",
  whatsappDisplay: "+54 9 11 4890-7722",
  email: "juanpablo@99propiedades.com",
  officeAddress: "99 Propiedades - Casa Central",
  social: {
    instagram: "https://instagram.com/juanpablopino.99propiedades",
    linkedin: "https://linkedin.com/in/juanpablopino-inmobiliaria",
    youtube: "https://youtube.com/@99propiedades",
  },
  metrics: {
    yearsExperience: 10,
    volumeSoldUSD: "+38M",
    propertiesClosed: 215,
    clientSatisfactionRate: 100,
  },
  pillars: [
    {
      title: "Tasación Siempre Sin Cargo",
      description: "Valuación profesional, técnica y comparativa de mercado de tu propiedad, 100% gratuita y sin compromiso de venta."
    },
    {
      title: "Gestión de Créditos Hipotecarios",
      description: "Servicio clave: Asesoramiento y acompañamiento completo durante todo el proceso crediticio, comparativa de tasas UVA y condiciones."
    },
    {
      title: "Alquileres & Administraciones",
      description: "Gestión y administración integral de propiedades en alquiler con exhaustiva calificación de garantías y cobranza segura."
    },
    {
      title: "Video Tours Prioritarios",
      description: "Priorizamos el video sobre la foto: recorridos inmersivos para experimentar las dimensiones y detalles reales de cada propiedad."
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
    title: "Chacras del Pinar",
    subtitle: "Loteos Campestres de 1.800 a 3.500 m²",
    badge: "Lanzamiento Exclusivo",
    description: "Entorno natural protegido a solo 45 minutos de Capital. Acceso asfaltado, red de fibra óptica subterránea y club house ecológico.",
    imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1920&q=80",
    ctaText: "Consultar Lotes Disponibles",
    ctaLink: "/propiedades?type=loteo",
    active: true,
    propertyIdRef: "prop-5"
  },
  {
    id: "banner-3",
    title: "Experiencia Video Tour Inmersivo",
    subtitle: "Recorridos Cinematográficos de Alta Definición",
    badge: "Innovación 99 Propiedades",
    description: "Priorizamos el video sobre la foto: recorré las propiedades en detalle antes de coordinar tu visita presencial.",
    imageUrl: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1920&q=80",
    ctaText: "Ver Propiedades con Video Tour",
    ctaLink: "/propiedades?hasVideo=true",
    active: true
  }
];

export const INITIAL_PROPERTIES: Property[] = [
  {
    "id": "prop-tour-01",
    "title": "Chalet Colonial Modernizado con Gran Parque y Piscina",
    "slug": "chalet-colonial-gran-parque-piscina",
    "type": "casa",
    "operation": "venta",
    "status": "disponible",
    "price": 345000,
    "currency": "USD",
    "videoUrl": "https://mjxywapawhtcrdenslma.supabase.co/storage/v1/object/public/property-videos/tours/tour-propiedad-01.mp4",
    "hasVideoTour": true,
    "location": {
      "city": "Tigre",
      "neighborhood": "Rincón de Milberg",
      "address": "Av. Santa María de las Conchas al 3400",
      "zone": "Zona Norte"
    },
    "features": {
      "bedrooms": 4,
      "bathrooms": 3,
      "parkingSpaces": 2,
      "totalArea": 480,
      "coveredArea": 260,
      "yearBuilt": 2019,
      "expenses": 80
    },
    "amenities": [
      "Piscina Climatizada",
      "Quincho Techado con Parrilla",
      "Jardín Parquizado",
      "Portón Automático",
      "Riego por Aspersión"
    ],
    "highlightSummary": "Lote amplio de casi 500m² con quincho equipado y excelente entorno residencial.",
    "description": "Sólida propiedad de estilo clásico con refacciones de diseño contemporáneo. Amplio living comedor con hogar a leña, cocina comedor diario totalmente equipada con amoblamiento a medida. En exterior cuenta con galería cubierta, parrilla con cerramiento de acero inoxidable y piscina con filtro automatizado. Lista para habitar.",
    "images": [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"
    ],
    "isFeatured": true,
    "isOpportunity": false,
    "opportunityBadge": "",
    "createdAt": "2026-03-28"
  },
  {
    "id": "prop-tour-02",
    "title": "Residencia Minimalista en Barrio Cerrado con Galería y Solarium",
    "slug": "residencia-minimalista-barrio-cerrado-galeria",
    "type": "casa",
    "operation": "venta",
    "status": "oportunidad",
    "price": 490000,
    "currency": "USD",
    "videoUrl": "https://mjxywapawhtcrdenslma.supabase.co/storage/v1/object/public/property-videos/tours/tour-propiedad-02.mp4",
    "hasVideoTour": true,
    "location": {
      "city": "Benavídez",
      "neighborhood": "Barrio Cerrado La Bota",
      "address": "Calle de las Rosas 450",
      "zone": "Zona Norte"
    },
    "features": {
      "bedrooms": 4,
      "bathrooms": 4,
      "parkingSpaces": 3,
      "totalArea": 720,
      "coveredArea": 330,
      "yearBuilt": 2022,
      "expenses": 190
    },
    "amenities": [
      "Seguridad 24hs",
      "Piscina Iluminada",
      "Master Suite con Vestidor",
      "Calefacción por Losa Radiante",
      "Aberturas DVH A30"
    ],
    "highlightSummary": "Excelente relación m² / precio en barrio consolidado con expensas bajas.",
    "description": "Vivienda desarrollada en dos plantas con líneas puras y grandes paños vidriados. En planta baja, hall de distribución, escritorio privado, estar de gran volumetría y cocina integrada con isla en silestone. Galería profunda de 12 metros con barra, parrilla completa y baño exterior. Suite con baño compartimentado y terraza propia.",
    "images": [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80"
    ],
    "isFeatured": true,
    "isOpportunity": true,
    "opportunityBadge": "Precio Retasado - Oportunidad",
    "createdAt": "2026-03-27"
  },
  {
    "id": "prop-tour-03",
    "title": "Casa Racionalista a Estrenar con Fondo Libre y Cochera Doble",
    "slug": "casa-racionalista-a-estrenar-fondo-libre",
    "type": "casa",
    "operation": "venta",
    "status": "disponible",
    "price": 420000,
    "currency": "USD",
    "videoUrl": "https://mjxywapawhtcrdenslma.supabase.co/storage/v1/object/public/property-videos/tours/tour-propiedad-03.mp4",
    "hasVideoTour": true,
    "location": {
      "city": "Escobar",
      "neighborhood": "Puertos del Lago - Barrio Marinas",
      "address": "Lote 118, Boulevard de los Lagos",
      "zone": "Zona Norte"
    },
    "features": {
      "bedrooms": 3,
      "bathrooms": 3,
      "parkingSpaces": 2,
      "totalArea": 600,
      "coveredArea": 250,
      "yearBuilt": 2024,
      "expenses": 140
    },
    "amenities": [
      "Lago Náutico",
      "Cancha de Tenis",
      "Club House",
      "Seguridad Integral",
      "Piscina Infinity"
    ],
    "highlightSummary": "A estrenar con entrega inmediata en el desarrollo más buscado de Puertos.",
    "description": "Proyecto arquitectónico de vanguardia con terminaciones premium. Hormigón a la vista combinado con maderas nobles y detalles en herrería negra. Gran living comedor con vistas al jardín, cocina independiente con comedor diario, toilette de recepción y lavadero. En planta alta 3 dormitorios, principal en suite con vestidor.",
    "images": [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80"
    ],
    "isFeatured": true,
    "isOpportunity": false,
    "opportunityBadge": "",
    "createdAt": "2026-03-26"
  },
  {
    "id": "prop-tour-04",
    "title": "Semipiso con Balcón Aterrazado y Vista Panorámica",
    "slug": "semipiso-balcon-aterrazado-vista-panoramica",
    "type": "departamento",
    "operation": "alquiler",
    "status": "disponible",
    "price": 1400,
    "currency": "USD",
    "videoUrl": "https://mjxywapawhtcrdenslma.supabase.co/storage/v1/object/public/property-videos/tours/tour-propiedad-04.mp4",
    "hasVideoTour": true,
    "location": {
      "city": "CABA",
      "neighborhood": "Belgrano R",
      "address": "Echeverría & Zapiola",
      "zone": "Capital Federal"
    },
    "features": {
      "bedrooms": 3,
      "bathrooms": 2,
      "parkingSpaces": 1,
      "totalArea": 130,
      "coveredArea": 112,
      "yearBuilt": 2021,
      "expenses": 160
    },
    "amenities": [
      "Cochera Fija Cubierta",
      "Baulera Individual",
      "SUM con Parrilla",
      "Seguridad Nocturna",
      "Balcón Aterrazado"
    ],
    "highlightSummary": "Ubicación residencial soñada con excelente conectividad y arboledas añejas.",
    "description": "Excelente departamento semipiso al frente con orientación este, inundado de luz natural. Living apaisado con salida a balcón terraza de 18 m² ideal para mesa y parrilla a gas. Tres dormitorios amplios con placares de piso a techo, cocina reciclada a nueva con mesadas de Silestone y comedor diario integrado.",
    "images": [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80"
    ],
    "isFeatured": false,
    "isOpportunity": false,
    "opportunityBadge": "",
    "createdAt": "2026-03-25"
  },
  {
    "id": "prop-tour-05",
    "title": "Dúplex de Categoría con Terraza Exclusiva y Parrilla Propia",
    "slug": "duplex-categoria-terraza-exclusiva-parrilla",
    "type": "departamento",
    "operation": "venta",
    "status": "oportunidad",
    "price": 310000,
    "currency": "USD",
    "videoUrl": "https://mjxywapawhtcrdenslma.supabase.co/storage/v1/object/public/property-videos/tours/tour-propiedad-05.mp4",
    "hasVideoTour": true,
    "location": {
      "city": "CABA",
      "neighborhood": "Núñez",
      "address": "Manuela Pedraza al 1900",
      "zone": "Capital Federal"
    },
    "features": {
      "bedrooms": 2,
      "bathrooms": 2,
      "parkingSpaces": 1,
      "totalArea": 140,
      "coveredArea": 95,
      "yearBuilt": 2023,
      "expenses": 110
    },
    "amenities": [
      "Terraza Propia",
      "Parrilla Individual",
      "Jacuzzi Exterior",
      "Cochera",
      "Pisos de Porcelanato"
    ],
    "highlightSummary": "Bajas expensas, terraza privada de 45 m² con solarium y jacuzzi.",
    "description": "Dúplex de diseño en edificio boutique de pocas unidades. Primer nivel con living comedor, cocina concepto abierto con barra desayunadora y toilette de recepción. Segundo nivel con 2 dormitorios, baño completo compartimentado y acceso a la terraza privada con pérgola, parrilla y espacio chill-out.",
    "images": [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80"
    ],
    "isFeatured": true,
    "isOpportunity": true,
    "opportunityBadge": "Dúplex Exclusivo con Terraza",
    "createdAt": "2026-03-24"
  },
  {
    "id": "prop-tour-06",
    "title": "Casa Estilo Villa Italiana en Lote Central con Parque Arbolado",
    "slug": "casa-villa-italiana-lote-central-parque",
    "type": "casa",
    "operation": "venta",
    "status": "disponible",
    "price": 520000,
    "currency": "USD",
    "videoUrl": "https://mjxywapawhtcrdenslma.supabase.co/storage/v1/object/public/property-videos/tours/tour-propiedad-06.mp4",
    "hasVideoTour": true,
    "location": {
      "city": "Pilar",
      "neighborhood": "Highland Park Country Club",
      "address": "Av. Las Palmeras 1240",
      "zone": "Zona Norte"
    },
    "features": {
      "bedrooms": 4,
      "bathrooms": 5,
      "parkingSpaces": 4,
      "totalArea": 1200,
      "coveredArea": 380,
      "yearBuilt": 2020,
      "expenses": 290
    },
    "amenities": [
      "Golf 18 Hoyos",
      "Canchas de Polo",
      "Piscina",
      "Seguridad Máxima",
      "Club House Histórico"
    ],
    "highlightSummary": "Lote central de 1.200 m² con arboleda centenaria en barrio tradicional de Pilar.",
    "description": "Magna propiedad con fachada en revoque tarquini y techos a cuatro aguas con tejas coloniales. Recepción señorial con doble circulación, pisos de incienso entablonado, cocina gourmet con comedor familiar independiente y suite principal con vestidor doble, hidromasaje y visuales abiertas al parque.",
    "images": [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"
    ],
    "isFeatured": true,
    "isOpportunity": false,
    "opportunityBadge": "",
    "createdAt": "2026-03-23"
  },
  {
    "id": "prop-tour-07",
    "title": "Moderna Residencia con Vista al Lago y Muelle en Nordelta",
    "slug": "residencia-vista-lago-muelle-nordelta",
    "type": "casa",
    "operation": "venta",
    "status": "disponible",
    "price": 980000,
    "currency": "USD",
    "videoUrl": "https://mjxywapawhtcrdenslma.supabase.co/storage/v1/object/public/property-videos/tours/tour-propiedad-07.mp4",
    "hasVideoTour": true,
    "location": {
      "city": "Tigre",
      "neighborhood": "Nordelta - El Yacht",
      "address": "Av. de los Lagos 2100",
      "zone": "Zona Norte"
    },
    "features": {
      "bedrooms": 5,
      "bathrooms": 6,
      "parkingSpaces": 3,
      "totalArea": 850,
      "coveredArea": 460,
      "yearBuilt": 2023,
      "expenses": 380
    },
    "amenities": [
      "Salida Náutica al Río Luján",
      "Muelle Privado",
      "Piscina Climatizada Infinity",
      "Cine Privado",
      "Gimnasio"
    ],
    "highlightSummary": "Muelle náutico con amarra propia y salida directa al Río Luján.",
    "description": "Una de las propiedades más distinguidas de Nordelta Yacht. Arquitectura contemporánea enfocada al disfrute del agua. Gran living con doble altura y cerramientos corredizos embutidos que eliminan los límites entre interior y exterior. Master suite con terraza privada al lago, spa y vestidor walk-in de grandes proporciones.",
    "images": [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
    ],
    "isFeatured": true,
    "isOpportunity": false,
    "opportunityBadge": "",
    "createdAt": "2026-03-22"
  },
  {
    "id": "prop-tour-08",
    "title": "Departamento Apto Profesional de 3 Ambientes con Balcón Corrido",
    "slug": "departamento-apto-profesional-3-ambientes",
    "type": "departamento",
    "operation": "alquiler",
    "status": "disponible",
    "price": 850,
    "currency": "USD",
    "videoUrl": "https://mjxywapawhtcrdenslma.supabase.co/storage/v1/object/public/property-videos/tours/tour-propiedad-08.mp4",
    "hasVideoTour": true,
    "location": {
      "city": "CABA",
      "neighborhood": "Palermo Soho",
      "address": "Malabia & Costa Rica",
      "zone": "Capital Federal"
    },
    "features": {
      "bedrooms": 2,
      "bathrooms": 1,
      "parkingSpaces": 0,
      "totalArea": 72,
      "coveredArea": 65,
      "yearBuilt": 2019,
      "expenses": 75
    },
    "amenities": [
      "Apto Profesional",
      "Lobby de Entrada con Tarjeta",
      "Laundry en Edificio",
      "Balcón Corrido",
      "Bicicletero"
    ],
    "highlightSummary": "Ubicación neurálgica en Palermo Soho, ideal para renta temporal o consultorio/estudio.",
    "description": "Impecable unidad en edificio moderno. Living comedor luminoso con ventanal de piso a techo y salida al balcón corrido al frente. Cocina semi-integrada con barra desayunadora, muebles bajo y sobre mesada de melanina touch y conexión para lavarropas. Dos dormitorios cómodos con placard y baño completo.",
    "images": [
      "https://images.unsplash.com/photo-1502005229762-ee1b2da97a0f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80"
    ],
    "isFeatured": false,
    "isOpportunity": true,
    "opportunityBadge": "Ideal Inversión / Airbnb",
    "createdAt": "2026-03-21"
  },
  {
    "id": "prop-tour-09",
    "title": "Chalet en Una Planta con Piscina Climatizada y Quincho Cerrado",
    "slug": "chalet-una-planta-piscina-climatizada-quincho",
    "type": "casa",
    "operation": "venta",
    "status": "disponible",
    "price": 298000,
    "currency": "USD",
    "videoUrl": "https://mjxywapawhtcrdenslma.supabase.co/storage/v1/object/public/property-videos/tours/tour-propiedad-09.mp4",
    "hasVideoTour": true,
    "location": {
      "city": "Tigre",
      "neighborhood": "General Pacheco",
      "address": "Av. Hipólito Yrigoyen al 1100",
      "zone": "Zona Norte"
    },
    "features": {
      "bedrooms": 3,
      "bathrooms": 2,
      "parkingSpaces": 2,
      "totalArea": 420,
      "coveredArea": 195,
      "yearBuilt": 2017,
      "expenses": 0
    },
    "amenities": [
      "Sin Expensas",
      "Piscina Climatizada con Caldera",
      "Quincho Cerrado Climatizado",
      "Cochera Pasante",
      "Alarma Monitoreada"
    ],
    "highlightSummary": "Toda desarrollada en planta baja, sin expensas y con excelente conectividad.",
    "description": "Práctica y muy luminosa casa de una planta sobre lote propio de 420 m². Gran salón principal con techos altos de madera tratada, cocina office con muebles Johnson y lavadero separado. Tres dormitorios de buenas dimensiones con placares embutidos. Gran quincho de 40 m² cerrado con baño propio y vistas al jardín.",
    "images": [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80"
    ],
    "isFeatured": false,
    "isOpportunity": false,
    "opportunityBadge": "",
    "createdAt": "2026-03-20"
  },
  {
    "id": "prop-tour-10",
    "title": "Loft Industrial & Suites Urbanas - Preventa en Pozo",
    "slug": "loft-industrial-techos-doble-altura",
    "type": "desarrollo",
    "operation": "pozo",
    "status": "oportunidad",
    "price": 165000,
    "currency": "USD",
    "videoUrl": "https://mjxywapawhtcrdenslma.supabase.co/storage/v1/object/public/property-videos/tours/tour-propiedad-10.mp4",
    "hasVideoTour": true,
    "location": {
      "city": "CABA",
      "neighborhood": "Colegiales",
      "address": "Concepción Arenal & Zapiola",
      "zone": "Capital Federal"
    },
    "features": {
      "bedrooms": 1,
      "bathrooms": 2,
      "parkingSpaces": 1,
      "totalArea": 88,
      "coveredArea": 70,
      "yearBuilt": 2022,
      "expenses": 95
    },
    "amenities": [
      "Piscina en Rooftop",
      "Seguridad 24hs",
      "Apto Profesional",
      "Cochera Opcional",
      "Balcón Terraza"
    ],
    "highlightSummary": "Estilo loft neoyorquino en la zona más gastronómica y cultural de Colegiales.",
    "description": "Concepto abierto y diseño vanguardista. Techos de 4 metros de altura con losa de hormigón visto e instalaciones a la vista pulidas. Gran cocina integrada con mesada en granito negro leather y barra en madera maciza. Entrepiso con dormitorio principal, vestidor y baño en suite. Balcón terraza con vista abierta.",
    "images": [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80"
    ],
    "isFeatured": true,
    "isOpportunity": true,
    "opportunityBadge": "Oportunidad Loft de Diseño",
    "createdAt": "2026-03-19"
  },
  {
    "id": "prop-tour-11",
    "title": "Gran Casa Quinta en Lote de 2.000 m² con Cancha de Pádel y Piscina",
    "slug": "gran-casa-quinta-lote-2000m-padel-piscina",
    "type": "casa",
    "operation": "venta",
    "status": "disponible",
    "price": 430000,
    "currency": "USD",
    "videoUrl": "https://mjxywapawhtcrdenslma.supabase.co/storage/v1/object/public/property-videos/tours/tour-propiedad-11.mp4",
    "hasVideoTour": true,
    "location": {
      "city": "Maschwitz",
      "neighborhood": "Ingeniero Maschwitz",
      "address": "Mendoza al 2200",
      "zone": "Zona Norte"
    },
    "features": {
      "bedrooms": 4,
      "bathrooms": 4,
      "parkingSpaces": 6,
      "totalArea": 2000,
      "coveredArea": 320,
      "yearBuilt": 2018,
      "expenses": 40
    },
    "amenities": [
      "Cancha de Pádel Propia",
      "Piscina de 12x5 metros",
      "Quincho para 40 Personas",
      "Casa de Huéspedes",
      "Arboleda Centenaria"
    ],
    "highlightSummary": "Parque soñado de 2.000m² con cancha de pádel privada y quincho de celebraciones.",
    "description": "Quinta excepcional pensada para el esparcimiento familiar o vivienda permanente en un entorno campestre privilegiado. Casa principal con 3 dormitorios en suite, estar con techos de doble altura y chimenea. Segunda edificación independiente para huéspedes o taller. Cancha de pádel con piso sintético y vestuarios.",
    "images": [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"
    ],
    "isFeatured": false,
    "isOpportunity": false,
    "opportunityBadge": "",
    "createdAt": "2026-03-18"
  },
  {
    "id": "prop-tour-12",
    "title": "Residencias Terrazas del Golf - Preventa en Pozo",
    "slug": "piso-exclusivo-torre-amenities-lujo",
    "type": "desarrollo",
    "operation": "pozo",
    "status": "disponible",
    "price": 580000,
    "currency": "USD",
    "videoUrl": "https://mjxywapawhtcrdenslma.supabase.co/storage/v1/object/public/property-videos/tours/tour-propiedad-12.mp4",
    "hasVideoTour": true,
    "location": {
      "city": "CABA",
      "neighborhood": "Palermo Nuevo",
      "address": "Av. Cerviño al 4700",
      "zone": "Capital Federal"
    },
    "features": {
      "bedrooms": 3,
      "bathrooms": 4,
      "parkingSpaces": 2,
      "totalArea": 215,
      "coveredArea": 190,
      "yearBuilt": 2021,
      "expenses": 320
    },
    "amenities": [
      "Piscina Climatizada In/Out",
      "Cancha de Tenis",
      "Gimnasio con Vista Panorámica",
      "Seguridad 24hs con Control Peatonal",
      "2 Cocheras Fijas"
    ],
    "highlightSummary": "Torre de máxima categoría con vistas abiertas hacia los bosques de Palermo.",
    "description": "Palier privado con dos ascensores de alta velocidad. Amplio living comedor con pisos de madera prefinish y balcón aterrazado con cerramiento de vidrio móvil. Suite principal con vestidor doble, hidromasaje y balcón íntimo. Dos dormitorios en semisuite. Cocina de alta gama con isla y comedor diario, dependencia y lavadero.",
    "images": [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80"
    ],
    "isFeatured": true,
    "isOpportunity": false,
    "opportunityBadge": "",
    "createdAt": "2026-03-17"
  },
  {
    "id": "prop-tour-13",
    "title": "Casa al Agua en Barrio Náutico con Amarra y Solarium Húmedo",
    "slug": "casa-al-agua-barrio-nautico-amarra",
    "type": "casa",
    "operation": "venta",
    "status": "oportunidad",
    "price": 760000,
    "currency": "USD",
    "videoUrl": "https://mjxywapawhtcrdenslma.supabase.co/storage/v1/object/public/property-videos/tours/tour-propiedad-13.mp4",
    "hasVideoTour": true,
    "location": {
      "city": "Tigre",
      "neighborhood": "Barrio Náutico Santa María",
      "address": "Costanera del Delta Lote 45",
      "zone": "Zona Norte"
    },
    "features": {
      "bedrooms": 4,
      "bathrooms": 5,
      "parkingSpaces": 3,
      "totalArea": 800,
      "coveredArea": 370,
      "yearBuilt": 2023,
      "expenses": 280
    },
    "amenities": [
      "Salida Náutica",
      "Amarra Propia",
      "Piscina con Playa Húmeda",
      "Cava de Vinos Subterránea",
      "Domótica Integral"
    ],
    "highlightSummary": "Orientación Noroeste con las mejores puestas de sol sobre el lago central.",
    "description": "Extraordinaria residencia náutica concebida para maximizar el contacto con la naturaleza. Gran recepción con ventanales corredizos motorizados, cocina de diseño con isla central y electrodomésticos empotrados. Galería exterior con parrilla a gas y leña, piscina climatizada con solarium húmedo y rampa de amarre privada.",
    "images": [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
    ],
    "isFeatured": true,
    "isOpportunity": true,
    "opportunityBadge": "Oportunidad Náutica Única",
    "createdAt": "2026-03-16"
  },
  {
    "id": "prop-tour-14",
    "title": "Chalet Tradicional de Categoría en Zona Residencial Tranquila",
    "slug": "chalet-tradicional-categoria-zona-residencial",
    "type": "casa",
    "operation": "venta",
    "status": "disponible",
    "price": 360000,
    "currency": "USD",
    "videoUrl": "https://mjxywapawhtcrdenslma.supabase.co/storage/v1/object/public/property-videos/tours/tour-propiedad-14.mp4",
    "hasVideoTour": true,
    "location": {
      "city": "San Isidro",
      "neighborhood": "Lomas de San Isidro",
      "address": "Monseñor Magliano al 800",
      "zone": "Zona Norte"
    },
    "features": {
      "bedrooms": 3,
      "bathrooms": 3,
      "parkingSpaces": 2,
      "totalArea": 550,
      "coveredArea": 240,
      "yearBuilt": 2016,
      "expenses": 0
    },
    "amenities": [
      "Sin Expensas",
      "Piscina con Cerco Perimetral",
      "Jardín con Riego Automatizado",
      "Cochera Cubierta para 2 Autos",
      "Portón Levadizo"
    ],
    "highlightSummary": "Excelente ubicación residencial cerca de los mejores colegios y accesos de San Isidro.",
    "description": "Chalet de sólida construcción tradicional con ladrillo a la vista, techos de teja francesa y aberturas en madera maciza. Amplio living en desnivel con hogar, comedor principal, cocina comedor muy cómoda con despensa y lavadero. En planta alta, 3 dormitorios luminosos, principal en suite con vestidor. Jardín parquizado con piscina.",
    "images": [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80"
    ],
    "isFeatured": false,
    "isOpportunity": false,
    "opportunityBadge": "",
    "createdAt": "2026-03-15"
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

