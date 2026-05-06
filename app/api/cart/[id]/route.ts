/**
 * PUT, DELETE /api/cart/[id]
 * Descripción: Endpoints para gestionar un item específico del carrito.
 * Requiere: Autenticación de usuario.
 * Implementa: HU-009 (Gestión del carrito)
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import {
  updateCartItemQuantity,
  removeCartItem,
} from "@/lib/services/cart.service";
import { updateCartItemSchema } from "@/lib/validations/cart.schema";
import { ZodError } from "zod";

interface RouteParams {
  params: { id: string };
}

// Actualizar la cantidad de un item
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id: itemId } = params;
    const body = await req.json();

    const { quantity } = updateCartItemSchema.parse(body);

    const updatedItem = await updateCartItemQuantity(
      itemId,
      session.user.id,
      quantity,
    );

    return NextResponse.json({ success: true, cartItem: updatedItem });
  } catch (error) {
    console.error("[PUT_CART_ITEM_ERROR]", error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", details: error.issues },
        { status: 400 },
      );
    }

    const message = error instanceof Error ? error.message : "Error al actualizar la cantidad";
    return NextResponse.json(
      { error: message },
      { status: 400 },
    );
  }
}

// Eliminar un item específico
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id: itemId } = params;

    await removeCartItem(itemId, session.user.id);

    return NextResponse.json({
      success: true,
      message: "Producto eliminado del carrito",
    });
  } catch (error) {
    console.error("[DELETE_CART_ITEM_ERROR]", error);
    const message = error instanceof Error ? error.message : "Error al eliminar el producto";
    return NextResponse.json(
      { error: message },
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
 * Endpoints para operaciones a nivel de fila individual dentro del carrito (un solo CartItem).
 *
 * Lógica Clave:
 * - Parámetros de Ruta: Se captura el ID del CartItem (no del producto) dinámicamente desde la URL (`[id]`).
 * - Validación: PUT requiere validación estricta Zod sobre la nueva cantidad enviada.
 * - Control de Errores: Captura los errores de validación arrojados por el Servicio (por ejemplo "Sin stock")
 *   y devuelve un 400 Bad Request, para que el frontend pueda notificar al usuario.
 *
 */
