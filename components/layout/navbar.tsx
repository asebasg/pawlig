"use client";

import { useSession } from "next-auth/react";
import { Logo } from "@/components/ui/logo";
import { NavbarPublic } from "./navbar-public";
import { NavbarAuth } from "./navbar-auth";
import { NavbarMobile } from "./navbar-mobile";
import { ThemeToggle } from "./theme-toggle";

/**
 * Ruta/Componente/Servicio: Navbar
 * Descripción: Componente principal de la barra de navegación que se adapta según el estado de autenticación del usuario.
 * Requiere: -
 * Implementa: HU-005
 */
export function Navbar() {
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-40 w-full bg-background border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Mobile Menu + Logo */}
          <div className="flex items-center gap-4">
            <NavbarMobile user={session?.user || null} />
            <div className="lg:hidden">
              <Logo size="sm" />
            </div>
            <div className="hidden lg:block">
              <Logo size="md" />
            </div>
          </div>

          {/* Desktop Navigation & Actions */}
          <div className="hidden lg:flex items-center gap-4 flex-1 justify-end">
            {status === "loading" ? (
              <div className="h-10 w-24 bg-muted animate-pulse rounded" />
            ) : session?.user ? (
              <div className="flex items-center gap-6">
                <NavbarAuth user={session.user} />
                <ThemeToggle />
              </div>
            ) : (
              <div className="flex items-center gap-6">
                <NavbarPublic />
                <ThemeToggle />
              </div>
            )}
          </div>

          {/* Mobile Theme Toggle (visible only on small screens) */}
          <div className="lg:hidden flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * 'Navbar' es el componente de cabecera principal de la aplicación. Es responsable de mostrar el logo, la navegación principal y las acciones del usuario.
 * Su contenido se renderiza de forma condicional basándose en el estado de autenticación del usuario ('loading', 'authenticated', 'unauthenticated').
 *
 * Lógica Clave:
 * - 'useSession': Se utiliza el hook 'useSession' de 'next-auth/react' para obtener el estado actual de la sesión del usuario.
 * - 'Renderizado Condicional': El componente muestra un esqueleto de carga ('animate-pulse') mientras se verifica la sesión. Si el usuario está autenticado, renderiza 'NavbarAuth'; de lo contrario, renderiza 'NavbarPublic'.
 * - 'Diseño Responsivo': El componente gestiona la visibilidad de elementos para dispositivos móviles y de escritorio. 'NavbarMobile' se muestra en pantallas pequeñas, mientras que 'NavbarAuth' y 'NavbarPublic' se muestran en pantallas grandes.
 * - 'ThemeToggle': Ubicado al final de las acciones de escritorio para un acceso rápido y estético.
 *
 * Dependencias Externas:
 * - 'next-auth/react': Para la gestión de la sesión y el estado de autenticación del usuario.
 *
 */
