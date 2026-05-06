/**
 * Descripción: Hook principal para gestionar el carrito de compras usando SWR.
 * Requiere: Usuario autenticado (NextAuth).
 * Implementa: HU-009 (Gestión del carrito)
 */

import useSWR from "swr";
import { toast } from "sonner";

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

export function useCart() {
  const { data, error, isLoading, mutate } = useSWR<CartData>(
    "/api/cart",
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
    } catch (err: any) {
      toast.error(err.message);
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
    } catch (err: any) {
      toast.error(err.message);
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
    } catch (err: any) {
      toast.error(err.message);
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
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return {
    items: data?.items || [],
    summary: data?.summary || { itemsCount: 0, subtotal: 0, total: 0 },
    cartCount: data?.summary?.itemsCount || 0,
    isLoading,
    isError: error,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
  };
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Proporciona todas las operaciones necesarias para interactuar con el carrito
 * desde el cliente, manteniendo el estado sincronizado con el backend usando SWR.
 *
 * Lógica Clave:
 * - Actualización Optimista: 'updateQuantity' y 'removeItem' modifican el estado local
 *   inmediatamente usando 'mutate(newData, false)' antes de hacer la petición HTTP.
 *   Esto hace que la UI se sienta instantánea (UX premium). Si la petición falla,
 *   se llama a 'mutate()' sin argumentos para revertir a los datos reales de la BD.
 * - Tipado: Se exportan interfaces como 'CartItemType' para que los componentes UI
 *   puedan tipar correctamente sus props.
 *
 */
