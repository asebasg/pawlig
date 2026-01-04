import { z } from "zod";

/**
 * Ruta/Componente/Servicio: Esquema de Intención de Subida a Cloudinary
 * Descripción: Define un esquema de Zod para validar la carpeta de destino antes de generar una firma de subida segura.
 * Requiere: -
 * Implementa: RNF-004
 */

export const uploadIntentSchema = z.object({
  folder: z.enum(["pets", "products", "avatars"], {
    message: "Carpeta de destino no permitida"
  }),
});

export type UploadIntent = z.infer<typeof uploadIntentSchema>;

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Este archivo proporciona una capa de seguridad para la generación de firmas
 * de subida de Cloudinary. Al validar la 'intención de subida' del cliente
 * contra una lista predefinida de carpetas permitidas, se previene que un
 * actor malicioso pueda solicitar una firma para subir archivos a una
 * ubicación no autorizada en el bucket de Cloudinary.
 *
 * Lógica Clave:
 * - 'z.enum': Se utiliza 'z.enum' para crear una lista blanca estricta de las
 *   únicas carpetas de destino válidas ('pets', 'products', 'avatars'). Si el
 *   cliente solicita una firma para cualquier otra carpeta, la validación
 *   fallará, y la solicitud será rechazada antes de interactuar con el SDK
 *   de Cloudinary.
 *
 * Dependencias Externas:
 * - 'zod': Para la creación del esquema de validación.
 *
 */
