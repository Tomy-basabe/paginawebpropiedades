"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Property, BankRate, FeaturedBanner, AgentProfile } from "@/lib/types";
import {
  INITIAL_PROPERTIES,
  INITIAL_BANK_RATES,
  INITIAL_FEATURED_BANNERS,
  INITIAL_AGENT_PROFILE,
} from "@/lib/initialData";

const STORAGE_KEY = "aurea_real_estate_db_v1";

interface DataContextType {
  properties: Property[];
  bankRates: BankRate[];
  banners: FeaturedBanner[];
  agentProfile: AgentProfile;
  isLoaded: boolean;
  addProperty: (property: Omit<Property, "id" | "createdAt">) => void;
  updateProperty: (id: string, property: Partial<Property>) => void;
  deleteProperty: (id: string) => void;
  updateBankRate: (id: string, rate: Partial<BankRate>) => void;
  addBankRate: (rate: Omit<BankRate, "id" | "updatedAt">) => void;
  deleteBankRate: (id: string) => void;
  updateBanner: (id: string, banner: Partial<FeaturedBanner>) => void;
  addBanner: (banner: Omit<FeaturedBanner, "id">) => void;
  deleteBanner: (id: string) => void;
  updateAgentProfile: (profile: Partial<AgentProfile>) => void;
  resetToDefaults: () => void;
  exportDataJSON: () => string;
  importDataJSON: (jsonString: string) => boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [bankRates, setBankRates] = useState<BankRate[]>(INITIAL_BANK_RATES);
  const [banners, setBanners] = useState<FeaturedBanner[]>(INITIAL_FEATURED_BANNERS);
  const [agentProfile, setAgentProfile] = useState<AgentProfile>(INITIAL_AGENT_PROFILE);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Cargar datos desde localStorage al inicializar
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.properties) setProperties(parsed.properties);
        if (parsed.bankRates) setBankRates(parsed.bankRates);
        if (parsed.banners) setBanners(parsed.banners);
        if (parsed.agentProfile) setAgentProfile(parsed.agentProfile);
      }
    } catch (e) {
      console.error("Error al cargar datos del almacenamiento local:", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Guardar en localStorage cada vez que cambien los datos
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
      console.error("Error al guardar en almacenamiento local:", e);
    }
  }, [properties, bankRates, banners, agentProfile, isLoaded]);

  const addProperty = (newProp: Omit<Property, "id" | "createdAt">) => {
    const id = `prop-${Date.now()}`;
    const createdAt = new Date().toISOString().split("T")[0];
    setProperties((prev) => [{ ...newProp, id, createdAt }, ...prev]);
  };

  const updateProperty = (id: string, updated: Partial<Property>) => {
    setProperties((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
  };

  const deleteProperty = (id: string) => {
    setProperties((prev) => prev.filter((item) => item.id !== id));
  };

  const addBankRate = (newRate: Omit<BankRate, "id" | "updatedAt">) => {
    const id = `bank-${Date.now()}`;
    const updatedAt = new Date().toISOString().split("T")[0];
    setBankRates((prev) => [...prev, { ...newRate, id, updatedAt }]);
  };

  const updateBankRate = (id: string, updated: Partial<BankRate>) => {
    const updatedAt = new Date().toISOString().split("T")[0];
    setBankRates((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ...updated, updatedAt } : item
      )
    );
  };

  const deleteBankRate = (id: string) => {
    setBankRates((prev) => prev.filter((item) => item.id !== id));
  };

  const addBanner = (newBanner: Omit<FeaturedBanner, "id">) => {
    const id = `banner-${Date.now()}`;
    setBanners((prev) => [...prev, { ...newBanner, id }]);
  };

  const updateBanner = (id: string, updated: Partial<FeaturedBanner>) => {
    setBanners((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
  };

  const deleteBanner = (id: string) => {
    setBanners((prev) => prev.filter((item) => item.id !== id));
  };

  const updateAgentProfile = (updated: Partial<AgentProfile>) => {
    setAgentProfile((prev) => ({ ...prev, ...updated }));
  };

  const resetToDefaults = () => {
    setProperties(INITIAL_PROPERTIES);
    setBankRates(INITIAL_BANK_RATES);
    setBanners(INITIAL_FEATURED_BANNERS);
    setAgentProfile(INITIAL_AGENT_PROFILE);
    localStorage.removeItem(STORAGE_KEY);
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
      if (parsed.properties) setProperties(parsed.properties);
      if (parsed.bankRates) setBankRates(parsed.bankRates);
      if (parsed.banners) setBanners(parsed.banners);
      if (parsed.agentProfile) setAgentProfile(parsed.agentProfile);
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
