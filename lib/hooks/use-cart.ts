/**
 * Descripción: Hook principal para gestionar el carrito de compras usando SWR.
 *   Incluye verificacion de sesion (NextAuth) para evitar peticiones al API
 *   cuando el usuario no esta autenticado: la key de SWR se establece en null
 *   en ese caso, suprimiendo fetch y revalidaciones de forma nativa.
 * Requiere: Sesion activa de NextAuth (status === "authenticated").
 * Implementa: HU-009 (Gestion del carrito)
 */

import useSWR from "swr";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

// Interfaces para el tipado
export interface CartProduct {
  id: string;
  name: string;
  price: number;
  stock: number;
  images: string[];
  vendor: {
    businessName: string;
  };
}

export interface CartItemType {
  id: string;
  quantity: number;
  productId: string;
  product: CartProduct;
}

export interface CartSummary {
  subtotal: number;
  total: number;
  itemsCount: number;
}

export interface CartData {
  success: boolean;
  items: CartItemType[];
  summary: CartSummary;
  error?: string;
}

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al cargar el carrito");
  return data;
};

export function useCart(enabled: boolean = true) {
  const { status } = useSession();
  const { data, error, isLoading, mutate } = useSWR<CartData>(
    status === "authenticated" && enabled ? "/api/cart" : null,
    fetcher,
  );

  // Mover producto al carrito
  const addToCart = async (productId: string, quantity: number = 1) => {
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Error al agregar al carrito");
      }

      toast.success("Producto agregado al carrito");
      // Revalidar los datos en background
      mutate();
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al agregar al carrito";
      toast.error(message);
      return false;
    }
  };

  // Actualizar cantidad de un item
  const updateQuantity = async (itemId: string, quantity: number) => {
    // Actualización optimista (UI instantánea)
    if (data) {
      const updatedItems = data.items.map((item) =>
        item.id === itemId ? { ...item, quantity } : item,
      );

      const newSummary = {
        ...data.summary,
        itemsCount: updatedItems.reduce((acc, i) => acc + i.quantity, 0),
        subtotal: updatedItems.reduce(
          (acc, i) => acc + i.product.price * i.quantity,
          0,
        ),
      };

      mutate({ ...data, items: updatedItems, summary: newSummary }, false);
    }

    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Error al actualizar cantidad");
      }

      // Forzar revalidación real
      mutate();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al actualizar cantidad";
      toast.error(message);
      mutate(); // Revertir actualización optimista si falló
    }
  };

  // Eliminar un item del carrito
  const removeItem = async (itemId: string) => {
    // Actualización optimista
    if (data) {
      const updatedItems = data.items.filter((item) => item.id !== itemId);
      const newSummary = {
        ...data.summary,
        itemsCount: updatedItems.reduce((acc, i) => acc + i.quantity, 0),
        subtotal: updatedItems.reduce(
          (acc, i) => acc + i.product.price * i.quantity,
          0,
        ),
      };
      mutate({ ...data, items: updatedItems, summary: newSummary }, false);
    }

    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Error al eliminar producto");
      }

      toast.success("Producto eliminado del carrito");
      mutate();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al eliminar producto";
      toast.error(message);
      mutate(); // Revertir si falló
    }
  };

  // Vaciar carrito
  const clearCart = async () => {
    try {
      const response = await fetch("/api/cart", { method: "DELETE" });

      if (!response.ok) {
        throw new Error("Error al vaciar el carrito");
      }

      mutate(
        {
          success: true,
          items: [],
          summary: { itemsCount: 0, subtotal: 0, total: 0 },
        },
        false,
      );
      toast.success("Carrito vaciado");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al vaciar el carrito";
      toast.error(message);
    }
  };

  return {
    items: data?.items || [],
    summary: data?.summary || { itemsCount: 0, subtotal: 0, total: 0 },
    cartCount: data?.summary?.itemsCount || 0,
    isLoading,
    isError: error,
    mutate,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
  };
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACION
 * ---------------------------------------------------------------------------
 *
 * Descripcion General:
 * Proporciona todas las operaciones necesarias para interactuar con el carrito
 * desde el cliente, manteniendo el estado sincronizado con el backend usando SWR.
 *
 * Logica Clave:
 * - Verificacion de Sesion (Performance): Se obtiene el estado de autenticacion
 *   con useSession(). La key del useSWR se evalua como:
 *   status === "authenticated" ? "/api/cart" : null
 *   Cuando es null, SWR no ejecuta ningun fetch ni programa revalidaciones,
 *   eliminando peticiones 401 innecesarias para usuarios anonimos o en estado
 *   "loading". Esto reduce trafico de red y errores en consola.
 * - Actualizacion Optimista: 'updateQuantity' y 'removeItem' modifican el estado
 *   local inmediatamente usando 'mutate(newData, false)' antes de hacer la
 *   peticion HTTP. Esto hace que la UI se sienta instantanea (UX premium).
 *   Si la peticion falla, se llama a 'mutate()' sin argumentos para revertir
 *   a los datos reales de la base de datos.
 * - Tipado: Se exportan interfaces como 'CartItemType' para que los componentes
 *   UI puedan tipar correctamente sus props.
 *
 * Dependencias Externas:
 * - next-auth/react: useSession para leer el estado de autenticacion.
 * - swr: Gestion de estado asincrono con cache y revalidacion.
 * - sonner: Notificaciones de feedback al usuario.
 *
 */
