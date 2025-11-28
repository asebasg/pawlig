# Checklist de Pruebas - Navbar y Footer

## ✅ Pruebas de Navbar

### Navbar Público (Sin Autenticación)
- [ ] Logo visible y clickeable (redirige a "/")
- [ ] Links públicos visibles: Inicio, Adopciones, Productos, Albergues
- [ ] Botón "Iniciar Sesión" visible y funcional
- [ ] Botón "Registrarse" visible y funcional
- [ ] Ruta activa resaltada con borde púrpura
- [ ] Hover en links cambia color a púrpura
- [ ] Responsive: Hamburger menu visible en móvil

### Navbar Autenticado - ADOPTER
- [ ] Logo visible y clickeable
- [ ] Links: Inicio, Adopciones, Productos, Albergues, Mi Panel
- [ ] Botón de favoritos (corazón) visible
- [ ] Botón de carrito visible
- [ ] Avatar de usuario visible
- [ ] Nombre de usuario visible (desktop)
- [ ] Dropdown de usuario funcional
- [ ] Badge de rol "Adoptante" visible en dropdown
- [ ] Opciones del menú: Mi Panel, Mi Perfil, Mis Favoritos, Mis Postulaciones
- [ ] Botón "Cerrar Sesión" funcional

### Navbar Autenticado - SHELTER
- [ ] Links: Inicio, Adopciones, Mi Panel, Mis Mascotas, Postulaciones
- [ ] Sin botón de carrito ni favoritos
- [ ] Badge de rol "Albergue" visible
- [ ] Opciones del menú: Mi Panel, Mi Perfil, Mis Mascotas, Reportes

### Navbar Autenticado - VENDOR
- [ ] Links: Inicio, Productos, Mi Panel, Mis Productos, Órdenes
- [ ] Sin botón de carrito ni favoritos
- [ ] Badge de rol "Vendedor" visible
- [ ] Opciones del menú: Mi Panel, Mi Perfil, Mis Productos, Órdenes

### Navbar Autenticado - ADMIN
- [ ] Link único: Dashboard
- [ ] Sin carrito ni favoritos
- [ ] Badge de rol "Administrador" visible
- [ ] Opciones del menú: Panel Admin, Mi Perfil, Gestionar Usuarios, Métricas

### Menú de Usuario (Dropdown)
- [ ] Click en avatar abre dropdown
- [ ] Foto de perfil visible (o ícono por defecto)
- [ ] Nombre completo visible
- [ ] Email visible (truncado si es largo)
- [ ] Badge de rol visible
- [ ] Opciones específicas del rol visibles
- [ ] Opciones comunes: Configuración, Ayuda
- [ ] Botón "Cerrar Sesión" en rojo al final
- [ ] Click fuera del dropdown lo cierra
- [ ] Click en opción cierra dropdown y navega

### Menú Móvil (Drawer)
- [ ] Hamburger menu visible en móvil (<1024px)
- [ ] Click abre drawer desde la izquierda
- [ ] Backdrop oscuro visible
- [ ] Logo visible en header del drawer
- [ ] Botón X cierra el drawer
- [ ] Click en backdrop cierra el drawer
- [ ] Navegación completa visible según rol
- [ ] Ruta activa resaltada (borde izquierdo púrpura)
- [ ] Scroll del body bloqueado cuando drawer abierto
- [ ] Drawer se cierra al cambiar de ruta

### Menú Móvil - Sin Autenticación
- [ ] Links públicos visibles
- [ ] Botones "Iniciar Sesión" y "Registrarse" al final

### Menú Móvil - Autenticado
- [ ] Foto de perfil en header
- [ ] Nombre y email visibles
- [ ] Badge de rol visible
- [ ] Links según rol visibles
- [ ] Botón "Cerrar Sesión" al final

## ✅ Pruebas de Footer

### Estructura General
- [ ] Footer visible en todas las páginas
- [ ] Footer pegado al fondo (sticky footer)
- [ ] Fondo gris oscuro (#2D3748)
- [ ] Texto en gris claro legible

### Columna 1: Sobre PawLig
- [ ] Logo visible
- [ ] Descripción visible y legible
- [ ] Tagline correcto

### Columna 2: Enlaces Rápidos
- [ ] Título "Enlaces Rápidos" visible
- [ ] 6 enlaces visibles
- [ ] Todos los enlaces funcionan
- [ ] Hover cambia color a blanco

### Columna 3: Recursos
- [ ] Título "Recursos" visible
- [ ] 5 enlaces visibles
- [ ] Todos los enlaces funcionan
- [ ] Hover cambia color a blanco

### Columna 4: Contacto
- [ ] Título "Contacto" visible
- [ ] Email visible y clickeable (mailto:)
- [ ] Teléfono visible
- [ ] Dirección visible
- [ ] Iconos de contacto visibles
- [ ] Sección "Síguenos" visible
- [ ] 3 iconos de redes sociales visibles
- [ ] Links de redes sociales funcionan (abren en nueva pestaña)
- [ ] Hover en iconos cambia fondo a púrpura

### Footer Bottom
- [ ] Copyright con año actual visible
- [ ] Texto "© 2025 PawLig - SENA" visible
- [ ] Enlaces: Privacidad, Términos, Cookies visibles
- [ ] Separadores "|" visibles
- [ ] Hover en enlaces cambia color a blanco

## ✅ Pruebas Responsive

### Desktop (≥1024px)
- [ ] Navbar altura 72px
- [ ] Logo tamaño md (40px)
- [ ] Navegación horizontal visible
- [ ] Hamburger menu oculto
- [ ] Footer 4 columnas
- [ ] Padding 64px vertical en footer
- [ ] Container max-width 1280px

### Tablet (640-1024px)
- [ ] Navbar altura 64px
- [ ] Logo tamaño sm (32px)
- [ ] Hamburger menu visible
- [ ] Navegación desktop oculta
- [ ] Footer 2 columnas (2x2 grid)
- [ ] Padding 48px vertical en footer

### Móvil (<640px)
- [ ] Navbar altura 64px
- [ ] Logo centrado
- [ ] Hamburger menu a la izquierda
- [ ] Spacer a la derecha (para centrar logo)
- [ ] Footer 1 columna (stack)
- [ ] Padding 32px vertical en footer
- [ ] Padding 16px horizontal

## ✅ Pruebas de Interacción

### Navegación
- [ ] Click en logo redirige a "/"
- [ ] Click en links navega correctamente
- [ ] Ruta activa se resalta automáticamente
- [ ] Navegación funciona con teclado (Tab, Enter)

### Autenticación
- [ ] Login actualiza navbar automáticamente
- [ ] Logout actualiza navbar automáticamente
- [ ] Cambio de rol actualiza navegación
- [ ] Sesión expirada redirige a login

### Carrito (ADOPTER)
- [ ] Contador de items visible cuando > 0
- [ ] Contador muestra "9+" cuando > 9
- [ ] Click redirige a "/productos/cart"
- [ ] Ícono cambia color cuando hay items

### Performance
- [ ] Navbar carga rápido (<100ms)
- [ ] Footer carga rápido (<100ms)
- [ ] Sin parpadeos al cargar
- [ ] Transiciones suaves (200ms)
- [ ] Sin lag en animaciones

## ✅ Pruebas de Accesibilidad

### Semántica HTML
- [ ] Uso de `<header>` para navbar
- [ ] Uso de `<nav>` para navegación
- [ ] Uso de `<footer>` para footer
- [ ] Uso de `<button>` para botones
- [ ] Uso de `<a>` para links

### Navegación por Teclado
- [ ] Tab navega por todos los elementos
- [ ] Enter activa links y botones
- [ ] Escape cierra dropdown y drawer
- [ ] Focus visible en elementos

### Contraste
- [ ] Texto legible sobre fondos
- [ ] Ratio de contraste ≥ 4.5:1
- [ ] Links distinguibles del texto normal

### ARIA
- [ ] aria-label en iconos sin texto
- [ ] aria-expanded en dropdowns
- [ ] aria-current en ruta activa

## ✅ Pruebas de Navegadores

### Chrome
- [ ] Navbar funciona correctamente
- [ ] Footer funciona correctamente
- [ ] Responsive funciona
- [ ] Animaciones suaves

### Firefox
- [ ] Navbar funciona correctamente
- [ ] Footer funciona correctamente
- [ ] Responsive funciona
- [ ] Animaciones suaves

### Safari
- [ ] Navbar funciona correctamente
- [ ] Footer funciona correctamente
- [ ] Responsive funciona
- [ ] Animaciones suaves

### Edge
- [ ] Navbar funciona correctamente
- [ ] Footer funciona correctamente
- [ ] Responsive funciona
- [ ] Animaciones suaves

## ✅ Pruebas de Dispositivos

### iPhone (Safari)
- [ ] Navbar responsive
- [ ] Drawer funciona
- [ ] Footer responsive
- [ ] Touch funciona correctamente

### Android (Chrome)
- [ ] Navbar responsive
- [ ] Drawer funciona
- [ ] Footer responsive
- [ ] Touch funciona correctamente

### iPad (Safari)
- [ ] Navbar responsive
- [ ] Footer responsive (2 columnas)
- [ ] Touch funciona correctamente

## 🐛 Bugs Conocidos

Documentar aquí cualquier bug encontrado durante las pruebas:

1. **Bug:** [Descripción]
   - **Pasos:** [Cómo reproducir]
   - **Esperado:** [Comportamiento esperado]
   - **Actual:** [Comportamiento actual]
   - **Prioridad:** Alta/Media/Baja

## 📝 Notas de Prueba

- Fecha de prueba: ___________
- Probado por: ___________
- Navegador: ___________
- Dispositivo: ___________
- Resolución: ___________

## ✅ Aprobación Final

- [ ] Todas las pruebas pasadas
- [ ] Bugs documentados y priorizados
- [ ] Performance aceptable
- [ ] Accesibilidad verificada
- [ ] Responsive verificado
- [ ] Listo para producción

**Aprobado por:** ___________  
**Fecha:** ___________
