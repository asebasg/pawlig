/**
 * Descripción: Servicio de geocodificación para convertir direcciones en coordenadas (lat, lng).
 * Requiere: API de Nominatim de OpenStreetMap.
 * Implementa: ISSUE-91 (Mapa interactivo de albergues).
 */

import { prisma } from "@/lib/utils/db";
import { Municipality } from "@prisma/client";

const NOMINATIM_API = "https://nominatim.openstreetmap.org/search";

/**
 * Función de espera para respetar los límites de la API
 */
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function geocodeAddress(
  address: string,
  municipality: Municipality
): Promise<{ lat: number; lng: number } | null> {
  try {
    // Extraer solo la vía principal, número y placa (antes de la coma)
    const coreAddress = address.split(',')[0].trim();
    const streetOnly = coreAddress.split('#')[0].trim(); // Solo ej: "Calle 2A"
    
    // Estrategia de Fallback: De más específico a más general
    const searchQueries = [
      `${coreAddress}, ${municipality}, Antioquia, Colombia`,
      `${streetOnly}, ${municipality}, Antioquia, Colombia`,
      `${municipality}, Antioquia, Colombia`
    ];
    
    for (const query of searchQueries) {
      // Respetar límite de tasa de Nominatim (1 petición por segundo)
      await sleep(1000);
      
      const response = await fetch(
        `${NOMINATIM_API}?q=${encodeURIComponent(query)}&format=json&limit=1`,
        {
          headers: {
            "User-Agent": "PawLig/1.0 (contact@pawlig.com)",
          },
        }
      );
      
      if (!response.ok) continue;
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
        };
      }
    }
    
    console.warn(`No se encontraron coordenadas para ninguna variante de: ${address} en ${municipality}`);
    return null;
  } catch (error) {
    console.error("Error geocodificando la dirección:", error);
    return null;
  }
}

export async function updateShelterCoordinates(shelterId: string): Promise<void> {
  try {
    const shelter = await prisma.shelter.findUnique({
      where: { id: shelterId },
    });
    
    if (!shelter) return;
    
    const coords = await geocodeAddress(shelter.address, shelter.municipality);
    
    if (coords) {
      await prisma.shelter.update({
        where: { id: shelterId },
        data: {
          latitude: coords.lat,
          longitude: coords.lng,
          geocodedAt: new Date(),
        },
      });
    }
  } catch (error) {
    console.error(`Error al actualizar coordenadas para el albergue ${shelterId}:`, error);
  }
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Este servicio se encarga de traducir direcciones en texto a coordenadas (latitud y longitud) 
 * utilizando la API gratuita de Nominatim (OpenStreetMap).
 *
 * Lógica Clave:
 * - Respeto estricto del límite de tasa (1 request / sec) mediante un delay intencional (sleep).
 * - Concatenación automática de municipio y "Valle de Aburrá, Colombia" para mejorar precisión.
 *
 * Dependencias Externas:
 * - Nominatim API (OpenStreetMap)
 *
 */
