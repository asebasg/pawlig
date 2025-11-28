/**
 *  Esquemas de validación para mascotas
 * 
 * PROPÓSITO:
 * - Validar datos de entrada en cliente y servidor
 * - Garantizar cumplimiento de RN-007 (mínimo 1 foto)
 * - Validar campos obligatorios según RF-009
 * 
 * TRAZABILIDAD:
 * - HU-005: Publicación y gestión de mascota
 * - RF-009: Registro de animales para adopción
 * - RN-007: Mínimo una foto por mascota
 */

import { z } from 'zod';
import { PetStatus } from '@prisma/client';

/**
 *  Enums de especies permitidas
 * Extensible para otras en el futuro
 */

export const PetSpecies = {
    DOG: "Perro",
    CAT: "Gato",
    OTHER: "Otro"
}

/**
 *  Enum de sexos permitidos
 */

export const PetSex = {
    MALE: "Macho",
    FEMALE: "Hembra"
}

/**
 *  Schema para crear una nueva mascota
 * 
 * VALIDACIONES:
 * - Nombre: 2-50 caracteres
 * - Especie: Valores predefinidos
 * - Edad: 0-30 años (opcional)
 * - Descripción: 20-1000 caracteres
 * - Imágenes: Array no vacío (RN-007)
 * - shelterId: ObjectId válido (propiedad del albergue)
 */

export const createPetSchema = z.object({
    // Datos básicos obligatorios
    name: z
        .string()
        .min(2, "El nombre debe tener al menos 2 caracteres")
        .max(50, "El nombre no puede exceder los 50 caracteres")
        .trim(),

    species: z.enum(
        [PetSpecies.DOG, PetSpecies.CAT, PetSpecies.OTHER],
        {
            error: () => ({ message: "Selecciona una especie válida" }),
        }
    ),

    breed: z
        .string()
        .min(2, "La raza debe tener al menos 2 caracteres")
        .max(30, "La raza no puede exceder los 30 caracteres.")
        .optional()
        .nullable(),

    age: z
        .number()
        .int()
        .min(0, "La edad no puede ser negativa")
        .max(30, "La edad no puede superar los 30 años")
        .optional()
        .nullable(),

    sex: z.enum(
        [PetSex.MALE, PetSex.FEMALE],
        {
            error: () => ({ message: "Selecciona un sexo válido" })
        }
    ),

    // Descripción detallada (obligatoria)
    description: z
        .string()
        .min(10, "La descripción no puede tener menos de 10 caracteres")
        .max(500, "La descripción no puede superar los 500 caracteres")
        .trim(),

    // Requisitos de adopción
    requirements: z
        .string()
        .min(10, "Los requisitos para adoptar no pueden tener menos de 10 caracteres")
        .max(500, "Los requisitos para adoptar no pueden superar los 500 caracteres")
        .trim()
        .optional(),

    // Imágenes (Mínimo 1 por mascota)
    images: z
        .array(z.string().url("Cada imagen debe ser una URL válida"))
        .min(1, "Debes subir al menos una foto de la mascota (RN-007)")
        .max(5, "Máximo 5 fotos permitidas"),

    // Relación con el albergue
    shelterId: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, "ID de albergue inválido"),
});

/**
 *  Schema para actualizar una mascota existente
 * 
 * DIFERENCIAS con createPetSchema:
 * - Todos los campos son opcionales (partial)
 * - No requiere shelterId (no se puede cambiar)
 * - Permite validar actualizaciones parciales
 */

export const updatePetSchema = createPetSchema
    .omit({ shelterId: true })
    .partial();

/**
*  Schema para cambiar el estado de una mascota
* 
* USO:
* - Criterio de aceptación: cambio de estado retira de búsqueda
* - Estados válidos: AVAILABLE, IN_PROCESS, ADOPTED
*/

export const updatePetStatusSchema = z.object({
    status: z.nativeEnum(PetStatus, {
        error: () => ({
            message: "Estado inválido. Usa: AVAILABLE, IN_PROCESS o ADOPTED"
        }),
    }),
});

/**
 *  Schema para búsqueda de mascotas del albergue
 * (Reutilizable desde HU-006 con filtro por shelterId)
 */

export const shelterPetsFilterSchema = z.object({
    status: z.nativeEnum(PetStatus).optional(),
    page: z.number().int().positive().default(1),
    limit: z.number().int().min(1).max(50).default(20),
})

//  ====== TIPOS TYPESCRIPT INFERIDOS ======

export type CreatePetInput = z.infer<typeof createPetSchema>;
export type UpdatePetInput = z.infer<typeof updatePetSchema>;
export type UpdatePetStatusInput = z.infer<typeof updatePetStatusSchema>;
export type ShelterPetsFilter = z.infer<typeof shelterPetsFilterSchema>;
