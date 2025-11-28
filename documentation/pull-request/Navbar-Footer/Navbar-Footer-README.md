Plan de Implementación - Navbar y Footer Global

1. Estructura de Archivos
   src/
   ├── app/
   │ └── layout.tsx # Root layout con Navbar + Footer
   ├── components/
   │ ├── layout/
   │ │ ├── navbar.tsx # Navbar principal
   │ │ ├── navbar-public.tsx # Navbar para no autenticados
   │ │ ├── navbar-auth.tsx # Navbar para autenticados
   │ │ ├── navbar-mobile.tsx # Drawer móvil
   │ │ ├── user-menu.tsx # Dropdown de usuario
   │ │ ├── cart-button.tsx # Botón carrito con contador
   │ │ └── footer.tsx # Footer global
   │ └── ui/
   │ └── logo.tsx # Logo de PawLig
   └── lib/
   ├── auth/
   │ └── session.ts # Helpers de sesión
   └── constants.ts # Rutas y navegación
2. Navbar Principal (navbar.tsx)
   2.1. Estructura Condicional
   Renderizado según estado de autenticación:
   typescriptif (!session) → NavbarPublic
   if (session) → NavbarAuth
   Elementos comunes (ambos estados):

Logo PawLig (izquierda) → click redirige a "/"
Links de navegación pública (centro)
Acciones (derecha)

2.2. Links de Navegación Pública
Rutas visibles para todos:

Inicio → "/"
Adopciones → "/adopciones"
Productos → "/productos"
Albergues → "/albergues"
Nosotros → "/nosotros" (página informativa)

Comportamiento:

Resaltado de ruta activa (border-bottom púrpura)
Hover: texto púrpura (#7C3AED)
Fuente: Inter Semibold 16px

3. NavbarPublic (navbar-public.tsx)
   3.1. Elementos Específicos
   Sección derecha (no autenticado):

Botón "Iniciar Sesión" (secundario)
Botón "Registrarse" (primario, púrpura)

Desktop (>1024px):

Links horizontales en centro
Botones alineados derecha

Móvil (<1024px):

Hamburger menu (izquierda del logo)
Solo logo visible en navbar
Botones de auth en drawer

4. NavbarAuth (navbar-auth.tsx)
   4.1. Elementos por Rol
   ADOPTER (Usuario/Adoptante):

Links públicos (Inicio, Adopciones, Productos, Albergues)
Ícono carrito 🛒 con contador
Ícono favoritos ❤ (opcional)
Foto de perfil + dropdown

SHELTER (Albergue):

Links públicos básicos (Inicio, Adopciones)
Link adicional: "Mi Panel" → "/shelter"
Foto de perfil + dropdown
Sin carrito ni favoritos

VENDOR (Vendedor):

Links públicos básicos (Inicio, Productos)
Link adicional: "Mi Panel" → "/vendor"
Foto de perfil + dropdown
Sin carrito ni favoritos

ADMIN (Administrador):

Link único: "Panel Administrativo" → "/admin"
Foto de perfil + dropdown
Sin funcionalidades públicas (acceso directo a admin)

4.2. Rutas de Navegación por Rol
typescriptconst navigationByRole = {
ADOPTER: [
{ label: "Inicio", href: "/" },
{ label: "Adopciones", href: "/adopciones" },
{ label: "Productos", href: "/productos" },
{ label: "Albergues", href: "/albergues" },
{ label: "Mi Panel", href: "/user" }
],
SHELTER: [
{ label: "Inicio", href: "/" },
{ label: "Adopciones", href: "/adopciones" },
{ label: "Mi Panel", href: "/shelter" },
{ label: "Mis Mascotas", href: "/shelter/pets" },
{ label: "Postulaciones", href: "/shelter/adoptions" }
],
VENDOR: [
{ label: "Inicio", href: "/" },
{ label: "Productos", href: "/productos" },
{ label: "Mi Panel", href: "/vendor" },
{ label: "Mis Productos", href: "/vendor/products" },
{ label: "Órdenes", href: "/vendor/orders" }
],
ADMIN: [
{ label: "Dashboard", href: "/admin" },
{ label: "Usuarios", href: "/admin/users" },
{ label: "Albergues", href: "/admin/shelters" },
{ label: "Vendedores", href: "/admin/vendors" },
{ label: "Reportes", href: "/admin/reports" }
]
} 5. UserMenu (user-menu.tsx)
5.1. Trigger del Dropdown
Elementos visibles:

Avatar circular (40px) con foto de perfil
Nombre del usuario (truncado si muy largo)
Chevron down (ícono)

Hover:

Fondo gris claro (#F3F4F6)
Cursor pointer

5.2. Contenido del Dropdown
Información del usuario:

Foto de perfil (80px circular)
Nombre completo
Email (truncado)
Badge de rol (ADMIN/SHELTER/VENDOR/ADOPTER)

Opciones comunes (todos los roles):

Mi Perfil → Ruta según rol:

ADOPTER: "/user/profile"
SHELTER: "/shelter/profile"
VENDOR: "/vendor/profile"
ADMIN: "/admin/profile"

Configuración → "/settings"
Ayuda → "/ayuda"
Cerrar Sesión (rojo, al final)

Ejecuta signOut() de NextAuth
Redirige a "/"

Opciones específicas por rol:
ADOPTER:

Mi Panel → "/user"
Mis Favoritos → "/user/favorites"
Mis Postulaciones → "/user/adoptions"

SHELTER:

Mi Panel → "/shelter"
Mis Mascotas → "/shelter/pets"
Reportes → "/shelter/reports"

VENDOR:

Mi Panel → "/vendor"
Mis Productos → "/vendor/products"
Órdenes → "/vendor/orders"

ADMIN:

Panel Admin → "/admin"
Gestionar Usuarios → "/admin/users"
Métricas → "/admin/metrics"

5.3. Diseño del Dropdown
Posición:

Alineado a la derecha del trigger
Offset: 8px desde el navbar
z-index: 50

Estilo:

Fondo blanco
Border-radius: 12px
Box-shadow: 0 4px 12px rgba(0,0,0,0.15)
Padding: 16px
Min-width: 240px

Items:

Padding: 12px 16px
Hover: fondo #F3F4F6
Ícono 20px + texto
Gap: 12px entre ícono y texto

6. CartButton (cart-button.tsx)
   6.1. Funcionalidad
   Solo visible para ADOPTER
   Elementos:

Ícono carrito (ShoppingCartLine, 24px)
Badge con contador de items (si > 0)
Click → redirige a "/productos/cart"

Badge contador:

Posición: absolute top-right
Fondo: Rosa (#EC4899)
Texto: Blanco, Inter Bold 12px
Tamaño: 20px circular
Muestra cantidad de productos únicos

Estados:

Sin items: solo ícono gris
Con items: ícono púrpura + badge rojo

6.2. Integración con Context
Uso de CartContext:
typescriptconst { items } = useCart()
const totalItems = items.length 7. NavbarMobile (navbar-mobile.tsx)
7.1. Trigger
Hamburger Button:

Ícono MenuLine (24px)
Posición: izquierda del navbar
Solo visible en <1024px

7.2. Drawer
Comportamiento:

Desliza desde la izquierda
Overlay oscuro (backdrop)
Ancho: 280px
Animación: slide-in 200ms

Contenido (sin autenticar):

Logo en header
Links de navegación (stack vertical)
Botones "Iniciar Sesión" y "Registrarse" al final

Contenido (autenticado):

Header con foto de perfil + nombre
Badge de rol
Links según rol (stack vertical)
Separador (divider)
Opciones de perfil
Botón "Cerrar Sesión" al final

Estilo de items:

Padding: 16px
Hover: fondo #F3F4F6
Ruta activa: fondo púrpura 10%, texto púrpura, border-left 3px

8. Footer (footer.tsx)
   8.1. Estructura
   Layout de 4 columnas (desktop):
   Columna 1: Sobre PawLig

Logo + tagline
Descripción breve (2-3 líneas)
"Promoviendo la adopción responsable en el Valle de Aburrá"

Columna 2: Enlaces Rápidos

Adopciones
Productos
Albergues
Nosotros
Preguntas Frecuentes
Términos y Condiciones

Columna 3: Recursos

Guía de Adopción
Cuidado de Mascotas
Contáctanos
Reportar Problema
Política de Privacidad

Columna 4: Contacto

Email: soporte@pawlig.com
Teléfono: +57 (4) 123-4567
Dirección: SENA Medellín
Redes sociales:

Instagram (ícono + link)
Facebook (ícono + link)
WhatsApp (ícono + link)

8.2. Footer Bottom
Sección final:

Background: Gris muy oscuro (#1F2937)
Texto centrado: "© 2025 PawLig - SENA. Todos los derechos reservados."
Enlaces: "Privacidad" | "Términos" | "Cookies"
Fuente: Inter Regular 14px, color #9CA3AF

8.3. Responsive
Desktop (>1024px):

4 columnas en grid
Gap: 48px
Padding: 64px

Tablet (640-1024px):

2 columnas (2x2 grid)
Gap: 32px
Padding: 48px

Móvil (<640px):

Apilado (1 columna)
Gap: 24px
Padding: 32px 16px

9. Logo Component (logo.tsx)
   9.1. Variantes
   Logotipo completo:

Texto "PawLig" en Poppins Bold
Ícono de huella (PawLine)
Color: Púrpura #7C3AED

Props:
typescript{
variant?: "full" | "icon-only"
size?: "sm" | "md" | "lg"
href?: string
}
Tamaños:

sm: 32px (móvil)
md: 40px (navbar desktop)
lg: 48px (footer)

9.2. Comportamiento

Siempre clickeable → redirige a "/"
Hover: ligero scale (1.02)
Transición suave

10. Diseño Visual
    10.1. Navbar
    Estilo:

Background: Blanco #FFFFFF
Border-bottom: 1px solid #E5E7EB
Box-shadow: 0 1px 3px rgba(0,0,0,0.1)
Altura: 72px (desktop), 64px (móvil)
Sticky position (fixed en scroll)
z-index: 40

Container:

Max-width: 1280px
Padding lateral: 32px (desktop), 16px (móvil)
Margin: 0 auto

10.2. Footer
Estilo:

Background: Gris oscuro #2D3748
Texto: Blanco/Gris claro
Padding vertical: 64px
Margin-top: auto (sticky footer)

Links:

Color: #E5E7EB
Hover: #FFFFFF + underline
Transición: 200ms

11. Autenticación y Protección
    11.1. Session Management
    Obtener sesión en Server Components:
    typescriptconst session = await getServerSession(authOptions)
    Obtener sesión en Client Components:
    typescriptconst { data: session, status } = useSession()
    11.2. Redirecciones
    Rutas protegidas:

Si no autenticado → redirige a "/login"
Si rol incorrecto → redirige a su dashboard correspondiente

Ejemplo:

ADOPTER intenta acceder a "/admin" → redirige a "/user"
Usuario sin sesión intenta "/user" → redirige a "/login"

12. Accesibilidad
    12.1. Navbar
    Requerimientos WCAG 2.1 AA:

Skip link: "Saltar al contenido principal"
Navegación semántica: <nav role="navigation">
aria-label: "Navegación principal"
aria-current="page" en ruta activa
Tabindex correcto (secuencia lógica)

12.2. Menús Desplegables
Dropdown:

aria-expanded en trigger
aria-haspopup="menu"
Role="menu" en contenido
Foco visible en items

Drawer móvil:

Foco atrapado dentro del drawer
ESC cierra el drawer
aria-modal="true"

12.3. Footer
Estructura:

Navegación secundaria con role="navigation"
Links con aria-label descriptivos
Contraste suficiente (4.5:1 mínimo)

13. Interacciones
    13.1. Scroll Behavior
    Navbar sticky:

Fixed al hacer scroll
Sombra más pronunciada al scrollear
Opcional: reducir altura a 64px en scroll

13.2. Mobile Menu
Animaciones:

Slide-in desde izquierda (200ms ease)
Backdrop fade-in (150ms)
Cerrar: ESC, click en backdrop, o botón X

13.3. Dropdowns
Behavior:

Click para abrir/cerrar (móvil)
Hover para abrir (desktop)
Click fuera cierra dropdown
Animación fade-in 150ms

14. Estados de Carga
    14.1. Navbar Loading
    Mientras obtiene sesión:

Skeleton de avatar (círculo gris pulsante)
Links visibles pero sin resaltar activo
Carrito sin contador

Delay máximo: 500ms antes de mostrar skeleton
14.2. Optimistic UI
Al cerrar sesión:

Inmediatamente oculta elementos auth
Muestra botones públicos
Ejecuta signOut() en background

15. Trazabilidad con Documentación
    15.1. Cumple con
    Requerimientos:

RF-002: Autenticación de usuarios
RF-005: Gestión de roles y permisos
RNF-003: Usabilidad e interfaz intuitiva
RNF-004: Compatibilidad navegadores

Diseño:

Manual UI: Sección 5.1 (Botones)
Manual UI: Sección 4 (Tipografía)
Manual UI: Sección 3 (Paleta de colores)
Manual UI: Sección 5.5 (Iconografía)

Arquitectura:

NextAuth.js para sesión
Server Components para navbar auth
Client Components para interacciones

15.2. Referencias
Documentos:

08_Arquitectura_del_Software: NextAuth config
12_Manual_de_Diseño_UI: Componentes navbar/footer
02_Stakeholders: Roles del sistema
04_Requerimientos: RF-002, RF-005

16. Orden de Implementación

Logo.tsx (componente base)
SessionProvider wrapper en layout.tsx
NavbarPublic.tsx (navbar sin auth)
CartButton.tsx (botón carrito)
UserMenu.tsx (dropdown de usuario)
NavbarAuth.tsx (navbar autenticado)
Navbar.tsx (componente principal con lógica condicional)
NavbarMobile.tsx (drawer móvil)
Footer.tsx (footer global)
Integración en layout.tsx
Middleware de protección (opcional)
Pruebas de navegación (todos los roles)

17. Consideraciones Especiales
    17.1. NextAuth Integration
    Session en Server Components:
    typescriptimport { getServerSession } from "next-auth"
    import { authOptions } from "@/lib/auth/auth-options"

const session = await getServerSession(authOptions)
Session en Client Components:
typescript"use client"
import { useSession } from "next-auth/react"

const { data: session } = useSession()
17.2. Rutas Específicas
Rutas donde NO mostrar navbar completo:

"/login" → solo logo
"/register" → solo logo
Rutas de auth en general

Implementación:
typescriptconst hideNavbar = pathname.startsWith('/login') ||
pathname.startsWith('/register')
17.3. Cart Context
Provider necesario:

CartProvider debe envolver toda la app
Estado global del carrito accesible en navbar
Persistencia en sessionStorage

17.4. Performance
Optimizaciones:

Next/Link para navegación (prefetch automático)
Server Components por defecto
Client Components solo donde necesario
Lazy load del drawer móvil
Memoizar rutas de navegación por rol

17.5. SEO
Meta tags por página:

Title dinámico según ruta
Description específica
Open Graph tags
Canonical URL

18. Testing
    18.1. Casos de Prueba
    Navbar:

✓ Links visibles según rol
✓ Redirección correcta al hacer click
✓ Ruta activa resaltada
✓ Dropdown se abre/cierra correctamente
✓ Cerrar sesión funciona y redirige

Footer:

✓ Todos los links funcionan
✓ Responsive en todos los breakpoints
✓ Contraste de colores suficiente

Móvil:

✓ Drawer se abre/cierra
✓ Links visibles en drawer
✓ Backdrop cierra drawer

18.2. Accesibilidad
Pruebas con axe DevTools:

Sin violaciones críticas
Contraste 4.5:1 mínimo
Navegación por teclado funcional
Screen reader compatible

19. Variantes de Estado
    19.1. Usuario No Verificado
    Albergue/Vendedor pendiente:

Mostrar banner: "Cuenta pendiente de aprobación"
Links limitados hasta aprobación
No puede publicar mascotas/productos

19.2. Usuario Bloqueado
Si cuenta bloqueada:

Al intentar acceder → mensaje de bloqueo
Automático signOut()
Redirige a página de contacto

19.3. Primera Vez
Usuario nuevo (first login):

Tooltip o tour guiado (opcional)
Resaltar secciones importantes
CTA para completar perfil

20. Extras Opcionales
    20.1. Barra de Búsqueda Global
    En navbar (centro, desktop):

Input de búsqueda rápida
Busca en: mascotas, productos, albergues
Autocompletado con resultados
Click → redirige a búsqueda completa

20.2. Notificaciones
Ícono de campana (autenticados):

Badge con contador de notificaciones
Dropdown con últimas 5 notificaciones
Link "Ver todas" → /notifications
Tipos: Postulación aprobada, nueva mascota disponible, etc.

20.3. Dark Mode Toggle
Switch en user menu:

Guarda preferencia en localStorage
Aplica theme en toda la app
Ícono sol/luna

20.4. Breadcrumbs
Debajo del navbar (páginas profundas):

Inicio > Adopciones > Detalle Mascota
Ayuda a navegación
Color gris, último item en negrita
