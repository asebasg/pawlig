"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart } from "lucide-react";
import { UserMenu } from "./user-menu";
import { CartButton } from "./cart-button";
import { NAVIGATION_BY_ROLE } from "@/lib/constants";

/**
 * Descripción: Componente de UI que renderiza la barra de navegación para
 *              usuarios autenticados, adaptando los enlaces y acciones
 *              disponibles según el rol del usuario.
 * Requiere: El objeto 'user' con su rol para determinar qué conjunto de
 *           enlaces de navegación mostrar.
 * Implementa: Requisito de layout para la navegación principal de usuarios
 *             logueados (Adoptantes, Albergues, Administradores).
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
  const navigation =
    NAVIGATION_BY_ROLE[user.role as keyof typeof NAVIGATION_BY_ROLE] || [];
  const displayNav = navigation;

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="flex items-center gap-6">
        {displayNav.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`font-semibold text-base transition-colors pb-1 border-b-2 ${
                isActive
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
      <div className="flex items-center gap-2">
        {/* Cart & Favorites - Sólo para rol ADOPTER */}
        {user.role === "ADOPTER" && (
          <>
            <Link
              href="/user/favorites"
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Heart size={24} className="text-gray-600" />
            </Link>
            <CartButton itemCount={0} />
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
 * Este componente construye la sección de la barra de navegación que es visible
 * para los usuarios que han iniciado sesión. Su contenido es dinámico y se
 * personaliza en función del rol del usuario.
 *
 * Lógica Clave:
 * - 'Navegación basada en roles': El conjunto de enlaces de navegación se obtiene
 *   del objeto 'NAVIGATION_BY_ROLE' (importado desde constantes) utilizando el
 *   rol del usuario como clave. Esto permite una gestión centralizada y sencilla
 *   de los menús para diferentes tipos de usuario.
 * - 'Indicador de Enlace Activo': Se utiliza el hook 'usePathname' de Next.js
 *   para determinar la ruta actual. Esta se compara con el 'href' de cada enlace
 *   para aplicar un estilo visual distintivo (subrayado y color) al enlace que
 *   corresponde a la página activa.
 * - 'Acciones Condicionales': Los botones de "Favoritos" y "Carrito" solo se
 *   muestran si el rol del usuario es 'ADOPTER', ya que estas funcionalidades
 *   son específicas para ellos.
 *
 * Dependencias Externas:
 * - 'next/link', 'next/navigation': Para la navegación del lado del cliente y
 *   la detección de la ruta activa.
 * - 'lucide-react': Para los iconos.
 * - '@/lib/constants': Para obtener las estructuras de navegación basadas en roles.
 * - './user-menu', './cart-button': Sub-componentes de layout que completan la
 *   funcionalidad de la barra de navegación.
 *
 */
