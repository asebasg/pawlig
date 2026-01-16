import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { getProducts, createProduct } from "@/lib/services/product.service";
import { UserRole } from "@prisma/client";
import { createProductSchema } from "@/lib/validations/product.schema";
import { ZodError } from "zod";

/**
 * GET /api/products
 * Descripción: Obtener catálogo de productos con filtros
 * Requiere: Acceso público
 * Implementa: RF-012 (Publicación de productos), HU-010
*/

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        // Extraer parámetros de query
        const filters = {
            category: searchParams.get("category") || undefined,
            vendorId: searchParams.get("vendorId") || undefined,
            inStock: searchParams.get("inStock") === "true" ? true : undefined,
            search: searchParams.get("search") || undefined,
            page: parseInt(searchParams.get("page") || "1"),
            limit: parseInt(searchParams.get("limit") || "12"),
        };

        // Obtener productos
        const result = await getProducts(filters);

        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("Error en GET /api/products:", error);
        return NextResponse.json(
            { error: "Error al obtener productos" },
            { status: 500 }
        );
    }
}

/**
 * POST /api/products
 * Descripción: Crear nuevo producto
 * Requiere: Usuario autenticado con rol VENDOR
 * Implementa: RF-013 (Gestión de productos), HU-010
*/

export async function POST(request: NextRequest) {
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
        if (session.user.role !== UserRole.VENDOR) {
            return NextResponse.json(
                { error: "Solo vendedores pueden crear productos" },
                { status: 403 }
            );
        }

        // Obtener vendorId del usuario autenticado
        const vendorId = session.user.vendorId;

        if (!vendorId) {
            return NextResponse.json(
                { error: "Usuario no tiene perfil de vendedor asociado" },
                { status: 400 }
            );
        }

        // Parsear body
        const body = await request.json();

        // Validar con Zod
        const validatedData = createProductSchema.parse(body);

        // Crear producto
        const product = await createProduct(validatedData, vendorId);

        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        console.error("Error en POST /api/products:", error);

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
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Error al crear producto" },
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
 * Endpoints para listar productos (público) y crear productos (vendedores).
 *
 * Lógica Clave:
 * - GET: Extrae filtros de query params y los pasa al servicio. No requiere
 *   autenticación para permitir catálogo público.
 * - POST: Valida autenticación, rol VENDOR y existencia de vendorId antes
 *   de crear producto. Valida datos con Zod.
 *
 * Dependencias Externas:
 * - NextAuth: Para autenticación y obtención de sesión del usuario.
 * - Zod: Para validación de datos de entrada.
 * - product.service: Lógica de negocio para productos.
 *
 * Seguridad:
 * - POST requiere autenticación y rol específico (VENDOR).
 * - Validación de datos con schemas Zod.
 * - Manejo de errores sin exponer información sensible.
 */