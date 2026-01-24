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
  ShieldPlus,
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
  ShieldPlus,
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
        className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-lg hover:bg-accent transition-colors"
      >
        <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name || ""}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 32px, 40px"
            />
          ) : (
            <User size={18} className="text-primary sm:w-5 sm:h-5" />
          )}
        </div>
        <span className="hidden sm:block font-semibold text-foreground max-w-[100px] lg:max-w-[120px] truncate">
          {user.name}
        </span>
        <ChevronDown size={14} className="text-muted-foreground sm:w-4 sm:h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 md:w-72 bg-popover rounded-xl shadow-lg border border-border py-2 z-50">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || ""}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                ) : (
                  <User size={24} className="text-primary" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-popover-foreground truncate">{user.name}</p>
                <p className="text-sm text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
            <div className="mt-2">
              <span className="inline-block px-2 py-1 text-xs font-semibold bg-primary/10 text-primary rounded pointer-events-none">
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
                  className="flex items-center gap-3 px-4 py-2 hover:bg-accent hover:text-accent-foreground transition-colors text-foreground"
                >
                  <Icon size={20} className="text-muted-foreground" />
                  <span>{option.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Common Options */}
          <div className="py-2 border-t border-border">
            {COMMON_MENU_OPTIONS.map((option) => {
              const Icon = iconMap[option.icon as keyof typeof iconMap];
              return (
                <Link
                  key={option.href}
                  href={option.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-accent hover:text-accent-foreground transition-colors text-foreground"
                >
                  <Icon size={20} className="text-muted-foreground" />
                  <span>{option.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Logout */}
          <div className="pt-2 border-t border-border">
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-3 px-4 py-2 w-full hover:bg-destructive/10 transition-colors text-destructive"
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
 * - Soporte de Temas: Utiliza variables semánticas (bg-popover, border-border, text-foreground) para adaptarse a los temas Claro, Oscuro y Solarized.
 *
 * Dependencias Externas:
 * - 'next-auth/react': Para la función 'signOut'.
 * - 'lucide-react': Para los iconos del menú.
 * - 'next/link': Para la navegación del lado del cliente.
 * - 'next/image': Para optimizar la imagen de perfil del usuario.
 *
 */
