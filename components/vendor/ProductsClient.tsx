"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProductTable } from "./ProductTable";
import { ProductWithVendor } from "@/lib/services/product.service";
import Loader from "@/components/ui/loader";
import { toast } from "sonner";
import { Search, Tag, Box, X } from "lucide-react";
import Link from "next/link";

/**
 * Resúmen:
 * Componente cliente que maneja la visualización y estado de la lista de productos
 * del vendedor. Incluye buscador por texto y filtros por categorías con contadores dinámicos.
 */

interface CategoryStat {
    name: string;
    count: number;
}

interface ProductsClientProps {
    initialProducts: ProductWithVendor[];
    categories: CategoryStat[];
    allCount: number;
    searchCategories: CategoryStat[];
    searchTotalCount: number;
    error?: string;
}

export function ProductsClient({
    initialProducts,
    categories,
    allCount,
    searchCategories,
    searchTotalCount,
    error
}: ProductsClientProps) {
    const [products, setProducts] = useState(initialProducts);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
    const activeCategory = searchParams.get("categoryId") || null;

    // Manejo de errores iniciales desde el servidor
    useEffect(() => {
        if (error) {
            toast.error("Error al cargar productos", {
                description: error,
            });
        }
    }, [error]);

    // Sincronizar estado cuando initialProducts cambia
    useEffect(() => {
        setProducts(initialProducts);
    }, [initialProducts]);

    // Calcular contadores dinámicos
    // Usamos las estadísticas del servidor (searchCategories/searchTotalCount)
    // que ya vienen calculadas correctamente con el filtro de búsqueda
    const dynamicCounts = useMemo(() => {
        // Si hay búsqueda activa, usar las estadísticas del servidor
        if (searchQuery.trim()) {
            return {
                all: searchTotalCount,
                byCategory: searchCategories.reduce((acc, cat) => {
                    acc[cat.name] = cat.count;
                    return acc;
                }, {} as Record<string, number>)
            };
        }

        // Sin búsqueda, usar los contadores generales
        return {
            all: allCount,
            byCategory: categories.reduce((acc, cat) => {
                acc[cat.name] = cat.count;
                return acc;
            }, {} as Record<string, number>)
        };
    }, [searchQuery, searchCategories, searchTotalCount, allCount, categories]);

    // Búsqueda con debounce para actualizar la URL
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());
            if (searchQuery.trim()) {
                params.set("q", searchQuery.trim());
            } else {
                params.delete("q");
            }
            // Reset a página 1 cuando se busca
            params.set("page", "1");
            router.push(`/vendor/products?${params.toString()}`, { scroll: false });
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchQuery, router, searchParams]);

    // Revalidación de datos
    const handleProductUpdated = useCallback(async () => {
        setIsRefreshing(true);
        try {
            router.refresh();
        } catch (error) {
            console.error("Error al actualizar la vista:", error);
            toast.error("Error de sincronización");
        } finally {
            setIsRefreshing(false);
        }
    }, [router]);

    // Limpiar todos los filtros
    const handleClearFilters = () => {
        setSearchQuery("");
        router.push("/vendor/products", { scroll: false });
    };

    // Verificar si hay filtros activos
    const hasActiveFilters = searchQuery.trim() !== "" || activeCategory !== null;

    return (
        <div className="space-y-6 mt-6">
            {/* Buscador y Filtros */}
            <div className="bg-card p-6 rounded-xl border shadow-sm space-y-4">
                {/* Buscador */}
                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Buscar producto
                    </label>
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground/50 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Nombre o descripción del producto..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="text-black w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            />
                        </div>
                        {hasActiveFilters && (
                            <button
                                onClick={handleClearFilters}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted transition-colors font-medium"
                                title="Limpiar filtros"
                            >
                                <X className="w-4 h-4" />
                                Limpiar
                            </button>
                        )}
                    </div>

                    {/* Info de resultados */}
                    <div className="mt-3">
                        <span className="text-sm text-muted-foreground">
                            Mostrando <span className="font-semibold text-foreground">{products.length}</span> de <span className="font-semibold text-foreground">{dynamicCounts.all}</span> productos
                            {searchQuery.trim() && (
                                <span className="text-primary ml-1">
                                    (filtrados por búsqueda)
                                </span>
                            )}
                        </span>
                    </div>
                </div>

                {/* Filtros por Categoría */}
                <div className="pt-2">
                    <label className="block text-sm font-medium text-muted-foreground mb-3">
                        Filtrar por categoría
                    </label>
                    <div className="flex flex-wrap gap-2">
                        <FilterButton
                            href="/vendor/products"
                            active={!activeCategory}
                            label="Todos"
                            count={dynamicCounts.all}
                            icon={<Box className="w-4 h-4" />}
                        />
                        {categories.map((cat) => (
                            <FilterButton
                                key={cat.name}
                                href={`/vendor/products?categoryId=${cat.name}${searchQuery ? `&q=${searchQuery}` : ""}`}
                                active={activeCategory === cat.name}
                                label={cat.name}
                                count={dynamicCounts.byCategory[cat.name] || 0}
                                icon={<Tag className="w-4 h-4" />}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="relative">
                {isRefreshing && (
                    <div className="absolute -top-12 right-0 z-10 bg-background/80 px-3 py-1 rounded-full border shadow-sm flex items-center gap-2 animate-in fade-in">
                        <Loader className="h-4 w-4" />
                        <span className="text-xs font-medium text-muted-foreground">Actualizando...</span>
                    </div>
                )}

                <ProductTable
                    products={products}
                    onProductUpdated={handleProductUpdated}
                />
            </div>
        </div>
    );
}

/**
 * Componente auxiliar: FilterButton
 */
function FilterButton({
    href,
    active,
    label,
    count,
    icon,
}: {
    href: string;
    active: boolean;
    label: string;
    count: number;
    icon?: React.ReactNode;
}) {
    return (
        <Link
            href={href}
            scroll={false}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${active
                ? "bg-primary text-white shadow-sm"
                : "bg-purple-50 text-purple-700 hover:bg-purple-100"
                }`}
        >
            {icon}
            <span className="capitalize">{label.toLowerCase()}</span>
            <span className={`text-xs ml-1 px-1.5 py-0.5 rounded-full ${active ? "bg-card/20" : "bg-purple-200/50"}`}>
                {count}
            </span>
        </Link>
    );
}
