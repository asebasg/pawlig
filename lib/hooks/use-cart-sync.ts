/**
 * Descripcion: Hook especializado para la sincronizacion en tiempo real del carrito (Polling).
 *   Incorpora verificacion de sesion para suspender el polling automaticamente
 *   cuando el usuario no esta autenticado: la key de SWR se fija en null,
 *   deteniendo tanto el fetch inicial como el intervalo de 30 s.
 * Requiere: Sesion activa de NextAuth (status === "authenticated") y hook useCart.
 * Implementa: HU-009 (Notificaciones de cambios en tiempo real del carrito)
 */

import { useEffect, useRef } from "react";
import useSWR from "swr";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { CartData, CartItemType } from "./use-cart";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
};

export function useCartSync() {
  const { status } = useSession();
  const previousItemsRef = useRef<Record<string, number>>({});

  // Polling configurado para ejecutarse cada 30 segundos
  const { data, error, mutate, isLoading } = useSWR<CartData>(
    status === "authenticated" ? "/api/cart" : null,
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
 * NOTAS DE IMPLEMENTACION
 * ---------------------------------------------------------------------------
 *
 * Descripcion General:
 * Mantiene el carrito actualizado automaticamente. Implementa polling mediante
 * SWR para consultar el servidor cada 30 segundos y notifica al usuario si
 * ocurren cambios inesperados (por ejemplo, cuando el middleware de Prisma
 * elimina un item agotado o el vendedor actualiza un precio).
 *
 * Logica Clave:
 * - Verificacion de Sesion (Performance): Se obtiene el estado de autenticacion
 *   con useSession(). La key del useSWR se evalua como:
 *   status === "authenticated" ? "/api/cart" : null
 *   Con key null, SWR suspende el fetch inicial y deja de programar el
 *   intervalo de refreshInterval (30 s), eliminando por completo el polling
 *   para usuarios anonimos sin necesidad de condiciones adicionales.
 * - Deteccion de Deltas: Se utiliza useRef para almacenar un diccionario de los
 *   items (ID -> Precio) obtenidos en la ultima consulta exitosa. Luego se
 *   compara contra la consulta actual para detectar eliminaciones y cambios de
 *   precio entre ciclos de polling.
 * - Experiencia de Usuario: Si un producto desaparece de la lista (stock a 0
 *   y el backend lo elimino), se lanza un toast tipo warning. Si el precio
 *   cambia, se lanza un toast tipo info. Ambos tienen duracion extendida (6 s)
 *   para asegurar que el usuario los vea.
 *
 * Dependencias Externas:
 * - next-auth/react: useSession para leer el estado de autenticacion.
 * - swr: Polling automatico con cache compartida con useCart.
 * - sonner: Notificaciones de feedback al usuario.
 *
 */
