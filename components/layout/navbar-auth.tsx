"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart } from "lucide-react";
import { UserMenu } from "./user-menu";
import { CartButton } from "./cart-button";
import { NAVIGATION_BY_ROLE } from "@/lib/constants";

/**
 * Componente: NavbarAuth
 * Descripción: Renderiza la sección de la barra de navegación para usuarios autenticados, mostrando enlaces específicos de su rol y acciones como el menú de usuario.
 * Requiere: Un objeto de usuario autenticado.
 * Implementa: HU-005
 */
interface NavbarAuthProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: string;
  };
}

export function NavbarAuth({ user }: NavbarAuthProps) {
  const pathname = usePathname();
  const navigation = NAVIGATION_BY_ROLE[user.role as keyof typeof NAVIGATION_BY_ROLE] || [];
  const displayNav = navigation;

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center gap-6">
        {displayNav.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`font-semibold text-base transition-colors pb-1 border-b-2 ${isActive
                  ? "text-purple-600 border-purple-600"
                  : "text-gray-700 border-transparent hover:text-purple-600"
                }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Actions */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Cart & Favorites - Sólo para rol ADOPTER */}
        {user.role === "ADOPTER" && (
          <>
            <Link
              href="/user?tab=favorites"
              className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Heart size={20} className="text-gray-600 sm:w-6 sm:h-6" />
            </Link>
            <CartButton />
          </>
        )}

        {/* User Menu */}
        <UserMenu user={user} />
      </div>
    </>
  );
}
/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Este componente define la vista de la barra de navegación para un usuario que ha iniciado sesión.
 * Muestra un conjunto de enlaces de navegación que dependen del rol del usuario y un conjunto de acciones,
 * como el acceso a favoritos, el carrito de compras (para ADOPTER) y el menú de usuario.
 *
 * Lógica Clave:
 * - NAVIGATION_BY_ROLE: Se importa un objeto constante que mapea roles de usuario a sus respectivos enlaces de navegación. El componente selecciona dinámicamente el array de enlaces correcto basándose en el user.role.
 * - usePathname: El hook de Next.js se utiliza para determinar cuál es el enlace activo y aplicarle un estilo visual distintivo.
 * - Renderizado Condicional: Los iconos de Favoritos y Carrito solo se renderizan si el rol del usuario es ADOPTER, asegurando que estas funcionalidades solo sean visibles para los usuarios pertinentes.
 *
 * Dependencias Externas:
 * - next/navigation: Para el hook usePathname.
 * - lucide-react: Para el icono de Heart.
 * - ./user-menu, ./cart-button: Componentes hijos que encapsulan la lógica del menú de usuario y el botón del carrito.
 *
 */
