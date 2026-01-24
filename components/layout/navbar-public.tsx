"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PUBLIC_LINKS } from "@/lib/constants";

/**
 * Componente: NavbarPublic
 * Descripción: Renderiza la sección de la barra de navegación para usuarios no autenticados (visitantes), mostrando enlaces públicos y botones de inicio de sesión/registro.
 * Requiere: -
 * Implementa: HU-005
 */
export function NavbarPublic() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center gap-6">
        {PUBLIC_LINKS.slice(0, 4).map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`font-semibold text-base transition-colors pb-1 border-b-2 ${isActive
                ? "text-primary border-primary"
                : "text-foreground/70 border-transparent hover:text-primary"
                }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Auth Buttons */}
      <div className="flex items-center gap-2 sm:gap-3">
        <Link
          href="/login"
          className="px-2 sm:px-4 py-2 text-sm sm:text-base font-semibold text-foreground/70 hover:text-primary transition-colors"
        >
          Iniciar Sesión
        </Link>
        <Link
          href="/register"
          className="px-3 sm:px-6 py-2 text-sm sm:text-base bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
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
 * Este componente define la vista de la barra de navegación para usuarios no autenticados.
 * Muestra un conjunto de enlaces de navegación públicos y acciones claras para que los usuarios inicien sesión o se registren.
 *
 * Lógica Clave:
 * - 'PUBLIC_LINKS': Se importa un array de constantes que contiene los objetos de enlace para la navegación pública. Se utiliza '.slice(0, 4)' para mostrar solo los primeros cuatro enlaces en la barra principal.
 * - 'usePathname': El hook de Next.js se utiliza para determinar cuál es el enlace activo y aplicarle un estilo visual distintivo (subrayado de color púrpura) para mejorar la usabilidad.
 * - Soporte de Temas: Utiliza variables semánticas (text-primary, bg-primary, text-foreground) para adaptarse a los temas Claro, Oscuro y Solarized.
 *
 * Dependencias Externas:
 * - 'next/navigation': Para el hook 'usePathname'.
 * - 'next/link': Para la navegación del lado del cliente.
 *
 */
