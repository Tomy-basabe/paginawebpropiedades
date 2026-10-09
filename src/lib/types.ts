export type PropertyType = 'casa' | 'departamento' | 'loteo' | 'comercial' | 'desarrollo';
export type OperationType = 'venta' | 'alquiler' | 'pozo';
export type PropertyStatus = 'disponible' | 'reservado' | 'vendido' | 'oportunidad';

export interface Property {
  id: string;
  title: string;
  slug: string;
  type: PropertyType;
  operation: OperationType;
  status: PropertyStatus;
  price: number;
  currency: 'USD' | 'ARS';
  location: {
    city: string;
    neighborhood: string;
    address: string;
    zone: string;
    googleMapsUrl?: string;
  };
  features: {
    bedrooms: number;
    bathrooms: number;
    parkingSpaces: number;
    totalArea: number; // m2
    coveredArea: number; // m2
    yearBuilt?: number;
    expenses?: number; // Expensas aproximadas
  };
  amenities: string[];
  description: string;
  highlightSummary: string;
  images: string[];
  videoUrl?: string; // Video Tour MP4 o URL
  hasVideoTour?: boolean;
  isFeatured: boolean;
  isOpportunity: boolean;
  opportunityBadge?: string; // ej: "Preventa Pozo -20%", "Último Lote al Lago"
  createdAt: string;
}

export interface BankRate {
  id: string;
  bankName: string;
  logoText: string;
  badge?: string; // ej: "Mejor Tasa Clientes", "Más Solicitado"
  creditLine: string; // ej: "Hipotecario UVA", "Tasa Fija en USD"
  rateUva: number; // % sobre UVA (TNA)
  cft: number; // Costo Financiero Total aproximado %
  maxFinancing: number; // % del valor de la tasación (ej: 75%)
  maxTermYears: number; // ej: 30
  minIncomeApproxUSD: number; // Ingreso familiar mínimo estimado
  notes: string;
  updatedAt: string;
}

export interface FeaturedBanner {
  id: string;
  title: string;
  subtitle: string;
  badge: string; // ej: "Lanzamiento Exclusivo"
  description: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
  active: boolean;
  propertyIdRef?: string;
}

export interface AgentProfile {
  name: string;
  roleTitle: string;
  licenseNumber: string; // Matrícula profesional
  bio: string;
  shortBio: string;
  photoUrl: string;
  phone: string;
  whatsappNumber: string; // Sin espacios ni + para url de wa.me
  whatsappDisplay: string;
  email: string;
  officeAddress: string;
  social: {
    instagram: string;
    linkedin: string;
    youtube?: string;
  };
  metrics: {
    yearsExperience: number;
    volumeSoldUSD: string;
    propertiesClosed: number;
    clientSatisfactionRate: number;
  };
  pillars: {
    title: string;
    description: string;
  }[];
}

export interface AppMonthlyPayment {
  id: string; // formato "YYYY-MM", ej. "2026-10"
  year: number;
  month: number; // 1-12
  monthName: string;
  isPaid: boolean;
  paidAt?: string;
  paidBy?: string;
  amount?: number;
  notes?: string;
}
