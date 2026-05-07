# Detalles Técnicos de Desarrollo — PawLig

## Selección y visualización de edad (Años y Meses) (v1.8.3 — 07-05-2026)

Se implementó la capacidad de especificar la edad de las mascotas de forma más precisa, permitiendo ingresar tanto años como meses. Esto mejora la gestión de cachorros y la información disponible para los adoptantes.

**Archivos modificados:**

- `prisma/schema.prisma` — Adición del campo `months` (Int?) al modelo `Pet`.
- `lib/validations/pet.schema.ts` — Actualización de esquemas Zod para validar el rango de meses (0-11).
- `lib/utils/age-formatter.ts` — Nueva utilidad para formatear la edad en español (ej: "1 año y 2 meses", "6 meses").
- `components/forms/pet-form.tsx` — Integración de campos de años y meses en el formulario de gestión.
- `components/cards/pet-card.tsx`, `components/cards/shelter-pet-card.tsx`, `components/PetDetailClient.tsx` — Actualización de la visualización de edad usando la nueva utilidad.
- `app/api/pets/route.ts`, `app/api/pets/[id]/route.ts` — Actualización de los endpoints CRUD para soportar el campo `months`.
- `lib/services/pet.service.ts` — Inclusión de `months` en las consultas de Prisma.

---

## Configuración de Entorno de Pruebas (v1.5.0 — 20-02-2026)

### Correcciones en Vitest + Radix UI

Se resolvieron incompatibilidades entre Radix UI y JSDOM que impedían la ejecución correcta del ciclo test/build/start.

**Archivos modificados:**

- `vitest.setup.ts` — Polyfills añadidos: `PointerEvent`, `ResizeObserver` y métodos de `HTMLElement`.
- `app/(dashboard)/admin/users/[id]/view/__tests__/user-view.spec.tsx` — Refactorización para soportar componentes Radix Select.
- `vitest.config.ts` — Configuración del entorno de pruebas.
- `vitest.setup.ts` — Setup inicial.

---

## Corrección CSS: Botón nativo de contraseña en Chromium (v1.8.0 — 28-04-2026)

Se añadieron reglas CSS para ocultar el botón nativo de revelación de contraseña en navegadores basados en Chromium (Edge/IE), evitando duplicación con el icono personalizado del componente `PasswordInput`.

**Selectores usados:** `::-ms-reveal`, `::-ms-clear`

**Archivo modificado:** `app/globals.css`

---

## Revalidación de Rutas tras Acciones Administrativas (v1.7.1 — 24-04-2026)

Se implementó `revalidatePath` de Next.js en el endpoint de bloqueo/desbloqueo de usuarios para invalidar la caché de la página y sincronizar la UI automáticamente, sin requerir recarga manual.

**Archivo modificado:** `app/api/admin/users/[id]/block/route.ts`

---

## Sistema de Email: Envíos No Bloqueantes (v1.7.0 — 24-04-2026)

Los envíos de correo se implementaron como operaciones no bloqueantes usando `.catch()` en lugar de `await`, para evitar que un fallo en Resend afecte la respuesta de la API.

El endpoint `/forgot-password` siempre retorna `200 OK` para prevenir enumeración de emails.

Los tokens de recuperación expiran en 1 hora e invalidan tokens previos al emitir uno nuevo.

**Modelo añadido a Prisma:** `PasswordResetToken`

---

## Corrección del Filtro de Sexo — Inconsistencia de Valores (30-12-2025)

**Bug:** Los valores del filtro (`'M'`/`'F'`) no coincidían con los almacenados en la base de datos (`'Macho'`/`'Hembra'`).

**Solución:**

- `components/filters/pet-filters.tsx` — Valores actualizados a `'Macho'`/`'Hembra'`.
- `lib/services/pet.service.ts` — Casteo del parámetro `sex` al enum `Sex` de Prisma; tipado del objeto `where` con `Prisma.PetWhereInput`.

---

## Configuración Inicial de Vitest (30-12-2025)

Se configuró el entorno de testing con Vitest e instalaron dependencias de desarrollo para pruebas unitarias.

**Dependencias añadidas:** `vitest`, `@vitest/coverage-v8`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`, `@vitejs/plugin-react`, `vite-tsconfig-paths`

**Archivos creados:** `vitest.config.ts`, `vitest.setup.ts`

---

## Configuración de Git — Exclusión de Archivos de Agentes IA (29-12-2025)

Se añadió `.agent/` al `.gitignore` para excluir archivos generados por herramientas de desarrollo asistidas por IA.

---

## Cloudinary — Configuración Condicional en Build Time

La configuración de Cloudinary debe ser condicional para evitar fallos durante el proceso de construcción (`next build`).

**Referencia:** `.rules.md` — Sección de Mejores Prácticas.

---

## Suppression de Hydration Warning

El elemento `<html>` en `app/layout.tsx` debe incluir `suppressHydrationWarning` para compatibilidad con `next-themes`.

**Referencia:** `.rules.md` — Sección UI/UX y Accesibilidad.

---

## Refactorización de Endpoints de Adopción (28-11-2025)

Se renombraron y reorganizaron rutas de API para mayor consistencia:

- Eliminado: `app/api/adopter/adoptions/route.ts`
- Creado: `app/api/user/adoptions/route.ts`

---

## Restricción de Adopciones por Tipo de Usuario (28-11-2025)

Se añadió validación en el endpoint de adopciones para restringir solicitudes únicamente a usuarios con rol `ADOPTER`.

**Archivo modificado:** `app/api/adopter/adoptions/route.ts`

---

## Limpieza de Documentación Interna (28-11-2025)

Se eliminaron archivos de documentación de pull requests del directorio `documentation/pull-request/` para mantener el repositorio limpio.
