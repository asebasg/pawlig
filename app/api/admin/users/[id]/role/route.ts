import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { roleUpdateSchema } from "@/lib/validations/user.schema";
import { updateUserRole } from "@/lib/services/user.service";
import { logger } from "@/lib/utils/logger";
import { UserRole } from "@prisma/client";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  // 1. Verificación de sesión y rol de ADMIN
  if (!session || session.user.role !== UserRole.ADMIN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const userId = params.id;
  const adminId = session.user.id;

  try {
    // 2. Validación del cuerpo de la petición con Zod
    const body = await request.json();
    const validation = roleUpdateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.format() },
        { status: 400 }
      );
    }

    const { newRole, reason } = validation.data;

    // Capturar IP y User-Agent para auditoría
    const ipAddress = request.headers.get("x-forwarded-for") ?? undefined;
    const userAgent = request.headers.get("user-agent") ?? undefined;

    // 3. Llamada al servicio para ejecutar la lógica de negocio
    const updatedUser = await updateUserRole(
      userId,
      newRole,
      adminId,
      reason,
      ipAddress,
      userAgent
    );

    // 4. Log de auditoría
    logger.audit("ROLE_CHANGE", adminId, userId, {
      oldRole: updatedUser.role, // El servicio devuelve el estado anterior
      newRole,
      reason,
      ipAddress,
      userAgent,
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    logger.error(`Failed to update role for user ${userId}: ${errorMessage}`, error as Error, {
      adminId,
      targetUserId: userId,
    });

    // Devolver errores específicos al cliente
    if (errorMessage.includes("not found") || errorMessage.includes("Cannot change")) {
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * **Descripción General:**
 * Este archivo define la API Route para manejar la actualización del rol de
 * un usuario. Es un endpoint protegido que solo los administradores pueden
 * utilizar. Sigue un flujo estricto de validaciones para garantizar la
 * seguridad y la integridad de los datos.
 *
 * **Lógica Clave:**
 * - Flujo de Validación Estricto:
 *   1. **Autenticación y Autorización:** Primero, se verifica si hay una
 *      sesión activa y si el usuario tiene el rol de `ADMIN`. Esta es la
 *      primera barrera de seguridad.
 *   2. **Validación de Entrada (Zod):** El cuerpo de la solicitud (`body`)
 *      se valida contra el `roleUpdateSchema`. Esto asegura que los datos
 *      recibidos (nuevo rol y razón) tengan el formato y tipo correctos
 *      antes de procesarlos.
 *   3. **Lógica de Negocio (Servicio):** La lógica principal (verificar
 *      reglas de negocio, actualizar la DB, registrar auditoría) se delega
 *      al servicio `updateUserRole`. Esto mantiene el controlador (la API
 *      route) limpio y centrado en la gestión de la solicitud/respuesta.
 * - Registro de Auditoría y Errores:
 *   - Se utiliza el `logger.audit` para registrar explícitamente el evento
 *     de cambio de rol con todos los metadatos relevantes.
 *   - En caso de error, se utiliza `logger.error` para capturar los
 *     detalles completos del fallo, lo cual es vital para la depuración.
 * - Manejo de Errores Específicos: El bloque `catch` está diseñado para
 *   devolver mensajes de error claros al cliente cuando la lógica de
 *   negocio falla (ej: "Cannot change your own role"), en lugar de un
 *   genérico "Internal Server Error".
 *
 * **Dependencias Externas:**
 * - `next/server`: Para `NextResponse`.
 * - `next-auth`: Para `getServerSession` y la gestión de sesiones.
 * - `@/lib/validations/user.schema`: Para el schema de Zod.
 * - `@/lib/services/user.service`: Para la lógica de negocio.
 * - `@/lib/utils/logger`: Para el logging estructurado.
 *
 */
