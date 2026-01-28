import { z } from "zod";
import { Municipality } from "@prisma/client";

/**
 * Descripción: Esquema de validación para la creación de órdenes de compra.
 * Requiere: Zod para validación y @prisma/client para enums.
 * Implementa: HU-009 (Simulación de compra de productos).
 */

export const createOrderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string().min(1, "El ID del producto es requerido"),
      quantity: z.number().int().min(1, "La cantidad mínima es 1"),
      price: z.number().min(0, "El precio no puede ser negativo"),
    })
  ).min(1, "El carrito debe tener al menos un producto"),
  shippingMunicipality: z.nativeEnum(Municipality, {
    message: "Municipio no válido del Valle de Aburrá",
  }),
  shippingAddress: z.string().min(5, "La dirección debe ser más detallada"),
  paymentMethod: z.string().min(1, "El método de pago es requerido"),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
