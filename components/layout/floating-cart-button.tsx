/**
 * Componente: Botón flotante del carrito con contador.
 * Descripción: Muestra un botón circular en la esquina inferior derecha de la página
 * `/productos` con el número total de ítems en el carrito. Al hacer clic, redirige al
 * usuario al tab "Mi Carrito" dentro de `/user`.
 */
"use client";

import { useCart } from "@/lib/hooks/use-cart";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";

export default function FloatingCartButton() {
  const { cartCount, isLoading } = useCart();
  const router = useRouter();

  // Mostrar toast si el carrito está vacío y el usuario intenta interactuar
  const handleClick = () => {
    if (isLoading) {
      toast.info("Cargando", { description: "Espere mientras cargamos su carrito" });
      return;
    }
    router.push("/user?tab=cart");
  };

  const pathname = usePathname();
  // Mostrar solo en la página de productos
  if (!pathname?.startsWith("/productos")) {
    return null;
  }

  // Ocultar el botón si el usuario no está autenticado (el hook ya gestiona redirección)
  // No se necesita lógica extra aquí.

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg hover:bg-primary‑dark transition-colors"
      aria-label="Ver carrito"
    >
      {/* Icono carrito */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        className="h-6 w-6"
      >
        <path d="M6 6h15l-1.5 9h-13.5L6 6z" />
        <circle cx="9" cy="20" r="1" />
        <circle cx="18" cy="20" r="1" />
      </svg>
      {/* Contador */}
      {cartCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-600 text-xs font-medium text-white">
          {cartCount}
        </span>
      )}
    </button>
  );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * - El botón está posicionando usando `fixed` y se muestra únicamente en la
 *   página `/productos` mediante la lógica de renderizado del layout que lo incluye.
 * - Se utiliza el hook `useCart` (ya existente) para obtener el número total de
 *   ítems y el estado de carga.
 * - Al hacer clic, el router de Next.js dirige a `/user?tab=cart`, donde el
 *   componente de tab `CartSection` se encarga de renderizar el contenido.
 * - Se muestra un toast informativo mientras el carrito está cargando.
 *
 * Dependencias Externas:
 * - `sonner` para notificaciones.
 * - `next/navigation` para el cliente router.
 */
