"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, CreditCard, MapPin, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/context/CartContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import PaymentModal from "@/components/products/PaymentModal";
import { Municipality } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

/**
 * Descripción: Sección del carrito de compras para el usuario adoptante con gestión de cantidades y checkout.
 * Requiere: CartProvider y SessionProvider.
 * Implementa: HU-009 (Simulación de compra de productos y generación de pedido).
 */

interface CustomUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: string;
  municipality?: Municipality;
  address?: string;
}

const CartSection: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const user = session?.user as CustomUser | undefined;

  const [municipality, setMunicipality] = useState<Municipality>(user?.municipality || Municipality.MEDELLIN);
  const [address, setAddress] = useState(user?.address || "");

  const handleCheckout = () => {
    if (!session) {
      toast.error("Debes iniciar sesión para finalizar la compra");
      router.push("/auth/login");
      return;
    }

    if (!address || address.length < 5) {
      toast.error("Por favor, ingresa una dirección de envío válida");
      return;
    }

    setIsPaymentModalOpen(true);
  };

  const handleConfirmOrder = async () => {
    setIsProcessing(true);
    const toastId = toast.loading("Procesando tu pedido...");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cart.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
          shippingMunicipality: municipality,
          shippingAddress: address,
          paymentMethod: "SIMULATED_CARD",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al procesar el pedido");
      }

      toast.success("¡Pedido realizado con éxito! Gracias por tu compra simulada.", { id: toastId });
      clearCart();
      setIsPaymentModalOpen(false);
      router.push("/user");
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo procesar el pedido";
      toast.error(message, { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (cart.length === 0) {
    return (
      <section className="max-w-4xl mx-auto p-12 bg-white shadow-sm rounded-xl text-center">
        <div className="flex justify-center mb-6">
          <div className="p-6 bg-purple-50 rounded-full text-purple-600">
            <ShoppingBag size={64} />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Tu carrito está vacío</h2>
        <p className="text-gray-500 text-lg mb-8">
          Parece que aún no has añadido productos a tu carrito. ¡Explora nuestra tienda y encuentra lo mejor para tu mascota!
        </p>
        <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
          <Link href="/productos">Ir a la Tienda</Link>
        </Button>
      </section>
    );
  }

  return (
    <section className="max-w-6xl mx-auto p-4 sm:p-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
        <ShoppingBag className="text-purple-600" />
        Tu Carrito de Compras
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="relative w-24 h-24 flex-shrink-0">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  className="object-cover rounded-lg bg-gray-50"
                />
              </div>

              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{item.name}</h3>
                <p className="text-purple-600 font-semibold">{formatPrice(item.price)} c/u</p>

                <div className="flex items-center justify-center sm:justify-start gap-4 mt-3">
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden h-9">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-3 hover:bg-gray-100 text-gray-600 transition-colors"
                      disabled={item.quantity <= 1}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-10 text-center font-medium text-gray-900">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-3 hover:bg-gray-100 text-gray-600 transition-colors"
                      disabled={item.quantity >= item.stock}
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-2"
                    title="Eliminar producto"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>

              <div className="text-right min-w-[100px]">
                <p className="text-xl font-bold text-gray-900">{formatPrice(item.price * item.quantity)}</p>
              </div>
            </div>
          ))}

          <div className="pt-4">
            <Button variant="ghost" onClick={clearCart} className="text-red-500 hover:text-red-600 hover:bg-red-50">
              <Trash2 className="mr-2 h-4 w-4" />
              Vaciar carrito
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="text-purple-600" size={20} />
              Información de Envío
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Municipio (Valle de Aburrá)</label>
                <select
                  value={municipality}
                  onChange={(e) => setMunicipality(e.target.value as Municipality)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                >
                  {Object.values(Municipality).map((m) => (
                    <option key={m} value={m}>
                      {m.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección de entrega</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ej: Calle 10 # 43E-11, Apto 502"
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition-all resize-none h-24"
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-900 text-white p-6 rounded-xl shadow-xl">
            <h3 className="text-xl font-bold mb-6 border-b border-gray-800 pb-4">Resumen del Pedido</h3>

            <div className="space-y-4 text-gray-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white font-medium">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Envío</span>
                <span className="text-teal-400 font-bold bg-teal-400/10 px-2 py-1 rounded text-xs">GRATIS</span>
              </div>

              <div className="flex justify-between text-2xl font-bold pt-6 border-t border-gray-800 text-white">
                <span>Total</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
            </div>

            <Button
              onClick={handleCheckout}
              className="w-full mt-8 bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg font-bold rounded-xl shadow-lg shadow-purple-900/20 transition-all active:scale-95"
            >
              <CreditCard className="mr-2 h-5 w-5" />
              Finalizar Compra
            </Button>

            <p className="mt-4 text-center text-xs text-gray-500">
              Al finalizar, confirmas que aceptas nuestros términos de compra simulada.
            </p>
          </div>
        </div>
      </div>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onConfirm={handleConfirmOrder}
        isLoading={isProcessing}
      />
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
 * Este componente es el centro de control del carrito de compras. Permite a los
 * usuarios gestionar sus productos y realizar el proceso de checkout simulado.
 *
 * Lógica Clave:
 * - Integración de Contexto: Utiliza useCart para sincronizar el estado del
 *   carrito en toda la aplicación.
 * - Validación de Envío: Asegura que se proporcione una dirección antes de permitir
 *   la apertura del modal de pago.
 * - Checkout Simulado: Realiza una petición POST a /api/orders para persistir
 *   la compra y descontar stock real en la base de datos.
 * - Diseño Responsivo: Ajusta la disposición de la lista de productos y el
 *   resumen de pago según el tamaño de la pantalla.
 *
 * Dependencias Externas:
 * - next-auth/react: Para acceder a la información del usuario autenticado.
 * - lucide-react: Para iconografía intuitiva.
 * - CartContext: El motor de estado del carrito.
 *
 */
