/**
 * Componente: CartSummary
 * Descripción: Muestra el resumen del carrito (subtotal, total) y un botón para ir al checkout.
 */
"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CartItemType, useCart } from "@/lib/hooks/use-cart";
import PaymentModal from "../products/PaymentModal";
import { useState } from "react";

interface CartSummaryProps {
  items: CartItemType[];
  mutate: () => void;
}

export default function CartSummary({ items, mutate }: CartSummaryProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { clearCart } = useCart();
  const router = useRouter();

  const subtotal = items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0,
  );
  // Por ahora, no hay costos adicionales ni descuentos, total = subtotal
  const total = subtotal;

  // Abre el modal de pago
  const handleCheckout = () => {
    // Aquí podríamos validar el carrito antes de redirigir
    if (items.length === 0) {
      toast.warning("El carrito está vacío.");
      return;
    }
    setIsModalOpen(true);
  };

  // Cerrar el modal y limpiar el carrito
  const handleConfirmPayment = async () => {
    setIsProcessing(true);
    // Simular transacción
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await clearCart();
    setIsProcessing(false);
    setIsModalOpen(false);
    toast.success("¡Compra realizada con éxito!", {
      description: "Gracias por apoyar a las mascotas de PawLig.",
    });
    router.push("/");
  };

  return (
    <div className="rounded-lg bg-background p-4 shadow-md">
      <div className="flex justify-between border-b pb-2 mb-4">
        <span className="text-gray-700">Subtotal</span>
        <span className="font-medium text-gray-900">
          ${subtotal.toLocaleString()}
        </span>
      </div>
      <div className="flex justify-between font-semibold text-lg mb-4">
        <span>Total</span>
        <span>${total.toLocaleString()}</span>
      </div>
      <button
        onClick={handleCheckout}
        className="w-full rounded-full bg-primary text-white py-2 hover:bg-primary‑dark transition-colors"
      >
        Confirmar compra
      </button>
      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmPayment}
        isLoading={isProcessing}
      />
    </div>
  );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * - Calcula subtotal sumando precio * cantidad de cada item.
 * - El total actualmente coincide con el subtotal (sin impuestos ni descuentos).
 * - Al pulsar el botón, redirige a `/checkout`; muestra toast si el carrito está vacío.
 * - Tailwind classes siguen el orden recomendado.
 */
