import { prisma } from "@/lib/utils/db";
import { Prisma } from "@prisma/client";
import {
    CreateProductInput,
    UpdateProductInput,
    UpdateStockInput,
} from "@/lib/validations/product.schema";

/**
 * Servicio: product.service.ts
 * Descripción: Servicio para gestión de productos (CRUD completo e inventario)
 * Implementa: RF-012, RF-013, RF-014, HU-010
 */

// Interfaz para filtros de búsqueda
export interface ProductFilters {
    category?: string;
    vendorId?: string;
    inStock?: boolean;
    search?: string;
    page?: number;
    limit?: number;
}

// Interfaz para resultado paginado
export type ProductWithVendor = Prisma.ProductGetPayload<{
    include: {
        vendor: {
            select: {
                id: true,
                businessName: true,
                municipality: true,
                address: true,
            }
        }
    };
}>;

// Actualiza la interfaz
export interface PaginatedProducts {
    products: ProductWithVendor[];
    total: number;
    page: number;
    totalPages: number;
}

/**
 * Obtener productos con filtros y paginación
 * @param filters - Filtros de búsqueda
 * @returns Productos paginados
 */

export async function getProducts(
    filters: ProductFilters = {}
): Promise<PaginatedProducts> {
    const {
        category,
        vendorId,
        inStock,
        search,
        page = 1,
        limit = 12,
    } = filters;

    // Construir condiciones de búsqueda
    const where: Prisma.ProductWhereInput = {};

    if (category) {
        where.category = category;
    }

    if (vendorId) {
        where.vendorId = vendorId;
    }

    if (inStock !== undefined) {
        where.stock = inStock ? { gt: 0 } : { equals: 0 };
    }

    if (search) {
        where.OR = [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
        ];
    }

    // Ejecutar consultas en paralelo
    const [products, total] = await Promise.all([
        prisma.product.findMany({
            where,
            include: {
                vendor: {
                    select: {
                        id: true,
                        businessName: true,
                        municipality: true,
                        address: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
            skip: (page - 1) * limit,
            take: limit,
        }),
        prisma.product.count({ where }),
    ]);

    return {
        products,
        total,
        page,
        totalPages: Math.ceil(total / limit),
    };
}

/**
 * Obtener producto por ID con información del vendedor
 * @param id - ID del producto
 * @returns Producto con datos del vendedor o null
 */
export async function getProductById(id: string) {
    return await prisma.product.findUnique({
        where: { id },
        include: {
            vendor: {
                select: {
                    id: true,
                    businessName: true,
                    municipality: true,
                    address: true,
                    description: true,
                    businessPhone: true,
                },
            },
        },
    });
}

/**
 * Obtener productos similares (misma categoría)
 * @param currentId - ID actual para excluir
 * @param vendorId - ID del vendedor (opcional, para priorizar mismo vendedor)
 * @param category - Categoría del producto
 */
export async function getSimilarProducts(currentId: string, vendorId: string, category: string) {
    return await prisma.product.findMany({
        where: {
            id: { not: currentId },
            category: category,
            stock: { gt: 0 } // Solo productos disponibles
        },
        include: {
            vendor: {
                select: {
                    id: true,
                    businessName: true,
                    municipality: true,
                }
            }
        },
        take: 3,
        orderBy: {
            createdAt: 'desc'
        }
    });
}

/**
 * Crear nuevo producto
 * @param data - Datos del producto validados
 * @param vendorId - ID del vendedor autenticado
 * @returns Producto creado
 */
export async function createProduct(
    data: CreateProductInput,
    vendorId: string
) {
    // Verificar que el vendedor existe y está verificado
    const vendor = await prisma.vendor.findUnique({
        where: { id: vendorId },
    });

    if (!vendor) {
        throw new Error("Vendedor no encontrado");
    }

    if (!vendor.verified) {
        throw new Error("Vendedor no verificado");
    }

    // Crear producto
    return await prisma.product.create({
        data: {
            ...data,
            vendorId,
        },
        include: {
            vendor: {
                select: {
                    id: true,
                    businessName: true,
                },
            },
        },
    });
}

/**
 * Actualizar producto completo
 * @param id - ID del producto
 * @param data - Datos actualizados
 * @param vendorId - ID del vendedor (para verificar propiedad)
 * @returns Producto actualizado
 */
export async function updateProduct(
    id: string,
    data: UpdateProductInput,
    vendorId: string
) {
    // Verificar que el producto existe y pertenece al vendedor
    const product = await prisma.product.findUnique({
        where: { id },
    });

    if (!product) {
        throw new Error("Producto no encontrado");
    }

    if (product.vendorId !== vendorId) {
        throw new Error("No tienes permisos para editar este producto");
    }

    // Actualizar producto
    return await prisma.product.update({
        where: { id },
        data,
        include: {
            vendor: {
                select: {
                    id: true,
                    businessName: true,
                },
            },
        },
    });
}

/**
 * Actualizar solo el stock de un producto
 * @param id - ID del producto
 * @param stockData - Nuevo valor de stock
 * @param vendorId - ID del vendedor (para verificar propiedad)
 * @returns Producto con stock actualizado
 */
export async function updateStock(
    id: string,
    stockData: UpdateStockInput,
    vendorId: string
) {
    // Verificar propiedad
    const product = await prisma.product.findUnique({
        where: { id },
    });

    if (!product) {
        throw new Error("Producto no encontrado");
    }

    if (product.vendorId !== vendorId) {
        throw new Error("No tienes permisos para modificar este producto");
    }

    // Actualizar stock
    return await prisma.product.update({
        where: { id },
        data: {
            stock: stockData.stock,
        },
    });
}

/**
 * Eliminar producto
 * @param id - ID del producto
 * @param vendorId - ID del vendedor (para verificar propiedad)
 * @returns Producto eliminado
 */
export async function deleteProduct(id: string, vendorId: string) {
    // Verificar propiedad
    const product = await prisma.product.findUnique({
        where: { id },
    });

    if (!product) {
        throw new Error("Producto no encontrado");
    }

    if (product.vendorId !== vendorId) {
        throw new Error("No tienes permisos para eliminar este producto");
    }

    // Verificar si tiene órdenes asociadas
    const orderItemsCount = await prisma.orderItem.count({
        where: { productId: id },
    });

    if (orderItemsCount > 0) {
        throw new Error(
            "No se puede eliminar un producto con órdenes asociadas. Considera marcarlo como sin stock."
        );
    }

    // Eliminar producto
    return await prisma.product.delete({
        where: { id },
    });
}

/**
 * Obtener productos con stock bajo (alerta para vendedor)
 * @param vendorId - ID del vendedor
 * @param threshold - Umbral de stock bajo (default: 10)
 * @returns Productos con stock bajo
 */
export async function getLowStockProducts(
    vendorId: string,
    threshold: number = 10
) {
    return await prisma.product.findMany({
        where: {
            vendorId,
            stock: {
                gt: 0,
                lte: threshold,
            },
        },
        orderBy: {
            stock: "asc",
        },
    });
}

/**
 * Obtener estadísticas de productos de un vendedor
 * @param vendorId - ID del vendedor
 * @returns Estadísticas (total, en stock, agotados, stock bajo)
 */
export async function getVendorProductStats(vendorId: string) {
    const [total, inStock, outOfStock, lowStock] = await Promise.all([
        prisma.product.count({
            where: { vendorId },
        }),
        prisma.product.count({
            where: { vendorId, stock: { gt: 0 } },
        }),
        prisma.product.count({
            where: { vendorId, stock: 0 },
        }),
        prisma.product.count({
            where: { vendorId, stock: { gt: 0, lte: 10 } },
        }),
    ]);

    return {
        total,
        inStock,
        outOfStock,
        lowStock,
    };
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Este servicio maneja todas las operaciones CRUD para productos, incluyendo
 * gestión de inventario y búsqueda con filtros. Asegura que solo los vendedores
 * autenticados puedan modificar sus propios productos.
 *
 * Lógica Clave:
 * - getProducts: Permite filtrar por categoría, vendedor, disponibilidad y búsqueda.
 *   Aplica paginación para optimizar carga de datos.
 * - createProduct: Valida que el usuario sea vendedor y crea el producto asociado.
 * - updateProduct/updateStock: Verifican propiedad del producto antes de modificar.
 * - deleteProduct: Eliminación suave (soft delete) o hard delete según configuración.
 *
 * Dependencias Externas:
 * - Prisma: ORM para interacción con MongoDB.
 * - Zod schemas: Validación de datos de entrada.
 *
 * Reglas de Negocio:
 * - Solo vendedores pueden crear/editar productos.
 * - Stock no puede ser negativo.
 * - Productos con stock = 0 se marcan como "Agotado" en búsquedas públicas.
 * - Un vendedor solo puede modificar sus propios productos.
 */