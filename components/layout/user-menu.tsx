"use client";

import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
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
} from "lucide-react";
import { USER_MENU_OPTIONS, COMMON_MENU_OPTIONS } from "@/lib/constants";

/**
 * Descripción: Componente de UI que renderiza un menú desplegable con acciones
 *              y enlaces específicos para el usuario autenticado.
 * Requiere: El objeto 'user' con nombre, email, imagen y rol.
 * Implementa: Requisito de layout para el acceso a la configuración del perfil,
 *             dashboard, y cierre de sesión.
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
};

const roleLabels = {
  ADMIN: "Administrador",
  SHELTER: "Albergue",
  VENDOR: "Vendedor",
  ADOPTER: "Adoptante",
};

export function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Cierra el menú si se hace clic fuera de él.
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

  const roleOptions =
    USER_MENU_OPTIONS[user.role as keyof typeof USER_MENU_OPTIONS] || [];

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center overflow-hidden">
          {user.image ? (
            <img
              src={user.image}
              alt={user.name || ""}
              className="w-full h-full object-cover"
            />
          ) : (
            <User size={20} className="text-purple-600" />
          )}
        </div>
        <span className="hidden md:block font-semibold text-gray-700 max-w-[120px] truncate">
          {user.name}
        </span>
        <ChevronDown size={16} className="text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center overflow-hidden">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name || ""}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={24} className="text-purple-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">
                  {user.name}
                </p>
                <p className="text-sm text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
            <div className="mt-2">
              <span className="inline-block px-2 py-1 text-xs font-semibold bg-purple-100 text-purple-700 rounded">
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
 * Este componente crea el menú desplegable accesible desde la barra de navegación
 * para usuarios autenticados. Proporciona información del usuario y enlaces a
 * páginas relevantes según su rol, además de la opción de cerrar sesión.
 *
 * Lógica Clave:
 * - 'Gestión de Estado (useState)': Controla la visibilidad del menú desplegable
 *   a través de la variable de estado 'isOpen'.
 * - 'Detección de Clic Externo (useEffect y useRef)': Se utiliza 'useRef' para
 *   obtener una referencia al contenedor del menú. Un 'useEffect' añade un
 *   'event listener' al documento cuando el menú está abierto para detectar
 *   clics. Si un clic ocurre fuera del contenedor del menú, se llama a
 *   'setIsOpen(false)' para cerrarlo.
 * - 'Opciones de Menú Dinámicas': Las opciones del menú se obtienen de las
 *   constantes 'USER_MENU_OPTIONS' y 'COMMON_MENU_OPTIONS'. Las primeras son
 *   específicas para cada rol, mientras que las segundas son comunes para todos.
 * - 'Mapeo de Iconos': Un objeto 'iconMap' se utiliza para mapear los nombres
 *   de los iconos (guardados como strings en las constantes) a los componentes
 *   reales de la librería 'lucide-react', permitiendo la renderización dinámica
 *   de los iconos.
 *
 * Dependencias Externas:
 * - 'react': Para 'useState', 'useRef', 'useEffect'.
 * - 'next-auth/react': Para la función 'signOut'.
 * - 'next/link': Para la navegación.
 * - 'lucide-react': Para la iconografía.
 * - '@/lib/constants': Para obtener las opciones del menú.
 *
 */
