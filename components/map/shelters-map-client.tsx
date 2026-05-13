"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { ShelterSearch } from "@/components/shelters/shelter-search";
import { MunicipalityFilter } from "@/components/shelters/municipality-filter";
import { LegalInfoModal } from "./legal-info-modal";
import { Loader2, SlidersHorizontal } from "lucide-react";
import { MapShelter } from "@/types/shelter";

/**
 * Descripción: Cliente principal que orquesta el mapa, los filtros y la búsqueda.
 * Requiere: Endpoints de albergues.
 * Implementa: ISSUE-91 (Página /albergues interactiva).
 */

const InteractiveMap = dynamic(() => import("./interactive-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-50 flex flex-col items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-purple-600 mb-4" />
      <p className="text-gray-500">Cargando mapa...</p>
    </div>
  ),
});

const DEFAULT_CENTER: [number, number] = [6.2442, -75.5812];
const DEFAULT_ZOOM = 12;

export function SheltersMapClient() {
  const [allShelters, setAllShelters] = useState<MapShelter[]>([]);
  const [filteredShelters, setFilteredShelters] = useState<MapShelter[]>([]);
  const [mapCenter, setMapCenter] = useState<[number, number]>(DEFAULT_CENTER);
  const [mapZoom, setMapZoom] = useState(DEFAULT_ZOOM);
  const [selectedLegalId, setSelectedLegalId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShelters = async () => {
      try {
        const res = await fetch("/api/shelters/map");
        const data = await res.json();
        setAllShelters(data.shelters || []);
        setFilteredShelters(data.shelters || []);
      } catch (err) {
        console.error("Error cargando albergues:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchShelters();
  }, []);

  const handleSelectShelter = (shelter: MapShelter) => {
    if (shelter.latitude && shelter.longitude) {
      setMapCenter([shelter.latitude, shelter.longitude]);
      setMapZoom(16);
    }
  };

  const handleFilterChange = (municipality: string) => {
    if (municipality === "ALL") {
      setFilteredShelters(allShelters);
      setMapCenter(DEFAULT_CENTER);
      setMapZoom(DEFAULT_ZOOM);
    } else {
      const filtered = allShelters.filter((s) => s.municipality === municipality);
      setFilteredShelters(filtered);
      if (filtered.length > 0) {
        setMapCenter([filtered[0].latitude, filtered[0].longitude]);
        setMapZoom(13);
      }
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar de Filtros */}
      <aside className="w-full lg:w-80 flex-shrink-0">
        <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
          <div className="flex items-center gap-2 mb-6">
            <SlidersHorizontal className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-900">Filtros</h2>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">Buscar</label>
              <ShelterSearch onSelect={handleSelectShelter} />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">Municipio</label>
              <MunicipalityFilter onFilterChange={handleFilterChange} />
            </div>
          </div>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 min-w-0">
        {!loading && (
          <div className="mb-6 flex items-center justify-between">
            <p className="text-gray-500 dark:text-gray-400">
              Mostrando {filteredShelters.length} de {allShelters.length} resultados
            </p>
          </div>
        )}

        <div className="h-[600px] w-full bg-white rounded-xl shadow-sm overflow-hidden relative">
          {loading ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-50">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
          ) : (
            <InteractiveMap
              shelters={filteredShelters}
              center={mapCenter}
              zoom={mapZoom}
              onOpenLegal={(id) => setSelectedLegalId(id)}
            />
          )}
        </div>
      </main>

      <LegalInfoModal 
        shelterId={selectedLegalId} 
        onClose={() => setSelectedLegalId(null)} 
      />
    </div>
  );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Cliente principal para la página de albergues usando el layout estándar.
 *
 */

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Este es el controlador principal de la vista de albergues.
 *
 * Lógica Clave:
 * - Dynamic Import: Es CRÍTICO para Leaflet en Next.js, de lo contrario la 
 *   compilación fallará al no encontrar el objeto 'window' en el servidor.
 * - Sincronización: El estado del mapa (zoom/center) es controlado desde aquí
 *   y pasado como props al mapa, permitiendo que el buscador "mueva" la cámara.
 *
 * Diseño:
 * - Se añadieron overlays decorativos y estados de carga pulidos para cumplir
 *   con el estándar estético del proyecto.
 *
 */
