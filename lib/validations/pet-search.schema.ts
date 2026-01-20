import { z } from 'zod';
import { Municipality, PetStatus } from '@prisma/client';

/**
 * Ruta/Componente/Servicio: Esquemas de Búsqueda de Mascotas
 * Descripción: Define los esquemas de validación de Zod para los filtros de búsqueda y paginación en el listado de mascotas.
 * Requiere: -
 * Implementa: HU-004
 */

export const petSearchSchema = z.object({
  species: z
    .string()
    .min(1, 'Especie no puede estar vacía')
    .max(50, 'Especie muy larga')
    .optional(),

  municipality: z
    .nativeEnum(Municipality, {
      message: 'Municipio inválido. Debe ser del Valle de Aburrá'
    })
    .optional(),

  sex: z
    .enum(['Macho', 'Hembra'], {
      message: 'Sexo debe ser "Macho" o "Hembra"'
    })
    .optional(),

  minAge: z
    .number()
    .int('Edad debe ser un número entero')
    .min(0, 'Edad mínima no puede ser negativa')
    .max(30, 'Edad mínima muy alta')
    .optional(),

  maxAge: z
    .number()
    .int('Edad debe ser un número entero')
    .min(0, 'Edad máxima no puede ser negativa')
    .max(30, 'Edad máxima muy alta')
    .optional(),

  status: z
    .nativeEnum(PetStatus, {
      message: 'Estado inválido'
    })
    .default(PetStatus.AVAILABLE),

  page: z
    .number()
    .int('Página debe ser un número entero')
    .min(1, 'Página debe ser mayor a 0')
    .default(1),

  limit: z
    .number()
    .int('Límite debe ser un número entero')
    .min(1, 'Límite debe ser al menos 1')
    .max(50, 'Límite máximo es 50 mascotas por página')
    .default(20),
})
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

export type PetSearchInput = z.infer<typeof petSearchSchema>;

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

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Este archivo define las reglas de validación para la funcionalidad de
 * búsqueda y filtrado de mascotas. Asegura que los parámetros de entrada
 * sean válidos y coherentes antes de ser procesados por el servicio de mascotas.
 *
 * Lógica Clave:
 * - 'petSearchSchema': El esquema principal que valida los filtros cuando ya
 *   tienen el tipo de dato correcto. Utiliza '.refine' para una validación
 *   cruzada importante: 'maxAge' debe ser mayor o igual a 'minAge'.
 * - 'petSearchQuerySchema': Un esquema auxiliar diseñado específicamente para
 *   validar los parámetros de consulta de una URL. Dado que los query params
 *   siempre son strings, este esquema utiliza '.transform' para convertir
 *   los valores numéricos (como 'minAge', 'page') de string a number antes
 *   de que puedan ser validados por el esquema principal.
 * - 'Valores por Defecto': Se establecen valores por defecto para la paginación
 *   ('page' y 'limit') y para el estado ('status' como 'AVAILABLE'),
 *   simplificando la lógica en el servicio ya que estos valores siempre
 *   estarán presentes.
 *
 * Dependencias Externas:
 * - 'zod': Para la creación y validación de los esquemas.
 * - '@prisma/client': Para usar los enums 'Municipality' y 'PetStatus',
 *   manteniendo la consistencia con la base de datos.
 *
 */
