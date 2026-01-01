import { PrismaClient } from '@prisma/client';

/**
 * Utilidad: Cliente de Prisma
 * Descripción: Inicializa y exporta una instancia única del cliente de Prisma.
 * Requiere: -
 * Implementa: Patrón singleton para la conexión a la base de datos en desarrollo.
 */
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Este archivo es responsable de instanciar y exportar el cliente de Prisma.
 * Utiliza un patrón específico para evitar la creación de múltiples
 * instancias del cliente en entornos de desarrollo, lo cual es una
 * práctica recomendada por Prisma con Next.js.
 *
 * Lógica Clave:
 * - 'Singleton en Desarrollo': En desarrollo, el 'hot-reloading' de Next.js
 *   puede hacer que se creen nuevas instancias de 'PrismaClient' en cada
 *   recarga, agotando las conexiones a la base de datos. Para evitarlo, la
 *   instancia del cliente se almacena en el objeto 'globalThis' (que no se
 *   ve afectado por el 'hot-reloading'). El código verifica si ya existe una
 *   instancia en 'globalThis.prisma' y la reutiliza si es así.
 * - 'Logging Condicional': El nivel de log de Prisma se configura
 *   dinámicamente según el entorno ('NODE_ENV'). En desarrollo, se activan
 *   logs detallados ('query', 'error', 'warn'), mientras que en producción
 *   solo se registran los errores.
 *
 * Dependencias Externas:
 * - '@prisma/client': La dependencia principal para instanciar el cliente
 *   de Prisma.
 *
 */
