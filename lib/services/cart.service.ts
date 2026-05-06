/**
 * Descripción: Lógica de negocio y acceso a datos para el carrito de compras.
 * Requiere: Base de datos Prisma inicializada.
 * Implementa: HU-009 (Gestión del carrito)
 */

import { prisma } from "@/lib/utils/db";

// 1. Obtener todos los items del carrito de un usuario
export async function getCartItems(userId: string) {
  return await prisma.cartItem.findMany({
    where: { userId },
    include: {
      product: {
        include: {
          vendor: {
            select: {
              businessName: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

// 2. Agregar un producto al carrito
export async function addToCart(
  userId: string,
  productId: string,
  quantity: number,
) {
  // Verificamos el producto y su stock
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product || product.stock === 0) {
    throw new Error("Producto no disponible o agotado");
  }

  if (quantity < 1) {
    throw new Error("La cantidad debe ser al menos 1");
  }

  // Buscamos si el item ya existe en el carrito del usuario
  const existingItem = await prisma.cartItem.findUnique({
    where: {
      userId_productId: { userId, productId },
    },
  });

  if (existingItem) {
    // Si existe, sumamos la cantidad actual con la nueva
    const newQuantity = existingItem.quantity + quantity;

    if (newQuantity > product.stock) {
      throw new Error("La cantidad supera el stock disponible del producto");
    }

    return await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: newQuantity },
      include: { product: true },
    });
  }

  // Si no existe, validamos el stock y lo creamos
  if (quantity > product.stock) {
    throw new Error("La cantidad supera el stock disponible del producto");
  }

  return await prisma.cartItem.create({
    data: {
      userId,
      productId,
      quantity,
    },
    include: { product: true },
  });
}

// 3. Actualizar la cantidad de un item existente (+ o - en el UI)
export async function updateCartItemQuantity(
  itemId: string,
  userId: string,
  quantity: number,
) {
  if (quantity < 1) {
    throw new Error("La cantidad debe ser al menos 1");
  }

  // Buscamos el item y aprovechamos para incluir el producto (para chequear stock)
  const cartItem = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: { product: true },
  });

  if (!cartItem) {
    throw new Error("El item no existe en el carrito");
  }

  // Validamos seguridad: el usuario solo puede modificar su propio carrito
  if (cartItem.userId !== userId) {
    throw new Error("No tienes permiso para modificar este item");
  }

  // Validamos stock
  if (quantity > cartItem.product.stock) {
    throw new Error("La cantidad excede el stock disponible");
  }

  return await prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity },
    include: { product: true },
  });
}

// 4. Eliminar un item específico del carrito
export async function removeCartItem(itemId: string, userId: string) {
  // Primero validamos que el item exista y sea del usuario que lo pide
  const cartItem = await prisma.cartItem.findUnique({
    where: { id: itemId },
  });

  if (!cartItem || cartItem.userId !== userId) {
    throw new Error("Item no encontrado o sin permisos");
  }

  return await prisma.cartItem.delete({
    where: { id: itemId },
  });
}

// 5. Vaciar todo el carrito
export async function clearCart(userId: string) {
  return await prisma.cartItem.deleteMany({
    where: { userId },
  });
}
/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Centraliza toda la lógica de acceso a datos para el carrito de compras, asegurando
 * que las validaciones de stock e integridad de datos se mantengan independientemente
 * de la API que lo consuma.
 *
 * Lógica Clave:
 * - Seguridad: Todas las consultas (updates y deletes) validan que el `userId` coincida
 *   para evitar que un usuario modifique o elimine items de otro carrito.
 * - Integridad: `addToCart` y `updateCartItemQuantity` verifican constantemente el stock
 *   real en `prisma.product` antes de permitir una operación.
 * - Consolidación: `addToCart` suma las cantidades si el usuario vuelve a agregar un
 *   producto que ya estaba en su carrito (gracias al índice userId_productId).
 *
 */
