import { z } from 'zod';
import { PetStatus } from '@prisma/client';

/**
 * Ruta/Componente/Servicio: Esquemas de Mascota
 * Descripción: Define los esquemas de validación de Zod para las operaciones CRUD de las mascotas.
 * Requiere: -
 * Implementa: HU-005, RF-009, RN-007
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

export const updatePetSchema = createPetSchema
    .omit({ shelterId: true })
    .partial();

export const updatePetStatusSchema = z.object({
    status: z.nativeEnum(PetStatus, {
        error: () => ({
            message: "Estado inválido. Usa: AVAILABLE, IN_PROCESS o ADOPTED"
        }),
    }),
});

export const shelterPetsFilterSchema = z.object({
    status: z.nativeEnum(PetStatus).optional(),
    page: z.number().int().positive().default(1),
    limit: z.number().int().min(1).max(50).default(20),
})

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
 * Este archivo establece las reglas de validación para los datos de las
 * mascotas. Utiliza Zod para asegurar que cualquier dato de mascota, ya sea
 * para creación o actualización, cumpla con los requisitos del negocio
 * antes de llegar a la capa de servicio o a la base de datos.
 *
 * Lógica Clave:
 * - 'createPetSchema': Define el esquema estricto para registrar una nueva
 *   mascota. Incluye todas las validaciones de campos requeridos, como
 *   longitudes de texto, valores de enums y, crucialmente, la regla de
 *   negocio 'RN-007' que exige al menos una imagen ('images.min(1)').
 * - 'updatePetSchema': Un esquema derivado para la actualización. Utiliza
 *   '.omit({ shelterId: true })' para prohibir el cambio del albergue
 *   asociado y '.partial()' para hacer que todos los campos sean opcionales,
 *   permitiendo así actualizaciones parciales de los datos de la mascota.
 * - 'updatePetStatusSchema': Un esquema pequeño y enfocado para manejar
 *   únicamente el cambio de estado de una mascota, asegurando que el nuevo
 *   estado sea uno de los valores permitidos por el enum 'PetStatus'.
 *
 * Dependencias Externas:
 * - 'zod': Para la creación de todos los esquemas de validación.
 * - '@prisma/client': Para el enum 'PetStatus', que mantiene la
 *   consistencia de los estados con la base de datos.
 *
 */
