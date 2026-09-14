import { z } from "zod";

export const createBlogSchema = z.object({
  title: z.string().min(5, "El título debe tener al menos 5 caracteres.").max(100, "El título no puede superar los 100 caracteres."),
  excerpt: z.string().min(10, "El extracto debe tener al menos 10 caracteres.").max(300, "El extracto no puede superar los 300 caracteres."),
  content: z.string().min(20, "El contenido es muy corto."),
  featured: z.string().url("Debe ser una URL válida").optional().or(z.literal("")),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  tags: z.array(z.string()).max(5, "Máximo 5 etiquetas (tags)."),
});

export const updateBlogSchema = createBlogSchema.partial();

export const blogQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(10),
  tag: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  search: z.string().optional(),
  sort: z.enum(["recent", "views"]).optional().default("recent"),
});

export type CreateBlogInput = z.infer<typeof createBlogSchema>;
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>;
export type BlogQueryInput = z.infer<typeof blogQuerySchema>;
