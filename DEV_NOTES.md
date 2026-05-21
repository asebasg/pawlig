# Detalles Técnicos de Desarrollo — PawLig

## Auditoría Técnica y Documentación del Proyecto (v1.12.0 — 21-05-2026)

Evaluación exhaustiva de la base de código y actualización de la documentación técnica para reflejar la estructura reciente y medir el progreso del desarrollo.

**Archivos creados/modificados:**

- `CONTEXT.md` — Actualización con dependencias y estructura reciente del proyecto.
- `monthly-updates.md` — Creación del registro de actualizaciones mensuales (enero-mayo 2026).
- `README.md` — Actualización general de versión y fechas.
- `.gitignore` — Actualización con nuevas carpetas y archivos.

**Detalles Técnicos:**

- **Auditoría:** Realización de una evaluación comparativa para identificar brechas funcionales y técnicas en persistencia de órdenes, gestión de categorías y despliegue.
- **Métricas:** Generación de herramientas de control de gestión para seguimiento de tareas pendientes y *story points*.

---

## Estandarización y Tipado en Gestión de Productos (v1.11.0 — 16-05-2026)

Mejora de la robustez del sistema de gestión de productos mediante tipado estricto de categorías y estandarización de la documentación interna bajo el "Estándar de Oro".

**Archivos modificados:**

- `app/(dashboard)/vendor/products/page.tsx` — Refactorización de la lógica de filtrado y validación de acceso para vendedores.
- `app/(public)/productos/[id]/page.tsx` — Estandarización de documentación y mejora en la carga de productos similares.

**Detalles Técnicos:**

- **Tipado Estricto de Búsqueda:** Se implementó una validación dinámica para el parámetro `categoryId` en el buscador de productos, utilizando `Object.values(ProductCategory)` para asegurar que solo se procesen categorías válidas de la base de datos.
- **Validación en Cascada:** Optimización del flujo de seguridad en el panel de vendedor, implementando 4 niveles de verificación (Auth -> Rol -> VendorId -> Verified) con redirecciones semánticas.
- **Estandarización:** Aplicación exhaustiva de la guía de estilo PawLig, incluyendo bloques JSDoc de cabecera y Notas de Implementación detalladas en el pie de página para mejorar la mantenibilidad por agentes de IA y humanos.
- **Bug Fix:** Corrección de inconsistencias en el casteo de tipos de filtros que podían causar fallos silenciosos en las consultas de Prisma.

---

## Sistema de Métricas y Mapa Interactivo (v1.10.0 — 15-05-2026)

Implementación de un sistema analítico completo para administradores, vendedores y refugios, acompañado de una capa geoespacial para la localización de albergues.

**Archivos creados/modificados:**

- `lib/services/vendor-metrics.service.ts` — Lógica de negocio agregada y optimizada para el cálculo de métricas de ventas y adopciones.
- `components/map/interactive-map.tsx` — Motor de visualización de mapas basado en coordenadas.
- `lib/services/geocoding.service.ts` — Servicio para normalización de direcciones.
- `lib/utils/export-csv.ts`, `export-excel.ts`, `export-pdf.ts` — Utilidades para la generación de reportes multiplataforma.

**Detalles Técnicos:**

- **Métricas**: Implementación de servicios dedicados con queries optimizadas en Prisma. Uso de agregaciones para tendencias y ventas en tiempo real.
- **Geocodificación**: Implementación de un script de normalización (`scripts/geocode-shelters.ts`) que procesa direcciones y las convierte en coordenadas geográficas.
- **Exportación**: Implementación de endpoints de API asíncronos que manejan buffers de datos para la generación de archivos exportables, minimizando el impacto en el hilo principal del servidor.
- **Seguridad**: Validación de roles (Admin, Shelter, Vendor) en cada endpoint de métricas y exportación para restringir acceso a la información confidencial.

---

## Sistema de Gestión de Postulaciones (v1.9.0 — 11-05-2026)

Implementación del flujo completo de gestión de adopciones, centralizando la lógica de negocio en servicios y asegurando tipado estricto en toda la capa de API.

**Archivos creados:**

- `types/adoption.ts` — Definición de tipos estricta (ShelterAdoption, UserAdoption) basada en Prisma Payloads.
- `components/shelter/adoptions/` — Suite de componentes modulares para gestión de postulaciones.

**Detalles Técnicos:**

- **Arquitectura**: Delegación total de lógica de negocio a `adoption.service.ts`. Uso de transacciones atómicas de Prisma para asegurar consistencia entre el estado de la mascota y las postulaciones.
- **Tipado**: Cero `any` mediante uso de `Prisma.AdoptionGetPayload`.
- **Automatización**:
  - Transición automática: `AVAILABLE` -> `IN_PROCESS` al aprobar.
  - Rechazo masivo: Cierre automático de postulaciones pendientes al aprobar una solicitud.
- **Seguridad**: Validación estricta con Zod y tipado seguro en bloques `catch` mediante `unknown` e `instanceof Error`.

---

Se rediseñó la página de error 404 integrando una experiencia visual inmersiva basada en un sistema solar 3D. La implementación utiliza un motor de renderizado custom sobre Canvas 2D que simula órbitas keplerianas para los íconos de la marca.

**Archivo modificado:**

- `app/not-found.tsx` — Implementación integral del motor orbital, lógica de proyección 3D y UI de recuperación.

**Detalles Técnicos:**

- **Física Orbital:** Implementación de la Ley de Áreas de Kepler para variar la velocidad orbital según la excentricidad de la elipse.
- **Proyección 3D:** Uso de proyección paralela con compresión en el eje Y (0.4x) para simular profundidad isométrica.
- **Oclusión Dinámica:** Clasificación de profundidad (Z-index) para renderizar íconos por delante o detrás del cuerpo central ("404").
- **Optimización:** Gestión de ciclo de vida del canvas con `requestAnimationFrame` y manejo reactivo del `resize`.

---

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
