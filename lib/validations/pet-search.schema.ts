import { z } from 'zod';
import { Municipality, PetStatus } from '@prisma/client';

/**
 * Schema de validación para búsqueda y filtrado de mascotas
 * 
 * VALIDACIÓN DE 3 CAPAS:
 * 1. Cliente (pet-filter.tsx): Validación inmediata en el formulario
 * 2. API (pets/search/route.ts): Validación antes de consultar BD
 * 3. Prisma: Validación de tipos en base de datos
 */

export const petSearchSchema = z.object({
  //  Especie: filtro opcional
  species: z
    .string()
    .min(1, 'Especie no puede estar vacía')
    .max(50, 'Especie muy larga')
    .optional(),

  //  Municipio: debe ser un municipio válido del Valle de Aburrá
  municipality: z
    .nativeEnum(Municipality, {
      message: 'Municipio inválido. Debe ser del Valle de Aburrá'
    })
    .optional(),

  //  Sexo: "Macho", "Hembra" o vacío
  sex: z
    .enum(['Macho', 'Hembra'], {
      message: 'Sexo debe ser "Macho" o "Hembra"'
    })
    .optional(),

  //  Edad mínima: número positivo
  minAge: z
    .number({
      invalid_type_error: 'Edad mínima debe ser un número'
    })
    .int('Edad debe ser un número entero')
    .min(0, 'Edad mínima no puede ser negativa')
    .max(30, 'Edad mínima muy alta')
    .optional(),

  //  Edad máxima: número positivo mayor a minAge
  maxAge: z
    .number({
      invalid_type_error: 'Edad máxima debe ser un número'
    })
    .int('Edad debe ser un número entero')
    .min(0, 'Edad máxima no puede ser negativa')
    .max(30, 'Edad máxima muy alta')
    .optional(),

  //  Estado: solo mascotas disponibles por defecto
  status: z
    .nativeEnum(PetStatus, {
      message: 'Estado inválido'
    })
    .default(PetStatus.AVAILABLE),

  //  Paginación
  page: z
    .number({
      invalid_type_error: 'Página debe ser un número'
    })
    .int('Página debe ser un número entero')
    .min(1, 'Página debe ser mayor a 0')
    .default(1),

  limit: z
    .number({
      invalid_type_error: 'Límite debe ser un número'
    })
    .int('Límite debe ser un número entero')
    .min(1, 'Límite debe ser al menos 1')
    .max(50, 'Límite máximo es 50 mascotas por página')
    .default(20),
})
  //  Validación cruzada: maxAge debe ser mayor a minAge
  .refine(
    (data) => {
      if (data.minAge !== undefined && data.maxAge !== undefined) {
        return data.maxAge >= data.minAge;
      }
      return true;
    },
    {
      message: 'Edad máxima debe ser mayor o igual a edad mínima',
      path: ['maxAge'],
    }
  );

/**
 *  Tipo TypeScript inferido del schema
 */
export type PetSearchInput = z.infer<typeof petSearchSchema>;

/**
 *  Schema para validación en query params (strings desde URL)
 * Convierte strings a números para edad y paginación
 */
export const petSearchQuerySchema = z.object({
  species: z.string().optional(),
  municipality: z.string().optional(),
  sex: z.string().optional(),
  minAge: z.string().optional().transform((val) => val ? parseInt(val, 10) : undefined),
  maxAge: z.string().optional().transform((val) => val ? parseInt(val, 10) : undefined),
  status: z.string().optional(),
  page: z.string().optional().transform((val) => val ? parseInt(val, 10) : 1),
  limit: z.string().optional().transform((val) => val ? parseInt(val, 10) : 20),
});

/**
 * 📚 NOTAS:
 * 
 * 1. VALIDACIÓN DE 3 CAPAS:
 *    - Cliente: Validación inmediata con petSearchSchema
 *    - API: Validación con petSearchQuerySchema (convierte strings)
 *    - BD: Prisma valida tipos finales
 * 
 * 2. REFINEMENT (VALIDACIÓN CRUZADA):
 *    - maxAge >= minAge obligatorio
 *    - Solo se valida si ambos están presentes
 * 
 * 3. DEFAULTS:
 *    - status: AVAILABLE (solo mascotas disponibles)
 *    - page: 1 (primera página)
 *    - limit: 20 (20 resultados por página)
 * 
 * 4. TRANSFORMACIONES:
 *    - petSearchQuerySchema convierte strings → numbers
 *    - Necesario porque query params son siempre strings
 */
