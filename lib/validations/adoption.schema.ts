import { z } from 'zod';
import { AdoptionStatus } from '@prisma/client';

/**
 * Ruta/Componente/Servicio: Esquemas de Adopción
 * Descripción: Define los esquemas de validación de Zod para las operaciones relacionadas con las postulaciones de adopción.
 * Requiere: -
 * Implementa: RFC-001
 */

export const adoptionStatusChangeSchema = z.object({
  status: z
    .nativeEnum(AdoptionStatus, {
      message: 'Estado inválido. Debe ser PENDING, APPROVED o REJECTED',
    }),

  rejectionReason: z
    .string()
    .min(5, 'Razón debe tener al menos 5 caracteres')
    .max(500, 'Razón no puede exceder 500 caracteres')
    .optional()
    .nullable(),
}).refine(
  (data) => {
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

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Este archivo centraliza las reglas de validación para todos los datos
 * relacionados con las postulaciones de adopción. Utiliza Zod para crear
 * esquemas que aseguran la integridad de los datos en la capa de API antes
 * de que interactúen con la lógica de negocio o la base de datos.
 *
 * Lógica Clave:
 * - 'adoptionStatusChangeSchema': Valida los datos para aprobar o rechazar
 *   una postulación. Utiliza '.refine' para una validación cruzada: si el
 *   'status' es 'REJECTED', el campo 'rejectionReason' se vuelve obligatorio.
 *   Esto asegura que siempre haya una justificación para un rechazo.
 * - 'adoptionQuerySchema': Define las reglas para los parámetros de consulta
 *   de postulaciones (filtros y paginación) cuando los datos ya han sido
 *   procesados y son del tipo correcto (ej: 'page' es un número).
 * - 'adoptionQueryStringSchema': Un esquema especializado que maneja la
 *   realidad de los query params de una URL, que siempre son strings.
 *   Utiliza '.transform' para convertir los strings a los tipos de datos
 *   esperados (ej: de ' "1" ' a '1') antes de aplicar las validaciones
 *   del 'adoptionQuerySchema' a través de '.pipe'.
 *
 * Dependencias Externas:
 * - 'zod': La librería principal para la declaración y validación de esquemas.
 * - '@prisma/client': Se utiliza para importar el enum 'AdoptionStatus',
 *   asegurando que los estados válidos estén sincronizados con la base de datos.
 *
 */
