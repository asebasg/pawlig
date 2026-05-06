/**
 * Componente: CartItem
 * Descripción: Renderiza un elemento individual del carrito con imagen, nombre, precio,
 * cantidad y botones para actualizar o eliminar.
 */
"use client";

import { useCart } from "@/lib/hooks/use-cart";
import { toast } from "sonner";
import Image from "next/image";
import { X, Plus, Minus } from "lucide-react";

/**
 * Props del componente CartItem.
 */
interface CartItemProps {
  item: {
    id: string;
    quantity: number;
    product: {
      id: string;
      name: string;
      price: number;
      images: string[];
    };
  };
  mutate: () => void;
}

export default function CartItem({ item, mutate }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();

  const handleIncrease = async () => {
    await updateQuantity(item.id, item.quantity + 1);
    mutate();
  };

  const handleDecrease = async () => {
    if (item.quantity <= 1) {
      toast.warning("La cantidad mínima es 1");
      return;
    }
    await updateQuantity(item.id, item.quantity - 1);
    mutate();
  };

  const handleRemove = async () => {
    await removeItem(item.id);
    mutate();
  };

  return (
    <div className="flex items-center gap-4 rounded-lg bg-background p-3 shadow-sm">
      <Image
        src={item.product.images[0] ?? "/placeholder.png"}
        alt={item.product.name}
        width={64}
        height={64}
        className="rounded-md object-cover"
      />
      <div className="flex-1">
        <h3 className="text-base font-medium text-gray-900">{item.product.name}</h3>
        <p className="text-sm text-gray-600">${item.product.price.toLocaleString()}</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleDecrease}
          className="p-1 rounded-full bg-primary-100 text-primary hover:bg-primary-200 transition"
        >
          <Minus size={16} />
        </button>
        <span className="w-6 text-center text-sm">{item.quantity}</span>
        <button
          type="button"
          onClick={handleIncrease}
          className="p-1 rounded-full bg-primary-100 text-primary hover:bg-primary-200 transition"
        >
          <Plus size={16} />
        </button>
        <button
          type="button"
          onClick={handleRemove}
          className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * - Utiliza `useCart` para ejecutar acciones de actualización y eliminación.
 * - `mutate` se pasa desde el padre para refrescar los datos después de cada operación.
 * - Las clases Tailwind siguen el orden: layout → dimensión → espaciado → tipografía → colores → estado.
 * - Se muestra un toast de advertencia cuando se intenta disminuir por debajo de 1.
 */
