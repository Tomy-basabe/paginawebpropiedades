"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Property, BankRate, FeaturedBanner, AgentProfile } from "@/lib/types";
import {
  INITIAL_PROPERTIES,
  INITIAL_BANK_RATES,
  INITIAL_FEATURED_BANNERS,
  INITIAL_AGENT_PROFILE,
} from "@/lib/initialData";
import { supabase } from "@/lib/supabase";

const STORAGE_KEY = "aurea_real_estate_db_v1";

interface DataContextType {
  properties: Property[];
  bankRates: BankRate[];
  banners: FeaturedBanner[];
  agentProfile: AgentProfile;
  isLoaded: boolean;
  isCloudConnected: boolean;
  addProperty: (property: Omit<Property, "id" | "createdAt">) => Promise<string>;
  updateProperty: (id: string, property: Partial<Property>) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  updateBankRate: (id: string, rate: Partial<BankRate>) => Promise<void>;
  addBankRate: (rate: Omit<BankRate, "id" | "updatedAt">) => Promise<void>;
  deleteBankRate: (id: string) => Promise<void>;
  updateBanner: (id: string, banner: Partial<FeaturedBanner>) => Promise<void>;
  addBanner: (banner: Omit<FeaturedBanner, "id">) => Promise<void>;
  deleteBanner: (id: string) => Promise<void>;
  updateAgentProfile: (profile: Partial<AgentProfile>) => Promise<void>;
  refreshFromCloud: () => Promise<void>;
  resetToDefaults: () => Promise<void>;
  exportDataJSON: () => string;
  importDataJSON: (jsonString: string) => boolean;
  hideSoldProperties: boolean;
  setHideSoldProperties: (hide: boolean) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [bankRates, setBankRates] = useState<BankRate[]>(INITIAL_BANK_RATES);
  const [banners, setBanners] = useState<FeaturedBanner[]>(INITIAL_FEATURED_BANNERS);
  const [agentProfile, setAgentProfile] = useState<AgentProfile>(INITIAL_AGENT_PROFILE);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(true);
  const [hideSoldProperties, setHideSoldPropertiesState] = useState<boolean>(false);

  // Cargar preferencia de ocultar vendidas
  useEffect(() => {
    try {
      const storedHide = localStorage.getItem("aurea_hide_sold");
      if (storedHide !== null) {
        setHideSoldPropertiesState(storedHide === "true");
      }
    } catch {
      // ignore
    }
  }, []);

  const setHideSoldProperties = (hide: boolean) => {
    setHideSoldPropertiesState(hide);
    try {
      localStorage.setItem("aurea_hide_sold", hide ? "true" : "false");
    } catch {
      // ignore
    }
  };

  // 1. Cargar datos locales de inmediato (para evitar parpadeo)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.properties) {
          // Fusionar con datos iniciales para asegurar que model3D, rooms3D y nuevas propiedades estén presentes
          const existingIds = new Set(parsed.properties.map((p: Property) => p.id));
          const merged = parsed.properties.map((p: Property) => {
            const init = INITIAL_PROPERTIES.find((ip) => ip.id === p.id);
            let updated = { ...p };
            if (init) {
              // Si no tiene operation o coincide con un cambio de base, sincronizar
              if (!updated.operation || (init.operation !== "venta" && updated.operation === "venta")) {
                updated.operation = init.operation;
              }
              if (init.model3D) {
                if (
                  !p.model3D ||
                  !p.model3D.url ||
                  p.model3D.url.includes("supabase.co") ||
                  p.model3D.url.includes("demo-light") ||
                  p.model3D.url.includes("demo-room")
                ) {
                  updated.model3D = init.model3D;
                  updated.has3DTour = init.has3DTour;
                }
              }
              if (init.rooms3D) {
                if (
                  !p.rooms3D ||
                  p.rooms3D.length === 0 ||
                  p.rooms3D.some((r) => r.url.includes("supabase.co"))
                ) {
                  updated.rooms3D = init.rooms3D;
                  updated.has3DTour = true;
                }
              }
            }
            return updated;
          });

          // Agregar propiedades de INITIAL_PROPERTIES que no existan en el almacenamiento local
          const missingInitProps = INITIAL_PROPERTIES.filter((ip) => !existingIds.has(ip.id));
          setProperties([...merged, ...missingInitProps]);
        }
        if (parsed.bankRates) setBankRates(parsed.bankRates);
        if (parsed.banners) setBanners(parsed.banners);
        if (parsed.agentProfile) setAgentProfile(parsed.agentProfile);
      }
    } catch (e) {
      console.error("Error al cargar datos locales:", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // 2. Sincronizar desde Supabase en la nube
  const refreshFromCloud = useCallback(async () => {
    try {
      const [
        { data: propsData, error: propsErr },
        { data: bannersData, error: bannersErr },
        { data: ratesData, error: ratesErr },
        { data: profileData, error: profileErr },
      ] = await Promise.all([
        supabase.from("properties").select("*").order("created_at", { ascending: false }),
        supabase.from("featured_banners").select("*"),
        supabase.from("bank_rates").select("*"),
        supabase.from("agent_profile").select("*").limit(1),
      ]);

      if (propsErr || bannersErr || ratesErr || profileErr) {
        console.warn("Aviso al consultar Supabase:", { propsErr, bannersErr, ratesErr, profileErr });
        setIsCloudConnected(false);
        return;
      }

      setIsCloudConnected(true);

      if (propsData && propsData.length > 0) {
        const parsedProps: Property[] = propsData.map((row) => {
          const rawProp = ((row.data as Property) || row) as Property;
          const prop: Property = {
            ...rawProp,
            operation: (row.operation as any) || rawProp.operation || "venta",
            type: (row.type as any) || rawProp.type || "casa",
            status: (row.status as any) || rawProp.status || "disponible",
            price: typeof row.price === "number" ? row.price : rawProp.price,
          };
          const init = INITIAL_PROPERTIES.find((ip) => ip.id === prop.id);
          let updated = { ...prop };
          if (init?.model3D && (!prop.model3D || !prop.model3D.url || prop.model3D.url.startsWith("/models/") || prop.model3D.url.includes("demo-light") || prop.model3D.url.includes("demo-room"))) {
            updated.model3D = init.model3D;
            updated.has3DTour = init.has3DTour ?? true;
          }
          if (init?.rooms3D && (!prop.rooms3D || prop.rooms3D.length === 0)) {
            updated.rooms3D = init.rooms3D;
            updated.has3DTour = true;
          }
          return updated;
        });
        setProperties(parsedProps);
      }

      if (bannersData && bannersData.length > 0) {
        const parsedBanners: FeaturedBanner[] = bannersData.map((row) => (row.data as FeaturedBanner) || row);
        setBanners(parsedBanners);
      }

      if (ratesData && ratesData.length > 0) {
        const parsedRates: BankRate[] = ratesData.map((row) => (row.data as BankRate) || row);
        setBankRates(parsedRates);
      }

      if (profileData && profileData.length > 0) {
        const parsedProfile: AgentProfile = (profileData[0].data as AgentProfile) || profileData[0];
        setAgentProfile(parsedProfile);
      }
    } catch (err) {
      console.error("Error conectando con Supabase:", err);
      setIsCloudConnected(false);
    }
  }, []);

  useEffect(() => {
    refreshFromCloud();
  }, [refreshFromCloud]);

  // 3. Persistir copia de seguridad en localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      const dataToSave = {
        properties,
        bankRates,
        banners,
        agentProfile,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (e) {
      console.error("Error al guardar copia local:", e);
    }
  }, [properties, bankRates, banners, agentProfile, isLoaded]);

  // MUTACIONES CONECTADAS A SUPABASE

  const addProperty = async (newProp: Omit<Property, "id" | "createdAt">): Promise<string> => {
    const id = `prop-${Date.now()}`;
    const createdAt = new Date().toISOString().split("T")[0];
    const propertyObj: Property = { ...newProp, id, createdAt };

    // Actualización optimista local
    setProperties((prev) => [propertyObj, ...prev]);

    // Persistencia en Supabase
    try {
      const { error } = await supabase.from("properties").upsert({
        id,
        title: propertyObj.title,
        operation: propertyObj.operation,
        type: propertyObj.type,
        status: propertyObj.status,
        price: propertyObj.price,
        currency: propertyObj.currency,
        location: propertyObj.location,
        features: propertyObj.features,
        images: propertyObj.images,
        description: propertyObj.description,
        is_featured: propertyObj.isFeatured,
        is_opportunity: propertyObj.isOpportunity,
        data: propertyObj,
        updated_at: new Date().toISOString(),
      });
      if (error) console.error("Error guardando propiedad en Supabase:", error);
    } catch (err) {
      console.error("Fallo al conectar con Supabase para addProperty:", err);
    }

    return id;
  };

  const updateProperty = async (id: string, updated: Partial<Property>): Promise<void> => {
    let fullUpdatedProperty: Property | null = null;

    setProperties((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          fullUpdatedProperty = { ...item, ...updated };
          return fullUpdatedProperty;
        }
        return item;
      })
    );

    if (!fullUpdatedProperty) return;

    try {
      const p = fullUpdatedProperty as Property;
      const { error } = await supabase.from("properties").upsert({
        id,
        title: p.title,
        operation: p.operation,
        type: p.type,
        status: p.status,
        price: p.price,
        currency: p.currency,
        location: p.location,
        features: p.features,
        images: p.images,
        description: p.description,
        is_featured: p.isFeatured,
        is_opportunity: p.isOpportunity,
        data: p,
        updated_at: new Date().toISOString(),
      });
      if (error) console.error("Error actualizando propiedad en Supabase:", error);
    } catch (err) {
      console.error("Fallo al conectar con Supabase para updateProperty:", err);
    }
  };

  const deleteProperty = async (id: string): Promise<void> => {
    setProperties((prev) => prev.filter((item) => item.id !== id));

    try {
      const { error } = await supabase.from("properties").delete().eq("id", id);
      if (error) console.error("Error eliminando propiedad en Supabase:", error);
    } catch (err) {
      console.error("Fallo al conectar con Supabase para deleteProperty:", err);
    }
  };

  const addBankRate = async (newRate: Omit<BankRate, "id" | "updatedAt">): Promise<void> => {
    const id = `bank-${Date.now()}`;
    const updatedAt = new Date().toISOString().split("T")[0];
    const rateObj: BankRate = { ...newRate, id, updatedAt };

    setBankRates((prev) => [...prev, rateObj]);

    try {
      await supabase.from("bank_rates").upsert({
        id,
        bank_name: rateObj.bankName,
        tna: rateObj.rateUva,
        cft: rateObj.cft,
        max_financing_percent: rateObj.maxFinancing,
        max_years_term: rateObj.maxTermYears,
        logo_url: rateObj.logoText,
        data: rateObj,
        updated_at: new Date().toISOString(),
      });
    } catch (err) {
      console.error("Error guardando tasa bancaria en Supabase:", err);
    }
  };

  const updateBankRate = async (id: string, updated: Partial<BankRate>): Promise<void> => {
    const updatedAt = new Date().toISOString().split("T")[0];
    let fullUpdatedRate: BankRate | null = null;

    setBankRates((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          fullUpdatedRate = { ...item, ...updated, updatedAt };
          return fullUpdatedRate;
        }
        return item;
      })
    );

    if (!fullUpdatedRate) return;

    try {
      const r = fullUpdatedRate as BankRate;
      await supabase.from("bank_rates").upsert({
        id,
        bank_name: r.bankName,
        tna: r.rateUva,
        cft: r.cft,
        max_financing_percent: r.maxFinancing,
        max_years_term: r.maxTermYears,
        logo_url: r.logoText,
        data: r,
        updated_at: new Date().toISOString(),
      });
    } catch (err) {
      console.error("Error actualizando tasa bancaria en Supabase:", err);
    }
  };

  const deleteBankRate = async (id: string): Promise<void> => {
    setBankRates((prev) => prev.filter((item) => item.id !== id));

    try {
      await supabase.from("bank_rates").delete().eq("id", id);
    } catch (err) {
      console.error("Error eliminando tasa en Supabase:", err);
    }
  };

  const addBanner = async (newBanner: Omit<FeaturedBanner, "id">): Promise<void> => {
    const id = `banner-${Date.now()}`;
    const bannerObj: FeaturedBanner = { ...newBanner, id };

    setBanners((prev) => [...prev, bannerObj]);

    try {
      await supabase.from("featured_banners").upsert({
        id,
        title: bannerObj.title,
        subtitle: bannerObj.subtitle,
        badge: bannerObj.badge,
        image_url: bannerObj.imageUrl,
        link: bannerObj.ctaLink,
        cta_text: bannerObj.ctaText,
        is_active: bannerObj.active,
        data: bannerObj,
      });
    } catch (err) {
      console.error("Error guardando banner en Supabase:", err);
    }
  };

  const updateBanner = async (id: string, updated: Partial<FeaturedBanner>): Promise<void> => {
    let fullBanner: FeaturedBanner | null = null;

    setBanners((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          fullBanner = { ...item, ...updated };
          return fullBanner;
        }
        return item;
      })
    );

    if (!fullBanner) return;

    try {
      const b = fullBanner as FeaturedBanner;
      await supabase.from("featured_banners").upsert({
        id,
        title: b.title,
        subtitle: b.subtitle,
        badge: b.badge,
        image_url: b.imageUrl,
        link: b.ctaLink,
        cta_text: b.ctaText,
        is_active: b.active,
        data: b,
      });
    } catch (err) {
      console.error("Error actualizando banner en Supabase:", err);
    }
  };

  const deleteBanner = async (id: string): Promise<void> => {
    setBanners((prev) => prev.filter((item) => item.id !== id));

    try {
      await supabase.from("featured_banners").delete().eq("id", id);
    } catch (err) {
      console.error("Error eliminando banner en Supabase:", err);
    }
  };

  const updateAgentProfile = async (updated: Partial<AgentProfile>): Promise<void> => {
    let fullProfile: AgentProfile | null = null;

    setAgentProfile((prev) => {
      const merged = { ...prev, ...updated };
      // Limpiar automáticamente número de WhatsApp de cualquier caracter extraño o espacio
      if (merged.whatsappNumber) {
        merged.whatsappNumber = merged.whatsappNumber.replace(/\D/g, "");
      }
      fullProfile = merged;
      return fullProfile;
    });

    if (!fullProfile) return;

    try {
      const ap = fullProfile as AgentProfile;
      const cleanWa = (ap.whatsappNumber || "").replace(/\D/g, "");
      await supabase.from("agent_profile").upsert({
        id: "primary_agent",
        name: ap.name,
        role_title: ap.roleTitle,
        license_number: ap.licenseNumber,
        phone: ap.phone,
        whatsapp_number: cleanWa,
        email: ap.email,
        data: {
          ...ap,
          whatsappNumber: cleanWa,
        },
        updated_at: new Date().toISOString(),
      });
    } catch (err) {
      console.error("Error actualizando perfil en Supabase:", err);
    }
  };

  const resetToDefaults = async (): Promise<void> => {
    setProperties(INITIAL_PROPERTIES);
    setBankRates(INITIAL_BANK_RATES);
    setBanners(INITIAL_FEATURED_BANNERS);
    setAgentProfile(INITIAL_AGENT_PROFILE);
    localStorage.removeItem(STORAGE_KEY);

    try {
      // Re-sembrar en Supabase
      const propRows = INITIAL_PROPERTIES.map((p) => ({ id: p.id, data: p }));
      const bannerRows = INITIAL_FEATURED_BANNERS.map((b) => ({ id: b.id, data: b }));
      const rateRows = INITIAL_BANK_RATES.map((r) => ({ id: r.id, data: r }));
      const profileRow = { id: "primary_agent", data: INITIAL_AGENT_PROFILE };

      await Promise.all([
        supabase.from("properties").upsert(propRows),
        supabase.from("featured_banners").upsert(bannerRows),
        supabase.from("bank_rates").upsert(rateRows),
        supabase.from("agent_profile").upsert([profileRow]),
      ]);
    } catch (err) {
      console.error("Error al resetear en Supabase:", err);
    }
  };

  const exportDataJSON = () => {
    return JSON.stringify(
      { properties, bankRates, banners, agentProfile },
      null,
      2
    );
  };

  const importDataJSON = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.properties) {
        setProperties(parsed.properties);
        supabase.from("properties").upsert(parsed.properties.map((p: Property) => ({ id: p.id, data: p }))).then();
      }
      if (parsed.bankRates) {
        setBankRates(parsed.bankRates);
        supabase.from("bank_rates").upsert(parsed.bankRates.map((r: BankRate) => ({ id: r.id, data: r }))).then();
      }
      if (parsed.banners) {
        setBanners(parsed.banners);
        supabase.from("featured_banners").upsert(parsed.banners.map((b: FeaturedBanner) => ({ id: b.id, data: b }))).then();
      }
      if (parsed.agentProfile) {
        setAgentProfile(parsed.agentProfile);
        supabase.from("agent_profile").upsert([{ id: "primary_agent", data: parsed.agentProfile }]).then();
      }
      return true;
    } catch (e) {
      console.error("Formato JSON inválido:", e);
      return false;
    }
  };

  return (
    <DataContext.Provider
      value={{
        properties,
        bankRates,
        banners,
        agentProfile,
        isLoaded,
        isCloudConnected,
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
        refreshFromCloud,
        resetToDefaults,
        exportDataJSON,
        importDataJSON,
        hideSoldProperties,
        setHideSoldProperties,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData debe utilizarse dentro de un DataProvider");
  }
  return context;
}
