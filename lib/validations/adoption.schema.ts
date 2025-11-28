import { z } from 'zod';
import { AdoptionStatus } from '@prisma/client';

/**
 * Schema de validación para gestión de postulaciones
 * 
 * VALIDACIÓN DE 3 CAPAS:
 * 1. Cliente (formulario): Validación inmediata
 * 2. API (endpoints): Validación con Zod antes de BD
 * 3. Prisma: Validación de tipos en base de datos
 */

// ========== ESQUEMA DE CAMBIO DE ESTADO DE POSTULACIÓN ==========
/**
 * RFC-001: Aprobar/rechazar postulación de adopción
 * - Estados permitidos: PENDING, APPROVED, REJECTED
 * - Requerido: status
 * - Opcional: rejectionReason (requerido si status es REJECTED)
 */

export const adoptionStatusChangeSchema = z.object({
  status: z
    .nativeEnum(AdoptionStatus, {
      message: 'Estado inválido. Debe ser PENDING, APPROVED o REJECTED',
    }),

  // Razón del rechazo (obligatoria si status es REJECTED)
  rejectionReason: z
    .string()
    .min(5, 'Razón debe tener al menos 5 caracteres')
    .max(500, 'Razón no puede exceder 500 caracteres')
    .optional()
    .nullable(),
}).refine(
  (data) => {
    // Si es rechazo, razón es obligatoria
    if (data.status === 'REJECTED' && !data.rejectionReason) {
      return false;
    }
    return true;
  },
  {
    message: 'Razón del rechazo es obligatoria cuando se rechaza una postulación',
    path: ['rejectionReason'],
  }
);

export type AdoptionStatusChangeInput = z.infer<typeof adoptionStatusChangeSchema>;

// ========== ESQUEMA DE CONSULTA DE POSTULACIONES ==========
/**
 *  Obtener postulaciones del albergue
 * - Filtros opcionales: status, petId, pagination
 */
export const adoptionQuerySchema = z.object({
  status: z
    .nativeEnum(AdoptionStatus)
    .optional(),

  petId: z
    .string()
    .optional(),

  page: z
    .number()
    .int('Página debe ser un número entero')
    .min(1, 'Página debe ser mayor a 0')
    .default(1),

  limit: z
    .number()
    .int('Límite debe ser un número entero')
    .min(1, 'Límite debe ser al menos 1')
    .max(50, 'Límite máximo es 50 por página')
    .default(20),
});

export type AdoptionQueryInput = z.infer<typeof adoptionQuerySchema>;

// ========== ESQUEMA PARA QUERY PARAMS (STRINGS) ==========
/**
 * Conversión de query params strings a números
 * Necesario porque query params son siempre strings
 */
export const adoptionQueryStringSchema = z.object({
  status: z
    .string()
    .optional()
    .transform((val) => val && val !== 'undefined' ? val : undefined),

  petId: z
    .string()
    .optional()
    .transform((val) => val && val !== 'undefined' ? val : undefined),

  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .pipe(z.number().int().min(1))
    .default(1),

  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 20))
    .pipe(z.number().int().min(1).max(50))
    .default(20),
});

export type AdoptionQueryStringInput = z.infer<typeof adoptionQueryStringSchema>;

/**
 * 📚 NOTAS:
 * 
 * 1. ESTADOS DE POSTULACIÓN:
 *    - PENDING: Postulación inicial, esperando revisión
 *    - APPROVED: Postulación aprobada, adopción confirmada
 *    - REJECTED: Postulación rechazada
 * 
 * 2. CAMBIO AUTOMÁTICO DE ESTADO DE MASCOTA:
 *    - APPROVED: Pet status cambia a IN_PROCESS
 *    - Si mascota tiene adopción APPROVED: Pet status ADOPTED
 *    - REJECTED: Pet mantiene AVAILABLE (si no hay otras APPROVED)
 * 
 * 3. RAZÓN DEL RECHAZO:
 *    - Obligatoria si status es REJECTED
 *    - Se almacena en tabla Adoption para auditoría
 *    - Puede ser visible al adoptante
 * 
 * 4. VALIDACIÓN CRUZADA:
 *    - REJECTED requiere rejectionReason (refine)
 *    - Previene rechazo sin justificación
 * 
 * 5. PAGINACIÓN:
 *    - Default: page=1, limit=20
 *    - Máximo: 50 por página
 */
