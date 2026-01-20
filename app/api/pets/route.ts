/**
 *  API Route: /api/pets
 * 
 * PROPÓSITO:
 * - CRUD completo de mascotas
 * - Solo accesible para albergues verificados
 * - Validación de propiedad (shelterId)
 * 
 * MÉTODOS:
 * - POST: Crear nueva mascota (HU-005)
 * - GET: Listar mascotas del albergue autenticado
 * 
 * TRAZABILIDAD:
 * - HU-005: Publicación de mascota
 * - RF-009: Registro de animales
 * - CU-004: Publicar mascota en adopción
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export const dynamic = "force-dynamic";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/utils/db";
import { UserRole, PetStatus, Municipality } from "@prisma/client";
import { createPetSchema, shelterPetsFilterSchema } from "@/lib/validations/pet.schema";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";

/**
 * POST/GET /api/pets
 * Descripción: Crea una nueva mascota en la base de datos y obtiene el listado de mascotas.
 * Requiere: Autenticación como SHELTER verificado para POST.
 * Implementa: HU-005 (Publicación de mascota).
 */
/**
 *  POST /api/pets
 *  Crear una nueva mascota
 * 
 * FLUJO:
 * 1. Verificar autenticación y rol SHELTER
 * 2. Validar que el albergue esté verificado
 * 3. Validar datos con Zod schema
 * 4. Verificar propiedad del shelterId
 * 5. Crear mascota con estado AVAILABLE
 * 6. Retornar mascota creada
 * 
 * CRITERIO DE ACEPTACIÓN:
 * "Dado que ingreso todos los datos obligatorios y al menos una foto,
 *  cuando guardo la publicación, entonces la mascota queda visible 
 *  inmediatamente con estado 'Disponible'"
 */

export async function POST(request: NextRequest) {
    try {
        //  1. Autenticación y autorización
        // Verifica que el rol sí sea SHELTER
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: "No autenticado" },
                { status: 401 }
            );
        }

        //  Solo albergues pueden crear mascotas
        if (session.user.role !== UserRole.SHELTER) {
            return NextResponse.json(
                { error: "Sólo los albergues pueden crear mascotas" },
                { status: 403 }
            );
        }

        //  2. Verificar que el albergue este verificado (HU-002)
        const shelter = await prisma.shelter.findUnique({
            where: { userId: session.user.id },
            select: { id: true, verified: true, name: true, nit: true }
        });

        if (!shelter) {
            return NextResponse.json(
                { error: "No se encontró tu perfil de albergue" },
                { status: 404 }
            );
        }

        if (!shelter.verified) {
            return NextResponse.json(
                { error: "Tu albergue debe estar verificado para publicar mascotas" },
                { status: 403 }
            );
        }

        //  3. Validación de datos
        const body = await request.json();

        const validation = createPetSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    error: "Datos inválidos",
                    details: validation.error.flatten().fieldErrors,
                },
                { status: 400 }
            );
        }

        const data = validation.data;

        //  4. Verificar propiedad del albergue
        if (data.shelterId !== shelter.id) {
            return NextResponse.json(
                { error: "No puedes publicar mascotas en nombre de otro albergue" },
                { status: 403 }
            );
        }

        //  5. Crear mascota
        const pet = await prisma.pet.create({
            data: {
                name: data.name,
                species: data.species,
                breed: data.breed,
                age: data.age,
                sex: data.sex,
                description: data.description,
                requirements: data.requirements,
                images: data.images, // URLs de Cloudinary
                status: PetStatus.AVAILABLE, // Estado inicial de la mascota
                shelterId: data.shelterId,
            },
            include: {
                shelter: {
                    select: {
                        name: true,
                        municipality: true,
                    },
                },
            },
        });

        //  6. Retornar éxito
        return NextResponse.json(
            {
                message: "Mascota publicada exitosamente",
                pet,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("[POST /api/pets] - Se ha detectado un error: ", error);

        // Manejo específico de errores Zod
        if (error instanceof ZodError) {
            const fieldErrors: Record<string, string> = {};
            error.issues.forEach((issue) => {
                const field = issue.path[0];
                if (typeof field === 'string') {
                    fieldErrors[field] = issue.message;
                }
            });
            return NextResponse.json({
                error: 'Errores de validación',
                details: fieldErrors,
            }, { status: 400 });
        }

        // Manejo específico de errores Prisma
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                return NextResponse.json(
                    { error: "Ya existe una mascota con estos datos" },
                    { status: 409 }
                );
            }
            if (error.code === 'P2025') {
                return NextResponse.json(
                    { error: "Albergue no encontrado" },
                    { status: 404 }
                );
            }
        }

        // Error genérico
        return NextResponse.json(
            { error: "Se ha producido un error al crear la mascota" },
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
 * Este archivo define la ruta API '/api/pets', que gestiona las operaciones
 * principales para las mascotas, incluyendo su creación y la obtención de
 * listados. Es un punto central que conecta el frontend con la lógica de
 * negocio y la base de datos.
 *
 * Lógica Clave:
 * - POST '/api/pets':
 *   - Autorización Robusta: Antes de procesar, verifica que el usuario
 *     esté autenticado, tenga el rol 'SHELTER' y que el albergue asociado
 *     esté verificado. Esto asegura que solo entidades autorizadas puedan
 *     crear mascotas.
 *   - Validación con Zod: Utiliza 'createPetSchema' para validar los
 *     datos de entrada. Esto garantiza la integridad de los datos antes de
 *     llegar a la base de datos y proporciona mensajes de error claros.
 *   - Manejo de Errores: Implementa un manejo de errores detallado que
 *     distingue entre errores de validación (Zod), errores de base de
 *     datos (Prisma), y errores genéricos, devolviendo códigos de estado
 *     HTTP apropiados.
 *
 * - GET '/api/pets':
 *   - Ruta Bifurcada: La lógica de esta función se divide en dos caminos.
 *     Si detecta parámetros de búsqueda pública (como especie, municipio,
 *     etc.), delega la tarea al servicio 'getPetsWithFilters' para devolver
 *     un listado público.
 *   - Acceso Privado: Si no es una búsqueda pública, la ruta asume que
 *     un albergue está solicitando su propio listado de mascotas. En este
 *     caso, aplica la autorización de 'SHELTER' y filtra las mascotas por
 *     el 'shelterId' del usuario autenticado.
 *
 * Dependencias Externas:
 * - 'next-auth': Se utiliza para obtener la sesión del usuario ('getServerSession')
 *   y proteger los endpoints, asegurando que las operaciones críticas solo
 *   sean realizadas por usuarios autenticados y con los roles correctos.
 * - 'zod': Es fundamental para la validación de los datos de entrada en 'POST'
 *   y de los parámetros de consulta en 'GET', previniendo datos malformados.
 * - '@prisma/client': El cliente de Prisma se usa para todas las interacciones
 *   directas con la base de datos, como crear una nueva mascota o buscar
 *   un albergue.
 *
 */

/**
 *  GET /api/pets
 *  Listar mascotas del albergue autenticado
 * 
 * FLUJO:
 * 1. Verificar autenticación y rol SHELTER
 * 2. Obtener shelterId del usuario
 * 3. Aplicar filtros opcionales (status, paginación)
 * 4. Retornar lista paginada de mascotas
 * 
 * QUERY PARAMS:
 * - status?: AVAILABLE | IN_PROCESS | ADOPTED
 * - page?: number (default: 1)
 * - limit?: number (default: 20, max: 50)
 */

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const session = await getServerSession(authOptions);

        // Detectar si es búsqueda pública
        const isPublicSearch = searchParams.has('species') ||
            searchParams.has('municipality') ||
            searchParams.has('search') ||
            searchParams.has('age') ||
            searchParams.has('sex') ||
            searchParams.has('status');

        // Si es búsqueda pública O usuario no es SHELTER, usar servicio público
        if (isPublicSearch || !session?.user || session.user.role !== UserRole.SHELTER) {
            const { getPetsWithFilters } = await import('@/lib/services/pet.service');

            const filters = {
                species: searchParams.get('species') || undefined,
                municipality: (searchParams.get('municipality') as Municipality) || undefined,
                status: (searchParams.get('status') as PetStatus) || 'AVAILABLE',
                age: searchParams.get('age') ? parseInt(searchParams.get('age')!) : undefined,
                sex: searchParams.get('sex') || undefined,
                search: searchParams.get('search') || undefined,
                page: parseInt(searchParams.get('page') || '1'),
                limit: parseInt(searchParams.get('limit') || '20'),
            };

            const result = await getPetsWithFilters(filters);
            return NextResponse.json(result);
        }

        // Si no es búsqueda pública, verificar que sea SHELTER
        if (session.user.role !== UserRole.SHELTER) {
            return NextResponse.json(
                { error: "No autorizado" },
                { status: 403 }
            );
        }

        const shelter = await prisma.shelter.findUnique({
            where: { userId: session.user.id },
            select: { id: true }
        });

        if (!shelter) {
            return NextResponse.json(
                { error: "No se encontró tu perfil de albergue" },
                { status: 404 }
            );
        }

        const filters = shelterPetsFilterSchema.safeParse({
            status: searchParams.get("status") || undefined,
            page: parseInt(searchParams.get("page") || "1"),
            limit: parseInt(searchParams.get("limit") || "20"),
        });

        if (!filters.success) {
            return NextResponse.json(
                { error: "Parámetros inválidos", details: filters.error.flatten() },
                { status: 400 }
            );
        }

        const { status, page, limit } = filters.data;

        const where = {
            shelterId: shelter.id,
            ...(status && { status }),
        };

        const total = await prisma.pet.count({ where });

        const pets = await prisma.pet.findMany({
            where,
            select: {
                id: true,
                name: true,
                species: true,
                breed: true,
                age: true,
                sex: true,
                status: true,
                images: true,
                description: true,
                createdAt: true,
            },
            orderBy: { createdAt: "desc" },
            skip: (page - 1) * limit,
            take: limit,
        });

        return NextResponse.json({
            pets,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("[GET /api/pets] - Se ha detectado un error: ", error);

        // Manejo específico de errores Zod
        if (error instanceof ZodError) {
            const fieldErrors: Record<string, string> = {};
            error.issues.forEach((issue) => {
                const field = issue.path[0];
                if (typeof field === 'string') {
                    fieldErrors[field] = issue.message;
                }
            });
            return NextResponse.json({
                error: 'Parámetros de consulta inválidos',
                details: fieldErrors,
            }, { status: 400 });
        }

        // Manejo específico de errores Prisma
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                return NextResponse.json(
                    { error: "Albergue no encontrado" },
                    { status: 404 }
                );
            }
        }

        // Error genérico
        return NextResponse.json(
            { error: "Error al obtener mascotas" },
            { status: 500 }
        );
    }
}
