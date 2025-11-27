import { z } from 'zod';
import { PetStatus, Municipality } from '@prisma/client';

/**
 * Schema de validación para CRUD de mascotas (TAREA-014)
 * 
 * VALIDACIÓN DE 3 CAPAS:
 * 1. Cliente (formulario): Validación inmediata
 * 2. API (endpoints): Validación con Zod antes de BD
 * 3. Prisma: Validación de tipos en base de datos
 */

// ========== ESQUEMA DE CREACIÓN DE MASCOTA ==========
/**
 * RFC-001: Crear mascota
 * - Requerido: name, species, description
 * - Opcional: breed, age, sex, requirements
 * - Solo SHELTER puede crear
 */
export const petCreateSchema = z.object({
  name: z
    .string()
    .min(2, 'Nombre debe tener al menos 2 caracteres')
    .max(100, 'Nombre no puede exceder 100 caracteres'),

  species: z
    .string()
    .min(2, 'Especie debe tener al menos 2 caracteres')
    .max(50, 'Especie no puede exceder 50 caracteres'),

  breed: z
    .string()
    .min(1, 'Raza no puede estar vacía')
    .max(100, 'Raza no puede exceder 100 caracteres')
    .optional()
    .nullable(),

  age: z
    .number()
    .int('Edad debe ser un número entero')
    .min(0, 'Edad no puede ser negativa')
    .max(50, 'Edad máxima permitida: 50 años')
    .optional()
    .nullable(),

  sex: z
    .enum(['MALE', 'FEMALE', 'UNKNOWN'], {
      message: 'Sexo debe ser MALE, FEMALE o UNKNOWN',
    })
    .optional()
    .nullable(),

  description: z
    .string()
    .min(10, 'Descripción debe tener al menos 10 caracteres')
    .max(1000, 'Descripción no puede exceder 1000 caracteres'),

  requirements: z
    .string()
    .min(5, 'Requisitos debe tener al menos 5 caracteres')
    .max(500, 'Requisitos no puede exceder 500 caracteres')
    .optional()
    .nullable(),

  // Array de URLs de imágenes (Cloudinary)
  images: z
    .array(
      z
        .string()
        .url('Cada imagen debe ser una URL válida')
    )
    .min(1, 'Se requiere al menos una imagen')
    .max(10, 'Máximo 10 imágenes por mascota')
    .optional()
    .default([]),
});

export type PetCreateInput = z.infer<typeof petCreateSchema>;

// ========== ESQUEMA DE ACTUALIZACIÓN DE MASCOTA ==========
/**
 * RFC-002: Actualizar mascota
 * - Todos los campos son opcionales (PATCH)
 * - Solo propietario del albergue puede editar
 */
export const petUpdateSchema = z.object({
  name: z
    .string()
    .min(2, 'Nombre debe tener al menos 2 caracteres')
    .max(100, 'Nombre no puede exceder 100 caracteres')
    .optional(),

  species: z
    .string()
    .min(2, 'Especie debe tener al menos 2 caracteres')
    .max(50, 'Especie no puede exceder 50 caracteres')
    .optional(),

  breed: z
    .string()
    .min(1, 'Raza no puede estar vacía')
    .max(100, 'Raza no puede exceder 100 caracteres')
    .optional()
    .nullable(),

  age: z
    .number()
    .int('Edad debe ser un número entero')
    .min(0, 'Edad no puede ser negativa')
    .max(50, 'Edad máxima permitida: 50 años')
    .optional()
    .nullable(),

  sex: z
    .enum(['MALE', 'FEMALE', 'UNKNOWN'], {
      message: 'Sexo debe ser MALE, FEMALE o UNKNOWN',
    })
    .optional()
    .nullable(),

  description: z
    .string()
    .min(10, 'Descripción debe tener al menos 10 caracteres')
    .max(1000, 'Descripción no puede exceder 1000 caracteres')
    .optional(),

  requirements: z
    .string()
    .min(5, 'Requisitos debe tener al menos 5 caracteres')
    .max(500, 'Requisitos no puede exceder 500 caracteres')
    .optional()
    .nullable(),

  // Array de URLs de imágenes (Cloudinary)
  images: z
    .array(
      z
        .string()
        .url('Cada imagen debe ser una URL válida')
    )
    .min(1, 'Se requiere al menos una imagen')
    .max(10, 'Máximo 10 imágenes por mascota')
    .optional(),
});

export type PetUpdateInput = z.infer<typeof petUpdateSchema>;

// ========== ESQUEMA DE CAMBIO DE ESTADO ==========
/**
 * RFC-003: Cambiar estado de mascota
 * - Estados permitidos: AVAILABLE, IN_PROCESS, ADOPTED
 * - Solo propietario del albergue puede cambiar
 */
export const petStatusChangeSchema = z.object({
  status: z
    .nativeEnum(PetStatus, {
      message: 'Estado inválido. Debe ser AVAILABLE, IN_PROCESS o ADOPTED',
    }),

  // Opcional: razón del cambio de estado
  changeReason: z
    .string()
    .min(5, 'Razón debe tener al menos 5 caracteres')
    .max(300, 'Razón no puede exceder 300 caracteres')
    .optional()
    .nullable(),
});

export type PetStatusChangeInput = z.infer<typeof petStatusChangeSchema>;

/**
 * 📚 NOTAS:
 * 
 * 1. VALIDACIÓN:
 *    - Zod en cliente y servidor
 *    - Prisma validación de tipos
 * 
 * 2. CAMPOS OPCIONALES:
 *    - breed, age, sex: Información adicional de la mascota
 *    - requirements: Requisitos especiales de adopción
 * 
 * 3. IMÁGENES:
 *    - URLs de Cloudinary
 *    - Mínimo 1, máximo 10
 *    - Validación de URL
 * 
 * 4. ROLES:
 *    - SHELTER: Crear, actualizar, cambiar estado
 *    - ADOPTER: Solo lectura
 *    - ADMIN: Control total
 * 
 * 5. ESTADOS:
 *    - AVAILABLE: Disponible para adopción
 *    - IN_PROCESS: En proceso de adopción
 *    - ADOPTED: Ya adoptada
 */
