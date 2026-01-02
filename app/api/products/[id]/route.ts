import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import {
    getProductById,
    updateProduct,
    deleteProduct,
} from "@/lib/services/product.service";
import { updateProductSchema } from "@/lib/validations/product.schema";
import { ZodError } from "zod";

/**
 * GET /api/products/[id]
 * Descripción: Obtener detalle de un producto específico
 * Requiere: Acceso público
 * Implementa: RF-012 (Publicación de productos)
 */

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        // Obtener producto
        const product = await getProductById(id);

        if (!product) {
            return NextResponse.json(
                { error: "Producto no encontrado" },
                { status: 404 }
            );
        }

        return NextResponse.json(product, { status: 200 });
    } catch (error) {
        console.error("Error en GET /api/products/[id]:", error);
        return NextResponse.json(
            { error: "Error al obtener producto" },
            { status: 500 }
        );
    }
}

/**
 * PUT /api/products/[id]
 * Descripción: Actualizar producto completo
 * Requiere: Usuario autenticado con rol VENDOR (propietario)
 * Implementa: RF-013 (Gestión de productos), HU-010
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
                { error: "Solo vendedores pueden editar productos" },
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

        // Validar con Zod
        const validatedData = updateProductSchema.parse(body);

        // Actualizar producto (el servicio verifica propiedad)
        const product = await updateProduct(id, validatedData, vendorId);

        return NextResponse.json(product, { status: 200 });
    } catch (error) {
        console.error("Error en PUT /api/products/[id]:", error);

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

        // Errores de negocio (producto no encontrado, sin permisos, etc.)
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
            { error: "Error al actualizar producto" },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/products/[id]
 * Descripción: Eliminar producto
 * Requiere: Usuario autenticado con rol VENDOR (propietario)
 * Implementa: HU-010
 */

export async function DELETE(
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
                { error: "Solo vendedores pueden eliminar productos" },
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

        // Eliminar producto (el servicio verifica propiedad y órdenes asociadas)
        await deleteProduct(id, vendorId);

        return NextResponse.json(
            { message: "Producto eliminado exitosamente" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error en DELETE /api/products/[id]:", error);

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

            if (error.message.includes("órdenes asociadas")) {
                return NextResponse.json(
                    { error: error.message },
                    { status: 409 }
                );
            }

            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Error al eliminar producto" },
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
 * Endpoints para operaciones sobre productos específicos (obtener, actualizar, eliminar).
 *
 * Lógica Clave:
 * - GET: Acceso público para ver detalles de cualquier producto.
 * - PUT: Solo vendedores pueden editar. El servicio verifica que el producto
 *   pertenezca al vendedor autenticado antes de actualizar.
 * - DELETE: Solo vendedores pueden eliminar. Se valida que no existan órdenes
 *   asociadas al producto antes de eliminarlo (protección de integridad).
 *
 * Dependencias Externas:
 * - NextAuth: Para autenticación y verificación de rol.
 * - Zod: Para validación de datos en PUT.
 * - product.service: Lógica de negocio con verificaciones de propiedad.
 *
 * Seguridad:
 * - PUT y DELETE requieren autenticación y rol VENDOR.
 * - Verificación de propiedad delegada al servicio.
 * - Manejo granular de errores con códigos HTTP apropiados.
 */