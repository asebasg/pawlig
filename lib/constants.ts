import { UserRole } from "@prisma/client";

/**
 * Ruta/Componente/Servicio: Constantes Globales
 * Descripción: Define constantes y datos estáticos utilizados en toda la aplicación para mantener la consistencia y facilitar el mantenimiento.
 * Requiere: -
 * Implementa: Múltiples (centraliza datos de UI y lógica de negocio)
 */

export const NAVIGATION_BY_ROLE = {
  ADOPTER: [
    { label: "Inicio", href: "/" },
    { label: "Adopciones", href: "/adopciones" },
    { label: "Productos", href: "/productos" },
    { label: "Albergues", href: "/albergues" },
  ],
  SHELTER: [
    { label: "Inicio", href: "/" },
    { label: "Adopciones", href: "/adopciones" },
    { label: "Mis Mascotas", href: "/shelter/pets" },
    { label: "Postulaciones", href: "/shelter/adoptions" }
  ],
  VENDOR: [
    { label: "Inicio", href: "/" },
    { label: "Productos", href: "/productos" },
    { label: "Mis Productos", href: "/vendor/products" },
    { label: "Órdenes", href: "/vendor/orders" }
  ],
  ADMIN: [
    { label: "Dashboard", href: "/admin" },
    { label: "Adopciones", href: "/adopciones" },
    { label: "Productos", href: "/productos" },
    { label: "Albergues", href: "/albergues" },
  ]
} as const;

export const PUBLIC_LINKS = [
  { label: "Inicio", href: "/" },
  { label: "Adopciones", href: "/adopciones" },
  { label: "Productos", href: "/productos" },
  { label: "Albergues", href: "/albergues" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Ayuda", href: "/help" },
  { label: "Terminos y Condiciones", href: "/terms" },
];

export const USER_MENU_OPTIONS = {
  ADOPTER: [
    { label: "Dashboard", href: "/user", icon: "LayoutDashboard" },
    { label: "Mi Perfil", href: "/user/profile", icon: "User" },
    { label: "Mis Favoritos", href: "/user/favorites", icon: "Heart" },
    { label: "Mis Postulaciones", href: "/user/adoptions", icon: "FileText" },
    { label: "Solicitar Albergue", href: "/user/request-shelter", icon: "Plus" }
  ],
  SHELTER: [
    { label: "Dashboard", href: "/shelter", icon: "LayoutDashboard" },
    { label: "Mi Perfil", href: "/shelter/profile", icon: "User" },
    { label: "Mis Mascotas", href: "/shelter/pets", icon: "PawPrint" },
    { label: "Reportes", href: "/shelter/reports", icon: "BarChart" }
  ],
  VENDOR: [
    { label: "Dashboard", href: "/vendor", icon: "LayoutDashboard" },
    { label: "Mi Perfil", href: "/vendor/profile", icon: "User" },
    { label: "Mis Productos", href: "/vendor/products", icon: "Package" },
    { label: "Órdenes", href: "/vendor/orders", icon: "ShoppingBag" }
  ],
  ADMIN: [
    { label: "Mi Perfil", href: "/admin/profile", icon: "User" },
    { label: "Gestión Usuarios", href: "/admin/users", icon: "Users" },
    { label: "Gestión Albergues", href: "/admin/shelters", icon: "Home" },
    { label: "Gestión Vendedores", href: "/admin/vendors", icon: "ShoppingCart" },
    { label: "Reportes", href: "/admin/reports", icon: "FileText" },
    { label: "Métricas", href: "/admin/metrics", icon: "TrendingUp" }
  ]
} as const;

export const COMMON_MENU_OPTIONS = [
  { label: "Configuración", href: "/settings", icon: "Settings" },
  { label: "Ayuda", href: "/ayuda", icon: "HelpCircle" }
];

export const FOOTER_LINKS = {
  quickLinks: [
    { label: "Adopciones", href: "/adopciones" },
    { label: "Productos", href: "/productos" },
    { label: "Albergues", href: "/albergues" },
    { label: "Nosotros", href: "/nosotros" },
    { label: "Preguntas Frecuentes", href: "/faq" },
    { label: "Términos y Condiciones", href: "/terminos" },
    { label: "Política de Privacidad", href: "/privacidad" },
  ],
  resources: [
    { label: "Guía de Adopción", href: "/guia-adopcion" },
    { label: "Cuidado de Mascotas", href: "/cuidado" },
    { label: "Contáctanos", href: "/contacto" },
    { label: "Reportar Problema", href: "/reportar" },
    { label: "Política de Privacidad", href: "/privacidad" }
  ],
  social: [
    { label: "WhatsApp", href: "https://wa.me/573001234567", icon: "MessageCircle" },
    { label: "Instagram", href: "https://instagram.com/pawlig", icon: "Instagram" },
    { label: "Facebook", href: "https://facebook.com/pawlig", icon: "Facebook" },
    { label: "Twitter", href: "https://twitter.com/pawlig", icon: "Twitter" },
  ]
};

export const CONTACT_INFO = {
  email: "soporte@pawlig.com",
  phone: "+57 (4) 123-4567",
  address: "Medellín, Antioquia, Colombia"
};

export const CRITICAL_ROLE_CHANGES = {
  [`${UserRole.ADOPTER}_TO_${UserRole.ADMIN}`]: {
    message: '¿Estás seguro de promover a este Usuario a Administrador?',
    warning: 'Tendrá acceso completo al sistema.',
  },
  [`${UserRole.SHELTER}_TO_${UserRole.ADMIN}`]: {
    message: '¿Promover este Albergue a Administrador?',
    warning: 'Perderá sus permisos específicos de albergue.',
  },
  [`${UserRole.VENDOR}_TO_${UserRole.ADMIN}`]: {
    message: '¿Promover este Vendedor a Administrador?',
    warning: 'Perderá sus permisos específicos de vendedor.',
  },
  [`${UserRole.SHELTER}_TO_${UserRole.ADOPTER}`]: {
    message: '¿Degradar este Albergue a Adoptante?',
    warning: 'Ya no podrá gestionar mascotas ni adopciones.',
  },
  [`${UserRole.VENDOR}_TO_${UserRole.ADOPTER}`]: {
    message: '¿Degradar este Vendedor a Adoptante?',
    warning: 'Ya no podrá gestionar productos ni inventario.',
  },
} as const;

export function isCriticalRoleChange(
  currentRole: UserRole,
  newRole: UserRole
): boolean {
  const key = `${currentRole}_TO_${newRole}` as keyof typeof CRITICAL_ROLE_CHANGES;
  return key in CRITICAL_ROLE_CHANGES;
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Este archivo actúa como una fuente única de verdad (Single Source of Truth) para
 * datos estáticos que se utilizan en múltiples partes de la aplicación. Centralizar
 * estas constantes aquí evita la duplicación de "valores mágicos" y facilita
 * las actualizaciones, ya que los cambios se realizan en un solo lugar.
 *
 * Lógica Clave:
 * - 'NAVIGATION_BY_ROLE' y 'USER_MENU_OPTIONS': Definen la estructura de la
 *   navegación y los menús de usuario de forma dinámica según el rol del usuario.
 *   Esto permite que la UI se adapte automáticamente a los permisos de cada tipo de cuenta.
 * - 'CRITICAL_ROLE_CHANGES': Este objeto define qué transiciones de roles de usuario
 *   se consideran críticas y requieren una confirmación especial en la UI.
 *   La clave del objeto se construye dinámicamente para representar el cambio
 *   (ej: 'ADOPTER_TO_ADMIN'), lo que hace la lógica más legible.
 * - 'isCriticalRoleChange': Una función de utilidad que comprueba si una transición
 *   de rol específica está definida en el objeto 'CRITICAL_ROLE_CHANGES',
 *   simplificando la lógica en los componentes de la interfaz de administración.
 * - 'as const': Se utiliza para hacer que los objetos sean de solo lectura ('readonly')
 *   y para inferir los tipos de la manera más específica posible, mejorando la
 *   seguridad de tipos en todo el proyecto.
 *
 * Dependencias Externas:
 * - '@prisma/client': Se utiliza para importar el tipo 'UserRole', asegurando que las
 *   constantes basadas en roles estén siempre sincronizadas con el esquema de la
 *   base de datos.
 *
 */
