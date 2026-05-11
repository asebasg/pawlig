import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { NextRequest, NextResponse } from "next/server";
import { adoptionService } from "@/lib/services/adoption.service";
import { AdoptionStatus, UserRole } from "@prisma/client";
import { prisma } from "@/lib/utils/db";
import { createAdoptionSchema } from "@/lib/validations/adoption.schema";
import { ShelterAdoption, UserAdoption } from "@/types/adoption";
import { ZodError } from "zod";

export const dynamic = "force-dynamic";

/**
 * GET /api/adoptions
 * Descripción: Obtiene las solicitudes de adopción, filtrando por rol.
 * Requiere: Autenticación
 * Implementa: HU-007
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Debes iniciar sesión para ver solicitudes" },
        { status: 401 },
      );
    }

    const userId = session.user.id;
    const roleParam = req.nextUrl.searchParams.get("role");
    const statusParam = req.nextUrl.searchParams.get("status") as AdoptionStatus | null;

    // Determinar si actuamos como albergue o como adoptante
    const isShelterRequest = roleParam === "shelter" || session.user.role === UserRole.SHELTER;

    // Usamos tipos explícitos para evitar implicit any
    const adoptions: (ShelterAdoption | UserAdoption)[] = isShelterRequest
      ? await (async () => {
          const shelter = await prisma.shelter.findFirst({ where: { userId } });
          if (!shelter) throw new Error("Albergue no encontrado");
          return await adoptionService.getShelterAdoptions(shelter.id, statusParam || undefined);
        })()
      : await adoptionService.getUserAdoptions(userId);

    // Filtrar por estado si es necesario (ya filtrado en el servicio para albergues, pero no para usuarios)
    const filteredAdoptions = !isShelterRequest && statusParam
      ? adoptions.filter((a) => a.status === statusParam)
      : adoptions;

    return NextResponse.json(
      {
        success: true,
        data: filteredAdoptions,
        total: filteredAdoptions.length,
        stats: {
          pending: filteredAdoptions.filter((a) => a.status === AdoptionStatus.PENDING).length,
          approved: filteredAdoptions.filter((a) => a.status === AdoptionStatus.APPROVED).length,
          rejected: filteredAdoptions.filter((a) => a.status === AdoptionStatus.REJECTED).length,
        },
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("Error obteniendo solicitudes de adopción:", error);
    const message = error instanceof Error ? error.message : "Error desconocido";
    const status = message === "Albergue no encontrado" ? 404 : 500;
    
    return NextResponse.json(
      { error: message },
      { status },
    );
  }
}

/**
 * POST /api/adoptions
 * Descripción: Crea una postulación de adopción.
 * Requiere: Autenticación
 * Implementa: HU-007, RN-012
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Debes iniciar sesión para realizar una solicitud" },
        { status: 401 },
      );
    }

    const body = await req.json();
    const validatedData = createAdoptionSchema.parse({
      ...body,
      userId: session.user.id,
    });

    const adoption = await adoptionService.createAdoption(validatedData);

    return NextResponse.json(
      {
        success: true,
        message: "Solicitud de adopción enviada exitosamente",
        adoption,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", details: error.issues },
        { status: 400 }
      );
    }
    
    const errorMessage = error instanceof Error ? error.message : "Error interno";
    const status = errorMessage.includes("encontrada") ? 404 : 
                  (errorMessage.includes("Ya existe") || errorMessage.includes("disponible")) ? 400 : 500;
                  
    console.error("Error creando solicitud de adopción:", error);
    return NextResponse.json({ error: errorMessage }, { status });
  }
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Este endpoint centraliza la gestión de postulaciones de adopción, soportando
 * tanto la visualización para adoptantes como para albergues.
 *
 * Lógica Clave:
 * - Tipado Estricto: Se utilizan interfaces explícitas y bloques asíncronos 
 *   para garantizar que la variable 'adoptions' nunca sea 'any'.
 * - Delegación: Toda la lógica pesada de negocio se delega en 'adoptionService'.
 * - Manejo de Errores: Se capturan excepciones tipadas y se retornan códigos 
 *   HTTP semánticos (404 para no encontrado, 400 para reglas de negocio).
 *
 * Dependencias Externas:
 * - adoptionService: Para el acceso a datos y lógica de negocio.
 * - next-auth: Para la gestión de sesiones.
 */
