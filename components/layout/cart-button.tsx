"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";

/**
 * Descripción: Componente de UI para la barra de navegación que muestra un
 *              icono de carrito de compras y un indicador numérico de los
 *              artículos añadidos.
 * Requiere: Opcionalmente, el número de artículos en el carrito ('itemCount').
 * Implementa: HU-006 (Acceso al carrito de compras).
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
 * Este componente proporciona un punto de acceso visual y persistente al carrito
 * de compras del usuario. Está diseñado para ser colocado en la barra de
 * navegación principal.
 *
 * Lógica Clave:
 * - 'Renderizado Condicional': La insignia numérica (badge) que muestra la
 *   cantidad de artículos solo se renderiza si 'itemCount' es mayor que cero.
 *   Esto mantiene la interfaz limpia cuando el carrito está vacío.
 * - 'Indicador Visual': El color del icono 'ShoppingCart' cambia a púrpura
 *   cuando hay artículos en el carrito, proporcionando una clara señal visual
 *   al usuario.
 * - 'Límite del Contador': El texto de la insignia muestra "9+" si el número
 *   de artículos excede 9, para evitar problemas de alineación y diseño con
 *   números de dos o más dígitos.
 *
 * Dependencias Externas:
 * - 'next/link': Para una navegación optimizada del lado del cliente a la
 *   página del carrito.
 * - 'lucide-react': Para renderizar el icono 'ShoppingCart'.
 *
 */
