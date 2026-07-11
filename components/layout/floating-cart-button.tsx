/**
 * Componente: Boton flotante del carrito con contador.
 * Descripcion: Muestra un boton circular en la esquina inferior derecha unicamente
 *   en la pagina /productos y cuando el usuario tiene sesion activa. Controla su
 *   propia visibilidad evaluando ruta y sesion antes de renderizar. Pasa el flag
 *   enabled a useCart para suprimir el fetch en rutas donde el carrito no aplica,
 *   agregando una tercera capa de optimizacion de red junto a la guarda de ruta
 *   y la verificacion de sesion del propio hook.
 * Requiere: Sesion activa de NextAuth (status === "authenticated") y ruta /productos.
 * Implementa: HU-009 (Acceso rapido al carrito desde el catalogo de productos)
 */
"use client";

import { useCart } from "@/lib/hooks/use-cart";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

export default function FloatingCartButton() {
  const pathname = usePathname();
  const { cartCount, isLoading } = useCart(pathname?.startsWith("/productos"));
  const { status } = useSession();
  const router = useRouter();

  if (!pathname?.startsWith("/productos") || status !== "authenticated") return null;

  // Mostrar toast si el carrito está vacío y el usuario intenta interactuar
  const handleClick = () => {
    if (isLoading) {
      toast.info("Cargando", { description: "Espere mientras cargamos su carrito" });
      return;
    }
    router.push("/user?tab=cart");
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg hover:bg-primary‑dark transition-colors"
      aria-label="Ver carrito"
    >
      {/* Icono carrito */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        className="h-6 w-6"
      >
        <path d="M6 6h15l-1.5 9h-13.5L6 6z" />
        <circle cx="9" cy="20" r="1" />
        <circle cx="18" cy="20" r="1" />
      </svg>
      {/* Contador */}
      {cartCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-600 text-xs font-medium text-white">
          {cartCount}
        </span>
      )}
    </button>
  );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACION
 * ---------------------------------------------------------------------------
 *
 * Descripcion General:
 * Boton de acceso rapido al carrito, fijo en la esquina inferior derecha.
 * Implementa tres capas de optimizacion de red para evitar peticiones
 * innecesarias al API en cualquier escenario donde el carrito no es relevante.
 *
 * Logica Clave:
 * - Orden de Hooks (Dependencia): pathname se declara primero porque su valor
 *   se pasa como argumento enabled a useCart en la siguiente linea. Esto permite
 *   evaluar la ruta antes de que SWR decida si hace fetch o no.
 * - Flag enabled en useCart (Performance, Capa 1): Se invoca useCart con
 *   pathname?.startsWith("/productos") como argumento enabled. Cuando la ruta
 *   no es /productos, enabled es false y la key de SWR queda null, suprimiendo
 *   el fetch desde el propio hook sin importar el estado de sesion.
 * - Verificacion de Sesion en useCart (Performance, Capa 2): Incluso si enabled
 *   es true, el hook useCart evalua internamente status === "authenticated". Si
 *   no hay sesion activa, la key tambien queda null y no se ejecuta fetch.
 * - Guarda de Visibilidad (Capa 3): La condicion temprana
 *   if (!pathname?.startsWith("/productos") || status !== "authenticated") return null
 *   garantiza que el componente no monta JSX si la ruta o la sesion no son
 *   validas, independientemente del estado del hook.
 * - Actualizacion de Estado durante Carga: Si el usuario hace clic mientras
 *   isLoading es true, se muestra un toast informativo en lugar de navegar,
 *   evitando que llegue a /user con datos incompletos.
 *
 * Dependencias Externas:
 * - next-auth/react: useSession para verificar el estado de autenticacion.
 * - next/navigation: useRouter para navegacion programatica, usePathname para
 *   detectar la ruta activa y calcular el flag enabled.
 * - sonner: Notificaciones de feedback al usuario.
 *
 */
