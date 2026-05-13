"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { ShelterSearch } from "@/components/shelters/shelter-search";
import { MunicipalityFilter } from "@/components/shelters/municipality-filter";
import { LegalInfoModal } from "./legal-info-modal";
import { Loader2, Heart, Info } from "lucide-react";

/**
 * Descripción: Cliente principal que orquesta el mapa, los filtros y la búsqueda.
 * Requiere: Endpoints de albergues.
 * Implementa: ISSUE-91 (Página /albergues interactiva).
 */

// Carga dinámica del mapa para evitar errores de SSR con Leaflet
const InteractiveMap = dynamic(() => import("./interactive-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-secondary/20 flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-muted-foreground/20 min-h-[500px]">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
      <p className="text-sm font-medium text-muted-foreground">Inicializando mapa interactivo...</p>
    </div>
  ),
});

const DEFAULT_CENTER: [number, number] = [6.2442, -75.5812]; // Valle de Aburrá (Medellín)
const DEFAULT_ZOOM = 12;

export function SheltersMapClient() {
  const [allShelters, setAllShelters] = useState<any[]>([]);
  const [filteredShelters, setFilteredShelters] = useState<any[]>([]);
  const [mapCenter, setMapCenter] = useState<[number, number]>(DEFAULT_CENTER);
  const [mapZoom, setMapZoom] = useState(DEFAULT_ZOOM);
  const [selectedLegalId, setSelectedLegalId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Carga inicial de todos los albergues verificados que tienen coordenadas
  useEffect(() => {
    const fetchShelters = async () => {
      try {
        const res = await fetch("/api/shelters/map");
        const data = await res.json();
        setAllShelters(data.shelters || []);
        setFilteredShelters(data.shelters || []);
      } catch (err) {
        console.error("Error cargando albergues para el mapa:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchShelters();
  }, []);

  // Acción al seleccionar un albergue en el buscador
  const handleSelectShelter = (shelter: any) => {
    if (shelter.latitude && shelter.longitude) {
      setMapCenter([shelter.latitude, shelter.longitude]);
      setMapZoom(16); // Zoom de detalle
    }
  };

  // Acción al cambiar el filtro de municipio
  const handleFilterChange = (municipality: string) => {
    if (municipality === "ALL") {
      setFilteredShelters(allShelters);
      setMapCenter(DEFAULT_CENTER);
      setMapZoom(DEFAULT_ZOOM);
    } else {
      const filtered = allShelters.filter((s) => s.municipality === municipality);
      setFilteredShelters(filtered);
      
      // Si hay resultados, centrar la cámara en el área del municipio
      if (filtered.length > 0) {
        // Promediamos coordenadas para centrar (o usamos la primera como referencia)
        setMapCenter([filtered[0].latitude, filtered[0].longitude]);
        setMapZoom(14);
      }
    }
  };

  return (
    <div className="relative w-full flex flex-col gap-8 animate-in fade-in duration-700">
      
      {/* Controles Superiores: Buscador y Filtro */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 z-[40]">
        <ShelterSearch onSelect={handleSelectShelter} />
        <MunicipalityFilter onFilterChange={handleFilterChange} />
      </div>

      {/* Contenedor del Mapa */}
      <div className="relative w-full h-[600px] md:h-[700px]">
        {loading ? (
          <div className="w-full h-full bg-muted/30 flex flex-col items-center justify-center gap-4 rounded-3xl border border-border/50">
            <Loader2 className="w-12 h-12 animate-spin text-primary/60" />
            <p className="text-sm font-medium text-muted-foreground animate-pulse">
              Consultando red de albergues verificados...
            </p>
          </div>
        ) : (
          <>
            <InteractiveMap
              shelters={filteredShelters}
              center={mapCenter}
              zoom={mapZoom}
              onOpenLegal={(id) => setSelectedLegalId(id)}
            />
            
            {/* Overlay Informativo Pequeño */}
            <div className="absolute bottom-6 left-6 z-[10] bg-white/80 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-white/50 hidden sm:flex items-center gap-3 animate-in slide-in-from-left-4 duration-500">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-foreground">
                  {filteredShelters.length} Albergues
                </span>
                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                  Listos para recibirte
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Disclaimer de la plataforma */}
      <div className="flex items-center justify-center gap-2 p-4 bg-primary/5 rounded-2xl border border-primary/10">
        <Info className="w-4 h-4 text-primary" />
        <p className="text-[11px] md:text-xs text-muted-foreground text-center">
          Todos los albergues mostrados han pasado por un proceso de verificación legal por parte de <span className="font-bold text-primary">PawLig</span>.
        </p>
      </div>

      {/* Modal de Información Legal */}
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
