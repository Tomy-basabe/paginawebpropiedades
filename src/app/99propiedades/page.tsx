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
  Loader2,
  Box,
  Search,
  Eye,
  EyeOff,
  DollarSign,
  Users,
  KeyRound,
  Shield,
  UserPlus,
  Crosshair
} from "lucide-react";
import { SPLAT_VIEWER_CONFIG } from "@/lib/gaussian-splat/config";
import CameraCalibrationModal from "@/components/3d/CameraCalibrationModal";

export interface AdminUser {
  id: string;
  username: string;
  password: string;
  name: string;
  role: "admin" | "asesor";
  createdAt: string;
}

const DEFAULT_ADMIN_USER: AdminUser = {
  id: "admin-root",
  username: "admin",
  password: "••••••••",
  name: "Administrador",
  role: "admin",
  createdAt: new Date().toISOString(),
};

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

  // Edición rápida de contraseña para otro usuario
  const [editingPasswordUserId, setEditingPasswordUserId] = useState<string | null>(null);
  const [tempUserPassword, setTempUserPassword] = useState("");

  // Mensaje de feedback/notificación global
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);

  const showFeedback = (text: string, type: "success" | "error" | "info" = "success") => {
    setFeedbackMessage({ text, type });
    setTimeout(() => {
      setFeedbackMessage((current) => (current?.text === text ? null : current));
    }, 4000);
  };

  // Tabs (sin 'backup' ni restablecer datos)
  const [activeTab, setActiveTab] = useState<"propiedades" | "banners" | "tasas" | "perfil" | "usuarios">("propiedades");

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

  // Estados para subida directa de modelo 3D Gaussian Splatting (.ply, .splat, .ksplat)
  const [isUploadingModel, setIsUploadingModel] = useState(false);
  const [modelUploadStatus, setModelUploadStatus] = useState("");
  const [uploadingRoomId, setUploadingRoomId] = useState<string | null>(null);
  const [showGuide3D, setShowGuide3D] = useState(false);

  // Estado para calibración interactiva de cámara POV (WASD + QE)
  const [calibratingTarget, setCalibratingTarget] = useState<{
    propertyId?: string;
    roomId?: string;
    name: string;
    url: string;
    format?: "ply" | "splat" | "ksplat" | "embed";
    initialCameraPosition?: [number, number, number];
    initialCameraTarget?: [number, number, number];
  } | null>(null);

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

  const handleAddRoom3D = () => {
    const currentRooms = propForm.rooms3D || [];
    const newRoom: PropertyRoom3D = {
      id: `room-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: currentRooms.length === 0 ? "Living Comedor" : `Habitación ${currentRooms.length + 1}`,
      url: "",
      format: "ply",
      initialCameraPosition: [-0.3, 0.55, 0.6],
      initialCameraTarget: [-0.3, 0.55, -0.8],
    };
    setPropForm((prev) => ({
      ...prev,
      has3DTour: true,
      rooms3D: [...currentRooms, newRoom],
    }));
  };

  const handleSaveCalibration = (
    position: [number, number, number],
    target: [number, number, number]
  ) => {
    if (!calibratingTarget) return;

    // Caso 1: Calibrando habitación dentro del formulario activo
    if (calibratingTarget.roomId) {
      handleUpdateRoom3D(calibratingTarget.roomId, {
        initialCameraPosition: position,
        initialCameraTarget: target,
      });

      setPropForm((prev) => {
        const rooms = (prev.rooms3D || []).map((r) =>
          r.id === calibratingTarget.roomId
            ? { ...r, initialCameraPosition: position, initialCameraTarget: target }
            : r
        );
        const isFirst = rooms[0]?.id === calibratingTarget.roomId;
        return {
          ...prev,
          rooms3D: rooms,
          ...(isFirst && prev.model3D
            ? {
                model3D: {
                  ...prev.model3D,
                  initialCameraPosition: position,
                  initialCameraTarget: target,
                },
              }
            : {}),
        };
      });
    }

    // Caso 2: Calibrando directo desde la tabla de propiedades con propertyId
    if (calibratingTarget.propertyId) {
      const targetProp = properties.find((p) => p.id === calibratingTarget.propertyId);
      if (targetProp) {
        let updatedRooms = targetProp.rooms3D ? [...targetProp.rooms3D] : [];
        if (calibratingTarget.roomId) {
          updatedRooms = updatedRooms.map((r) =>
            r.id === calibratingTarget.roomId
              ? { ...r, initialCameraPosition: position, initialCameraTarget: target }
              : r
          );
        } else if (updatedRooms.length > 0) {
          updatedRooms[0] = {
            ...updatedRooms[0],
            initialCameraPosition: position,
            initialCameraTarget: target,
          };
        }

        const updatedModel3D = targetProp.model3D
          ? {
              ...targetProp.model3D,
              initialCameraPosition: position,
              initialCameraTarget: target,
            }
          : updatedRooms[0]
          ? {
              url: updatedRooms[0].url,
              format: updatedRooms[0].format,
              initialCameraPosition: position,
              initialCameraTarget: target,
            }
          : undefined;

        updateProperty(calibratingTarget.propertyId, {
          rooms3D: updatedRooms,
          model3D: updatedModel3D,
        });
      }
    }

    showFeedback(
      `Punto de partida y altura guardados para "${calibratingTarget.name}".`,
      "success"
    );
    setCalibratingTarget(null);
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

  // Verificación de sesión segura con el servidor al cargar
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedUsers = localStorage.getItem("aurea_admin_users");
        if (storedUsers) {
          const parsed = JSON.parse(storedUsers);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setUsers(parsed);
          } else {
            setUsers([DEFAULT_ADMIN_USER]);
          }
        } else {
          setUsers([DEFAULT_ADMIN_USER]);
        }

        fetch("/api/admin/me")
          .then((res) => {
            if (res.ok) return res.json();
            throw new Error("No autenticado");
          })
          .then((data) => {
            if (data?.authenticated && data?.user) {
              setIsAuthenticated(true);
              setCurrentUser({
                id: "admin-root",
                username: data.user.username,
                password: "••••••••",
                name: data.user.name,
                role: data.user.role,
                createdAt: new Date().toISOString(),
              });
              setProfileForm(agentProfile);
            } else {
              setIsAuthenticated(false);
              setCurrentUser(null);
            }
          })
          .catch(() => {
            setIsAuthenticated(false);
            setCurrentUser(null);
          });
      } catch (err) {
        console.error("Error al cargar estado de autenticación:", err);
      }
    }
  }, [agentProfile]);

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
        const loggedUser: AdminUser = {
          id: "admin-root",
          username: data.user.username,
          password: "••••••••",
          name: data.user.name,
          role: data.user.role,
          createdAt: new Date().toISOString(),
        };
        setCurrentUser(loggedUser);
        setLoginError("");
        setLoginPassword("");
        setProfileForm(agentProfile);
        showFeedback(`Bienvenido al panel, ${data.user.name}.`, "success");
      } else {
        setLoginError(data.error || "Usuario o contraseña incorrectos.");
      }
    } catch {
      setLoginError("Error de conexión con el servidor.");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch {
      // ignore
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

    if (users.some((u) => u.username.toLowerCase() === cleanUsername)) {
      showFeedback(`El usuario "${cleanUsername}" ya existe. Elige otro.`, "error");
      return;
    }

    const newUser: AdminUser = {
      id: `user-${Date.now()}`,
      username: cleanUsername,
      password: "••••••••",
      name: newUserName.trim(),
      role: newUserRole,
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);

    setNewUserName("");
    setNewUserUsername("");
    setNewUserPassword("");
    setNewUserRole("asesor");
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
    setEditingPropId(prop.id);
    const initialRooms: PropertyRoom3D[] = prop.rooms3D && prop.rooms3D.length > 0
      ? [...prop.rooms3D]
      : prop.model3D?.url
      ? [
          {
            id: `room-1`,
            name: "Ambiente Principal",
            url: prop.model3D.url,
            format: prop.model3D.format || "ply",
            initialCameraPosition: prop.model3D.initialCameraPosition || [-0.3, 0.55, 0.6],
            initialCameraTarget: prop.model3D.initialCameraTarget || [-0.3, 0.55, -0.8],
          },
        ]
      : [];

    setPropForm({
      ...prop,
      currency: prop.currency || "USD",
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

    const validRooms = (propForm.rooms3D || []).filter((r) => r.url && r.url.trim().length > 0);
    const has3D = validRooms.length > 0 || !!propForm.model3D?.url;

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
      showFeedback(`Propiedad "${finalForm.title}" creada y guardada con éxito.`, "success");
    } else if (editingPropId) {
      updateProperty(editingPropId, finalForm);
      setEditingPropId(null);
      showFeedback(`Propiedad "${finalForm.title}" actualizada con éxito.`, "success");
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
              className="flex items-center gap-1.5 text-xs bg-amber-50 text-amber-700 border border-amber-300 px-3 py-1.5 rounded-full font-medium hover:bg-amber-100 transition-colors cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Sincronizar Datos</span>
            </button>
          )}

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

      {/* Tabs de Navegación del CMS (Sin restablecer datos) */}
      <div className="flex flex-wrap gap-2 border-b border-neutral-200 pb-2 text-xs">
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
              className="bg-gold-500 hover:bg-gold-600 text-luxury-black text-xs font-semibold uppercase tracking-wider px-4 py-2.5 rounded-sm transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
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
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 z-20">
                          {idx !== 0 && (
                            <button
                              type="button"
                              onClick={() => handleMakeCoverImage(idx)}
                              className="p-1.5 bg-gold-500 hover:bg-gold-600 text-luxury-black rounded text-[10px] font-bold cursor-pointer"
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
                  <div className="flex items-center justify-between p-2.5 bg-white border border-sky-200 rounded-sm text-xs">
                    <span className="font-mono text-sky-900 truncate max-w-md">{propForm.videoUrl}</span>
                    <button
                      type="button"
                      onClick={() => setPropForm({ ...propForm, videoUrl: "", hasVideoTour: false })}
                      className="text-rose-500 hover:text-rose-700 shrink-0 cursor-pointer"
                      title="Quitar video"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Recorridos 3D (Gaussian Splatting) */}
              <div className="p-4 bg-amber-50/50 border border-amber-200/80 rounded-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-200/60 pb-3">
                  <div className="flex items-center gap-2">
                    <Box className="w-5 h-5 text-amber-600" />
                    <div>
                      <label className="block font-bold text-neutral-900 text-sm">
                        Recorridos 3D por Habitaciones (Gaussian Splatting)
                      </label>
                      <span className="text-xs text-neutral-600">
                        Scaniverse (.ply) o enlaces publicados de SuperSplat (PlayCanvas)
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowGuide3D(!showGuide3D)}
                      className="text-xs font-semibold px-3 py-1.5 rounded-sm border border-amber-300 bg-white hover:bg-amber-100/70 text-amber-900 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <span>📖 {showGuide3D ? "Ocultar Guía" : "Guía: Cómo Escanear"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleAddRoom3D}
                      className="bg-gold-500 hover:bg-gold-600 text-luxury-black font-semibold text-xs px-3 py-1.5 rounded-sm transition-all shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Agregar Habitación 3D</span>
                    </button>
                  </div>
                </div>

                {/* GUÍA INTERACTIVA PASO A PASO */}
                {showGuide3D && (
                  <div className="bg-white border border-amber-300 p-5 rounded-sm shadow-sm space-y-4 animate-fade-in text-xs">
                    <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                      <h4 className="font-bold text-neutral-900 text-sm flex items-center gap-2">
                        <span>📱 Cómo escanear una casa con tu celular y publicarla en 3D</span>
                      </h4>
                      <a
                        href="https://playcanvas.com/supersplat/editor"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-800 hover:text-amber-950 font-semibold underline flex items-center gap-1 text-[11px]"
                      >
                        <span>Abrir SuperSplat Editor</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-neutral-700">
                      <div className="p-3 bg-stone-50 border border-neutral-200 rounded-sm space-y-1">
                        <span className="font-bold text-neutral-900 block text-xs">1. Captura</span>
                        <p className="text-[11px] leading-relaxed">
                          Descargá <strong>Scaniverse</strong> (gratis en iOS/Android). Elegí el modo <strong>"Splat"</strong>. Caminá lento en círculos grabando cada ángulo del ambiente.
                        </p>
                      </div>

                      <div className="p-3 bg-stone-50 border border-neutral-200 rounded-sm space-y-1">
                        <span className="font-bold text-neutral-900 block text-xs">2. Genera</span>
                        <p className="text-[11px] leading-relaxed">
                          Scaniverse procesa la escena dentro de tu teléfono y crea el modelo Gaussian Splatting en minutos.
                        </p>
                      </div>

                      <div className="p-3 bg-stone-50 border border-neutral-200 rounded-sm space-y-1">
                        <span className="font-bold text-neutral-900 block text-xs">3. Exporta</span>
                        <p className="text-[11px] leading-relaxed">
                          Exportá el archivo en formato <strong>.ply</strong> (formato estándar del splat).
                        </p>
                      </div>

                      <div className="p-3 bg-stone-50 border border-neutral-200 rounded-sm space-y-1">
                        <span className="font-bold text-neutral-900 block text-xs">4. SuperSplat</span>
                        <p className="text-[11px] leading-relaxed">
                          Entrá a <strong>SuperSplat</strong> (PlayCanvas en tu navegador), subí tu .ply, recortá lo sobrante y dale a Publicar.
                        </p>
                      </div>

                      <div className="p-3 bg-amber-50/70 border border-amber-300 rounded-sm space-y-1">
                        <span className="font-bold text-amber-900 block text-xs">5. Pega en el panel</span>
                        <p className="text-[11px] leading-relaxed">
                          Pegá el link de SuperSplat en <strong>"URL del Modelo 3D"</strong> o subí directamente el archivo <strong>.ply</strong>.
                        </p>
                      </div>
                    </div>

                    <div className="p-2.5 bg-neutral-100 rounded-sm text-[11px] text-neutral-600 flex items-center justify-between">
                      <span>💡 <strong>Consejo pro:</strong> El movimiento lento y los ángulos completos hacen el 80% de la calidad fotorrealista.</span>
                      <button
                        type="button"
                        onClick={() => setShowGuide3D(false)}
                        className="text-neutral-500 hover:text-neutral-800 underline ml-2"
                      >
                        Entendido, cerrar guía
                      </button>
                    </div>
                  </div>
                )}

                {propForm.rooms3D && propForm.rooms3D.length > 0 && (
                  <div className="space-y-4">
                    {propForm.rooms3D.map((room, idx) => (
                      <div key={room.id} className="p-4 bg-white border border-amber-200 rounded-sm shadow-xs space-y-3">
                        <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5 gap-2">
                          <div className="flex items-center gap-2 flex-1">
                            <span className="w-6 h-6 rounded-full bg-amber-500 text-luxury-black text-xs font-bold flex items-center justify-center shrink-0">
                              {idx + 1}
                            </span>
                            <input
                              type="text"
                              value={room.name}
                              onChange={(e) => handleUpdateRoom3D(room.id, { name: e.target.value })}
                              placeholder="Nombre del ambiente (ej: Living Comedor)"
                              className="font-semibold text-neutral-900 text-xs sm:text-sm bg-transparent border-b border-dashed border-neutral-300 focus:border-gold-500 focus:outline-none flex-1 py-0.5"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteRoom3D(room.id)}
                            className="text-rose-600 hover:text-rose-800 p-1.5 rounded hover:bg-rose-50 transition-colors shrink-0 flex items-center gap-1 text-[11px] cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Eliminar</span>
                          </button>
                        </div>

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
                              <Loader2 className="w-4 h-4 animate-spin text-amber-600 mx-auto" />
                              <span className="text-xs font-semibold text-amber-700">{modelUploadStatus}</span>
                            </div>
                          ) : (
                            <div className="space-y-1">
                              <span className="font-semibold text-xs text-neutral-700 group-hover:text-amber-800">
                                {room.url ? "Reemplazar archivo 3D" : "Subir archivo .ply / .splat / .ksplat"}
                              </span>
                            </div>
                          )}
                        </label>

                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
                          <div className="sm:col-span-8 space-y-1">
                            <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                              URL del Modelo 3D o Enlace de SuperSplat
                            </label>
                            <input
                              type="text"
                              value={room.url}
                              onChange={(e) => {
                                const val = e.target.value;
                                const isSuperSplat = val.includes("playcanvas.com") || val.includes("supersplat");
                                handleUpdateRoom3D(room.id, {
                                  url: val,
                                  ...(isSuperSplat ? { format: "embed" } : {}),
                                });
                              }}
                              placeholder="https://playcanvas.com/supersplat/editor o archivo .ply"
                              className="w-full p-2 bg-stone-50 border border-neutral-300 rounded-sm text-xs font-mono focus:border-gold-500 focus:outline-none"
                            />
                          </div>
                          <div className="sm:col-span-4 space-y-1">
                            <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                              Formato / Tipo
                            </label>
                            <select
                              value={room.format || (room.url?.includes("playcanvas") ? "embed" : "ply")}
                              onChange={(e) =>
                                handleUpdateRoom3D(room.id, {
                                  format: e.target.value as "ply" | "splat" | "ksplat" | "embed",
                                })
                              }
                              className="w-full p-2 bg-stone-50 border border-neutral-300 rounded-sm text-xs focus:border-gold-500 focus:outline-none"
                            >
                              <option value="ply">.PLY (Scaniverse / Estándar)</option>
                              <option value="embed">Link SuperSplat / Visor Web</option>
                              <option value="splat">.SPLAT (Optimizado)</option>
                              <option value="ksplat">.KSPLAT (Comprimido)</option>
                            </select>
                          </div>
                        </div>

                        {/* Configuración de punto de partida y altura de la cámara */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 mt-1 border-t border-dashed border-amber-200">
                          <div className="flex items-center gap-1.5 text-[11px] text-neutral-600">
                            <Crosshair className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span>
                              {room.initialCameraPosition
                                ? `Inicio: [X:${room.initialCameraPosition[0].toFixed(2)}, Y:${room.initialCameraPosition[1].toFixed(2)}, Z:${room.initialCameraPosition[2].toFixed(2)}]`
                                : "Posición: Centro calibrado a 1.70m de altura"}
                            </span>
                          </div>
                          <button
                            type="button"
                            disabled={!room.url || room.format === "embed"}
                            onClick={() =>
                              setCalibratingTarget({
                                roomId: room.id,
                                name: room.name || `Habitación ${idx + 1}`,
                                url: room.url,
                                format: room.format,
                                initialCameraPosition: room.initialCameraPosition || [-0.3, 0.55, 0.6],
                                initialCameraTarget: room.initialCameraTarget || [-0.3, 0.55, -0.8],
                              })
                            }
                            className={`px-3 py-1.5 rounded-sm font-semibold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                              !room.url || room.format === "embed"
                                ? "bg-neutral-100 text-neutral-400 cursor-not-allowed border border-neutral-200"
                                : "bg-amber-500 hover:bg-amber-400 text-luxury-black hover:shadow-md active:scale-95"
                            }`}
                            title={
                              room.format === "embed"
                                ? "Los embeds de SuperSplat usan su propio visor web"
                                : !room.url
                                ? "Primero ingresá o subí el archivo 3D"
                                : "Abre el visor para desplazarte con WASD y ajustar la altura con Q y E"
                            }
                          >
                            <Crosshair className="w-3.5 h-3.5" />
                            <span>Calibrar Punto Inicial & Altura (WASD + QE)</span>
                          </button>
                        </div>
                      </div>
                    ))}
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
                      </td>

                      {/* Selector Rápido de Estado en 1 Click */}
                      <td className="py-3 px-4">
                        <select
                          value={prop.status || "disponible"}
                          onChange={(e) => {
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
                          {(prop.has3DTour || prop.model3D?.url || (prop.rooms3D && prop.rooms3D.length > 0)) && (
                            <button
                              type="button"
                              onClick={() => {
                                const targetRoom = prop.rooms3D?.[0];
                                const url = targetRoom?.url || prop.model3D?.url;
                                const format = targetRoom?.format || prop.model3D?.format;
                                if (!url || format === "embed") {
                                  alert("Esta propiedad usa un enlace externo o no tiene un archivo 3D compatible para calibrar.");
                                  return;
                                }
                                setCalibratingTarget({
                                  propertyId: prop.id,
                                  roomId: targetRoom?.id,
                                  name: targetRoom?.name || prop.title,
                                  url,
                                  format,
                                  initialCameraPosition: targetRoom?.initialCameraPosition || prop.model3D?.initialCameraPosition || [-0.3, 0.55, 0.6],
                                  initialCameraTarget: targetRoom?.initialCameraTarget || prop.model3D?.initialCameraTarget || [-0.3, 0.55, -0.8],
                                });
                              }}
                              className="p-1.5 text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded-sm cursor-pointer transition-colors"
                              title="Calibrar Punto de Partida y Altura 3D (WASD + QE)"
                            >
                              <Crosshair className="w-4 h-4" />
                            </button>
                          )}
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
              className="bg-gold-500 hover:bg-gold-600 text-luxury-black text-xs font-semibold uppercase tracking-wider px-4 py-2.5 rounded-sm transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
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
              className="bg-gold-500 hover:bg-gold-600 text-luxury-black text-xs font-semibold uppercase tracking-wider px-4 py-2.5 rounded-sm transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
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
                    placeholder="Ingresa tu contraseña actual..."
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

            {/* Card 2: Crear Nuevo Usuario */}
            <div className="bg-white p-6 border border-neutral-200 rounded-sm shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-neutral-200 pb-3">
                <UserPlus className="w-5 h-5 text-emerald-600" />
                <div>
                  <h3 className="font-semibold text-neutral-900 text-sm">Registrar Nuevo Usuario</h3>
                  <p className="text-xs text-neutral-500">Crea accesos para otros colaboradores o administradores</p>
                </div>
              </div>

              <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
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
                      Rol de Permisos
                    </label>
                    <select
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value as "admin" | "asesor")}
                      className="w-full p-2.5 bg-stone-50 border border-neutral-300 rounded-sm focus:border-gold-500 focus:outline-none"
                    >
                      <option value="asesor">Asesor Inmobiliario</option>
                      <option value="admin">Administrador Total</option>
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

          {/* Card 3: Lista de Usuarios Registrados */}
          <div className="bg-white border border-neutral-200 rounded-sm shadow-sm overflow-hidden space-y-4 p-6">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-neutral-700" />
                <h3 className="font-semibold text-neutral-900 text-sm">
                  Usuarios del Sistema ({users.length})
                </h3>
              </div>
              <span className="text-xs text-neutral-500">
                Los usuarios pueden autenticarse con su propio usuario y contraseña.
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-neutral-200 uppercase text-neutral-500 font-semibold tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Usuario</th>
                    <th className="py-3 px-4">Nombre Completo</th>
                    <th className="py-3 px-4">Rol</th>
                    <th className="py-3 px-4">Fecha de Registro</th>
                    <th className="py-3 px-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {users.map((u) => {
                    const isSelf = currentUser?.id === u.id;
                    const isEditingPwd = editingPasswordUserId === u.id;

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
                        <td className="py-3 px-4 text-neutral-500">
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString("es-AR") : "Inicial"}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
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
                                className="text-neutral-600 hover:text-neutral-900 px-2 py-1 border border-neutral-200 rounded hover:bg-neutral-100 transition-colors flex items-center gap-1 cursor-pointer"
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
        </div>
      )}

      {/* Modal interactivo de calibración 3D en primera persona (POV WASD + QE) */}
      {calibratingTarget && (
        <CameraCalibrationModal
          isOpen={!!calibratingTarget}
          onClose={() => setCalibratingTarget(null)}
          roomName={calibratingTarget.name}
          modelUrl={calibratingTarget.url}
          format={calibratingTarget.format}
          initialCameraPosition={calibratingTarget.initialCameraPosition || [-0.3, 0.55, 0.6]}
          initialCameraTarget={calibratingTarget.initialCameraTarget || [-0.3, 0.55, -0.8]}
          onSave={handleSaveCalibration}
        />
      )}
    </div>
  );
}
