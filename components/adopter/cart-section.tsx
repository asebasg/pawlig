/**
 * Componente: Sección del carrito (tab "Mi Carrito").
 * Descripción: Renderiza la lista de items del carrito y el resumen de compra.
 */
"use client";

import { useCart } from "@/lib/hooks/use-cart";
import { useCartSync } from "@/lib/hooks/use-cart-sync";
import CartItem from "@/components/cart/cart-item";
import CartSummary from "@/components/cart/cart-summary";
import { toast } from "sonner";

/**
 * Renderiza el contenido del tab "Mi Carrito" dentro de la página de usuario.
 */
export default function CartSection() {
  const { items, isLoading, isError, mutate } = useCart();
  // Initialize synchronization
  useCartSync();

  if (isLoading) {
    return <p className="text-center text-gray-600">Cargando carrito…</p>;
  }

  if (isError) {
    toast.error("Error al cargar el carrito", { description: "Error al cargar el carrito" });
    return (
      <p className="text-center text-red-600">Error al cargar el carrito.</p>
    );
  }

  if (!items || items.length === 0) {
    return <p className="text-center text-gray-600">Tu carrito está vacío.</p>;
  }

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* Lista de items */}
      <div className="space-y-4">
        {items.map((item) => (
          <CartItem key={item.id} item={item} mutate={mutate} />
        ))}
      </div>

      {/* Resumen y botón de checkout */}
      <CartSummary items={items} mutate={mutate} />
    </div>
  );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * - Utiliza el hook `useCart` (que ya expone `items`, `cartCount`, `isLoading`,
 *   `error` y `mutate`).
 * - Cada `CartItem` recibe `mutate` para refrescar los datos tras actualizar o
 *   eliminar un item.
 * - `CartSummary` calcula subtotales y total a partir de los items y muestra el
 *   botón de checkout que redirige a `/checkout`.
 */
