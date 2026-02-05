'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ScanLine, ShoppingCart } from 'lucide-react';
import Loader from '@/components/ui/loader';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button-variants';

/**
 * Descripción: Sección del carrito de compras para el usuario adoptante.
 * Requiere: Estado local o global de items del carrito.
 * Implementa: HU-004 (Visualización del Panel de Usuario).
 */

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

const CartSection: React.FC = () => {
  // Datos de ejemplo para el boilerplate
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  // Simulación de carga de datos inicial
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="bg-white rounded-lg shadow-sm p-6">
      {/* Header */}
      <div className="mb-2">
        <h2 className="flex flex-inline items-center text-2xl font-bold text-gray-900 mb-2">
          <ShoppingCart size={26} className="mr-2" />
          Carrito de Compras
        </h2>
        <p className="text-gray-600">
          {items.length === 0
            ? 'No tienes nada en tu carrito de compras'
            : `Tienes ${items.length} producto${items.length !== 1 ? 's' : ''} en tu carrito de compras`}
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader />
          <p className="text-gray-500">Cargando carrito...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12">
          <ScanLine className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">No tienes nada en tu carrito de compras</p>
          <p className="text-sm text-gray-400 mb-4">
            Cuando agregues cualquier producto a tu carrito, aparecerá justo aquí
          </p>
          <Link
            href="/productos"
            className={cn(buttonVariants({ variant: 'default' }))}
          >
            Explorar productos
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de Productos */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  width={80}
                  height={80}
                  className="object-cover rounded-md bg-gray-100"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-xs text-red-500 mt-2 hover:underline"
                  >
                    Eliminar
                  </button>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Resumen del Pedido */}
          <div className="bg-gray-50 p-6 rounded-lg h-fit">
            <h3 className="text-lg font-bold mb-4 border-b pb-2">Resumen</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Envío</span>
                <span className="text-green-600 font-medium">Gratis</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-4 border-t">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
            </div>
            <button className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition">
              Finalizar Compra
            </button>
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

