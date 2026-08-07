import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { ZodError } from "zod";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/utils/db";
import { UserRole, Prisma, Municipality } from "@prisma/client";
import { createUserByAdminSchema } from "@/lib/validations/user.schema";
import { generateTempPassword, hashPassword } from "@/lib/auth/password";
import { createUserByAdmin } from "@/lib/services/user.service";

export const dynamic = "force-dynamic";

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
                            verified: true,
                            _count: {
                                select: { pets: true }
                            }
                        }
                    },
                    vendor: {
                        select: {
                            id: true,
                            businessName: true,
                            verified: true,
                            _count: {
                                select: { products: true }
                            }
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

/**
 * POST /api/admin/users
 * Descripción: Crea un usuario manualmente desde el panel de administración,
 *   sin login automático y con contraseña generada por el servidor.
 * Requiere: Sesión activa con role === "ADMIN".
 * Implementa: ISSUE-174
 */
export async function POST(request: NextRequest) {
  // ── 1. Validar sesión ────────────────────────────────────────────────────────
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json(
      { error: "No autenticado", code: "UNAUTHORIZED" },
      { status: 401 }
    );
  }

  if (session.user.role !== UserRole.ADMIN) {
    return NextResponse.json(
      { error: "Acceso denegado. Se requiere rol ADMIN.", code: "FORBIDDEN" },
      { status: 403 }
    );
  }

  // ── 2. Parsear y validar body con Zod ────────────────────────────────────────
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Cuerpo de la petición inválido", code: "VALIDATION_ERROR" },
      { status: 400 }
    );
  }

  let validatedData;

  try {
    validatedData = createUserByAdminSchema.parse(body);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Datos inválidos",
          code: "VALIDATION_ERROR",
          details: error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    }

    console.error("Error inesperado al parsear body:", error);
    return NextResponse.json(
      { error: "Error interno del servidor", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }

  // ── 3. Verificar email duplicado ─────────────────────────────────────────────
  const existingUser = await prisma.user.findUnique({
    where: { email: validatedData.email },
    select: { isActive: true },
  });

  if (existingUser) {
    if (!existingUser.isActive) {
      return NextResponse.json(
        {
          error: "El correo pertenece a una cuenta bloqueada",
          code: "ACCOUNT_BLOCKED",
          suggestion: "Desbloquea la cuenta existente desde el panel de moderación.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        error: "El correo ya está registrado en el sistema",
        code: "EMAIL_ALREADY_EXISTS",
        suggestion: "Usa otro correo o busca el usuario en el listado.",
      },
      { status: 409 }
    );
  }

  // ── 4. Generar y hashear contraseña temporal ─────────────────────────────────
  const tempPassword = generateTempPassword();
  const hashedPassword = await hashPassword(tempPassword);

  // ── 5. Crear usuario + SystemAuditLog en transacción ─────────────────────────
  let newUser;

  try {
    newUser = await createUserByAdmin(
      { ...validatedData, hashedPassword },
      session.user.id,
      session.user.email ?? "admin@pawlig.com",
      request.headers.get("x-forwarded-for") ??
        request.headers.get("x-real-ip") ??
        undefined,
      request.headers.get("user-agent") ?? undefined,
    );
  } catch (error) {
    console.error("[API POST /admin/users] Error al crear usuario:", error);
    return NextResponse.json(
      {
        error: "Error interno al crear el usuario",
        code: "INTERNAL_ERROR",
        details: process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 }
    );
  }

  // ── 6. Disparar email de bienvenida de forma no bloqueante ───────────────────
  // Bloqueado por sub-issue de configuración de Resend (ISSUE-174 §10).
  // Reemplazar el placeholder con sendUserCreatedByAdminEmail() cuando el
  // servicio de email esté operativo y retirar tempPassword de la respuesta.
  Promise.resolve()
    .then(() => {
      // sendUserCreatedByAdminEmail({ ...newUser, tempPassword }).catch(console.error);
    })
    .catch(console.error);

  // ── 7. Respuesta 201 ─────────────────────────────────────────────────────────
  // TEMPORAL: tempPassword expuesto hasta que el email esté operativo (§11.1).
  return NextResponse.json(
    {
      message: "Usuario creado exitosamente",
      user: newUser,
      tempPassword,
    },
    { status: 201 }
  );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Este archivo exporta dos Route Handlers para la ruta /api/admin/users.
 * El handler GET (preexistente) lista usuarios con filtros y paginación.
 * El handler POST (ISSUE-174) implementa el flujo de alta administrativa:
 * crea un usuario sin login automático, genera la contraseña en servidor y
 * registra la acción en SystemAuditLog (categoría USER_MANAGEMENT, acción CREATE).
 *
 * Lógica Clave del POST:
 * - Autenticación manual con getServerSession() porque requireRole() usa
 *   redirect(), incompatible con Route Handlers. Devuelve 401 o 403.
 * - Validación Zod con createUserByAdminSchema: el refinamiento de nivel raíz
 *   garantiza que role=ADMIN exija una justificación de 10+ chars antes de
 *   crear nada (devuelve 400 VALIDATION_ERROR si falla).
 * - Verificación previa de email duplicado con criterios consistentes al
 *   registro público: ACCOUNT_BLOCKED o EMAIL_ALREADY_EXISTS (ambos 409).
 * - Generación de contraseña con randomBytes de node:crypto (16 bytes,
 *   longitud 12) y hashing con bcrypt (12 salt rounds). La contraseña en
 *   texto plano se retorna en la respuesta 201 mientras el email no esté operativo.
 * - La creación del usuario y el registro de auditoría son atómicos via
 *   $transaction de Prisma (ver createUserByAdmin en user.service.ts).
 * - El disparo del email es no bloqueante: se envuelve en Promise.resolve()
 *   + .catch(console.error) para que un fallo de email no bloquee la respuesta.
 *
 * Dependencias Externas:
 * - next-auth: getServerSession para autenticación en Route Handlers.
 * - zod: ZodError para el manejo tipado de errores de validación.
 * - @/lib/auth/password: generateTempPassword, hashPassword.
 * - @/lib/services/user.service: createUserByAdmin (transacción + auditoría).
 * - @/lib/utils/db: Acceso directo a Prisma para verificar email duplicado.
 *
 */