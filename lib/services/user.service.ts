import { unstable_cache, revalidateTag } from "next/cache";
import { prisma } from "@/lib/utils/db";
import { AuditCategory, Municipality, UserRole } from "@prisma/client";
import { CreateUserByAdminInput } from "@/lib/validations/user.schema";

/**
 * Ruta/Componente/Servicio: User Service
 * Descripción: Provee funciones para la gestión de usuarios por parte de administradores, incluyendo obtención de datos y modificación de roles.
 * Requiere: Autenticación como ADMIN (para operaciones de escritura).
 * Implementa: HU-014
 */

export const getUserById = unstable_cache(
  async (id: string) => {
    if (!id) return null;

    try {
      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          phone: true,
          municipality: true,
          address: true,
          idNumber: true,
          birthDate: true,
          isActive: true,
          blockedAt: true,
          blockReason: true,
          createdAt: true,
          updatedAt: true,
          shelter: {
            select: { id: true, name: true, verified: true },
          },
          vendor: {
            select: { id: true, businessName: true, verified: true },
          },
        },
      });

      if (!user) return null;

      const resourceIds = [id];
      if (user.shelter?.id) resourceIds.push(user.shelter.id);
      if (user.vendor?.id) resourceIds.push(user.vendor.id);

      const auditRecords = await prisma.systemAuditLog.findMany({
        where: {
          OR: [
            { resourceId: { in: resourceIds } },
            { actorId: id },
          ],
        },
        orderBy: { createdAt: "desc" },
        take: 20,
      });

      return { ...user, auditRecords };
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      return null;
    }
  },
  ["user-detail"],
  {
    revalidate: 300, // 5 minutos
    tags: ["user-detail"],
  }
);

export async function updateUserRole(
  userId: string,
  newRole: UserRole,
  adminId: string,
  adminEmail: string,
  reason: string,
  ipAddress?: string,
  userAgent?: string,
) {
  const currentUser = await prisma.user.findUnique({ where: { id: userId } });
  if (!currentUser) throw new Error("User not found");

  if (userId === adminId) {
    throw new Error("Cannot change your own role");
  }

  if (currentUser.role === UserRole.ADMIN) {
    throw new Error("Cannot change the role of another admin");
  }

  const requestId = crypto.randomUUID();

  const transaction = await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    }),
    prisma.systemAuditLog.create({
      data: {
        category: AuditCategory.USER_MANAGEMENT,
        action: "CHANGE_ROLE",
        actorId: adminId,
        actorEmail: adminEmail,
        resourceType: "USER",
        resourceId: userId,
        before: JSON.stringify({ role: currentUser.role }),
        after: JSON.stringify({ role: newRole }),
        reason,
        ipAddress,
        userAgent,
        requestId,
      },
    }),
  ]);

  revalidateTag("user-detail");

  return transaction[0];
}

export async function createUserByAdmin(
  payload: CreateUserByAdminInput & { hashedPassword: string },
  adminId: string,
  adminEmail: string,
  ipAddress?: string,
  userAgent?: string,
) {
  const {
    email,
    name,
    phone,
    municipality,
    address,
    idNumber,
    birthDate,
    role,
    reason,
    hashedPassword,
  } = payload;

  const requestId = crypto.randomUUID();

  // Razón de auditoría: obligatoria y personalizada si rol es ADMIN
  // (garantizada por createUserByAdminSchema.refine); texto fijo en cualquier otro rol.
  const auditReason =
    role === UserRole.ADMIN && reason
      ? reason
      : "Usuario creado manualmente por administrador";

  // Transacción interactiva: permite usar newUser.id como resourceId
  // en el registro de auditoría (no posible con $transaction([...]) paralela).
  const newUser = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email,
        name,
        phone,
        municipality: municipality as Municipality,
        address,
        idNumber,
        birthDate: new Date(birthDate),
        role: role as UserRole,
        password: hashedPassword,
        isActive: true,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        municipality: true,
        createdAt: true,
      },
    });

    await tx.systemAuditLog.create({
      data: {
        category: AuditCategory.USER_MANAGEMENT,
        action: "CREATE",
        actorId: adminId,
        actorEmail: adminEmail,
        resourceType: "USER",
        resourceId: user.id,
        before: null,
        after: JSON.stringify({ email, role }),
        reason: auditReason,
        requestId,
        ipAddress,
        userAgent,
      },
    });

    return user;
  });

  // Invalidar caché de detalle de usuario, igual que updateUserRole
  revalidateTag("user-detail");

  return newUser;
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Este servicio encapsula toda la lógica de negocio relacionada con la
 * gestión de usuarios por parte de los administradores. Se encarga de
 * obtener datos detallados de los usuarios y de manejar operaciones
 * sensibles como el cambio de roles y el alta manual de cuentas.
 *
 * Lógica Clave:
 * - 'getUserById':
 *   - Utiliza 'unstable_cache' de Next.js para cachear los detalles del
 *     usuario durante 5 minutos. Esto mejora el rendimiento al reducir las
 *     consultas a la base de datos en visitas repetidas a la misma página.
 *   - El 'select' está optimizado para traer solo los datos necesarios
 *     para la vista de detalle, incluyendo relaciones clave como el albergue
 *     o vendedor asociado y los últimos 20 registros de auditoría.
 *   - Se utiliza el tag 'user-detail' para poder invalidar este caché
 *     específico cuando se realiza una actualización.
 *
 * - 'updateUserRole':
 *   - Implementa validaciones de seguridad críticas ANTES de tocar la base
 *     de datos: previene que un admin se cambie su propio rol o que modifique
 *     a otro admin.
 *   - Utiliza una transacción '$transaction' de Prisma para garantizar la
 *     atomicidad. O la actualización del rol y la creación del registro de
 *     auditoría se completan con éxito, o ambas fallan. Esto previene
 *     estados inconsistentes en los datos.
 *   - Después de una actualización exitosa, llama a 'revalidateTag' para
 *     invalidar el caché de 'getUserById', asegurando que la próxima visita
 *     a la página de detalle muestre los datos más recientes.
 *
 * - 'createUserByAdmin':
 *   - Recibe el payload ya validado por Zod en el Route Handler (campos del
 *     schema + hashedPassword) y los metadatos del admin como parámetros
 *     explícitos: adminId, adminEmail, ipAddress?, userAgent?.
 *   - Usa $transaction interactiva (async (tx) => ...) en lugar de la forma
 *     paralela ($transaction([...])), lo que permite acceder a user.id
 *     inmediatamente después del user.create y usarlo como resourceId en
 *     el systemAuditLog.create, completando así el registro de auditoría.
 *   - Razón de auditoría condicional: si role === ADMIN usa el campo reason
 *     del payload (obligatorio por el refine del schema); en cualquier otro
 *     rol usa el texto fijo 'Usuario creado manualmente por administrador'.
 *   - SystemAuditLog.action = 'CREATE' es un String libre en Prisma, válido
 *     sin migración. before = null (el usuario no existía previamente).
 *   - Invalida el tag 'user-detail' al finalizar, igual que updateUserRole,
 *     para que la vista de detalle refleje el nuevo usuario inmediatamente.
 *
 * Dependencias Externas:
 * - 'next/cache': Para las funciones de cacheo 'unstable_cache' e
 *   invalidación 'revalidateTag'.
 * - '@prisma/client': Para la interacción con la base de datos y los
 *   enums ('UserRole', 'AuditCategory', 'Municipality').
 * - '@/lib/utils/db': Instancia de PrismaClient.
 * - '@/lib/validations/user.schema': Tipo 'CreateUserByAdminInput' para
 *   tipar el payload de la función 'createUserByAdmin'.
 *
 */
