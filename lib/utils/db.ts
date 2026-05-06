import { PrismaClient } from "@prisma/client";

/**
 * Ruta/Componente/Servicio: Utilidad de Prisma Client
 * Descripción: Inicializa y exporta una instancia única (singleton) del cliente de Prisma, gestionando la conexión con la base de datos.
 * Requiere: Variables de entorno de la base de datos (DATABASE_URL).
 * Implementa: -
 */

const createPrismaClient = () => {
  const client = new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

  return client.$extends({
    query: {
      product: {
        async delete({ args, query }) {
          // Primero ejecutamos la eliminación del producto
          const result = await query(args);
          // Luego limpiamos los carritos (borrado en cascada manual)
          if (args.where?.id) {
            await client.cartItem.deleteMany({
              where: { productId: args.where.id as string },
            });
          }
          return result;
        },
        async update({ args, query }) {
          // Ejecutamos la actualización del producto
          const result = await query(args);
          // Si el stock llegó a 0, limpiamos los carritos
          if (args.data?.stock === 0 && args.where?.id) {
            await client.cartItem.deleteMany({
              where: { productId: args.where.id as string },
            });
          }
          return result;
        },
      },
    },
  });
};

type ExtendedPrismaClient = ReturnType<typeof createPrismaClient>;

const globalForPrisma = globalThis as unknown as {
  prisma: ExtendedPrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Este archivo implementa el patrón recomendado por Prisma para instanciar
 * 'PrismaClient' en un entorno de Next.js. Su propósito es prevenir la creación
 * de múltiples instancias del cliente durante el 'hot-reloading' en desarrollo,
 * lo que podría agotar las conexiones a la base de datos.
 *
 * Lógica Clave:
 * - 'globalForPrisma': Se utiliza el objeto global de Node.js ('globalThis') para
 *   almacenar la instancia de Prisma. Como el objeto global no se ve afectado
 *   por el 'hot-reloading', la instancia de Prisma persiste entre recargas.
 * - 'prisma ?? new PrismaClient()': Este es el núcleo del patrón singleton.
 *   Comprueba si ya existe una instancia de 'prisma' en el objeto global. Si es
 *   así, la reutiliza; de lo contrario, crea una nueva.
 * - 'Configuración de Log': El log de Prisma se configura dinámicamente según
 *   el entorno ('NODE_ENV'). En desarrollo, se activan logs detallados para
 *   facilitar la depuración, mientras que en producción solo se registran errores.
 *
 * Dependencias Externas:
 * - '@prisma/client': El cliente de Prisma, que es la herramienta fundamental
 *   para interactuar con la base de datos.
 *
 */
