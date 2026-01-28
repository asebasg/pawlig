import { z } from "zod";

export const createAnnouncementSchema = z.object({
  content: z.string().min(1, { message: "El contenido es requerido" }),
  expiresAt: z.string().datetime({ message: "La fecha de expiración es requerida" }),
  buttonText: z.string().optional(),
  buttonLink: z.string().optional(),
  buttonVisible: z.boolean().optional(),
});

export const updateAnnouncementSchema = z.object({
  content: z.string().min(1, { message: "El contenido es requerido" }).optional(),
  expiresAt: z.string().datetime({ message: "La fecha de expiración es requerida" }).optional(),
  buttonText: z.string().optional(),
  buttonLink: z.string().optional(),
  buttonVisible: z.boolean().optional(),
});
