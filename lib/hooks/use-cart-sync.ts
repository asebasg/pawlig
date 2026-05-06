/**
 * Descripción: Hook especializado para la sincronización en tiempo real del carrito (Polling).
 * Requiere: Hook principal `useCart` (este archivo lo complementa).
 * Implementa: HU-009 (Notificaciones de cambios en tiempo real del carrito)
 */

import { useEffect, useRef } from "react";
import useSWR from "swr";
import { toast } from "sonner";
import { CartData, CartItemType } from "./use-cart";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
};

export function useCartSync() {
  const previousItemsRef = useRef<Record<string, number>>({});

  // Polling configurado para ejecutarse cada 30 segundos
  const { data, error, mutate, isLoading } = useSWR<CartData>(
    "/api/cart",
    fetcher,
    {
      refreshInterval: 30000,
      revalidateOnFocus: true, // Revalidar cuando el usuario vuelve a la pestaña
    },
  );

  useEffect(() => {
    if (!data?.items) return;

    const currentItemsMap: Record<string, number> = {};
    data.items.forEach((item: CartItemType) => {
      currentItemsMap[item.id] = item.product.price;
    });

    const previousItemsMap = previousItemsRef.current;

    // Solo verificamos cambios si ya teníamos datos anteriores (no en el primer render)
    if (Object.keys(previousItemsMap).length > 0) {
      // 1. Detectar productos eliminados (o sin stock que el middleware borró)
      Object.keys(previousItemsMap).forEach((prevId) => {
        if (!currentItemsMap[prevId]) {
          toast.warning("Atención", {
            description:
              "Algunos productos de tu carrito ya no están disponibles y fueron removidos.",
            duration: 6000,
          });
        }
      });

      // 2. Detectar cambios de precio
      Object.keys(currentItemsMap).forEach((currentId) => {
        const prevPrice = previousItemsMap[currentId];
        const currentPrice = currentItemsMap[currentId];

        if (prevPrice !== undefined && prevPrice !== currentPrice) {
          toast.info("Precio actualizado", {
            description:
              "El precio de uno o más productos en tu carrito ha cambiado.",
            duration: 6000,
          });
        }
      });
    }

    // Actualizar referencia
    previousItemsRef.current = currentItemsMap;
  }, [data]);

  return {
    data,
    error,
    mutate,
    isLoading,
  };
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Mantiene el carrito actualizado automáticamente. Implementa polling mediante SWR
 * para consultar el servidor cada 30 segundos y notifica al usuario si ocurren
 * cambios inesperados (como que el middleware de Prisma elimine un item agotado).
 *
 * Lógica Clave:
 * - Detección de Deltas: Se utiliza `useRef` para almacenar un diccionario de los
 *   ítems (ID -> Precio) obtenidos en la última consulta exitosa. Luego se compara
 *   contra la consulta actual.
 * - Experiencia de Usuario: Si un producto desaparece misteriosamente de la lista
 *   (porque su stock llegó a 0 y el backend lo eliminó), se lanza un toast tipo
 *   warning para que el usuario no crea que es un bug visual.
 *
 */
