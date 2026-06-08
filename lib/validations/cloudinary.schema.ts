import { z } from "zod";

/**
 * Ruta/Componente/Servicio: Schemas de Cloudinary
 * Descripción: Define los schemas de Zod para validar operaciones con recursos de Cloudinary:
 *              subida de archivos (uploadIntentSchema) y eliminacion de recursos (deleteResourceSchema).
 * Requiere: -
 * Implementa: RNF-004, Issue-135
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
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Este archivo proporciona los schemas de validacion centralizados para todas
 * las operaciones con recursos de Cloudinary en la plataforma. Cubre tanto
 * la generacion de firmas de subida (uploadIntentSchema) como la eliminacion
 * segura de recursos ya subidos (deleteResourceSchema).
 *
 * Lógica Clave:
 * - 'uploadIntentSchema': Usa 'z.enum' para crear una lista blanca estricta
 *   de carpetas de destino validas. Previene subidas a ubicaciones no
 *   autorizadas del bucket de Cloudinary.
 * - 'deleteResourceSchema': Valida el 'publicId' requerido y el 'resourceType'
 *   opcional. El 'resourceType' tiene default "image" para cubrir el caso de
 *   uso mas comun sin forzar al caller a especificarlo explicitamente.
 *   El campo 'publicId' es limpiado con '.trim()' para evitar espacios
 *   accidentales que causarian fallos en la API de Cloudinary.
 *
 * Dependencias Externas:
 * - 'zod': Para la creacion de los schemas de validacion.
 *
 */
