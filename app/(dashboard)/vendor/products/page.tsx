import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/utils/db";
import { getProducts, getVendorProductStats } from "@/lib/services/product.service";
import { ProductsClient } from "@/components/vendor/ProductsClient";
import { VendorStats } from "@/components/vendor/VendorStats";
import { buttonVariants } from "@/components/ui/button-variants";
import { Metadata } from "next";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Plus } from "lucide-react";

/**
 *  PAGE: /vendor/products
 * Página principal del dashboard de gestión de productos para vendedores.
 * Valida autenticación, rol VENDOR y estado de verificación del vendedor.
 */

export const metadata: Metadata = {
    title: "Gestiona tus productos",
    description: "Panel de administración de productos para vendedores",
};

export default async function VendorProductsPage() {
    const session = await getServerSession(authOptions);

    // Verificar autenticación
    if (!session || !session.user) {
        redirect("/login?callbackUrl=/vendor/products");
    }

    // Verificar rol VENDOR
    if (session.user.role !== "VENDOR") {
        redirect("/unauthorized?reason=vendor_only");
    }

    // Obtener ID del vendor y verificar estado
    const vendorId = session.user.vendorId as string;

    // Obtener datos del vendor para verificar estado de verificación
    const vendor = await prisma.vendor.findUnique({
        where: { id: vendorId as string },
        select: { verified: true },
    });

    // Verificar que el VENDOR esté verificado
    if (!vendor?.verified) {
        // Tiene cuenta de vendedor pero aún no ha sido aprobada por admin
        redirect("/unauthorized?reason=vendor_not_verified");
    }

    // ✅ Autenticado + ✅ Rol VENDOR + ✅ Vendor verificado
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

        // Fallback data
        productsData = { products: [], total: 0, page: 1, totalPages: 0 };
        stats = { total: 0, inStock: 0, outOfStock: 0, lowStock: 0 };
    }

    return (
        <div className="container mx-auto py-8 px-4">
            {/* Header con título y botón */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Mis Productos</h1>
                    <p className="text-muted-foreground">Gestiona tu inventario</p>
                </div>
                <Link
                    href="/vendor/products/new"
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
 * Server Component que orquesta la vista de inventario del vendedor.
 * Implementa validación robusta de estado de verificación del vendedor.
 *
 * Lógica Clave:
 * - Validación en Cascada (4 niveles):
 *   1. Autenticación → redirect /login?callbackUrl=/vendor/products (una vez autenticado, vuelve adonde estaba).
 *   2. No tiene rol VENDOR → redirect /unauthorized (no es vendedor).
 *   3. vendorId existe pero verified === false → redirect /unauthorized?reason=vendor_not_verified (cuenta no verificada).
 *   4. vendor.verified === true → Todo OK.
 * 
 * - Flujo de Redirección según Estado:
 *   No autenticado → /login con callback a /vendor/products
 *   No es VENDOR → /unauthorized?reason=vendor_only
 *   No tiene vendorId → /unauthorized?reason=vendor_only 
 *   Tiene vendorId pero verified=false → /unauthorized?reason=vendor_not_verified (esperando aprobación)
 *   Todo OK → Muestra dashboard
 * 
 * - Performance:
 *   Una sola query adicional (vendor.verified) antes de cargar productos.
 *   Evita cargar datos innecesarios si el usuario no está verificado.
 *
 * Dependencias Externas:
 * - Prisma: Para verificar estado vendor.verified
 * - Services: getProducts, getVendorProductStats
 * - Componentes: VendorStats, ProductsClient
 */