"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import { ShelterCard } from "./shelter-card";

/**
 * Descripción: Mapa interactivo central que utiliza Leaflet y OpenStreetMap.
 * Requiere: Lista de albergues con coordenadas.
 * Implementa: ISSUE-91 (Mapa de albergues).
 */

// Fix para los iconos de Leaflet en Next.js
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Icono personalizado con estilo PawLig
const customPawIcon = L.divIcon({
  html: `
    <div class="relative flex items-center justify-center w-8 h-8 bg-primary rounded-full border-2 border-white shadow-xl hover:scale-110 transition-transform duration-200">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-paw-print">
        <circle cx="11" cy="5" r="2"/><circle cx="15" cy="5" r="2"/><circle cx="20" cy="8" r="2"/><circle cx="7" cy="8" r="2"/>
        <path d="M12 10c-3.5 0-4.5 2.5-4.5 3.5 0 2.5 1 3.5 1.5 4s1.5.5 3 0 3.5-.5 3.5-3.5c0-1-1-3.5-3.5-3.5Z"/>
      </svg>
      <div class="absolute -bottom-1 w-2 h-2 bg-primary rotate-45 border-r-2 border-b-2 border-white"></div>
    </div>
  `,
  className: "custom-marker-container",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// Helper para actualizar la vista del mapa de forma animada
function MapUpdater({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true, duration: 1 });
  }, [center, zoom, map]);
  return null;
}

interface InteractiveMapProps {
  shelters: any[];
  center: [number, number];
  zoom: number;
  onOpenLegal: (id: string) => void;
}

export default function InteractiveMap({ shelters, center, zoom, onOpenLegal }: InteractiveMapProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className="w-full h-full rounded-2xl shadow-xl z-0"
      zoomControl={false} // Lo movemos a la derecha para mejor UX
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <MapUpdater center={center} zoom={zoom} />

      {shelters.map((shelter) => (
        <Marker
          key={shelter.id}
          position={[shelter.latitude, shelter.longitude]}
          icon={customPawIcon}
        >
          <Popup className="shelter-leaflet-popup" minWidth={260}>
            <ShelterCard shelter={shelter} onOpenLegal={onOpenLegal} />
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Componente principal del mapa. Utiliza Leaflet para el renderizado y 
 * OpenStreetMap para los tiles gratuitos.
 *
 * Lógica Clave:
 * - 'customPawIcon': Marcador SVG inyectado mediante DivIcon para control total de estilos CSS.
 * - 'MapUpdater': Componente interno que reacciona a cambios en las props de centro/zoom
 *   para mover el mapa suavemente cuando el usuario usa el buscador.
 *
 */
