import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/utils/db";
import { Prisma, AdoptionStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * GET /api/adoptions
 * Obtiene las solicitudes de adopción del adoptante autenticado
 * 
 * Requerimientos:
 * - HU-004: Visualización del Panel de Usuario
 * - Criterio: Ver estado de solicitudes de adopción activas
 * - Criterio: Recibir notificación cuando cambia el estado
 * 
 * Query params:
 * - status (opcional): PENDING, APPROVED, REJECTED
 * 
 * Respuesta:
 * - Array de solicitudes de adopción con datos de mascota y albergue
 * - Total de solicitudes
 */
export async function GET(req: NextRequest) {
    try {
        // Verificar autenticación
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json(
                { error: 'Debes iniciar sesión para ver solicitudes' },
                { status: 401 }
            );
        }

        const userId = session.user.id;

        // Obtener parámetro de status (opcional)
        const statusParam = req.nextUrl.searchParams.get('status');

        // Construir filtro
        const whereClause: Prisma.AdoptionWhereInput = {
            adopterId: userId,
        };

        if (statusParam && Object.values(AdoptionStatus).includes(statusParam as AdoptionStatus)) {
            whereClause.status = statusParam as AdoptionStatus;
        }

        // Obtener solicitudes de adopción
        const adoptions = await prisma.adoption.findMany({
            where: whereClause,
            include: {
                pet: {
                    include: {
                        shelter: {
                            select: {
                                id: true,
                                name: true,
                                municipality: true,
                                contactWhatsApp: true,
                                contactInstagram: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                updatedAt: 'desc',
            },
        });

        // Transformar respuesta
        const transformedAdoptions = adoptions.map((adoption) => ({
            id: adoption.id,
            petId: adoption.pet.id,
            petName: adoption.pet.name,
            petSpecies: adoption.pet.species,
            petBreed: adoption.pet.breed,
            petAge: adoption.pet.age,
            petSex: adoption.pet.sex,
            petImages: adoption.pet.images,
            shelter: adoption.pet.shelter,
            status: adoption.status,
            message: adoption.message,
            createdAt: adoption.createdAt,
            updatedAt: adoption.updatedAt,
            isRecent: isRecentUpdate(adoption.updatedAt),
        }));

        return NextResponse.json(
            {
                success: true,
                data: transformedAdoptions,
                total: transformedAdoptions.length,
                stats: {
                    pending: adoptions.filter((a) => a.status === 'PENDING').length,
                    approved: adoptions.filter((a) => a.status === 'APPROVED').length,
                    rejected: adoptions.filter((a) => a.status === 'REJECTED').length,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error obteniendo solicitudes de adopción:', error);

        return NextResponse.json(
            { error: 'Error al obtener solicitudes de adopción' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/adoptions
 * Crear una nueva solicitud de adopción
 * 
 * Requerimientos:
 * - HU-004: Visualización del Panel de Usuario
 * - RF-006: Sistema de adopciones
 * 
 * Body:
 * {
 *   petId: string (ID de la mascota)
 *   message?: string (Mensaje opcional del adoptante)
 * }
 * 
 * Respuesta:
 * - 201: Solicitud creada exitosamente
 * - 400: Datos inválidos
 * - 401: No autenticado
 * - 409: Solicitud de adopción duplicada
 */
export async function POST(req: NextRequest) {
    try {
        // Verificar autenticación
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json(
                { error: 'Debes iniciar sesión para realizar una solicitud' },
                { status: 401 }
            );
        }

        const userId = session.user.id;
        const body = await req.json();
        const { petId, message } = body;

        // Validar petId
        if (!petId || typeof petId !== 'string') {
            return NextResponse.json(
                { error: 'ID de mascota inválido' },
                { status: 400 }
            );
        }

        // Validar mensaje (si se proporciona)
        if (message && (typeof message !== 'string' || message.length > 500)) {
            return NextResponse.json(
                { error: 'Mensaje debe ser una cadena de hasta 500 caracteres' },
                { status: 400 }
            );
        }

        // Verificar que la mascota existe y está disponible
        const pet = await prisma.pet.findUnique({
            where: { id: petId },
            select: { id: true, status: true, name: true },
        });

        if (!pet) {
            return NextResponse.json(
                { error: 'Mascota no encontrada' },
                { status: 404 }
            );
        }

        if (pet.status !== 'AVAILABLE') {
            return NextResponse.json(
                { error: 'Esta mascota no está disponible para adopción' },
                { status: 400 }
            );
        }

        // Verificar si ya existe una solicitud de adopción activa para esta mascota y usuario
        const existingAdoption = await prisma.adoption.findUnique({
            where: {
                adopterId_petId: {
                    adopterId: userId,
                    petId,
                },
            },
        });

        if (existingAdoption) {
            return NextResponse.json(
                {
                    error: 'Ya tienes una solicitud de adopción para esta mascota',
                    status: existingAdoption.status,
                },
                { status: 409 }
            );
        }

        // Crear solicitud de adopción
        const adoption = await prisma.adoption.create({
            data: {
                adopterId: userId,
                petId,
                message: message || null,
                status: 'PENDING',
            },
            include: {
                pet: {
                    include: {
                        shelter: {
                            select: {
                                id: true,
                                name: true,
                                municipality: true,
                            },
                        },
                    },
                },
            },
        });

        return NextResponse.json(
            {
                success: true,
                message: 'Solicitud de adopción enviada exitosamente',
                adoption: {
                    id: adoption.id,
                    petId: adoption.pet.id,
                    petName: adoption.pet.name,
                    shelter: adoption.pet.shelter,
                    status: adoption.status,
                    createdAt: adoption.createdAt,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creando solicitud de adopción:', error);

        return NextResponse.json(
            { error: 'Error al crear solicitud de adopción' },
            { status: 500 }
        );
    }
}

/**
 * Verifica si una actualización es reciente (últimas 24 horas)
 * Usado para destacar notificaciones
 */
function isRecentUpdate(updatedAt: Date): boolean {
    const now = new Date();
    const diffInMs = now.getTime() - updatedAt.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    return diffInHours < 24;
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Este endpoint centraliza la gestión de las postulaciones de adopción.
 * Permite listar las postulaciones propias (GET) y crear nuevas (POST).
 *
 * Lógica Clave:
 * - Filtro de Estado: El GET acepta un query param opcional para filtrar por estado.
 * - Validación de Disponibilidad: El POST verifica rigurosamente que la mascota
 *   esté 'AVAILABLE' antes de permitir una postulación.
 * - Prevención de Duplicados: Se verifica si ya existe una solicitud activa
 *   para evitar spam.
 *
 * Dependencias Externas:
 * - prisma: Para operaciones de base de datos.
 * - next-auth: Para obtener el ID del usuario actual.
 *
 */
