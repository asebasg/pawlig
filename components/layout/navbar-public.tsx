"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import { PUBLIC_LINKS } from "@/lib/constants";

/**
 * Descripción: Componente de UI que renderiza la barra de navegación para
 *              usuarios no autenticados (visitantes).
 * Requiere: Acceso a la constante 'PUBLIC_LINKS' para los enlaces de navegación.
 * Implementa: Requisito de layout para la navegación principal en las páginas
 *             públicas de la aplicación.
 */

export function NavbarPublic() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="flex items-center gap-6">
        {PUBLIC_LINKS.slice(0, 4).map((link) => {
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

      {/* Auth Buttons */}
      <div className="flex items-center gap-3">
        <Link
          href="/login"
          className="px-4 py-2 font-semibold text-gray-700 hover:text-purple-600 transition-colors"
        >
          Iniciar Sesión
        </Link>
        <Link
          href="/register"
          className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
        >
          Registrarse
        </Link>
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
 * Este componente define la barra de navegación para la vista pública del sitio,
 * es decir, para usuarios que no han iniciado sesión. Muestra los enlaces de
 * navegación principales y los botones de 'Iniciar Sesión' y 'Registrarse'.
 *
 * Lógica Clave:
 * - 'Enlaces Públicos': Los enlaces de navegación se obtienen de la constante
 *   'PUBLIC_LINKS'. Se utiliza 'slice(0, 4)' para mostrar solo un subconjunto
 *   de estos enlaces en la barra principal, manteniendo la interfaz limpia.
 * - 'Indicador de Enlace Activo': Al igual que en 'NavbarAuth', se utiliza el
 *   hook 'usePathname' para determinar la ruta actual y aplicar un estilo
 *   visual al enlace activo, mejorando la usabilidad.
 *
 * Dependencias Externas:
 * - 'next/link', 'next/navigation': Para la navegación y la detección de la
 *   ruta activa.
 * - '@/lib/constants': Para obtener la lista de enlaces de navegación públicos.
 *
 */
