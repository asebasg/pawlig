import { z } from "zod";

export const addToCartSchema = z.object({
  productId: z.string().min(1, "El ID del producto es obligatorio"),
  quantity: z
    .number()
    .int("La cantidad debe ser un número entero")
    .min(1, "La cantidad mínima es 1")
    .default(1),
});

export const updateCartItemSchema = z.object({
  quantity: z
    .number()
    .int("La cantidad debe ser un número entero")
    .min(1, "La cantidad mínima es 1"),
});
