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
          // Filtrar cualquier propiedad que no tenga video
          const videoOnlyProps = parsed.properties.filter(
            (p: Property) => !!p.videoUrl && p.videoUrl.trim().length > 0
          );
          setProperties(videoOnlyProps);
        }
        if (parsed.bankRates) setBankRates(parsed.bankRates);
        if (parsed.banners) {
          // Filtrar para mantener únicamente el banner de prueba
          const testBanners = parsed.banners.filter(
            (b: FeaturedBanner) =>
              b.id === "banner-1791075798900" ||
              b.title?.toLowerCase().includes("prueba") ||
              b.title?.toLowerCase().includes("prubea")
          );
          setBanners(testBanners.length > 0 ? testBanners : INITIAL_FEATURED_BANNERS);
        }
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
          return prop;
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

    // Actualización de estado en React
    setProperties((prev) => [propertyObj, ...prev]);

    const payloadSupabase = {
      id: propertyObj.id,
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
    };

    // Persistencia con fallback directo a Supabase
    try {
      const res = await fetch("/api/admin/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "save", property: propertyObj }),
      });
      if (!res.ok) {
        await supabase.from("properties").upsert(payloadSupabase);
      }
    } catch (err) {
      try {
        await supabase.from("properties").upsert(payloadSupabase);
      } catch (sbErr) {
        console.error("Error al guardar propiedad directamente en Supabase:", sbErr);
      }
    }

    return id;
  };

  const updateProperty = async (id: string, updated: Partial<Property>): Promise<void> => {
    // 1. Obtener objeto existente de forma síncrona sin depender de closures asíncronos de React
    let targetProperty = properties.find((item) => item.id === id);

    if (!targetProperty && typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          targetProperty = (parsed.properties || []).find((p: Property) => p.id === id);
        }
      } catch {
        // ignore
      }
    }

    const fullUpdatedProperty: Property = targetProperty
      ? { ...targetProperty, ...updated }
      : ({ id, ...updated } as Property);

    // 2. Actualización en memoria
    setProperties((prev) =>
      prev.map((item) => (item.id === id ? fullUpdatedProperty : item))
    );

    const payloadSupabase = {
      id: fullUpdatedProperty.id,
      title: fullUpdatedProperty.title,
      operation: fullUpdatedProperty.operation,
      type: fullUpdatedProperty.type,
      status: fullUpdatedProperty.status,
      price: fullUpdatedProperty.price,
      currency: fullUpdatedProperty.currency,
      location: fullUpdatedProperty.location,
      features: fullUpdatedProperty.features,
      images: fullUpdatedProperty.images,
      description: fullUpdatedProperty.description,
      is_featured: fullUpdatedProperty.isFeatured,
      is_opportunity: fullUpdatedProperty.isOpportunity,
      data: fullUpdatedProperty,
      updated_at: new Date().toISOString(),
    };

    // 3. Persistencia en base de datos (con fallback garantizado)
    try {
      const res = await fetch("/api/admin/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "save", property: fullUpdatedProperty }),
      });
      if (!res.ok) {
        const { error: sbErr } = await supabase.from("properties").upsert(payloadSupabase);
        if (sbErr) console.warn("Aviso fallback Supabase update:", sbErr.message);
      }
    } catch (err) {
      try {
        await supabase.from("properties").upsert(payloadSupabase);
      } catch (sbErr) {
        console.error("Error al actualizar propiedad directamente en Supabase:", sbErr);
      }
    }
  };

  const deleteProperty = async (id: string): Promise<void> => {
    setProperties((prev) => prev.filter((item) => item.id !== id));

    try {
      const res = await fetch("/api/admin/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id }),
      });
      if (!res.ok) {
        await supabase.from("properties").delete().eq("id", id);
      }
    } catch (err) {
      try {
        await supabase.from("properties").delete().eq("id", id);
      } catch (sbErr) {
        console.error("Error al eliminar propiedad en Supabase:", sbErr);
      }
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
    const target = bankRates.find((item) => item.id === id);
    const fullUpdatedRate: BankRate = target
      ? { ...target, ...updated, updatedAt }
      : ({ id, ...updated, updatedAt } as BankRate);

    setBankRates((prev) =>
      prev.map((item) => (item.id === id ? fullUpdatedRate : item))
    );

    try {
      await supabase.from("bank_rates").upsert({
        id,
        bank_name: fullUpdatedRate.bankName,
        tna: fullUpdatedRate.rateUva,
        cft: fullUpdatedRate.cft,
        max_financing_percent: fullUpdatedRate.maxFinancing,
        max_years_term: fullUpdatedRate.maxTermYears,
        logo_url: fullUpdatedRate.logoText,
        data: fullUpdatedRate,
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
    const target = banners.find((item) => item.id === id);
    const fullBanner: FeaturedBanner = target
      ? { ...target, ...updated }
      : ({ id, ...updated } as FeaturedBanner);

    setBanners((prev) =>
      prev.map((item) => (item.id === id ? fullBanner : item))
    );

    try {
      await supabase.from("featured_banners").upsert({
        id,
        title: fullBanner.title,
        subtitle: fullBanner.subtitle,
        badge: fullBanner.badge,
        image_url: fullBanner.imageUrl,
        link: fullBanner.ctaLink,
        cta_text: fullBanner.ctaText,
        is_active: fullBanner.active,
        data: fullBanner,
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
    const merged: AgentProfile = { ...agentProfile, ...updated };
    if (merged.whatsappNumber) {
      merged.whatsappNumber = merged.whatsappNumber.replace(/\D/g, "");
    }

    setAgentProfile(merged);

    try {
      const cleanWa = (merged.whatsappNumber || "").replace(/\D/g, "");
      await supabase.from("agent_profile").upsert({
        id: "primary_agent",
        name: merged.name,
        role_title: merged.roleTitle,
        license_number: merged.licenseNumber,
        phone: merged.phone,
        whatsapp_number: cleanWa,
        email: merged.email,
        data: {
          ...merged,
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
