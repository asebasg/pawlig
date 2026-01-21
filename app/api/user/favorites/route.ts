import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/utils/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * GET /api/user/favorites
 * Obtiene la lista de mascotas favoritas del usuario autenticado
 * 
 * Requerimientos:
 * - HU-004: Visualización del Panel de Usuario
 * - RF-005: Sistema de favoritos
 * 
 * Respuesta:
 * - Array de mascotas con datos del albergue
 * - Total de favoritos
 */
export async function GET() {
    try {
        // Verificar autenticación
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json(
                { error: 'Debes iniciar sesión para ver favoritos' },
                { status: 401 }
            );
        }

        const userId = session.user.id;

        // Obtener favoritos con relación a mascota y albergue
        const favorites = await prisma.favorite.findMany({
            where: {
                userId,
            },
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
                createdAt: 'desc',
            },
        });

        // Transformar respuesta para que sea más limpia
        const transformedFavorites = favorites.map((fav) => ({
            id: fav.pet.id,
            name: fav.pet.name,
            species: fav.pet.species,
            breed: fav.pet.breed,
            age: fav.pet.age,
            sex: fav.pet.sex,
            status: fav.pet.status,
            description: fav.pet.description,
            images: fav.pet.images,
            shelter: fav.pet.shelter,
            addedToFavoritesAt: fav.createdAt,
        }));

        return NextResponse.json(
            {
                success: true,
                data: transformedFavorites,
                total: transformedFavorites.length,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error obteniendo favoritos:', error);

        return NextResponse.json(
            { error: 'Error al obtener favoritos' },
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
 * Este endpoint retorna las mascotas marcadas como favoritas por el usuario.
 *
 * Lógica Clave:
 * - Relaciones Anidadas: Utiliza un include profundo en Prisma para traer
 *   los datos de la mascota Y los datos de su albergue en una sola consulta.
 * - Transformación: Aplana la estructura de respuesta para facilitar su
 *   consumo en el frontend.
 *
 * Dependencias Externas:
 * - prisma: Acceso a datos.
 *
 */
