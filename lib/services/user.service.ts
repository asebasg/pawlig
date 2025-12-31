import { unstable_cache, revalidateTag } from "next/cache";
import { prisma } from "@/lib/utils/db";
import { AuditAction, UserRole } from "@prisma/client";

//  ========== OBTENER USUARIO POR ID (CON CACHÉ) ==========
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
          blockedReason: true,
          createdAt: true,
          updatedAt: true,
          shelter: {
            select: { id: true, name: true, verified: true },
          },
          vendor: {
            select: { id: true, businessName: true, verified: true },
          },
          auditRecords: {
            include: {
              performedBy: { select: { name: true, email: true } },
            },
            orderBy: { createdAt: "desc" },
            take: 20,
          },
        },
      });
      return user;
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

//  ========== ACTUALIZAR ROL DE USUARIO ==========
export async function updateUserRole(
  userId: string,
  newRole: UserRole,
  adminId: string,
  reason: string,
  ipAddress?: string,
  userAgent?: string,
) {
  const currentUser = await prisma.user.findUnique({ where: { id: userId } });
  if (!currentUser) throw new Error("User not found");

  //  Validación 1: No auto-cambio de rol
  if (userId === adminId) {
    throw new Error("Cannot change your own role");
  }

  //  Validación 2: No modificar a otros administradores
  if (currentUser.role === UserRole.ADMIN) {
    throw new Error("Cannot change the role of another admin");
  }

  //  Transacción para asegurar la atomicidad
  const transaction = await prisma.$transaction([
    //  1. Actualizar el rol del usuario
    prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    }),
    //  2. Registrar la acción en la auditoría
    prisma.userAudit.create({
      data: {
        action: AuditAction.CHANGE_ROLE,
        reason,
        oldValue: currentUser.role,
        newValue: newRole,
        adminId,
        userId,
        ipAddress,
        userAgent,
      },
    }),
  ]);

  //  Invalidar el caché después de la actualización
  revalidateTag("user-detail");

  return transaction[0]; // Retorna el usuario actualizado
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * **Descripción General:**
 * Este servicio encapsula toda la lógica de negocio relacionada con la
 * gestión de usuarios por parte de los administradores. Se encarga de
 * obtener datos detallados de los usuarios y de manejar operaciones
 * sensibles como el cambio de roles.
 *
 * **Lógica Clave:**
 * - `getUserById`:
 *   - Utiliza `unstable_cache` de Next.js para cachear los detalles del
 *     usuario durante 5 minutos. Esto mejora el rendimiento al reducir las
 *     consultas a la base de datos en visitas repetidas a la misma página.
 *   - El `select` está optimizado para traer solo los datos necesarios
 *     para la vista de detalle, incluyendo relaciones clave como el albergue
 *     o vendedor asociado y los últimos 20 registros de auditoría.
 *   - Se utiliza el tag "user-detail" para poder invalidar este caché
 *     específico cuando se realiza una actualización.
 *
 * - `updateUserRole`:
 *   - Implementa validaciones de seguridad críticas ANTES de tocar la base
 *     de datos: previene que un admin se cambie su propio rol o que modifique
 *     a otro admin.
 *   - Utiliza una transacción (`$transaction`) de Prisma para garantizar la
 *     atomicidad. O la actualización del rol y la creación del registro de
 *     auditoría se completan con éxito, o ambas fallan. Esto previene
 *     estados inconsistentes en los datos.
 *   - Después de una actualización exitosa, llama a `revalidateTag` para
 *     invalidar el caché de `getUserById`, asegurando que la próxima visita
 *     a la página de detalle muestre los datos más recientes.
 *
 * **Dependencias Externas:**
 * - `next/cache`: Para las funciones de cacheo (`unstable_cache`) e
 *   invalidación (`revalidateTag`).
 * - `@prisma/client`: Para la interacción con la base de datos y los
 *   enums (`UserRole`, `AuditAction`).
 * - `@/lib/utils/db`: Instancia de PrismaClient.
 *
 */
