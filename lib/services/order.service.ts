import { prisma } from "@/lib/utils/db";
import { CreateOrderInput } from "@/lib/validations/order.schema";

/**
 * Servicio: order.service.ts
 * Descripción: Servicio para la gestión de órdenes de compra y procesamiento de inventario.
 * Implementa: HU-009 (Simulación de compra de productos y generación de pedido).
 */

/**
 * Crea una nueva orden de compra, valida el stock y actualiza el inventario.
 * Los precios se obtienen directamente de la base de datos para evitar manipulaciones.
 * @param data - Datos de la orden validados.
 * @param userId - ID del usuario que realiza la compra.
 * @returns La orden creada con sus items.
 */
export async function createOrder(data: CreateOrderInput, userId: string) {
  return await prisma.$transaction(async (tx) => {
    let calculatedTotal = 0;
    const itemsToCreate = [];

    for (const item of data.items) {
      const product = await tx.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        throw new Error(`Producto con ID ${item.productId} no encontrado`);
      }

      if (product.stock < item.quantity) {
        throw new Error(`Stock insuficiente para "${product.name}". Disponible: ${product.stock}`);
      }

      // Seguridad: Usamos el precio real de la base de datos
      const itemTotal = product.price * item.quantity;
      calculatedTotal += itemTotal;

      itemsToCreate.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price, // Precio unitario real
      });

      // Descontar stock
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    const order = await tx.order.create({
      data: {
        userId,
        total: calculatedTotal,
        shippingMunicipality: data.shippingMunicipality,
        shippingAddress: data.shippingAddress,
        paymentMethod: data.paymentMethod,
        items: {
          create: itemsToCreate,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return order;
  });
}

/**
 * Obtiene el historial de órdenes de un usuario específico.
 * @param userId - ID del usuario.
 * @returns Lista de órdenes.
 */
export async function getUserOrders(userId: string) {
  return await prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Este servicio centraliza la lógica de negocio para las órdenes de compra,
 * integrando la validación de inventario y la persistencia de datos.
 *
 * Lógica Clave:
 * - Seguridad de Precios: Para evitar ataques de manipulación de precios desde
 *   el cliente, el servicio busca el precio actual de cada producto en la base
 *   de datos y lo utiliza para calcular el total.
 * - Transacciones: Se utiliza prisma.$transaction para garantizar la atomicidad
 *   de la creación de la orden y la actualización del stock.
 * - Validación de Stock: Se comprueba la disponibilidad en tiempo real antes de
 *   confirmar la transacción.
 *
 * Dependencias Externas:
 * - Prisma: ORM para la comunicación con la base de datos MongoDB.
 *
 */
