import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

/**
 * GET /api/admin/users
 * Descripción: Obtiene una lista paginada de usuarios con filtros.
 * Requiere: Autenticación como ADMIN.
 * Implementa: HU-014 (Gestión de usuarios).
 */
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/utils/db';
import { UserRole } from '@prisma/client';

export async function GET(request: NextRequest) {
    try {
        //  1. Verificar autenticación y verificación
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json(
                { error: 'No autenticado' },
                { status: 401 }
            );
        }

        // Solo ADMIN puede acceder (RF-005, HU-014)
        if (session.user.role !== UserRole.ADMIN) {
            return NextResponse.json(
                { error: 'No autorizado. Solo administradores pueden gestionar usuarios.' },
                { status: 403 }
            );
        }

        //  2. Extraer parámetros de búsqueda
        const { searchParams } = new URL(request.url);

        const role = searchParams.get('role') as UserRole | null;
        const isActiveParam = searchParams.get('isActive');
        const municipality = searchParams.get('municipality');
        const search = searchParams.get('search');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');

        // Validar paginación
        const validPage = page > 0 ? page : 1;
        const validLimit = limit > 0 && limit <= 100 ? limit : 20;
        const skip = (validPage - 1) * validLimit;

        //  3. Construir filtros dinámicos
        const where: any = {};

        // Filtro por rol
        if (role && Object.values(UserRole).includes(role)) {
            where.role = role;
        }

        // Filtro por estado activo/bloqueado (HU-014)
        if (isActiveParam !== null) {
            where.isActive = isActiveParam === 'true';
        }

        // Filtro por municipio
        if (municipality) {
            where.municipality = municipality;
        }

        // Filtro por búsqueda de texto (nombre o email)
        if (search && search.trim().length > 0) {
            where.OR = [
                { name: { contains: search.trim(), mode: 'insensitive' } },
                { email: { contains: search.trim(), mode: 'insensitive' } }
            ];
        }

        //  4. Ejecutar consulta con paginación
        const [users, totalCount] = await Promise.all([
            prisma.user.findMany({
                where,
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    municipality: true,
                    phone: true,
                    isActive: true, // Estado de bloqueo (HU-014)
                    blockedAt: true,
                    blockReason: true,
                    createdAt: true,
                    updatedAt: true,
                    // Incluir relaciones para contar actividad
                    _count: {
                        select: {
                            adoptions: true,
                            orders: true,
                            favorites: true
                        }
                    },
                    // Incluir datos de albergue/vendedor si aplica
                    shelter: {
                        select: {
                            id: true,
                            name: true,
                            verified: true
                        }
                    },
                    vendor: {
                        select: {
                            id: true,
                            businessName: true,
                            verified: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: validLimit
            }),
            prisma.user.count({ where })
        ]);

        // 5. CALCULAR METADATA DE PAGINACIÓN
        const totalPages = Math.ceil(totalCount / validLimit);
        const hasNextPage = validPage < totalPages;
        const hasPrevPage = validPage > 1;

        // 6. RESPUESTA EXITOSA
        return NextResponse.json({
            success: true,
            data: users,
            pagination: {
                page: validPage,
                limit: validLimit,
                totalCount,
                totalPages,
                hasNextPage,
                hasPrevPage
            }
        });

    } catch (error) {
        console.error('[API /admin/users GET] Error:', error);

        return NextResponse.json(
            {
                error: 'Error al obtener usuarios',
                details: error instanceof Error ? error.message : 'Error desconocido'
            },
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
 * Este endpoint proporciona una funcionalidad robusta para que los
 * administradores obtengan una lista paginada y filtrada de todos los
 * usuarios del sistema. Es una herramienta clave para la gestión y
 * monitorización de usuarios.
 *
 * Lógica Clave:
 * - 'Autorización de Administrador': El acceso a esta ruta está
 *   estrictamente limitado a los usuarios con el rol de 'ADMIN'. Cualquier
 *   otro rol recibirá un error '403 Forbidden'.
 * - 'Construcción Dinámica de Filtros': La cláusula 'where' de Prisma
 *   se construye dinámicamente basándose en los parámetros de consulta
 *   ('query params') proporcionados en la URL. Esto permite filtrar
 *   usuarios por rol, estado de actividad ('isActive'), municipio y un
 *   término de búsqueda general (nombre o email).
 * - 'Consulta Optimizada con Paginación':
 *   - Se utiliza 'Promise.all' para ejecutar dos consultas en paralelo:
 *     una para obtener los datos de los usuarios ('findMany') y otra para
 *     obtener el conteo total de registros que coinciden con los filtros
 *     ('count'). Esto es más eficiente que realizar las consultas
 *     secuencialmente.
 *   - Se implementa la paginación utilizando los parámetros 'skip' y 'take'
 *     de Prisma, asegurando que solo se devuelva un subconjunto de datos
 *     en cada solicitud.
 * - 'Selección de Datos Relevantes': La consulta 'select' está diseñada
 *   para devolver solo la información necesaria para la vista de
 *   administración, incluyendo datos de relaciones como '_count' (para
 *   mostrar la actividad del usuario) y detalles del 'shelter' o 'vendor'
 *   asociado.
 *
 * Dependencias Externas:
 * - 'next-auth': Para la autenticación y la verificación del rol 'ADMIN'.
 * - '@prisma/client': Para la construcción de consultas complejas a la
 *   base de datos, incluyendo filtros dinámicos y paginación.
 *
 */
