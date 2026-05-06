import React from 'react';
import { ShoppingCart, PackageX } from 'lucide-react';
import Link from 'next/link';
import Loader from '@/components/ui/loader';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button-variants';
import { useCart } from "@/lib/hooks/use-cart";
import { useCartSync } from "@/lib/hooks/use-cart-sync";
import CartItem from "@/components/cart/cart-item";
import CartSummary from "@/components/cart/cart-summary";

/**
 * Descripción: Sección del carrito de compras para el usuario adoptante conectada a la base de datos.
 * Requiere: Usuario autenticado.
 * Implementa: HU-009 (Gestión del carrito persistente).
 */

const CartSection: React.FC = () => {
  const { items, isLoading, isError, mutate } = useCart();
  
  // Activar sincronización en tiempo real (polling y notificaciones)
  useCartSync();

  return (
    <section className="bg-white rounded-lg shadow-sm p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="flex items-center text-2xl font-bold text-gray-900 mb-2">
          <ShoppingCart size={26} className="mr-2 text-primary" />
          Carrito de Compras
        </h2>
        <p className="text-gray-600">
          {isLoading ? (
            'Actualizando carrito...'
          ) : !items || items.length === 0 ? (
            'No tienes nada en tu carrito de compras'
          ) : (
            `Tienes ${items.length} producto${items.length !== 1 ? 's' : ''} en tu carrito de compras`
          )}
        </p>
      </div>

      {isLoading && (!items || items.length === 0) ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader />
          <p className="text-gray-500 mt-4">Cargando tu carrito desde la base de datos...</p>
        </div>
      ) : isError ? (
        <div className="text-center py-12 bg-red-50 rounded-lg border border-red-100">
          <p className="text-red-600 font-medium">Error al sincronizar con el servidor.</p>
          <button 
            onClick={() => mutate()} 
            className="mt-2 text-sm text-red-500 hover:underline"
          >
            Reintentar conexión
          </button>
        </div>
      ) : !items || items.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-200">
          <PackageX className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">Tu carrito está vacío</p>
          <p className="text-sm text-gray-400 mb-6 max-w-xs mx-auto">
            Explora nuestro catálogo y encuentra los mejores productos para tu mascota.
          </p>
          <Link
            href="/productos"
            className={cn(buttonVariants({ variant: 'default' }))}
          >
            Ver productos
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de Productos */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <CartItem key={item.id} item={item} mutate={mutate} />
            ))}
          </div>

          {/* Resumen del Pedido */}
          <div className="h-fit sticky top-24">
            <CartSummary items={items} />
          </div>
        </div>
      )}
    </section>
  );
};

export default CartSection;

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Este componente representa el carrito de compras dentro del perfil del usuario.
 * Actualmente funciona como un boilerplate con datos locales.
 *
 * Lógica Clave:
 * - removeItem: Gestiona la eliminación de productos del carrito en el estado local.
 * - subtotal: Cálculo reactivo del precio total basado en los items presentes.
 * - loading: Simula un tiempo de carga inicial para mejorar la experiencia de usuario
 *   y preparar el componente para futura integración con API.
 *
 * Dependencias Externas:
 * - Ninguna significativa (UI nativa de Tailwind).
 * - @/components/ui/loader: Componente visual de carga.
 *
 */

