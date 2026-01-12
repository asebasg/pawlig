"use client";

import { useSession } from "next-auth/react";
import { Logo } from "@/components/ui/logo";
import { NavbarPublic } from "./navbar-public";
import { NavbarAuth } from "./navbar-auth";
import { NavbarMobile } from "./navbar-mobile";

/**
 * Descripción: Componente principal de la barra de navegación que actúa como
 *              orquestador, renderizando la versión de escritorio o móvil, y la
 *              variante pública o autenticada, según el estado del usuario.
 * Requiere: El contexto de sesión de 'next-auth/react' para determinar si el
 *           usuario está autenticado y qué rol tiene.
 * Implementa: Requisito de layout para la cabecera principal y la navegación
 *             global de la aplicación.
 */

export function Navbar() {
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-200 shadow-sm">
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
          {status === "loading" ? (
            <div className="hidden lg:flex h-10 w-96 bg-gray-100 animate-pulse rounded" />
          ) : session?.user ? (
            <div className="hidden lg:flex items-center gap-8 flex-1 justify-end">
              <NavbarAuth user={session.user} />
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-8 flex-1 justify-end">
              <NavbarPublic />
            </div>
          )}

          {/* Spacer for mobile to center logo */}
          <div className="lg:hidden w-10" />
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
 * Este componente es el punto de entrada para toda la funcionalidad de la barra
 * de navegación. Su responsabilidad principal es determinar el estado de
 * autenticación del usuario y renderizar los sub-componentes apropiados
 * ('NavbarPublic', 'NavbarAuth', 'NavbarMobile').
 *
 * Lógica Clave:
 * - 'Gestión del Estado de Sesión': Utiliza el hook 'useSession' de 'next-auth/react'
 *   para obtener la sesión del usuario. El 'status' ('loading', 'authenticated',
 *   'unauthenticated') se usa para manejar la UI durante la carga inicial de la sesión.
 * - 'Renderizado Condicional':
 *   - Muestra un esqueleto de carga ('skeleton screen') mientras 'status' es 'loading'.
 *   - Renderiza 'NavbarAuth' si existe una sesión de usuario activa.
 *   - Renderiza 'NavbarPublic' si no hay sesión.
 *   - 'NavbarMobile' se renderiza siempre, pero su contenido interno se adapta
 *     según se le pase o no la información del usuario.
 * - 'Diseño Responsivo (Responsive Design)': El componente utiliza clases de
 *   utilidad de Tailwind CSS ('lg:hidden', 'hidden lg:flex') para mostrar u
 *   ocultar elementos selectivamente según el tamaño de la pantalla,
 *   asegurando una correcta visualización tanto en escritorio como en móvil.
 *
 * Dependencias Externas:
 * - 'next-auth/react': Para la gestión de la sesión del usuario.
 * - Sub-componentes de layout: './navbar-public', './navbar-auth', './navbar-mobile'.
 * - '@/components/ui/logo': Para renderizar el logotipo.
 *
 */
