/**
 *  API Route: /api/pets/[id]
 * 
 * PROPÓSITO:
 * - Actualizar datos de mascota existente
 * - Cambiar estado (AVAILABLE → ADOPTED)
 * - Eliminar mascota (soft delete vía estado)
 * 
 * MÉTODOS:
 * - GET: Obtener detalle de mascota
 * - PUT: Actualizar mascota completa
 * - PATCH: Actualizar solo estado
 * - DELETE: Eliminar mascota
 * 
 * TRAZABILIDAD:
 * - HU-005: Edición y archivo de mascotas
 * - Criterio: "Cuando cambio estado, se retira de búsqueda"
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/utils/db";
import { UserRole } from "@prisma/client";
import { updatePetSchema, updatePetStatusSchema } from "@/lib/validations/pet.schema";

/**
 *  GET /api/pets/[id]
 *  Obtener detalle de una mascota específica
 * 
 * ACCESO:
 * - Público (para galería de adopciones)
 * - Incluye datos del albergue
 */

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const petId = params.id;

        //  Validar formato ObjectId
        if (!/^[0-9a-fA-F]{24}$/.test(petId)) {
            return NextResponse.json(
                { error: "ID de mascota inválido" },
                { status: 400 }
            );
        }

        const pet = await prisma.pet.findUnique({
            where: { id: petId },
            include: {
                shelter: {
                    select: {
                        id: true,
                        name: true,
                        municipality: true,
                        address: true,
                        contactWhatsApp: true,
                        contactInstagram: true,
                    },
                },
            },
        });

        if (!pet) {
            return NextResponse.json(
                { error: "Mascota no encontrada" },
                { status: 400 }
            );
        }

        return NextResponse.json({ pet });
    } catch (error) {
        console.error("[GET /api/pets/[id]] Error:", error);
        return NextResponse.json(
            { error: "Error al obtener mascota" },
            { status: 500 }
        );
    }
}

/**
 *  PUT /api/pets/[id]
 *  Actualizar datos completos de mascota
 * 
 * FLUJO:
 * 1. Verificar autenticación (SHELTER)
 * 2. Validar propiedad de la mascota
 * 3. Validar datos con updatePetSchema
 * 4. Actualizar en base de datos
 * 
 * CRITERIO DE ACEPTACIÓN:
 * "Dado que edito la publicación de una mascota,
 * cuando guardo cambios, entonces se actualizan correctamente"
 */

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        //  1. Verificar autenticación del rol SHELTER
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== UserRole.SHELTER) {
            return NextResponse.json(
                { error: "Acceso denegado" },
                { status: 403 }
            );
        }

        const petId = params.id;

        //  2. Verificar propiedad
        const shelter = await prisma.shelter.findUnique({
            where: { userId: session.user.id },
            select: { id: true }
        });

        if (!shelter) {
            return NextResponse.json(
                { error: "Perfil de albergue no encontrado" },
                { status: 404 }
            );
        }

        const existingPet = await prisma.pet.findUnique({
            where: { id: petId },
            select: { shelterId: true }
        });

        if (!existingPet) {
            return NextResponse.json(
                { error: "Mascota no encontrada" },
                { status: 404 }
            );
        }

        if (existingPet.shelterId !== shelter.id) {
            return NextResponse.json(
                { error: "No tienes permiso para editar esta mascota" },
                { status: 403 }
            );
        }

        //  3. Validación
        const body = await request.json()
        const validation = updatePetSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    error: "Datos inválidos",
                    details: validation.error.flatten().fieldErrors
                },
                { status: 400 }
            );
        }

        //  4. Actualizar
        const updatedPet = await prisma.pet.update({
            where: { id: petId },
            data: validation.data,
            include: {
                shelter: {
                    select: {
                        id: true,
                        name: true,
                        municipality: true
                    },
                },
            },
        });

        return NextResponse.json({
            message: "Mascota actualizada exitosamente",
            pet: updatedPet,
        });
    } catch (error) {
        console.error("[PUT /api/pets/[id]] Error:", error);
        return NextResponse.json(
            { error: "Error al actualizar mascota" },
            { status: 500 }
        );
    }
}

/**
 *  PATCH /api/pets/[id]
 *  Actualizar solo el estado de la mascota
 * 
 * CRITERIO DE ACEPTACIÓN:
 * "Cuando cambio estado de 'Disponible' a 'Adoptado',
 *  entonces se retira de resultados de búsqueda activos"
 * 
 * FLUJO:
 * 1. Validar estado con updatePetStatusSchema
 * 2. Verificar propiedad
 * 3. Actualizar solo campo 'status'
 * 4. Si status = ADOPTED o IN_PROCESS, se excluye de búsqueda pública
 */

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        //  1. Autenticacion
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { error: "Acceso denegado" },
                { status: 403 }
            );
        }

        const petId = params.id;

        //  2. Validacion de estado
        const body = await request.json();
        const validation = updatePetStatusSchema.safeParse(body)

        if (!validation.success) {
            return NextResponse.json(
                {
                    error: "Estado inválido",
                    details: validation.error.flatten().fieldErrors,
                },
                { status: 400 }
            );
        }

        //  3. Verificar propiedad
        const shelter = await prisma.shelter.findUnique({
            where: { userId: session.user.id },
            select: { id: true }
        });

        if (!shelter) {
            return NextResponse.json(
                { error: "Perfil de albergue no encontrado" },
                { status: 404 }
            );
        }

        const existingPet = await prisma.pet.findUnique({
            where: { id: petId },
            select: { shelterId: true, status: true, name: true }
        });

        if (!existingPet) {
            return NextResponse.json(
                { error: "Mascota no encontrada" },
                { status: 404 }
            );
        }

        if (existingPet.shelterId !== shelter.id) {
            return NextResponse.json(
                { error: "No tienes permiso para editar esta mascota" },
                { status: 403 }
            );
        }

        //  4. Actualizar estado
        const updatedPet = await prisma.pet.update({
            where: { id: petId },
            data: { status: validation.data.status },
            select: {
                id: true,
                name: true,
                status: true,
                updatedAt: true
            }
        });

        return NextResponse.json({
            message: `Estado de ${existingPet.name} actualizado a ${updatedPet.status}`,
            pet: updatedPet,
        });
    } catch (error) {
        console.error("[PATCH /api/pets/[id]] - Se ha detectado un error:", error);
        return NextResponse.json(
            { error: "Error al actualizar estado de mascota" },
            { status: 500 }
        );
    }
}

/**
 *  DELETE /api/pets/[id]
 *  Eliminar mascota permanentemente
 * 
 * NOTA: En producción, considerar soft delete
 * (cambiar status a ARCHIVED en lugar de eliminar)
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // 1. AUTENTICACIÓN
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== UserRole.SHELTER) {
            return NextResponse.json(
                { error: "Acceso denegado" },
                { status: 403 }
            );
        }

        const petId = params.id;

        // 2. VERIFICAR PROPIEDAD
        const shelter = await prisma.shelter.findUnique({
            where: { userId: session.user.id },
            select: { id: true },
        });

        if (!shelter) {
            return NextResponse.json(
                { error: "Perfil de albergue no encontrado" },
                { status: 404 }
            );
        }

        const existingPet = await prisma.pet.findUnique({
            where: { id: petId },
            select: { shelterId: true, name: true }
        });

        if (!existingPet) {
            return NextResponse.json(
                { error: "Mascota no encontrada" },
                { status: 404 }
            );
        }

        if (existingPet.shelterId !== shelter.id) {
            return NextResponse.json(
                { error: "No tienes permiso para editar esta mascota" },
                { status: 403 }
            );
        }

        //  3. Eliminar
        await prisma.pet.delete({
            where: { id: petId },
        });

        return NextResponse.json({
            message: `Mascota "${existingPet.name}" eliminada exitosamente`,
        });
    } catch (error) {
        console.error("[DELETE /api/pets/[id]] - Se ha detectado un error:", error);
        return NextResponse.json(
            { error: "Error al eliminar mascota" },
            { status: 500 }
        );
    }
}