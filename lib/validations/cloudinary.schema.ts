import { z } from "zod";

/**
 * Define los esquemas de validación utilizados por las operaciones de Cloudinary.
 * Centraliza la verificación de entradas para firma de subida, borrado individual
 * y limpieza en lote, de modo que las rutas de la API reciban datos consistentes.
 */

export const uploadIntentSchema = z.object({
  folder: z.enum(["pets", "products", "avatars"], {
    message: "Carpeta de destino no permitida",
  }),
});

export type UploadIntent = z.infer<typeof uploadIntentSchema>;

export const deleteResourceSchema = z.object({
  publicId: z
    .string({ message: "El publicId es requerido" })
    .min(1, "El publicId no puede estar vacío")
    .trim(),
  resourceType: z
    .enum(["image", "video", "raw"], {
      message: "El resourceType debe ser image, video o raw",
    })
    .optional()
    .default("image"),
  url: z.string().url("Debe ser una URL válida").optional(),
});

export type DeleteResource = z.infer<typeof deleteResourceSchema>;

/*
 * ---------------------------------------------------------------------------
 * SCHEMA: cleanupCloudinarySchema
 * ---------------------------------------------------------------------------
 * Usado por POST /api/cloudinary/cleanup para limpiar imágenes huérfanas
 * que quedaron en Cloudinary tras el abandono de un formulario sin guardar.
 * Acepta un array no vacío de objetos con la URL pública de Cloudinary.
 * El endpoint deriva el publicId en el servidor usando cloudinary-helpers.
 */

const cleanupItemSchema = z.object({
  url: z
    .string({ message: "La URL es requerida" })
    .url("Debe ser una URL válida de Cloudinary")
    .trim(),
});

export const cleanupCloudinarySchema = z.object({
  images: z
    .array(cleanupItemSchema, { message: "El campo images es requerido" })
    .min(1, "Debe incluir al menos una imagen para limpiar"),
});

export type CleanupCloudinaryInput = z.infer<typeof cleanupCloudinarySchema>;
export type CleanupItem = z.infer<typeof cleanupItemSchema>;

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Mantener estos esquemas actualizados es importante porque cualquier cambio en
 * la API de Cloudinary o en los flujos de carga/limpieza debe reflejarse aquí.
 * El objetivo es asegurar que la validación ocurra lo más cerca posible de la
 * entrada del sistema, antes de ejecutar cualquier acción de subida o borrado.
 */
