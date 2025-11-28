# Guía de Uso - Navbar y Footer

## 🎯 Componentes Disponibles

### 1. Navbar (Automático)
El Navbar se renderiza automáticamente en todas las páginas a través del `layout.tsx` principal.

**No requiere importación manual en páginas individuales.**

### 2. Footer (Automático)
El Footer se renderiza automáticamente en todas las páginas a través del `layout.tsx` principal.

**No requiere importación manual en páginas individuales.**

## 📦 Importaciones Disponibles

Si necesitas usar componentes individuales:

```typescript
// Importar componentes de layout
import { 
  Navbar, 
  Footer, 
  Logo, 
  CartButton, 
  UserMenu 
} from "@/components/layout";

// Importar Logo
import { Logo } from "@/components/ui/logo";

// Importar constantes
import { 
  NAVIGATION_BY_ROLE, 
  PUBLIC_LINKS, 
  FOOTER_LINKS 
} from "@/lib/constants";

// Importar helpers de sesión
import { 
  getSession, 
  getCurrentUser, 
  requireAuth, 
  requireRole 
} from "@/lib/auth/session";
```

## 🔧 Uso de Componentes

### Logo
```tsx
// Logo completo (texto + ícono)
<Logo variant="full" size="md" href="/" />

// Solo ícono
<Logo variant="icon-only" size="sm" />

// Tamaños disponibles: "sm" | "md" | "lg"
```

### CartButton
```tsx
// Con contador
<CartButton itemCount={5} />

// Sin items
<CartButton itemCount={0} />
```

### UserMenu
```tsx
// Requiere objeto de usuario
<UserMenu 
  user={{
    name: "Juan Pérez",
    email: "juan@example.com",
    image: "/avatar.jpg",
    role: "ADOPTER"
  }} 
/>
```

## 🔐 Helpers de Sesión

### En Server Components
```typescript
import { getSession, getCurrentUser, requireAuth, requireRole } from "@/lib/auth/session";

// Obtener sesión
const session = await getSession();

// Obtener usuario actual
const user = await getCurrentUser();

// Requerir autenticación
const session = await requireAuth(); // Lanza error si no autenticado

// Requerir rol específico
const session = await requireRole(["ADMIN", "SHELTER"]); // Lanza error si rol no permitido
```

### En Client Components
```typescript
"use client";
import { useSession } from "next-auth/react";

function MyComponent() {
  const { data: session, status } = useSession();
  
  if (status === "loading") return <div>Cargando...</div>;
  if (!session) return <div>No autenticado</div>;
  
  return <div>Hola {session.user.name}</div>;
}
```

## 🎨 Personalización de Estilos

### Colores Púrpura Disponibles
```css
/* Tailwind classes */
bg-purple-50   /* Muy claro */
bg-purple-100
bg-purple-200
bg-purple-300
bg-purple-400
bg-purple-500
bg-purple-600  /* Principal #7C3AED */
bg-purple-700  /* Hover */
bg-purple-800
bg-purple-900  /* Muy oscuro */

/* También disponible para: text-, border-, ring-, etc. */
```

### Fuentes
```css
/* Inter (por defecto) */
<p className="font-sans">Texto con Inter</p>

/* Poppins (para títulos y logo) */
<h1 className="font-poppins font-bold">Título con Poppins</h1>
```

## 📱 Breakpoints Responsivos

```css
/* Móvil: < 640px (por defecto) */
<div className="text-sm">Móvil</div>

/* Tablet: ≥ 640px */
<div className="sm:text-base">Tablet</div>

/* Desktop: ≥ 1024px */
<div className="lg:text-lg">Desktop</div>

/* Desktop grande: ≥ 1280px */
<div className="xl:text-xl">Desktop XL</div>
```

## 🔄 Agregar Nuevas Rutas

### 1. Rutas Públicas
Editar `lib/constants.ts`:
```typescript
export const PUBLIC_LINKS = [
  { label: "Inicio", href: "/" },
  { label: "Nueva Página", href: "/nueva-pagina" }, // ← Agregar aquí
  // ...
];
```

### 2. Rutas por Rol
Editar `lib/constants.ts`:
```typescript
export const NAVIGATION_BY_ROLE = {
  ADOPTER: [
    { label: "Mi Panel", href: "/user" },
    { label: "Nueva Opción", href: "/user/nueva" }, // ← Agregar aquí
    // ...
  ],
  // ...
};
```

### 3. Opciones del Menú de Usuario
Editar `lib/constants.ts`:
```typescript
export const USER_MENU_OPTIONS = {
  ADOPTER: [
    { label: "Mi Perfil", href: "/user/profile", icon: "User" },
    { label: "Nueva Opción", href: "/user/nueva", icon: "Star" }, // ← Agregar aquí
    // ...
  ],
  // ...
};
```

**Iconos disponibles:** Ver [Lucide Icons](https://lucide.dev/icons/)

## 🛠️ Modificar Footer

### Agregar Enlaces
Editar `lib/constants.ts`:
```typescript
export const FOOTER_LINKS = {
  quickLinks: [
    { label: "Nuevo Link", href: "/nuevo" }, // ← Agregar aquí
    // ...
  ],
  // ...
};
```

### Cambiar Información de Contacto
Editar `lib/constants.ts`:
```typescript
export const CONTACT_INFO = {
  email: "nuevo@pawlig.com",
  phone: "+57 (4) 999-9999",
  address: "Nueva Dirección"
};
```

## 🐛 Troubleshooting

### El Navbar no aparece
- Verificar que `app/layout.tsx` tenga `<Navbar />` importado
- Verificar que SessionProvider esté envolviendo la app

### El Footer no está al fondo
- Verificar que `body` tenga `flex flex-col min-h-screen`
- Verificar que `main` tenga `flex-1`

### Los links no se resaltan
- Verificar que `usePathname()` esté funcionando
- Verificar que las rutas coincidan exactamente

### El menú móvil no se cierra
- Verificar que `useEffect` con `pathname` esté presente
- Verificar que el backdrop tenga `onClick` para cerrar

### Los colores no funcionan
- Ejecutar `npm run dev` para recompilar Tailwind
- Verificar que `tailwind.config.ts` tenga los colores personalizados

## 📚 Recursos Adicionales

- [Next.js App Router](https://nextjs.org/docs/app)
- [NextAuth.js](https://next-auth.js.org/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev/)
- [TypeScript](https://www.typescriptlang.org/docs/)

## 🤝 Contribuir

Para agregar nuevas funcionalidades al Navbar/Footer:

1. Crear componente en `components/layout/`
2. Agregar constantes en `lib/constants.ts`
3. Actualizar tipos en TypeScript
4. Documentar en este archivo
5. Crear PR con descripción detallada

## 📞 Soporte

Para dudas o problemas:
- Revisar documentación en `/documentation/pull-request/Navbar-Footer/`
- Contactar al líder del proyecto: asebasg07@gmail.com
- Crear issue en el repositorio
