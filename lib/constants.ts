import { UserRole } from "@prisma/client";

// Rutas de navegación por rol
export const NAVIGATION_BY_ROLE = {
  ADOPTER: [
    { label: "Inicio", href: "/" },
    { label: "Adopciones", href: "/adopciones" },
    { label: "Productos", href: "/productos" },
    { label: "Albergues", href: "https://github.com/asebasg/pawlig" },
  ],
  SHELTER: [
    { label: "Inicio", href: "/" },
    { label: "Dashboard", href: "/shelter" },
    { label: "Mis Mascotas", href: "/shelter/pets" },
    { label: "Postulaciones", href: "/shelter/adoptions" },
    { label: "Adopciones", href: "/adopciones" },
  ],
  VENDOR: [
    { label: "Inicio", href: "/" },
    { label: "Dashboard", href: "/vendor" },
    { label: "Mis Productos", href: "/vendor/products" },
    { label: "Órdenes", href: "/vendor/orders" },
    { label: "Productos", href: "/productos" },
  ],
  ADMIN: [
    { label: "Inicio", href: "/" },
    { label: "Dashboard", href: "/admin" },
    { label: "Usuarios", href: "/admin/users" },
    { label: "Albergues", href: "https://github.com/asebasg/pawlig" },
    { label: "Vendedores", href: "https://github.com/asebasg/pawlig" },
  ]
} as const;

// Links públicos
export const PUBLIC_LINKS = [
  { label: "Inicio", href: "/" },
  { label: "Adopciones", href: "/adopciones" },
  { label: "Productos", href: "/productos" },
  { label: "Albergues", href: "https://github.com/asebasg/pawlig" },
];

// Opciones del menú de usuario por rol
export const USER_MENU_OPTIONS = {
  ADOPTER: [
    { label: "Dashboard", href: "/user", icon: "LayoutDashboard" },
    { label: "Mi Perfil", href: "/user/profile", icon: "User" },
    { label: "Solicitar Albergue", href: "/user/request-shelter", icon: "Plus" },
    { label: "Solicitar Vendedor", href: "/user/request-vendor", icon: "Plus" },
  ],
  SHELTER: [
    { label: "Métricas", href: "/shelter/metrics", icon: "TrendingUp" },
    { label: "Mi Perfil", href: "/shelter/profile", icon: "User" },
    { label: "Productos", href: "/productos", icon: "ShoppingBag" },
    { label: "Albergues", href: "https://github.com/asebasg/pawlig", icon: "Home" },
  ],
  VENDOR: [
    { label: "Métricas", href: "/vendor/metrics", icon: "TrendingUp" },
    { label: "Mi Perfil", href: "/vendor/profile", icon: "User" },
    { label: "Adopciones", href: "/adopciones", icon: "PawPrint" },
    { label: "Albergues", href: "https://github.com/asebasg/pawlig", icon: "Home" },
  ],
  ADMIN: [
    { label: "Mi Perfil", href: "/admin/profile", icon: "User" },
    { label: "Moderación", href: "/admin/moderation", icon: "ShieldPlus" },
    { label: "Métricas", href: "/admin/metrics", icon: "TrendingUp" },
    { label: "Adopciones", href: "/adopciones", icon: "PawPrint" },
    { label: "Productos", href: "/productos", icon: "ShoppingBag" },
    { label: "Albergues", href: "https://github.com/asebasg/pawlig", icon: "Home" },
  ]
} as const;

// Opciones comunes del menú
export const COMMON_MENU_OPTIONS = [
  { label: "Configuración", href: "https://github.com/asebasg/pawlig", icon: "Settings" },
  { label: "Ayuda", href: "https://github.com/asebasg/pawlig", icon: "HelpCircle" }
];

// Enlaces del footer
export const FOOTER_LINKS = {
  quickLinks: [
    { label: "Adopciones", href: "/adopciones" },
    { label: "Productos", href: "/productos" },
    { label: "Albergues", href: "https://github.com/asebasg/pawlig" },
    { label: "Preguntas Frecuentes", href: "/faq" },
    { label: "Nosotros", href: "/nosotros" },
    { label: "Reportar Problema", href: "https://github.com/asebasg/pawlig/issues/new/choose" },
  ],
  // TODO: Crear una página de recursos adicionales (anidado en GitHub Pages)
  resources: [
    { label: "Guía de Adopción", href: "https://github.com/asebasg/pawlig" },
    { label: "Cuidado de Mascotas", href: "https://github.com/asebasg/pawlig" },
    { label: "Manual del Usuario", href: "https://github.com/asebasg/pawlig" },
    { label: "Términos y Condiciones", href: "/terms" },
    { label: "Política de Privacidad", href: "/privacy" },
    { label: "Notas de Lanzamiento", href: "/changelog" },
  ],
  social: [
    { label: "WhatsApp", href: "https://wa.me/573001234567", icon: "MessageCircle" },
    { label: "Instagram", href: "https://instagram.com/pawlig", icon: "Instagram" },
    { label: "Facebook", href: "https://facebook.com/pawlig", icon: "Facebook" },
    { label: "Twitter", href: "https://twitter.com/pawlig", icon: "Twitter" },
    { label: "GitHub", href: "https://github.com/asebasg/pawlig", icon: "Github" },
  ]
};

// Información de contacto
export const CONTACT_INFO = {
  email: "soporte@pawlig.com",
  phone: "+57 (4) 123-4567",
  address: "Medellín, Antioquia, Colombia"
};

// Definición de cambios de rol considerados críticos
export const CRITICAL_ROLE_CHANGES = {
  // Elevación a ADMIN siempre es crítica
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

  // Degradaciones que pierden permisos importantes
  [`${UserRole.SHELTER}_TO_${UserRole.ADOPTER}`]: {
    message: '¿Degradar este Albergue a Adoptante?',
    warning: 'Ya no podrá gestionar mascotas ni adopciones.',
  },
  [`${UserRole.VENDOR}_TO_${UserRole.ADOPTER}`]: {
    message: '¿Degradar este Vendedor a Adoptante?',
    warning: 'Ya no podrá gestionar productos ni inventario.',
  },
} as const;

// Función para verificar si un cambio de rol es crítico
export function isCriticalRoleChange(
  currentRole: UserRole,
  newRole: UserRole
): boolean {
  const key = `${currentRole}_TO_${newRole}` as keyof typeof CRITICAL_ROLE_CHANGES;
  return key in CRITICAL_ROLE_CHANGES;
}
