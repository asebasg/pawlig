/**
 * GET /api/shelters/map
 * Descripción: Endpoint para obtener todos los albergues verificados con sus coordenadas y conteo de mascotas.
 * Requiere: Ninguno (ruta pública).
 * Implementa: ISSUE-91 (Mapa interactivo de albergues).
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/utils/db";

export async function GET() {
  try {
    const shelters = await prisma.shelter.findMany({
      where: {
        verified: true,
        latitude: { not: null },
        longitude: { not: null },
      },
      select: {
        id: true,
        name: true,
        municipality: true,
        address: true,
        latitude: true,
        longitude: true,
        contactWhatsApp: true,
        contactInstagram: true,
        _count: {
          select: {
            pets: {
              where: { status: "AVAILABLE" },
            },
          },
        },
      },
    });

    // Formatear la respuesta para el frontend
    const formattedShelters = shelters.map((s: any) => ({
      id: s.id,
      name: s.name,
      municipality: s.municipality,
      address: s.address,
      latitude: s.latitude,
      longitude: s.longitude,
      contactWhatsApp: s.contactWhatsApp,
      contactInstagram: s.contactInstagram,
      petCount: s._count.pets,
    }));

    return NextResponse.json({ shelters: formattedShelters });
  } catch (error) {
    console.error("Error obteniendo albergues para el mapa:", error);
    return NextResponse.json(
      { error: "Error al cargar los albergues del mapa" },
      { status: 500 }
    );
  }
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Este endpoint retorna la información necesaria para pintar los marcadores en el 
 * mapa interactivo. Filtra albergues que ya tengan coordenadas y sean verificados.
 *
 * Lógica Clave:
 * - Se incluye el conteo de mascotas en estado "AVAILABLE" usando la proyección _count de Prisma.
 *
 */
