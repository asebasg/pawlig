"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProductFilter, ProductFilterState } from "@/components/filters/product-filter";
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

interface ProductsResponse {
    products: Product[];
    total: number;
    page: number;
    totalPages: number;
}

function ProductGalleryContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // 1. Estados iniciales basándonos en la URL actual
    const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
    const [filters, setFilters] = useState<ProductFilterState>({
        category: searchParams.get("category") || "all",
        municipality: searchParams.get("municipality") || "all",
        minPrice: searchParams.get("minPrice") || "",
        maxPrice: searchParams.get("maxPrice") || "",
        availability: searchParams.get("availability") || "all",
    });

    // Estados de datos
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Paginación
    const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    // Estado debounced para activar efectos de red
    const [debouncedState, setDebouncedState] = useState({
        search: searchQuery,
        filters: filters,
    });

    // Sincronizar URL externa (ej: botón atrás) con estado local
    useEffect(() => {
        setSearchQuery(searchParams.get("search") || "");
        setFilters({
            category: searchParams.get("category") || "all",
            municipality: searchParams.get("municipality") || "all",
            minPrice: searchParams.get("minPrice") || "",
            maxPrice: searchParams.get("maxPrice") || "",
            availability: searchParams.get("availability") || "all",
        });
        setCurrentPage(Number(searchParams.get("page")) || 1);
    }, [searchParams]);

    // Debounce de cambios locales -> Estado efectivo
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedState({
                search: searchQuery,
                filters: filters,
            });
        }, 500); // 500ms debounce
        return () => clearTimeout(timer);
    }, [searchQuery, filters]);

    // Función para construir Query String
    const buildQueryString = useCallback((search: string, currentFilters: ProductFilterState, page: number) => {
        const params = new URLSearchParams();

        if (search) params.set("search", search);

        if (currentFilters.category !== "all") params.set("category", currentFilters.category);
        if (currentFilters.municipality !== "all") params.set("municipality", currentFilters.municipality);
        if (currentFilters.availability !== "all") params.set("availability", currentFilters.availability);
        if (currentFilters.minPrice) params.set("minPrice", currentFilters.minPrice);
        if (currentFilters.maxPrice) params.set("maxPrice", currentFilters.maxPrice);

        params.set("page", page.toString());
        params.set("limit", ITEMS_PER_PAGE.toString());

        return params.toString();
    }, []);

    // Efecto principal: Fetch datos y actualizar URL cuando cambia el estado debounced o página
    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const queryString = buildQueryString(debouncedState.search, debouncedState.filters, currentPage);

                // Actualizar URL (shallow replace para no ensuciar historial excesivamente si se desea, o push)
                // Usamos push para permitir navegación
                // Solo navegar si cambió algo (evita loops si el useEffect se dispara por init)
                // Nota: comparamos sin 'limit' a veces, pero mejor comparar string completa generada vs actual
                // Pero cuidado: searchParams puede tener orden distinto.

                // Fetch
                const response = await fetch(`/api/products?${queryString}`);
                if (!response.ok) throw new Error("Error cargando productos");

                const data: ProductsResponse = await response.json();

                setProducts(data.products);
                setTotal(data.total);
                setTotalPages(data.totalPages);

                // Sincronización URL visual (si difiere)
                // Esto es importante: si actualizamos URL aquí, disparará el useEffect de [searchParams] arriba.
                // Para evitar loop: verificamos si los params son semánticamente iguales.
                // Una estrategia común es actualizar URL *antes* del fetch en los handlers, pero aquí usamos debounce.
                // ESTRATEGIA: La UI manda. Si el debounce cambió, actualizamos URL.
                // El useEffect de [searchParams] debe distinguir si la actualización vino de aquí.
                // Como Nextjs Router shallow routing no siempre es fácil de detectar, usaremos comparación simple.

                // Simplemente hacemos push. Si la URL es igual, Nextjs suele ignorarlo o reemplazar.
                router.replace(`/productos?${queryString}`, { scroll: false });

            } catch (err) {
                console.error(err);
                setError("No se pudieron cargar los productos.");
                toast.error("Error de conexión");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedState, currentPage]);
    // Omitimos router/searchParams para evitar reactividad circular. 
    // Solo reaccionamos a cambios PROPIOS del estado (debouncedState, currentPage).

    // Handlers
    const handleSearchChange = (val: string) => {
        setSearchQuery(val);
        setCurrentPage(1); // Reset page on search
    };

    const handleFilterChange = (key: keyof ProductFilterState, val: string) => {
        setFilters(prev => ({ ...prev, [key]: val }));
        setCurrentPage(1); // Reset page on filter
    };

    const handleClearFilters = () => {
        setSearchQuery("");
        setFilters({
            category: "all",
            municipality: "all",
            minPrice: "",
            maxPrice: "",
            availability: "all",
        });
        setCurrentPage(1);
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            // Scroll top
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
                <div className="sticky top-20 bg-card rounded-lg border shadow-sm p-6">
                    <ProductFilter
                        filters={filters}
                        searchQuery={searchQuery}
                        onFilterChange={handleFilterChange}
                        onSearchChange={handleSearchChange}
                        onClearFilters={handleClearFilters}
                    />
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0">
                {!isLoading && (
                    <div className="mb-6 flex items-center justify-between">
                        <p className="text-muted-foreground">
                            Mostrando {products.length} de {total} resultados
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6" id="products-gallery">
                    {isLoading ? (
                        <div className="col-span-full py-20 flex justify-center">
                            <Loader />
                        </div>
                    ) : error ? (
                        <div className="col-span-full py-20 text-center">
                            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                            <h3 className="text-lg font-semibold">Ha ocurrido un error</h3>
                            <p className="text-muted-foreground mb-4">{error}</p>
                            <Button onClick={() => window.location.reload()}>Recargar página</Button>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="col-span-full py-20 text-center bg-muted/30 rounded-lg border-2 border-dashed">
                            <PackageX className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold">No se encontraron productos</h3>
                            <p className="text-muted-foreground mb-4">Intenta ajustar los filtros de búsqueda</p>
                            <Button variant="outline" onClick={handleClearFilters}>Limpiar filtros</Button>
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
                            disabled={currentPage === 1}
                            onClick={() => handlePageChange(currentPage - 1)}
                        >
                            Anterior
                        </Button>
                        <span className="flex items-center px-4 font-medium">
                            Página {currentPage} de {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            disabled={currentPage === totalPages}
                            onClick={() => handlePageChange(currentPage + 1)}
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
