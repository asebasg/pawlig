import { Metadata } from "next";
import CartSection from "@/components/adopter/CartSection";
import { ChevronRight, Home, ShoppingBag } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Carrito de Compras - PawLig",
  description: "Revisa los productos seleccionados para tu mascota antes de finalizar tu compra.",
};

/**
 * Descripción: Página pública del carrito de compras.
 * Requiere: CartProvider.
 * Implementa: HU-009 (Simulación de compra de productos y generación de pedido).
 */

export default function CartPage() {
  return (
    <main className="min-h-screen bg-gray-50/50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8 overflow-x-auto whitespace-nowrap pb-2">
          <Link href="/" className="hover:text-purple-600 flex items-center gap-1">
            <Home size={16} />
            Inicio
          </Link>
          <ChevronRight size={14} />
          <Link href="/productos" className="hover:text-purple-600">
            Productos
          </Link>
          <ChevronRight size={14} />
          <span className="text-purple-600 font-medium flex items-center gap-1">
            <ShoppingBag size={16} />
            Carrito
          </span>
        </nav>

        {/* Header de la página */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Tu Selección de Productos
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Cuidamos cada detalle para que tú y tu mascota reciban lo mejor. Revisa tu pedido antes de continuar.
          </p>
        </div>

        {/* Sección del Carrito */}
        <div className="bg-transparent">
          <CartSection />
        </div>
      </div>
    </main>
  );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Esta página sirve como el punto de entrada para que los usuarios revisen su
 * carrito de compras. Actúa como un contenedor para el componente CartSection.
 *
 * Lógica Clave:
 * - Breadcrumbs: Proporciona una navegación clara para mejorar la orientación
 *   del usuario dentro de la jerarquía de la tienda.
 * - Diseño: Utiliza un fondo suave y centrado para enfocar la atención en el
 *   contenido del carrito.
 *
 * Dependencias Externas:
 * - CartSection: Componente principal que maneja la lógica del carrito.
 * - lucide-react: Iconos para la navegación y breadcrumbs.
 *
 */
