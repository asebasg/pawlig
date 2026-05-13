/**
 * GET /api/shelters/[id]
 * Descripción: Obtiene información pública detallada de un albergue (NIT, descripción, representante).
 * Requiere: ID del albergue en la URL.
 * Implementa: ISSUE-91 (Modal de información legal).
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/utils/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const shelter = await prisma.shelter.findUnique({
      where: { id: params.id },
      select: {
        nit: true,
        description: true,
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!shelter) {
      return NextResponse.json(
        { error: "Albergue no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      nit: shelter.nit,
      description: shelter.description,
      representative: shelter.user.name,
    });
  } catch (error) {
    console.error("Error al obtener detalles del albergue:", error);
    return NextResponse.json(
      { error: "Error interno al obtener detalles" },
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
 * Este endpoint complementa la información del mapa cargando datos "pesados" 
 * (como la descripción larga) solo cuando el usuario lo solicita explícitamente.
 *
 * Lógica Clave:
 * - Se realiza un join con 'user' para obtener el nombre del representante legal.
 *
 */
