"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, CreditCard, MapPin, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/context/CartContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import PaymentModal from "@/components/products/PaymentModal";
import { Municipality } from "@prisma/client";
import { useRouter } from "next/navigation";
import Loader from "@/components/ui/loader";

/**
 * Descripción: Sección del carrito de compras para el usuario adoptante con gestión de cantidades y checkout.
 * Requiere: CartProvider.
 * Implementa: HU-009 (Simulación de compra de productos y generación de pedido).
 */

interface UserProfile {
  id: string;
  name: string;
  phone: string;
  municipality: Municipality;
  address: string;
}

const CartSection: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const router = useRouter();

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  const [municipality, setMunicipality] = useState<Municipality>(Municipality.MEDELLIN);
  const [address, setAddress] = useState("");

  // Cargar datos del usuario desde la DB al montar
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/user/profile");
        if (!response.ok) {
          if (response.status === 401) {
             // Si no está autenticado, el middleware o AdopterDashboard ya deberían manejarlo,
             // pero por si acaso redirigimos.
             router.push("/login");
             return;
          }
          throw new Error("Error al obtener perfil");
        }
        const data: UserProfile = await response.json();
        setMunicipality(data.municipality);
        setAddress(data.address);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("No se pudo cargar tu información de envío guardada.");
      } finally {
        setIsLoadingUser(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleCheckout = () => {
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
      // Redirigir a la pestaña de solicitudes o dashboard principal
      router.push("/user?tab=adoptions");
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
    <section className="max-w-6xl mx-auto p-2 sm:p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lista de Productos */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
             <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <ShoppingBag className="text-purple-600" size={24} />
                Productos en el Carrito
             </h2>
             <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row items-center gap-4 p-4 border-b border-gray-50 last:border-0">
                    <div className="relative w-20 h-20 flex-shrink-0">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover rounded-lg bg-gray-50"
                      />
                    </div>

                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="font-bold text-gray-900 line-clamp-1">{item.name}</h3>
                      <p className="text-purple-600 font-semibold text-sm">{formatPrice(item.price)} c/u</p>

                      <div className="flex items-center justify-center sm:justify-start gap-4 mt-2">
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden h-8">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-2 hover:bg-gray-100 text-gray-600 transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center font-medium text-gray-900 text-sm">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2 hover:bg-gray-100 text-gray-600 transition-colors"
                            disabled={item.quantity >= item.stock}
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                          title="Eliminar"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>

                    <div className="text-right min-w-[100px]">
                      <p className="text-lg font-bold text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
             </div>

             <div className="mt-6 flex justify-between items-center">
                <Button variant="ghost" onClick={clearCart} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Vaciar carrito
                </Button>
                <div className="text-right">
                   <p className="text-gray-500 text-sm">Subtotal</p>
                   <p className="text-2xl font-bold text-gray-900">{formatPrice(totalPrice)}</p>
                </div>
             </div>
          </div>
        </div>

        {/* Resumen y Envío */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="text-purple-600" size={20} />
              Información de Envío
            </h3>

            {isLoadingUser ? (
               <div className="flex justify-center py-8">
                  <Loader />
               </div>
            ) : (
               <div className="space-y-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Municipio</label>
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
            )}
          </div>

          <div className="bg-gray-900 text-white p-6 rounded-xl shadow-xl">
            <h3 className="text-xl font-bold mb-6 border-b border-gray-800 pb-4">Resumen del Pedido</h3>

            <div className="space-y-4 text-gray-300">
              <div className="flex justify-between">
                <span>Total Productos</span>
                <span className="text-white font-medium">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Costo Envío</span>
                <span className="text-teal-400 font-bold bg-teal-400/10 px-2 py-1 rounded text-xs">GRATIS</span>
              </div>

              <div className="flex justify-between text-2xl font-bold pt-6 border-t border-gray-800 text-white">
                <span>Total a Pagar</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
            </div>

            <Button
              onClick={handleCheckout}
              disabled={isLoadingUser || isProcessing}
              className="w-full mt-8 bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg font-bold rounded-xl shadow-lg shadow-purple-900/20 transition-all active:scale-95"
            >
              <CreditCard className="mr-2 h-5 w-5" />
              Finalizar Compra
            </Button>

            <p className="mt-4 text-center text-xs text-gray-500 italic">
              Este es un proceso de compra simulado para fines académicos.
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
 * - Autocompletado de Datos: Al cargar, obtiene la información de perfil del
 *   usuario desde /api/user/profile para precargar la dirección y municipio.
 * - Integración de Contexto: Utiliza useCart para sincronizar el estado del
 *   carrito en toda la aplicación.
 * - Validación de Envío: Asegura que se proporcione una dirección antes de permitir
 *   la apertura del modal de pago.
 * - Checkout Simulado: Realiza una petición POST a /api/orders para persistir
 *   la compra y descontar stock real en la base de datos.
 *
 * Dependencias Externas:
 * - next/navigation: Para redirección programática tras el éxito.
 * - sonner: Para feedback interactivo.
 * - CartContext: El motor de estado del carrito.
 *
 */
