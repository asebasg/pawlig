"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ProductFilter } from "@/components/filters/product-filter";
import { ProductCard } from "@/components/cards/product-card";
import Loader from "@/components/ui/loader";
import { Button } from "@/components/ui/button";
import { PackageX, AlertCircle } from "lucide-react";
import { toast } from "sonner";

// Constantes
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

interface ProductFilters {
    search: string;
    minPrice: string;
    maxPrice: string;
    category: string[];
    municipality: string;
    availability: string;
}

interface ProductsResponse {
    products: Product[];
    total: number;
    page: number;
    totalPages: number;
}

function ProductGalleryContent() {
    const searchParams = useSearchParams();

    // 1. Inicializar estado de filtros desde la URL (solo lectura inicial)
    const [filters, setFilters] = useState<ProductFilters>({
        search: searchParams.get("search") || "",
        minPrice: searchParams.get("minPrice") || "",
        maxPrice: searchParams.get("maxPrice") || "",
        category: searchParams.get("category")?.split(",").filter(Boolean) || [],
        municipality: searchParams.get("municipality") || "all",
        availability: searchParams.get("availability") || "all",
    });

    // Estado paginación
    const [page, setPage] = useState(1);

    // Estados de datos
    const [products, setProducts] = useState<Product[]>([]);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Función de fetch
    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams();

            // Añadir filtros activos
            if (filters.search) params.append("search", filters.search);
            if (filters.minPrice) params.append("minPrice", filters.minPrice);
            if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
            if (filters.category.length > 0) params.append("category", filters.category.join(","));
            if (filters.municipality && filters.municipality !== "all") params.append("municipality", filters.municipality);
            if (filters.availability && filters.availability !== "all") params.append("availability", filters.availability);

            // Paginación
            params.append("page", page.toString());
            params.append("limit", ITEMS_PER_PAGE.toString());

            const response = await fetch(`/api/products?${params.toString()}`);
            if (!response.ok) throw new Error("Error cargando productos");

            const data: ProductsResponse = await response.json();

            setProducts(data.products);
            setTotal(data.total);
            setTotalPages(data.totalPages);

        } catch (err) {
            console.error(err);
            setError("No se pudieron cargar los productos.");
            toast.error("Error de conexión");
        } finally {
            setIsLoading(false);
        }
    }, [filters, page]);

    // Efecto: Fetch cuando cambian filtros o página
    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // Handlers
    const handleFilterChange = (key: keyof ProductFilters, value: string | string[]) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value
        }));
        setPage(1); // Reset a página 1 al filtrar
    };

    const handleClearFilters = () => {
        setFilters({
            search: "",
            minPrice: "",
            maxPrice: "",
            category: [],
            municipality: "all",
            availability: "all",
        });
        setPage(1);
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleAddToCart = () => {
        toast.success("Producto agregado al carrito");
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="w-full lg:w-80 flex-shrink-0">
                <div className="sticky top-20 p-6">
                    <ProductFilter
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onClearFilters={handleClearFilters}
                    />
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0">
                {!isLoading && (
                    <div className="mb-6 flex items-center justify-between">
                        <p className="text-gray-500 text-sm">
                            Mostrando <span className="font-semibold text-gray-900">{products.length}</span> de <span className="font-semibold text-gray-900">{total}</span> resultados
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6" id="products-gallery">
                    {isLoading ? (
                        <div className="col-span-full flex flex-col items-center justify-center py-12">
                            <Loader />
                            <p className="text-gray-500 mt-4 animate-pulse">Cargando catálogo...</p>
                        </div>
                    ) : error ? (
                        <div className="col-span-full py-20 text-center bg-red-50 rounded-xl border border-red-100">
                            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-red-700">Ha ocurrido un error</h3>
                            <p className="text-red-600 mb-6">{error}</p>
                            <Button onClick={() => fetchProducts()} variant="outline" className="border-red-200 text-red-700 hover:bg-red-100">
                                Reintentar
                            </Button>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="col-span-full py-20 text-center bg-gray-50 rounded-xl border border-gray-100">
                            <PackageX className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                            <h3 className="text-lg font-semibold text-gray-700">No se encontraron productos</h3>
                            <p className="mb-6 text-gray-500">Intenta ajustar los filtros de búsqueda</p>
                            <Button variant="default" onClick={handleClearFilters}>
                                Limpiar filtros
                            </Button>
                        </div>
                    ) : (
                        products.map(product => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                accentColor="none"
                                onAddToCart={handleAddToCart}
                            />
                        ))
                    )}
                </div>

                {/* Pagination */}
                {!isLoading && totalPages > 1 && (
                    <div className="mt-8 flex justify-center gap-2">
                        <Button
                            variant="outline"
                            disabled={page === 1}
                            onClick={() => handlePageChange(page - 1)}
                            className="w-24"
                        >
                            Anterior
                        </Button>
                        <span className="flex items-center px-4 font-medium text-sm text-gray-600 bg-white rounded-md border">
                            {page} / {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            disabled={page === totalPages}
                            onClick={() => handlePageChange(page + 1)}
                            className="w-24"
                        >
                            Siguiente
                        </Button>
                    </div>
                )}
            </main>
        </div>
    );
}

export default function ProductGalleryClient() {
    return (
        <Suspense fallback={<div className="p-8 flex justify-center"><Loader /></div>}>
            <ProductGalleryContent />
        </Suspense>
    );
}
