"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useData } from "@/context/DataContext";
import BrandLogo from "@/components/BrandLogo";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { uploadPropertyImage, uploadPropertyVideo, uploadPropertyModel3D } from "@/lib/supabase";
import { cleanWhatsAppNumber, getWhatsAppUrl } from "@/lib/whatsapp";
import { Property, PropertyRoom3D, BankRate, FeaturedBanner, AgentProfile, PropertyType, OperationType, PropertyStatus } from "@/lib/types";
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
  Upload, 
  Check, 
  X,
  ExternalLink,
  ImageIcon,
  Star,
  Video,
  Loader2,
  Box,
  Search
} from "lucide-react";
import { SPLAT_VIEWER_CONFIG } from "@/lib/gaussian-splat/config";

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
    isCloudConnected,
    refreshFromCloud,
  } = useData();

  // Autenticación de sesión con persistencia
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);

  // Mensaje de feedback/notificación global
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);

  const showFeedback = (text: string, type: "success" | "error" | "info" = "success") => {
    setFeedbackMessage({ text, type });
    setTimeout(() => {
      setFeedbackMessage((current) => (current?.text === text ? null : current));
    }, 4000);
  };

  // Tabs
  const [activeTab, setActiveTab] = useState<"propiedades" | "banners" | "tasas" | "perfil" | "backup">("propiedades");

  // Filtros y búsqueda en catálogo de propiedades
  const [filterOperation, setFilterOperation] = useState<"todas" | "venta" | "alquiler" | "pozo">("todas");
  const [searchQuery, setSearchQuery] = useState("");

  // Conteos y filtrado reactivo del catálogo
  const countVenta = properties.filter((p) => p.operation === "venta").length;
  const countAlquiler = properties.filter((p) => p.operation === "alquiler").length;
  const countPozo = properties.filter((p) => p.operation === "pozo").length;

  const filteredProperties = properties.filter((prop) => {
    const matchesOp = filterOperation === "todas" || prop.operation === filterOperation;
    if (!matchesOp) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const titleMatch = (prop.title || "").toLowerCase().includes(q);
    const cityMatch = (prop.location?.city || "").toLowerCase().includes(q);
    const neighMatch = (prop.location?.neighborhood || "").toLowerCase().includes(q);
    const idMatch = (prop.id || "").toLowerCase().includes(q);
    return titleMatch || cityMatch || neighMatch || idMatch;
  });

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

  // Estados para subida de múltiples imágenes de propiedades
  const [manualImageUrl, setManualImageUrl] = useState("");
  const [isUploadingImages, setIsUploadingImages] = useState(false);

  // Estados para subida y compresión de video tour
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoStatus, setVideoStatus] = useState("");

  // Estados para subida directa de modelo 3D Gaussian Splatting (.ply, .splat, .ksplat)
  const [isUploadingModel, setIsUploadingModel] = useState(false);
  const [modelUploadStatus, setModelUploadStatus] = useState("");
  const [uploadingRoomId, setUploadingRoomId] = useState<string | null>(null);

  const handleImageFilesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingImages(true);
    const fileList = Array.from(files);
    const uploadedUrls: string[] = [];

    for (const file of fileList) {
      try {
        const publicUrl = await uploadPropertyImage(file);
        uploadedUrls.push(publicUrl);
      } catch (err) {
        // Fallback a Data URL local si la red falla
        const dataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (event) => resolve((event.target?.result as string) || "");
          reader.readAsDataURL(file);
        });
        if (dataUrl) uploadedUrls.push(dataUrl);
      }
    }

    setPropForm((prev) => ({
      ...prev,
      images: [...(prev.images || []), ...uploadedUrls],
    }));
    setIsUploadingImages(false);
    e.target.value = "";
  };

  const handleAddManualUrl = () => {
    if (!manualImageUrl.trim()) return;
    setPropForm((prev) => ({
      ...prev,
      images: [...(prev.images || []), manualImageUrl.trim()],
    }));
    setManualImageUrl("");
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setPropForm((prev) => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== indexToRemove),
    }));
  };

  const handleMakeCoverImage = (indexToCover: number) => {
    setPropForm((prev) => {
      const images = [...(prev.images || [])];
      if (indexToCover < 0 || indexToCover >= images.length) return prev;
      const [selected] = images.splice(indexToCover, 1);
      return {
        ...prev,
        images: [selected, ...images],
      };
    });
  };

  // Handler para subir video tour con compresión automática
  const handleVideoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingVideo(true);
    setVideoProgress(0);
    setVideoStatus("Iniciando...");

    try {
      const url = await uploadPropertyVideo(
        file,
        (pct) => setVideoProgress(pct),
        (status) => setVideoStatus(status)
      );
      setPropForm((prev) => ({
        ...prev,
        videoUrl: url,
        hasVideoTour: true,
      }));
      setVideoStatus(`✅ Video listo · ${(file.size / 1024 / 1024).toFixed(1)} MB original`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      setVideoStatus(`❌ Error: ${msg}`);
      alert(`No se pudo subir el video: ${msg}`);
    } finally {
      setIsUploadingVideo(false);
      e.target.value = "";
    }
  };

  // Handler para subir archivo 3D de Gaussian Splatting (.ply, .splat, .ksplat)
  const handleModel3DFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingModel(true);
    setModelUploadStatus("Iniciando subida del modelo 3D...");

    try {
      const result = await uploadPropertyModel3D(file, (status) => setModelUploadStatus(status));
      setPropForm((prev) => ({
        ...prev,
        has3DTour: true,
        model3D: {
          url: result.url,
          format: result.format,
          initialCameraPosition: prev.model3D?.initialCameraPosition || [0, 2, 5],
          initialCameraTarget: prev.model3D?.initialCameraTarget || [0, 0, 0],
        },
      }));
      setModelUploadStatus(`✅ Archivo listo: ${result.fileName} (${result.sizeMB} MB)`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      setModelUploadStatus(`❌ Error: ${msg}`);
      alert(`No se pudo subir el archivo 3D: ${msg}`);
    } finally {
      setIsUploadingModel(false);
      e.target.value = "";
    }
  };

  // Handlers para gestión de múltiples habitaciones 3D por propiedad
  const handleAddRoom3D = () => {
    const currentRooms = propForm.rooms3D || [];
    const newRoom: PropertyRoom3D = {
      id: `room-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: currentRooms.length === 0 ? "Living Comedor" : `Habitación ${currentRooms.length + 1}`,
      url: "",
      format: "ply",
      initialCameraPosition: [0, 2, 5],
      initialCameraTarget: [0, 0, 0],
    };
    setPropForm((prev) => ({
      ...prev,
      has3DTour: true,
      rooms3D: [...currentRooms, newRoom],
    }));
  };

  const handleUpdateRoom3D = (roomId: string, patch: Partial<PropertyRoom3D>) => {
    const currentRooms = propForm.rooms3D || [];
    const updated = currentRooms.map((r) => (r.id === roomId ? { ...r, ...patch } : r));
    setPropForm((prev) => ({
      ...prev,
      rooms3D: updated,
    }));
  };

  const handleDeleteRoom3D = (roomId: string) => {
    const currentRooms = (propForm.rooms3D || []).filter((r) => r.id !== roomId);
    setPropForm((prev) => ({
      ...prev,
      rooms3D: currentRooms,
      has3DTour: currentRooms.length > 0 || !!prev.model3D?.url,
    }));
  };

  const handleRoomFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, roomId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingRoomId(roomId);
    setModelUploadStatus("Iniciando subida de habitación 3D...");

    try {
      const result = await uploadPropertyModel3D(file, (status) => setModelUploadStatus(status));
      handleUpdateRoom3D(roomId, {
        url: result.url,
        format: result.format,
      });
      setModelUploadStatus(`✅ Habitación lista: ${result.fileName} (${result.sizeMB} MB)`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      setModelUploadStatus(`❌ Error: ${msg}`);
      alert(`No se pudo subir la habitación 3D: ${msg}`);
    } finally {
      setUploadingRoomId(null);
      e.target.value = "";
    }
  };

  // Persistencia de sesión en navegador
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("admin_authenticated");
      if (stored === "true") {
        setIsAuthenticated(true);
        setProfileForm(agentProfile);
      }
    }
  }, [agentProfile]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const validPins = ["aurea2026", "admin", "admin123", "99propiedades"];
    if (validPins.includes(pinInput.trim())) {
      setIsAuthenticated(true);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("admin_authenticated", "true");
      }
      setPinError(false);
      setProfileForm(agentProfile);
      showFeedback("Sesión iniciada con éxito.", "success");
    } else {
      setPinError(true);
    }
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("admin_authenticated");
    }
    setIsAuthenticated(false);
    showFeedback("Sesión cerrada.", "info");
  };

  // ------------------ GESTIÓN DE PROPIEDADES ------------------
  const startEditProperty = (prop: Property) => {
    setEditingPropId(prop.id);
    // Normalizar habitaciones 3D si la propiedad tiene model3D único o lista rooms3D
    const initialRooms: PropertyRoom3D[] = prop.rooms3D && prop.rooms3D.length > 0
      ? [...prop.rooms3D]
      : prop.model3D?.url
      ? [
          {
            id: `room-1`,
            name: "Ambiente Principal",
            url: prop.model3D.url,
            format: prop.model3D.format || "ply",
            initialCameraPosition: prop.model3D.initialCameraPosition || [0, 2, 5],
            initialCameraTarget: prop.model3D.initialCameraTarget || [0, 0, 0],
          },
        ]
      : [];

    setPropForm({
      ...prop,
      rooms3D: initialRooms,
    });
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
      rooms3D: [],
      has3DTour: false,
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

    // Normalizar habitaciones válidas y sincronizar model3D para compatibilidad total
    const validRooms = (propForm.rooms3D || []).filter((r) => r.url && r.url.trim().length > 0);
    const has3D = validRooms.length > 0 || !!propForm.model3D?.url;

    // Asegurar slug consistente si el usuario no especificó uno manual
    const slugBase = (propForm.title || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const generatedSlug = propForm.slug?.trim() || `${slugBase || "prop"}-${Date.now().toString(36)}`;

    // Asegurar estructura de ubicación segura
    const safeLocation = {
      city: propForm.location?.city || "CABA",
      neighborhood: propForm.location?.neighborhood || "Palermo",
      address: propForm.location?.address || "",
      zone: propForm.location?.zone || "Capital Federal",
    };

    // Asegurar estructura de features segura
    const safeFeatures = {
      bedrooms: Number(propForm.features?.bedrooms ?? 1),
      bathrooms: Number(propForm.features?.bathrooms ?? 1),
      parkingSpaces: Number(propForm.features?.parkingSpaces ?? 0),
      totalArea: Number(propForm.features?.totalArea ?? 50),
      coveredArea: Number(propForm.features?.coveredArea ?? 45),
      yearBuilt: Number(propForm.features?.yearBuilt ?? new Date().getFullYear()),
      expenses: Number(propForm.features?.expenses ?? 0),
    };

    // Asegurar al menos una imagen
    const safeImages = propForm.images && propForm.images.length > 0
      ? propForm.images.filter((img) => img && img.trim().length > 0)
      : ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"];

    const finalForm: Partial<Property> = {
      ...propForm,
      slug: generatedSlug,
      location: safeLocation,
      features: safeFeatures,
      images: safeImages.length > 0 ? safeImages : ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"],
      operation: propForm.operation || "venta",
      type: propForm.type || "departamento",
      status: propForm.status || "disponible",
      currency: propForm.currency || "USD",
      rooms3D: validRooms,
      has3DTour: has3D,
      model3D: validRooms.length > 0
        ? {
            url: validRooms[0].url,
            format: validRooms[0].format,
            initialCameraPosition: validRooms[0].initialCameraPosition,
            initialCameraTarget: validRooms[0].initialCameraTarget,
          }
        : propForm.model3D,
    };

    if (isCreatingProp) {
      addProperty(finalForm as Omit<Property, "id" | "createdAt">);
      setIsCreatingProp(false);
      showFeedback(`Propiedad "${finalForm.title}" creada y sincronizada correctamente.`, "success");
    } else if (editingPropId) {
      updateProperty(editingPropId, finalForm);
      setEditingPropId(null);
      showFeedback(`Propiedad "${finalForm.title}" actualizada correctamente.`, "success");
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
      showFeedback(`Banner "${bannerForm.title}" publicado con éxito.`, "success");
    } else if (editingBannerId) {
      updateBanner(editingBannerId, bannerForm);
      setEditingBannerId(null);
      showFeedback(`Banner "${bannerForm.title}" actualizado con éxito.`, "success");
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
      showFeedback(`Tasa bancaria de "${bankForm.bankName}" agregada.`, "success");
    } else if (editingBankId) {
      updateBankRate(editingBankId, bankForm);
      setEditingBankId(null);
      showFeedback(`Tasa bancaria de "${bankForm.bankName}" actualizada.`, "success");
    }
  };

  // ------------------ GUARDAR PERFIL DEL AGENTE ------------------
  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateAgentProfile(profileForm);
    setProfileSaved(true);
    showFeedback("Perfil y datos de contacto actualizados.", "success");
    setTimeout(() => setProfileSaved(false), 3000);
  };

  // ------------------ PANTALLA DE ACCESO / LOGIN ------------------
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <div className="bg-white p-8 rounded-sm border border-neutral-200 shadow-xl space-y-6">
          <div className="text-center space-y-3">
            <div className="flex justify-center pb-2">
              <BrandLogo variant="dark" size="lg" withLink={false} />
            </div>
            <h1 className="font-serif text-2xl font-bold text-neutral-900">
              Panel de Administración
            </h1>
            <p className="text-xs text-neutral-500">
              Gestión modular de contenidos de 99 Propiedades
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
                (Claves de acceso: <code className="text-neutral-700 font-mono">aurea2026</code>, <code className="text-neutral-700 font-mono">admin</code> o <code className="text-neutral-700 font-mono">admin123</code>)
              </span>
            </div>

            {pinError && (
              <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-sm border border-rose-200">
                Clave incorrecta. Por favor intente de nuevo.
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-gold-500 hover:bg-gold-600 text-luxury-black font-semibold uppercase tracking-wider py-3 rounded-sm transition-colors shadow-sm btn-tactile cursor-pointer"
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 relative">
      {/* Toast de Feedback flotante */}
      {feedbackMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-sm shadow-xl flex items-center gap-3 border text-xs animate-bounce-subtle ${
            feedbackMessage.type === "success"
              ? "bg-neutral-900 text-gold-400 border-gold-500/40"
              : feedbackMessage.type === "error"
              ? "bg-rose-900 text-white border-rose-700"
              : "bg-neutral-800 text-neutral-200 border-neutral-700"
          }`}
        >
          {feedbackMessage.type === "success" && <Check className="w-4 h-4 text-gold-400 shrink-0" />}
          {feedbackMessage.type === "error" && <X className="w-4 h-4 text-rose-300 shrink-0" />}
          {feedbackMessage.type === "info" && <Sparkles className="w-4 h-4 text-blue-300 shrink-0" />}
          <span className="font-medium">{feedbackMessage.text}</span>
          <button
            onClick={() => setFeedbackMessage(null)}
            className="text-neutral-400 hover:text-white ml-2"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Cabecera del Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-6">
        <div className="flex items-center gap-4">
          <BrandLogo variant="dark" size="md" withLink={false} />
        </div>

        <div className="flex items-center gap-3">
          {isCloudConnected ? (
            <span className="flex items-center gap-1.5 text-xs bg-emerald-50 text-emerald-700 border border-emerald-300 px-3 py-1.5 rounded-full font-medium shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Base de Datos Conectada</span>
            </span>
          ) : (
            <button
              onClick={() => {
                refreshFromCloud();
                showFeedback("Sincronizando datos con la nube...", "info");
              }}
              className="flex items-center gap-1.5 text-xs bg-amber-50 text-amber-700 border border-amber-300 px-3 py-1.5 rounded-full font-medium hover:bg-amber-100 transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Sincronizar Datos</span>
            </button>
          )}

          <button
            onClick={handleLogout}
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
          <RotateCcw className="w-4 h-4" />
          <span>Restablecer Datos</span>
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

              {/* Gestor Avanzado de Subida Múltiple de Imágenes */}
              <div className="space-y-3 bg-stone-50 p-4 rounded-sm border border-neutral-200">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block font-semibold text-neutral-800 text-xs">
                      Galería Fotográfica de la Propiedad (Subir una o varias imágenes)
                    </label>
                    <span className="text-[11px] text-neutral-500">
                      Puedes subir fotos desde tu computadora/celular o ingresar enlaces directos.
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-gold-600 bg-gold-50 px-2 py-0.5 rounded-sm border border-gold-200">
                    {propForm.images?.length || 0} fotos cargadas
                  </span>
                </div>

                {/* Zona de subida de archivos locales (Multi-file) */}
                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                  <label className="flex-1 border-2 border-dashed border-neutral-300 hover:border-gold-500 bg-white rounded-sm p-4 text-center cursor-pointer transition-colors group">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageFilesUpload}
                      className="hidden"
                    />
                    <div className="flex items-center justify-center gap-2 text-neutral-700 group-hover:text-gold-600">
                      <Upload className="w-5 h-5 text-gold-500" />
                      <span className="font-semibold text-xs">
                        {isUploadingImages
                          ? "Procesando imágenes..."
                          : "Elegir fotos (una o varias a la vez)"}
                      </span>
                    </div>
                    <span className="block text-[10px] text-neutral-400 mt-1">
                      Soporta JPG, PNG, WEBP directamente desde tu galería o cámara
                    </span>
                  </label>
                </div>

                {/* Alternativa: Añadir por URL */}
                <div className="flex items-center gap-2 pt-1">
                  <div className="relative flex-1">
                    <ImageIcon className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="O pega aquí una URL de imagen web (ej: Unsplash, CDN...)"
                      value={manualImageUrl}
                      onChange={(e) => setManualImageUrl(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-neutral-300 rounded-sm focus:border-gold-500 focus:outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddManualUrl}
                    className="bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-xs px-3.5 py-2 rounded-sm transition-colors shrink-0"
                  >
                    + Agregar URL
                  </button>
                </div>

                {/* Galería de Miniaturas con Portada y Reordenamiento */}
                {propForm.images && propForm.images.length > 0 && (
                  <div className="pt-2">
                    <span className="block text-[11px] font-semibold text-neutral-700 uppercase tracking-wider mb-2">
                      Fotos seleccionadas (la primera es la portada principal):
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                      {propForm.images.map((imgUrl, idx) => (
                        <div
                          key={idx}
                          className={`relative group rounded-sm overflow-hidden border-2 bg-neutral-900 ${
                            idx === 0 ? "border-gold-500 ring-2 ring-gold-400/30" : "border-neutral-200"
                          }`}
                        >
                          <div className="relative h-24 w-full">
                            <Image
                              src={imgUrl}
                              alt={`Foto ${idx + 1}`}
                              fill
                              unoptimized={imgUrl.startsWith("data:")}
                              className="object-cover"
                            />
                          </div>

                          {/* Badge de Portada */}
                          {idx === 0 ? (
                            <span className="absolute top-1 left-1 bg-gold-500 text-luxury-black font-bold text-[9px] px-1.5 py-0.5 rounded-sm shadow-sm flex items-center gap-0.5">
                              <Star className="w-2.5 h-2.5 fill-luxury-black" />
                              <span>Portada</span>
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleMakeCoverImage(idx)}
                              className="absolute top-1 left-1 bg-black/70 hover:bg-gold-500 hover:text-black text-white text-[9px] px-1.5 py-0.5 rounded-sm opacity-90 transition-colors"
                              title="Hacer foto principal"
                            >
                              Hacer Portada
                            </button>
                          )}

                          {/* Botón Eliminar Foto */}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-1 right-1 bg-rose-600/90 hover:bg-rose-700 text-white p-1 rounded-sm shadow-sm opacity-90 transition-colors"
                            title="Eliminar esta foto"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>

                          <div className="p-1 bg-white text-center text-[10px] text-neutral-500 truncate">
                            Foto #{idx + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Toggles de Destacado, Oportunidad y Video Tour */}
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

                <label className="flex items-center gap-2 cursor-pointer font-medium text-red-700 bg-red-50 px-2.5 py-1 rounded-sm border border-red-200">
                  <input
                    type="checkbox"
                    checked={propForm.hasVideoTour || false}
                    onChange={(e) => setPropForm({ ...propForm, hasVideoTour: e.target.checked })}
                    className="accent-red-600 w-4 h-4"
                  />
                  <span>🎬 Tiene Video Tour Oficial (Prioridad Video)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-medium text-amber-800 bg-amber-50 px-2.5 py-1 rounded-sm border border-amber-200">
                  <input
                    type="checkbox"
                    checked={propForm.has3DTour || !!propForm.model3D?.url || false}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setPropForm({
                        ...propForm,
                        has3DTour: checked,
                        model3D: checked
                          ? propForm.model3D || {
                              url: "",
                              format: "ply",
                              initialCameraPosition: [0, 2, 5],
                              initialCameraTarget: [0, 0, 0],
                            }
                          : propForm.model3D,
                      });
                    }}
                    className="accent-amber-600 w-4 h-4"
                  />
                  <span>🕶️ Recorrido 3D Gaussian Splatting</span>
                </label>
              </div>

              {/* Zona de Subida y Compresión de Video Tour */}
              <div className="p-4 bg-red-50/50 border border-red-100 rounded-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-red-500" />
                    <label className="block font-semibold text-neutral-800">
                      Video Tour (subir archivo o pegar URL)
                    </label>
                  </div>
                  <span className="text-[10px] text-neutral-500 font-mono bg-white border border-neutral-200 px-2 py-0.5 rounded-sm">
                    Compresión automática · Alta calidad
                  </span>
                </div>

                {/* Zona de subida de archivo de video */}
                <label
                  className={`flex flex-col items-center justify-center w-full border-2 border-dashed rounded-sm p-5 text-center cursor-pointer transition-colors ${
                    isUploadingVideo
                      ? "border-red-300 bg-red-50 cursor-not-allowed"
                      : "border-neutral-300 hover:border-red-400 bg-white hover:bg-red-50/30 group"
                  }`}
                >
                  <input
                    type="file"
                    accept="video/mp4,video/webm,video/mov,video/quicktime,video/avi,video/*"
                    onChange={handleVideoFileUpload}
                    disabled={isUploadingVideo}
                    className="hidden"
                  />
                  {isUploadingVideo ? (
                    <div className="w-full space-y-2">
                      <div className="flex items-center justify-center gap-2 text-red-600">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-xs font-semibold">{videoStatus}</span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-red-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${videoProgress}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-neutral-500">{videoProgress}% completado</span>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex items-center justify-center gap-2 text-neutral-600 group-hover:text-red-600">
                        <Upload className="w-5 h-5 text-red-400" />
                        <span className="font-semibold text-xs">
                          {propForm.videoUrl ? "Reemplazar video (subir nuevo)" : "Subir video tour"}
                        </span>
                      </div>
                      <span className="block text-[10px] text-neutral-400">
                        MP4, MOV, AVI, WEBM · Se comprime automáticamente a 720p máx para menor peso
                      </span>
                      {videoStatus && !isUploadingVideo && (
                        <span className="block text-[11px] font-medium text-emerald-600 mt-1">{videoStatus}</span>
                      )}
                    </div>
                  )}
                </label>

                {/* Video actual preview si existe */}
                {propForm.videoUrl && !isUploadingVideo && (
                  <div className="flex items-center gap-2 bg-white border border-neutral-200 rounded-sm p-2.5">
                    <Video className="w-4 h-4 text-red-500 shrink-0" />
                    <span className="text-[11px] text-neutral-600 truncate flex-1 font-mono">{propForm.videoUrl}</span>
                    <button
                      type="button"
                      onClick={() => setPropForm({ ...propForm, videoUrl: "", hasVideoTour: false })}
                      className="text-rose-500 hover:text-rose-700 shrink-0"
                      title="Quitar video"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Alternativa: URL manual */}
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={propForm.videoUrl && !propForm.videoUrl.startsWith("http") ? propForm.videoUrl : ""}
                    onChange={(e) =>
                      setPropForm({
                        ...propForm,
                        videoUrl: e.target.value,
                        hasVideoTour: e.target.value.trim().length > 0 ? true : propForm.hasVideoTour,
                      })
                    }
                    className="flex-1 p-2.5 bg-white border border-neutral-300 rounded-sm focus:border-red-500 focus:outline-none text-xs"
                    placeholder="O pegar URL externa: YouTube, Vimeo, https://..."
                  />
                </div>
              </div>

              {/* Zona de Configuración de Recorrido 3D & Habitaciones Escaneadas (Gaussian Splatting) */}
              <div className="p-4 bg-amber-50/50 border border-amber-200/80 rounded-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/60 pb-3">
                  <div className="flex items-center gap-2">
                    <Box className="w-5 h-5 text-amber-600" />
                    <div>
                      <label className="block font-bold text-neutral-900 text-sm">
                        Recorridos 3D por Habitaciones (Gaussian Splatting)
                      </label>
                      <span className="text-xs text-neutral-600">
                        Podés cargar cada ambiente por separado (Living, Habitación Principal, Cocina, etc.)
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-amber-800 font-mono bg-amber-100/70 border border-amber-200 px-2.5 py-1 rounded-sm shrink-0">
                    Formatos: .ply · .splat · .ksplat
                  </span>
                </div>

                {/* Guía práctica de apps para escanear desde el teléfono */}
                <div className="bg-amber-100/60 border border-amber-200 rounded-sm p-3.5 text-xs text-amber-950 space-y-2">
                  <span className="font-bold flex items-center gap-1.5 text-amber-900">
                    <span>📱 ¿Cómo escanear las habitaciones con tu teléfono móvil?</span>
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] text-neutral-700">
                    <div className="bg-white/80 p-2 rounded border border-amber-200/60">
                      <strong className="text-amber-900 block mb-0.5">1. Scaniverse (Gratis en iOS y Android):</strong>
                      Abrí la app, elegí modo <em>Splat</em>, caminá filmando la habitación despacio y exportá el archivo <strong>.ply</strong> o <strong>.splat</strong>.
                    </div>
                    <div className="bg-white/80 p-2 rounded border border-amber-200/60">
                      <strong className="text-amber-900 block mb-0.5">2. Luma AI (iOS y Web):</strong>
                      Grabá la habitación en círculos concéntricos. Genera el Gaussian Splat y descargá el archivo para subirlo acá.
                    </div>
                  </div>
                  <div className="text-[11px] text-neutral-600 italic">
                    💡 Tip: Escaneá 1 habitación por captura (1 a 2 minutos) para que el archivo sea liviano y el visitante navegue rápido entre ambientes.
                  </div>
                </div>

                {/* Lista de habitaciones 3D configuradas */}
                <div className="space-y-4 pt-1">
                  {(!propForm.rooms3D || propForm.rooms3D.length === 0) ? (
                    <div className="p-6 bg-white border border-dashed border-amber-300 rounded-sm text-center space-y-3">
                      <Box className="w-8 h-8 text-amber-500 mx-auto" />
                      <div>
                        <h4 className="font-semibold text-neutral-800 text-sm">No hay habitaciones 3D cargadas en esta propiedad</h4>
                        <p className="text-xs text-neutral-500">Agregá la primera habitación para habilitar el recorrido inmersivo.</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddRoom3D}
                        className="bg-gold-500 hover:bg-gold-600 text-luxury-black font-semibold text-xs px-4 py-2.5 rounded-sm transition-all shadow-sm inline-flex items-center gap-1.5"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Agregar Primera Habitación 3D</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {propForm.rooms3D.map((room, idx) => (
                        <div key={room.id} className="p-4 bg-white border border-amber-200 rounded-sm shadow-xs space-y-3">
                          {/* Cabecera de la habitación */}
                          <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5 gap-2">
                            <div className="flex items-center gap-2 flex-1">
                              <span className="w-6 h-6 rounded-full bg-amber-500 text-luxury-black text-xs font-bold flex items-center justify-center shrink-0">
                                {idx + 1}
                              </span>
                              <input
                                type="text"
                                value={room.name}
                                onChange={(e) => handleUpdateRoom3D(room.id, { name: e.target.value })}
                                placeholder="Nombre del ambiente (ej: Living Comedor, Master Suite, Cocina)"
                                className="font-semibold text-neutral-900 text-xs sm:text-sm bg-transparent border-b border-dashed border-neutral-300 hover:border-neutral-500 focus:border-gold-500 focus:outline-none flex-1 py-0.5"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => handleDeleteRoom3D(room.id)}
                              className="text-rose-600 hover:text-rose-800 p-1.5 rounded hover:bg-rose-50 transition-colors shrink-0 flex items-center gap-1 text-[11px]"
                              title="Eliminar esta habitación"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Eliminar</span>
                            </button>
                          </div>

                          {/* Subida directa de archivo para esta habitación */}
                          <label
                            className={`flex flex-col items-center justify-center w-full border-2 border-dashed rounded-sm p-4 text-center cursor-pointer transition-colors ${
                              uploadingRoomId === room.id
                                ? "border-amber-400 bg-amber-50 cursor-not-allowed"
                                : "border-amber-200 hover:border-amber-400 bg-amber-50/20 hover:bg-amber-50/50 group"
                            }`}
                          >
                            <input
                              type="file"
                              accept=".ply,.splat,.ksplat"
                              onChange={(e) => handleRoomFileUpload(e, room.id)}
                              disabled={uploadingRoomId === room.id}
                              className="hidden"
                            />
                            {uploadingRoomId === room.id ? (
                              <div className="w-full space-y-1.5">
                                <div className="flex items-center justify-center gap-2 text-amber-700">
                                  <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
                                  <span className="text-xs font-semibold">{modelUploadStatus}</span>
                                </div>
                                <span className="text-[10px] text-neutral-500">Subiendo archivo 3D a la nube...</span>
                              </div>
                            ) : (
                              <div className="space-y-1">
                                <div className="flex items-center justify-center gap-2 text-neutral-700 group-hover:text-amber-800">
                                  <Upload className="w-4 h-4 text-amber-600" />
                                  <span className="font-semibold text-xs">
                                    {room.url
                                      ? "Reemplazar archivo 3D de este ambiente"
                                      : "Subir archivo 3D de esta habitación (.ply, .splat, .ksplat)"}
                                  </span>
                                </div>
                                <span className="block text-[10px] text-neutral-500">
                                  Elegí el archivo desde tu teléfono o computadora (hasta 500 MB)
                                </span>
                              </div>
                            )}
                          </label>

                          {/* URL y Formato */}
                          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
                            <div className="sm:col-span-8 space-y-1">
                              <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                                URL del Modelo 3D
                              </label>
                              <div className="flex gap-1.5">
                                <input
                                  type="text"
                                  value={room.url}
                                  onChange={(e) => handleUpdateRoom3D(room.id, { url: e.target.value })}
                                  placeholder="https://.../modelo.ply o .splat"
                                  className="flex-1 p-2 bg-stone-50 border border-neutral-300 rounded-sm text-xs font-mono focus:border-gold-500 focus:outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleUpdateRoom3D(room.id, {
                                      url: SPLAT_VIEWER_CONFIG.sampleModelUrl,
                                      format: "splat",
                                    })
                                  }
                                  className="bg-neutral-800 hover:bg-neutral-900 text-white text-[11px] px-2.5 py-1.5 rounded-sm transition-colors shrink-0"
                                  title="Cargar modelo demo para pruebas"
                                >
                                  Cargar Demo
                                </button>
                              </div>
                            </div>

                            <div className="sm:col-span-4 space-y-1">
                              <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                                Formato
                              </label>
                              <select
                                value={room.format || "ply"}
                                onChange={(e) =>
                                  handleUpdateRoom3D(room.id, {
                                    format: e.target.value as "ply" | "splat" | "ksplat",
                                  })
                                }
                                className="w-full p-2 bg-stone-50 border border-neutral-300 rounded-sm text-xs focus:border-gold-500 focus:outline-none"
                              >
                                <option value="ply">.PLY (Scaniverse / SuperSplat)</option>
                                <option value="splat">.SPLAT (Optimizado)</option>
                                <option value="ksplat">.KSPLAT (Comprimido)</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Botón para añadir otra habitación */}
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={handleAddRoom3D}
                          className="w-full py-2.5 border-2 border-dashed border-amber-300 hover:border-amber-500 bg-white hover:bg-amber-50/50 text-amber-900 font-semibold text-xs rounded-sm transition-all flex items-center justify-center gap-2"
                        >
                          <Plus className="w-4 h-4 text-amber-600" />
                          <span>+ Agregar Otra Habitación 3D</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
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

          {/* Filtros por Operación y Buscador */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-50 p-3 rounded-sm border border-neutral-200 text-xs">
            {/* Chips de Operación */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setFilterOperation("todas")}
                className={`px-3 py-1.5 rounded-sm font-semibold transition-colors ${
                  filterOperation === "todas"
                    ? "bg-neutral-900 text-white shadow-xs"
                    : "bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-100"
                }`}
              >
                Todas ({properties.length})
              </button>
              <button
                onClick={() => setFilterOperation("venta")}
                className={`px-3 py-1.5 rounded-sm font-semibold transition-colors flex items-center gap-1.5 ${
                  filterOperation === "venta"
                    ? "bg-emerald-700 text-white shadow-xs"
                    : "bg-white text-emerald-800 border border-emerald-200 hover:bg-emerald-50"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Venta ({countVenta})
              </button>
              <button
                onClick={() => setFilterOperation("alquiler")}
                className={`px-3 py-1.5 rounded-sm font-semibold transition-colors flex items-center gap-1.5 ${
                  filterOperation === "alquiler"
                    ? "bg-blue-700 text-white shadow-xs"
                    : "bg-white text-blue-800 border border-blue-200 hover:bg-blue-50"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                Alquiler ({countAlquiler})
              </button>
              <button
                onClick={() => setFilterOperation("pozo")}
                className={`px-3 py-1.5 rounded-sm font-semibold transition-colors flex items-center gap-1.5 ${
                  filterOperation === "pozo"
                    ? "bg-purple-700 text-white shadow-xs"
                    : "bg-white text-purple-800 border border-purple-200 hover:bg-purple-50"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                En Pozo ({countPozo})
              </button>
            </div>

            {/* Input de Búsqueda */}
            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Buscar por título, barrio, ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-7 py-1.5 bg-white border border-neutral-300 rounded-sm focus:border-gold-500 focus:outline-none text-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                  title="Limpiar búsqueda"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Tabla de Propiedades */}
          <div className="bg-white border border-neutral-200 rounded-sm shadow-sm overflow-x-auto">
            {filteredProperties.length === 0 ? (
              <div className="p-8 text-center space-y-3">
                <Building2 className="w-8 h-8 text-neutral-400 mx-auto" />
                <div>
                  <h4 className="font-semibold text-neutral-800 text-sm">
                    No se encontraron propiedades
                  </h4>
                  <p className="text-xs text-neutral-500">
                    No hay publicaciones que coincidan con el filtro &quot;{filterOperation}&quot; o la búsqueda &quot;{searchQuery}&quot;.
                  </p>
                </div>
                {(filterOperation !== "todas" || searchQuery) && (
                  <button
                    onClick={() => {
                      setFilterOperation("todas");
                      setSearchQuery("");
                    }}
                    className="text-xs text-gold-600 hover:text-gold-700 font-semibold underline"
                  >
                    Restablecer filtros
                  </button>
                )}
              </div>
            ) : (
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
                  {filteredProperties.map((prop) => (
                    <tr key={prop.id} className="hover:bg-stone-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-10 rounded-sm overflow-hidden bg-neutral-200 shrink-0">
                            <Image
                              src={prop.images?.[0] || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"}
                              alt={prop.title || "Inmueble"}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-semibold text-neutral-900">{prop.title}</div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] text-neutral-400 font-mono">ID: {prop.id}</span>
                              {prop.has3DTour && (
                                <span className="text-[9px] bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.2 rounded font-medium">
                                  3D Splat
                                </span>
                              )}
                              {prop.hasVideoTour && (
                                <span className="text-[9px] bg-sky-50 text-sky-800 border border-sky-200 px-1.5 py-0.2 rounded font-medium">
                                  Video Tour
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        {prop.operation === "venta" && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Venta
                          </span>
                        )}
                        {prop.operation === "alquiler" && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            Alquiler
                          </span>
                        )}
                        {prop.operation === "pozo" && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-50 text-purple-800 border border-purple-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                            En Pozo
                          </span>
                        )}
                        {!["venta", "alquiler", "pozo"].includes(prop.operation) && (
                          <span className="uppercase text-[11px] font-medium text-neutral-600">
                            {prop.operation}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 font-serif font-bold text-neutral-900 text-sm">
                        ${prop.price.toLocaleString("es-AR")}
                      </td>

                      <td className="py-3 px-4 text-neutral-600">
                        {prop.location?.neighborhood || "Sin barrio"}, {prop.location?.city || "CABA"}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => {
                            const next = !prop.isFeatured;
                            updateProperty(prop.id, { isFeatured: next });
                            showFeedback(
                              next ? `"${prop.title}" marcado como Destacado.` : `"${prop.title}" quitado de Destacados.`,
                              "info"
                            );
                          }}
                          className={`w-6 h-6 rounded-full inline-flex items-center justify-center text-xs transition-colors cursor-pointer ${
                            prop.isFeatured ? "bg-amber-100 text-amber-800 font-bold" : "bg-neutral-100 text-neutral-400"
                          }`}
                          title="Alternar destacado"
                        >
                          {prop.isFeatured ? "★" : "☆"}
                        </button>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => {
                            const next = !prop.isOpportunity;
                            updateProperty(prop.id, { isOpportunity: next });
                            showFeedback(
                              next ? `"${prop.title}" marcado como Oportunidad.` : `"${prop.title}" quitado de Oportunidades.`,
                              "info"
                            );
                          }}
                          className={`px-2 py-0.5 rounded-sm text-[10px] font-semibold transition-colors cursor-pointer ${
                            prop.isOpportunity
                              ? "bg-gold-500 text-luxury-black font-bold"
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
                            className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-sm cursor-pointer"
                            title="Editar"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`¿Eliminar la propiedad "${prop.title}"?`)) {
                                deleteProperty(prop.id);
                                showFeedback(`Propiedad "${prop.title}" eliminada.`, "info");
                              }
                            }}
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-sm cursor-pointer"
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
            )}
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
                          showFeedback(`Banner "${b.title}" eliminado.`, "info");
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
                              showFeedback(`Tasa de "${bank.bankName}" eliminada.`, "info");
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
              <div className="flex items-center justify-between mb-1">
                <label className="flex items-center gap-1.5 font-semibold text-neutral-700">
                  <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
                  <span>WhatsApp de Contacto *</span>
                </label>
                {profileForm.whatsappNumber && (
                  <a
                    href={getWhatsAppUrl(profileForm.whatsappNumber, "¡Hola! Mensaje de prueba desde el panel.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-emerald-700 hover:text-emerald-800 font-semibold underline flex items-center gap-0.5"
                    title="Probar que el enlace abre WhatsApp correctamente"
                  >
                    <span>Probar Chat</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </div>
              <input
                type="text"
                placeholder="Ej: 5492234980913 o 2234980913"
                value={profileForm.whatsappNumber}
                onChange={(e) => {
                  const raw = e.target.value;
                  setProfileForm({
                    ...profileForm,
                    whatsappNumber: raw,
                  });
                }}
                className="w-full p-2.5 bg-stone-50 border border-neutral-300 rounded-sm focus:border-gold-500 focus:outline-none"
              />
              <span className="block text-[10px] text-neutral-400 mt-1">
                Formato limpio: <code className="text-emerald-700 font-mono font-semibold">{cleanWhatsAppNumber(profileForm.whatsappNumber)}</code>
              </span>
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

      {/* CONTENIDO DEL TAB 5: RESTABLECER DATOS DE DEMOSTRACIÓN */}
      {activeTab === "backup" && (
        <div className="bg-white p-6 sm:p-8 rounded-sm border border-neutral-200 shadow-sm space-y-6 text-xs max-w-xl">
          <div>
            <h2 className="font-serif text-lg font-bold text-neutral-900">
              Restablecer Valores Iniciales
            </h2>
            <p className="text-xs text-neutral-500">
              Restaure las propiedades y datos de demostración si desea reiniciar la configuración de fábrica.
            </p>
          </div>

          <div className="p-5 bg-stone-50 border border-neutral-200 rounded-sm space-y-3">
            <h3 className="font-semibold text-rose-800 flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-rose-600" />
              <span>Restablecer Datos de Demostración</span>
            </h3>
            <p className="text-neutral-600">
              Si desea volver a cargar los datos originales y propiedades de demostración, haga clic a continuación.
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
      )}
    </div>
  );
}
