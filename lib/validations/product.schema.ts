import { z } from "zod";

/**
 * lib/validations/product.schema.ts
 * Descripción: Esquemas de validación Zod para la gestión de productos, incluyendo creación, actualización y stock.
 * Requiere: Zod
 * Implementa: HU-PRODUCT (Gestión de Productos)
 */

// Esquema para creación de productos (POST /api/products)
export const createProductSchema = z.object({
  name: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),

  price: z
    .number()
    .positive("El precio debe ser mayor a 0")
    .max(999999999, "El precio es demasiado alto"),

  stock: z
    .number()
    .int("El stock debe ser un número entero")
    .min(0, "El stock no puede ser negativo"),

  category: z
    .string()
    .min(1, "Debe seleccionar una categoría"),

  description: z
    .string()
    .min(20, "La descripción debe tener al menos 20 caracteres")
    .max(1000, "La descripción no puede exceder 1000 caracteres")
    .optional(),

  images: z
    .array(z.string().url("Cada imagen debe ser una URL válida"))
    .min(1, "Debe subir al menos 1 imagen del producto")
    .max(5, "No puede subir más de 5 imágenes"),

  vendorId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "ID de vendedor inválido"),
});

// Esquema para actualización de productos (PUT /api/products/:id)
export const updateProductSchema = createProductSchema
  .omit({ vendorId: true })
  .partial();

// Esquema para actualización específica de stock (PUT /api/products/:id/stock)
export const updateStockSchema = z.object({
  stock: z
    .number()
    .int("El stock debe ser un número entero")
    .min(0, "El stock no puede ser negativo"),
});

// Tipos TypeScript inferidos de los esquemas
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type UpdateStockInput = z.infer<typeof updateStockSchema>;

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Este archivo contiene los esquemas de validación Zod para todas las
 * operaciones relacionadas con productos en el sistema PawLig.
 *
 * Lógica Clave:
 * - createProductSchema: Valida la creación de productos con campos obligatorios
 *   (nombre, precio, stock, categoría, descripción, imágenes).
 * - updateProductSchema: Permite actualización parcial de campos de producto.
 * - updateStockSchema: Validación específica para actualización de inventario,
 *   asegurando que el stock nunca sea negativo.
 *
 * Dependencias Externas:
 * - Zod: Librería de validación de esquemas y type-safety.
 *
 */
