import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';

/**
 * POST /api/user/favorites/check
 * Descripción: Verifica cuáles de una lista de mascotas son favoritas del usuario.
 * Requiere: Usuario autenticado.
 * Implementa: Lógica de consulta de favoritos en lote.
 */
import { prisma } from '@/lib/utils/db';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ favorites: [] });
    }

    const body = await request.json();
    const { petIds } = body;

    if (!Array.isArray(petIds)) {
      return NextResponse.json({ favorites: [] });
    }

    const favorites = await prisma.favorite.findMany({
      where: {
        userId: session.user.id,
        petId: { in: petIds },
      },
      select: {
        petId: true,
      },
    });

    return NextResponse.json({
      favorites: favorites.map(f => f.petId),
    });
  } catch (error) {
    console.error('[POST /api/user/favorites/check] Error:', error);
    return NextResponse.json({ favorites: [] });
  }
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Este endpoint está diseñado para una consulta de rendimiento optimizada.
 * Permite al cliente enviar una lista de IDs de mascotas ('petIds') y
 * devuelve cuáles de esas IDs están marcadas como favoritas por el
 * usuario autenticado. Es especialmente útil en páginas de listado de
 * mascotas para mostrar el estado de "favorito" de múltiples mascotas
 * con una sola llamada a la API.
 *
 * Lógica Clave:
 * - 'Manejo de Sesión No Obligatoria': A diferencia de otros endpoints,
 *   este no devuelve un error '401 Unauthorized' si el usuario no está
 *   autenticado. En su lugar, devuelve una lista vacía de favoritos.
 *   Esto permite que el frontend funcione de manera consistente tanto
 *   para usuarios anónimos como autenticados, simplemente mostrando todos
 *   los corazones de "favorito" como inactivos para los anónimos.
 * - 'Consulta en Lote con 'in'': La consulta a la base de datos utiliza
 *   el operador 'in' de Prisma en la cláusula 'where' ('petId: { in: petIds }').
 *   Esto es mucho más eficiente que realizar una consulta a la base de
 *   datos por cada mascota en la lista, reduciendo significativamente
 *   la carga en la base de datos y mejorando el tiempo de respuesta.
 * - 'Respuesta Optimizada': La respuesta solo incluye un array de los
 *   'petId' que son favoritos. Esto minimiza el tamaño del payload de
 *   la respuesta, lo cual es beneficioso para el rendimiento del cliente.
 *
 * Dependencias Externas:
 * - 'next-auth': Para obtener la sesión del usuario de forma opcional.
 * - '@prisma/client': Para realizar la consulta eficiente a la base de
 *   datos utilizando el operador 'in'.
 *
 */
