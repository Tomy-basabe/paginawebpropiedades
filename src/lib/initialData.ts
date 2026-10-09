import { Property, BankRate, FeaturedBanner, AgentProfile } from './types';

export const INITIAL_AGENT_PROFILE: AgentProfile = {
  name: "Juan Pablo Pino",
  roleTitle: "Martillero, Corredor Público e Inmobiliario",
  licenseNumber: "Mat. Profesional N° 7824 - 99 Propiedades Santa Cruz",
  bio: "Con 10 años de trayectoria y posicionamiento como referente líder en ventas en la provincia de Santa Cruz, Juan Pablo Pino (34 años) lidera 99 Propiedades brindando asesoramiento integral, tasaciones profesionales y comercialización de inmuebles en Río Gallegos, El Calafate y toda la Patagonia. Especialista en venta de casas, terrenos, loteos y administración de alquileres.",
  shortBio: "99 Propiedades: 10 años de liderazgo en ventas inmobiliarias en Santa Cruz con Juan Pablo Pino. Martillero y Corredor Inmobiliario en Río Gallegos y Patagonia.",
  photoUrl: "/images/juan-pablo-pino.jpg",
  phone: "+54 9 11 4890-7722",
  whatsappNumber: "5491148907722",
  whatsappDisplay: "+54 9 11 4890-7722",
  email: "juanpablo@99propiedades.com",
  officeAddress: "Río Gallegos, Provincia de Santa Cruz, Patagonia Argentina",
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
      title: "Tasación Siempre Sin Cargo en Santa Cruz",
      description: "Valuación profesional, técnica y comparativa de mercado de tu propiedad en Santa Cruz, 100% gratuita y sin compromiso."
    },
    {
      title: "Gestión de Créditos Hipotecarios UVA",
      description: "Asesoramiento integral en bancos de Santa Cruz para la compra de tu casa o terreno con condiciones preferenciales."
    },
    {
      title: "Alquileres & Administración en Santa Cruz",
      description: "Gestión y administración integral de propiedades en alquiler en Río Gallegos y alrededores con garantía y cobranza puntual."
    },
    {
      title: "Video Tours Inmersivos de Alta Calidad",
      description: "Priorizamos el video sobre la foto: recorridos inmersivos para apreciar cada detalle antes de visitar la propiedad."
    }
  ]
};

export const INITIAL_FEATURED_BANNERS: FeaturedBanner[] = [
  {
    id: "banner-1",
    title: "Residencias Mirador del Glaciar",
    subtitle: "Desarrollo Exclusivo en Preventa - El Calafate, Santa Cruz",
    badge: "Oportunidad de Inversión",
    description: "Unidades residenciales y turísticas con vistas panorámicas al Lago Argentino. Anticipo en USD y financiación a medida en Santa Cruz.",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80",
    ctaText: "Ver Masterplan y Precios",
    ctaLink: "/propiedades?type=desarrollo",
    active: true,
    propertyIdRef: "prop-4"
  },
  {
    id: "banner-2",
    title: "Loteos y Chacras Patagónicas",
    subtitle: "Terrenos de 1.000 a 5.000 m² - Río Gallegos, Santa Cruz",
    badge: "Lanzamiento Exclusivo",
    description: "Lotes residenciales con servicios proyectados, entorno natural y excelente proyección de revalorización en Santa Cruz.",
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
      "city": "Río Gallegos",
      "neighborhood": "Barrio Jardín",
      "address": "Av. San Martín al 1400",
      "zone": "Santa Cruz"
    },
    "features": {
      "bedrooms": 4,
      "bathrooms": 3,
      "parkingSpaces": 2,
      "totalArea": 480,
      "coveredArea": 260,
      "yearBuilt": 2019,
      "expenses": 0
    },
    "amenities": [
      "Calefacción Central por Radiadores",
      "Quincho Techado con Parrilla",
      "Jardín Parquizado con Cerco Perimetral",
      "Portón Automático",
      "Aberturas Doble Vidrio Hermético"
    ],
    "highlightSummary": "Lote amplio de casi 500m² con quincho equipado en zona residencial destacada de Río Gallegos, Santa Cruz.",
    "description": "Sólida casa de construcción tradicional con aislación térmica de alta eficiencia para el clima patagónico. Amplio living comedor con hogar a leña, cocina comedor diario totalmente equipada con amoblamiento a medida. En exterior cuenta con quincho cerrado con cerramiento y jardín parquizado. Lista para habitar en Río Gallegos, Santa Cruz.",
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
    "title": "Residencia con Vista Panorámica al Lago en El Calafate",
    "slug": "residencia-vista-panoramica-lago-calafate",
    "type": "casa",
    "operation": "venta",
    "status": "oportunidad",
    "price": 490000,
    "currency": "USD",
    "videoUrl": "https://mjxywapawhtcrdenslma.supabase.co/storage/v1/object/public/property-videos/tours/tour-propiedad-02.mp4",
    "hasVideoTour": true,
    "location": {
      "city": "El Calafate",
      "neighborhood": "Costanera Lago Argentino",
      "address": "Calle Los Álamos 450",
      "zone": "Santa Cruz"
    },
    "features": {
      "bedrooms": 4,
      "bathrooms": 4,
      "parkingSpaces": 3,
      "totalArea": 720,
      "coveredArea": 330,
      "yearBuilt": 2022,
      "expenses": 0
    },
    "amenities": [
      "Vista al Lago Argentino",
      "Calefacción por Losa Radiante",
      "Master Suite con Vestidor",
      "Aberturas DVH Triple Contacto",
      "Parrilla Interior con Tiraje Forzado"
    ],
    "highlightSummary": "Excelente oportunidad con vistas directas al Lago Argentino en El Calafate, Santa Cruz.",
    "description": "Vivienda desarrollada en dos plantas con líneas modernas y grandes paños vidriados con aislación térmica de primer nivel. En planta baja, hall de recepción, estar de gran volumetría y cocina integrada con isla. Quincho integrado ideal para todo el año en la Patagonia. Suite con baño compartimentado y terraza propia.",
    "images": [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80"
    ],
    "isFeatured": true,
    "isOpportunity": true,
    "opportunityBadge": "Precio Retasado - Oportunidad Santa Cruz",
    "createdAt": "2026-03-27"
  },
  {
    "id": "prop-tour-03",
    "title": "Casa a Estrenar con Fondo Libre y Cochera en Río Gallegos",
    "slug": "casa-estrenar-fondo-libre-rio-gallegos",
    "type": "casa",
    "operation": "venta",
    "status": "disponible",
    "price": 280000,
    "currency": "USD",
    "videoUrl": "https://mjxywapawhtcrdenslma.supabase.co/storage/v1/object/public/property-videos/tours/tour-propiedad-03.mp4",
    "hasVideoTour": true,
    "location": {
      "city": "Río Gallegos",
      "neighborhood": "Barrio San Benito",
      "address": "Av. Asturias al 800",
      "zone": "Santa Cruz"
    },
    "features": {
      "bedrooms": 3,
      "bathrooms": 2,
      "parkingSpaces": 2,
      "totalArea": 600,
      "coveredArea": 180,
      "yearBuilt": 2024,
      "expenses": 0
    },
    "amenities": [
      "A Estrenar",
      "Caldera Dual con Radiadores",
      "Cochera Cubierta Doble",
      "Aislación Térmica Reforzada",
      "Patio Cerrado"
    ],
    "highlightSummary": "A estrenar en zona de rápido crecimiento residencial en Río Gallegos, Santa Cruz.",
    "description": "Construcción moderna y sólida de categoría pensada para la eficiencia energética. Gran living comedor muy luminoso, cocina independiente con comedor diario, baño completo y lavadero. En planta alta 3 dormitorios con placares empotrados. Apto crédito hipotecario bancario UVA.",
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
    "title": "Departamento Luminoso en Alquiler en Centro de Río Gallegos",
    "slug": "departamento-alquiler-centro-rio-gallegos",
    "type": "departamento",
    "operation": "alquiler",
    "status": "disponible",
    "price": 550,
    "currency": "USD",
    "videoUrl": "https://mjxywapawhtcrdenslma.supabase.co/storage/v1/object/public/property-videos/tours/tour-propiedad-04.mp4",
    "hasVideoTour": true,
    "location": {
      "city": "Río Gallegos",
      "neighborhood": "Centro",
      "address": "Av. Presidente Kirchner al 700",
      "zone": "Santa Cruz"
    },
    "features": {
      "bedrooms": 2,
      "bathrooms": 1,
      "parkingSpaces": 1,
      "totalArea": 75,
      "coveredArea": 70,
      "yearBuilt": 2021,
      "expenses": 35
    },
    "amenities": [
      "Cochera Fija Cubierta",
      "Ascensor de Última Generación",
      "Calefacción Individual por Radiadores",
      "Cámaras de Seguridad 24hs",
      "Balcón con Vista Abierta"
    ],
    "highlightSummary": "Ubicación céntrica inmejorable en Río Gallegos, Santa Cruz, a pasos de comercios y bancos.",
    "description": "Excelente departamento de 3 ambientes al frente con orientación este. Living comedor con balcón, cocina reciclada a nueva con mesadas de granito, dos dormitorios cómodos con placares de piso a techo y baño completo.",
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
    "title": "Dúplex de Categoría con Terraza y Quincho en Caleta Olivia",
    "slug": "duplex-categoria-quincho-caleta-olivia",
    "type": "departamento",
    "operation": "venta",
    "status": "oportunidad",
    "price": 185000,
    "currency": "USD",
    "videoUrl": "https://mjxywapawhtcrdenslma.supabase.co/storage/v1/object/public/property-videos/tours/tour-propiedad-05.mp4",
    "hasVideoTour": true,
    "location": {
      "city": "Caleta Olivia",
      "neighborhood": "Costanera",
      "address": "Av. San Martín al 400",
      "zone": "Santa Cruz"
    },
    "features": {
      "bedrooms": 2,
      "bathrooms": 2,
      "parkingSpaces": 1,
      "totalArea": 130,
      "coveredArea": 95,
      "yearBuilt": 2023,
      "expenses": 40
    },
    "amenities": [
      "Vista al Mar",
      "Quincho y Parrilla Propia",
      "Cochera Cubierta",
      "Calefacción Central",
      "Pisos de Porcelanato"
    ],
    "highlightSummary": "Oportunidad con vista al mar y terraza privada en Caleta Olivia, Santa Cruz.",
    "description": "Dúplex moderno con diseño de vanguardia. En primera planta, living comedor espacioso con cocina concepto abierto y barra. En segunda planta, 2 dormitorios, baño completo compartimentado y terraza privada con sector de parrilla.",
    "images": [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80"
    ],
    "isFeatured": true,
    "isOpportunity": true,
    "opportunityBadge": "Dúplex con Vista al Mar",
    "createdAt": "2026-03-24"
  },
  {
    "id": "prop-tour-06",
    "title": "Chacra y Residencia en Lote de 2.500 m² en Río Gallegos",
    "slug": "chacra-residencia-lote-rio-gallegos",
    "type": "loteo",
    "operation": "venta",
    "status": "disponible",
    "price": 230000,
    "currency": "USD",
    "videoUrl": "https://mjxywapawhtcrdenslma.supabase.co/storage/v1/object/public/property-videos/tours/tour-propiedad-06.mp4",
    "hasVideoTour": true,
    "location": {
      "city": "Río Gallegos",
      "neighborhood": "Zona de Chacras",
      "address": "Ruta Provincial 53 Km 4",
      "zone": "Santa Cruz"
    },
    "features": {
      "bedrooms": 3,
      "bathrooms": 2,
      "parkingSpaces": 4,
      "totalArea": 2500,
      "coveredArea": 190,
      "yearBuilt": 2021,
      "expenses": 0
    },
    "amenities": [
      "Lote Amplio de 2.500 m²",
      "Servicios de Luz y Gas",
      "Quincho Familiar con Horno a Leña",
      "Cerco Perimetral Olímpico",
      "Excelente Acceso Asfaltado"
    ],
    "highlightSummary": "Terreno amplio con vivienda lista para habitar en zona de chacras de Río Gallegos, Santa Cruz.",
    "description": "Excelente propiedad campestre ideal para vivienda permanente o casa de fin de semana. Amplio lote de 2.500 metros cuadrados con arboleda cortina de álamos, vivienda principal confortable, quincho cerrado para 30 personas y galpón auxiliar.",
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
    "title": "Terrenos y Lotes Residenciales en Preventa en Río Gallegos",
    "slug": "terrenos-lotes-preventa-rio-gallegos",
    "type": "loteo",
    "operation": "venta",
    "status": "disponible",
    "price": 28000,
    "currency": "USD",
    "videoUrl": "https://mjxywapawhtcrdenslma.supabase.co/storage/v1/object/public/property-videos/tours/tour-propiedad-07.mp4",
    "hasVideoTour": true,
    "location": {
      "city": "Río Gallegos",
      "neighborhood": "Nuevo Loteo Patagónico",
      "address": "Acceso Circunvalación",
      "zone": "Santa Cruz"
    },
    "features": {
      "bedrooms": 0,
      "bathrooms": 0,
      "parkingSpaces": 0,
      "totalArea": 500,
      "coveredArea": 0,
      "yearBuilt": 2025,
      "expenses": 0
    },
    "amenities": [
      "Lotes de 500 m²",
      "Servicios de Red Proyectados",
      "Anticipo y Cuotas en Pesos o USD",
      "Escrituración Inmediata al Finalizar",
      "Entorno Tranquilo y de Crecimiento"
    ],
    "highlightSummary": "Lotes de 500m² con financiación directa en Río Gallegos, Santa Cruz.",
    "description": "Excelente oportunidad para constructores, familias o inversores. Lotes planos de 15 x 33 metros con trazado de calles consolidado. Financiación propia en cuotas con mínimos requisitos en la provincia de Santa Cruz.",
    "images": [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
    ],
    "isFeatured": true,
    "isOpportunity": true,
    "opportunityBadge": "Lotes en Cuotas Santa Cruz",
    "createdAt": "2026-03-22"
  },
  {
    "id": "prop-tour-08",
    "title": "Departamento Apto Profesional de 3 Ambientes en Río Gallegos",
    "slug": "departamento-apto-profesional-rio-gallegos",
    "type": "departamento",
    "operation": "alquiler",
    "status": "disponible",
    "price": 600,
    "currency": "USD",
    "videoUrl": "https://mjxywapawhtcrdenslma.supabase.co/storage/v1/object/public/property-videos/tours/tour-propiedad-08.mp4",
    "hasVideoTour": true,
    "location": {
      "city": "Río Gallegos",
      "neighborhood": "Centro",
      "address": "Zapiola & Fagnano",
      "zone": "Santa Cruz"
    },
    "features": {
      "bedrooms": 2,
      "bathrooms": 1,
      "parkingSpaces": 0,
      "totalArea": 72,
      "coveredArea": 65,
      "yearBuilt": 2019,
      "expenses": 40
    },
    "amenities": [
      "Apto Profesional",
      "Lobby de Entrada con Llave Magnética",
      "Calefacción Central Regulable",
      "Balcón al Frente",
      "Vidrios Dobles DVH"
    ],
    "highlightSummary": "Ubicación neurálgica en el centro de Río Gallegos, Santa Cruz, ideal para estudio u oficinas.",
    "description": "Impecable unidad en edificio céntrico. Living comedor luminoso con ventanal y salida al balcón al frente. Cocina semi-integrada con barra desayunadora, muebles bajo mesada y conexión para lavarropas. Dos dormitorios cómodos con placard y baño completo en Río Gallegos, Santa Cruz.",
    "images": [
      "https://images.unsplash.com/photo-1502005229762-ee1b2da97a0f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80"
    ],
    "isFeatured": false,
    "isOpportunity": true,
    "opportunityBadge": "Alquiler Céntrico Santa Cruz",
    "createdAt": "2026-03-21"
  },
  {
    "id": "prop-tour-09",
    "title": "Casa Familiar en Una Planta con Quincho Cerrado en Río Gallegos",
    "slug": "casa-familiar-una-planta-quincho-rio-gallegos",
    "type": "casa",
    "operation": "venta",
    "status": "disponible",
    "price": 240000,
    "currency": "USD",
    "videoUrl": "https://mjxywapawhtcrdenslma.supabase.co/storage/v1/object/public/property-videos/tours/tour-propiedad-09.mp4",
    "hasVideoTour": true,
    "location": {
      "city": "Río Gallegos",
      "neighborhood": "Barrio Belgrano",
      "address": "Av. Parque Industrial al 500",
      "zone": "Santa Cruz"
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
      "Calefacción por Radiadores",
      "Quincho Cerrado Climatizado",
      "Cochera Pasante Cubierta",
      "Alarma y Cámaras Monitoreadas"
    ],
    "highlightSummary": "Toda en planta baja, con quincho cerrado completo en barrio consolidado de Río Gallegos, Santa Cruz.",
    "description": "Práctica y muy luminosa casa de una planta sobre lote propio de 420 m². Gran salón principal con cielorrasos de madera tratada, cocina comedor con muebles a medida y lavadero separado. Tres dormitorios de buenas dimensiones con placares embutidos. Gran quincho de 40 m² cerrado con baño propio y parrilla.",
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
    "title": "Complejo Turístico & Residencial en Pozo - El Calafate",
    "slug": "complejo-turistico-residencial-pozo-calafate",
    "type": "desarrollo",
    "operation": "pozo",
    "status": "oportunidad",
    "price": 145000,
    "currency": "USD",
    "videoUrl": "https://mjxywapawhtcrdenslma.supabase.co/storage/v1/object/public/property-videos/tours/tour-propiedad-10.mp4",
    "hasVideoTour": true,
    "location": {
      "city": "El Calafate",
      "neighborhood": "Villa Parque Los Glaciares",
      "address": "Av. del Libertador al 2400",
      "zone": "Santa Cruz"
    },
    "features": {
      "bedrooms": 1,
      "bathrooms": 2,
      "parkingSpaces": 1,
      "totalArea": 88,
      "coveredArea": 70,
      "yearBuilt": 2025,
      "expenses": 50
    },
    "amenities": [
      "Apto Alquiler Turístico Temporario",
      "Vistas Panorámicas a la Cordillera",
      "Anticipo y Financiación en Cuotas",
      "Cochera Incluida",
      "Aislación Térmica de Máxima Calificación"
    ],
    "highlightSummary": "Alta rentabilidad en USD por turismo receptivo en El Calafate, Santa Cruz.",
    "description": "Unidades de 1 y 2 ambientes diseñadas especialmente para renta temporal turística o vivienda en El Calafate. Vistas panorámicas a la cordillera y los glaciares. Terminaciones de primer nivel en madera de lenga y piedra patagónica.",
    "images": [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80"
    ],
    "isFeatured": true,
    "isOpportunity": true,
    "opportunityBadge": "Inversión Turística Santa Cruz",
    "createdAt": "2026-03-19"
  },
  {
    "id": "prop-tour-11",
    "title": "Chacra Productiva y Turística de 2 Hectáreas en Los Antiguos",
    "slug": "chacra-productiva-turistica-los-antiguos-santa-cruz",
    "type": "casa",
    "operation": "venta",
    "status": "disponible",
    "price": 310000,
    "currency": "USD",
    "videoUrl": "https://mjxywapawhtcrdenslma.supabase.co/storage/v1/object/public/property-videos/tours/tour-propiedad-11.mp4",
    "hasVideoTour": true,
    "location": {
      "city": "Los Antiguos",
      "neighborhood": "Valle Productivo",
      "address": "Ruta 43 Km 8",
      "zone": "Santa Cruz"
    },
    "features": {
      "bedrooms": 4,
      "bathrooms": 3,
      "parkingSpaces": 4,
      "totalArea": 20000,
      "coveredArea": 280,
      "yearBuilt": 2018,
      "expenses": 0
    },
    "amenities": [
      "2 Hectáreas con Derechos de Riego",
      "Plantación de Cerezos y Frutales",
      "Casa Principal + Cabaña de Huéspedes",
      "Quincho Patagónico",
      "Vistas al Lago Buenos Aires"
    ],
    "highlightSummary": "Chacra de 2 hectáreas con microclima privilegiado y vista al lago en Santa Cruz.",
    "description": "Propiedad única en el valle de Los Antiguos, Santa Cruz. Cuenta con casa patronal de 4 ambientes, cabaña para renta turística, quincho equipado y 2 hectáreas de cerezos en producción con sistema de riego presurizado.",
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
    "title": "Edificio Residencial & Oficinas en Centro de Río Gallegos",
    "slug": "edificio-residencial-oficinas-rio-gallegos",
    "type": "desarrollo",
    "operation": "pozo",
    "status": "disponible",
    "price": 210000,
    "currency": "USD",
    "videoUrl": "https://mjxywapawhtcrdenslma.supabase.co/storage/v1/object/public/property-videos/tours/tour-propiedad-12.mp4",
    "hasVideoTour": true,
    "location": {
      "city": "Río Gallegos",
      "neighborhood": "Centro Cívico",
      "address": "Av. Roca al 1100",
      "zone": "Santa Cruz"
    },
    "features": {
      "bedrooms": 2,
      "bathrooms": 2,
      "parkingSpaces": 1,
      "totalArea": 95,
      "coveredArea": 85,
      "yearBuilt": 2025,
      "expenses": 60
    },
    "amenities": [
      "Edificio con Ascensor Inteligente",
      "Cochera Fija Cubierta",
      "Calefacción por Losa Radiante",
      "Seguridad Digital",
      "Terminaciones de Categoría"
    ],
    "highlightSummary": "Desarrollo en pozo en el centro cívico de Río Gallegos, Santa Cruz. Ideal inversión o vivienda.",
    "description": "Unidades de 2 y 3 ambientes de excelente diseño y luz natural. Amplio estar comedor, balcón terraza, carpintería de aluminio DVH y cocina con equipamiento de primera calidad en Río Gallegos, Santa Cruz.",
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
    "title": "Chalet Costero con Vista a la Ría en Río Gallegos",
    "slug": "chalet-costero-vista-ria-rio-gallegos",
    "type": "casa",
    "operation": "venta",
    "status": "oportunidad",
    "price": 380000,
    "currency": "USD",
    "videoUrl": "https://mjxywapawhtcrdenslma.supabase.co/storage/v1/object/public/property-videos/tours/tour-propiedad-13.mp4",
    "hasVideoTour": true,
    "location": {
      "city": "Río Gallegos",
      "neighborhood": "Costanera Ría Gallegos",
      "address": "Av. Almirante Brown al 800",
      "zone": "Santa Cruz"
    },
    "features": {
      "bedrooms": 4,
      "bathrooms": 3,
      "parkingSpaces": 2,
      "totalArea": 650,
      "coveredArea": 310,
      "yearBuilt": 2022,
      "expenses": 0
    },
    "amenities": [
      "Vista Panorámica a la Ría",
      "Quincho Integral de 60 m²",
      "Calefacción Central Dual",
      "Garage Doble Automatizado",
      "Aislación Térmica Patagónica Premium"
    ],
    "highlightSummary": "Ubicación privilegiada frente a la Ría con vistas panorámicas únicas en Río Gallegos, Santa Cruz.",
    "description": "Extraordinaria residencia costera sobre la Costanera de Río Gallegos. Gran recepción con ventanales hacia la ría, cocina gourmet con isla y comedor diario. Quincho cerrado de 60m² totalmente equipado con parrilla y horno a leña.",
    "images": [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
    ],
    "isFeatured": true,
    "isOpportunity": true,
    "opportunityBadge": "Vista a la Ría Única",
    "createdAt": "2026-03-16"
  },
  {
    "id": "prop-tour-14",
    "title": "Chalet Tradicional de Construcción Sólida en Río Gallegos",
    "slug": "chalet-tradicional-solida-rio-gallegos",
    "type": "casa",
    "operation": "venta",
    "status": "disponible",
    "price": 215000,
    "currency": "USD",
    "videoUrl": "https://mjxywapawhtcrdenslma.supabase.co/storage/v1/object/public/property-videos/tours/tour-propiedad-14.mp4",
    "hasVideoTour": true,
    "location": {
      "city": "Río Gallegos",
      "neighborhood": "Barrio Docente",
      "address": "Calle España al 900",
      "zone": "Santa Cruz"
    },
    "features": {
      "bedrooms": 3,
      "bathrooms": 2,
      "parkingSpaces": 2,
      "totalArea": 450,
      "coveredArea": 180,
      "yearBuilt": 2018,
      "expenses": 0
    },
    "amenities": [
      "Sin Expensas",
      "Calefacción por Radiadores",
      "Patio Cerrado Seguro",
      "Cochera Cubierta para 2 Autos",
      "Apto Crédito Bancario UVA"
    ],
    "highlightSummary": "Excelente ubicación barrial residencial en Río Gallegos, Santa Cruz. Apto crédito hipotecario.",
    "description": "Chalet de sólida construcción tradicional con ladrillo a la vista y aberturas de aluminio con doble vidriado. Amplio living comedor, cocina comedor independiente, lavadero y 3 dormitorios luminosos. Patio seguro con entrada de autos.",
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

