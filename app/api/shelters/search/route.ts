/**
 * GET /api/shelters/search
 * Descripción: Endpoint de búsqueda de albergues para el autocomplete.
 * Requiere: Parámetro de query 'q'.
 * Implementa: ISSUE-91 (Buscador del mapa interactivo).
 */

import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/utils/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    // Retornar vacío si la query es muy corta o no existe
    if (!query || query.trim().length < 2) {
      return NextResponse.json({ results: [] });
    }

    const shelters = await prisma.shelter.findMany({
      where: {
        verified: true,
        name: {
          contains: query,
          mode: "insensitive", // Búsqueda insensible a mayúsculas
        },
      },
      select: {
        id: true,
        name: true,
        municipality: true,
        latitude: true,
        longitude: true,
        _count: {
          select: {
            pets: {
              where: { status: "AVAILABLE" },
            },
          },
        },
      },
      take: 10, // Límite de resultados para el autocomplete
    });

    const results = shelters.map((s) => ({
      id: s.id,
      name: s.name,
      municipality: s.municipality,
      latitude: s.latitude,
      longitude: s.longitude,
      petCount: s._count.pets,
    }));

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Error buscando albergues:", error);
    return NextResponse.json(
      { error: "Error al realizar la búsqueda" },
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
 * Este endpoint se utiliza para el buscador con autocompletado en el mapa de albergues.
 *
 * Lógica Clave:
 * - Búsqueda en modo 'insensitive' para facilitar UX.
 * - Limita la respuesta a 10 elementos con 'take: 10' para evitar exceso de datos.
 *
 */
