"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useData } from "@/context/DataContext";
import { Property, BankRate, FeaturedBanner, AgentProfile, PropertyType, OperationType, PropertyStatus } from "@/lib/types";
import { 
  SlidersHorizontal, 
  Building2, 
  Percent, 
  Sparkles, 
  UserCheck, 
  Database, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  Lock, 
  Unlock, 
  RotateCcw, 
  Download, 
  Upload, 
  Check, 
  X,
  ExternalLink
} from "lucide-react";

export default function AdminPage() {
  const {
    properties,
    bankRates,
    banners,
    agentProfile,
    addProperty,
    updateProperty,
    deleteProperty,
    addBankRate,
    updateBankRate,
    deleteBankRate,
    addBanner,
    updateBanner,
    deleteBanner,
    updateAgentProfile,
    resetToDefaults,
    exportDataJSON,
    importDataJSON,
  } = useData();

  // Autenticación simple de sesión
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);

  // Tabs
  const [activeTab, setActiveTab] = useState<"propiedades" | "banners" | "tasas" | "perfil" | "backup">("propiedades");

  // Estado para formulario de edición/creación de propiedad
  const [editingPropId, setEditingPropId] = useState<string | null>(null);
  const [propForm, setPropForm] = useState<Partial<Property>>({});
  const [isCreatingProp, setIsCreatingProp] = useState(false);

  // Estado para formulario de banner
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);
  const [bannerForm, setBannerForm] = useState<Partial<FeaturedBanner>>({});
  const [isCreatingBanner, setIsCreatingBanner] = useState(false);

  // Estado para formulario de tasa bancaria
  const [editingBankId, setEditingBankId] = useState<string | null>(null);
  const [bankForm, setBankForm] = useState<Partial<BankRate>>({});
  const [isCreatingBank, setIsCreatingBank] = useState(false);

  // Estado para perfil del agente
  const [profileForm, setProfileForm] = useState<AgentProfile>(agentProfile);
  const [profileSaved, setProfileSaved] = useState(false);

  // Estado para export/import
  const [importJsonText, setImportJsonText] = useState("");
  const [importSuccess, setImportSuccess] = useState<boolean | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Clave predeterminada: aurea2026 o admin123
    if (pinInput === "aurea2026" || pinInput === "admin") {
      setIsAuthenticated(true);
      setPinError(false);
      setProfileForm(agentProfile);
    } else {
      setPinError(true);
    }
  };

  // ------------------ GESTIÓN DE PROPIEDADES ------------------
  const startEditProperty = (prop: Property) => {
    setEditingPropId(prop.id);
    setPropForm({ ...prop });
    setIsCreatingProp(false);
  };

  const startCreateProperty = () => {
    setIsCreatingProp(true);
    setEditingPropId(null);
    setPropForm({
      title: "",
      slug: "",
      type: "departamento",
      operation: "venta",
      status: "disponible",
      price: 150000,
      currency: "USD",
      location: {
        city: "CABA",
        neighborhood: "Palermo",
        address: "Av. del Libertador al 2000",
        zone: "Capital Federal",
      },
      features: {
        bedrooms: 2,
        bathrooms: 2,
        parkingSpaces: 1,
        totalArea: 75,
        coveredArea: 68,
        yearBuilt: 2024,
        expenses: 120,
      },
      amenities: ["Seguridad 24hs", "Piscina", "Cochera"],
      description: "Excelente propiedad con acabados de primera categoría.",
      highlightSummary: "Ubicación privilegiada y vistas despejadas.",
      images: [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      ],
      isFeatured: true,
      isOpportunity: false,
      opportunityBadge: "",
    });
  };

  const saveProperty = () => {
    if (!propForm.title || !propForm.price) {
      alert("Por favor completa al menos título y precio.");
      return;
    }

    if (isCreatingProp) {
      addProperty(propForm as Omit<Property, "id" | "createdAt">);
      setIsCreatingProp(false);
    } else if (editingPropId) {
      updateProperty(editingPropId, propForm);
      setEditingPropId(null);
    }
  };

  // ------------------ GESTIÓN DE BANNERS ------------------
  const startEditBanner = (banner: FeaturedBanner) => {
    setEditingBannerId(banner.id);
    setBannerForm({ ...banner });
    setIsCreatingBanner(false);
  };

  const startCreateBanner = () => {
    setIsCreatingBanner(true);
    setEditingBannerId(null);
    setBannerForm({
      title: "Nuevo Emprendimiento",
      subtitle: "Preventa Exclusiva",
      badge: "Lanzamiento",
      description: "Detalle comercial de la oportunidad o desarrollo en preventa.",
      imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80",
      ctaText: "Ver Detalles",
      ctaLink: "/propiedades",
      active: true,
    });
  };

  const saveBanner = () => {
    if (!bannerForm.title) return;
    if (isCreatingBanner) {
      addBanner(bannerForm as Omit<FeaturedBanner, "id">);
      setIsCreatingBanner(false);
    } else if (editingBannerId) {
      updateBanner(editingBannerId, bannerForm);
      setEditingBannerId(null);
    }
  };

  // ------------------ GESTIÓN DE TASAS BANCARIAS ------------------
  const startEditBank = (bank: BankRate) => {
    setEditingBankId(bank.id);
    setBankForm({ ...bank });
    setIsCreatingBank(false);
  };

  const startCreateBank = () => {
    setIsCreatingBank(true);
    setEditingBankId(null);
    setBankForm({
      bankName: "Nuevo Banco",
      logoText: "Banco",
      badge: "Línea UVA",
      creditLine: "Crédito Hipotecario UVA",
      rateUva: 5.5,
      cft: 7.0,
      maxFinancing: 75,
      maxTermYears: 30,
      minIncomeApproxUSD: 1500,
      notes: "Condiciones crediticias de la entidad.",
    });
  };

  const saveBank = () => {
    if (!bankForm.bankName) return;
    if (isCreatingBank) {
      addBankRate(bankForm as Omit<BankRate, "id" | "updatedAt">);
      setIsCreatingBank(false);
    } else if (editingBankId) {
      updateBankRate(editingBankId, bankForm);
      setEditingBankId(null);
    }
  };

  // ------------------ GUARDAR PERFIL DEL AGENTE ------------------
  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateAgentProfile(profileForm);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  // ------------------ PANTALLA DE ACCESO / LOGIN ------------------
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <div className="bg-white p-8 rounded-sm border border-neutral-200 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-sm bg-neutral-900 text-gold-400 flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-neutral-900">
              Panel de Administración
            </h1>
            <p className="text-xs text-neutral-500">
              Gestión modular de contenidos de ÁUREA Real Estate
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                Clave de Acceso
              </label>
              <input
                type="password"
                placeholder="Ingrese contraseña de gestión..."
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full p-3 bg-stone-50 border border-neutral-300 rounded-sm focus:border-gold-500 focus:outline-none text-sm"
                autoFocus
              />
              <span className="block text-[10px] text-neutral-400 mt-1">
                (Clave de demostración: <code className="text-neutral-700 font-mono">aurea2026</code> o <code className="text-neutral-700 font-mono">admin</code>)
              </span>
            </div>

            {pinError && (
              <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-sm border border-rose-200">
                Clave incorrecta. Por favor intente de nuevo.
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-gold-500 hover:bg-gold-600 text-luxury-black font-semibold uppercase tracking-wider py-3 rounded-sm transition-colors shadow-sm"
            >
              Ingresar al Gestor
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ------------------ PANEL PRINCIPAL DE ADMINISTRACIÓN ------------------
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Cabecera del Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gold-600 bg-gold-50 px-2.5 py-1 rounded-sm mb-1">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>CMS Modular Áurea</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900">
            Centro de Gestión de Contenidos
          </h1>
          <p className="text-xs text-neutral-500">
            Actualice propiedades, banners comerciales y tasas bancarias en tiempo real.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAuthenticated(false)}
            className="text-xs text-neutral-600 hover:text-neutral-900 px-3 py-2 border border-neutral-300 rounded-sm hover:bg-neutral-100 transition-colors flex items-center gap-1.5"
          >
            <Unlock className="w-3.5 h-3.5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* Tabs de Navegación del CMS */}
      <div className="flex flex-wrap gap-2 border-b border-neutral-200 pb-2 text-xs">
        <button
          onClick={() => setActiveTab("propiedades")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-sm font-semibold transition-colors ${
            activeTab === "propiedades"
              ? "bg-neutral-900 text-white"
              : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Propiedades ({properties.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("banners")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-sm font-semibold transition-colors ${
            activeTab === "banners"
              ? "bg-neutral-900 text-white"
              : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Banners Destacados ({banners.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("tasas")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-sm font-semibold transition-colors ${
            activeTab === "tasas"
              ? "bg-neutral-900 text-white"
              : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
          }`}
        >
          <Percent className="w-4 h-4" />
          <span>Tasas Bancarias ({bankRates.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("perfil")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-sm font-semibold transition-colors ${
            activeTab === "perfil"
              ? "bg-neutral-900 text-white"
              : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Perfil & Marca Personal</span>
        </button>

        <button
          onClick={() => setActiveTab("backup")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-sm font-semibold transition-colors ${
            activeTab === "backup"
              ? "bg-neutral-900 text-white"
              : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Copia de Seguridad / Exportar</span>
        </button>
      </div>

      {/* CONTENIDO DEL TAB 1: PROPIEDADES */}
      {activeTab === "propiedades" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="font-serif text-lg font-bold text-neutral-900">
              Catálogo de Propiedades Publicadas
            </h2>
            <button
              onClick={startCreateProperty}
              className="bg-gold-500 hover:bg-gold-600 text-luxury-black text-xs font-semibold uppercase tracking-wider px-4 py-2.5 rounded-sm transition-colors flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Nueva Propiedad</span>
            </button>
          </div>

          {/* Formulario de edición o creación si está activo */}
          {(isCreatingProp || editingPropId) && (
            <div className="bg-white p-6 rounded-sm border-2 border-gold-400 shadow-md space-y-4 text-xs animate-fade-in">
              <div className="flex justify-between items-center border-b border-neutral-200 pb-3">
                <h3 className="font-serif text-base font-bold text-neutral-900">
                  {isCreatingProp ? "Cargar Nueva Propiedad" : `Editando: ${propForm.title}`}
                </h3>
                <button
                  onClick={() => {
                    setIsCreatingProp(false);
                    setEditingPropId(null);
                  }}
                  className="text-neutral-400 hover:text-neutral-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-neutral-700 mb-1">Título de la Propiedad *</label>
                  <input
                    type="text"
                    value={propForm.title || ""}
                    onChange={(e) => setPropForm({ ...propForm, title: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-neutral-300 rounded-sm focus:border-gold-500 focus:outline-none"
                    placeholder="Ej: Penthouse Dúplex con Vista al Río"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Precio (USD) *</label>
                  <input
                    type="number"
                    value={propForm.price || 0}
                    onChange={(e) => setPropForm({ ...propForm, price: Number(e.target.value) })}
                    className="w-full p-2.5 bg-stone-50 border border-neutral-300 rounded-sm focus:border-gold-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Operación</label>
                  <select
                    value={propForm.operation || "venta"}
                    onChange={(e) => setPropForm({ ...propForm, operation: e.target.value as OperationType })}
                    className="w-full p-2.5 bg-stone-50 border border-neutral-300 rounded-sm focus:border-gold-500 focus:outline-none"
                  >
                    <option value="venta">Venta</option>
                    <option value="alquiler">Alquiler</option>
                    <option value="pozo">En Pozo / Preventa</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Tipo de Inmueble</label>
                  <select
                    value={propForm.type || "departamento"}
                    onChange={(e) => setPropForm({ ...propForm, type: e.target.value as PropertyType })}
                    className="w-full p-2.5 bg-stone-50 border border-neutral-300 rounded-sm focus:border-gold-500 focus:outline-none"
                  >
                    <option value="departamento">Departamento</option>
                    <option value="casa">Casa</option>
                    <option value="loteo">Loteo / Terreno</option>
                    <option value="desarrollo">Desarrollo</option>
                    <option value="comercial">Comercial</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Estado</label>
                  <select
                    value={propForm.status || "disponible"}
                    onChange={(e) => setPropForm({ ...propForm, status: e.target.value as PropertyStatus })}
                    className="w-full p-2.5 bg-stone-50 border border-neutral-300 rounded-sm focus:border-gold-500 focus:outline-none"
                  >
                    <option value="disponible">Disponible</option>
                    <option value="oportunidad">Oportunidad</option>
                    <option value="reservado">Reservado</option>
                    <option value="vendido">Vendido</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Expensas Aprox. (USD)</label>
                  <input
                    type="number"
                    value={propForm.features?.expenses || 0}
                    onChange={(e) =>
                      setPropForm({
                        ...propForm,
                        features: {
                          ...propForm.features!,
                          expenses: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full p-2.5 bg-stone-50 border border-neutral-300 rounded-sm focus:border-gold-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Ubicación y Métricas */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Barrio</label>
                  <input
                    type="text"
                    value={propForm.location?.neighborhood || ""}
                    onChange={(e) =>
                      setPropForm({
                        ...propForm,
                        location: { ...propForm.location!, neighborhood: e.target.value },
                      })
                    }
                    className="w-full p-2.5 bg-stone-50 border border-neutral-300 rounded-sm focus:border-gold-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Ciudad / Partido</label>
                  <input
                    type="text"
                    value={propForm.location?.city || ""}
                    onChange={(e) =>
                      setPropForm({
                        ...propForm,
                        location: { ...propForm.location!, city: e.target.value },
                      })
                    }
                    className="w-full p-2.5 bg-stone-50 border border-neutral-300 rounded-sm focus:border-gold-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Dormitorios</label>
                  <input
                    type="number"
                    value={propForm.features?.bedrooms || 0}
                    onChange={(e) =>
                      setPropForm({
                        ...propForm,
                        features: { ...propForm.features!, bedrooms: Number(e.target.value) },
                      })
                    }
                    className="w-full p-2.5 bg-stone-50 border border-neutral-300 rounded-sm focus:border-gold-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Sup. Total (m²)</label>
                  <input
                    type="number"
                    value={propForm.features?.totalArea || 0}
                    onChange={(e) =>
                      setPropForm({
                        ...propForm,
                        features: { ...propForm.features!, totalArea: Number(e.target.value) },
                      })
                    }
                    className="w-full p-2.5 bg-stone-50 border border-neutral-300 rounded-sm focus:border-gold-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Imagen URL principal */}
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  URL de Imagen Principal (URL de Unsplash o servidor)
                </label>
                <input
                  type="text"
                  value={propForm.images?.[0] || ""}
                  onChange={(e) =>
                    setPropForm({
                      ...propForm,
                      images: [e.target.value, ...(propForm.images?.slice(1) || [])],
                    })
                  }
                  className="w-full p-2.5 bg-stone-50 border border-neutral-300 rounded-sm focus:border-gold-500 focus:outline-none"
                />
              </div>

              {/* Toggles de Destacado y Oportunidad */}
              <div className="flex flex-wrap gap-6 py-2 border-y border-neutral-200">
                <label className="flex items-center gap-2 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={propForm.isFeatured || false}
                    onChange={(e) => setPropForm({ ...propForm, isFeatured: e.target.checked })}
                    className="accent-gold-500 w-4 h-4"
                  />
                  <span>Mostrar como Propiedad Destacada en Home</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={propForm.isOpportunity || false}
                    onChange={(e) => setPropForm({ ...propForm, isOpportunity: e.target.checked })}
                    className="accent-gold-500 w-4 h-4"
                  />
                  <span>Marcar como Oportunidad Especial</span>
                </label>
              </div>

              {propForm.isOpportunity && (
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Texto del Badge de Oportunidad (ej: "Preventa Pozo -15%", "Retasado")
                  </label>
                  <input
                    type="text"
                    value={propForm.opportunityBadge || ""}
                    onChange={(e) => setPropForm({ ...propForm, opportunityBadge: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-neutral-300 rounded-sm focus:border-gold-500 focus:outline-none"
                  />
                </div>
              )}

              {/* Descripción */}
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Descripción Detallada</label>
                <textarea
                  rows={3}
                  value={propForm.description || ""}
                  onChange={(e) => setPropForm({ ...propForm, description: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-neutral-300 rounded-sm focus:border-gold-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingProp(false);
                    setEditingPropId(null);
                  }}
                  className="px-4 py-2 border border-neutral-300 rounded-sm hover:bg-neutral-100"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={saveProperty}
                  className="bg-neutral-900 text-white font-semibold px-6 py-2 rounded-sm hover:bg-neutral-800 flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Propiedad</span>
                </button>
              </div>
            </div>
          )}

          {/* Tabla de Propiedades */}
          <div className="bg-white border border-neutral-200 rounded-sm shadow-sm overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-neutral-200 uppercase text-neutral-500 font-semibold tracking-wider">
                <tr>
                  <th className="py-3 px-4">Inmueble</th>
                  <th className="py-3 px-4">Operación</th>
                  <th className="py-3 px-4">Precio (USD)</th>
                  <th className="py-3 px-4">Ubicación</th>
                  <th className="py-3 px-4 text-center">Destacado</th>
                  <th className="py-3 px-4 text-center">Oportunidad</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {properties.map((prop) => (
                  <tr key={prop.id} className="hover:bg-stone-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-10 rounded-sm overflow-hidden bg-neutral-200 shrink-0">
                          <Image
                            src={prop.images[0] || ""}
                            alt={prop.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-semibold text-neutral-900">{prop.title}</div>
                          <span className="text-[10px] text-neutral-400 font-mono">ID: {prop.id}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 uppercase text-[11px] font-medium text-neutral-600">
                      {prop.operation}
                    </td>

                    <td className="py-3 px-4 font-serif font-bold text-neutral-900 text-sm">
                      ${prop.price.toLocaleString("es-AR")}
                    </td>

                    <td className="py-3 px-4 text-neutral-600">
                      {prop.location.neighborhood}, {prop.location.city}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => updateProperty(prop.id, { isFeatured: !prop.isFeatured })}
                        className={`w-6 h-6 rounded-full inline-flex items-center justify-center text-xs transition-colors ${
                          prop.isFeatured ? "bg-amber-100 text-amber-800 font-bold" : "bg-neutral-100 text-neutral-400"
                        }`}
                        title="Alternar destacado"
                      >
                        {prop.isFeatured ? "★" : "☆"}
                      </button>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => updateProperty(prop.id, { isOpportunity: !prop.isOpportunity })}
                        className={`px-2 py-0.5 rounded-sm text-[10px] font-semibold transition-colors ${
                          prop.isOpportunity
                            ? "bg-gold-500 text-luxury-black"
                            : "bg-neutral-100 text-neutral-400"
                        }`}
                      >
                        {prop.isOpportunity ? "SI" : "NO"}
                      </button>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => startEditProperty(prop)}
                          className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-sm"
                          title="Editar"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`¿Eliminar la propiedad "${prop.title}"?`)) {
                              deleteProperty(prop.id);
                            }
                          }}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-sm"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CONTENIDO DEL TAB 2: BANNERS DESTACADOS */}
      {activeTab === "banners" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-serif text-lg font-bold text-neutral-900">
                Sección Destacada Dinámica (Home Hero / Oportunidades)
              </h2>
              <p className="text-xs text-neutral-500">
                Permite cambiar los anuncios de lanzamientos, loteos o pozo en la portada principal.
              </p>
            </div>
            <button
              onClick={startCreateBanner}
              className="bg-gold-500 hover:bg-gold-600 text-luxury-black text-xs font-semibold uppercase tracking-wider px-4 py-2.5 rounded-sm transition-colors flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Banner</span>
            </button>
          </div>

          {/* Formulario Banner */}
          {(isCreatingBanner || editingBannerId) && (
            <div className="bg-white p-6 rounded-sm border-2 border-gold-400 shadow-md space-y-4 text-xs">
              <div className="flex justify-between items-center border-b border-neutral-200 pb-3">
                <h3 className="font-serif text-base font-bold text-neutral-900">
                  {isCreatingBanner ? "Crear Nuevo Banner" : "Editando Banner"}
                </h3>
                <button
                  onClick={() => {
                    setIsCreatingBanner(false);
                    setEditingBannerId(null);
                  }}
                  className="text-neutral-400 hover:text-neutral-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Título Principal *</label>
                  <input
                    type="text"
                    value={bannerForm.title || ""}
                    onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-neutral-300 rounded-sm focus:border-gold-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Subtítulo / Zona</label>
                  <input
                    type="text"
                    value={bannerForm.subtitle || ""}
                    onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-neutral-300 rounded-sm focus:border-gold-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Badge (ej: Oportunidad de Inversión)</label>
                  <input
                    type="text"
                    value={bannerForm.badge || ""}
                    onChange={(e) => setBannerForm({ ...bannerForm, badge: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-neutral-300 rounded-sm focus:border-gold-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Texto Botón CTA</label>
                  <input
                    type="text"
                    value={bannerForm.ctaText || ""}
                    onChange={(e) => setBannerForm({ ...bannerForm, ctaText: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-neutral-300 rounded-sm focus:border-gold-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Enlace Botón CTA</label>
                  <input
                    type="text"
                    value={bannerForm.ctaLink || ""}
                    onChange={(e) => setBannerForm({ ...bannerForm, ctaLink: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-neutral-300 rounded-sm focus:border-gold-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">URL Imagen de Fondo</label>
                <input
                  type="text"
                  value={bannerForm.imageUrl || ""}
                  onChange={(e) => setBannerForm({ ...bannerForm, imageUrl: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-neutral-300 rounded-sm focus:border-gold-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Descripción Comercial</label>
                <textarea
                  rows={2}
                  value={bannerForm.description || ""}
                  onChange={(e) => setBannerForm({ ...bannerForm, description: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-neutral-300 rounded-sm focus:border-gold-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="bannerActive"
                  checked={bannerForm.active || false}
                  onChange={(e) => setBannerForm({ ...bannerForm, active: e.target.checked })}
                  className="accent-gold-500 w-4 h-4"
                />
                <label htmlFor="bannerActive" className="font-medium text-neutral-800">
                  Banner Activo (Visible en Home)
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingBanner(false);
                    setEditingBannerId(null);
                  }}
                  className="px-4 py-2 border border-neutral-300 rounded-sm hover:bg-neutral-100"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={saveBanner}
                  className="bg-neutral-900 text-white font-semibold px-6 py-2 rounded-sm hover:bg-neutral-800 flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Banner</span>
                </button>
              </div>
            </div>
          )}

          {/* Listado de Banners */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {banners.map((b) => (
              <div
                key={b.id}
                className="bg-white p-5 rounded-sm border border-neutral-200 shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-semibold text-gold-600 bg-gold-50 px-2 py-0.5 rounded-sm">
                      {b.badge}
                    </span>
                    <button
                      onClick={() => updateBanner(b.id, { active: !b.active })}
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-sm ${
                        b.active ? "bg-emerald-100 text-emerald-800" : "bg-neutral-100 text-neutral-400"
                      }`}
                    >
                      {b.active ? "Activo en Home" : "Inactivo"}
                    </button>
                  </div>

                  <h3 className="font-serif text-base font-bold text-neutral-900">
                    {b.title}
                  </h3>
                  <p className="text-xs text-neutral-500 font-medium">
                    {b.subtitle}
                  </p>
                  <p className="text-xs text-neutral-600 line-clamp-2">
                    {b.description}
                  </p>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-neutral-100 mt-4">
                  <span className="text-[11px] text-neutral-400">
                    CTA: {b.ctaText} → {b.ctaLink}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startEditBanner(b)}
                      className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-sm"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`¿Eliminar el banner "${b.title}"?`)) {
                          deleteBanner(b.id);
                        }
                      }}
                      className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CONTENIDO DEL TAB 3: TASAS BANCARIAS */}
      {activeTab === "tasas" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-serif text-lg font-bold text-neutral-900">
                Condiciones de Bancos & Tasas Hipotecarias UVA
              </h2>
              <p className="text-xs text-neutral-500">
                Modifique las tasas nominales y costos financieros de las entidades bancarias al instante.
              </p>
            </div>
            <button
              onClick={startCreateBank}
              className="bg-gold-500 hover:bg-gold-600 text-luxury-black text-xs font-semibold uppercase tracking-wider px-4 py-2.5 rounded-sm transition-colors flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Banco</span>
            </button>
          </div>

          {/* Formulario Banco */}
          {(isCreatingBank || editingBankId) && (
            <div className="bg-white p-6 rounded-sm border-2 border-gold-400 shadow-md space-y-4 text-xs">
              <div className="flex justify-between items-center border-b border-neutral-200 pb-3">
                <h3 className="font-serif text-base font-bold text-neutral-900">
                  {isCreatingBank ? "Agregar Entidad Bancaria" : `Editando: ${bankForm.bankName}`}
                </h3>
                <button
                  onClick={() => {
                    setIsCreatingBank(false);
                    setEditingBankId(null);
                  }}
                  className="text-neutral-400 hover:text-neutral-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Nombre del Banco *</label>
                  <input
                    type="text"
                    value={bankForm.bankName || ""}
                    onChange={(e) => setBankForm({ ...bankForm, bankName: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-neutral-300 rounded-sm focus:border-gold-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Línea Crediticia</label>
                  <input
                    type="text"
                    value={bankForm.creditLine || ""}
                    onChange={(e) => setBankForm({ ...bankForm, creditLine: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-neutral-300 rounded-sm focus:border-gold-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Etiqueta Destacada (Badge)</label>
                  <input
                    type="text"
                    value={bankForm.badge || ""}
                    onChange={(e) => setBankForm({ ...bankForm, badge: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-neutral-300 rounded-sm focus:border-gold-500 focus:outline-none"
                    placeholder="Ej: Tasa Más Baja"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">TNA UVA (%) *</label>
                  <input
                    type="number"
                    step="0.1"
                    value={bankForm.rateUva || 0}
                    onChange={(e) => setBankForm({ ...bankForm, rateUva: Number(e.target.value) })}
                    className="w-full p-2.5 bg-stone-50 border border-neutral-300 rounded-sm focus:border-gold-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">CFT Estimado (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={bankForm.cft || 0}
                    onChange={(e) => setBankForm({ ...bankForm, cft: Number(e.target.value) })}
                    className="w-full p-2.5 bg-stone-50 border border-neutral-300 rounded-sm focus:border-gold-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Financiación Máx (%)</label>
                  <input
                    type="number"
                    value={bankForm.maxFinancing || 75}
                    onChange={(e) => setBankForm({ ...bankForm, maxFinancing: Number(e.target.value) })}
                    className="w-full p-2.5 bg-stone-50 border border-neutral-300 rounded-sm focus:border-gold-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Plazo Máx (Años)</label>
                  <input
                    type="number"
                    value={bankForm.maxTermYears || 30}
                    onChange={(e) => setBankForm({ ...bankForm, maxTermYears: Number(e.target.value) })}
                    className="w-full p-2.5 bg-stone-50 border border-neutral-300 rounded-sm focus:border-gold-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Observaciones & Requisitos</label>
                <textarea
                  rows={2}
                  value={bankForm.notes || ""}
                  onChange={(e) => setBankForm({ ...bankForm, notes: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-neutral-300 rounded-sm focus:border-gold-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingBank(false);
                    setEditingBankId(null);
                  }}
                  className="px-4 py-2 border border-neutral-300 rounded-sm hover:bg-neutral-100"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={saveBank}
                  className="bg-neutral-900 text-white font-semibold px-6 py-2 rounded-sm hover:bg-neutral-800 flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Banco</span>
                </button>
              </div>
            </div>
          )}

          {/* Tabla de Tasas */}
          <div className="bg-white border border-neutral-200 rounded-sm shadow-sm overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-neutral-200 uppercase text-neutral-500 font-semibold tracking-wider">
                <tr>
                  <th className="py-3 px-4">Banco</th>
                  <th className="py-3 px-4 text-center">Tasa UVA</th>
                  <th className="py-3 px-4 text-center">CFT</th>
                  <th className="py-3 px-4 text-center">Financiación Máx</th>
                  <th className="py-3 px-4 text-center">Plazo</th>
                  <th className="py-3 px-4">Detalle</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {bankRates.map((bank) => (
                  <tr key={bank.id} className="hover:bg-stone-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-neutral-900">{bank.bankName}</div>
                      <div className="text-[10px] text-neutral-400">{bank.creditLine}</div>
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-gold-600">
                      {bank.rateUva}%
                    </td>
                    <td className="py-3 px-4 text-center font-medium">
                      ~{bank.cft}%
                    </td>
                    <td className="py-3 px-4 text-center font-semibold">
                      {bank.maxFinancing}%
                    </td>
                    <td className="py-3 px-4 text-center">
                      {bank.maxTermYears} años
                    </td>
                    <td className="py-3 px-4 text-neutral-600 max-w-xs truncate">
                      {bank.notes}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => startEditBank(bank)}
                          className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-sm"
                          title="Editar"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`¿Eliminar entidad ${bank.bankName}?`)) {
                              deleteBankRate(bank.id);
                            }
                          }}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-sm"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CONTENIDO DEL TAB 4: PERFIL DEL AGENTE & MARCA PERSONAL */}
      {activeTab === "perfil" && (
        <form onSubmit={saveProfile} className="bg-white p-6 sm:p-8 rounded-sm border border-neutral-200 shadow-sm space-y-6 text-xs">
          <div className="flex justify-between items-center border-b border-neutral-200 pb-4">
            <div>
              <h2 className="font-serif text-lg font-bold text-neutral-900">
                Información de Marca Personal del Agente
              </h2>
              <p className="text-xs text-neutral-500">
                Modifique su nombre, matrícula, teléfono de WhatsApp directo y biografía.
              </p>
            </div>
            <button
              type="submit"
              className="bg-gold-500 hover:bg-gold-600 text-luxury-black font-semibold uppercase tracking-wider px-6 py-2.5 rounded-sm transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Cambios</span>
            </button>
          </div>

          {profileSaved && (
            <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-sm flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Perfil actualizado correctamente en todo el sitio web.</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Nombre Completo *</label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full p-2.5 bg-stone-50 border border-neutral-300 rounded-sm focus:border-gold-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Cargo / Especialidad *</label>
              <input
                type="text"
                value={profileForm.roleTitle}
                onChange={(e) => setProfileForm({ ...profileForm, roleTitle: e.target.value })}
                className="w-full p-2.5 bg-stone-50 border border-neutral-300 rounded-sm focus:border-gold-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Matrícula Profesional *</label>
              <input
                type="text"
                value={profileForm.licenseNumber}
                onChange={(e) => setProfileForm({ ...profileForm, licenseNumber: e.target.value })}
                className="w-full p-2.5 bg-stone-50 border border-neutral-300 rounded-sm focus:border-gold-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Número de WhatsApp (con código de país) *</label>
              <input
                type="text"
                placeholder="5491148907722 (sin espacios ni signos)"
                value={profileForm.whatsappNumber}
                onChange={(e) => setProfileForm({ ...profileForm, whatsappNumber: e.target.value })}
                className="w-full p-2.5 bg-stone-50 border border-neutral-300 rounded-sm focus:border-gold-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Teléfono Visible en Web</label>
              <input
                type="text"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                className="w-full p-2.5 bg-stone-50 border border-neutral-300 rounded-sm focus:border-gold-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Correo Electrónico</label>
              <input
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                className="w-full p-2.5 bg-stone-50 border border-neutral-300 rounded-sm focus:border-gold-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Dirección de Despacho u Oficina</label>
            <input
              type="text"
              value={profileForm.officeAddress}
              onChange={(e) => setProfileForm({ ...profileForm, officeAddress: e.target.value })}
              className="w-full p-2.5 bg-stone-50 border border-neutral-300 rounded-sm focus:border-gold-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">URL Fotografía Profesional</label>
            <input
              type="text"
              value={profileForm.photoUrl}
              onChange={(e) => setProfileForm({ ...profileForm, photoUrl: e.target.value })}
              className="w-full p-2.5 bg-stone-50 border border-neutral-300 rounded-sm focus:border-gold-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Biografía Completa ("Sobre Mí")</label>
            <textarea
              rows={4}
              value={profileForm.bio}
              onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
              className="w-full p-2.5 bg-stone-50 border border-neutral-300 rounded-sm focus:border-gold-500 focus:outline-none"
            />
          </div>

          {/* Métricas del Agente */}
          <div className="border-t border-neutral-200 pt-4">
            <span className="block font-semibold text-neutral-800 uppercase tracking-wider text-[11px] mb-3">
              Métricas Auditadas & Track Record
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-neutral-600 mb-1">Años de Trayectoria</label>
                <input
                  type="number"
                  value={profileForm.metrics.yearsExperience}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      metrics: { ...profileForm.metrics, yearsExperience: Number(e.target.value) },
                    })
                  }
                  className="w-full p-2 bg-stone-50 border border-neutral-300 rounded-sm"
                />
              </div>

              <div>
                <label className="block text-neutral-600 mb-1">Volumen Vendido (USD)</label>
                <input
                  type="text"
                  value={profileForm.metrics.volumeSoldUSD}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      metrics: { ...profileForm.metrics, volumeSoldUSD: e.target.value },
                    })
                  }
                  className="w-full p-2 bg-stone-50 border border-neutral-300 rounded-sm"
                />
              </div>

              <div>
                <label className="block text-neutral-600 mb-1">Operaciones Concluidas</label>
                <input
                  type="number"
                  value={profileForm.metrics.propertiesClosed}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      metrics: { ...profileForm.metrics, propertiesClosed: Number(e.target.value) },
                    })
                  }
                  className="w-full p-2 bg-stone-50 border border-neutral-300 rounded-sm"
                />
              </div>

              <div>
                <label className="block text-neutral-600 mb-1">Satisfacción (%)</label>
                <input
                  type="number"
                  value={profileForm.metrics.clientSatisfactionRate}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      metrics: { ...profileForm.metrics, clientSatisfactionRate: Number(e.target.value) },
                    })
                  }
                  className="w-full p-2 bg-stone-50 border border-neutral-300 rounded-sm"
                />
              </div>
            </div>
          </div>
        </form>
      )}

      {/* CONTENIDO DEL TAB 5: COPIA DE SEGURIDAD / EXPORTACIÓN */}
      {activeTab === "backup" && (
        <div className="bg-white p-6 sm:p-8 rounded-sm border border-neutral-200 shadow-sm space-y-6 text-xs">
          <div>
            <h2 className="font-serif text-lg font-bold text-neutral-900">
              Copias de Seguridad & Portabilidad de Datos
            </h2>
            <p className="text-xs text-neutral-500">
              Exporte todos los datos del sitio a un archivo JSON o restaure los valores iniciales de demostración.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Exportar */}
            <div className="p-5 bg-stone-50 border border-neutral-200 rounded-sm space-y-3">
              <h3 className="font-semibold text-neutral-800 flex items-center gap-2">
                <Download className="w-4 h-4 text-gold-600" />
                <span>Exportar Base de Datos Completa (JSON)</span>
              </h3>
              <p className="text-neutral-600">
                Descargue un archivo con todas las propiedades, banners, tasas y perfil configurados para respaldo o migración.
              </p>
              <button
                type="button"
                onClick={() => {
                  const dataStr = exportDataJSON();
                  const blob = new Blob([dataStr], { type: "application/json" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `aurea-real-estate-backup-${new Date().toISOString().split("T")[0]}.json`;
                  a.click();
                }}
                className="bg-neutral-900 hover:bg-neutral-800 text-white font-semibold px-4 py-2.5 rounded-sm transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descargar Backup JSON</span>
              </button>
            </div>

            {/* Restablecer */}
            <div className="p-5 bg-stone-50 border border-neutral-200 rounded-sm space-y-3">
              <h3 className="font-semibold text-rose-800 flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-rose-600" />
                <span>Restablecer Datos de Demostración</span>
              </h3>
              <p className="text-neutral-600">
                Si desea volver a cargar los datos originales de lujo y demostración, haga clic a continuación.
              </p>
              <button
                type="button"
                onClick={() => {
                  if (confirm("¿Está seguro de restablecer todos los datos a los valores iniciales de fábrica? Se perderán las modificaciones locales.")) {
                    resetToDefaults();
                    alert("Datos restablecidos con éxito.");
                  }
                }}
                className="border border-rose-300 text-rose-700 hover:bg-rose-50 font-semibold px-4 py-2.5 rounded-sm transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restablecer a Valores por Defecto</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
