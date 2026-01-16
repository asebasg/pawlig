"use client";

import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronDown,
  LogOut,
  LayoutDashboard,
  User,
  Heart,
  FileText,
  PawPrint,
  BarChart,
  Package,
  ShoppingBag,
  Users,
  TrendingUp,
  Settings,
  HelpCircle,
  Home,
  ShoppingCart,
  Plus,
} from "lucide-react";
import { USER_MENU_OPTIONS, COMMON_MENU_OPTIONS } from "@/lib/constants";

/**
 * Componente: UserMenu
 * Descripción: Despliega un menú de usuario con opciones de navegación y la opción de cerrar sesión. Las opciones varían según el rol del usuario.
 * Requiere: Un objeto de usuario autenticado.
 * Implementa: HU-005
 */
interface UserMenuProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: string;
  };
}

const iconMap = {
  LayoutDashboard,
  User,
  Heart,
  FileText,
  PawPrint,
  BarChart,
  Package,
  ShoppingBag,
  Users,
  TrendingUp,
  Settings,
  HelpCircle,
  Home,
  ShoppingCart,
  Plus,
};

const roleLabels = {
  ADMIN: "Administrador",
  SHELTER: "Albergue",
  VENDOR: "Vendedor",
  ADOPTER: "Adoptante"
};

export function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const roleOptions = USER_MENU_OPTIONS[user.role as keyof typeof USER_MENU_OPTIONS] || [];

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-purple-100 flex items-center justify-center overflow-hidden">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name || ""}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 32px, 40px"
            />
          ) : (
            <User size={18} className="text-purple-600 sm:w-5 sm:h-5" />
          )}
        </div>
        <span className="hidden sm:block font-semibold text-gray-700 max-w-[100px] lg:max-w-[120px] truncate">
          {user.name}
        </span>
        <ChevronDown size={14} className="text-gray-500 sm:w-4 sm:h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 md:w-72 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center overflow-hidden">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || ""}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
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
              <span className="inline-block px-2 py-1 text-xs font-semibold bg-purple-100 text-purple-700 rounded pointer-events-none">
                {roleLabels[user.role as keyof typeof roleLabels]}
              </span>
            </div>
          </div>

          {/* Role Options */}
          <div className="py-2">
            {roleOptions.map((option) => {
              const Icon = iconMap[option.icon as keyof typeof iconMap];
              return (
                <Link
                  key={option.href}
                  href={option.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors"
                >
                  <Icon size={20} className="text-gray-600" />
                  <span className="text-gray-700">{option.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Common Options */}
          <div className="py-2 border-t border-gray-200">
            {COMMON_MENU_OPTIONS.map((option) => {
              const Icon = iconMap[option.icon as keyof typeof iconMap];
              return (
                <Link
                  key={option.href}
                  href={option.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors"
                >
                  <Icon size={20} className="text-gray-600" />
                  <span className="text-gray-700">{option.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Logout */}
          <div className="pt-2 border-t border-gray-200">
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-3 px-4 py-2 w-full hover:bg-red-50 transition-colors text-red-600"
            >
              <LogOut size={20} />
              <span className="font-semibold">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Este componente es el menú desplegable que aparece cuando un usuario autenticado hace clic en su nombre o avatar en la barra de navegación.
 * Muestra información del usuario, enlaces de navegación específicos de su rol y acciones comunes como 'Configuración' y 'Cerrar Sesión'.
 *
 * Lógica Clave:
 * - 'useState', 'useRef', 'useEffect': Se utilizan para controlar la visibilidad del menú desplegable. El 'useEffect' añade y elimina un 'event listener' para detectar clics fuera del menú y cerrarlo automáticamente.
 * - 'USER_MENU_OPTIONS': Un objeto constante que mapea roles de usuario (ej: 'ADMIN', 'SHELTER') a un array de opciones de menú específicas. El componente renderiza dinámicamente estas opciones basándose en el 'rol' del usuario actual.
 * - 'iconMap': Un objeto que mapea nombres de iconos (strings) a los componentes de icono reales de 'lucide-react'. Esto permite definir los iconos como strings en el objeto de constantes y renderizarlos dinámicamente.
 * - 'signOut': Se importa de 'next-auth/react' y se invoca en el botón 'Cerrar Sesión' para finalizar la sesión del usuario y redirigirlo a la página de inicio.
 *
 * Dependencias Externas:
 * - 'next-auth/react': Para la función 'signOut'.
 * - 'lucide-react': Para los iconos del menú.
 * - 'next/link': Para la navegación del lado del cliente.
 * - 'next/image': Para optimizar la imagen de perfil del usuario.
 *
 */
