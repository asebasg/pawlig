import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export const dynamic = "force-dynamic";
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/utils/db';
import { UserRole } from '@prisma/client';

export async function GET() {
    try {
        //  1. Verificar autenticación y autorización
        const session = await getServerSession(authOptions);

        // Verificar que el usuario esté autenticado
        if (!session || !session.user) {
            return NextResponse.json(
                {
                    error: 'No autenticado',
                    code: 'UNAUTHORIZED',
                    message: 'Debes iniciar sesión para acceder a este recurso',
                },
                { status: 401 } // 401 Unauthorized
            );
        }

        // Verificar que el usuario tenga rol ADMIN
        if (session.user.role !== UserRole.ADMIN) {
            return NextResponse.json(
                {
                    error: 'Acceso denegado',
                    code: 'FORBIDDEN',
                    message: 'No tienes permisos para acceder a este recurso',
                    requiredRole: UserRole.ADMIN,
                    userRole: session.user.role,
                },
                { status: 403 } // 403 Forbidden
            );
        }

        //  2. Consultar solicitudes pendientes (verified = false)
        const pendingRequests = await prisma.shelter.findMany({
            where: {
                verified: false, // Solo solicitudes pendientes
                rejectionReason: null, // Excluir rechazadas previamente
            },
            include: {
                user: {
                    select: {
                        // Datos del representante (sin password)
                        id: true,
                        email: true,
                        name: true,
                        phone: true,
                        municipality: true,
                        address: true,
                        idNumber: true,
                        createdAt: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc', // Más recientes primero
            },
        });

        //  3️. Transformar datos para el frontend
        const formattedRequests = pendingRequests.map((shelter) => ({
            id: shelter.id,
            status: 'PENDING_APPROVAL', // Estado explícito
            submittedAt: shelter.createdAt,

            // Datos del albergue
            shelter: {
                name: shelter.name,
                nit: shelter.nit,
                municipality: shelter.municipality,
                address: shelter.address,
                description: shelter.description || 'Sin descripción',
                contactWhatsApp: shelter.contactWhatsApp || 'No proporcionado',
                contactInstagram: shelter.contactInstagram || 'No proporcionado',
            },

            // Datos del representante
            representative: {
                id: shelter.user.id,
                name: shelter.user.name,
                email: shelter.user.email,
                phone: shelter.user.phone,
                municipality: shelter.user.municipality,
                address: shelter.user.address,
                idNumber: shelter.user.idNumber,
            },

            // Metadatos útiles
            daysWaiting: Math.floor(
                (new Date().getTime() - new Date(shelter.createdAt).getTime()) /
                (1000 * 60 * 60 * 24)
            ),
        }));

        //  4️. Retornar lista de solicitudes
        return NextResponse.json(
            {
                requests: formattedRequests,
                total: formattedRequests.length,
                metadata: {
                    retrievedAt: new Date().toISOString(),
                    retrievedBy: {
                        id: session.user.id,
                        email: session.user.email,
                    },
                },
            },
            { status: 200 }
        );
    } catch (error) {
        //  5️. Manejo de errores
        console.error('❌ Error al obtener solicitudes de albergues:', error);
        return NextResponse.json(
            {
                error: 'Error interno del servidor',
                code: 'INTERNAL_ERROR',
                details: process.env.NODE_ENV === 'development' ? String(error) : undefined,
            },
            { status: 500 }
        );
    }
}

/**
 * 📚 NOTAS DE IMPLEMENTACIÓN:
 * 
 * 1. SEGURIDAD CRÍTICA (CORREGIDA):
 *    - getServerSession() verifica autenticación
 *    - Validación explícita de rol ADMIN
 *    - Sin esta validación, cualquiera podría ver solicitudes pendientes
 *    - Status 401 (no autenticado) vs 403 (sin permisos)
 * 
 * 2. FILTRADO DE SOLICITUDES:
 *    - verified = false: Solo pendientes
 *    - rejectionReason = null: Excluye rechazadas previamente
 *    - orderBy createdAt desc: Más recientes primero
 * 
 * 3. DATOS INCLUIDOS:
 *    - Shelter: Información del albergue solicitado
 *    - User: Datos del representante (sin password)
 *    - daysWaiting: Métrica útil para priorizar revisiones
 * 
 * 4. RESPUESTA ESTRUCTURADA:
 *    - requests: Array de solicitudes formateadas
 *    - total: Contador para paginación futura
 *    - metadata: Auditoría de quién consultó y cuándo
 * 
 * 5. CÓDIGOS DE ESTADO HTTP:
 *    - 200: Éxito (con lista vacía si no hay solicitudes)
 *    - 401: No autenticado (sin sesión)
 *    - 403: Sin permisos (rol diferente a ADMIN)
 *    - 500: Error interno del servidor
 * 
 * 6. TRAZABILIDAD:
 *    - RF-006: Gestionar usuarios (incluyendo albergues) ✅
 *    - HU-002: Solicitud y aprobación de cuenta ✅
 *    - RN-004: Aprobación requerida por administrador ✅
 * 
 * 7. MEJORAS FUTURAS:
 *    - Paginación (limit, offset)
 *    - Filtros adicionales (por municipio, fecha)
 *    - Ordenamiento configurable
 *    - Búsqueda por nombre o NIT
 */
