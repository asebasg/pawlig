import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { redirect } from "next/navigation";
import { getProducts, getVendorProductStats } from "@/lib/services/product.service";
import { ProductsClient } from "@/components/vendor/ProductsClient";
import { VendorStats } from "@/components/vendor/VendorStats";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Plus } from "lucide-react";

/**
 * Resúmen:
 * Página principal del dashboard de gestión de productos para vendedores.
 * Carga datos iniciales (productos y estadísticas) y delega la interactividad
 * al componente cliente ProductsClient.
 */

export default async function VendorProductsPage() {
    const session = await getServerSession(authOptions);

    // Verificar autenticación
    if (!session || !session.user) {
        redirect("/login");
    }

    // Verificar rol VENDOR
    if (session.user.role !== "VENDOR") {
        redirect("/dashboard");
    }

    // Obtener vendorId
    const vendorId = session.user.vendorId;
    if (!vendorId) {
        redirect("/dashboard");
    }

    let productsData;
    let stats;
    let error: string | undefined;

    // Obtener productos del vendedor (parallel fetch safe)
    try {
        const [fetchedProductsData, fetchedStats] = await Promise.all([
            getProducts({ vendorId, page: 1, limit: 50 }),
            getVendorProductStats(vendorId)
        ]);
        productsData = fetchedProductsData;
        stats = fetchedStats;
    } catch (e) {
        console.error("Error cargando productos de vendedor:", e);
        error = "No se pudieron cargar tus productos. Por favor intenta más tarde.";

        // Fallback data para que renderice la UI vacía al menos
        productsData = { products: [], total: 0, page: 1, totalPages: 0 };
        stats = { total: 0, inStock: 0, outOfStock: 0, lowStock: 0 };
    }

    return (
        <div className="container mx-auto py-8 px-4">
            {/* Header con título y botón */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1>Mis Productos</h1>
                    <p>Gestiona tu inventario</p>
                </div>
                <Link
                    href="/dashboard/vendor/products/new"
                    className={cn(buttonVariants({ variant: "default" }))}
                >
                    <Plus className="mr-2 h-4 w-4" /> Agregar Producto
                </Link>
            </div>

            {/* Estadísticas */}
            <VendorStats stats={stats} />

            {/* Tabla de productos (Client Component) */}
            <ProductsClient
                initialProducts={productsData.products}
                error={error}
            />
        </div>
    );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Server Component encargado de la orquestación de datos para la vista de
 * inventario. Realiza verificaciones de seguridad (Auth + Rol) y fetching
 * de datos en paralelo para optimizar el rendimiento.
 *
 * Lógica Clave:
 * - Seguridad: Verifica sesión y rol "VENDOR" antes de intentar cualquier carga
 *   de datos. Redirige agresivamente si no se cumplen las condiciones.
 * - Manejo de Errores: Envuelve las llamadas a la BD en un bloque try-catch.
 *   Si falla, no explota con un error 500, sino que pasa un objeto de datos vacío
 *   y un mensaje de error al cliente para que `ProductsClient` muestre un Toast.
 * - Performance: Usa `Promise.all` para obtener lista de productos y estadísticas
 *   simultáneamente, reduciendo el tiempo de bloqueo del renderizado (Waterfall).
 *
 * Dependencias Externas:
 * - Services: `getProducts`, `getVendorProductStats` (capa de datos).
 * - Componentes: `VendorStats` (presentacional), `ProductsClient` (interactivo).
 */
