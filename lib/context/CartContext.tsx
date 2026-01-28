"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";

/**
 * Descripción: Contexto para la gestión del carrito de compras.
 * Requiere: React Context API.
 * Implementa: HU-009 (Simulación de compra de productos y generación de pedido).
 */

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  stock: number;
  vendorId: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const { status } = useSession();
  const [prevStatus, setPrevStatus] = useState(status);

  // Efecto de limpieza al cerrar sesión
  useEffect(() => {
    if (prevStatus === "authenticated" && status === "unauthenticated") {
      setCart([]);
    }
    setPrevStatus(status);
  }, [status, prevStatus]);

  // Efecto de inicialización: Carga desde localStorage una sola vez al montar
  useEffect(() => {
    const savedCart = localStorage.getItem("pawlig_cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          setCart(parsedCart);
        }
      } catch (error) {
        console.error("Error al cargar el carrito:", error);
      }
    }
    setIsInitialized(true);
  }, []);

  // Efecto de persistencia: Guarda en localStorage cada vez que el carrito cambia
  // IMPORTANTE: Solo se ejecuta después de que la carga inicial haya terminado (isInitialized)
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("pawlig_cart", JSON.stringify(cart));
    }
  }, [cart, isInitialized]);

  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((i) => i.id === item.id);
      if (existingItem) {
        return prevCart.map((i) =>
          i.id === item.id ? { ...i, quantity: Math.min(i.quantity + 1, i.stock) } : i
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id === id) {
          const newQuantity = Math.max(1, Math.min(quantity, item.stock));
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart debe ser usado dentro de un CartProvider");
  }
  return context;
};

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Este contexto gestiona el estado global del carrito de compras, permitiendo
 * agregar, eliminar y actualizar cantidades de productos con persistencia.
 *
 * Lógica Clave:
 * - Evitar condiciones de carrera: Se utiliza el estado 'isInitialized' para
 *   asegurar que el carrito no se sobrescriba con un array vacío en localStorage
 *   antes de que se complete la carga de los datos guardados.
 * - Sincronización: El estado del carrito se mantiene sincronizado con
 *   localStorage de forma reactiva mediante useEffect.
 * - Validaciones de Stock: Se garantiza que la cantidad en el carrito nunca
 *   exceda el stock disponible reportado por el producto.
 *
 * Dependencias Externas:
 * - React Hooks: useState, useEffect y useContext.
 *
 */
