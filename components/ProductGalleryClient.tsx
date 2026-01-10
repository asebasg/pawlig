"use client";

import { useState, useEffect, useCallback } from "react";
import { ProductFilter } from "@/components/filters/product-filter";
import { ProductCard } from "@/components/cards/product-card";
import Loader from "@/components/ui/loader";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, PackageX, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

/**
 * Componente: ProductGalleryClient
 * Descripción: Gestiona la visualización, filtrado y paginación del catálogo de productos para mascotas.
 * Requiere: Acceso a /api/products para obtención de datos.
 * Implementa: HU-004 (Galería de productos), RF-012 (Filtrado de productos).
 */

const ITEMS_PER_PAGE = 12;

interface Product {
    id: string;
    name: string;
    price: number;
    stock: number;
    category: string;
    images: string[];
    vendor: {
        id: string;
        businessName: string;
        municipality: string;
        address: string;
    };
}

interface ProductsResponse {
    products: Product[];
    total: number;
    page: number;
    totalPages: number;
}

export default function ProductGalleryClient() {
    // Estados locales
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [appliedFilters, setAppliedFilters] = useState<Record<string, string | string[]>>({});
    const [error, setError] = useState<string | null>(null);

    // Función para construir query params desde filtros
    const buildQueryParams = (
        filters: Record<string, string | string[]>,
        page?: number
    ): string => {
        const params = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
            if (value && value !== "all" && (Array.isArray(value) ? value.length > 0 : true)) {
                params.set(key, Array.isArray(value) ? value.join(",") : String(value));
            }
        });

        if (page) {
            params.set("page", String(page));
        }

        params.set("limit", String(ITEMS_PER_PAGE));

        return params.toString();
    };

    // Función para hacer fetch de productos
    const fetchProducts = useCallback(async (
        filters: Record<string, string | string[]> = appliedFilters,
        page: number = 1
    ) => {
        try {
            setIsLoading(true);
            setError(null);

            const queryParams = buildQueryParams(filters, page);
            const response = await fetch(`/api/products?${queryParams}`);

            if (!response.ok) {
                throw new Error("Error al cargar productos");
            }

            const data: ProductsResponse = await response.json();

            setProducts(data.products);
            setTotal(data.total);
            setTotalPages(data.totalPages);
            setCurrentPage(data.page);
        } catch (err) {
            console.error("Error fetching products:", err);
            setError(err instanceof Error ? err.message : "Error desconocido");
            toast.error("Error al cargar productos", {
                description: "Por favor, intenta de nuevo más tarde",
            });
        } finally {
            setIsLoading(false);
        }
    }, [appliedFilters]);

    useEffect(() => {
        fetchProducts({}, 1);
    }, [fetchProducts]);

    // Manejar cambios en los filtros
    const handleFiltersChange = (filters: Record<string, string | string[]>) => {
        setAppliedFilters(filters);
        fetchProducts(filters, 1); // Resetear a primera página
    };

    // Manejar cambio de página
    const handlePageChange = (newPage: number) => {
        // Validar rango
        if (newPage < 1 || newPage > totalPages) return;

        fetchProducts(appliedFilters, newPage);

        // Scroll al inicio de la galería
        const gallery = document.getElementById("products-gallery");
        if (gallery) {
            gallery.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    // Manejar agregar al carrito
    const handleAddToCart = async () => {
        try {
            // TODO: Implementar lógica de carrito cuando esté disponible
            // Por ahora solo mostramos un toast de éxito
            toast.success("Producto agregado al carrito", {
                description: "Puedes continuar comprando o ir al carrito",
            });
        } catch {
            toast.error("Error al agregar al carrito", {
                description: "Por favor, intenta de nuevo",
            });
        }
    };

    // Manejar reset de filtros (desde empty state)
    const handleResetFilters = () => {
        setAppliedFilters({});
        fetchProducts({}, 1);
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar de filtros (Desktop) y Drawer (Mobile) */}
            <aside className="w-full lg:w-80 flex-shrink-0">
                <div className="sticky top-4 bg-white rounded-lg p-6">
                    <ProductFilter onFiltersChange={handleFiltersChange} />
                </div>
            </aside>

            {/* Galería de productos */}
            <main className="flex-1">
                <div id="products-gallery" className="scroll-mt-4">
                    {/* Estado de carga */}
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader className="mb-4" />
                            <p className="text-purple-600 text-sm">Cargando productos</p>
                        </div>
                    )}

                    {/* Estado de error */}
                    {!isLoading && error && (
                        <div className="bg-white rounded-lg border p-12 text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertCircle className="w-8 h-8 text-red-500" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                Error al cargar productos
                            </h3>
                            <p className="text-gray-600 mb-6">{error}</p>
                            <Button
                                onClick={() => fetchProducts(appliedFilters, currentPage)}
                                className="bg-purple-600 hover:bg-purple-700"
                            >
                                Reintentar
                            </Button>
                        </div>
                    )}

                    {/* Estado vacío */}
                    {!isLoading && !error && products.length === 0 && (
                        <div className="bg-white rounded-lg border-purple-100 p-12 text-center">
                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <PackageX className="w-8 h-8 text-purple-500" />
                            </div>
                            <h3 className="text-xl font-semibold text-purple-800 mb-2">
                                No se encontraron productos
                            </h3>
                            <p className="text-purple-600 mb-6">
                                Intenta ajustar los filtros para ver más resultados
                            </p>
                            <Button
                                onClick={handleResetFilters}
                                variant="outline"
                                className="border-purple-300 text-purple-700 hover:bg-purple-50"
                            >
                                Limpiar filtros
                            </Button>
                        </div>
                    )}

                    {/* Grid de productos */}
                    {!isLoading && !error && products.length > 0 && (
                        <>
                            {/* Información de resultados */}
                            <div className="mb-6 text-sm text-purple-600">
                                Mostrando{" "}
                                <span className="font-semibold">
                                    {(currentPage - 1) * ITEMS_PER_PAGE + 1}
                                </span>
                                {" - "}
                                <span className="font-semibold">
                                    {Math.min(currentPage * ITEMS_PER_PAGE, total)}
                                </span>
                                {" de "}
                                <span className="font-semibold">{total}</span>
                                {total === 1 ? " producto" : " productos"}
                            </div>

                            {/* Grid responsive */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                                {products.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        onAddToCart={handleAddToCart}
                                    />
                                ))}
                            </div>

                            {/* Paginación */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-center gap-2 mt-8">
                                    {/* Botón Previous */}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={cn(
                                            "gap-1",
                                            currentPage === 1 && "opacity-50 cursor-not-allowed"
                                        )}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                        Anterior
                                    </Button>

                                    {/* Números de página */}
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                                            // Mostrar solo páginas relevantes (primera, última, actual y vecinas)
                                            const showPage =
                                                page === 1 ||
                                                page === totalPages ||
                                                Math.abs(page - currentPage) <= 1;

                                            const showEllipsis =
                                                (page === 2 && currentPage > 3) ||
                                                (page === totalPages - 1 && currentPage < totalPages - 2);

                                            if (showEllipsis) {
                                                return (
                                                    <span
                                                        key={page}
                                                        className="px-2 py-1 text-gray-400 text-sm"
                                                    >
                                                        ...
                                                    </span>
                                                );
                                            }

                                            if (!showPage) return null;

                                            return (
                                                <Button
                                                    key={page}
                                                    variant={page === currentPage ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => handlePageChange(page)}
                                                    className={cn(
                                                        "min-w-[2.5rem]",
                                                        page === currentPage &&
                                                        "bg-purple-600 hover:bg-purple-700 text-white"
                                                    )}
                                                >
                                                    {page}
                                                </Button>
                                            );
                                        })}
                                    </div>

                                    {/* Botón Next */}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className={cn(
                                            "gap-1",
                                            currentPage === totalPages && "opacity-50 cursor-not-allowed"
                                        )}
                                    >
                                        Siguiente
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Este componente actúa como el orquestador principal de la vista de productos, 
 * integrando filtros laterales con una rejilla de resultados paginada.
 *
 * Lógica Clave:
 * - buildQueryParams: Utilidad interna para serializar el objeto de filtros y el 
 *   número de página en una cadena compatible con URLSearchParams.
 * - fetchProducts: Centraliza las llamadas a la API, manejando estados de carga,
 *   errores y actualización de la paginación.
 * - scrollIntoView: Mejora la UX al desplazar la vista al inicio de la galería 
 *   automáticamente después de cambiar de página.
 *
 * Dependencias Externas:
 * - Sonner: Utilizado para notificaciones emergentes de éxito (carrito) o error.
 * - Lucide React: Iconografía para navegación y estados (Chevron, PackageX, etc).
 *
 */
