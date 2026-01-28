import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { createOrder } from "@/lib/services/order.service";
import { createOrderSchema } from "@/lib/validations/order.schema";
import { ZodError } from "zod";
import { UserRole } from "@prisma/client";

/**
 * POST /api/orders
 * Descripción: Crea una nueva orden de compra simulada.
 * Requiere: Usuario autenticado.
 * Implementa: HU-009 (Simulación de compra de productos y generación de pedido).
 */

interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: UserRole;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "No autorizado. Por favor, inicia sesión." },
        { status: 401 }
      );
    }

    const user = session.user as SessionUser;
    const body = await request.json();
    const validatedData = createOrderSchema.parse(body);

    const order = await createOrder(validatedData, user.id);

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Error al crear la orden:", error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Datos de orden inválidos",
          details: error.issues.map((e) => e.message),
        },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Ocurrió un error inesperado al procesar la orden." },
      { status: 500 }
    );
  }
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Este endpoint maneja la creación de pedidos en el sistema. Aunque la pasarela
 * de pago es simulada, la lógica de inventario y base de datos es real.
 *
 * Lógica Clave:
 * - Autenticación: Solo usuarios registrados pueden realizar pedidos, obteniendo
 *   su ID directamente de la sesión de NextAuth.
 * - Validación: Se utiliza Zod para asegurar que los items, dirección y municipio
 *   cumplan con los formatos esperados antes de tocar la base de datos.
 * - Manejo de Errores: Se distinguen errores de validación, errores de lógica de
 *   negocio (como stock) y errores críticos del servidor.
 *
 * Dependencias Externas:
 * - getServerSession: Para obtener la identidad del usuario de forma segura.
 * - order.service: Encapsula la lógica compleja de transacciones de base de datos.
 *
 */
