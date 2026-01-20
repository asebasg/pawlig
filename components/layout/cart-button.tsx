"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";

/**
 * Ruta/Componente/Servicio: Componente CartButton
 * Descripción: Un icono de carrito de compras que muestra el número de artículos.
 * Requiere: -
 * Implementa: -
 */

interface CartButtonProps {
  itemCount?: number;
}

export function CartButton({ itemCount = 0 }: CartButtonProps) {
  return (
    <Link 
      href="/productos/cart"
      className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
    >
      <ShoppingCart 
        size={24} 
        className={itemCount > 0 ? "text-purple-600" : "text-gray-600"}
      />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {itemCount > 9 ? "9+" : itemCount}
        </span>
      )}
    </Link>
  );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Este componente de UI muestra un icono de carrito de compras que enlaza a la
 * página del carrito. Opcionalmente, muestra un contador numérico si hay
 * artículos en él.
 *
 * Lógica Clave:
 * - 'Renderizado Condicional': El contador (un 'span' posicionado absolutamente)
 *   solo se renderiza si 'itemCount' es mayor que cero, manteniendo la interfaz
 *   limpia cuando el carrito está vacío.
 * - 'Límite del Contador': Para evitar problemas de diseño con números grandes,
 *   el contador muestra "9+" si el número de artículos es mayor que 9.
 *
 * Dependencias Externas:
 * - 'next/link': Para el enlace de navegación.
 * - 'lucide-react': Para el icono 'ShoppingCart'.
 *
 */
