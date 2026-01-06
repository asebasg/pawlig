"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProductTable } from "./ProductTable";
import { ProductWithVendor } from "@/lib/services/product.service";
import Loader from "@/components/ui/loader";
import { toast } from "sonner";

/**
 * Resúmen:
 * Componente cliente que maneja la visualización y estado de la lista de productos
 * del vendedor. Actúa como intermediario entre el Server Component (page) y
 * la tabla de presentación (ProductTable), manejando revalidación y feedback.
 */

interface ProductsClientProps {
    initialProducts: ProductWithVendor[];
    error?: string;
}

export function ProductsClient({ initialProducts, error }: ProductsClientProps) {
    // Lógica de negocio (estado local)
    const [products, setProducts] = useState(initialProducts);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const router = useRouter();

    // Manejo de errores iniciales desde el servidor
    useEffect(() => {
        if (error) {
            toast.error("Error al cargar productos", {
                description: error,
            });
        }
    }, [error]);

    // Sincronizar estado cuando initialProducts cambia (ej. post-revalidación)
    useEffect(() => {
        setProducts(initialProducts);
    }, [initialProducts]);

    // Revalidación de datos
    const handleProductUpdated = useCallback(async () => {
        setIsRefreshing(true);

        try {
            // Revalidar desde servidor
            router.refresh();
            // Nota: El useEffect se encargará de actualizar el estado local
            // cuando lleguen las nuevas props desde el servidor.
        } catch (error) {
            console.error("Error al actualizar la vista:", error);
            toast.error("Error de sincronización", {
                description: "Los datos se actualizaron pero hubo un problema al refrescar la vista."
            });
        } finally {
            setIsRefreshing(false);
        }
    }, [router]);

    return (
        <div className="mt-6 relative">
            {isRefreshing && (
                <div className="absolute top-0 right-0 z-10 bg-background/80 px-3 py-1 rounded-full border shadow-sm flex items-center gap-2 animate-in fade-in">
                    <Loader className="h-4 w-4" />
                    <span className="text-xs font-medium text-muted-foreground">Actualizando lista...</span>
                </div>
            )}

            <ProductTable
                products={products}
                onProductUpdated={handleProductUpdated}
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
 * Contenedor de cliente para la gestión de productos. Recibe los datos iniciales
 * del Server Component, maneja el estado local para actualizaciones optimistas
 * o sincronizadas, y coordina la revalidación con Next.js App Router.
 *
 * Lógica Clave:
 * - Sincronización de Props: Utiliza useEffect para actualizar el estado local `products`
 *   cuando `initialProducts` cambia. Esto es crucial porque router.refresh() actualiza
 *   las props del componente, pero no reinicia el estado local automáticamente si
 *   el componente no se desmonta.
 * - Manejo de Errores: Recibe un prop `error` opcional. Si existe, muestra un toast
 *   inmediato al montar. Esto permite que el Server Component delegue la UI de error
 *   al cliente preservando el shell de la aplicación.
 * - Feedback Visual: Muestra un indicador discreto "Actualizando lista..." durante
 *   las operaciones de refresco.
 *
 * Dependencias Externas:
 * - sonner: Para notificaciones de error no intrusivas.
 * - next/navigation (useRouter): Para invocar la revalidación de datos del servidor.
 * - ProductTable: Componente de presentación pura.
 */
