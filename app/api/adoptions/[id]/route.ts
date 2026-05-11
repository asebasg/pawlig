import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/utils/db";
import { adoptionStatusChangeSchema } from "@/lib/validations/adoption.schema";
import { ZodError } from "zod";
import { adoptionService } from "@/lib/services/adoption.service";

/**
 * PATCH /api/adoptions/{id}
 * Descripción: Actualiza el estado de una postulación de adopción (Aprobada/Rechazada).
 * Requiere: Autenticación como SHELTER y ser propietario de la mascota.
 * Implementa: HU-007
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    if (!params.id) {
      return NextResponse.json({ error: "ID de postulación requerido", code: "INVALID_ID" }, { status: 400 });
    }

    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "SHELTER") {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
    }

    const shelter = await prisma.shelter.findFirst({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (!shelter) {
      return NextResponse.json({ error: "Sin albergue", code: "SHELTER_NOT_FOUND" }, { status: 404 });
    }

    const adoption = await prisma.adoption.findUnique({
      where: { id: params.id },
      include: { pet: { select: { shelterId: true } } },
    });

    if (!adoption) {
      return NextResponse.json({ error: "Postulación no encontrada" }, { status: 404 });
    }

    if (adoption.pet.shelterId !== shelter.id) {
      return NextResponse.json({ error: "No tienes permiso", message: "No eres propietario de esta mascota" }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = adoptionStatusChangeSchema.parse(body);

    const updatedAdoption = await adoptionService.updateAdoptionStatus(
      params.id,
      validatedData.status,
      validatedData.rejectionReason || undefined
    );

    return NextResponse.json({
      message: "Postulación actualizada exitosamente",
      data: updatedAdoption
    }, { status: 200 });

  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "Datos inválidos", details: error.issues }, { status: 400 });
    }
    console.error("Error al cambiar estado de postulación:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Este endpoint delega la lógica de actualización al adoptionService.
 *
 * Lógica Clave:
 * - Valida autorización y propiedad antes de actualizar.
 */
