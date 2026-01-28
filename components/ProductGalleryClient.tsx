"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProductFilter } from "@/components/filters/product-filter";
import { ProductCard } from "@/components/cards/product-card";
import Loader from "@/components/ui/loader";
import { Button } from "@/components/ui/button";
import { PackageX, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/lib/context/CartContext";

/**
 * Descripción: Galería de productos con filtrado, búsqueda y paginación sincronizada con la URL.
 * Requiere: API de productos (/api/products) y CartProvider.
 * Implementa: HU-006 (Filtro y búsqueda de mascotas - adaptado a productos) y HU-009 (Simulación de compra).
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

function ProductGalleryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToCart } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const currentPage = Number(searchParams.get("page")) || 1;

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams(searchParams.toString());
        if (!params.has("limit")) {
          params.set("limit", ITEMS_PER_PAGE.toString());
        }

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
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", newPage.toString());
      window.scrollTo({ top: 0, behavior: "smooth" });
      router.push(`/productos?${params.toString()}`);
    }
  };

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.images[0] || "/images/placeholder-product.png",
      stock: product.stock,
      vendorId: product.vendor.id,
    });
    toast.success(`"${product.name}" agregado al carrito`);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <aside className="w-full lg:w-80 flex-shrink-0">
        <div className="sticky top-20 p-6">
          <ProductFilter />
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        {!isLoading && (
          <div className="mb-6 flex items-center justify-between">
            <p className="text-gray-500 dark:text-gray-400">
              Mostrando {products.length} de {total} resultados
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6" id="products-gallery">
          {isLoading ? (
            <div className="col-span-full flex flex-col items-center justify-center py-12">
              <Loader />
              <p className="text-gray-500 dark:text-gray-400">Cargando productos...</p>
            </div>
          ) : error ? (
            <div className="col-span-full py-20 text-center">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Ha ocurrido un error</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>Recargar página</Button>
            </div>
          ) : products.length === 0 ? (
            <div className="col-span-full py-20 text-center">
              <PackageX className="h-12 w-12 mx-auto mb-4 text-purple-500" />
              <h3 className="text-lg font-semibold text-purple-800">No se encontraron productos</h3>
              <p className="mb-4 text-purple-800">Intenta ajustar los filtros de búsqueda</p>
              <Button variant="outline" onClick={handleClearFilters}>Limpiar filtros</Button>
            </div>
          ) : (
            products.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                accentColor="none"
                onAddToCart={() => handleAddToCart(product)}
              />
            ))
          )}
        </div>

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

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Este componente gestiona la visualización del catálogo de productos en una
 * interfaz de galería responsiva con filtros laterales y paginación.
 *
 * Lógica Clave:
 * - Fetching Dinámico: Se sincroniza con los parámetros de búsqueda de la URL
 *   para permitir el filtrado y la navegación compartible.
 * - Carrito: Utiliza el CartContext para permitir que los usuarios agreguen
 *   productos directamente desde la galería sin entrar al detalle.
 * - Suspense: Envuelto en un límite de Suspense para manejar de forma segura
 *   el uso de useSearchParams durante la renderización estática.
 *
 * Dependencias Externas:
 * - next/navigation: Para la gestión de rutas y parámetros de búsqueda.
 * - sonner: Para notificaciones de éxito al agregar productos.
 * - lucide-react: Para iconografía de estados vacíos y errores.
 *
 */
