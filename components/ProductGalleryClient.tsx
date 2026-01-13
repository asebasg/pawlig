"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

interface ProductsResponse {
    products: Product[];
    total: number;
    page: number;
    totalPages: number;
}

function ProductGalleryContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Estados de datos
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Paginación (derivada de searchParams para sincronización, pero mantenemos estado local para UI inmediata si se desea)
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const currentPage = Number(searchParams.get("page")) || 1;

    // Efecto principal: Fetch datos cuando searchParams cambia
    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            setError(null);

            try {
                // Construir query string directamente desde searchParams
                // Nos aseguramos de incluir 'limit' si no está
                const params = new URLSearchParams(searchParams.toString());
                if (!params.has("limit")) {
                    params.set("limit", ITEMS_PER_PAGE.toString());
                }

                // Fetch
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
        };

        fetchProducts();
    }, [searchParams]);

    const handleClearFilters = () => {
        router.push("/productos");
        // El componente ProductFilter escuchará el cambio de URL y se reseteará, 
        // o podemos confiar en que ProductFilter maneje su propio reset si le pasamos una prop controlada,
        // pero ProductFilter actualmente maneja su propio estado basado en URL.
        // Al navegar a /productos limpiaremos los params.
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            const params = new URLSearchParams(searchParams.toString());
            params.set("page", newPage.toString());
            // Scroll top
            window.scrollTo({ top: 0, behavior: 'smooth' });
            router.push(`/productos?${params.toString()}`);
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
                    <ProductFilter />
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
