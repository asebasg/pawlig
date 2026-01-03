"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, User, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { Logo } from "@/components/ui/logo";
import { PUBLIC_LINKS, NAVIGATION_BY_ROLE } from "@/lib/constants";

/**
 * Componente: NavbarMobile
 * Descripción: Renderiza el menú de navegación para dispositivos móviles, que se muestra como un panel deslizable.
 * Requiere: Opcionalmente, un objeto de usuario para mostrar la navegación autenticada.
 * Implementa: HU-005
 */
interface NavbarMobileProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: string;
  } | null;
}

const roleLabels = {
  ADMIN: "Administrador",
  SHELTER: "Albergue",
  VENDOR: "Vendedor",
  ADOPTER: "Adoptante"
};

export function NavbarMobile({ user }: NavbarMobileProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const navigation = user
    ? NAVIGATION_BY_ROLE[user.role as keyof typeof NAVIGATION_BY_ROLE] || []
    : PUBLIC_LINKS;

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-200 lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <Logo size="md" />
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <X size={24} />
            </button>
          </div>

          {/* User Info (if authenticated) */}
          {user && (
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center overflow-hidden">
                  {user.image ? (
                    <img src={user.image} alt={user.name || ""} className="w-full h-full object-cover" />
                  ) : (
                    <User size={24} className="text-purple-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{user.name}</p>
                  <p className="text-sm text-gray-500 truncate">{user.email}</p>
                </div>
              </div>
              <div className="mt-2">
                <span className="inline-block px-2 py-1 text-xs font-semibold bg-purple-100 text-purple-700 rounded">
                  {roleLabels[user.role as keyof typeof roleLabels]}
                </span>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto py-4">
            {navigation.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-4 py-3 font-semibold transition-colors ${
                    isActive
                      ? "bg-purple-50 text-purple-600 border-l-4 border-purple-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Footer Actions */}
          <div className="p-4 border-t border-gray-200">
            {user ? (
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center gap-3 w-full px-4 py-3 text-red-600 font-semibold hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut size={20} />
                <span>Cerrar Sesión</span>
              </button>
            ) : (
              <div className="space-y-2">
                <Link
                  href="/login"
                  className="block w-full px-4 py-3 text-center font-semibold text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/register"
                  className="block w-full px-4 py-3 text-center font-semibold text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
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
 * 'NavbarMobile' gestiona la experiencia de navegación en pantallas pequeñas. Consiste en un botón de tipo 'hamburguesa' que activa un panel lateral deslizable ('drawer').
 * El contenido del panel es dinámico, mostrando enlaces públicos o enlaces específicos del rol del usuario, junto con opciones de inicio/cierre de sesión.
 *
 * Lógica Clave:
 * - 'useState (isOpen)': Controla el estado de visibilidad del panel lateral.
 * - 'useEffect (pathname)': Cierra automáticamente el panel cuando el usuario navega a una nueva página, mejorando la experiencia de usuario.
 * - 'useEffect (isOpen)': Bloquea el 'scroll' del 'body' cuando el menú está abierto para evitar que el contenido de la página se desplace por debajo. Incluye una función de limpieza para restaurar el 'scroll'.
 * - 'Navegación Dinámica': Al igual que la barra de navegación de escritorio, selecciona el conjunto de enlaces a mostrar ('PUBLIC_LINKS' o 'NAVIGATION_BY_ROLE') basándose en la presencia y el rol del objeto 'user'.
 *
 * Dependencias Externas:
 * - 'next/navigation': Para usar el hook 'usePathname' y determinar la ruta activa.
 * - 'next-auth/react': Para la función 'signOut'.
 * - 'lucide-react': Para los iconos.
 *
 */
