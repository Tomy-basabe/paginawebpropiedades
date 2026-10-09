"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useData } from "@/context/DataContext";
import BrandLogo from "@/components/BrandLogo";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { uploadPropertyImage, uploadPropertyVideo } from "@/lib/supabase";
import { cleanWhatsAppNumber, getWhatsAppUrl } from "@/lib/whatsapp";
import { Property, BankRate, FeaturedBanner, AgentProfile, PropertyType, OperationType, PropertyStatus } from "@/lib/types";
import { 
  SlidersHorizontal, 
  Building2, 
  Percent, 
  Sparkles, 
  UserCheck, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  Lock, 
  Unlock, 
  Upload, 
  Check, 
  X,
  ExternalLink,
  ImageIcon,
  Star,
  Video,
  Camera,
  Film,
  Loader2,
  Box,
  Search,
  Eye,
  EyeOff,
  DollarSign,
  Users,
  KeyRound,
  Shield,
  ShieldCheck,
  CheckCheck,
  UserPlus,
  CalendarDays,
  CalendarCheck,
  AlertTriangle,
  CreditCard,
  Clock,
  Ban,
  AlertOctagon,
  Info,
  MapPin,
  Crop,
  ZoomIn,
  ZoomOut,
  Move,
} from "lucide-react";
import { AppMonthlyPayment } from "@/lib/types";
import {
  buildYearPayments,
  checkAppPaymentLock,
  getLocalStoredPayments,
  saveLocalStoredPayments,
  MONTH_NAMES_ES,
  PaymentLockStatus,
} from "@/lib/payments";
import {
  getGoogleMapsEmbedUrl,
  getGoogleMapsExternalLink,
  parseAndGeocodeLocation,
} from "@/lib/maps";

type AdminModule = "propiedades" | "banners" | "tasas" | "perfil" | "usuarios" | "pagos";

interface AdminUser {
  id: string;
  username: string;
  password: string;
  name: string;
  role: "admin" | "asesor";
  permissions: AdminModule[];
  createdAt: string;
}

interface AdminModuleConfig {
  id: AdminModule;
  label: string;
  shortLabel: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const ALL_ADMIN_MODULES: AdminModuleConfig[] = [
  {
    id: "propiedades",
    label: "Propiedades",
    shortLabel: "Propiedades",
    description: "Gestión de catálogo, edición y alta de inmuebles",
    icon: Building2,
  },
  {
    id: "banners",
    label: "Banners y Anuncios",
    shortLabel: "Banners",
    description: "Configuración de lanzamientos en portada",
    icon: ImageIcon,
  },
  {
    id: "tasas",
    label: "Tasas Bancarias UVA",
    shortLabel: "Tasas",
    description: "Configuración del simulador crediticio hipotecario",
    icon: Percent,
  },
  {
    id: "perfil",
    label: "Perfil y Contacto",
    shortLabel: "Perfil",
    description: "Datos del agente, WhatsApp y teléfonos",
    icon: UserCheck,
  },
  {
    id: "usuarios",
    label: "Usuarios y Permisos",
    shortLabel: "Usuarios",
    description: "Administración de accesos y roles del equipo",
    icon: Users,
  },
  {
    id: "pagos",
    label: "Control de Pagos",
    shortLabel: "Pagos",
    description: "Calendario y registro de pagos mensuales de la app",
    icon: CalendarCheck,
  },
];

const DEFAULT_USERS: AdminUser[] = [
  {
    id: "admin-root",
    username: "admin",
    password: "••••••••",
    name: "Administrador",
    role: "admin",
    permissions: ALL_ADMIN_MODULES.map((m) => m.id),
    createdAt: new Date().toISOString(),
  },
  {
    id: "user-99propiedades",
    username: "99propiedades",
    password: "••••••••",
    name: "99 Propiedades",
    role: "asesor",
    permissions: ["propiedades", "banners", "tasas", "perfil"],
    createdAt: new Date().toISOString(),
  },
];

const DEFAULT_ADMIN_USER: AdminUser = DEFAULT_USERS[0];

export default function AdminSecretPage() {
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
    isCloudConnected,
    refreshFromCloud,
    hideSoldProperties,
    setHideSoldProperties,
  } = useData();

  // Usuarios y autenticación
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Formulario de login
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Cambio de contraseña propia del usuario actual
  const [currentPasswordInput, setCurrentPasswordInput] = useState("");
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [confirmPasswordInput, setConfirmPasswordInput] = useState("");

  // Crear nuevo usuario
  const [newUserName, setNewUserName] = useState("");
  const [newUserUsername, setNewUserUsername] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserRole, setNewUserRole] = useState<"admin" | "asesor">("asesor");
  const [newUserPermissions, setNewUserPermissions] = useState<AdminModule[]>(ALL_ADMIN_MODULES.map((m) => m.id));

  // Edición rápida de contraseña para otro usuario
  const [editingPasswordUserId, setEditingPasswordUserId] = useState<string | null>(null);
  const [tempUserPassword, setTempUserPassword] = useState("");

  // Edición de permisos de usuario
  const [editingPermissionsUserId, setEditingPermissionsUserId] = useState<string | null>(null);
  const [tempUserPermissions, setTempUserPermissions] = useState<AdminModule[]>([]);

  const handleToggleNewUserPermission = (modId: AdminModule) => {
    setNewUserPermissions((prev) =>
      prev.includes(modId) ? prev.filter((id) => id !== modId) : [...prev, modId]
    );
  };

  const handleToggleAllNewUserPermissions = () => {
    if (newUserPermissions.length === ALL_ADMIN_MODULES.length) {
      setNewUserPermissions([]);
    } else {
      setNewUserPermissions(ALL_ADMIN_MODULES.map((m) => m.id));
    }
  };

  const handleStartEditingPermissions = (user: AdminUser) => {
    setEditingPermissionsUserId(user.id);
    const initialMods: AdminModule[] =
      user.permissions && user.permissions.length > 0
        ? user.permissions
        : user.role === "admin"
        ? ALL_ADMIN_MODULES.map((m) => m.id)
        : (["propiedades"] as AdminModule[]);
    setTempUserPermissions(initialMods);
  };

  const handleToggleTempPermission = (modId: AdminModule) => {
    setTempUserPermissions((prev) =>
      prev.includes(modId) ? prev.filter((id) => id !== modId) : [...prev, modId]
    );
  };

  const handleToggleAllTempPermissions = () => {
    if (tempUserPermissions.length === ALL_ADMIN_MODULES.length) {
      setTempUserPermissions([]);
    } else {
      setTempUserPermissions(ALL_ADMIN_MODULES.map((m) => m.id));
    }
  };

  const handleSaveUserPermissions = (userId: string | null) => {
    if (!userId) return;
    if (tempUserPermissions.length === 0) {
      showFeedback("Debes asignar al menos un módulo.", "error");
      return;
    }
    const updatedUsers = users.map((u) =>
      u.id === userId ? { ...u, permissions: tempUserPermissions } : u
    );
    setUsers(updatedUsers);
    if (typeof window !== "undefined") {
      localStorage.setItem("aurea_admin_users", JSON.stringify(updatedUsers));
    }
    setEditingPermissionsUserId(null);
    showFeedback("Permisos actualizados con éxito.", "success");
  };

  // Mensaje de feedback/notificación global
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);

  const showFeedback = (text: string, type: "success" | "error" | "info" = "success") => {
    setFeedbackMessage({ text, type });
    setTimeout(() => {
      setFeedbackMessage((current) => (current?.text === text ? null : current));
    }, 4000);
  };

  // Tabs
  const [activeTab, setActiveTab] = useState<AdminModule>("propiedades");

  // Estado de pagos mensuales de la app
  const [appPayments, setAppPayments] = useState<AppMonthlyPayment[]>([]);
  const [selectedPaymentYear, setSelectedPaymentYear] = useState<number>(new Date().getFullYear());
  const [selectedCalendarMonth, setSelectedCalendarMonth] = useState<number>(new Date().getMonth() + 1);

  // Verificación de estado de bloqueo de la app por pagos
  const paymentLockStatus: PaymentLockStatus = checkAppPaymentLock(appPayments);
  const isPaymentLocked = paymentLockStatus.isBlocked;

  // Cargar pagos guardados al inicializar
  useEffect(() => {
    if (typeof window !== "undefined") {
      const local = getLocalStoredPayments();
      if (local && local.length > 0) {
        setAppPayments(local);
      }
      fetch("/api/admin/payments")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.success && Array.isArray(data.payments) && data.payments.length > 0) {
            setAppPayments(data.payments);
            saveLocalStoredPayments(data.payments);
          }
        })
        .catch(() => {});
    }
  }, []);

  // Función para registrar o desmarcar el pago de un mes (exclusiva del superadmin)
  const handleTogglePayment = async (year: number, month: number, forceStatus?: boolean) => {
    if (currentUser?.role !== "admin" || currentUser?.username !== "admin") {
      showFeedback("Acceso denegado: Solo el usuario administrador puede modificar el estado de los pagos.", "error");
      return;
    }

    const id = `${year}-${String(month).padStart(2, "0")}`;
    const existing = appPayments.find((p) => p.id === id);
    const newIsPaid = forceStatus !== undefined ? forceStatus : existing ? !existing.isPaid : true;
    const monthName = MONTH_NAMES_ES[month - 1];

    const updatedPayment: AppMonthlyPayment = {
      id,
      year,
      month,
      monthName,
      isPaid: newIsPaid,
      paidAt: newIsPaid ? new Date().toISOString() : undefined,
      paidBy: newIsPaid ? (currentUser?.name || "admin") : undefined,
    };

    const newPayments = appPayments.filter((p) => p.id !== id);
    newPayments.push(updatedPayment);
    setAppPayments(newPayments);
    saveLocalStoredPayments(newPayments);

    if (newIsPaid) {
      showFeedback(`Pago del mes de ${monthName} ${year} registrado con éxito. Sistema desbloqueado para modificaciones.`, "success");
    } else {
      showFeedback(`El mes de ${monthName} ${year} ha sido marcado como pendiente.`, "info");
    }

    try {
      await fetch("/api/admin/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle", payment: updatedPayment }),
      });
    } catch (err) {
      console.warn("Aviso al guardar pago en API:", err);
    }
  };

  // Guardián contra modificaciones cuando el sistema está bloqueado por falta de pago
  const ensureNotPaymentLocked = (actionName = "Esta acción"): boolean => {
    // El usuario administrador general nunca está bloqueado
    if (currentUser?.role === "admin" && currentUser?.username === "admin") {
      return true;
    }
    if (isPaymentLocked) {
      showFeedback(
        `⛔ ${actionName} bloqueada: Se debe renovar el pago del mes de ${paymentLockStatus.pendingMonthName} (Vencimiento: ${paymentLockStatus.dueDateStr}) para realizar modificaciones. Contacte al administrador.`,
        "error"
      );
      return false;
    }
    return true;
  };

  // Bloqueo visual de acciones en UI si el pago está vencido y el usuario no es el administrador
  const isActionBlocked = isPaymentLocked && !(currentUser?.role === "admin" && currentUser?.username === "admin");

  // Filtros y búsqueda en catálogo de propiedades
  const [filterOperation, setFilterOperation] = useState<"todas" | "venta" | "alquiler" | "pozo">("todas");
  const [filterStatus, setFilterStatus] = useState<"todos" | "disponible" | "vendido" | "reservado" | "oportunidad">("todos");
  const [searchQuery, setSearchQuery] = useState("");

  // Conteos reactivos del catálogo
  const countVenta = properties.filter((p) => p.operation === "venta").length;
  const countAlquiler = properties.filter((p) => p.operation === "alquiler").length;
  const countPozo = properties.filter((p) => p.operation === "pozo").length;
  const countVendidas = properties.filter((p) => p.status === "vendido").length;
  const countDisponibles = properties.filter((p) => p.status === "disponible" || p.status === "oportunidad").length;

  // Filtrado de propiedades en el panel
  const filteredProperties = properties.filter((prop) => {
    const matchesOp = filterOperation === "todas" || prop.operation === filterOperation;
    if (!matchesOp) return false;

    if (filterStatus !== "todos") {
      if (prop.status !== filterStatus) return false;
    }

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

  // Estados para subida de múltiples imágenes de propiedades
  const [manualImageUrl, setManualImageUrl] = useState("");
  const [isUploadingImages, setIsUploadingImages] = useState(false);

  // Estados para subida y compresión de video tour
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoStatus, setVideoStatus] = useState("");

  // Estados y lógica para autocompletado y vista previa de Google Maps
  const [isGeocodingMap, setIsGeocodingMap] = useState(false);

  const handleAutofillFromGoogleMaps = async (rawInput: string) => {
    const val = rawInput.trim();
    if (!val) {
      showFeedback("Pega primero un enlace o dirección de Google Maps.", "info");
      return;
    }

    setIsGeocodingMap(true);
    try {
      const parsed = await parseAndGeocodeLocation(val);
      setPropForm((prev) => ({
        ...prev,
        location: {
          address: parsed.address || prev.location?.address || "",
          neighborhood: parsed.neighborhood || prev.location?.neighborhood || "",
          city: parsed.city || prev.location?.city || "",
          zone: parsed.zone || prev.location?.zone || "",
          googleMapsUrl: parsed.googleMapsUrl || val,
        },
      }));
      showFeedback("Datos de ubicación y mapa autocompletados con éxito.", "success");
    } catch (err) {
      console.error("Error al autocompletar mapa:", err);
      showFeedback("No se pudieron extraer todos los datos automáticamente.", "error");
    } finally {
      setIsGeocodingMap(false);
    }
  };

  const googleMapsPreviewUrl = useMemo(() => {
    return getGoogleMapsEmbedUrl(propForm.location);
  }, [
    propForm.location?.googleMapsUrl,
    propForm.location?.address,
    propForm.location?.city,
    propForm.location?.neighborhood,
    propForm.location?.zone,
  ]);

  const handleImageFilesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!ensureNotPaymentLocked("Subir imágenes")) {
      e.target.value = "";
      return;
    }
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingImages(true);
    const fileList = Array.from(files);
    const uploadedUrls: string[] = [];

    for (const file of fileList) {
      try {
        const publicUrl = await uploadPropertyImage(file);
        uploadedUrls.push(publicUrl);
      } catch {
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
    if (!ensureNotPaymentLocked("Agregar imágenes")) return;
    if (!manualImageUrl.trim()) return;
    setPropForm((prev) => ({
      ...prev,
      images: [...(prev.images || []), manualImageUrl.trim()],
    }));
    setManualImageUrl("");
  };

  const handleRemoveImage = (indexToRemove: number) => {
    if (!ensureNotPaymentLocked("Eliminar imágenes")) return;
    setPropForm((prev) => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== indexToRemove),
    }));
  };

  const handleMakeCoverImage = (indexToCover: number) => {
    if (!ensureNotPaymentLocked("Organizar imágenes")) return;
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

  const handleVideoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!ensureNotPaymentLocked("Subir video tour")) {
      e.target.value = "";
      return;
    }
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

  const videoExtractRef = useRef<HTMLVideoElement>(null);
  const [isExtractingFrames, setIsExtractingFrames] = useState(false);

  // Estado para la herramienta de encuadre interactivo (Crop & Framing)
  const [framingImageIdx, setFramingImageIdx] = useState<number | null>(null);
  const [cropZoom, setCropZoom] = useState<number>(1);
  const [cropOffsetX, setCropOffsetX] = useState<number>(0);
  const [cropOffsetY, setCropOffsetY] = useState<number>(0);
  const [cropAspectRatio, setCropAspectRatio] = useState<"16:9" | "4:3" | "1:1">("16:9");
  const [isSavingCrop, setIsSavingCrop] = useState<boolean>(false);
  const [isDraggingCrop, setIsDraggingCrop] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number; startOffX: number; startOffY: number }>({
    x: 0,
    y: 0,
    startOffX: 0,
    startOffY: 0,
  });

  // Helper para convertir canvas a Blob
  const canvasToBlob = (canvas: HTMLCanvasElement, quality = 0.92): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("No se pudo generar imagen desde el canvas"));
        },
        "image/jpeg",
        quality
      );
    });
  };

  // Capturar el fotograma actual y subirlo directamente al CDN de Supabase
  const handleCaptureCurrentFrame = async (asCover = false) => {
    if (!ensureNotPaymentLocked("Capturar fotograma de video")) return;
    const video = videoExtractRef.current;
    if (!video) return;

    setIsExtractingFrames(true);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 720;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("No se pudo iniciar el canvas.");

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const blob = await canvasToBlob(canvas, 0.92);

      // Subida garantizada a Supabase Storage (evita error 413 y cuota de localStorage)
      let publicUrl: string;
      try {
        publicUrl = await uploadPropertyImage(blob);
      } catch (uploadErr) {
        console.warn("Fallo en Storage, fallback a URL local:", uploadErr);
        publicUrl = canvas.toDataURL("image/jpeg", 0.9);
      }

      setPropForm((prev) => {
        const currentImages = prev.images || [];
        if (asCover) {
          // Si es como portada, ubicar en la primera posición [0]
          return {
            ...prev,
            images: [publicUrl, ...currentImages.filter((img) => img !== publicUrl)],
          };
        } else {
          return {
            ...prev,
            images: [...currentImages, publicUrl],
          };
        }
      });

      showFeedback(
        asCover
          ? "¡Fotograma capturado y guardado como portada en la web!"
          : "¡Fotograma capturado y añadido a la galería!",
        "success"
      );
    } catch (err) {
      console.error("Error al capturar frame:", err);
      showFeedback("No se pudo capturar el fotograma actual.", "error");
    } finally {
      setIsExtractingFrames(false);
    }
  };

  // Extraer automáticamente 3 fotogramas distribuidos en el video y subirlos a la nube
  const handleAutoExtractKeyFrames = async () => {
    if (!ensureNotPaymentLocked("Extraer fotos automáticas")) return;
    const video = videoExtractRef.current;
    if (!video) return;
    setIsExtractingFrames(true);

    try {
      const duration = video.duration || 10;
      const seekPoints = [duration * 0.15, duration * 0.5, duration * 0.85];
      const originalTime = video.currentTime;
      const uploadedUrls: string[] = [];

      for (let i = 0; i < seekPoints.length; i++) {
        const time = seekPoints[i];
        video.currentTime = time;
        await new Promise((r) => setTimeout(r, 450));

        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth || 1280;
        canvas.height = video.videoHeight || 720;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          try {
            const blob = await canvasToBlob(canvas, 0.92);
            const url = await uploadPropertyImage(blob);
            uploadedUrls.push(url);
          } catch {
            uploadedUrls.push(canvas.toDataURL("image/jpeg", 0.85));
          }
        }
      }
      video.currentTime = originalTime;

      if (uploadedUrls.length > 0) {
        setPropForm((prev) => ({
          ...prev,
          images: [...(prev.images || []), ...uploadedUrls],
        }));
        showFeedback(`¡Se extrajeron y guardaron ${uploadedUrls.length} fotos del video con éxito!`, "success");
      }
    } catch (e) {
      console.error("Error al extraer fotos automáticas:", e);
      showFeedback("Error al extraer fotogramas automáticos.", "error");
    } finally {
      setIsExtractingFrames(false);
    }
  };

  // Iniciar encuadre de una imagen de la galería
  const handleStartFraming = (index: number) => {
    if (!ensureNotPaymentLocked("Encuadrar imagen")) return;
    setFramingImageIdx(index);
    setCropZoom(1);
    setCropOffsetX(0);
    setCropOffsetY(0);
    setCropAspectRatio("16:9");
  };

  // Procesar y guardar la imagen encuadrada
  const handleSaveFramedImage = async () => {
    if (framingImageIdx === null) return;
    const currentImages = propForm.images || [];
    const targetUrl = currentImages[framingImageIdx];
    if (!targetUrl) return;

    setIsSavingCrop(true);
    try {
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.src = targetUrl;

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("No se pudo cargar la imagen para encuadrar"));
      });

      // Dimensiones de salida en alta definición según relación de aspecto
      let outputW = 1600;
      let outputH = 900; // 16:9 por defecto
      if (cropAspectRatio === "4:3") {
        outputW = 1600;
        outputH = 1200;
      } else if (cropAspectRatio === "1:1") {
        outputW = 1200;
        outputH = 1200;
      }

      const canvas = document.createElement("canvas");
      canvas.width = outputW;
      canvas.height = outputH;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("No se pudo iniciar el canvas de encuadre");

      // Pintar fondo limpio
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, outputW, outputH);

      // Calcular proporción de imagen vs contenedor
      const targetAspect = outputW / outputH;
      const imgAspect = img.naturalWidth / img.naturalHeight;

      let drawW: number;
      let drawH: number;

      // Object-cover base
      if (imgAspect > targetAspect) {
        drawH = outputH * cropZoom;
        drawW = drawH * imgAspect;
      } else {
        drawW = outputW * cropZoom;
        drawH = drawW / imgAspect;
      }

      // Desplazamiento proporcional (offset en %)
      const posX = (outputW - drawW) / 2 + (cropOffsetX / 100) * outputW;
      const posY = (outputH - drawH) / 2 + (cropOffsetY / 100) * outputH;

      ctx.drawImage(img, posX, posY, drawW, drawH);

      const blob = await canvasToBlob(canvas, 0.93);
      let newPublicUrl: string;
      try {
        newPublicUrl = await uploadPropertyImage(blob);
      } catch (e) {
        console.warn("Fallo subiendo recorte a Storage:", e);
        newPublicUrl = canvas.toDataURL("image/jpeg", 0.9);
      }

      // Reemplazar imagen encuadrada en la galería
      setPropForm((prev) => {
        const nextImages = [...(prev.images || [])];
        nextImages[framingImageIdx] = newPublicUrl;
        return {
          ...prev,
          images: nextImages,
        };
      });

      showFeedback("¡Imagen encuadrada y guardada con éxito!", "success");
      setFramingImageIdx(null);
    } catch (err) {
      console.error("Error al encuadrar imagen:", err);
      showFeedback("No se pudo encuadrar la imagen. Verifica que la imagen permita acceso.", "error");
    } finally {
      setIsSavingCrop(false);
    }
  };

  // Verificación de sesión segura con el servidor al cargar
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedUsers = localStorage.getItem("aurea_admin_users");
        if (storedUsers) {
          const parsed = JSON.parse(storedUsers);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const normalized: AdminUser[] = parsed.map((u: Partial<AdminUser> & { permissions?: AdminModule[] }) => ({
              id: u.id || `user-${Date.now()}`,
              username: u.username || "usuario",
              password: u.password || "••••••••",
              name: u.name || "Usuario",
              role: (u.role as "admin" | "asesor") || "asesor",
              permissions:
                Array.isArray(u.permissions) && u.permissions.length > 0
                  ? (u.role === "admin" && u.username === "admin"
                      ? ALL_ADMIN_MODULES.map((m) => m.id)
                      : u.permissions.filter((m) => m !== "pagos" && m !== "usuarios"))
                  : u.role === "admin"
                  ? ALL_ADMIN_MODULES.map((m) => m.id)
                  : (["propiedades", "banners", "tasas", "perfil"] as AdminModule[]),
              createdAt: u.createdAt || new Date().toISOString(),
            }));

            // Asegurar que admin y 99propiedades siempre existan
            if (!normalized.some((u) => u.username.toLowerCase() === "admin")) {
              normalized.unshift(DEFAULT_USERS[0]);
            }
            if (!normalized.some((u) => u.username.toLowerCase() === "99propiedades")) {
              normalized.push(DEFAULT_USERS[1]);
            }

            setUsers(normalized);
          } else {
            setUsers(DEFAULT_USERS);
          }
        } else {
          setUsers(DEFAULT_USERS);
        }

        const checkLocalSession = () => {
          const storedLocalSession = sessionStorage.getItem("aurea_active_session_user");
          if (storedLocalSession) {
            try {
              const parsedLocal = JSON.parse(storedLocalSession);
              if (parsedLocal && parsedLocal.username) {
                setIsAuthenticated(true);
                setCurrentUser(parsedLocal);
                setProfileForm(agentProfile);
                return;
              }
            } catch {
              // ignore
            }
          }
          setIsAuthenticated(false);
          setCurrentUser(null);
        };

        fetch("/api/admin/me")
          .then((res) => {
            if (res.ok) return res.json();
            throw new Error("No autenticado");
          })
          .then((data) => {
            if (data?.authenticated && data?.user) {
              setIsAuthenticated(true);
              const isMasterAdmin = data.user.username.toLowerCase() === "admin" && data.user.role === "admin";
              const userObj: AdminUser = {
                id: isMasterAdmin ? "admin-root" : `user-${data.user.username}`,
                username: data.user.username,
                password: "••••••••",
                name: data.user.name,
                role: data.user.role,
                permissions: isMasterAdmin
                  ? ALL_ADMIN_MODULES.map((m) => m.id)
                  : ["propiedades", "banners", "tasas", "perfil"],
                createdAt: new Date().toISOString(),
              };
              setCurrentUser(userObj);
              setProfileForm(agentProfile);
            } else {
              checkLocalSession();
            }
          })
          .catch(() => {
            checkLocalSession();
          });
      } catch (err) {
        console.error("Error al cargar estado de autenticación:", err);
      }
    }
  }, [agentProfile]);

  // Módulos permitidos según los permisos del usuario activo (99propiedades no tiene acceso a pagos ni a usuarios)
  const userAllowedModules: AdminModule[] = currentUser
    ? currentUser.role === "admin" && currentUser.username === "admin"
      ? ALL_ADMIN_MODULES.map((m) => m.id)
      : (currentUser.permissions && currentUser.permissions.length > 0
          ? currentUser.permissions
          : (["propiedades", "banners", "tasas", "perfil"] as AdminModule[])
        ).filter((m) => m !== "pagos" && m !== "usuarios")
    : [];

  // Redirección automática si la pestaña activa no está permitida para el usuario
  useEffect(() => {
    if (userAllowedModules.length > 0 && !userAllowedModules.includes(activeTab)) {
      setActiveTab(userAllowedModules[0]);
    }
  }, [userAllowedModules, activeTab]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    const u = loginUsername.trim().toLowerCase();
    const p = loginPassword.trim();

    if (!u || !p) {
      setLoginError("Por favor ingresa usuario y contraseña.");
      return;
    }

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: u, password: p }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsAuthenticated(true);
        const isMasterAdmin = data.user.username.toLowerCase() === "admin" && data.user.role === "admin";
        const loggedUser: AdminUser = {
          id: isMasterAdmin ? "admin-root" : `user-${data.user.username}`,
          username: data.user.username,
          password: "••••••••",
          name: data.user.name,
          role: data.user.role,
          permissions: isMasterAdmin
            ? ALL_ADMIN_MODULES.map((m) => m.id)
            : ["propiedades", "banners", "tasas", "perfil"],
          createdAt: new Date().toISOString(),
        };
        setCurrentUser(loggedUser);
        if (typeof window !== "undefined") {
          sessionStorage.setItem("aurea_active_session_user", JSON.stringify(loggedUser));
        }
        setLoginError("");
        setLoginPassword("");
        setProfileForm(agentProfile);
        showFeedback(`Bienvenido al panel, ${data.user.name}.`, "success");
      } else {
        // Fallback: verificación directa de admin y Tomas2812
        if (u === "admin" && (p === "Tomas2812" || p === "TOMAS2812")) {
          setIsAuthenticated(true);
          const rootUser: AdminUser = {
            id: "admin-root",
            username: "admin",
            password: "••••••••",
            name: "Administrador",
            role: "admin",
            permissions: ALL_ADMIN_MODULES.map((m) => m.id),
            createdAt: new Date().toISOString(),
          };
          setCurrentUser(rootUser);
          if (typeof window !== "undefined") {
            sessionStorage.setItem("aurea_active_session_user", JSON.stringify(rootUser));
          }
          setLoginError("");
          setLoginPassword("");
          setProfileForm(agentProfile);
          showFeedback("Bienvenido al panel, Administrador.", "success");
          return;
        }

        // Fallback: verificación directa de 99propiedades y 123456
        if (u === "99propiedades" && p === "123456") {
          setIsAuthenticated(true);
          const clientUser: AdminUser = {
            id: "user-99propiedades",
            username: "99propiedades",
            password: "••••••••",
            name: "99 Propiedades",
            role: "asesor",
            permissions: ["propiedades", "banners", "tasas", "perfil"],
            createdAt: new Date().toISOString(),
          };
          setCurrentUser(clientUser);
          if (typeof window !== "undefined") {
            sessionStorage.setItem("aurea_active_session_user", JSON.stringify(clientUser));
          }
          setLoginError("");
          setLoginPassword("");
          setProfileForm(agentProfile);
          showFeedback("Bienvenido al panel, 99 Propiedades.", "success");
          return;
        }

        // Fallback: verificar si es un usuario creado localmente
        const matchedLocalUser = users.find(
          (user) => user.username.toLowerCase() === u && user.password === p
        );

        if (matchedLocalUser) {
          setIsAuthenticated(true);
          setCurrentUser(matchedLocalUser);
          if (typeof window !== "undefined") {
            sessionStorage.setItem("aurea_active_session_user", JSON.stringify(matchedLocalUser));
          }
          setLoginError("");
          setLoginPassword("");
          setProfileForm(agentProfile);
          showFeedback(`Bienvenido al panel, ${matchedLocalUser.name}.`, "success");
          return;
        }

        setLoginError(data.error || "Usuario o contraseña incorrectos.");
      }
    } catch {
      if (u === "admin" && (p === "Tomas2812" || p === "TOMAS2812")) {
        setIsAuthenticated(true);
        const rootUser: AdminUser = {
          id: "admin-root",
          username: "admin",
          password: "••••••••",
          name: "Administrador",
          role: "admin",
          permissions: ALL_ADMIN_MODULES.map((m) => m.id),
          createdAt: new Date().toISOString(),
        };
        setCurrentUser(rootUser);
        if (typeof window !== "undefined") {
          sessionStorage.setItem("aurea_active_session_user", JSON.stringify(rootUser));
        }
        setLoginError("");
        setLoginPassword("");
        setProfileForm(agentProfile);
        showFeedback("Bienvenido al panel, Administrador.", "success");
        return;
      }

      if (u === "99propiedades" && p === "123456") {
        setIsAuthenticated(true);
        const clientUser: AdminUser = {
          id: "user-99propiedades",
          username: "99propiedades",
          password: "••••••••",
          name: "99 Propiedades",
          role: "asesor",
          permissions: ["propiedades", "banners", "tasas", "perfil"],
          createdAt: new Date().toISOString(),
        };
        setCurrentUser(clientUser);
        if (typeof window !== "undefined") {
          sessionStorage.setItem("aurea_active_session_user", JSON.stringify(clientUser));
        }
        setLoginError("");
        setLoginPassword("");
        setProfileForm(agentProfile);
        showFeedback("Bienvenido al panel, 99 Propiedades.", "success");
        return;
      }

      const matchedLocalUser = users.find(
        (user) => user.username.toLowerCase() === u && user.password === p
      );
      if (matchedLocalUser) {
        setIsAuthenticated(true);
        setCurrentUser(matchedLocalUser);
        if (typeof window !== "undefined") {
          sessionStorage.setItem("aurea_active_session_user", JSON.stringify(matchedLocalUser));
        }
        setLoginError("");
        setLoginPassword("");
        setProfileForm(agentProfile);
        showFeedback(`Bienvenido al panel, ${matchedLocalUser.name}.`, "success");
        return;
      }
      setLoginError("Error de conexión con el servidor.");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch {
      // ignore
    }
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("aurea_active_session_user");
    }
    setIsAuthenticated(false);
    setCurrentUser(null);
    showFeedback("Sesión cerrada.", "info");
  };

  // Cambio de contraseña del usuario activo
  const handleChangeOwnPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    if (!currentPasswordInput) {
      showFeedback("Ingresa tu contraseña actual.", "error");
      return;
    }

    const isCurrentValid =
      currentPasswordInput === currentUser.password ||
      (currentUser.username.toLowerCase() === "admin" &&
        currentUser.password === "admin" &&
        (currentPasswordInput === "99propiedades" || currentPasswordInput === "aurea2026"));

    if (!isCurrentValid) {
      showFeedback("La contraseña actual es incorrecta.", "error");
      return;
    }

    if (newPasswordInput.length < 4) {
      showFeedback("La nueva contraseña debe tener al menos 4 caracteres.", "error");
      return;
    }

    if (newPasswordInput !== confirmPasswordInput) {
      showFeedback("Las nuevas contraseñas no coinciden.", "error");
      return;
    }

    const updatedUser: AdminUser = {
      ...currentUser,
      password: "••••••••",
    };

    const updatedUsers = users.map((u) => (u.id === currentUser.id ? updatedUser : u));

    setUsers(updatedUsers);
    setCurrentUser(updatedUser);
    if (typeof window !== "undefined") {
      localStorage.setItem("aurea_admin_users", JSON.stringify(updatedUsers));
      sessionStorage.setItem("aurea_active_session_user", JSON.stringify(updatedUser));
    }

    setCurrentPasswordInput("");
    setNewPasswordInput("");
    setConfirmPasswordInput("");
    showFeedback("Tu contraseña se ha cambiado exitosamente.", "success");
  };

  // Crear nuevo usuario
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUsername = newUserUsername.trim().toLowerCase().replace(/\s+/g, "");

    if (!cleanUsername || !newUserPassword.trim() || !newUserName.trim()) {
      showFeedback("Por favor completa nombre, usuario y contraseña.", "error");
      return;
    }

    if (cleanUsername.length < 3) {
      showFeedback("El nombre de usuario debe tener al menos 3 caracteres.", "error");
      return;
    }

    if (newUserPassword.trim().length < 4) {
      showFeedback("La contraseña debe tener al menos 4 caracteres.", "error");
      return;
    }

    if (newUserPermissions.length === 0) {
      showFeedback("Debes seleccionar al menos un apartado para este usuario.", "error");
      return;
    }

    if (users.some((u) => u.username.toLowerCase() === cleanUsername)) {
      showFeedback(`El usuario "${cleanUsername}" ya existe. Elige otro.`, "error");
      return;
    }

    const newUser: AdminUser = {
      id: `user-${Date.now()}`,
      username: cleanUsername,
      password: newUserPassword.trim(),
      name: newUserName.trim(),
      role: newUserRole,
      permissions: [...newUserPermissions],
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    if (typeof window !== "undefined") {
      localStorage.setItem("aurea_admin_users", JSON.stringify(updatedUsers));
    }

    setNewUserName("");
    setNewUserUsername("");
    setNewUserPassword("");
    setNewUserRole("asesor");
    setNewUserPermissions(ALL_ADMIN_MODULES.map((m) => m.id));
    showFeedback(`Usuario "${newUser.name}" creado con éxito.`, "success");
  };

  // Eliminar usuario
  const handleDeleteUser = (userId: string) => {
    if (currentUser?.id === userId) {
      showFeedback("No puedes eliminar la cuenta con la que tienes sesión abierta.", "error");
      return;
    }

    const target = users.find((u) => u.id === userId);
    if (!target) return;

    if (target.username.toLowerCase() === "admin" || target.username.toLowerCase() === "99propiedades") {
      showFeedback("No se pueden eliminar las cuentas base del sistema (admin y 99propiedades).", "error");
      return;
    }

    if (!confirm(`¿Eliminar al usuario "${target.name}" (@${target.username})?`)) {
      return;
    }

    const updatedUsers = users.filter((u) => u.id !== userId);
    setUsers(updatedUsers);
    if (typeof window !== "undefined") {
      localStorage.setItem("aurea_admin_users", JSON.stringify(updatedUsers));
    }
    showFeedback(`Usuario "${target.name}" eliminado.`, "info");
  };

  // Actualizar contraseña de otro usuario
  const handleUpdateOtherUserPassword = (userId: string) => {
    if (!tempUserPassword.trim() || tempUserPassword.trim().length < 4) {
      showFeedback("La contraseña debe tener al menos 4 caracteres.", "error");
      return;
    }

    const updatedUsers = users.map((u) => (u.id === userId ? { ...u, password: tempUserPassword.trim() } : u));
    setUsers(updatedUsers);
    if (typeof window !== "undefined") {
      localStorage.setItem("aurea_admin_users", JSON.stringify(updatedUsers));
    }
    setEditingPasswordUserId(null);
    setTempUserPassword("");
    showFeedback("Contraseña actualizada con éxito.", "success");
  };

  // ------------------ GESTIÓN DE PROPIEDADES ------------------
  const startEditProperty = (prop: Property) => {
    if (!ensureNotPaymentLocked("La edición de propiedades")) return;
    setEditingPropId(prop.id);
    setPropForm({
      ...prop,
      currency: prop.currency || "USD",
    });
    setIsCreatingProp(false);
  };

  const startCreateProperty = () => {
    if (!ensureNotPaymentLocked("El alta de nuevas propiedades")) return;
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
    if (!ensureNotPaymentLocked("Guardar propiedades")) return;
    if (!propForm.title || !propForm.price) {
      alert("Por favor completa al menos título y precio.");
      return;
    }

    const slugBase = (propForm.title || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const generatedSlug = propForm.slug?.trim() || `${slugBase || "prop"}-${Date.now().toString(36)}`;

    const safeLocation = {
      city: propForm.location?.city || "CABA",
      neighborhood: propForm.location?.neighborhood || "Palermo",
      address: propForm.location?.address || "",
      zone: propForm.location?.zone || "Capital Federal",
    };

    const safeFeatures = {
      bedrooms: Number(propForm.features?.bedrooms ?? 1),
      bathrooms: Number(propForm.features?.bathrooms ?? 1),
      parkingSpaces: Number(propForm.features?.parkingSpaces ?? 0),
      totalArea: Number(propForm.features?.totalArea ?? 50),
      coveredArea: Number(propForm.features?.coveredArea ?? 45),
      yearBuilt: Number(propForm.features?.yearBuilt ?? new Date().getFullYear()),
      expenses: Number(propForm.features?.expenses ?? 0),
    };

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
    };

    if (isCreatingProp) {
      addProperty(finalForm as Omit<Property, "id" | "createdAt">);
      setIsCreatingProp(false);
      showFeedback(`Propiedad "${finalForm.title}" creada y guardada con éxito.`, "success");
    } else if (editingPropId) {
      updateProperty(editingPropId, finalForm);
      setEditingPropId(null);
      showFeedback(`Propiedad "${finalForm.title}" actualizada con éxito.`, "success");
    }
  };

  // ------------------ GESTIÓN DE BANNERS ------------------
  const startEditBanner = (banner: FeaturedBanner) => {
    if (!ensureNotPaymentLocked("La edición de banners")) return;
    setEditingBannerId(banner.id);
    setBannerForm({ ...banner });
    setIsCreatingBanner(false);
  };

  const startCreateBanner = () => {
    if (!ensureNotPaymentLocked("El alta de banners")) return;
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
    if (!ensureNotPaymentLocked("Guardar banners")) return;
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
    if (!ensureNotPaymentLocked("La edición de tasas bancarias")) return;
    setEditingBankId(bank.id);
    setBankForm({ ...bank });
    setIsCreatingBank(false);
  };

  const startCreateBank = () => {
    if (!ensureNotPaymentLocked("El alta de tasas bancarias")) return;
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
    if (!ensureNotPaymentLocked("Guardar tasas bancarias")) return;
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
    if (!ensureNotPaymentLocked("Guardar perfil")) return;
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
              Panel Privado 99 Propiedades
            </h1>
            <p className="text-xs text-neutral-500">
              Acceso exclusivo de gestión inmobiliaria
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                Usuario
              </label>
              <input
                type="text"
                placeholder="Ingresa tu usuario..."
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                className="w-full p-3 bg-stone-50 border border-neutral-300 rounded-sm focus:border-gold-500 focus:outline-none text-sm"
                autoFocus
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                placeholder="Ingresa tu contraseña..."
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full p-3 bg-stone-50 border border-neutral-300 rounded-sm focus:border-gold-500 focus:outline-none text-sm"
                required
              />
            </div>

            {loginError && (
              <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-sm border border-rose-200">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-gold-500 hover:bg-gold-600 text-luxury-black font-semibold uppercase tracking-wider py-3 rounded-sm transition-colors shadow-sm btn-tactile cursor-pointer mt-2"
            >
              Iniciar Sesión
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
          <span className="text-xs bg-gold-50 text-gold-800 border border-gold-200 px-2.5 py-1 rounded font-medium">
            Portal Privado /99propiedades
          </span>
        </div>

        <div className="flex items-center gap-3">

          {currentUser && (
            <button
              onClick={() => setActiveTab("usuarios")}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 rounded-sm text-xs text-neutral-800 transition-colors cursor-pointer"
              title="Click para ver usuarios o cambiar tu contraseña"
            >
              <UserCheck className="w-3.5 h-3.5 text-gold-600" />
              <span>
                {currentUser.name} <strong className="text-neutral-500 font-normal">(@{currentUser.username})</strong>
              </span>
            </button>
          )}

          <button
            onClick={handleLogout}
            className="text-xs text-neutral-600 hover:text-neutral-900 px-3 py-2 border border-neutral-300 rounded-sm hover:bg-neutral-100 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Unlock className="w-3.5 h-3.5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* CARTEL DE RENOVACIÓN DE PAGO (SOLO EN APARTADO ADMINISTRADORES) */}
      {/* ============================================================== */}
      {isPaymentLocked ? (
        <div className="p-5 sm:p-6 rounded-lg border-2 border-red-500 bg-gradient-to-r from-red-950 via-neutral-900 to-red-950 text-white shadow-2xl relative overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="absolute top-0 right-0 w-72 h-72 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
            <div className="flex items-start gap-4">
              <div className="p-3.5 bg-red-600/90 text-white rounded-xl shadow-lg shadow-red-600/30 shrink-0 ring-4 ring-red-500/20 animate-pulse">
                <AlertTriangle className="w-7 h-7 text-white" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider bg-red-600 text-white rounded-md shadow-sm">
                    RENOVAR PAGO DEL MES
                  </span>
                  <span className="text-xs font-semibold text-red-200 bg-red-900/60 px-2 py-0.5 rounded border border-red-700/50">
                    Vencimiento: 10 de {paymentLockStatus.pendingMonthName} de {paymentLockStatus.pendingYear}
                  </span>
                  <span className="text-[11px] text-amber-300 font-semibold flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Modificaciones bloqueadas
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  ¡Atención! Debe renovar el pago del mes de {paymentLockStatus.pendingMonthName} {paymentLockStatus.pendingYear}
                </h2>
                <p className="text-xs sm:text-sm text-red-100 max-w-3xl leading-relaxed">
                  {currentUser?.role === "admin" && currentUser?.username === "admin" ? (
                    <>
                      El período de renovación venció el <strong className="text-white underline font-bold">10 de {paymentLockStatus.pendingMonthName}</strong> y no se encuentra registrado como pagado. Como administrador, puedes certificar la acreditación del pago para reactivar las facultades de modificación del usuario 99propiedades.
                    </>
                  ) : (
                    <>
                      El servicio de la página web registra el pago del mes de <strong className="text-white font-bold">{paymentLockStatus.pendingMonthName} {paymentLockStatus.pendingYear}</strong> como pendiente. El panel se encuentra en <strong className="text-white">modo solo lectura</strong>: las altas, modificaciones y bajas están suspendidas hasta que el administrador verifique y acredite el pago.
                    </>
                  )}
                </p>
              </div>
            </div>

            {currentUser?.role === "admin" && currentUser?.username === "admin" ? (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    const pendingMonthNum = MONTH_NAMES_ES.indexOf(paymentLockStatus.pendingMonthName) + 1;
                    handleTogglePayment(paymentLockStatus.pendingYear, pendingMonthNum, true);
                  }}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Marcar como Pagado Ahora</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("pagos")}
                  className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CalendarDays className="w-4 h-4 text-gold-400" />
                  <span>Ver Calendario de Pagos</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5 px-4 py-3 bg-red-950/80 border border-red-700/60 rounded-md text-xs text-red-200 shrink-0">
                <Shield className="w-4 h-4 text-amber-300 shrink-0" />
                <span>Contacte a la administración para validar el comprobante de pago.</span>
              </div>
            )}
          </div>
        </div>
      ) : paymentLockStatus.isApproachingDue ? (
        <div className="p-3.5 sm:p-4 rounded-md border border-amber-300 bg-amber-50 text-neutral-900 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-amber-600 shrink-0" />
            <div className="text-xs sm:text-sm">
              <span className="font-bold text-amber-900">Recordatorio de renovación:</span> El pago del mes de{" "}
              <strong>{paymentLockStatus.pendingMonthName}</strong> vence el{" "}
              <strong>{paymentLockStatus.dueDateStr}</strong> (faltan {paymentLockStatus.daysUntilDue} días).
            </div>
          </div>
          {currentUser?.role === "admin" && currentUser?.username === "admin" && (
            <button
              type="button"
              onClick={() => setActiveTab("pagos")}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded transition-colors self-start sm:self-auto cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>Gestionar Pago</span>
            </button>
          )}
        </div>
      ) : null}

      {/* Tabs de Navegación del CMS con control de permisos */}
      <div className="flex flex-wrap gap-2 border-b border-neutral-200 pb-2 text-xs">
        {userAllowedModules.includes("propiedades") && (
          <button
            onClick={() => setActiveTab("propiedades")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-sm font-semibold transition-colors cursor-pointer ${
              activeTab === "propiedades"
                ? "bg-neutral-900 text-white"
                : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Propiedades ({properties.length})</span>
          </button>
        )}

        {userAllowedModules.includes("banners") && (
          <button
            onClick={() => setActiveTab("banners")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-sm font-semibold transition-colors cursor-pointer ${
              activeTab === "banners"
                ? "bg-neutral-900 text-white"
                : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Banners Destacados ({banners.length})</span>
          </button>
        )}

        {userAllowedModules.includes("tasas") && (
          <button
            onClick={() => setActiveTab("tasas")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-sm font-semibold transition-colors cursor-pointer ${
              activeTab === "tasas"
                ? "bg-neutral-900 text-white"
                : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
            }`}
          >
            <Percent className="w-4 h-4" />
            <span>Tasas Bancarias ({bankRates.length})</span>
          </button>
        )}

        {userAllowedModules.includes("perfil") && (
          <button
            onClick={() => setActiveTab("perfil")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-sm font-semibold transition-colors cursor-pointer ${
              activeTab === "perfil"
                ? "bg-neutral-900 text-white"
                : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Perfil & Marca Personal</span>
          </button>
        )}

        {userAllowedModules.includes("usuarios") && (
          <button
            onClick={() => setActiveTab("usuarios")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-sm font-semibold transition-colors cursor-pointer ${
              activeTab === "usuarios"
                ? "bg-neutral-900 text-white"
                : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Usuarios & Seguridad ({users.length})</span>
          </button>
        )}

        {userAllowedModules.includes("pagos") && (
          <button
            onClick={() => setActiveTab("pagos")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-sm font-semibold transition-colors cursor-pointer relative ${
              activeTab === "pagos"
                ? "bg-neutral-900 text-white"
                : isPaymentLocked
                ? "bg-red-50 text-red-700 hover:bg-red-100 border border-red-300 font-bold"
                : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
            }`}
          >
            <CalendarCheck className={`w-4 h-4 ${isPaymentLocked ? "text-red-600 animate-pulse" : "text-gold-500"}`} />
            <span>Control de Pagos</span>
            {isPaymentLocked && (
              <span className="px-1.5 py-0.2 bg-red-600 text-white text-[10px] rounded-full font-bold">
                10 Vencido
              </span>
            )}
          </button>
        )}
      </div>

      {/* CONTENIDO DEL TAB 1: PROPIEDADES */}
      {activeTab === "propiedades" && (
        <div className="space-y-6">
          {/* Panel de Control de Visibilidad de Propiedades Vendidas */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-amber-50/60 border border-amber-200/90 rounded-sm">
            <div className="flex items-start gap-3">
              {hideSoldProperties ? (
                <EyeOff className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              ) : (
                <Eye className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              )}
              <div>
                <span className="font-bold text-neutral-900 text-xs sm:text-sm block">
                  Visibilidad de Propiedades Vendidas en la Web Pública
                </span>
                <p className="text-xs text-neutral-600 mt-0.5">
                  {hideSoldProperties ? (
                    <span className="text-amber-800 font-medium">
                      🔒 Actualmente las casas marcadas como <strong>VENDIDO</strong> están <strong>OCULTAS</strong> en la página web pública.
                    </span>
                  ) : (
                    <span className="text-emerald-800 font-medium">
                      👁️ Actualmente las casas marcadas como <strong>VENDIDO</strong> están <strong>VISIBLES</strong> con su distintivo en la web pública.
                    </span>
                  )}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                const next = !hideSoldProperties;
                setHideSoldProperties(next);
                showFeedback(
                  next
                    ? "Propiedades vendidas ahora están OCULTAS en la web pública."
                    : "Propiedades vendidas ahora son VISIBLES en la web pública.",
                  "info"
                );
              }}
              className={`px-4 py-2.5 text-xs font-semibold rounded-sm transition-all flex items-center gap-2 cursor-pointer shrink-0 shadow-sm ${
                hideSoldProperties
                  ? "bg-neutral-900 text-gold-400 border border-gold-500/50 hover:bg-neutral-800"
                  : "bg-white text-neutral-800 border border-neutral-300 hover:bg-neutral-100"
              }`}
            >
              {hideSoldProperties ? (
                <>
                  <EyeOff className="w-4 h-4 text-gold-400" />
                  <span>Ocultas en Web (Click para Mostrar)</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 text-neutral-500" />
                  <span>Visibles en Web (Click para Ocultar)</span>
                </>
              )}
            </button>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-serif text-lg font-bold text-neutral-900">
                Catálogo de Propiedades
              </h2>
              <p className="text-xs text-neutral-500">
                Cambiá el estado (disponible, reservado, vendido) directamente desde la tabla con 1 click.
              </p>
            </div>
            <button
              onClick={startCreateProperty}
              className={`text-xs font-semibold uppercase tracking-wider px-4 py-2.5 rounded-sm transition-colors flex items-center gap-2 shadow-sm cursor-pointer ${
                isActionBlocked
                  ? "bg-stone-300 text-neutral-600 hover:bg-stone-400"
                  : "bg-gold-500 hover:bg-gold-600 text-luxury-black"
              }`}
              title={isActionBlocked ? "Bloqueado por pago pendiente" : "Crear nueva propiedad"}
            >
              {isActionBlocked ? <Lock className="w-4 h-4 text-neutral-700" /> : <Plus className="w-4 h-4" />}
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
                  className="text-neutral-400 hover:text-neutral-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
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
                  <label className="block font-semibold text-neutral-700 mb-1">Moneda *</label>
                  <select
                    value={propForm.currency || "USD"}
                    onChange={(e) => setPropForm({ ...propForm, currency: e.target.value as "USD" | "ARS" })}
                    className="w-full p-2.5 bg-stone-50 border border-neutral-300 rounded-sm focus:border-gold-500 focus:outline-none font-semibold"
                  >
                    <option value="USD">USD (Dólares)</option>
                    <option value="ARS">ARS ($ Pesos Argentinos)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Precio ({propForm.currency === "ARS" ? "ARS $" : "USD"}) *
                  </label>
                  <input
                    type="number"
                    value={propForm.price || 0}
                    onChange={(e) => setPropForm({ ...propForm, price: Number(e.target.value) })}
                    className="w-full p-2.5 bg-stone-50 border border-neutral-300 rounded-sm focus:border-gold-500 focus:outline-none font-bold"
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
                  <label className="block font-semibold text-neutral-700 mb-1">Estado de la Propiedad</label>
                  <select
                    value={propForm.status || "disponible"}
                    onChange={(e) => setPropForm({ ...propForm, status: e.target.value as PropertyStatus })}
                    className="w-full p-2.5 bg-stone-50 border border-neutral-300 rounded-sm focus:border-gold-500 focus:outline-none font-semibold"
                  >
                    <option value="disponible">🟢 Disponible</option>
                    <option value="oportunidad">⭐ Oportunidad</option>
                    <option value="reservado">🟡 Reservado</option>
                    <option value="vendido">🔴 Vendido</option>
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

              {/* Integración y Autocompletado de Google Maps */}
              <div className="bg-stone-50 border border-neutral-300 p-4 rounded-sm space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gold-600 shrink-0" />
                    <div>
                      <span className="font-semibold text-neutral-900 text-xs block">
                        Ubicación y Google Maps (Pegá dirección o link)
                      </span>
                      <p className="text-[11px] text-neutral-500">
                        Pegá un enlace de Google Maps (maps.app.goo.gl, etc.), código iframe o la dirección. Al presionar <strong>Autocompletar</strong> se rellenarán automáticamente barrio, ciudad, dirección y zona.
                      </p>
                    </div>
                  </div>
                  {isGeocodingMap && (
                    <span className="flex items-center gap-1.5 text-[11px] text-gold-700 bg-gold-100 px-2.5 py-1 rounded font-medium animate-pulse self-start sm:self-auto">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Autocompletando datos...</span>
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={propForm.location?.googleMapsUrl || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      setPropForm((prev) => ({
                        ...prev,
                        location: { ...prev.location!, googleMapsUrl: val },
                      }));
                    }}
                    onPaste={(e) => {
                      const pasted = e.clipboardData.getData("text");
                      if (pasted) {
                        handleAutofillFromGoogleMaps(pasted);
                      }
                    }}
                    placeholder="Pegá link de Google Maps (maps.app.goo.gl...), iframe o dirección..."
                    className="flex-1 p-2.5 bg-white border border-neutral-300 rounded-sm focus:border-gold-500 focus:outline-none text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => handleAutofillFromGoogleMaps(propForm.location?.googleMapsUrl || "")}
                    disabled={isGeocodingMap}
                    className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 active:scale-95 text-white font-semibold rounded-sm transition-all text-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0 disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                    <span>Autocompletar Datos</span>
                  </button>
                </div>

                {/* Vista previa en tiempo real del Mapa interactivo */}
                {googleMapsPreviewUrl ? (
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-[11px] text-neutral-500">
                      <span className="font-medium text-emerald-700 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Mapa de Google Maps listo para mostrarse
                      </span>
                      <a
                        href={getGoogleMapsExternalLink(propForm.location)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gold-700 hover:underline flex items-center gap-1 font-medium"
                      >
                        <ExternalLink className="w-3 h-3" /> Abrir en Google Maps
                      </a>
                    </div>
                    <div className="w-full h-48 sm:h-56 rounded border border-neutral-300 overflow-hidden bg-stone-200">
                      <iframe
                        src={googleMapsPreviewUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Vista previa de Google Maps"
                        className="w-full h-full"
                      />
                    </div>
                  </div>
                ) : null}
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
                  <label className="block font-semibold text-neutral-700 mb-1">Ciudad</label>
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
                  <label className="block font-semibold text-neutral-700 mb-1">Dirección</label>
                  <input
                    type="text"
                    value={propForm.location?.address || ""}
                    onChange={(e) =>
                      setPropForm({
                        ...propForm,
                        location: { ...propForm.location!, address: e.target.value },
                      })
                    }
                    className="w-full p-2.5 bg-stone-50 border border-neutral-300 rounded-sm focus:border-gold-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Zona</label>
                  <input
                    type="text"
                    value={propForm.location?.zone || ""}
                    onChange={(e) =>
                      setPropForm({
                        ...propForm,
                        location: { ...propForm.location!, zone: e.target.value },
                      })
                    }
                    className="w-full p-2.5 bg-stone-50 border border-neutral-300 rounded-sm focus:border-gold-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
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
                  <label className="block font-semibold text-neutral-700 mb-1">Baños</label>
                  <input
                    type="number"
                    value={propForm.features?.bathrooms || 0}
                    onChange={(e) =>
                      setPropForm({
                        ...propForm,
                        features: { ...propForm.features!, bathrooms: Number(e.target.value) },
                      })
                    }
                    className="w-full p-2.5 bg-stone-50 border border-neutral-300 rounded-sm focus:border-gold-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Cocheras</label>
                  <input
                    type="number"
                    value={propForm.features?.parkingSpaces || 0}
                    onChange={(e) =>
                      setPropForm({
                        ...propForm,
                        features: { ...propForm.features!, parkingSpaces: Number(e.target.value) },
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

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Sup. Cubierta (m²)</label>
                  <input
                    type="number"
                    value={propForm.features?.coveredArea || 0}
                    onChange={(e) =>
                      setPropForm({
                        ...propForm,
                        features: { ...propForm.features!, coveredArea: Number(e.target.value) },
                      })
                    }
                    className="w-full p-2.5 bg-stone-50 border border-neutral-300 rounded-sm focus:border-gold-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Zona de Subida y Gestión de Múltiples Imágenes */}
              <div className="space-y-3 pt-2 border-t border-neutral-200">
                <div className="flex items-center justify-between">
                  <label className="block font-semibold text-neutral-700">
                    Galería de Fotos de la Propiedad (Múltiples fotos soportadas)
                  </label>
                  <span className="text-[11px] text-neutral-500">
                    {propForm.images?.length || 0} fotos cargadas · La 1ª foto es la portada principal
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                  <label className="flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold px-4 py-2.5 rounded-sm cursor-pointer transition-colors shrink-0">
                    <Upload className="w-4 h-4 text-gold-400" />
                    <span>{isUploadingImages ? "Subiendo imágenes..." : "Subir Fotos desde tu PC"}</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageFilesUpload}
                      disabled={isUploadingImages}
                      className="hidden"
                    />
                  </label>

                  <div className="flex gap-2 flex-1">
                    <input
                      type="text"
                      placeholder="O pegar URL directa de imagen (https://...)"
                      value={manualImageUrl}
                      onChange={(e) => setManualImageUrl(e.target.value)}
                      className="flex-1 p-2 bg-stone-50 border border-neutral-300 rounded-sm focus:border-gold-500 focus:outline-none text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddManualUrl}
                      className="bg-neutral-200 hover:bg-neutral-300 text-neutral-800 px-3 py-2 rounded-sm font-semibold transition-colors cursor-pointer"
                    >
                      Añadir URL
                    </button>
                  </div>
                </div>

                {propForm.images && propForm.images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2">
                    {propForm.images.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className={`relative rounded-sm overflow-hidden border-2 group aspect-video bg-neutral-100 ${
                          idx === 0 ? "border-gold-500 ring-2 ring-gold-400/40" : "border-neutral-200"
                        }`}
                      >
                        <Image
                          src={imgUrl || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"}
                          alt={`Foto ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                        {idx === 0 && (
                          <span className="absolute top-1 left-1 bg-gold-500 text-luxury-black text-[9px] font-bold px-1.5 py-0.5 rounded-xs shadow-xs z-10">
                            PORTADA
                          </span>
                        )}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 z-20 px-1">
                          <button
                            type="button"
                            onClick={() => handleStartFraming(idx)}
                            className="p-1.5 bg-neutral-900/90 hover:bg-black text-gold-400 border border-gold-500/40 rounded text-[10px] font-bold cursor-pointer flex items-center gap-1 shadow-xs"
                            title="Encuadrar y ajustar imagen (Zoom, Recorte y Posición)"
                          >
                            <Crop className="w-3 h-3" />
                            <span>Encuadrar</span>
                          </button>
                          {idx !== 0 && (
                            <button
                              type="button"
                              onClick={() => handleMakeCoverImage(idx)}
                              className="p-1.5 bg-gold-500 hover:bg-gold-600 text-luxury-black rounded text-[10px] font-bold cursor-pointer shadow-xs"
                              title="Hacer foto de portada"
                            >
                              Portada
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded cursor-pointer"
                            title="Eliminar foto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Zona de Video Tour */}
              <div className="p-4 bg-sky-50/50 border border-sky-200/80 rounded-sm space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sky-200/60 pb-2">
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-sky-600" />
                    <label className="block font-bold text-neutral-900 text-sm">
                      Video Tour de la Propiedad (Prioridad en la experiencia)
                    </label>
                  </div>
                  <span className="text-[10px] text-sky-800 font-mono bg-sky-100/70 border border-sky-200 px-2 py-0.5 rounded-sm">
                    Compresión automática en MP4 HD
                  </span>
                </div>

                <label
                  className={`flex flex-col items-center justify-center w-full border-2 border-dashed rounded-sm p-4 text-center cursor-pointer transition-colors ${
                    isUploadingVideo
                      ? "border-sky-400 bg-sky-50 cursor-not-allowed"
                      : "border-sky-200 hover:border-sky-400 bg-sky-50/20 hover:bg-sky-50/50 group"
                  }`}
                >
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoFileUpload}
                    disabled={isUploadingVideo}
                    className="hidden"
                  />
                  {isUploadingVideo ? (
                    <div className="w-full space-y-2">
                      <div className="flex items-center justify-center gap-2 text-sky-700">
                        <Loader2 className="w-4 h-4 animate-spin text-sky-600" />
                        <span className="text-xs font-semibold">{videoStatus}</span>
                      </div>
                      <div className="w-full bg-sky-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-sky-600 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${videoProgress}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex items-center justify-center gap-2 text-neutral-700 group-hover:text-sky-800">
                        <Upload className="w-4 h-4 text-sky-600" />
                        <span className="font-semibold text-xs">
                          {propForm.videoUrl ? "Reemplazar video tour actual" : "Seleccionar archivo de video (.mp4, .mov, etc.)"}
                        </span>
                      </div>
                      <span className="block text-[10px] text-neutral-500">
                        Se optimizará para reproducción fluida en móviles y web
                      </span>
                    </div>
                  )}
                </label>

                {propForm.videoUrl && (
                  <div className="p-3 bg-white border border-sky-200 rounded-sm space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 font-medium text-sky-900 truncate">
                        <Film className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                        <span className="truncate max-w-sm font-mono text-[11px]">{propForm.videoUrl}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPropForm({ ...propForm, videoUrl: "", hasVideoTour: false })}
                        className="text-rose-500 hover:text-rose-700 shrink-0 cursor-pointer flex items-center gap-1 text-[11px] px-2 py-0.5 rounded hover:bg-rose-50"
                        title="Quitar video"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Quitar</span>
                      </button>
                    </div>

                    {/* Previsualizador de Video y Extractor de Fotos */}
                    <div className="bg-neutral-950 rounded-sm overflow-hidden flex flex-col items-center p-2">
                      <video
                        ref={videoExtractRef}
                        src={propForm.videoUrl}
                        controls
                        playsInline
                        crossOrigin="anonymous"
                        className="max-h-48 w-full object-contain rounded bg-black"
                      />
                    </div>

                    <div className="bg-sky-50/70 border border-sky-100 rounded-sm p-2.5">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <p className="text-xs font-semibold text-sky-950 flex items-center gap-1.5">
                            <Camera className="w-3.5 h-3.5 text-sky-600" />
                            Generar fotos y portadas a partir del video
                          </p>
                          <p className="text-[11px] text-sky-700 mt-0.5">
                            Pausa el video en el mejor momento y establécelo como portada o agrégalo a las fotos de la propiedad.
                          </p>
                        </div>
                        {(!propForm.images || propForm.images.length === 0) && (
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded shrink-0">
                            Sin fotos aún
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handleCaptureCurrentFrame(true)}
                          disabled={isExtractingFrames}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-gold-500 hover:bg-gold-600 text-luxury-black rounded text-xs font-bold cursor-pointer shadow-sm active:scale-95 transition-all disabled:opacity-50"
                          title="Captura el cuadro actual y lo ubica como la foto principal del inmueble"
                        >
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>{isExtractingFrames ? "Guardando..." : "Capturar como Portada"}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCaptureCurrentFrame(false)}
                          disabled={isExtractingFrames}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded text-xs font-medium cursor-pointer shadow-sm active:scale-95 transition-all disabled:opacity-50"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          <span>{isExtractingFrames ? "Guardando..." : "Capturar cuadro (Galería)"}</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleAutoExtractKeyFrames}
                          disabled={isExtractingFrames}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-sky-300 hover:bg-sky-50 text-sky-900 rounded text-xs font-medium cursor-pointer shadow-sm active:scale-95 transition-all disabled:opacity-50"
                        >
                          <Film className="w-3.5 h-3.5 text-sky-600" />
                          <span>{isExtractingFrames ? "Extrayendo..." : "Extraer 3 fotos automáticas"}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

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
                  className="px-4 py-2 border border-neutral-300 rounded-sm hover:bg-neutral-100 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={saveProperty}
                  className="bg-neutral-900 text-white font-semibold px-6 py-2 rounded-sm hover:bg-neutral-800 flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Propiedad</span>
                </button>
              </div>
            </div>
          )}

          {/* Modal de Encuadre Interactivo de Portadas y Fotos */}
          {framingImageIdx !== null && propForm.images && propForm.images[framingImageIdx] && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-neutral-900 border border-neutral-700 w-full max-w-2xl rounded-sm shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
                {/* Header del Modal */}
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-800 bg-neutral-950">
                  <div className="flex items-center gap-2">
                    <Crop className="w-4 h-4 text-gold-400" />
                    <div>
                      <h3 className="font-serif font-bold text-white text-sm">
                        Encuadrar y Ajustar Foto {framingImageIdx === 0 ? "(Portada Principal)" : `#${framingImageIdx + 1}`}
                      </h3>
                      <p className="text-[11px] text-neutral-400">
                        Arrastra para posicionar el mejor ángulo y usa el zoom para enfocar el detalle.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFramingImageIdx(null)}
                    disabled={isSavingCrop}
                    className="text-neutral-400 hover:text-white p-1 rounded-sm cursor-pointer disabled:opacity-50"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Área de Visualización y Encuadre Interactivo */}
                <div className="p-4 bg-neutral-950 flex flex-col items-center justify-center select-none overflow-hidden flex-1">
                  <div
                    className={`relative overflow-hidden border-2 border-gold-500/80 shadow-2xl bg-black cursor-grab active:cursor-grabbing rounded-sm transition-all ${
                      cropAspectRatio === "16:9"
                        ? "w-full max-w-lg aspect-video"
                        : cropAspectRatio === "4:3"
                        ? "w-full max-w-md aspect-[4/3]"
                        : "w-full max-w-sm aspect-square"
                    }`}
                    onMouseDown={(e) => {
                      setIsDraggingCrop(true);
                      dragStartRef.current = {
                        x: e.clientX,
                        y: e.clientY,
                        startOffX: cropOffsetX,
                        startOffY: cropOffsetY,
                      };
                    }}
                    onMouseMove={(e) => {
                      if (!isDraggingCrop) return;
                      const deltaX = ((e.clientX - dragStartRef.current.x) / 300) * 50;
                      const deltaY = ((e.clientY - dragStartRef.current.y) / 200) * 50;
                      setCropOffsetX(Math.max(-50, Math.min(50, dragStartRef.current.startOffX + deltaX)));
                      setCropOffsetY(Math.max(-50, Math.min(50, dragStartRef.current.startOffY + deltaY)));
                    }}
                    onMouseUp={() => setIsDraggingCrop(false)}
                    onMouseLeave={() => setIsDraggingCrop(false)}
                    onTouchStart={(e) => {
                      if (e.touches.length === 1) {
                        setIsDraggingCrop(true);
                        dragStartRef.current = {
                          x: e.touches[0].clientX,
                          y: e.touches[0].clientY,
                          startOffX: cropOffsetX,
                          startOffY: cropOffsetY,
                        };
                      }
                    }}
                    onTouchMove={(e) => {
                      if (!isDraggingCrop || e.touches.length !== 1) return;
                      const deltaX = ((e.touches[0].clientX - dragStartRef.current.x) / 300) * 50;
                      const deltaY = ((e.touches[0].clientY - dragStartRef.current.y) / 200) * 50;
                      setCropOffsetX(Math.max(-50, Math.min(50, dragStartRef.current.startOffX + deltaX)));
                      setCropOffsetY(Math.max(-50, Math.min(50, dragStartRef.current.startOffY + deltaY)));
                    }}
                    onTouchEnd={() => setIsDraggingCrop(false)}
                  >
                    {/* Imagen con transformaciones dinámicas de encuadre */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={propForm.images[framingImageIdx]}
                      alt="Encuadre"
                      draggable={false}
                      className="absolute w-full h-full object-cover pointer-events-none transition-transform duration-75"
                      style={{
                        transform: `scale(${cropZoom}) translate(${cropOffsetX}%, ${cropOffsetY}%)`,
                        transformOrigin: "center center",
                      }}
                    />

                    {/* Guías de regla de tercios cinematográfica para encuadre perfecto */}
                    <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-30">
                      <div className="border-r border-b border-white/60" />
                      <div className="border-r border-b border-white/60" />
                      <div className="border-b border-white/60" />
                      <div className="border-r border-b border-white/60" />
                      <div className="border-r border-b border-white/60" />
                      <div className="border-b border-white/60" />
                      <div className="border-r border-white/60" />
                      <div className="border-r border-white/60" />
                      <div />
                    </div>

                    <div className="absolute bottom-2 left-2 bg-black/75 backdrop-blur-xs text-[10px] text-white/90 px-2 py-0.5 rounded flex items-center gap-1 font-mono pointer-events-none">
                      <Move className="w-3 h-3 text-gold-400" />
                      <span>Arrastra para centrar</span>
                    </div>
                  </div>
                </div>

                {/* Controles de Zoom, Aspect Ratio y Reset */}
                <div className="p-4 bg-neutral-900 border-t border-neutral-800 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                    {/* Selector de Relación de Aspecto */}
                    <div className="flex items-center gap-2">
                      <span className="text-neutral-400 font-medium text-[11px]">Proporción:</span>
                      <div className="flex items-center bg-neutral-800 p-0.5 rounded border border-neutral-700">
                        <button
                          type="button"
                          onClick={() => setCropAspectRatio("16:9")}
                          className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                            cropAspectRatio === "16:9" ? "bg-gold-500 text-luxury-black" : "text-neutral-300 hover:text-white"
                          }`}
                        >
                          16:9 (Recomendado Portada)
                        </button>
                        <button
                          type="button"
                          onClick={() => setCropAspectRatio("4:3")}
                          className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                            cropAspectRatio === "4:3" ? "bg-gold-500 text-luxury-black" : "text-neutral-300 hover:text-white"
                          }`}
                        >
                          4:3 Clásico
                        </button>
                        <button
                          type="button"
                          onClick={() => setCropAspectRatio("1:1")}
                          className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                            cropAspectRatio === "1:1" ? "bg-gold-500 text-luxury-black" : "text-neutral-300 hover:text-white"
                          }`}
                        >
                          1:1 Cuadrado
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setCropZoom(1);
                        setCropOffsetX(0);
                        setCropOffsetY(0);
                      }}
                      className="text-neutral-400 hover:text-white text-[11px] underline cursor-pointer"
                    >
                      Restablecer posición
                    </button>
                  </div>

                  {/* Slider de Zoom */}
                  <div className="flex items-center gap-3">
                    <ZoomOut className="w-4 h-4 text-neutral-400 shrink-0" />
                    <input
                      type="range"
                      min="1"
                      max="2.5"
                      step="0.05"
                      value={cropZoom}
                      onChange={(e) => setCropZoom(parseFloat(e.target.value))}
                      className="w-full accent-gold-500 cursor-pointer h-1.5 bg-neutral-700 rounded-lg appearance-none"
                    />
                    <ZoomIn className="w-4 h-4 text-neutral-400 shrink-0" />
                    <span className="text-xs text-gold-400 font-mono w-12 text-right">
                      {cropZoom.toFixed(1)}x
                    </span>
                  </div>

                  {/* Acciones de Guardar */}
                  <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
                    <span className="text-[11px] text-neutral-400">
                      Se exportará en resolución HD optimizada para la web.
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setFramingImageIdx(null)}
                        disabled={isSavingCrop}
                        className="px-4 py-1.5 rounded text-xs font-medium text-neutral-300 hover:bg-neutral-800 cursor-pointer disabled:opacity-50"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveFramedImage}
                        disabled={isSavingCrop}
                        className="px-5 py-2 rounded text-xs font-bold bg-gold-500 hover:bg-gold-600 text-luxury-black flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                      >
                        {isSavingCrop ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-luxury-black" />
                            <span>Procesando...</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Guardar Encuadre</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Filtros por Operación, Estado y Buscador */}
          <div className="space-y-3 bg-stone-50 p-4 rounded-sm border border-neutral-200 text-xs">
            {/* Fila 1: Operaciones y Búsqueda */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  onClick={() => setFilterOperation("todas")}
                  className={`px-3 py-1.5 rounded-sm font-semibold transition-colors cursor-pointer ${
                    filterOperation === "todas"
                      ? "bg-neutral-900 text-white shadow-xs"
                      : "bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-100"
                  }`}
                >
                  Todas ({properties.length})
                </button>
                <button
                  onClick={() => setFilterOperation("venta")}
                  className={`px-3 py-1.5 rounded-sm font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
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
                  className={`px-3 py-1.5 rounded-sm font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
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
                  className={`px-3 py-1.5 rounded-sm font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
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
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                    title="Limpiar búsqueda"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Fila 2: Filtro rápido por Estado */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-neutral-200/70">
              <span className="text-[11px] font-semibold text-neutral-500">Filtrar por Estado:</span>
              <button
                onClick={() => setFilterStatus("todos")}
                className={`px-2.5 py-1 rounded-sm text-xs font-medium transition-colors cursor-pointer ${
                  filterStatus === "todos"
                    ? "bg-neutral-800 text-white font-bold"
                    : "bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-100"
                }`}
              >
                Todos los estados
              </button>
              <button
                onClick={() => setFilterStatus("disponible")}
                className={`px-2.5 py-1 rounded-sm text-xs font-medium transition-colors cursor-pointer ${
                  filterStatus === "disponible"
                    ? "bg-emerald-700 text-white font-bold"
                    : "bg-white text-emerald-800 border border-emerald-200 hover:bg-emerald-50"
                }`}
              >
                🟢 Disponibles ({countDisponibles})
              </button>
              <button
                onClick={() => setFilterStatus("vendido")}
                className={`px-2.5 py-1 rounded-sm text-xs font-medium transition-colors cursor-pointer ${
                  filterStatus === "vendido"
                    ? "bg-rose-800 text-white font-bold"
                    : "bg-white text-rose-800 border border-rose-200 hover:bg-rose-50"
                }`}
              >
                🔴 Vendidas ({countVendidas})
              </button>
              <button
                onClick={() => setFilterStatus("reservado")}
                className={`px-2.5 py-1 rounded-sm text-xs font-medium transition-colors cursor-pointer ${
                  filterStatus === "reservado"
                    ? "bg-amber-700 text-white font-bold"
                    : "bg-white text-amber-800 border border-amber-200 hover:bg-amber-50"
                }`}
              >
                🟡 Reservadas
              </button>
            </div>
          </div>

          {/* Tabla de Propiedades con cambio directo de Estado */}
          <div className="bg-white border border-neutral-200 rounded-sm shadow-sm overflow-x-auto">
            {filteredProperties.length === 0 ? (
              <div className="p-8 text-center space-y-3">
                <Building2 className="w-8 h-8 text-neutral-400 mx-auto" />
                <div>
                  <h4 className="font-semibold text-neutral-800 text-sm">
                    No se encontraron propiedades
                  </h4>
                  <p className="text-xs text-neutral-500">
                    No hay publicaciones que coincidan con los filtros aplicados.
                  </p>
                </div>
                {(filterOperation !== "todas" || filterStatus !== "todos" || searchQuery) && (
                  <button
                    onClick={() => {
                      setFilterOperation("todas");
                      setFilterStatus("todos");
                      setSearchQuery("");
                    }}
                    className="text-xs text-gold-600 hover:text-gold-700 font-semibold underline cursor-pointer"
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
                    <th className="py-3 px-4">Estado (Cambio Rápido)</th>
                    <th className="py-3 px-4">Precio</th>
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
                      </td>

                      {/* Selector Rápido de Estado en 1 Click */}
                      <td className="py-3 px-4">
                        <select
                          value={prop.status || "disponible"}
                          onChange={(e) => {
                            if (!ensureNotPaymentLocked("Cambiar estado de propiedades")) return;
                            const newStatus = e.target.value as PropertyStatus;
                            updateProperty(prop.id, { status: newStatus });
                            showFeedback(
                              `Estado de "${prop.title}" cambiado a "${newStatus.toUpperCase()}".`,
                              "success"
                            );
                          }}
                          className={`px-2 py-1 text-xs font-semibold rounded-sm border cursor-pointer transition-colors ${
                            prop.status === "vendido"
                              ? "bg-rose-50 text-rose-800 border-rose-300 font-bold"
                              : prop.status === "reservado"
                              ? "bg-amber-50 text-amber-800 border-amber-300 font-bold"
                              : prop.status === "oportunidad"
                              ? "bg-gold-50 text-gold-900 border-gold-400 font-bold"
                              : "bg-emerald-50 text-emerald-800 border-emerald-300"
                          }`}
                        >
                          <option value="disponible">🟢 Disponible</option>
                          <option value="oportunidad">⭐ Oportunidad</option>
                          <option value="reservado">🟡 Reservado</option>
                          <option value="vendido">🔴 Vendido</option>
                        </select>
                      </td>

                      {/* Precio formateado con USD o ARS */}
                      <td className="py-3 px-4 font-serif font-bold text-neutral-900 text-sm whitespace-nowrap">
                        {prop.currency === "ARS" ? "$" : "USD"} {prop.price.toLocaleString("es-AR")}
                      </td>

                      <td className="py-3 px-4 text-neutral-600">
                        {prop.location?.neighborhood || "Sin barrio"}, {prop.location?.city || "CABA"}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => {
                            if (!ensureNotPaymentLocked("Modificar destacados")) return;
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
                            if (!ensureNotPaymentLocked("Modificar oportunidades")) return;
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
                              if (!ensureNotPaymentLocked("Eliminar propiedades")) return;
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
              className={`text-xs font-semibold uppercase tracking-wider px-4 py-2.5 rounded-sm transition-colors flex items-center gap-2 shadow-sm cursor-pointer ${
                isActionBlocked
                  ? "bg-stone-300 text-neutral-600 hover:bg-stone-400"
                  : "bg-gold-500 hover:bg-gold-600 text-luxury-black"
              }`}
              title={isActionBlocked ? "Bloqueado por pago pendiente" : "Crear nuevo banner"}
            >
              {isActionBlocked ? <Lock className="w-4 h-4 text-neutral-700" /> : <Plus className="w-4 h-4" />}
              <span>Nuevo Banner</span>
            </button>
          </div>

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
                  className="text-neutral-400 hover:text-neutral-800 cursor-pointer"
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
                  className="accent-gold-500 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="bannerActive" className="font-medium text-neutral-800 cursor-pointer">
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
                  className="px-4 py-2 border border-neutral-300 rounded-sm hover:bg-neutral-100 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={saveBanner}
                  className="bg-neutral-900 text-white font-semibold px-6 py-2 rounded-sm hover:bg-neutral-800 flex items-center gap-1.5 cursor-pointer"
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
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-sm cursor-pointer ${
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
                      className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-sm cursor-pointer"
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
                      className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-sm cursor-pointer"
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
                Comparador de Líneas Hipotecarias UVA
              </h2>
              <p className="text-xs text-neutral-500">
                Configure las tasas de los principales bancos para alimentar el simulador del sitio web.
              </p>
            </div>
            <button
              onClick={startCreateBank}
              className={`text-xs font-semibold uppercase tracking-wider px-4 py-2.5 rounded-sm transition-colors flex items-center gap-2 shadow-sm cursor-pointer ${
                isActionBlocked
                  ? "bg-stone-300 text-neutral-600 hover:bg-stone-400"
                  : "bg-gold-500 hover:bg-gold-600 text-luxury-black"
              }`}
              title={isActionBlocked ? "Bloqueado por pago pendiente" : "Agregar entidad bancaria"}
            >
              {isActionBlocked ? <Lock className="w-4 h-4 text-neutral-700" /> : <Plus className="w-4 h-4" />}
              <span>Nuevo Banco</span>
            </button>
          </div>

          {(isCreatingBank || editingBankId) && (
            <div className="bg-white p-6 rounded-sm border-2 border-gold-400 shadow-md space-y-4 text-xs">
              <div className="flex justify-between items-center border-b border-neutral-200 pb-3">
                <h3 className="font-serif text-base font-bold text-neutral-900">
                  {isCreatingBank ? "Agregar Entidad Financiera" : `Editando: ${bankForm.bankName}`}
                </h3>
                <button
                  onClick={() => {
                    setIsCreatingBank(false);
                    setEditingBankId(null);
                  }}
                  className="text-neutral-400 hover:text-neutral-800 cursor-pointer"
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
                  <label className="block font-semibold text-neutral-700 mb-1">Texto Corto Logotipo</label>
                  <input
                    type="text"
                    value={bankForm.logoText || ""}
                    onChange={(e) => setBankForm({ ...bankForm, logoText: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-neutral-300 rounded-sm focus:border-gold-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Línea de Crédito</label>
                  <input
                    type="text"
                    value={bankForm.creditLine || ""}
                    onChange={(e) => setBankForm({ ...bankForm, creditLine: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-neutral-300 rounded-sm focus:border-gold-500 focus:outline-none"
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
                  className="px-4 py-2 border border-neutral-300 rounded-sm hover:bg-neutral-100 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={saveBank}
                  className="bg-neutral-900 text-white font-semibold px-6 py-2 rounded-sm hover:bg-neutral-800 flex items-center gap-1.5 cursor-pointer"
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
                  <th className="py-3 px-4">Entidad</th>
                  <th className="py-3 px-4">Línea Crediticia</th>
                  <th className="py-3 px-4 text-center">Tasa UVA</th>
                  <th className="py-3 px-4 text-center">CFT</th>
                  <th className="py-3 px-4 text-center">Financiación</th>
                  <th className="py-3 px-4 text-center">Plazo</th>
                  <th className="py-3 px-4">Observaciones</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {bankRates.map((bank) => (
                  <tr key={bank.id} className="hover:bg-stone-50 transition-colors">
                    <td className="py-3 px-4 font-semibold text-neutral-900">
                      {bank.bankName}
                    </td>
                    <td className="py-3 px-4 text-neutral-600">
                      {bank.creditLine}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-neutral-900">
                      {bank.rateUva}%
                    </td>
                    <td className="py-3 px-4 text-center text-neutral-600">
                      {bank.cft}%
                    </td>
                    <td className="py-3 px-4 text-center text-neutral-600">
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
                          className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-sm cursor-pointer"
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
                Datos de contacto, matrícula y trayectoria profesional expuestos en el sitio.
              </p>
            </div>
            <button
              type="submit"
              className="bg-neutral-900 text-white font-semibold px-6 py-2.5 rounded-sm hover:bg-neutral-800 flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Perfil</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Nombre Completo</label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full p-2.5 bg-stone-50 border border-neutral-300 rounded-sm focus:border-gold-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Título Profesional</label>
              <input
                type="text"
                value={profileForm.roleTitle}
                onChange={(e) => setProfileForm({ ...profileForm, roleTitle: e.target.value })}
                className="w-full p-2.5 bg-stone-50 border border-neutral-300 rounded-sm focus:border-gold-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Matrícula / Licencia</label>
              <input
                type="text"
                value={profileForm.licenseNumber}
                onChange={(e) => setProfileForm({ ...profileForm, licenseNumber: e.target.value })}
                className="w-full p-2.5 bg-stone-50 border border-neutral-300 rounded-sm focus:border-gold-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Teléfono Móvil</label>
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

      {/* CONTENIDO DEL TAB 5: USUARIOS & SEGURIDAD */}
      {activeTab === "usuarios" && (
        <div className="space-y-8">
          {/* Fila superior: Mi cuenta y cambio de clave propia + Crear nuevo usuario */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Card 1: Cambiar Mi Contraseña */}
            <div className="bg-white p-6 border border-neutral-200 rounded-sm shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-neutral-200 pb-3">
                <KeyRound className="w-5 h-5 text-gold-600" />
                <div>
                  <h3 className="font-semibold text-neutral-900 text-sm">Cambiar Mi Contraseña</h3>
                  <p className="text-xs text-neutral-500">
                    Usuario activo: <strong className="text-neutral-800">{currentUser?.name}</strong> (@{currentUser?.username})
                  </p>
                </div>
              </div>

              <form onSubmit={handleChangeOwnPassword} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Contraseña Actual
                  </label>
                  <input
                    type="password"
                    placeholder="Tu contraseña actual..."
                    value={currentPasswordInput}
                    onChange={(e) => setCurrentPasswordInput(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-neutral-300 rounded-sm focus:border-gold-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Nueva Contraseña
                  </label>
                  <input
                    type="password"
                    placeholder="Mínimo 4 caracteres..."
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-neutral-300 rounded-sm focus:border-gold-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Confirmar Nueva Contraseña
                  </label>
                  <input
                    type="password"
                    placeholder="Repite la nueva contraseña..."
                    value={confirmPasswordInput}
                    onChange={(e) => setConfirmPasswordInput(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-neutral-300 rounded-sm focus:border-gold-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-semibold py-2.5 rounded-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Guardar Nueva Contraseña</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Card 2: Crear Nuevo Usuario con selector de apartados/permisos */}
            <div className="bg-white p-6 border border-neutral-200 rounded-sm shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-neutral-200 pb-3">
                <UserPlus className="w-5 h-5 text-emerald-600" />
                <div>
                  <h3 className="font-semibold text-neutral-900 text-sm">Registrar Nuevo Usuario</h3>
                  <p className="text-xs text-neutral-500">Crea accesos y define apartados permitidos</p>
                </div>
              </div>

              <form onSubmit={handleCreateUser} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Juan Pérez"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-neutral-300 rounded-sm focus:border-gold-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">
                      Nombre de Usuario
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. asesor_juan"
                      value={newUserUsername}
                      onChange={(e) => setNewUserUsername(e.target.value)}
                      className="w-full p-2.5 bg-stone-50 border border-neutral-300 rounded-sm focus:border-gold-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">
                      Rol Base
                    </label>
                    <select
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value as "admin" | "asesor")}
                      className="w-full p-2.5 bg-stone-50 border border-neutral-300 rounded-sm focus:border-gold-500 focus:outline-none"
                    >
                      <option value="asesor">Asesor Inmobiliario</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Contraseña Inicial
                  </label>
                  <input
                    type="password"
                    placeholder="Mínimo 4 caracteres..."
                    value={newUserPassword}
                    onChange={(e) => setNewUserPassword(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-neutral-300 rounded-sm focus:border-gold-500 focus:outline-none"
                    required
                  />
                </div>

                {/* SELECTOR DE APARTADOS / MÓDULOS PERMITIDOS */}
                <div className="pt-2 border-t border-neutral-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="block font-semibold text-neutral-800 text-xs">
                      Apartados con Acceso Permitido
                    </label>
                    <span className="text-[11px] text-neutral-500 font-medium">
                      {newUserPermissions.length} de {ALL_ADMIN_MODULES.length} seleccionados
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500">
                    Define a qué secciones del panel tendrá acceso este usuario.
                  </p>

                  {/* Opción 1 Principal: Todos los apartados (Acceso Total) */}
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={handleToggleAllNewUserPermissions}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleToggleAllNewUserPermissions();
                      }
                    }}
                    className={`p-3 rounded-sm border transition-all cursor-pointer flex items-center justify-between ${
                      newUserPermissions.length === ALL_ADMIN_MODULES.length
                        ? "bg-neutral-900 border-neutral-900 text-white shadow-sm"
                        : "bg-neutral-50 border-neutral-300 hover:border-neutral-400 text-neutral-800"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
                          newUserPermissions.length === ALL_ADMIN_MODULES.length
                            ? "bg-gold-500 text-neutral-950 font-bold"
                            : "border border-neutral-400 bg-white"
                        }`}
                      >
                        {newUserPermissions.length === ALL_ADMIN_MODULES.length && (
                          <CheckCheck className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <div>
                        <span className="font-semibold text-xs block leading-tight">
                          Todos los apartados (Acceso Total)
                        </span>
                        <span
                          className={`text-[11px] ${
                            newUserPermissions.length === ALL_ADMIN_MODULES.length
                              ? "text-neutral-300"
                              : "text-neutral-500"
                          }`}
                        >
                          Habilitar los 5 módulos simultáneamente
                        </span>
                      </div>
                    </div>
                    <span
                      className={`text-[11px] font-mono px-2 py-0.5 rounded ${
                        newUserPermissions.length === ALL_ADMIN_MODULES.length
                          ? "bg-white/10 text-gold-300"
                          : "bg-neutral-200 text-neutral-700"
                      }`}
                    >
                      {newUserPermissions.length === ALL_ADMIN_MODULES.length ? "Todos Activos" : "Parcial"}
                    </span>
                  </div>

                  {/* Cuadrícula de opciones individuales de apartados */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {ALL_ADMIN_MODULES.map((mod) => {
                      const Icon = mod.icon;
                      const isChecked = newUserPermissions.includes(mod.id);
                      return (
                        <div
                          key={mod.id}
                          role="button"
                          tabIndex={0}
                          onClick={() => handleToggleNewUserPermission(mod.id)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              handleToggleNewUserPermission(mod.id);
                            }
                          }}
                          className={`p-2.5 rounded-sm border transition-all cursor-pointer flex items-start gap-2.5 text-left ${
                            isChecked
                              ? "bg-neutral-900 border-neutral-800 text-white shadow-sm"
                              : "bg-stone-50 border-neutral-200 hover:border-neutral-300 text-neutral-800"
                          }`}
                        >
                          <div
                            className={`w-4 h-4 mt-0.5 rounded flex items-center justify-center shrink-0 transition-colors ${
                              isChecked
                                ? "bg-gold-500 text-neutral-950 font-bold"
                                : "border border-neutral-400 bg-white"
                            }`}
                          >
                            {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <Icon
                                className={`w-3.5 h-3.5 shrink-0 ${
                                  isChecked ? "text-gold-400" : "text-neutral-500"
                                }`}
                              />
                              <span className="font-semibold text-xs leading-none truncate">
                                {mod.label}
                              </span>
                            </div>
                            <p
                              className={`text-[10.5px] mt-1 leading-snug line-clamp-1 ${
                                isChecked ? "text-neutral-300" : "text-neutral-500"
                              }`}
                            >
                              {mod.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2.5 rounded-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Crear Usuario</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Card 3: Lista de Usuarios Registrados con detalle de apartados permitidos */}
          <div className="bg-white border border-neutral-200 rounded-sm shadow-sm overflow-hidden space-y-4 p-6">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-neutral-700" />
                <h3 className="font-semibold text-neutral-900 text-sm">
                  Usuarios del Sistema ({users.length})
                </h3>
              </div>
              <span className="text-xs text-neutral-500">
                Configura los apartados permitidos y contraseñas de cada usuario.
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-neutral-200 uppercase text-neutral-500 font-semibold tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Usuario</th>
                    <th className="py-3 px-4">Nombre Completo</th>
                    <th className="py-3 px-4">Rol</th>
                    <th className="py-3 px-4">Apartados Permitidos</th>
                    <th className="py-3 px-4">Fecha de Registro</th>
                    <th className="py-3 px-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {users.map((u) => {
                    const isSelf = currentUser?.id === u.id;
                    const isEditingPwd = editingPasswordUserId === u.id;
                    const userMods =
                      u.permissions && u.permissions.length > 0
                        ? u.permissions
                        : u.role === "admin"
                        ? ALL_ADMIN_MODULES.map((m) => m.id)
                        : (["propiedades"] as AdminModule[]);
                    const hasAllModules = userMods.length === ALL_ADMIN_MODULES.length;

                    return (
                      <tr key={u.id} className="hover:bg-stone-50/70 transition-colors">
                        <td className="py-3 px-4 font-mono font-medium text-neutral-800">
                          @{u.username}
                          {isSelf && (
                            <span className="ml-2 text-[10px] bg-gold-100 text-gold-800 border border-gold-300 px-1.5 py-0.5 rounded font-sans font-semibold">
                              Tu Cuenta
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-medium text-neutral-900">
                          {u.name}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${
                              u.role === "admin"
                                ? "bg-purple-50 text-purple-700 border-purple-200"
                                : "bg-blue-50 text-blue-700 border-blue-200"
                            }`}
                          >
                            {u.role === "admin" ? "Administrador" : "Asesor"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {hasAllModules ? (
                            <span className="inline-flex items-center gap-1 bg-neutral-900 text-gold-400 border border-neutral-800 px-2 py-0.5 rounded text-[11px] font-medium">
                              <ShieldCheck className="w-3 h-3 text-gold-400" />
                              <span>Acceso Total ({ALL_ADMIN_MODULES.length})</span>
                            </span>
                          ) : (
                            <div className="flex flex-wrap gap-1">
                              {userMods.map((modId) => {
                                const modConfig = ALL_ADMIN_MODULES.find((m) => m.id === modId);
                                if (!modConfig) return null;
                                return (
                                  <span
                                    key={modId}
                                    className="bg-stone-100 text-neutral-700 border border-neutral-200 px-1.5 py-0.5 rounded text-[10px] font-medium"
                                  >
                                    {modConfig.shortLabel}
                                  </span>
                                );
                              })}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4 text-neutral-500">
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString("es-AR") : "Inicial"}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleStartEditingPermissions(u)}
                              className="text-neutral-700 hover:text-neutral-900 px-2 py-1 border border-neutral-200 rounded hover:bg-neutral-100 transition-colors flex items-center gap-1 cursor-pointer text-xs"
                              title="Configurar apartados permitidos"
                            >
                              <Shield className="w-3 h-3 text-gold-600" />
                              <span>Permisos</span>
                            </button>

                            {isEditingPwd ? (
                              <div className="flex items-center gap-1.5 bg-neutral-100 p-1 rounded border border-neutral-300">
                                <input
                                  type="password"
                                  placeholder="Nueva clave..."
                                  value={tempUserPassword}
                                  onChange={(e) => setTempUserPassword(e.target.value)}
                                  className="p-1 text-xs border rounded bg-white w-28"
                                  autoFocus
                                />
                                <button
                                  type="button"
                                  onClick={() => handleUpdateOtherUserPassword(u.id)}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-1 rounded text-[11px] font-semibold cursor-pointer"
                                >
                                  OK
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingPasswordUserId(null);
                                    setTempUserPassword("");
                                  }}
                                  className="text-neutral-500 hover:text-neutral-700 px-1 text-xs cursor-pointer"
                                >
                                  ✕
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingPasswordUserId(u.id);
                                  setTempUserPassword("");
                                }}
                                className="text-neutral-600 hover:text-neutral-900 px-2 py-1 border border-neutral-200 rounded hover:bg-neutral-100 transition-colors flex items-center gap-1 cursor-pointer text-xs"
                                title="Cambiar contraseña de este usuario"
                              >
                                <KeyRound className="w-3 h-3 text-gold-600" />
                                <span>Cambiar Clave</span>
                              </button>
                            )}

                            {!isSelf && (
                              <button
                                type="button"
                                onClick={() => handleDeleteUser(u.id)}
                                className="text-rose-600 hover:text-rose-700 p-1.5 rounded hover:bg-rose-50 transition-colors cursor-pointer"
                                title="Eliminar usuario"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modal interactivo para configurar permisos de un usuario existente */}
          {editingPermissionsUserId && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-sm border border-neutral-200 shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in duration-150">
                <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-gold-600" />
                    <div>
                      <h3 className="font-semibold text-neutral-900 text-sm">
                        Permisos de Acceso a Apartados
                      </h3>
                      <p className="text-xs text-neutral-500">
                        Usuario: <strong className="text-neutral-800">@{users.find((u) => u.id === editingPermissionsUserId)?.username}</strong> ({users.find((u) => u.id === editingPermissionsUserId)?.name})
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingPermissionsUserId(null)}
                    className="text-neutral-400 hover:text-neutral-600 p-1 rounded cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  {/* Opción 1 Principal: Todos los apartados */}
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={handleToggleAllTempPermissions}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleToggleAllTempPermissions();
                      }
                    }}
                    className={`p-3 rounded-sm border transition-all cursor-pointer flex items-center justify-between ${
                      tempUserPermissions.length === ALL_ADMIN_MODULES.length
                        ? "bg-neutral-900 border-neutral-900 text-white"
                        : "bg-neutral-50 border-neutral-300 hover:border-neutral-400 text-neutral-800"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
                          tempUserPermissions.length === ALL_ADMIN_MODULES.length
                            ? "bg-gold-500 text-neutral-950 font-bold"
                            : "border border-neutral-400 bg-white"
                        }`}
                      >
                        {tempUserPermissions.length === ALL_ADMIN_MODULES.length && (
                          <CheckCheck className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <div>
                        <span className="font-semibold text-xs block">
                          Todos los apartados (Acceso Total)
                        </span>
                        <span
                          className={`text-[11px] ${
                            tempUserPermissions.length === ALL_ADMIN_MODULES.length
                              ? "text-neutral-300"
                              : "text-neutral-500"
                          }`}
                        >
                          Habilitar acceso irrestricto a los 5 módulos
                        </span>
                      </div>
                    </div>
                    <span
                      className={`text-[11px] font-mono px-2 py-0.5 rounded ${
                        tempUserPermissions.length === ALL_ADMIN_MODULES.length
                          ? "bg-white/10 text-gold-300"
                          : "bg-neutral-200 text-neutral-700"
                      }`}
                    >
                      {tempUserPermissions.length} / {ALL_ADMIN_MODULES.length}
                    </span>
                  </div>

                  {/* Apartados individuales */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {ALL_ADMIN_MODULES.map((mod) => {
                      const Icon = mod.icon;
                      const isChecked = tempUserPermissions.includes(mod.id);
                      return (
                        <div
                          key={mod.id}
                          role="button"
                          tabIndex={0}
                          onClick={() => handleToggleTempPermission(mod.id)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              handleToggleTempPermission(mod.id);
                            }
                          }}
                          className={`p-2.5 rounded-sm border transition-all cursor-pointer flex items-start gap-2.5 text-left ${
                            isChecked
                              ? "bg-neutral-900 border-neutral-800 text-white"
                              : "bg-stone-50 border-neutral-200 hover:border-neutral-300 text-neutral-800"
                          }`}
                        >
                          <div
                            className={`w-4 h-4 mt-0.5 rounded flex items-center justify-center shrink-0 transition-colors ${
                              isChecked
                                ? "bg-gold-500 text-neutral-950 font-bold"
                                : "border border-neutral-400 bg-white"
                            }`}
                          >
                            {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <Icon
                                className={`w-3.5 h-3.5 shrink-0 ${
                                  isChecked ? "text-gold-400" : "text-neutral-500"
                                }`}
                              />
                              <span className="font-semibold text-xs leading-none truncate">
                                {mod.label}
                              </span>
                            </div>
                            <p
                              className={`text-[10.5px] mt-1 leading-snug line-clamp-1 ${
                                isChecked ? "text-neutral-300" : "text-neutral-500"
                              }`}
                            >
                              {mod.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-200">
                  <button
                    type="button"
                    onClick={() => setEditingPermissionsUserId(null)}
                    className="px-4 py-2 border border-neutral-300 rounded-sm hover:bg-neutral-100 text-xs font-medium cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveUserPermissions(editingPermissionsUserId)}
                    className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-sm text-xs font-semibold cursor-pointer flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Guardar Permisos</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CONTENIDO DEL TAB 6: CONTROL Y CALENDARIO DE PAGOS DE LA APP */}
      {activeTab === "pagos" && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Encabezado y Reglas de Facturación */}
          <div className="bg-white p-6 rounded-sm border border-neutral-200 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <CalendarCheck className="w-6 h-6 text-gold-600" />
                  <h2 className="text-xl font-bold text-neutral-900 tracking-tight">
                    Control y Calendario de Pagos de la App
                  </h2>
                </div>
                <p className="text-xs text-neutral-500 mt-1">
                  Registro mensual de suscripción de la plataforma. El vencimiento automático de cada cuota opera los <strong>días 10 de cada mes</strong>.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border ${
                    isPaymentLocked
                      ? "bg-red-50 text-red-700 border-red-300 animate-pulse"
                      : "bg-emerald-50 text-emerald-700 border-emerald-300"
                  }`}
                >
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      isPaymentLocked ? "bg-red-600" : "bg-emerald-500"
                    }`}
                  />
                  <span>
                    {isPaymentLocked
                      ? "SERVICIO SUSPENDIDO (PAGO PENDIENTE)"
                      : "SERVICIO ACTIVO Y AL DÍA"}
                  </span>
                </span>
              </div>
            </div>

            {/* Métricas e Indicadores de Estado */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-sm border bg-stone-50 border-neutral-200 space-y-1">
                <div className="flex items-center justify-between text-neutral-500 text-xs font-semibold uppercase">
                  <span>Regla de Vencimiento</span>
                  <Clock className="w-4 h-4 text-neutral-400" />
                </div>
                <div className="text-xl font-bold text-neutral-900">
                  Día 10 de cada mes
                </div>
                <p className="text-[11px] text-neutral-500">
                  A partir del día 10, si el mes no está pagado, el panel bloquea altas y modificaciones.
                </p>
              </div>

              <div className="p-4 rounded-sm border bg-stone-50 border-neutral-200 space-y-1">
                <div className="flex items-center justify-between text-neutral-500 text-xs font-semibold uppercase">
                  <span>Mes Actual</span>
                  <CalendarDays className="w-4 h-4 text-neutral-400" />
                </div>
                <div className="text-xl font-bold text-neutral-900">
                  {MONTH_NAMES_ES[new Date().getMonth()]} {new Date().getFullYear()}
                </div>
                <div className="text-[11px] flex items-center gap-1.5 pt-0.5">
                  {(() => {
                    const currentId = `${new Date().getFullYear()}-${String(
                      new Date().getMonth() + 1
                    ).padStart(2, "0")}`;
                    const currentP = appPayments.find((p) => p.id === currentId);
                    if (currentP?.isPaid) {
                      return (
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Mes al día (Pagado)
                        </span>
                      );
                    }
                    if (new Date().getDate() >= 10) {
                      return (
                        <span className="text-red-700 font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" /> Vencido desde el día 10
                        </span>
                      );
                    }
                    return (
                      <span className="text-amber-700 font-bold flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> Vence en {10 - new Date().getDate()} días
                      </span>
                    );
                  })()}
                </div>
              </div>

              <div className="p-4 rounded-sm border bg-stone-50 border-neutral-200 space-y-2">
                <div className="flex items-center justify-between text-neutral-500 text-xs font-semibold uppercase">
                  <span>Acción Rápida Mes Actual</span>
                  <CreditCard className="w-4 h-4 text-neutral-400" />
                </div>
                <div>
                  {(() => {
                    const now = new Date();
                    const currentYear = now.getFullYear();
                    const currentMonth = now.getMonth() + 1;
                    const currentId = `${currentYear}-${String(currentMonth).padStart(2, "0")}`;
                    const currentEntry = appPayments.find((p) => p.id === currentId);
                    const isPaid = currentEntry?.isPaid;

                    return (
                      <button
                        type="button"
                        onClick={() => handleTogglePayment(currentYear, currentMonth, !isPaid)}
                        className={`w-full py-2 px-3 text-xs font-bold rounded uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
                          isPaid
                            ? "bg-stone-200 hover:bg-stone-300 text-neutral-700"
                            : "bg-emerald-600 hover:bg-emerald-500 text-white active:scale-95"
                        }`}
                      >
                        {isPaid ? (
                          <>
                            <X className="w-3.5 h-3.5" />
                            <span>Desmarcar Mes Actual</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4 stroke-[3]" />
                            <span>Marcar Mes Actual como Pagado</span>
                          </>
                        )}
                      </button>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>

          {/* Navegación de Año y Calendario Anual de 12 Meses */}
          <div className="bg-white p-6 rounded-sm border border-neutral-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedPaymentYear((y) => y - 1)}
                  className="px-3 py-1.5 border border-neutral-300 hover:bg-neutral-100 rounded text-xs font-semibold cursor-pointer"
                >
                  &larr; {selectedPaymentYear - 1}
                </button>
                <div className="text-lg font-extrabold text-neutral-900 tracking-tight px-2">
                  Año {selectedPaymentYear}
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedPaymentYear((y) => y + 1)}
                  className="px-3 py-1.5 border border-neutral-300 hover:bg-neutral-100 rounded text-xs font-semibold cursor-pointer"
                >
                  {selectedPaymentYear + 1} &rarr;
                </button>
              </div>

              <div className="text-xs text-neutral-600">
                {(() => {
                  const yearList = buildYearPayments(selectedPaymentYear, appPayments);
                  const paidCount = yearList.filter((m) => m.isPaid).length;
                  return (
                    <span>
                      Pagos registrados en {selectedPaymentYear}:{" "}
                      <strong className="text-neutral-900 font-bold">
                        {paidCount} de 12 meses ({Math.round((paidCount / 12) * 100)}%)
                      </strong>
                    </span>
                  );
                })()}
              </div>
            </div>

            {/* Grilla de los 12 Meses */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {buildYearPayments(selectedPaymentYear, appPayments).map((p) => {
                const now = new Date();
                const isCurrentYear = now.getFullYear() === selectedPaymentYear;
                const isCurrentMonth = isCurrentYear && now.getMonth() + 1 === p.month;
                const isPastMonth =
                  selectedPaymentYear < now.getFullYear() ||
                  (isCurrentYear && p.month < now.getMonth() + 1);
                const isOverdue = !p.isPaid && (isPastMonth || (isCurrentMonth && now.getDate() >= 10));
                const isSelected = selectedCalendarMonth === p.month;

                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedCalendarMonth(p.month)}
                    className={`p-4 rounded-sm border transition-all cursor-pointer relative flex flex-col justify-between gap-4 ${
                      isSelected ? "ring-2 ring-gold-500 shadow-md" : "hover:border-neutral-400"
                    } ${
                      p.isPaid
                        ? "bg-emerald-50/50 border-emerald-300"
                        : isOverdue
                        ? "bg-rose-50/70 border-rose-400 shadow-sm"
                        : "bg-white border-neutral-200"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-sm text-neutral-900">
                          {p.monthName}
                        </span>
                        {isCurrentMonth && (
                          <span className="text-[10px] bg-neutral-900 text-white px-2 py-0.5 rounded-full font-bold">
                            Actual
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] text-neutral-500 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-neutral-400" />
                        <span>Vence: 10 de {p.monthName}</span>
                      </div>

                      <div className="mt-3">
                        {p.isPaid ? (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>PAGADO</span>
                          </div>
                        ) : isOverdue ? (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-100 text-rose-800 text-xs font-bold border border-rose-300 animate-pulse">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                            <span>VENCIDO (IMPAGO)</span>
                          </div>
                        ) : isCurrentMonth ? (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-100 text-amber-800 text-xs font-bold border border-amber-300">
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            <span>POR VENCER (DÍA 10)</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-neutral-100 text-neutral-600 text-xs font-medium">
                            <span>PENDIENTE</span>
                          </div>
                        )}
                      </div>

                      {p.paidAt && (
                        <p className="text-[10px] text-neutral-400 mt-2 truncate">
                          Registrado: {new Date(p.paidAt).toLocaleDateString("es-AR")}
                        </p>
                      )}
                    </div>

                    <div className="pt-2 border-t border-neutral-200/60 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTogglePayment(selectedPaymentYear, p.month, !p.isPaid);
                        }}
                        className={`w-full py-1.5 px-2 rounded text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1 ${
                          p.isPaid
                            ? "bg-neutral-200 hover:bg-neutral-300 text-neutral-700"
                            : isOverdue
                            ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm"
                            : "bg-neutral-900 hover:bg-neutral-800 text-white"
                        }`}
                      >
                        {p.isPaid ? (
                          <>
                            <X className="w-3 h-3" />
                            <span>Desmarcar</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Marcar Pagado</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Vista Detallada de Calendario del Mes Seleccionado */}
          <div className="bg-white p-6 rounded-sm border border-neutral-200 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
              <div className="flex items-center gap-3">
                <CalendarDays className="w-6 h-6 text-gold-600" />
                <div>
                  <h3 className="text-base font-bold text-neutral-900">
                    Calendario Detallado: {MONTH_NAMES_ES[selectedCalendarMonth - 1]} {selectedPaymentYear}
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Vista interactiva mensual. Observa el <strong>Día 10</strong> resaltado como fecha de vencimiento reglamentaria.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {(() => {
                  const targetId = `${selectedPaymentYear}-${String(selectedCalendarMonth).padStart(2, "0")}`;
                  const currentP = appPayments.find((p) => p.id === targetId);
                  const isPaid = Boolean(currentP?.isPaid);

                  return (
                    <button
                      type="button"
                      onClick={() =>
                        handleTogglePayment(selectedPaymentYear, selectedCalendarMonth, !isPaid)
                      }
                      className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center gap-2 cursor-pointer shadow-sm ${
                        isPaid
                          ? "bg-rose-100 text-rose-800 hover:bg-rose-200"
                          : "bg-emerald-600 text-white hover:bg-emerald-500"
                      }`}
                    >
                      {isPaid ? (
                        <>
                          <X className="w-4 h-4" />
                          <span>Marcar como Impago / Pendiente</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4 stroke-[3]" />
                          <span>Marcar {MONTH_NAMES_ES[selectedCalendarMonth - 1]} como Pagado</span>
                        </>
                      )}
                    </button>
                  );
                })()}
              </div>
            </div>

            {/* Grilla visual de Calendario (Lunes a Domingo) */}
            <div className="space-y-2">
              <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-neutral-500 uppercase tracking-wider pb-2 border-b border-neutral-100">
                <span>Lun</span>
                <span>Mar</span>
                <span>Mié</span>
                <span>Jue</span>
                <span>Vie</span>
                <span>Sáb</span>
                <span>Dom</span>
              </div>

              {(() => {
                const totalDays = new Date(selectedPaymentYear, selectedCalendarMonth, 0).getDate();
                const rawFirstDay = new Date(selectedPaymentYear, selectedCalendarMonth - 1, 1).getDay();
                // Lunes = 0, Domingo = 6
                const startOffset = (rawFirstDay + 6) % 7;

                const cells = [];
                // Celdas vacías antes del primer día
                for (let i = 0; i < startOffset; i++) {
                  cells.push(
                    <div
                      key={`empty-${i}`}
                      className="h-20 bg-stone-50/50 border border-transparent rounded-sm p-2 opacity-30"
                    />
                  );
                }

                const targetId = `${selectedPaymentYear}-${String(selectedCalendarMonth).padStart(2, "0")}`;
                const targetPayment = appPayments.find((p) => p.id === targetId);
                const isMonthPaid = Boolean(targetPayment?.isPaid);

                for (let day = 1; day <= totalDays; day++) {
                  const isDay10 = day === 10;
                  const isToday =
                    new Date().getFullYear() === selectedPaymentYear &&
                    new Date().getMonth() + 1 === selectedCalendarMonth &&
                    new Date().getDate() === day;

                  cells.push(
                    <div
                      key={`day-${day}`}
                      className={`h-20 rounded-sm border p-2 flex flex-col justify-between transition-colors relative ${
                        isDay10
                          ? isMonthPaid
                            ? "bg-emerald-50/90 border-2 border-emerald-500 ring-2 ring-emerald-500/20"
                            : "bg-red-50/90 border-2 border-red-500 ring-2 ring-red-500/20 shadow-md"
                          : isToday
                          ? "bg-gold-50/70 border-gold-400 font-bold"
                          : "bg-white border-neutral-200 hover:bg-stone-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-bold ${
                            isDay10
                              ? isMonthPaid
                                ? "text-emerald-800 text-sm"
                                : "text-red-800 text-sm"
                              : isToday
                              ? "text-gold-800"
                              : "text-neutral-800"
                          }`}
                        >
                          {day}
                        </span>

                        {isToday && (
                          <span className="text-[9px] bg-gold-500 text-neutral-950 font-black px-1.5 py-0.2 rounded">
                            Hoy
                          </span>
                        )}
                      </div>

                      {isDay10 && (
                        <div className="mt-1">
                          <div
                            className={`text-[9.5px] font-black uppercase tracking-tight px-1.5 py-0.5 rounded text-center ${
                              isMonthPaid
                                ? "bg-emerald-600 text-white"
                                : "bg-red-600 text-white animate-pulse"
                            }`}
                          >
                            {isMonthPaid ? "✓ 10 PAGADO" : "⚠️ VENCE EL 10"}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-7 gap-2">
                    {cells}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
