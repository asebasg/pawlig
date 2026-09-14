# Feature — ISSUE-157: Crear módulo de blog con gestor de artículos administrativo

Este documento formaliza la especificación técnica y trazabilidad de trabajo para el **Issue #157** conforme al estándar de [documentacion_y_gestion_de_prs.md](file:///c:/Users/ultra/Proyectos/pawlig/documentacion_y_gestion_de_prs.md) y [.rules.md](file:///c:/Users/ultra/Proyectos/pawlig/.rules.md).

---

## 🔗 Cadena de Trazabilidad

- **ID de Trazabilidad:** `ISSUE-157`
- **GitHub Issue:** [#157](https://github.com/asebasg/pawlig/issues/157)
- **Rama Oficial:** `feat/ISSUE-157-modulo-blog`
- **Tipo de PR:** `feat` (`Closes #157`)
- **Estado Actual:** `📋 Todo`

---

## 📋 Metadata

- **Estado:** `📋 Todo`
- **Prioridad:** `P2 - Medio` (Mejora importante)
- **Tamaño (Story Points):** `XL` (2-3 días - Requiere descomposición en sub-issues según §3.1.4)
- **Componentes Afectados:** Frontend, Backend, Database, API, Tests, Docs
- **Breaking Changes:** No

---

## 1. ¿Qué?

Implementar un módulo integral de blog dentro de PawLig que permita a usuarios administradores (`ADMIN`) redactar, gestionar, previsualizar y publicar artículos con contenido enriquecido e imágenes, y proporcione una galería pública optimizada para SEO con filtrado por categorías/tags, paginación y vista de lectura con tabla de contenidos dinámica.

---

## 2. ¿Por qué?

- **Posicionamiento Orgánico y SEO:** Atraer tráfico cualificado a la plataforma mediante artículos educativos sobre tenencia responsable, cuidados y adopción.
- **Engagement y Storytelling:** Difundir historias de éxito de adopciones, actualizaciones de albergues y novedades comunitarias.
- **Canal de Comunicación Institucional:** Fortalecer la confianza y credibilidad de la plataforma ante adoptantes, rescatistas y donantes.
- **Integración con el Ecosistema:** Base para futuras comunicaciones automáticas por correo electrónico (Resend) y newsletters.

---

## 3. ¿Cómo funciona?

### 3.1 Flujo Administrativo (`/admin/blog`)
1. El usuario autenticado con rol `ADMIN` ingresa a `/admin/blog`.
2. Visualiza una tabla con listado de artículos categorizados por estado (`DRAFT`, `PUBLISHED`, `ARCHIVED`), con búsqueda en tiempo real, filtros y paginación.
3. Al hacer clic en "Crear Nuevo", se despliega el formulario en `/admin/blog/new` con editor de texto enriquecido (WYSIWYG), subida de imagen destacada (Cloudinary), selector de tags y generación automática de slug único editable.
4. Puede guardar como borrador (`DRAFT`) o publicar directamente (`PUBLISHED`). Al publicar, se registra fecha de publicación y evento en `SystemAuditLog`.
5. Permite editar (`/admin/blog/[id]/edit`) o eliminar artículos con modal de confirmación.

### 3.2 Flujo Público (`/blog` y `/blog/[slug]`)
1. El usuario (público general o autenticado) navega a `/blog`.
2. Se muestra una galería responsive en grid (3 columnas desktop, 1 móvil) con tarjetas (`BlogCard`) que presentan imagen destacada, título, extracto, autor, fecha y tags.
3. Permite buscar por texto libre, filtrar por tags y cambiar el orden, sincronizando los parámetros en la URL (`?tag=adopciones&sort=views`).
4. Al ingresar a un artículo (`/blog/[slug]`), se renderiza el contenido sanitizado, tiempo estimado de lectura, breadcrumbs, tabla de contenidos sticky en desktop, artículos relacionados y botones para compartir en redes sociales.

---

## 4. 🔓 Decisiones Pendientes (§3.1.5)

| Decisión | Opciones Evaluadas | Estado / Recomendación | Responsable |
|---|---|---|---|
| **Editor Rich Text** | A) `react-quill` (simple)<br>B) `@tiptap/react` (moderno, compatible con Next.js App Router) | Recomendado: `@tiptap/react` por mejor soporte de TypeScript y Next.js App Router (evita problemas de SSR comunes con Quill). | Tech Lead / @asebasg |
| **Sanitización de HTML** | A) `sanitize-html`<br>B) `isomorphic-dompurify` | Recomendado: `sanitize-html` para sanitización estricta en servidor antes de persistir en MongoDB. | Tech Lead / @asebasg |
| **Generación de Slugs** | A) `slugify`<br>B) Función utilitaria interna nativa | Recomendado: Utilidad interna ligera con normalización Unicode o `slugify` con deduplicación automática (`slug-2`, `slug-3`). | Backend |

---

## 5. 🧩 Descomposición en Sub-issues (§3.1.4)

Dado que el issue está categorizado con tamaño **XL (≥ L)**, se descompone formalmente en tareas atómicas con trazabilidad:

```
ISSUE-157: Módulo de Blog
 ├── ISSUE-157.1: Modelo Prisma BlogPost, Migración y Servicio blog.service.ts
 ├── ISSUE-157.2: Esquemas Zod blog.schema.ts y API Routes (Admin + Públicas)
 ├── ISSUE-157.3: Panel Administrativo (/admin/blog, formulario, editor, gestión de estado)
 ├── ISSUE-157.4: Galería Pública y Detalle (/blog, /blog/[slug], SEO, TOC, OpenGraph)
 └── ISSUE-157.5: Tests Unitarios/E2E, Documentación y Cierre (CHANGELOG, CONTEXT)
```

---

## 6. ✅ Plan de Trabajo y Tareas

### Fase 1: Base de Datos y Backend Core (`ISSUE-157.1`)
- [ ] Incorporar modelo `BlogPost` en `prisma/schema.prisma`.
- [ ] Ejecutar migración de Prisma (`npx prisma db push` o script correspondiente).
- [ ] Implementar `lib/services/blog.service.ts` con tipado estricto, métodos CRUD, paginación, filtros e incremento de vistas.
- [ ] Integrar registro de auditoría en `SystemAuditLog` para creación, edición, cambio de estado y eliminación.
- [ ] Tests unitarios para `blog.service.ts` en `tests/unit/services/blog.service.test.ts`.

### Fase 2: Validaciones y API REST (`ISSUE-157.2`)
- [ ] Crear esquemas Zod en `lib/validations/blog.schema.ts` (`createBlogSchema`, `updateBlogSchema`, `blogQuerySchema`).
- [ ] Crear API routes administrativas protegidas con RBAC (`ADMIN`):
  - `GET /api/admin/blog`: Listado administrativo con filtros y estados.
  - `POST /api/admin/blog`: Crear artículo (sanitización de HTML + slug único).
  - `GET /api/admin/blog/[id]`: Detalle para edición.
  - `PUT /api/admin/blog/[id]`: Actualización.
  - `DELETE /api/admin/blog/[id]`: Eliminación.
  - `POST /api/admin/blog/[id]/publish`: Publicación y despublicación.
- [ ] Crear API routes públicas:
  - `GET /api/blog`: Listado paginado de artículos publicados (`PUBLISHED`).
  - `GET /api/blog/[slug]`: Detalle por slug con incremento atómico de vistas.
  - `GET /api/blog/tags`: Listado de tags disponibles con conteo.
  - `GET /api/blog/related/[slug]`: Artículos relacionados por tags.
- [ ] Tests de endpoints en `tests/integration/api/blog.test.ts`.

### Fase 3: Frontend Administrativo (`ISSUE-157.3`)
- [ ] Componente `components/admin/blog/blog-table.tsx` (tabla con acciones, badges de estado semánticos).
- [ ] Componente `components/admin/blog/blog-form.tsx` (formulario con editor WYSIWYG, upload Cloudinary, validación Zod en tiempo real).
- [ ] Página `/app/(dashboard)/admin/blog/page.tsx` (listado con búsqueda y filtros).
- [ ] Página `/app/(dashboard)/admin/blog/new/page.tsx` (creación).
- [ ] Página `/app/(dashboard)/admin/blog/[id]/edit/page.tsx` (edición).
- [ ] Notificaciones con `sonner` y modal de confirmación antes de eliminar o cambiar estado.

### Fase 4: Frontend Público (`ISSUE-157.4`)
- [ ] Componente `components/cards/blog-card.tsx` (tarjeta de artículo en galería con badges y fechas).
- [ ] Componente `components/blog/blog-filters.tsx` (buscador, selector de tags y ordenamiento sincronizado con URL).
- [ ] Componente `components/blog/blog-gallery.tsx` (grid responsive con paginación y estado vacío).
- [ ] Componente `components/blog/blog-toc.tsx` (tabla de contenidos automática según encabezados `<h2>`, `<h3>`).
- [ ] Componente `components/blog/blog-related.tsx` (tarjetas de artículos relacionados).
- [ ] Página `/app/(public)/blog/page.tsx` (galería pública con metadata SEO).
- [ ] Página `/app/(public)/blog/[slug]/page.tsx` (artículo completo, breadcrumbs, OpenGraph tags, JSON-LD estructurado).
- [ ] Enlace en Navbar / Footer hacia `/blog`.

### Fase 5: QA, Verificación y Cierre (`ISSUE-157.5`)
- [ ] Verificación de tipos TypeScript (`npm run type-check` o build sin errores).
- [ ] Verificación de linter (`npm run lint`).
- [ ] Ejecución de tests (`npm test`).
- [ ] Validación de accesibilidad y contraste WCAG AA en temas claro y oscuro.
- [ ] Actualización documental:
  - `CHANGELOG.md` (entrada estructurada con hash, scope e `ISSUE-157`).
  - `CONTEXT.md` (modelo BlogPost y nuevas rutas).
  - `DEV_NOTES.md` (elección de editor rich text y sanitización).

---

## 7. 🎯 Acceptance Criteria

### Panel Administrativo
- [ ] Solo usuarios con rol `ADMIN` pueden acceder a `/admin/blog` y a las rutas `/api/admin/blog/*`.
- [ ] Listado tabular muestra: Título, Autor, Estado (`DRAFT`, `PUBLISHED`, `ARCHIVED`), Vistas, Fecha de creación/publicación y Acciones.
- [ ] Búsqueda reactiva por título y filtrado por estado.
- [ ] Formulario de creación/edición valida obligatoriamente título, extracto, contenido y tags (máximo 5).
- [ ] Subida de imagen destacada integrada con Cloudinary con preview inmediato.
- [ ] Slug generado automáticamente a partir del título con validación de colisión y unicidad.
- [ ] Feedback visual claro con toasts (`sonner`) tras guardar borrador, publicar o eliminar.

### Galería Pública
- [ ] Grid responsive (3 columnas en desktop, 2 en tablet, 1 en mobile) que solo muestra artículos en estado `PUBLISHED`.
- [ ] Filtros por tags y orden (más recientes, más vistos) reflejados en URL search params.
- [ ] Paginación funcional (10 artículos por página) con estado vacío informativo si no hay resultados.

### Vista de Artículo
- [ ] Renderizado seguro de HTML sanitizado (sin riesgo XSS).
- [ ] Metadata dinámica de Next.js con Open Graph (`og:title`, `og:image`, `og:description`) y datos estructurados Schema.org Article.
- [ ] Tabla de contenidos interactiva que resalta la sección activa al hacer scroll.
- [ ] Contador de lecturas/vistas incrementado de forma confiable.
- [ ] Artículos relacionados relevantes basados en coincidencias de tags.

### Calidad Técnica
- [ ] Cumplimiento total de `.rules.md`: cero `any`, cero `as any`, comillas dobles, 2 espacios de indentación, JSDoc de cabecera y notas de pie de página en cada archivo nuevo.
- [ ] Sin consultas directas a Prisma desde componentes de cliente ni vistas UI.

---

## 8. 🔧 Tech Spec

### Modelo de Datos (Prisma MongoDB)

```prisma
model BlogPost {
  id          String    @id @default(auto()) @map("_id") @db.ObjectId
  title       String
  slug        String    @unique
  excerpt     String
  content     String    // HTML sanitizado
  featured    String?   // URL Cloudinary de imagen de portada
  status      String    @default("DRAFT") // DRAFT | PUBLISHED | ARCHIVED
  author      User      @relation(fields: [authorId], references: [id])
  authorId    String    @db.ObjectId
  tags        String[]
  views       Int       @default(0)
  publishedAt DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([status])
  @@index([publishedAt])
  @@index([createdAt])
}
```

*Nota: Agregar relación inversa en modelo `User`: `blogPosts BlogPost[]`.*

### Estructura de Directorios

```
app/
├── (dashboard)/admin/blog/
│   ├── page.tsx
│   ├── new/page.tsx
│   └── [id]/edit/page.tsx
├── (public)/blog/
│   ├── page.tsx
│   └── [slug]/page.tsx
└── api/
    ├── admin/blog/
    │   ├── route.ts
    │   ├── [id]/route.ts
    │   └── [id]/publish/route.ts
    └── blog/
        ├── route.ts
        ├── [slug]/route.ts
        ├── tags/route.ts
        └── related/[slug]/route.ts

components/
├── admin/blog/
│   ├── blog-table.tsx
│   ├── blog-form.tsx
│   └── blog-list-client.tsx
└── blog/
    ├── blog-gallery.tsx
    ├── blog-card.tsx
    ├── blog-filters.tsx
    ├── blog-toc.tsx
    └── blog-related.tsx

lib/
├── services/blog.service.ts
└── validations/blog.schema.ts
```

---

## 9. 🛡️ Criterios de Validación y Auditoría (§4 & §5)

Para superar los gates de aprobación de `@asebasg`:

1. **Gate de Trazabilidad:** Todo commit cita `ISSUE-157` o sus sub-issues. El PR cita `Closes #157`.
2. **Gate Anti-Jules (§4.3):** Ningún ítem de Acceptance Criteria se marca como completado sin verificación explícita en código y tests ejecutados localmente.
3. **Gate de Evidencia (§4.7):** Se adjuntarán capturas y logs de requests antes de solicitar review del PR.
4. **Gate de Cierre (§4.6):** Actualizar `CHANGELOG.md`, `CONTEXT.md` y `DEV_NOTES.md` antes de mergear.
