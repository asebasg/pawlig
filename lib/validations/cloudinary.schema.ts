import { z } from "zod";

/**
 * Schema para validar la intención de subida de archivos.
 * Centraliza las carpetas permitidas en todo el sistema.
 */
export const uploadIntentSchema = z.object({
  folder: z.enum(["pets", "products", "avatars"], {
    message: "Carpeta de destino no permitida"
  }),
});

export type UploadIntent = z.infer<typeof uploadIntentSchema>;