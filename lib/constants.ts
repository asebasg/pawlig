// Rutas de navegación por rol
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

// Links públicos
export const PUBLIC_LINKS = [
  { label: "Inicio", href: "/" },
  { label: "Adopciones", href: "/adopciones" },
  { label: "Productos", href: "/productos" },
  { label: "Albergues", href: "/albergues" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Ayuda", href: "/help" },
  { label: "Terminos y Condiciones", href: "/terms" },
];

// Opciones del menú de usuario por rol
export const USER_MENU_OPTIONS = {
  ADOPTER: [
    { label: "Dashboard", href: "/user", icon: "LayoutDashboard" },
    { label: "Mi Perfil", href: "/user/profile", icon: "User" },
    { label: "Mis Favoritos", href: "/user/favorites", icon: "Heart" },
    { label: "Mis Postulaciones", href: "/user/adoptions", icon: "FileText" }
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
    { label: "Usuarios", href: "/admin/users", icon: "Users" },
    { label: "Albergues", href: "/admin/shelters", icon: "Home" },
    { label: "Vendedores", href: "/admin/vendors", icon: "ShoppingCart" },
    { label: "Reportes", href: "/admin/reports", icon: "FileText" },
    { label: "Métricas", href: "/admin/metrics", icon: "TrendingUp" }
  ]
} as const;

// Opciones comunes del menú
export const COMMON_MENU_OPTIONS = [
  { label: "Configuración", href: "/settings", icon: "Settings" },
  { label: "Ayuda", href: "/ayuda", icon: "HelpCircle" }
];

// Enlaces del footer
export const FOOTER_LINKS = {
  quickLinks: [
    { label: "Adopciones", href: "/adopciones" },
    { label: "Productos", href: "/productos" },
    { label: "Albergues", href: "/albergues" },
    { label: "Nosotros", href: "/nosotros" },
    { label: "Preguntas Frecuentes", href: "/faq" },
    { label: "Términos y Condiciones", href: "/terminos" }
  ],
  // TODO: Hacer recursos reales y compartilos en archivos de Google Drive (PDF)
  resources: [
    { label: "Guía de Adopción", href: "/guia-adopcion" },
    { label: "Cuidado de Mascotas", href: "/cuidado" },
    { label: "Contáctanos", href: "/contacto" },
    { label: "Reportar Problema", href: "/reportar" },
    { label: "Política de Privacidad", href: "/privacidad" }
  ],
  social: [
    { label: "Instagram", href: "https://instagram.com/pawlig", icon: "Instagram" },
    { label: "Facebook", href: "https://facebook.com/pawlig", icon: "Facebook" },
    { label: "Twitter", href: "https://twitter.com/pawlig", icon: "Twitter" },
    { label: "WhatsApp", href: "https://wa.me/573001234567", icon: "MessageCircle" }
  ]
};

// Información de contacto
export const CONTACT_INFO = {
  email: "soporte@pawlig.com",
  phone: "+57 (4) 123-4567",
  address: "Medellín, Antioquia, Colombia"
};
