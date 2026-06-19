import { UserRole, ProductCategory } from "@prisma/client";
import { DocMetadata } from "@/types/docs.types";

// Categorías de productos (SSOT para UI)
export const PRODUCT_CATEGORIES: Record<ProductCategory, string> = {
  [ProductCategory.ALIMENTO]: "Alimento",
  [ProductCategory.JUGUETES]: "Juguetes",
  [ProductCategory.ACCESORIOS]: "Accesorios",
  [ProductCategory.HIGIENE]: "Higiene",
  [ProductCategory.MEDICAMENTOS]: "Medicamentos",
  [ProductCategory.OTROS]: "Otros",
};

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
    { label: "Moderación", href: "/admin/moderation" },
    { label: "Métricas", href: "/admin/metrics" },
  ],
} as const;

// Rutas internas del módulo de moderación
export const MODERATION_NAV_LINKS = [
  { label: "Usuarios", href: "/admin/moderation/users" },
  { label: "Albergues", href: "/admin/moderation/shelters" },
  { label: "Negocios", href: "/admin/moderation/vendors" },
  { label: "Auditoría", href: "/admin/moderation/audit" },
] as const;

// Links públicos
export const PUBLIC_LINKS = [
  { label: "Inicio", href: "/" },
  { label: "Adopciones", href: "/adopciones" },
  { label: "Productos", href: "/productos" },
  { label: "Albergues", href: "/albergues" },
  { label: "Nosotros", href: "/nosotros" },
];

// Opciones del menú de usuario por rol
export const USER_MENU_OPTIONS = {
  ADOPTER: [
    { label: "Dashboard", href: "/user", icon: "LayoutDashboard" },
    { label: "Mi Perfil", href: "/user/profile", icon: "User" },
    {
      label: "Solicitar Albergue",
      href: "/user/request-shelter",
      icon: "Plus",
    },
    { label: "Solicitar Vendedor", href: "/user/request-vendor", icon: "Plus" },
  ],
  SHELTER: [
    { label: "Métricas", href: "/shelter/metrics", icon: "TrendingUp" },
    { label: "Mi Perfil", href: "/shelter/profile", icon: "User" },
    { label: "Productos", href: "/productos", icon: "ShoppingBag" },
    { label: "Albergues", href: "/albergues", icon: "Home" },
  ],
  VENDOR: [
    { label: "Métricas", href: "/vendor/metrics", icon: "TrendingUp" },
    { label: "Mi Perfil", href: "/vendor/profile", icon: "User" },
    { label: "Adopciones", href: "/adopciones", icon: "PawPrint" },
    { label: "Albergues", href: "/albergues", icon: "Home" },
  ],
  ADMIN: [
    { label: "Mi Perfil", href: "/admin/profile", icon: "User" },
    { label: "Adopciones", href: "/adopciones", icon: "PawPrint" },
    { label: "Productos", href: "/productos", icon: "ShoppingBag" },
    { label: "Albergues", href: "/albergues", icon: "Home" },
    { label: "Integrated Developer Hub", href: "/admin/dev", icon: "CodeXml" },
  ],
} as const;

// Opciones comunes del menú
export const COMMON_MENU_OPTIONS = [
  { label: "Configuración", href: "/settings", icon: "Settings" },
  { label: "Ayuda", href: "/help", icon: "HelpCircle" },
];

// Enlaces del footer
export const FOOTER_LINKS = {
  quickLinks: [
    { label: "Adopciones", href: "/adopciones" },
    { label: "Productos", href: "/productos" },
    { label: "Albergues", href: "/albergues" },
    { label: "Preguntas Frecuentes", href: "/faq" },
    { label: "Nosotros", href: "/nosotros" },
    { label: "Reportar Problema", href: "/issues/new/choose" },
  ],
  // TODO: Crear una página de recursos adicionales (anidado en GitHub Pages)
  resources: [
    { label: "Guía de Adopción", href: "/guia-adopcion" },
    { label: "Cuidado de Mascotas", href: "/cuidado" },
    { label: "Manual del Usuario", href: "/guide" },
    { label: "Términos y Condiciones", href: "/terms" },
    { label: "Política de Privacidad", href: "/privacy" },
    { label: "Notas de Lanzamiento", href: "/changelog" },
  ],
  social: [
    {
      label: "WhatsApp",
      href: "https://wa.me/573225316150",
      icon: "MessageCircle",
    },
    {
      label: "Instagram",
      href: "https://instagram.com/tianpgz",
      icon: "Instagram",
    },
    {
      label: "Facebook",
      href: "https://www.facebook.com/profile.php?id=100095403841310",
      icon: "Facebook",
    },
    { label: "Twitter", href: "https://twitter.com/tianpgz", icon: "Twitter" },
    { label: "GitHub", href: "https://github.com/asebasg", icon: "Github" },
  ],
};

// Información de contacto
export const CONTACT_INFO = {
  email: "soporte@pawlig.com",
  phone: "+57 (4) 123-4567",
  address: "Medellín, Antioquia, Colombia",
};

// Definición de cambios de rol considerados críticos
export const CRITICAL_ROLE_CHANGES = {
  // Elevación a ADMIN siempre es crítica
  [`${UserRole.ADOPTER}_TO_${UserRole.ADMIN}`]: {
    message: "¿Estás seguro de promover a este Usuario a Administrador?",
    warning: "Tendrá acceso completo al sistema.",
  },
  [`${UserRole.SHELTER}_TO_${UserRole.ADMIN}`]: {
    message: "¿Promover este Albergue a Administrador?",
    warning: "Perderá sus permisos específicos de albergue.",
  },
  [`${UserRole.VENDOR}_TO_${UserRole.ADMIN}`]: {
    message: "¿Promover este Vendedor a Administrador?",
    warning: "Perderá sus permisos específicos de vendedor.",
  },

  // Degradaciones que pierden permisos importantes
  [`${UserRole.SHELTER}_TO_${UserRole.ADOPTER}`]: {
    message: "¿Degradar este Albergue a Adoptante?",
    warning: "Ya no podrá gestionar mascotas ni adopciones.",
  },
  [`${UserRole.VENDOR}_TO_${UserRole.ADOPTER}`]: {
    message: "¿Degradar este Vendedor a Adoptante?",
    warning: "Ya no podrá gestionar productos ni inventario.",
  },
} as const;

// Función para verificar si un cambio de rol es crítico
export function isCriticalRoleChange(
  currentRole: UserRole,
  newRole: UserRole,
): boolean {
  const key =
    `${currentRole}_TO_${newRole}` as keyof typeof CRITICAL_ROLE_CHANGES;
  return key in CRITICAL_ROLE_CHANGES;
}

// Carpetas de destino en Cloudinary por contexto de la plataforma
export const CLOUDINARY_FOLDERS = {
  PETS: "pets",
  PRODUCTS: "products",
  AVATARS: "avatars",
} as const;

export type CloudinaryFolder = (typeof CLOUDINARY_FOLDERS)[keyof typeof CLOUDINARY_FOLDERS];

// Tipos de recurso válidos para operaciones de eliminación en Cloudinary
export const CLOUDINARY_RESOURCE_TYPES = ["image", "video", "raw"] as const;

export type CloudinaryResourceType = (typeof CLOUDINARY_RESOURCE_TYPES)[number];

// Documentos de proyecto disponibles para la sección de documentación (/admin/dev/docs/[slug])
export const AVAILABLE_DOCS: DocMetadata[] = [
  { slug: "acta-de-constitucion",    title: "Acta de Constitución",      filePath: "01_Acta_de_Constitucion.md",    category: "analysis" },
  { slug: "stakeholders",            title: "Stakeholders",              filePath: "02_Stakeholders.md",            category: "analysis" },
  { slug: "alcance-del-proyecto",    title: "Alcance del Proyecto",      filePath: "03_Alcance_del_Proyecto.md",    category: "analysis" },
  { slug: "requerimientos",          title: "Requerimientos",            filePath: "04_Requerimientos.md",          category: "analysis" },
  { slug: "historias-de-usuario",    title: "Historias de Usuario",      filePath: "05_Historias_de_Usuario.md",    category: "analysis" },
  { slug: "mapa-de-procesos",        title: "Mapa de Procesos",          filePath: "06_Mapa_de_Procesos.md",        category: "analysis" },
  { slug: "casos-de-uso",            title: "Casos de Uso",              filePath: "07_Casos_de_Uso.md",            category: "analysis" },
  { slug: "arquitectura-software",   title: "Arquitectura de Software",  filePath: "08_Arquitectura_Software.md",   category: "design" },
  { slug: "modelo-entidad-relacion", title: "Modelo Entidad-Relación",   filePath: "09_Modelo_Entidad_Relacion.md", category: "design" },
  { slug: "diagramas-uml",           title: "Diagramas UML",             filePath: "10_Diagramas_UML.md",           category: "design" },
  { slug: "manual-diseno",           title: "Manual de Diseño",          filePath: "11_Manual_Diseño.md",           category: "design" },
  { slug: "plan-de-pruebas",         title: "Plan de Pruebas",           filePath: "12_Plan_de_Pruebas.md",         category: "testing" },
  { slug: "casos-de-prueba",         title: "Casos de Prueba",           filePath: "13_Casos_de_Prueba.md",         category: "testing" },
  { slug: "manual-del-usuario",      title: "Manual del Usuario",        filePath: "14_Manual_del_Usuario.md",      category: "final" },
];
