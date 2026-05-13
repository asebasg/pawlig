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
    // Construir la consulta de búsqueda geográfica
    const query = `${address}, ${municipality}, Valle de Aburrá, Colombia`;
    
    // Respetar límite de tasa de Nominatim (1 petición por segundo)
    await sleep(1000);
    
    const response = await fetch(
      `${NOMINATIM_API}?q=${encodeURIComponent(query)}&format=json&limit=1`,
      {
        headers: {
          "User-Agent": "PawLig/1.0 (contact@pawlig.com)", // Nominatim requiere un User-Agent válido
        },
      }
    );
    
    if (!response.ok) {
      console.error(`Error en API de Nominatim: ${response.statusText}`);
      return null;
    }
    
    const data = await response.json();
    
    if (!data || data.length === 0) {
      console.warn(`No se encontraron coordenadas para: ${query}`);
      return null;
    }
    
    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
    };
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
