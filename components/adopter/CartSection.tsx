'use client';

import React from 'react';
import Image from 'next/image';

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
  const [items, setItems] = React.useState<CartItem[]>([
    {
      id: '1',
      name: 'Producto de Ejemplo',
      price: 29.99,
      quantity: 1,
      imageUrl: 'https://via.placeholder.com/80',
    },
  ]);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <section className="max-w-4xl mx-auto p-6 bg-white shadow-sm rounded-xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Tu Carrito</h2>

      {items.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">Tu carrito está vacío.</p>
          <button className="mt-4 text-blue-600 font-medium hover:underline">
            Continuar comprando
          </button>
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
 *
 * Dependencias Externas:
 * - Ninguna significativa (UI nativa de Tailwind).
 *
 */
