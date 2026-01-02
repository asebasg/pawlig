import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { updateProduct } from "@/lib/services/product.service";
import { updateProductSchema } from "@/lib/validations/product.schema";
import { ZodError } from "zod";

/**
 * PUT /api/products/[id]/stock
 * Descripción: Actualizar el stock de un producto específico
 * Requiere: Usuario autenticado con rol VENDOR (propietario)
 * Implementa: Gestión de stock de productos
 */

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Verificar autenticación
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json(
                { error: "No autenticado" },
                { status: 401 }
            );
        }

        // Verificar rol VENDOR
        if (session.user.role !== "VENDOR") {
            return NextResponse.json(
                { error: "Solo vendedores pueden gestionar el stock" },
                { status: 403 }
            );
        }

        // Obtener vendorId
        const vendorId = session.user.vendorId;

        if (!vendorId) {
            return NextResponse.json(
                { error: "Usuario no tiene perfil de vendedor asociado" },
                { status: 400 }
            );
        }

        const { id } = params;

        // Parsear body
        const body = await request.json();

        // Validar con Zod (updateProductSchema permite partials, incluyendo stock)
        const validatedData = updateProductSchema.parse(body);

        // Actualizar producto (el servicio verifica propiedad)
        // Nota: Se utiliza updateProduct general ya que permite actualizar el stock
        // junto con otros campos si fuera necesario, y encapsula la lógica de propiedad.
        const product = await updateProduct(id, validatedData, vendorId);

        return NextResponse.json(product, { status: 200 });
    } catch (error) {
        console.error("Error en PUT /api/products/[id]/stock:", error);

        // Manejo de errores de validación Zod
        if (error instanceof ZodError) {
            return NextResponse.json(
                {
                    error: "Datos inválidos",
                    details: error.issues,
                },
                { status: 400 }
            );
        }

        // Errores de negocio
        if (error instanceof Error) {
            if (error.message.includes("no encontrado")) {
                return NextResponse.json(
                    { error: error.message },
                    { status: 404 }
                );
            }

            if (error.message.includes("permisos")) {
                return NextResponse.json(
                    { error: error.message },
                    { status: 403 }
                );
            }

            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Error al actualizar stock" },
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
 * Endpoint dedicado para la gestión del stock de un producto.
 *
 * Lógica Clave:
 * - PUT: Permite a los vendedores actualizar el stock de sus productos.
 *   Utiliza el esquema updateProductSchema para validar los datos entrantes.
 *
 * Dependencias Externas:
 * - NextAuth: Verificación de sesión y roles.
 * - Zod: Validación de datos.
 * - product.service: Reutiliza updateProduct para la persistencia.
 *
 * Seguridad:
 * - Requiere autenticación y rol VENDOR.
 * - Verificación estricta de propiedad del producto a través del servicio.
 */
