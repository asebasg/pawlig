"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProductFilter } from "@/components/filters/product-filter";
import { ProductCard } from "@/components/cards/product-card";
import Loader from "@/components/ui/loader";
import { Button } from "@/components/ui/button";
import { PackageX, AlertCircle, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/lib/context/CartContext";
import { useSession } from "next-auth/react";
import Link from "next/link";

/**
 * Descripción: Galería de productos con filtrado, búsqueda y paginación sincronizada con la URL.
 * Requiere: API de productos (/api/products), CartProvider y SessionProvider.
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
  const { addToCart, totalItems } = useCart();
  const { data: session } = useSession();

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
    if (!session) {
      toast.error("Debes iniciar sesión para añadir productos al carrito");
      router.push("/login");
      return;
    }

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
    <div className="flex flex-col lg:flex-row gap-8 relative">
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

      {/* Botón Flotante del Carrito */}
      {totalItems > 0 && (
        <div className="fixed bottom-8 right-8 z-30 lg:hidden">
          <Button asChild size="lg" className="rounded-full h-16 w-16 shadow-2xl bg-purple-600 hover:bg-purple-700 active:scale-95 transition-all">
            <Link href="/user?tab=cart" className="relative">
              <ShoppingBag className="h-8 w-8" />
              <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center border-2 border-white">
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            </Link>
          </Button>
        </div>
      )}

      {/* FAB Desktop Sticky (opcional según interpretación, el requisito dice Esquina inferior derecha sticky) */}
      {totalItems > 0 && (
        <div className="hidden lg:block fixed bottom-10 right-10 z-30">
          <Button asChild size="lg" className="rounded-full h-20 w-20 shadow-2xl bg-purple-600 hover:bg-purple-700 active:scale-95 transition-all group">
            <Link href="/user?tab=cart" className="flex flex-col items-center justify-center">
              <div className="relative">
                <ShoppingBag className="h-8 w-8" />
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs font-bold rounded-full h-7 w-7 flex items-center justify-center border-2 border-white">
                  {totalItems}
                </span>
              </div>
              <span className="text-[10px] mt-1 font-bold group-hover:scale-105 transition-transform">CARRITO</span>
            </Link>
          </Button>
        </div>
      )}
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
 * Galería de productos con filtrado y gestión de carrito. Se ha añadido un botón
 * flotante (FAB) y validación de autenticación.
 *
 * Lógica Clave:
 * - Validación de Login: Al intentar añadir un producto sin sesión, se muestra
 *   un aviso y se redirige a /login.
 * - FAB (Floating Action Button): Aparece cuando hay items en el carrito,
 *   proporcionando un acceso directo visible y sticky a la pestaña del carrito.
 *
 * Dependencias Externas:
 * - next-auth/react: Para verificación de sesión en el cliente.
 *
 */
