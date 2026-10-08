"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useData } from "@/context/DataContext";
import PropertyCard from "@/components/PropertyCard";
import PropertyDetailModal from "@/components/PropertyDetailModal";
import { Property, PropertyType, OperationType } from "@/lib/types";
import { 
  Search, 
  SlidersHorizontal, 
  RotateCcw, 
  LayoutGrid, 
  List, 
  Building2, 
  Home, 
  MapPin, 
  DollarSign, 
  Bed, 
  Sparkles,
  Inbox,
  Video,
  Play,
  Box
} from "lucide-react";

function PropiedadesContent() {
  const searchParams = useSearchParams();
  const { properties, hideSoldProperties } = useData();
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // Estados de filtros leídos inicialmente de la URL
  const initialOperation = searchParams.get("operation") || "todos";
  const initialType = searchParams.get("type") || "todos";
  const initialLocation = searchParams.get("location") || "";
  const initialStatus = searchParams.get("status") || "todos";
  const initialVideo = searchParams.get("video") === "true";
  const initial3D = searchParams.get("tour3d") === "true";

  const [searchQuery, setSearchQuery] = useState(initialLocation);
  const [operationFilter, setOperationFilter] = useState<string>(initialOperation);
  const [typeFilter, setTypeFilter] = useState<string>(initialType);
  const [statusFilter, setStatusFilter] = useState<string>(initialStatus);
  const [onlyVideoTour, setOnlyVideoTour] = useState<boolean>(initialVideo);
  const [only3DTour, setOnly3DTour] = useState<boolean>(initial3D);
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [bedroomsFilter, setBedroomsFilter] = useState<string>("todos");
  const [sortBy, setSortBy] = useState<string>("destacados");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Sincronizar dinámicamente cuando cambian los searchParams de la URL (ej: navegación desde home o botones)
  useEffect(() => {
    const op = searchParams.get("operation");
    if (op) {
      setOperationFilter(op);
    }
    const tp = searchParams.get("type");
    if (tp) {
      setTypeFilter(tp);
    }
    const loc = searchParams.get("location");
    if (loc !== null && loc !== undefined) {
      setSearchQuery(loc);
    }
    const st = searchParams.get("status");
    if (st) {
      setStatusFilter(st);
    }
    if (searchParams.get("video") === "true") {
      setOnlyVideoTour(true);
    }
    if (searchParams.get("tour3d") === "true") {
      setOnly3DTour(true);
    }
  }, [searchParams]);

  // Filtrado reactivo en memoria
  const filteredProperties = useMemo(() => {
    return properties.filter((item) => {
      // Búsqueda de texto
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchesText =
          item.title.toLowerCase().includes(query) ||
          item.location.neighborhood.toLowerCase().includes(query) ||
          item.location.city.toLowerCase().includes(query) ||
          item.location.address.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.id.toLowerCase().includes(query);

        if (!matchesText) return false;
      }

      // Operación
      if (operationFilter !== "todos" && item.operation !== operationFilter) {
        return false;
      }

      // Tipo de inmueble
      if (typeFilter !== "todos" && item.type !== typeFilter) {
        return false;
      }

      // Ocultar vendidas si la configuración global del admin está activa
      if (hideSoldProperties && item.status === "vendido") {
        return false;
      }

      // Estado / Oportunidad
      if (statusFilter === "oportunidad" && !item.isOpportunity) {
        return false;
      } else if (statusFilter !== "todos" && statusFilter !== "oportunidad" && item.status !== statusFilter) {
        return false;
      }

      // Video Tour Prioritario
      if (onlyVideoTour && !item.hasVideoTour && !item.videoUrl) {
        return false;
      }

      // Recorrido 3D Gaussian Splatting
      if (only3DTour) {
        const has3D =
          Boolean(item.has3DTour) ||
          Boolean((item as any).has_3d_tour) ||
          Boolean(item.model3D?.url) ||
          Boolean((item as any).model_3d?.url);
        if (!has3D) return false;
      }

      // Precios
      if (minPrice && item.price < Number(minPrice)) {
        return false;
      }
      if (maxPrice && item.price > Number(maxPrice)) {
        return false;
      }

      // Dormitorios
      if (bedroomsFilter !== "todos") {
        const reqBeds = Number(bedroomsFilter);
        if (item.features.bedrooms < reqBeds) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "precio_asc") return a.price - b.price;
      if (sortBy === "precio_desc") return b.price - a.price;
      if (sortBy === "recientes") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      // "destacados" por defecto: primero los destacados, luego por fecha
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [
    properties,
    searchQuery,
    operationFilter,
    typeFilter,
    statusFilter,
    onlyVideoTour,
    only3DTour,
    minPrice,
    maxPrice,
    bedroomsFilter,
    sortBy,
  ]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setOperationFilter("todos");
    setTypeFilter("todos");
    setStatusFilter("todos");
    setOnlyVideoTour(false);
    setOnly3DTour(false);
    setMinPrice("");
    setMaxPrice("");
    setBedroomsFilter("todos");
    setSortBy("destacados");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Encabezado editorial */}
      <div className="border-b border-neutral-200 pb-8">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gold-600 bg-gold-50 px-2.5 py-1 rounded-sm mb-2">
          <Building2 className="w-3.5 h-3.5" />
          <span>Buscador Avanzado & Catálogo Inmobiliario</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900">
          Explorar Propiedades Singulares
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-1 max-w-2xl">
          Filtre por tipo de operación, tipología arquitectónica, rango de inversión o ubicación para encontrar el activo que mejor se adapte a su perfil.
        </p>
      </div>

      {/* Chips Rápidos de Filtrado para Teléfonos y Pantallas Táctiles */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none">
        {/* Chip prioritario de Recorrido 3D */}
        <button
          type="button"
          onClick={() => {
            const nextVal = !only3DTour;
            setOnly3DTour(nextVal);
            if (nextVal) {
              setSearchQuery("");
            }
          }}
          className={`shrink-0 text-xs px-3.5 py-1.5 rounded-[3px] border transition-all flex items-center gap-1.5 font-medium ${
            only3DTour
              ? "bg-gold-500 text-neutral-950 border-gold-500 shadow-xs font-semibold"
              : "bg-white text-stone-700 border-stone-300 hover:border-gold-400"
          }`}
        >
          <Box className="w-3.5 h-3.5 text-current" />
          <span>Tour 3D</span>
        </button>

        {/* Chip prioritario de Video Tours */}
        <button
          type="button"
          onClick={() => setOnlyVideoTour(!onlyVideoTour)}
          className={`shrink-0 text-xs px-3.5 py-1.5 rounded-[3px] border transition-all flex items-center gap-1.5 font-medium ${
            onlyVideoTour
              ? "bg-neutral-900 text-white border-neutral-900 shadow-xs"
              : "bg-white text-stone-700 border-stone-300 hover:border-stone-400"
          }`}
        >
          <Play className="w-3 h-3 fill-current" />
          <span>Video Tour</span>
        </button>

        {[
          { label: "Todas", op: "todos", tp: "todos", st: "todos" },
          { label: "En Venta", op: "venta", tp: "todos", st: "todos" },
          { label: "En Alquiler", op: "alquiler", tp: "todos", st: "todos" },
          { label: "En Pozo", op: "pozo", tp: "todos", st: "todos" },
          { label: "Casas", op: "todos", tp: "casa", st: "todos" },
          { label: "Departamentos", op: "todos", tp: "departamento", st: "todos" },
          { label: "Loteos", op: "todos", tp: "loteo", st: "todos" },
          { label: "Oportunidades", op: "todos", tp: "todos", st: "oportunidad", isSpecial: true },
        ].map((chip) => {
          let isSelected = false;
          if (chip.op === "todos" && chip.tp === "todos" && chip.st === "todos") {
            isSelected = operationFilter === "todos" && typeFilter === "todos" && statusFilter === "todos";
          } else if (chip.op !== "todos") {
            isSelected = operationFilter === chip.op;
          } else if (chip.tp !== "todos") {
            isSelected = typeFilter === chip.tp;
          } else if (chip.st !== "todos") {
            isSelected = statusFilter === chip.st;
          }

          return (
            <button
              key={chip.label}
              type="button"
              onClick={() => {
                if (chip.op === "todos" && chip.tp === "todos" && chip.st === "todos") {
                  setOperationFilter("todos");
                  setTypeFilter("todos");
                  setStatusFilter("todos");
                } else if (chip.op !== "todos") {
                  setOperationFilter(operationFilter === chip.op ? "todos" : chip.op);
                } else if (chip.tp !== "todos") {
                  setTypeFilter(typeFilter === chip.tp ? "todos" : chip.tp);
                } else if (chip.st !== "todos") {
                  setStatusFilter(statusFilter === chip.st ? "todos" : chip.st);
                }
              }}
              className={`shrink-0 text-xs px-3.5 py-1.5 rounded-[3px] border transition-all flex items-center gap-1.5 ${
                isSelected
                  ? "bg-neutral-900 text-white border-neutral-900 font-semibold shadow-xs"
                  : "bg-white text-stone-700 border-stone-300 hover:border-stone-400"
              }`}
            >
              {chip.isSpecial && <Sparkles className="w-3 h-3 text-gold-500" />}
              <span>{chip.label}</span>
            </button>
          );
        })}
      </div>

      {/* Barra de Filtros Interactiva */}
      <div className="bg-white p-4 sm:p-6 rounded-sm border border-neutral-200 shadow-sm space-y-4">
        {/* Fila 1: Búsqueda de texto y Operación */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6">
            <div className="relative">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3.5 sm:top-3" />
              <input
                type="text"
                placeholder="Buscar por barrio, calle, título o REF..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-stone-50 border border-neutral-300 rounded-sm focus:outline-none focus:border-gold-500 text-neutral-800"
              />
            </div>
          </div>

          <div className="hidden sm:block sm:col-span-3">
            <select
              value={operationFilter}
              onChange={(e) => setOperationFilter(e.target.value)}
              className="w-full py-2.5 px-3 text-xs bg-stone-50 border border-neutral-300 rounded-sm focus:outline-none focus:border-gold-500 text-neutral-800"
            >
              <option value="todos">Todas las Operaciones</option>
              <option value="venta">Venta Directa</option>
              <option value="alquiler">Alquiler Tradicional / Diplomático</option>
              <option value="pozo">En Pozo / Preventa</option>
            </select>
          </div>

          <div className="hidden sm:block sm:col-span-3">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full py-2.5 px-3 text-xs bg-stone-50 border border-neutral-300 rounded-sm focus:outline-none focus:border-gold-500 text-neutral-800"
            >
              <option value="todos">Todos los Tipos</option>
              <option value="casa">Casas & Residencias</option>
              <option value="departamento">Departamentos & Penthouses</option>
              <option value="loteo">Loteos & Fracciones</option>
              <option value="desarrollo">Emprendimientos</option>
              <option value="comercial">Comerciales & Oficinas</option>
            </select>
          </div>

          {/* Botón para desplegar más filtros en móviles */}
          <div className="sm:hidden flex items-center justify-between gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex-1 py-2 px-3 bg-stone-100 hover:bg-stone-200 text-neutral-800 text-xs font-semibold rounded-sm flex items-center justify-center gap-1.5 transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-gold-600" />
              <span>{showAdvancedFilters ? "Ocultar Filtros Avanzados" : "Más Filtros (Precio, Ambientes)"}</span>
            </button>
            <button
              onClick={handleResetFilters}
              type="button"
              className="py-2 px-3 border border-neutral-300 text-neutral-600 text-xs rounded-sm hover:bg-neutral-50"
              title="Limpiar"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Fila 2: Filtros secundarios (Rango de precios, dormitorios, estado) */}
        <div className={`grid-cols-2 sm:grid-cols-12 gap-3 pt-2 border-t border-neutral-100 ${
          showAdvancedFilters ? "grid" : "hidden sm:grid"
        }`}>
          {/* En mobile, mostrar select de operación y tipo si se abrió avanzado */}
          <div className="col-span-1 sm:hidden">
            <label className="block text-[10px] text-neutral-500 uppercase font-semibold mb-1">Operación</label>
            <select
              value={operationFilter}
              onChange={(e) => setOperationFilter(e.target.value)}
              className="w-full py-2 px-2.5 text-xs bg-stone-50 border border-neutral-300 rounded-sm focus:outline-none"
            >
              <option value="todos">Todas</option>
              <option value="venta">Venta</option>
              <option value="alquiler">Alquiler</option>
              <option value="pozo">En Pozo</option>
            </select>
          </div>

          <div className="col-span-1 sm:hidden">
            <label className="block text-[10px] text-neutral-500 uppercase font-semibold mb-1">Tipo</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full py-2 px-2.5 text-xs bg-stone-50 border border-neutral-300 rounded-sm focus:outline-none"
            >
              <option value="todos">Todos</option>
              <option value="casa">Casas</option>
              <option value="departamento">Deptos</option>
              <option value="loteo">Loteos</option>
              <option value="desarrollo">Emprendimientos</option>
            </select>
          </div>

          <div className="col-span-2 sm:col-span-3">
            <label className="block text-[10px] text-neutral-500 uppercase font-semibold mb-1 sm:hidden">Rango de Precio (USD)</label>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                placeholder="Mín (USD)"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full py-2 px-2.5 text-xs bg-stone-50 border border-neutral-300 rounded-sm focus:outline-none focus:border-gold-500 text-neutral-800"
              />
              <span className="text-neutral-400 text-xs">-</span>
              <input
                type="number"
                placeholder="Máx (USD)"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full py-2 px-2.5 text-xs bg-stone-50 border border-neutral-300 rounded-sm focus:outline-none focus:border-gold-500 text-neutral-800"
              />
            </div>
          </div>

          <div className="col-span-1 sm:col-span-3">
            <label className="block text-[10px] text-neutral-500 uppercase font-semibold mb-1 sm:hidden">Dormitorios</label>
            <select
              value={bedroomsFilter}
              onChange={(e) => setBedroomsFilter(e.target.value)}
              className="w-full py-2 px-3 text-xs bg-stone-50 border border-neutral-300 rounded-sm focus:outline-none focus:border-gold-500 text-neutral-800"
            >
              <option value="todos">Dormitorios (Todos)</option>
              <option value="1">1+ Dormitorio</option>
              <option value="2">2+ Dormitorios</option>
              <option value="3">3+ Dormitorios</option>
              <option value="4">4+ Dormitorios</option>
            </select>
          </div>

          <div className="col-span-1 sm:col-span-3">
            <label className="block text-[10px] text-neutral-500 uppercase font-semibold mb-1 sm:hidden">Estado</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-2 px-3 text-xs bg-stone-50 border border-neutral-300 rounded-sm focus:outline-none focus:border-gold-500 text-neutral-800"
            >
              <option value="todos">Estado (Todos)</option>
              <option value="oportunidad">Solo Oportunidades</option>
              <option value="disponible">Disponibles</option>
              <option value="reservado">Reservadas</option>
            </select>
          </div>

          <div className="hidden sm:flex sm:col-span-3 justify-end items-center gap-2">
            <button
              type="button"
              onClick={() => setOnly3DTour(!only3DTour)}
              className={`text-xs flex items-center gap-1.5 py-2 px-2.5 rounded-sm border transition-all ${
                only3DTour
                  ? "bg-gold-500 text-luxury-black border-gold-500 font-semibold"
                  : "bg-stone-50 text-neutral-700 border-neutral-300 hover:border-neutral-400"
              }`}
            >
              <Box className="w-3 h-3 text-current" />
              <span>Recorridos 3D</span>
            </button>

            <button
              type="button"
              onClick={() => setOnlyVideoTour(!onlyVideoTour)}
              className={`text-xs flex items-center gap-1.5 py-2 px-2.5 rounded-sm border transition-all ${
                onlyVideoTour
                  ? "bg-red-600 text-white border-red-600 font-semibold"
                  : "bg-stone-50 text-neutral-700 border-neutral-300 hover:border-neutral-400"
              }`}
            >
              <Play className={`w-3 h-3 ${onlyVideoTour ? "fill-white text-white" : "fill-red-600 text-red-600"}`} />
              <span>Video Tours</span>
            </button>

            <button
              onClick={handleResetFilters}
              type="button"
              className="text-xs text-neutral-500 hover:text-neutral-900 flex items-center gap-1.5 py-2 px-3 border border-neutral-200 rounded-sm hover:bg-neutral-100 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpiar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Barra de Resultados, Ordenamiento y Switcher de Vista */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
        <div className="text-xs text-neutral-500">
          Mostrando <span className="font-semibold text-neutral-900">{filteredProperties.length}</span> propiedades encontradas
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-neutral-500">Ordenar por:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="py-1.5 px-2.5 text-xs bg-white border border-neutral-300 rounded-sm focus:outline-none focus:border-gold-500 text-neutral-800 font-medium"
            >
              <option value="destacados">Destacados primero</option>
              <option value="recientes">Más recientes</option>
              <option value="precio_asc">Precio: Menor a Mayor</option>
              <option value="precio_desc">Precio: Mayor a Menor</option>
            </select>
          </div>

          <div className="flex items-center border border-neutral-300 rounded-sm overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 ${
                viewMode === "grid" ? "bg-neutral-900 text-white" : "bg-white text-neutral-500 hover:text-neutral-900"
              }`}
              title="Vista Cuadrícula"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 ${
                viewMode === "list" ? "bg-neutral-900 text-white" : "bg-white text-neutral-500 hover:text-neutral-900"
              }`}
              title="Vista Lista"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Cuadrícula o Lista de Propiedades */}
      {filteredProperties.length > 0 ? (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "grid grid-cols-1 gap-4"
          }
        >
          {filteredProperties.map((prop) => (
            <PropertyCard
              key={prop.id}
              property={prop}
              onSelectProperty={(p) => setSelectedProperty(p)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white border border-neutral-200 rounded-sm space-y-4">
          <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-neutral-400">
            <Inbox className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl font-bold text-neutral-800">
            No se encontraron propiedades con los criterios seleccionados
          </h3>
          <p className="text-xs text-neutral-500 max-w-md mx-auto">
            Pruebe relajando los filtros de precio, tipo de propiedad o búsqueda por zona.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-2 bg-neutral-900 text-white text-xs font-semibold px-4 py-2.5 rounded-sm hover:bg-neutral-800 transition-colors"
          >
            Restablecer todos los filtros
          </button>
        </div>
      )}

      {/* Modal de Detalle */}
      <PropertyDetailModal
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
      />
    </div>
  );
}

export default function PropiedadesPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-neutral-500">Cargando catálogo...</div>}>
      <PropiedadesContent />
    </Suspense>
  );
}
