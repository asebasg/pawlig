/**
 * Descripción: Servicio de negocio para la generación de reportes y métricas de adopciones.
 * Requiere: Prisma client y tipos de reportes estandarizados.
 * Implementa: HU-011.
 */

import { prisma } from "@/lib/utils/db";
import { AdoptionReportFilters, AdoptionReportData } from "@/types/report.types";
import { Prisma } from "@prisma/client";

export async function getAdoptionMetrics(shelterId: string, filters: AdoptionReportFilters) {
  const { startDate, endDate, municipality, status } = filters;

  const whereClause: Prisma.AdoptionWhereInput = {
    pet: { shelterId },
  };

  if (startDate || endDate) {
    whereClause.createdAt = {};
    if (startDate) whereClause.createdAt.gte = new Date(startDate);
    if (endDate) whereClause.createdAt.lte = new Date(endDate);
  }

  if (status) {
    whereClause.status = status;
  }

  if (municipality) {
    whereClause.adopter = { municipality };
  }

  // 1. Obtener adopciones
  const adoptionsRaw = await prisma.adoption.findMany({
    where: whereClause,
    include: {
      adopter: {
        select: {
          name: true,
          municipality: true,
        },
      },
      pet: {
        select: {
          name: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // 2. Mapear al tipo estándar (sin any)
  const adoptions: AdoptionReportData[] = adoptionsRaw.map((a) => ({
    id: a.id,
    adoptionDate: a.createdAt,
    adopterName: a.adopter.name,
    petName: a.pet.name,
    municipality: a.adopter.municipality,
    status: a.status,
  }));

  // 3. Calcular totales y métricas por municipio
  const total = adoptions.length;
  
  const byMunicipality = adoptions.reduce<Record<string, number>>((acc, adoption) => {
    const muni = adoption.municipality as string;
    if (!acc[muni]) {
      acc[muni] = 0;
    }
    acc[muni]++;
    return acc;
  }, {});

  return {
    adoptions,
    total,
    byMunicipality,
  };
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Contiene la lógica para calcular las métricas de adopción de un albergue.
 *
 * Lógica Clave:
 * - Filtra por rango de fechas, estado y municipio usando queries estructuradas.
 * - Mapea directamente las consultas de Prisma al DTO `AdoptionReportData` 
 *   para asegurar la consistencia del tipo en el cliente y evitar "any".
 *
 */
