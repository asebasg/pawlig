import { z } from 'zod';
import { PetStatus } from '@prisma/client';

/**
 * lib/validations/pet.schema.ts
 * Descripción: Esquemas de validación para mascotas, incluyendo creación, actualización y gestión de estados.
 * Requiere: Zod
 * Implementa: HU-005, RF-009, RN-007
 */

/**
 * Enums para tipos de mascotas y sexos
 */
export const PetSpecies = {
    DOG: "Perro",
    CAT: "Gato",
    OTHER: "Otro"
}

export const PetSex = {
    MALE: "Macho",
    FEMALE: "Hembra"
}

// Esquema para creación de mascotas (POST /api/pets)
export const createPetSchema = z.object({
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

    description: z
        .string()
        .min(10, "La descripción no puede tener menos de 10 caracteres")
        .max(500, "La descripción no puede superar los 500 caracteres")
        .trim(),

    requirements: z
        .string()
        .min(10, "Los requisitos para adoptar no pueden tener menos de 10 caracteres")
        .max(500, "Los requisitos para adoptar no pueden superar los 500 caracteres")
        .trim()
        .optional(),

    images: z
        .array(z.string().url("Cada imagen debe ser una URL válida"))
        .min(1, "Debes subir al menos una foto de la mascota (RN-007)")
        .max(5, "Máximo 5 fotos permitidas"),

    shelterId: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, "ID de albergue inválido"),
});

// Esquema para actualización de mascotas (PUT /api/pets/:id)
export const updatePetSchema = createPetSchema
    .omit({ shelterId: true })
    .partial();

// Esquema para cambio de estado de mascota (PATCH /api/pets/:id/status)
export const updatePetStatusSchema = z.object({
    status: z.nativeEnum(PetStatus, {
        error: () => ({
            message: "Estado inválido. Usa: AVAILABLE, IN_PROCESS o ADOPTED"
        }),
    }),
});

// Esquema para filtros de búsqueda de mascotas por albergue
export const shelterPetsFilterSchema = z.object({
    status: z.nativeEnum(PetStatus).optional(),
    page: z.number().int().positive().default(1),
    limit: z.number().int().min(1).max(50).default(20),
})

// Tipos TypeScript inferidos de los esquemas
export type CreatePetInput = z.infer<typeof createPetSchema>;
export type UpdatePetInput = z.infer<typeof updatePetSchema>;
export type UpdatePetStatusInput = z.infer<typeof updatePetStatusSchema>;
export type ShelterPetsFilter = z.infer<typeof shelterPetsFilterSchema>;

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Este archivo centraliza las validaciones de negocio para el módulo de mascotas,
 * asegurando la integridad de datos tanto en el frontend como en el backend.
 *
 * Lógica Clave:
 * - createPetSchema: Implementa RN-007 (mínimo 1 foto) y valida la relación obligatoria con shelterId.
 * - updatePetSchema: Protege la inmutabilidad de shelterId mediante .omit().
 * - updatePetStatusSchema: Restringe los estados vitales del ciclo de adopción.
 *
 * Dependencias Externas:
 * - Zod: Motor de validación de esquemas y tipado estático.
 * - @prisma/client: Sincronización con el modelo de base de datos.
 *
 */
