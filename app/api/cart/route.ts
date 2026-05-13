/**
 * GET, POST, DELETE /api/cart
 * Descripción: Endpoints principales para la gestión global del carrito.
 * Requiere: Autenticación de usuario.
 * Implementa: HU-009 (Gestión del carrito)
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import {
  getCartItems,
  addToCart,
  clearCart,
} from "@/lib/services/cart.service";
import { addToCartSchema } from "@/lib/validations/cart.schema";
import { ZodError } from "zod";

// Obtener carrito del usuario actual
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const items = await getCartItems(session.user.id);

    // Calcular resumen
    const subtotal = items.reduce(
      (acc: number, item: typeof items[0]) => acc + item.product.price * item.quantity,
      0,
    );
    const itemsCount = items.reduce((acc: number, item: typeof items[0]) => acc + item.quantity, 0);

    return NextResponse.json({
      success: true,
      items,
      summary: {
        subtotal,
        total: subtotal,
        itemsCount,
      },
    });
  } catch (error) {
    console.error("[GET_CART_ERROR]", error);
    return NextResponse.json(
      { error: "Error al cargar el carrito" },
      { status: 500 },
    );
  }
}

// Agregar producto al carrito
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await req.json();

    // Validación con Zod
    const { productId, quantity } = addToCartSchema.parse(body);

    const cartItem = await addToCart(session.user.id, productId, quantity);

    return NextResponse.json({ success: true, cartItem }, { status: 201 });
  } catch (error) {
    console.error("[POST_CART_ERROR]", error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", details: error.issues },
        { status: 400 },
      );
    }

    const message = error instanceof Error ? error.message : "Error al agregar al carrito";
    return NextResponse.json(
      { error: message },
      { status: 400 },
    );
  }
}

// Vaciar el carrito completo
export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    await clearCart(session.user.id);

    return NextResponse.json({
      success: true,
      message: "Carrito vaciado exitosamente",
    });
  } catch (error) {
    console.error("[DELETE_CART_ERROR]", error);
    return NextResponse.json(
      { error: "Error al vaciar el carrito" },
      { status: 500 },
    );
  }
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Endpoints globales del carrito. Manejan la obtención (GET), agregación (POST)
 * y limpieza total (DELETE) del carrito para el usuario autenticado.
 *
 * Lógica Clave:
 * - Autenticación: Verifica 'getServerSession' en todas las peticiones para seguridad.
 * - Validación Fuerte: Usa 'addToCartSchema' (Zod) y atrapa errores tipo ZodError para evitar
 *   que peticiones corruptas lleguen a Prisma.
 * - Cálculos en vuelo: El GET calcula dinámicamente el subtotal en lugar de almacenarlo en la BD
 *   (para evitar inconsistencias si el vendedor cambia el precio base del producto).
 *
 */
