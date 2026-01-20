import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/utils/db';
import { UserRole, Prisma, Municipality } from '@prisma/client';

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
        const where: Prisma.UserWhereInput = {};

        // Filtro por rol
        if (role && Object.values(UserRole).includes(role)) {
            where.role = role;
        }

        // Filtro por estado activo/bloqueado (HU-014)
        if (isActiveParam !== null) {
            where.isActive = isActiveParam === 'true';
        }

        // Filtro por municipio
        if (municipality && Object.values(Municipality).includes(municipality as Municipality)) {
            where.municipality = municipality as Municipality;
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