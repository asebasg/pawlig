# DESIGN SYSTEM ARCHITECTURE — Single Source of Truth
> Versión 2.0 · PawLig · Última revisión: 2026-09-14

Este documento es la **ÚNICA FUENTE DE VERDAD** para decisiones visuales, de maquetación, interacción y movimiento en este proyecto. Todo componente generado por agentes IA o desarrolladores humanos debe adherirse estrictamente a las reglas aquí definidas. Las secciones de Movimiento y Física son **obligatorias y no opcionales**.

---

## Parámetros del Proyecto

| Parámetro | Valor | Fuente |
|---|---|---|
| **Nombre / Producto** | PawLig — Plataforma de adopción y gestión de mascotas | `package.json` |
| **Audiencia** | Adoptantes B2C, refugios, veterinarias y administradores | `CONTEXT.md` |
| **Identidad Visual** | Apple Human Interface · Glassmorphism funcional · Minimalismo de precisión | `DESIGN.md` |
| **Next.js** | `14.2.33` | `package.json` |
| **React** | `^18` | `package.json` |
| **TypeScript** | `^5` | `package.json` |
| **Tailwind CSS** | `^3.4.1` | `package.json` · `tailwind.config.ts` |
| **Librería de animación** | `framer-motion ^13.1.1` | `package.json` |
| **Iconos** | `lucide-react ^0.554.0` | `package.json` |
| **Tema Base** | Dual con clase `.dark`. _Light-first_ con soporte completo dark | `app/layout.tsx` |

> ⚠️ **Nota de coherencia de stack**: DESIGN.md adoptó la referencia de stack real desde `package.json`. Cualquier upgrade de versión mayor (React 19, Tailwind v4) deberá actualizarse primero en `package.json` y `CONTEXT.md` antes de reflejarse aquí.

---

## 0. FILOSOFÍA — EL CONTRATO DE MOVIMIENTO APPLE

> _"When we align the interface to the way we think and move, something magical happens — it stops feeling like a computer and starts feeling like a seamless extension of us."_
> — WWDC 2018, Designing Fluid Interfaces

Toda la interactividad del proyecto se rige por los ocho principios de Apple. **No son guías opcionales; son restricciones de implementación.**

### Principio 0.1 — Response (Respuesta Instantánea)

El lag destruye la sensación de directez. La UI debe responder en el instante de `pointerdown`, nunca en `click` (pointerup). Todo feedback visual debe iniciarse en menos de **1 frame** (~16ms) desde el input del usuario.

```tsx
// ✅ CORRECTO — feedback en press, no en release
<motion.button
  whileTap={{ scale: 0.97 }}
  transition={{ type: 'spring', bounce: 0, duration: 0.1 }}
>
  Enviar
</motion.button>

// ❌ PROHIBIDO — animaciones que sólo inician al soltar
onClick={() => triggerAnimation()}
```

### Principio 0.2 — Manipulación Directa (1:1 Tracking)

Todo elemento arrastrable debe seguir el puntero 1:1, respetando el **offset del punto de agarre**, nunca saltando al centro. Usar `setPointerCapture` para continuar el tracking fuera de los límites del elemento.

```ts
el.addEventListener('pointerdown', (e) => {
  el.setPointerCapture(e.pointerId);
  const grabOffset = e.clientY - el.getBoundingClientRect().top;
  // guardar historial de posición + timestamp para calcular velocidad en release
});
```

### Principio 0.3 — Interruptibilidad (El Principio Más Importante)

**Toda animación debe poder ser interrumpida y redirigida en cualquier instante.** Un modal que se está cerrando y el usuario vuelve a tocar debe seguir al dedo — no terminar de cerrar y luego reabrirse.

- **Prohibido:** `CSS transitions` y `@keyframes` para interacciones guiadas por gestos.
- **Obligatorio:** Springs de `motion` que siempre parten del **valor presentado en pantalla** (no del valor lógico/target).
- En interrupciones, leer el transform live con `element.getBoundingClientRect()` y pasar ese valor como punto de partida.

### Principio 0.4 — Springs, No Duraciones Fijas

Los springs son el mecanismo de animación por defecto. A diferencia de `ease-in-out` con duración fija, un spring puede ser re-targetizado en mid-flight sin discontinuidad de velocidad.

**Tabla de valores Apple (traducidos a `motion`):**

| Caso de uso | `bounce` | `duration` | Notas |
|---|---|---|---|
| Botones, micro-interacciones | `0` | `0.15` | Crítico, sin rebote |
| Cards, paneles, reposicionamiento | `0` | `0.4` | Default de UI |
| Modales, drawers (entrada) | `0.1` | `0.35` | Leve sensación física |
| Drawers con flick / throw | `0.2` | `0.4` | Rebote sólo si hubo momentum |
| Rotación, scale en presión | `0.15` | `0.3` | Leve spring físico |

```ts
import { animate } from "framer-motion";

// Default — críticamente amortiguado, sin rebote
animate(el, { y: 0 }, { type: "spring", bounce: 0, duration: 0.4 });

// Interacción con momentum (flick, throw)
animate(el, { y: target }, { type: "spring", bounce: 0.2, duration: 0.4 });
```

### Principio 0.5 — Velocity Handoff (Transferencia de Velocidad)

Cuando un gesto termina, la animación resultante debe **iniciar exactamente a la velocidad del dedo** en el momento de soltar. Esto elimina el "seam" visible entre el drag y la animación post-release.

```ts
// Calcular velocidad promedio de los últimos N pointermove events
const velocity = (lastPos - prevPos) / (lastTime - prevTime); // px/ms

// Pasarla al spring
animate(el, { y: target }, {
  type: 'spring',
  bounce: 0.15,
  duration: 0.4,
  velocity: velocity * 1000, // motion espera px/s
});
```

### Principio 0.6 — Momentum Projection

No snappear al snap-point más cercano al punto de release. **Proyectar la posición de reposo** usando la velocidad, luego snappear al target más cercano a esa proyección.

```ts
// Función exacta de Apple (Designing Fluid Interfaces, WWDC 2018)
function project(initialVelocity: number, decelerationRate = 0.998): number {
  return (initialVelocity / 1000) * decelerationRate / (1 - decelerationRate);
}

const projectedEndpoint = currentPosition + project(releaseVelocity);
const target = nearestSnapPoint(projectedEndpoint);
animateSpringTo(target, { velocity: releaseVelocity });
```

### Principio 0.7 — Consistencia Espacial (Paths Simétricos)

- Lo que entra por la derecha, sale por la derecha. **Entrada y salida siguen el mismo eje y dirección.**
- Popovers, sheets y menús originan desde su trigger (usar `transform-origin` al trigger).
- El easing de salida es el espejo del easing de entrada.

### Principio 0.8 — Hint en la Dirección del Gesto

Los frames intermedios de una animación deben telegrafiar el destino final. Durante una transición, los elementos apuntan hacia donde van — no interpolan ciegamente. Ejemplo: una card que se abre debe escalar desde el punto de toque, no desde su centro.

---

## 1. PRINCIPIOS DE EXPERIENCIA Y DENSIDAD

### Filosofía Visual

La interfaz es un material, no un lienzo. Los elementos tienen **peso, translucidez y profundidad**. El diseño es _invisible_: el usuario ve sus datos y sus mascotas, no la interfaz.

- **Glassmorphism funcional**: Superficies translúcidas con `backdrop-blur` para capas flotantes. No decorativo; comunica jerarquía y contexto.
- **Contraste selectivo**: Un solo color de acento de marca por pantalla. El resto es monocromático.
- **Espacios negativos activos**: El espacio agrupa. Se evita el uso de bordes como separadores cuando el espacio puede cumplir esa función.

### Nivel de Densidad y Espaciado

**Densidad**: Media–Alta. El producto es usado desde desktop y móvil por personas con intención de completar tareas.

**Sistema de Espaciado** — Múltiplos estrictos de **4px**:

| Escala | Clases | px | Uso |
|---|---|---|---|
| Micro | `gap-1`, `p-1` | 4px | Iconos + texto inline |
| Nano | `gap-2`, `p-2` | 8px | Badges, chips |
| Componente | `gap-3`, `p-3` | 12px | Padding de inputs compactos |
| Base | `gap-4`, `p-4` | 16px | Padding estándar de cards, formularios |
| Medio | `gap-6`, `p-6` | 24px | Separación entre secciones |
| Sección | `gap-8`, `p-8` | 32px | Padding de página |
| Layout | `gap-12`, `gap-16` | 48–64px | Separación entre módulos de página |

### Elevación y Material

La elevación **no se expresa con sombras pesadas**, sino con la combinación de fondo base, borde translúcido de 1px, y capa de `backdrop-blur-*`.

| Capa | Token de Superficie | Blur | Sombra | Borde |
|---|---|---|---|---|
| Canvas Base | `bg-white dark:bg-zinc-950` | — | — | — |
| Surface 1 (Cards) | `bg-white/80 dark:bg-zinc-900/80` | `backdrop-blur-md` | `shadow-sm` | `border border-white/60 dark:border-white/10` |
| Surface 2 (Modales, Popovers) | `bg-white/80 dark:bg-zinc-900/80` | `backdrop-blur-2xl` | `shadow-[0_8px_40px_-12px_rgba(0,0,0,0.12)]` | `border border-white/60 dark:border-white/10` |
| Surface 3 (Overlay fullscreen) | `bg-black/40 dark:bg-black/60` | `backdrop-blur-sm` | — | — |

> **PRECEDENTE OBSERVADO** en `/reset-password`:
> El card usa exactamente `bg-white/80 backdrop-blur-2xl border border-white/60 rounded-[2rem] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.12)]`. Esta combinación es el **estándar canónico de Surface 2** para este proyecto. Toda tarjeta flotante o modal debe replicarla.

---

## 2. DICCIONARIO DE TOKENS

### Backgrounds & Superficies

```
Canvas:        bg-white              dark:bg-zinc-950
Surface 1:     bg-white/80           dark:bg-zinc-900/80     + backdrop-blur-md
Surface 2:     bg-white/80           dark:bg-zinc-900/80     + backdrop-blur-2xl
Surface Hover: hover:bg-zinc-50/80   dark:hover:bg-zinc-800/50
Overlay:       bg-black/40           dark:bg-black/60        + backdrop-blur-sm
```

### Material "Luz Ambiental" (Ambient Light Line)

> **PRECEDENTE OBSERVADO** en `/reset-password`: La línea `h-px bg-gradient-to-r from-transparent via-white/80 to-transparent` en el borde superior de cada card glassmorphic simula la luz refractada de Apple. Es **obligatoria** en toda Surface 2 del proyecto.

```tsx
{/* Luz ambiental — obligatoria en toda Surface 2 */}
<div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />
```

### Tipografía

- **Fuente Principal**: Inter o Geist Sans → `font-sans`
- **Fuente Mono**: Geist Mono → `font-mono`

| Rol | Clases Tailwind |
|---|---|
| H1 · Página | `text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50` |
| H2 · Sección | `text-lg font-medium tracking-tight text-zinc-900 dark:text-zinc-50` |
| H3 · Subsección | `text-base font-medium text-zinc-800 dark:text-zinc-100` |
| Body · Texto base | `text-sm font-normal leading-relaxed text-zinc-700 dark:text-zinc-300` |
| Caption / Muted | `text-xs font-medium text-zinc-500 dark:text-zinc-400` |
| Label de Input | `text-sm font-medium text-zinc-700 dark:text-zinc-200` |

> **PRECEDENTE OBSERVADO** en `/reset-password`: `text-2xl font-semibold tracking-tight text-gray-900` para H1. Ajustar a `text-zinc-900 dark:text-zinc-50` para coherencia con el sistema dual.

### Text & Foreground

```
Primario:    text-zinc-900    dark:text-zinc-50
Secundario:  text-zinc-500    dark:text-zinc-400
Muted:       text-zinc-400    dark:text-zinc-500
Acento:      text-purple-600  dark:text-purple-400
Destructivo: text-red-600     dark:text-red-400
```

> **PRECEDENTE OBSERVADO** en `/profile`: Los links de navegación usan `text-purple-600 hover:text-purple-700`. El **color de acento del proyecto es `purple`**. Todas las acciones primarias de texto, links y highlights deben usar esta paleta.

### Semántica del Dominio

| Estado | Texto | Fondo | Borde |
|---|---|---|---|
| **Success** | `text-emerald-600 dark:text-emerald-400` | `bg-emerald-50 dark:bg-emerald-950/30` | `border-emerald-200 dark:border-emerald-800` |
| **Danger** | `text-red-600 dark:text-red-400` | `bg-red-50 dark:bg-red-950/30` | `border-red-200 dark:border-red-800` |
| **Warning** | `text-amber-600 dark:text-amber-400` | `bg-amber-50 dark:bg-amber-950/30` | `border-amber-200 dark:border-amber-800` |
| **Info** | `text-blue-600 dark:text-blue-400` | `bg-blue-50 dark:bg-blue-950/30` | `border-blue-200 dark:border-blue-800` |

> **PRECEDENTE OBSERVADO** en `/profile`: El banner de info usa `bg-blue-50 border border-blue-200 rounded-lg`. Alineado con el token Info. Pendiente añadir variante dark en la implementación: `dark:bg-blue-950/30 dark:border-blue-800`.

### Acciones Principales (Primary Action)

| Estado | Clases |
|---|---|
| Base | `bg-purple-600 text-white` |
| Hover | `hover:bg-purple-700` |
| Active / Press | `whileTap={{ scale: 0.97 }}` con `springs.snap` en Client Components |
| Focus | `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2` |
| Disabled | `opacity-50 cursor-not-allowed pointer-events-none` |
| Loading | `<Loader2 className="w-4 h-4 animate-spin" />` dentro del botón |

> **Nota**: El `active:scale-[0.97]` de Tailwind es el fallback para Server Components. En Client Components interactivos, **siempre** reemplazar con `whileTap` de `motion`.

### Bordes y Radios

```
Card flotante / Modal:  rounded-[2rem]   (32px — precedente /reset-password)
Card estándar:          rounded-2xl      (16px)
Inputs, Botones:        rounded-xl       (12px)
Badges, Tags:           rounded-full
Checkboxes:             rounded-md
```

---

## 3. ARQUITECTURA DE COMPONENTES CORE

### Layout Global

- **Sidebar**: Fijo izquierda (`w-64`), `bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md`, borde derecho `border-r border-zinc-200/60 dark:border-zinc-800/60`.
- **Navbar (Top)**: `sticky top-0 z-40 h-14`, glassmorphic: `bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200/60 dark:border-zinc-800/60`.
- **Content Area**: `max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12` (precedente directo de `/profile`).

### Back Link — Patrón Canónico

Extraído de `/profile`. Todo link de navegación "volver" debe seguir este patrón:

```tsx
<motion.div whileHover={{ x: -2 }} transition={springs.snap}>
  <Link
    href={backUrl}
    className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2 rounded-sm"
  >
    <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
    {backText}
  </Link>
</motion.div>
```

### Patrones de Navegación

- **Modales**: Entran con `springs.modal` desde origen espacial. Overlay con `bg-black/40 backdrop-blur-sm`. Interruptibles en cualquier instante (§0.3).
- **Drawers**: Desde el eje correcto, con velocity handoff al cerrar por flick (§0.5).
- **Tabs**: Segment controls con indicador animado por `layoutId` de Motion (ver §4).

### Formularios e Inputs

La interacción con campos de texto se rige por los principios de **Response (§0.1)** y **Manipulación Directa (§0.2)** del estándar Apple adaptados a interfaces web: todo elemento interactivo debe proporcionar affordance visual inmediato ante el puntero (`hover`) y definición nítida de estado activo (`focus`), eliminando cualquier sensación de latencia.

#### Contrato de Estados para Inputs y Contenedores Interactivos

| Estado | Clases Tailwind | Principio Apple / Comportamiento |
|---|---|---|
| **Base** | `h-10 w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent px-3 text-sm transition-colors duration-150` | Reposo neutro; superficie de precisión con borde sutil de 1px |
| **Hover** | `hover:border-zinc-300 dark:hover:border-zinc-600` | **OBLIGATORIO (§0.1 / §5.13)**: elevación sutil de contraste ante el puntero |
| **Focus (Nativo)** | `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950` | Anillo de enfoque de precisión de 2px con offset de contraste |
| **Focus (Contenedor)** | `focus-within:outline-none focus-within:ring-2 focus-within:ring-purple-600 focus-within:ring-offset-2 dark:focus-within:ring-offset-zinc-950` | **OBLIGATORIO** en wrappers compuestos (`TagsInput`, datepickers, multi-selects) |
| **Error** | `border-red-400 focus-visible:ring-red-500 text-red-900 dark:text-red-200` | Retroalimentación destructiva inmediata (§2) |
| **Disabled** | `opacity-50 cursor-not-allowed bg-zinc-50 dark:bg-zinc-900 pointer-events-none` | Estado inactivo bloqueado |

**Labels**: Estáticos, inmediatamente encima del control, `text-sm font-medium text-zinc-700 dark:text-zinc-200 mb-1`.

#### Reglas Contractuales para Formularios (Vinculantes §5)

1. **Paridad de Contenedores Compuestos**: Todo contenedor que actúe visualmente como input (por ejemplo, `TagsInput` o selectores con chips interactivos) **DEBE** replicar exactamente el radio (`rounded-xl`), la transición de color (`transition-colors duration-150`), el estado `hover:` (`hover:border-zinc-300 dark:hover:border-zinc-600`) y el anillo `focus-within:ring-2 focus-within:ring-purple-600`.
2. **Prohibición de `transition-all` en Cajas de Entrada**: Queda estrictamente prohibido utilizar `transition-all` en inputs o contenedores de entrada, ya que induce distorsiones geométricas en layout al cambiar estados. Se exige exclusivamente `transition-colors duration-150`.
3. **Componente Primitivo de Referencia**: `components/ui/input.tsx` es la fuente única de verdad para inputs nativos en el proyecto. Todo formulario debe consumir este componente o replicar su especificación exacta sin discrepancias.

### Tablas y Listas

- Cabeceras: `text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider`
- Filas: `hover:bg-zinc-50/80 dark:hover:bg-zinc-800/50 transition-colors duration-150`
- Sin bordes verticales. Separación: `border-b border-zinc-100 dark:border-zinc-800`.
- **Empty State**: Icono Lucide `text-zinc-300 dark:text-zinc-600`, `text-sm text-zinc-500`.
- **Skeleton Loaders**: `animate-pulse bg-zinc-100 dark:bg-zinc-800 rounded-xl`.

### Surface 2 — Card Glassmorphic Canónico

Derivado directamente de `/reset-password` y elevado a estándar del proyecto. Todo modal, popover o card de acción central:

```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.95, y: 16 }}
  animate={{ opacity: 1, scale: 1, y: 0 }}
  exit={{ opacity: 0, scale: 0.95, y: 8 }}
  transition={springs.modal}
  className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl border border-white/60 dark:border-white/10 rounded-[2rem] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.12)] w-full max-w-md mx-auto relative overflow-hidden"
>
  {/* Luz ambiental — OBLIGATORIA en toda Surface 2 */}
  <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />

  <div className="px-8 py-10 space-y-6">
    {/* Contenido */}
  </div>
</motion.div>
```

---

## 4. SISTEMA DE MOVIMIENTO Y ANIMACIÓN (OBLIGATORIO)

### Librería

**Librería instalada**: `framer-motion ^13.1.1` (ya presente en `package.json`). Prohibido instalar o usar `anime.js`, `gsap`, `react-spring` u otras librerías de animación.

- `transition-*` de Tailwind **solo** está permitido para: transiciones de color/opacidad en hover/focus de elementos estáticos, y fallbacks en Server Components.
- Prohibido `CSS @keyframes` para interacciones gesture-driven.

### Springs Canónicos del Proyecto

Centralizar en `lib/motion/springs.ts` (alineado con la estructura de `/lib` de `.rules.md`):

```ts
import type { SpringTransition } from "framer-motion";

export const springs = {
  /** Micro-interacciones: botones, íconos, badges */
  snap:     { type: "spring", bounce: 0,    duration: 0.15 } as SpringTransition,
  /** Default de UI: cards, paneles, transiciones de página */
  default:  { type: "spring", bounce: 0,    duration: 0.4  } as SpringTransition,
  /** Modales y drawers: leve sensación física */
  modal:    { type: "spring", bounce: 0.1,  duration: 0.35 } as SpringTransition,
  /** Interacciones con momentum (flick, drag release) */
  physical: { type: "spring", bounce: 0.2,  duration: 0.4  } as SpringTransition,
  /** Tabs y shared layout con layoutId */
  layout:   { type: "spring", bounce: 0.15, duration: 0.3  } as SpringTransition,
} as const;
```

### Patrones de Animación por Componente

**Botones** — Spring en press:
```tsx
<motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.97 }} transition={springs.snap}>
```

**Modales** — Entrada desde origen, interruptible:
```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.95, y: 8 }}
  animate={{ opacity: 1, scale: 1, y: 0 }}
  exit={{ opacity: 0, scale: 0.95, y: 4 }}
  transition={springs.modal}
>
```

**Drawers** — Eje consistente, velocity handoff en cierre por flick:
```tsx
<motion.div
  initial={{ x: '100%' }}
  animate={{ x: 0 }}
  exit={{ x: '100%' }}
  transition={springs.modal}
  drag="x"
  dragConstraints={{ left: 0, right: 0 }}
  dragElastic={0.1}
  onDragEnd={(_, info) => {
    if (info.velocity.x > 500) onClose();
  }}
>
```

**Tabs con shared layout**:
```tsx
{activeTab === tab.id && (
  <motion.div
    layoutId="tab-indicator"
    className="absolute inset-0 bg-white dark:bg-zinc-700 rounded-lg shadow-sm"
    transition={springs.layout}
  />
)}
```

**Listas — stagger de hijos**:
```tsx
<motion.ul
  initial="hidden"
  animate="visible"
  variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
>
  <motion.li
    variants={{
      hidden:   { opacity: 0, y: 8 },
      visible:  { opacity: 1, y: 0, transition: springs.default }
    }}
  >
```

---

## 5. REGLAS CONTRACTUALES PARA AGENTES IA Y DESARROLLADORES

**ESTAS REGLAS SON VINCULANTES Y NO NEGOCIABLES. Toda PR que las viole debe ser rechazada.**

### Estilización

1. **PROHIBIDO el estilo inline**: Nunca `style={{ color: "red" }}`. Solo clases Tailwind.
2. **PROHIBIDAS clases arbitrarias** no estandarizadas: evitar `h-[37px]`, `text-[13px]`. **Excepciones permitidas y documentadas**: `shadow-[0_8px_40px_-12px_rgba(0,0,0,0.12)]` y `rounded-[2rem]` (tokens de Surface 2).
3. **PROHIBIDAS librerías CSS externas**: No SASS, no Styled Components, no CSS Modules. Solo Tailwind CSS **v3.4.x**.
4. **Iconografía exclusiva**: `lucide-react`. Estándar: `w-4 h-4` inline, `w-5 h-5` independiente, `strokeWidth={1.5}`.
5. **Variables CSS semánticas sobre colores hardcodeados** (regla de `.rules.md §1 Tailwind`): preferir `text-primary`, `bg-background`, `text-muted-foreground` sobre colores directos como `bg-purple-600`. Los tokens de color del sistema deben estar definidos en `tailwind.config.ts` como variables CSS. Los ejemplos con `purple-*` o `zinc-*` en este documento son referencias de _valor_ del token, no clases a usar directamente en producción si existe una variable semántica equivalente.

### Animación (Apple Design — Obligatorio)

6. **OBLIGATORIO `framer-motion`** para toda animación de componentes interactivos (botones, modales, drawers, tabs, listas). El paquete ya está instalado como `framer-motion ^13.1.1`.
7. **OBLIGATORIO usar los springs canónicos** de `lib/motion/springs.ts`. Prohibido inventar valores ad-hoc.
8. **PROHIBIDO `@keyframes`** para interacciones gesture-driven o entradas/salidas de componentes.
9. **OBLIGATORIO que toda animación sea interruptible** (§0.3). Nunca bloquear input durante una transición.
10. **OBLIGATORIO velocity handoff** (§0.5) en todo componente draggable o swipeable.
11. **OBLIGATORIA consistencia espacial** (§0.7): si algo entra por un eje, sale por el mismo eje.

### Accesibilidad

12. **WCAG AA obligatorio**: Contraste mínimo 4.5:1 para texto normal, 3:1 para texto grande.
13. **Estados interactivos obligatorios**: `hover:`, `active:` y `focus-visible:` en todo elemento interactivo.
14. **`aria-*` semántico**: `aria-label`, `role`, `aria-expanded`, `aria-disabled` cuando corresponda.
15. **Reducción de movimiento**: Toda animación con `framer-motion` debe respetar `useReducedMotion()` (hook de `framer-motion`):
    ```tsx
    import { useReducedMotion } from "framer-motion";

    const prefersReduced = useReducedMotion();
    const transition = prefersReduced ? { duration: 0 } : springs.modal;
    ```

### Arquitectura

16. **ESTRUCTURA MODULAR**: Ningún componente complejo vive en `page.tsx`. Rutas reales del proyecto (sin prefijo `/src`, según `CONTEXT.md`):
    - `components/ui/` → Primitivos del design system
    - `components/forms/` → Formularios del dominio (ej: `reset-password-form.tsx`)
    - `components/profile/` → Módulo de perfil (ej: `unified-profile-client.tsx`)
    - `components/[feature]/` → Componentes específicos de una funcionalidad
    - `lib/motion/springs.ts` → Springs canónicos centralizados _(crear si no existe)_
17. **Server vs Client**: Server Components no pueden usar `framer-motion`. En ese caso, usar `transition-*` de Tailwind como fallback declarado con un comentario `{/* Fallback: framer-motion no disponible en Server Component */}`.

---

## 6. PRECEDENTES DE IMPLEMENTACIÓN (CONTRATOS VIVOS)

### Precedente A — `/app/profile/page.tsx`

| Elemento | Clases Actuales | Acción Requerida |
|---|---|---|
| Layout de página | `max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12` | ✅ Adoptar como token `Content Area` |
| Back link | `text-purple-600 hover:text-purple-700 text-sm font-semibold` | ✅ Color de acento confirmado. Reemplazar por `text-primary` si se define variable semántica |
| Banner Info | `bg-blue-50 border border-blue-200 rounded-lg p-6` | ⚠️ Añadir variante dark + animación de entrada con `framer-motion` |
| Delegación | Server → `UnifiedProfileClient` | ✅ Patrón obligatorio para contenido interactivo |

### Precedente B — `/app/(auth)/reset-password/page.tsx`

| Elemento | Clases Actuales | Acción Requerida |
|---|---|---|
| Card glassmorphic | `bg-white/80 backdrop-blur-2xl border border-white/60 rounded-[2rem] shadow-[0_8px_40px_...]` | ✅ Elevado a **estándar canónico de Surface 2** |
| Luz ambiental | `absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent` | ✅ Obligatoria en toda Surface 2 |
| Padding interior | `px-8 py-10` | ✅ Estándar para cards de acción central |
| Botón CTA | `hover:opacity-90 transition-opacity` | ⚠️ Migrar a `framer-motion whileTap + springs.snap` |
| H1 de estado | `text-gray-900` | ⚠️ Migrar a `text-zinc-900 dark:text-zinc-50` (o variable semántica equivalente) |

**Implementación objetivo del botón CTA** (de `transition-opacity` a spring con `framer-motion`):
```tsx
import { motion } from "framer-motion";
import { springs } from "@/lib/motion/springs";

<motion.div whileTap={{ scale: 0.97 }} transition={springs.snap}>
  <Link
    href="/login"
    className="inline-block bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-semibold hover:opacity-90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
  >
    Volver a intentar
  </Link>
</motion.div>
```

> **Nota**: Las clases del botón usan variables semánticas (`bg-primary`, `text-primary-foreground`, `focus-visible:ring-ring`) en lugar de colores directos, alineándose con la regla §5.5 y con `.rules.md §1 Tailwind`.

---

## 7. COMPONENTES DE TERCEROS ADOPTADOS

### 7.1 DeleteButton — RareUI

> **Fuente**: [rareui.com/components/deletebutton](https://www.rareui.com/components/deletebutton)
> **Autor**: Swami Malode · `swamimalode07/rare-ui`
> **Categoría RareUI**: Inputs

#### Descripción del Componente

Un botón de eliminación que solicita confirmación **en el mismo lugar donde está ubicado**, sin necesidad de abrir un Dialog ni un modal separado. La interacción completa ocurre dentro del propio elemento.

#### Mecánica de Interacción (Behavior)

1. **Estado idle**: se muestra un icono de papelera (`Trash2` equivalente).
2. **Click en la papelera**: la tapa del bin se levanta con una animación de spring. Un panel se desliza hacia afuera exponiendo dos controles: ✓ (confirmar) y ✗ (cancelar).
3. **Confirmar (✓)**: ejecuta `onConfirm()`. El icono de papelera es reemplazado por un checkmark animado que confirma la acción.
4. **Cancelar (✗ o `Escape`)**: ejecuta `onCancel()`. El panel se retrae y el bin vuelve a sus estado idle con un spring de asentamiento.
5. **Click en el bin mientras está abierto**: equivale a cancelar.

La animación es interruptible en todo momento (§0.3 de DESIGN.md). El foco se mueve automáticamente al primer control del panel al abrirse (accesibilidad).

#### Props

| Prop | Tipo | Descripción |
|---|---|---|
| `onConfirm` | `() => void` | Se llama cuando el usuario pulsa el control de confirmación (✓). |
| `onCancel` | `() => void` | Se llama cuando el panel se cierra sin borrar (✗, bin, o `Escape`). |
| `className` | `string` | Clases adicionales fusionadas sobre el elemento raíz. |

#### Instalación

```bash
npx shadcn@latest add swamimalode07/rare-ui/delete-button
```

El componente se instala en `components/ui/delete-button.tsx`, alineado con la estructura de carpetas del proyecto (`.rules.md §3`).

#### Uso básico

```tsx
"use client";

import { DeleteButton } from "@/components/ui/delete-button";

// Dentro de un Client Component:
<DeleteButton
  onConfirm={() => removeFromCart(itemId)}
  onCancel={() => console.log("Cancelado")}
/>
```

---

#### Mapa de Uso: Dónde Sí / Dónde No

##### ✅ Contextos Aprobados — Acciones de Bajo Riesgo

Estas acciones son reversibles o no requieren justificación, por lo que el flujo in-place del DeleteButton es apropiado:

| Contexto | Componente afectado | Motivo |
|---|---|---|
| Eliminar ítem del carrito | `components/cart/cart-item.tsx` | Acción reversible (el producto sigue en catálogo). Sin impacto referencial. |
| Quitar mascota de favoritos | `components/ui/favorite-button.tsx` | Acción inmediata sin registro de auditoría. |
| Borrar imagen suelta en formulario de mascota | `components/forms/pet-form.tsx` | La imagen aún no se persiste en Cloudinary hasta el submit. Sin integridad referencial en riesgo. |
| Borrar imagen suelta en formulario de producto | `components/forms/product-form.tsx` | Mismo caso que `pet-form.tsx`. Pre-upload, sin dependencias externas. |

##### ❌ Contextos Prohibidos — Acciones de Alto Riesgo

Estos flujos **deben mantener el `AlertDialog` actual** o un modal dedicado. El DeleteButton no tiene superficie para capturar una justificación (`reason`), lo que lo hace incompatible con los requisitos de auditoría y de integridad referencial del dominio:

| Contexto | Razón de exclusión | Referencia |
|---|---|---|
| **Eliminar mascota** (`pet.service.ts → deletePet`) | Requiere validar adopciones pendientes antes de proceder. `deletePet` arroja error si existen `Adoption` activos. El flujo in-place del DeleteButton no tiene espacio para mostrar ese error de forma clara, ni para pedir confirmación con contexto. | `documentacion_y_gestion_de_prs.md §4.5` · `CONTEXT.md §1.2` |
| **Eliminar usuario** (hard-delete, ISSUE-174.1) | La operación requiere registrar `reason` no vacío en `SystemAuditLog` (`documentacion_y_gestion_de_prs.md §4.5`: _"Si el cambio toca `SystemAuditLog`, el registro incluye `category`, `action`, `resourceType/Id`, `reason` no vacío"_). El DeleteButton no tiene campo de captura de razón. ISSUE-174.1 está abierto y su alcance aún puede requerir un modal con textarea. | `documentacion_y_gestion_de_prs.md §4.5` · ISSUE-174.1 |
| **Bloquear usuario** (`BlockUserModal`) | Requiere `blockReason` obligatorio (campo del modelo `User`). Mismo argumento que hard-delete. | `components/admin/block-user-modal.tsx` |

---

#### Ajuste de Springs Obligatorio (Regla §5.7 de DESIGN.md)

> ⚠️ **Conflicto de dependencia**: RareUI declara `motion` (paquete npm `motion`, distinto de `framer-motion`) como dependencia propia del componente. Sus springs internos son **valores ad-hoc** no alineados con los canónicos del proyecto.

Al instalar el componente con `shadcn`, se obtiene el código fuente directamente en `components/ui/delete-button.tsx`. Esto significa que el código es **propiedad del proyecto** y debe ser editado para:

1. **Reemplazar el import de `motion`** por `framer-motion` (la librería ya instalada en el proyecto).
2. **Sobreescribir los valores de `transition`** internos del componente para usar los springs canónicos de `lib/motion/springs.ts`.

**Patrón de ajuste requerido** tras instalar:

```tsx
// ❌ Antes (springs ad-hoc del componente RareUI original)
import { motion, AnimatePresence } from "motion";

// animation del panel de confirmación — valor ad-hoc
<motion.div
  transition={{ type: "spring", stiffness: 300, damping: 25 }}
  ...
>

// ✅ Después (integrado al sistema del proyecto)
import { motion, AnimatePresence } from "framer-motion";
import { springs } from "@/lib/motion/springs";

// Panel de confirmación → usa springs.modal (sensación física, leve)
<motion.div
  transition={springs.modal}
  ...
>

// Asentamiento del bin al cancelar → usa springs.snap (micro, inmediato)
<motion.div
  transition={springs.snap}
  ...
>

// Checkmark de confirmación → usa springs.default (neutro, sin rebote)
<motion.div
  transition={springs.default}
  ...
>
```

> La elección de qué spring mapea a qué animación interna depende de la inspección del código real que genera `shadcn` al instalar. El criterio de selección sigue la tabla §0.4: panel deslizable → `springs.modal`, asentamiento → `springs.snap`, confirmación de estado → `springs.default`.

#### Accesibilidad Requerida

Además de los estados de accesibilidad obligatorios por §5.13, verificar tras la instalación:

- El panel de confirmación recibe foco al abrirse (`autoFocus` en el primer control o `focus()` programático).
- `Escape` cierra el panel y devuelve el foco al botón original (ya implementado por RareUI, verificar que persista tras el override de springs).
- El botón raíz tiene `aria-label="Eliminar"` o equivalente descriptivo en español (regla §7 de `.rules.md` — UI en español).
- Estados `aria-expanded` en el botón raíz para reflejar si el panel está abierto.

---

### 7.2 ScrollProgress — RareUI

> **Fuente**: [rareui.com/components/scrollprogressindicator](https://www.rareui.com/components/scrollprogressindicator)
> **Autor**: Swami Malode · `swamimalode07/rare-ui`
> **Categoría RareUI**: Navigation / Display

#### Descripción del Componente

Un indicador flotante de progreso de lectura en forma de píldora que reporta visualmente la posición del lector en la página y se expande mediante resortes físicos a un menú de tabla de contenidos (ToC) tipo Surface 2 con desplazamiento suave hacia cada sección.

#### Mecánica de Interacción (Behavior)

1. **Estado idle (colapsado)**: Se presenta como una píldora flotante centrada en la parte inferior (`fixed bottom-6 left-1/2 -translate-x-1/2`). Presenta un medidor circular SVG cuyo perímetro (`pathLength`) se llena dinámicamente según el progreso de scroll, junto al título de la sección activa con animación de crossfade y leve desenfoque.
2. **Click en la píldora**: Se expande fluidamente mediante un resorte físico (`springs.modal`) transformándose en una tarjeta Surface 2 que expone la lista de encabezados del artículo.
3. **Selección de sección**: Al pulsar sobre cualquier elemento de la lista, la página realiza un `scrollIntoView` suave con offset de compensación de encabezado (`scroll-mt-20`), el indicador activo se desplaza con `springs.layout` (`layoutId`) y el menú se repliega automáticamente al pill colapsado.
4. **Cierre manual**: Pulsar la tecla `Escape` o hacer click en cualquier área externa repliega el menú.

La interacción es totalmente interruptible en todo instante (§0.3 de DESIGN.md).

#### Props

| Prop | Tipo | Descripción |
|---|---|---|
| `sections` | `ScrollProgressSection[]` | Array de secciones `{ id: string; label: string }`. Cada `id` debe coincidir con un elemento del DOM. Si está vacío o tiene < 2 ítems, el componente no se renderiza. |
| `containerRef` | `React.RefObject<HTMLElement \| null>` | Contenedor de scroll a rastrear. Por defecto monitorea la ventana global (`window`). |
| `offset` | `number` | Distancia en píxeles debajo del borde superior del scroller para marcar una sección como activa (por defecto `120`). |
| `className` | `string` | Clases de Tailwind adicionales para reposicionar o ajustar la píldora raíz. |
| `stopBeforeSelector` | `string` | Selector CSS del elemento ante el cual el componente frena su desplazamiento inferior (por defecto `'footer'`). |
| `stopMargin` | `number` | Margen de separación en píxeles antes de tocar el elemento delimitador (por defecto `24`). |

#### Instalación y Ubicación

Instalado y adaptado en `components/ui/scroll-progress.tsx`, conforme a la estructura de primitivos UI de `.rules.md §3`.

#### Uso Básico en el Proyecto

```tsx
"use client";

import { ScrollProgress } from "@/components/ui/scroll-progress";

const sections = [
  { id: "introduccion", label: "Introducción" },
  { id: "cuidados", label: "Cuidados Esenciales" },
  { id: "conclusion", label: "Conclusión" },
];

<ScrollProgress sections={sections} />
```

Para artículos de blog generados dinámicamente, se utiliza a través del contenedor [BlogArticleReader](file:///c:/Users/ultra/Proyectos/pawlig/components/blog/blog-article-reader.tsx) en conjunto con la utilidad [parseBlogContent](file:///c:/Users/ultra/Proyectos/pawlig/lib/utils/blog-content-parser.ts).

---

#### Mapa de Uso: Dónde Sí / Dónde No

##### ✅ Contextos Aprobados — Contenidos Extensos y de Lectura
| Contexto | Componente afectado | Motivo |
|---|---|---|
| **Artículos de blog** | `app/(public)/blog/[slug]/page.tsx` | Guías y lecturas educativas con múltiples encabezados; orienta al usuario y agiliza saltos de lectura. |
| **Términos y condiciones / Privacidad** | `app/(public)/legal/terms/page.tsx` | Documentos legales largos estructurados en cláusulas numeradas. |
| **Guías de adopción y onboarding** | Páginas de documentación de procesos | Proporciona referencia continua de avance al adoptante o voluntario. |

##### ❌ Contextos Prohibidos — Vistas Operativas y Formularios
| Contexto | Razón de exclusión |
|---|---|
| **Formularios y pantallas de autenticación** | Contenido compacto sin jerarquía de lectura; compite con los botones primarios (CTA) de acción. |
| **Tablas y dashboards administrativos** | Entorpece la visibilidad de filas y controles flotantes o de paginación. |
| **Artículos cortos (< 2 encabezados)** | Ausencia de suficiente jerarquía para justificar una tabla de contenidos. |

---

#### Ajuste de Springs y Tokens Canónicos (Reglas §5.5 y §5.7)

1. **Reemplazo de Dependencia**: RareUI usa originalmente `motion/react` con constantes no canónicas. En PawLig se migró completamente a `framer-motion` y a los resortes de `lib/motion/springs.ts`:
   - Expansión/Contracción dimensional (`width`, `height`, `borderRadius`): `springs.modal` (`bounce: 0.1, duration: 0.35`).
   - Indicador de sección activa con `layoutId`: `springs.layout` (`bounce: 0.15, duration: 0.3`).
   - Micro-interacciones táctiles en ítems: `springs.snap` (`bounce: 0, duration: 0.15`).
   - Suavizado de scroll: `useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 })`.
2. **Superficie Surface 2 Glassmorphic (Alto Contraste)**:
   - `bg-white/95 dark:bg-zinc-900/85 backdrop-blur-2xl border border-zinc-200/80 dark:border-white/10 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.12),0_1px_3px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.4)]`.
   - Incorpora la línea de luz ambiental canónica adaptada (`h-px bg-gradient-to-r from-transparent via-zinc-200/60 dark:via-white/20 to-transparent`).
3. **Acento Institucional**:
   - Trazo de progreso: `stroke-purple-600 dark:stroke-purple-400` con track `stroke-purple-100/80 dark:stroke-purple-950/40`.
   - Punto de estado activo: `bg-purple-600 dark:bg-purple-400`.
   - Pastilla de fondo de ítem activo: `bg-purple-50 dark:bg-purple-950/40 border border-purple-200/50 dark:border-purple-800/40`.

#### Accesibilidad Requerida (§5.12–§5.15)

- **Reducción de movimiento**: Respeta `useReducedMotion()`; si está activo, se omiten transiciones y filtros blur (`duration: 0`) y el desplazamiento se realiza con `behavior: "auto"`.
- **Semántica ARIA**: Contenedor con `role="navigation"` y `aria-label="Progreso de lectura y secciones"`; botón pill con `aria-label` descriptivo y `aria-expanded={open}`.
- **Teclado**: Atajo nativo de `Escape` para repliegue instantáneo y foco visible con anillo púrpura (`focus-visible:ring-purple-600`).

