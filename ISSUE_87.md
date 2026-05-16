title:	[BUG] - Inconsistencia Crítica en Definición y Persistencia de Categorías de Productos
state:	OPEN
author:	asebasg (Sebastián Ospina)
labels:	bug
comments:	0
assignees:	asebasg (Sebastián Ospina)
projects:	
milestone:	
number:	87
--
## 🐛 Bug

**Descripción:**

Se ha identificado una deuda técnica crítica en el manejo de las categorías de productos (`Product.category`). Actualmente no existe una fuente única de verdad (SSOT), lo que ha resultado en una fragmentación lógica severa entre la base de datos, el formulario de creación y los filtros de búsqueda.

**Reproducir:**

1.  Ingresar como Vendedor y crear un producto seleccionando la categoría "Accesorios" (el formulario envía `accesorios` en minúsculas).
2.  Ir al catálogo público (`/productos`).
3.  Intentar filtrar por categoría. "Accesorios" no aparece en la lista de filtros disponibles.
4.  Intentar filtrar por "Juguetes". El filtro envía `JUGUETES` (mayúsculas), mientras que la base de datos tiene `juguetes` (minúsculas), resultando en cero coincidencias.

**Esperado vs Actual:**

- **Esperado:** Las categorías deben estar tipadas estrictamente mediante un `Enum` desde el esquema de base de datos hasta la interfaz de usuario. El guardado y el filtrado deben compartir las mismas constantes.
- **Actual:** Cadenas de texto "mágicas" (magic strings) dispersas por el código, con diferentes formatos (casing) y listas de opciones desincronizadas entre componentes.

---

## 📋 Metadata

**Status:**

- [x] 📋 Todo (no iniciado)
- [ ] 🔄 En Progreso (trabajando activamente)
- [ ] 👀 En Revisión (para ser aprobado)
- [ ] ✅ Finalizado (completado)

**Priority:**

- [x] P1 - Alto (Funcionalidad principal de búsqueda rota e inconsistencia de datos)

**Size (Story Points):**

- [x] M (2-4h - requiere migración de esquema y refactorización de múltiples componentes)

**Archivos afectados:**

- `prisma/schema.prisma`
- `lib/constants.ts`
- `lib/validations/product.schema.ts`
- `components/forms/product-form.tsx`
- `components/filters/product-filter.tsx`
- `components/cards/product-card.tsx`

---

## ✅ TODO

### Arquitectura & DB

- [ ] **Definir Enum en Prisma:** Crear `enum ProductCategory` en `schema.prisma` con valores estandarizados: `ALIMENTO`, `JUGUETES`, `ACCESORIOS`, `HIGIENE`, `MEDICAMENTOS`, `OTROS`.
- [ ] **Migrar Modelo:** Cambiar el tipo de `Product.category` de `String` a `ProductCategory`.
- [ ] **Generar Cliente:** Ejecutar `npx prisma generate`.

### Lógica de Negocio & Tipado

- [ ] **Centralizar Constantes:** Crear `PRODUCT_CATEGORIES` en `lib/constants.ts` con etiquetas legibles para el UI (ej. `ALIMENTO: "Alimento"`).
- [ ] **Actualizar Validaciones:** Refactorizar `product.schema.ts` para validar contra el `nativeEnum` de Prisma.

### UI/UX Refactor

- [ ] **Refactorizar Formulario:** Eliminar opciones hardcodeadas en `product-form.tsx` y usar la nueva constante centralizada.
- [ ] **Comentarios**: Descomenta la lógica funcional o elimina el código comentado irrelevante, prestando especial atención a la lógica de error del filtro. La única excepción son los checkboxes comentados en la parte inferior, que pertenecen a la configuración de la interfaz del selector de categorías y deben mantenerse como están si no se utilizan.
- [ ] **Refactorizar Filtros:** Sincronizar `product-filter.tsx` para usar las mismas categorías y asegurar la inclusión de "Accesorios".
- [ ] **Refactorizar Cards:** Asegurar que la visualización de la categoría en `product-card.tsx` use los labels legibles.

### QA

- [ ] Validar flujo: Crear (Vendedor) -> Visualizar (Catálogo) -> Filtrar (Usuario).
- [ ] Limpiar/Migrar registros de prueba existentes en la base de datos local.

---

## 🔍 Contexto

**Entorno:**

- OS: win32
- Runtime: Node.js / Next.js 14
- DB: MongoDB (vía Prisma)

**Impacto:**

- Usuarios afectados: Todos (vendedores y compradores).
- Workaround disponible: [ ] Sí [x] No (la búsqueda por categoría es una funcionalidad core).

---

**Para Jules:** Implementa esta refactorización siguiendo las normas de `@.rules.md`. Prioriza la seguridad de tipos y la eliminación de cadenas hardcodeadas. Asegúrate de que tanto el frontend como el backend hablen el mismo idioma (el Enum de Prisma).

