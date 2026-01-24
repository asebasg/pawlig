# Manual de Diseño UI

## Índice

1. Introducción
   &nbsp;&nbsp;&nbsp;&nbsp;1.1. Propósito del manual
   &nbsp;&nbsp;&nbsp;&nbsp;1.2. Alcance del diseño UI
   &nbsp;&nbsp;&nbsp;&nbsp;1.3. Audiencia objetivo
2. Sistema de diseño y guía de estilo
   &nbsp;&nbsp;&nbsp;&nbsp;2.1. Filosofía de diseño
   &nbsp;&nbsp;&nbsp;&nbsp;2.2. Principios de diseño
3. Paleta de colores
   &nbsp;&nbsp;&nbsp;&nbsp;3.1. Colores primarios
   &nbsp;&nbsp;&nbsp;&nbsp;3.2. Colores secundarios
   &nbsp;&nbsp;&nbsp;&nbsp;3.3. Colores neutrales
   &nbsp;&nbsp;&nbsp;&nbsp;3.4. Aplicación de colores por contexto
4. Tipografía
   &nbsp;&nbsp;&nbsp;&nbsp;4.1. Fuentes seleccionadas
   &nbsp;&nbsp;&nbsp;&nbsp;4.2. Jerarquía tipográfica
   &nbsp;&nbsp;&nbsp;&nbsp;4.3. Tamaños y pesos
   &nbsp;&nbsp;&nbsp;&nbsp;4.4. Interlineado y espaciado
5. Componentes de interfaz
   &nbsp;&nbsp;&nbsp;&nbsp;5.1. Botones
   &nbsp;&nbsp;&nbsp;&nbsp;5.2. Cards (Tarjetas)
   &nbsp;&nbsp;&nbsp;&nbsp;5.3. Badges y estadísticas
   &nbsp;&nbsp;&nbsp;&nbsp;5.4. Inputs y formularios
   &nbsp;&nbsp;&nbsp;&nbsp;5.5. Iconografía
   &nbsp;&nbsp;&nbsp;&nbsp;5.6. Imágenes y medios
6. Sistema de espaciado
   &nbsp;&nbsp;&nbsp;&nbsp;6.1. Escala de espaciado base
   &nbsp;&nbsp;&nbsp;&nbsp;6.2. Márgenes y padding
   &nbsp;&nbsp;&nbsp;&nbsp;6.3. Espaciado entre secciones
7. Grid y layout
   &nbsp;&nbsp;&nbsp;&nbsp;7.1. Sistema de columnas
   &nbsp;&nbsp;&nbsp;&nbsp;7.2. Breakpoints responsive
   &nbsp;&nbsp;&nbsp;&nbsp;7.3. Contenedores
8. Accesibilidad
   &nbsp;&nbsp;&nbsp;&nbsp;8.1. Contraste de colores
   &nbsp;&nbsp;&nbsp;&nbsp;8.2. Tamaños mínimos
   &nbsp;&nbsp;&nbsp;&nbsp;8.3. Navegación por teclado
9. Estados de componentes
   &nbsp;&nbsp;&nbsp;&nbsp;9.1. Estados interactivos
   &nbsp;&nbsp;&nbsp;&nbsp;9.2. Estados de carga
   &nbsp;&nbsp;&nbsp;&nbsp;9.3. Estados de error
10. Ejemplos de aplicación
    &nbsp;&nbsp;&nbsp;&nbsp;10.1. Página de inicio
    &nbsp;&nbsp;&nbsp;&nbsp;10.2. Galería de mascotas
    &nbsp;&nbsp;&nbsp;&nbsp;10.3. Formularios
    &nbsp;&nbsp;&nbsp;&nbsp;10.4. Dashboard

---

## 1. Introducción

### 1.1. Propósito del manual

Este manual establece las directrices de diseño de interfaz de usuario (UI) para la plataforma **PawLig**, garantizando consistencia visual, usabilidad y accesibilidad en todos los módulos del sistema. El documento define los elementos visuales, componentes reutilizables y patrones de diseño que deben aplicarse durante el desarrollo de la aplicación web.

El manual sirve como referencia única para diseñadores y desarrolladores, asegurando que la experiencia de usuario sea coherente, intuitiva y alineada con los valores de calidez, confianza y responsabilidad que representa PawLig en el proceso de adopción de mascotas del Valle de Aburrá.

### 1.2. Alcance del diseño UI

El alcance de este manual cubre:

- Sistema de colores completo (primarios, secundarios y neutrales)
- Tipografía y jerarquía de textos
- Componentes de interfaz reutilizables (botones, cards, formularios, badges)
- Sistema de espaciado y grid responsive
- Iconografía y tratamiento de imágenes
- Directrices de accesibilidad (WCAG 2.1 AA)
- Estados de interacción (hover, active, disabled, error)

**No incluye**:

- Wireframes de baja fidelidad
- Mockups específicos de cada pantalla (documentados por separado)
- Animaciones complejas o motion design
- Guías de redacción de contenido (UX Writing)

### 1.3. Audiencia objetivo

Este documento está dirigido a:

- **Equipo de desarrollo**: Para implementar componentes consistentes con el diseño establecido.
- **Diseñador UI/UX**: Como referencia para mantener coherencia visual en nuevas funcionalidades.
- **Líder de proyecto**: Para validar el cumplimiento de estándares de calidad visual.
- **Docente orientador**: Para evaluar la aplicación de principios de diseño de interfaces.

---

## 2. Sistema de diseño y guía de estilo

### 2.1. Filosofía de diseño

El diseño de PawLig se fundamenta en tres pilares:

- **Calidez y empatía**: Los colores cálidos (púrpura, amarillo, rosa) transmiten cercanía emocional, fundamentales en el proceso de adopción.
- **Claridad y confianza**: Tipografía legible, espaciado generoso y jerarquía visual clara facilitan la navegación y generan confianza en albergues y adoptantes.
- **Accesibilidad universal**: Contraste adecuado (WCAG 2.1 AA), tamaños de fuente legibles y componentes accesibles por teclado garantizan inclusión.

### 2.2. Principios de diseño

1. **Simplicidad**: Interfaces limpias sin elementos decorativos innecesarios.
2. **Consistencia**: Componentes reutilizables con comportamiento predecible.
3. **Jerarquía**: Guiar al usuario mediante peso visual y espaciado.
4. **Retroalimentación**: Estados visuales claros para cada interacción.
5. **Responsive**: Adaptación fluida a dispositivos móviles, tablets y desktop.

---

## 3. Paleta de colores

### 3.1. Colores de Marca (Tailwind CSS)

**Púrpura (Primario)**
- **Clase Base**: `purple-600` (`#7C3AED`)
- **Escala**: 50 (`#faf5ff`) a 900 (`#581c87`)
- **Uso**: Identidad visual, botones principales, acentos de marca.

**Fondo y Texto (Global)**
- **Background**: `#ffffff` (Blanco)
- **Foreground**: `#171717` (Gris casi negro)
- **Uso**: Definido en `:root` de `globals.css` para toda la aplicación.

### 3.2. Colores Semánticos (UI Components)

- **Éxito**: Verde (`green-600`) - Usado en notificaciones de éxito y estados positivos.
- **Error**: Rojo (`red-600`) - Usado en validaciones y alertas críticas.
- **Advertencia**: Amarillo (`yellow-600`) - Usado en estados pendientes o avisos.
- **Información**: Azul (`blue-600`) - Usado en guías y sugerencias.
- **Acento Adoptante**: Naranja (`orange-600`) - Usado específicamente en elementos de la marca PawLig.

### 3.3. Aplicación de colores por contexto

- **Módulo de Adopción**:
  - Dominante: Púrpura `#7C3AED`
  - Acentos: Verde azulado `#14B8A6` (disponible), Rosa `#EC4899` (favoritos)

- **Módulo de Productos**:
  - Dominante: Púrpura `#7C3AED`
  - Acentos: Naranja `#F97316` (ofertas), Amarillo `#F59E0B` (destacados)

- **Panel Administrativo**:
  - Dominante: Gris Oscuro `#2D3748`
  - Acentos: Púrpura `#7C3AED` (acciones primarias)

- **Estados del sistema**:
  - Éxito: Verde azulado `#14B8A6`
  - Advertencia: Amarillo `#F59E0B`
  - Error: Rosa/Rojo `#EC4899`
  - Información: Púrpura `#7C3AED`

---

## 4. Tipografía

### 4.1. Fuentes seleccionadas

- **Fuente Sans (Principal)**: `Inter` (definida como fuente base en Tailwind y globals.css).
- **Fuente Poppins**: `Poppins` (usada para títulos destacados y branding).
- **Fuente Geist**: `Geist Sans` y `Geist Mono` (configuradas como variables locales para optimización).

### 4.2. Jerarquía tipográfica

- **Títulos (H1, H2, H3)**: Utilizan predominantemente `font-poppins` con pesos `bold` o `semibold`.
- **Cuerpo de texto**: Utiliza `Inter` para máxima legibilidad.
- **Código y Datos Técnicos**: Utiliza `Geist Mono`.

### 4.3. Tamaños y pesos

**Escala de tamaños**:

- 12px: Caption
- 14px: Small
- 16px: Base
- 18px: H4
- 20px: H3
- 24px: Títulos destacados
- 32px: H2
- 48px: H1

**Pesos disponibles**:

- Regular (400): Cuerpo de texto
- Medium (500): Énfasis leve, labels
- Semibold (600): Títulos menores, botones, badges
- Bold (700): Títulos principales, CTAs destacados

### 4.4. Interlineado y espaciado

- **Line height**:
  - Títulos (H1–H3): 1.2
  - Cuerpo (16px): 1.6
  - Textos pequeños (12–14px): 1.5

- **Letter spacing**:
  - Títulos grandes: `-0.02em`
  - Cuerpo: `0em`
  - Uppercase: `0.05em`

- **Párrafos**:
  - Ancho máximo: 65–75 caracteres por línea
  - Espaciado entre párrafos: 16px (1em)

---

## 5. Componentes de interfaz

### 5.0. Componentes Implementados (UI Library)

Basados en una arquitectura de componentes reutilizables y estilizados con `class-variance-authority`:

- **Button**: Botones altamente configurables con variantes (default, destructive, outline, secondary, ghost, link) y tamaños (default, sm, lg, icon).
- **Input & Label**: Campos de texto estandarizados con soporte para estados de error.
- **Card**: Contenedores con sombra y bordes redondeados para agrupar información.
- **Badge**: Etiquetas de estado (Disponible, En Proceso, Adoptado) con colores semánticos.
- **Dialog & Alert-Dialog**: Ventanas modales para interacciones críticas y confirmaciones.
- **Select & Radio-Group**: Elementos de selección para formularios.
- **Checkbox**: Control de selección binaria.
- **Table**: Estructura de datos tabulares para paneles administrativos.
- **Favorite-Button**: Componente especializado con animación para marcar favoritos.
- **Confetti-Button**: Botón con efecto visual de celebración tras éxito.
- **Loader**: Indicadores visuales de carga (Spinners).
- **Logo**: Componente central de identidad de marca.

### 5.1. Botones

**Botón Primario**:

- Fondo: `#7C3AED`
- Texto: `#FFFFFF`
- Fuente: Inter Semibold 16px
- Padding: 14px 32px
- Border-radius: 8px
- Box-shadow: `0 2px 8px rgba(124, 58, 237, 0.2)`
- Estados: hover (`#6D28D9`), active (`#5B21B6`), disabled (`#D1D5DB`)
- Uso: CTAs principales (Buscar, Postular, Registrarse)

**Botón Secundario**:

- Fondo: `#FFFFFF`
- Borde: `1px solid #E5E7EB`
- Texto: `#2D3748`
- Estados: hover (`#F3F4F6`), active (borde púrpura)
- Uso: Cancelar, Ver más, Filtrar

**Botón de Texto**:

- Fondo: transparente
- Texto: `#7C3AED`
- Estados: hover (underline), active (`#6D28D9`)
- Uso: Enlaces secundarios

**Botón de Icono**:

- Tamaño: 40×40px
- Fondo: transparente o `#F3F4F6`
- Icono: 20px, color `#6B7280`
- Uso: Favoritos, menús, cerrar modales

### 5.2. Cards (Tarjetas)

**Card Estándar**:

- Fondo: `#FFFFFF`
- Border-radius: 16px
- Box-shadow: `0 1px 3px rgba(0,0,0,0.1)`
- Padding: 24px
- Hover: sombra elevada + zoom suave (scale 1.02)

**Card de Mascota**:

- Imagen superior: aspect ratio 4:3
- Badge estado: superior derecho
- Botón favorito: superior izquierdo
- Nombre: Poppins Semibold 20px
- Metadata: Inter Regular 14px, color `#6B7280`

**Card Elevada**:

- Box-shadow: `0 8px 24px rgba(0,0,0,0.12)`
- Borde superior: 3px púrpura
- Uso: Contenido destacado, mascotas urgentes

### 5.3. Badges y estadísticas

**Badge Estándar**:

- Fondo: color temático con transparencia (ej. `rgba(124, 58, 237, 0.1)`)
- Texto: color sólido
- Padding: 4px 12px
- Border-radius: 12px (pill shape)

**Badge de Estado**:

- Disponible: fondo `#14B8A6`, texto blanco
- En Proceso: fondo `#F59E0B`, texto blanco
- Adoptado: fondo `#6B7280`, texto blanco
- Urgente: fondo `#EC4899`, texto blanco

**Estadísticas**:

- Icono: 32px, color temático
- Número: Poppins Bold 32px
- Descripción: Inter Regular 14px
- Layout: centrado verticalmente

### 5.4. Inputs y formularios

**Input de Texto**:

- Altura: 44px
- Borde: `1px solid #E5E7EB`
- Border-radius: 8px
- Padding: 12px 16px
- Placeholder: `#9CA3AF`
- Focus: borde púrpura + box-shadow
- Error: borde rosa `#EC4899`

**Textarea**:

- Altura mínima: 120px
- Resize: vertical

**Select**:

- Similar a input + ícono chevron-down

**Checkbox / Radio**:

- Tamaño: 20×20px
- Checked: fondo púrpura + checkmark blanco

**Mensajes de Error**:

- Color: `#EC4899`
- Icono: Alert circle 16px
- Margin-top: 4px

### 5.5. Iconografía

**Librería**: Lucide React (`npm install lucide-react`)
**Estilo**: Line icons (outlined) y filled según contexto
**Tamaños**:

- Pequeño: 16px
- Mediano: 24px
- Grande: 32px
- Extra grande: 48px

**Colores temáticos**:

- Animales: `#14B8A6`
- Amor/Favoritos: `#EC4899`
- Comunidad: `#F97316`
- Esperanza: `#F59E0B`
- Información: `#7C3AED`
- Neutrales: `#6B7280`

**Iconos principales**:

- Navegación: Home, Search, Heart, User, Menu, Settings
- Mascotas: Paw, Dog, Cat, Pet
- Acciones: Add, Edit, Delete, Check, Close
- Estados: CheckCircle, CloseCircle, Alert, Information
- Tienda: ShoppingCart, Package, CreditCard, Pricetag
- Comunicación: Chat, Mail, Phone, Notification
- Ubicación: Location, Map, Pin
- Multimedia: Image, Camera, Gallery
- Archivos: File, Download, Upload
- Tiempo: Calendar, Time
- Redes: Instagram, Facebook, WhatsApp, Twitter

**Accesibilidad**:

- Siempre usar `aria-label` en iconos interactivos sin texto
- Iconos decorativos: `aria-hidden="true"`

### 5.6. Imágenes y medios

**Fotos de Mascotas**:

- Border-radius: 12px
- Aspect ratio: 4:3 o 1:1
- Lazy loading: activado
- Placeholder: gris claro + ícono paw

**Overlay en Imágenes**:

- Hover: `rgba(0,0,0,0.2)`
- Con texto: `rgba(0,0,0,0.4)`

**Hero Images**:

- Altura: 400–600px (desktop)
- Overlay: `rgba(0,0,0,0.5)`
- Posición: center center, object-fit cover

**Avatar de Usuario**:

- Tamaño: 40px (navbar), 80px (perfil), 120px (detalle)
- Border-radius: 50%
- Borde: 2px blanco + box-shadow sutil

---

## 6. Sistema de espaciado

### 6.1. Escala de espaciado base

Base: múltiplos de 8px

- 4px: mínimo
- 8px: pequeño
- 12px: reducido
- 16px: estándar
- 24px: mediano
- 32px: grande
- 48px: extra grande
- 64px: sección
- 96px: masivo

### 6.2. Márgenes y padding

**Padding de componentes**:

- Botones: 14px v / 32px h
- Cards: 24px
- Inputs: 12px v / 16px h
- Modales: 32px (desktop), 24px (mobile)

**Márgenes entre elementos**:

- Títulos y párrafos: 16px
- Formularios: 16px
- Cards en grid: gap 24px
- Secciones: 64–96px

**Container padding**:

- Desktop: 32px laterales
- Tablet: 24px
- Mobile: 16px

### 6.3. Espaciado entre secciones

- Hero → primera sección: 64px
- Secciones principales: 96px
- Subsecciones relacionadas: 48px
- Footer desde última sección: 64px

---

## 7. Grid y layout

### 7.1. Sistema de columnas

| Dispositivo | Columnas | Gutter | Max-width container |
| ----------- | -------- | ------ | ------------------- |
| Desktop     | 12       | 24px   | 1280px              |
| Tablet      | 8        | 16px   | 100%                |
| Mobile      | 4        | 16px   | 100%                |

### 7.2. Breakpoints responsive

- **Mobile**: < 640px
- **Tablet**: 640px – 1024px
- **Desktop**: 1024px – 1280px
- **Large Desktop**: > 1280px

Adaptaciones:

- Mobile: columnas apiladas, menú hamburger
- Tablet: grid 2 columnas
- Desktop: grid 3–4 columnas

### 7.3. Contenedores

- **Principal**: max-width 1280px, centrado
- **Estrecho**: max-width 768px (formularios, artículos)
- **Ancho**: max-width 100% (hero, footer)

---

## 8. Accesibilidad

### 8.1. Contraste de colores

Cumple WCAG 2.1 AA:

- Texto normal (16px): ratio ≥ 4.5:1
- Texto grande (≥24px): ratio ≥ 3:1

Contrastes verificados:

- Gris oscuro sobre blanco: 12.6:1 ✅
- Púrpura sobre blanco: 4.8:1 ✅
- Blanco sobre púrpura: 4.8:1 ✅
- Gris medio sobre blanco: 4.6:1 ✅

### 8.2. Tamaños mínimos

- Área táctil: 44×44px
- Botones: altura mínima 44px
- Checkbox: área total 44px
- Fuente mínima: 14px (labels 12px permitidos)

### 8.3. Navegación por teclado

- **Focus visible**: outline 2px púrpura + offset
- **Orden lógico**: Header → Nav → Main → Footer
- **Skip links**: “Saltar al contenido principal”
- **Interactivos**: accesibles con Tab, activables con Enter/Espacio

---

## 9. Estados de componentes

### 9.1. Estados interactivos

- **Normal**: estilo base
- **Hover**: cambio visual + transición suave (0.2s)
- **Focus**: outline púrpura visible
- **Active**: efecto “pressed” (fondo más oscuro)
- **Disabled**: opacidad 0.5–0.6, cursor not-allowed

### 9.2. Estados de carga

**Loading Button**:

- Spinner 16px + texto “Cargando…”
- Estado disabled

**Skeleton**:

- Gradiente animado (`#F3F4F6` → `#E5E7EB`)
- Shimmer left → right (1.5s loop)

**Spinner**:

- Tamaño: 24px (pequeño), 48px (grande)
- Color: púrpura `#7C3AED`

### 9.3. Estados de error

**Mensaje de error**:

- Color: `#EC4899`
- Icono: AlertCircle 16px
- Posición: debajo del input

**Empty State**:

- Icono: 64px gris claro
- Título: “No hay resultados”
- Botón CTA: “Buscar de nuevo”

**Toast Global**:

- Error: fondo rosa, texto blanco, duración 5s
- Éxito: fondo teal, texto blanco
- Posición: superior derecha (desktop), centro (mobile)

---

## 10. Ejemplos de aplicación

### 10.1. Página de inicio

**Hero Section**:

- Altura: 600px (desktop), 400px (mobile)
- Imagen fondo + overlay oscuro
- Título blanco, buscador centrado
- Estadísticas: 3 columnas con iconos temáticos

**Mascotas Destacadas**:

- Grid: 4 (desktop), 2 (tablet), 1 (mobile)
- Cards con badge “Disponible”
- Hover: elevación + zoom

**Cómo Funciona**:

- 3 pasos con iconos 48px
- Flechas naranja entre pasos (desktop)
- Títulos Poppins 24px, descripción Inter 16px

### 10.2. Galería de mascotas

**Filtros**:

- Sidebar izq. (desktop), drawer (mobile)
- Checkboxes + botón aplicar

**Grid Resultados**:

- Columnas: 3 (desktop), 2 (tablet), 1 (mobile)
- Paginación centrada

**Barra Superior**:

- “48 mascotas encontradas”
- Dropdown ordenar
- Toggle vista (grid/list)

### 10.3. Formularios

**Layout general**:

- Ancho máx. 600px, centrado
- Labels arriba, inputs 100% ancho
- Campos requeridos: asterisco rojo

**Registro**:

- Título centrado, campos email/contraseña/nombre
- Validación inline, botón submit primario

**Publicar Mascota**:

- Secciones con títulos H3
- Upload drag&drop, vista previa thumbnails
- Toggle “¿Vacunado?”

### 10.4. Dashboard

**Layout**:

- Sidebar izq. (240px desktop)
- Contenido: fondo `#F3F4F6`, padding 32px

**Sidebar**:

- Logo superior
- Items con ícono + texto
- Activo: fondo púrpura 10%, borde izq. 3px

**Cards Estadísticas**:

- Grid 3 columnas
- Icono esquina sup. izq.
- Número grande + label

**Tabla Datos**:

- Header: fondo `#F3F4F6`, texto uppercase
- Filas: hover fondo claro
- Acciones: íconos 16px
