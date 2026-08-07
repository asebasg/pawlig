# Detalles Técnicos de Desarrollo — PawLig

## Alta Manual de Usuarios y Auditoría Administrativa (v1.8.0 — 21-06-2026)

Implementación del flujo de alta manual de usuarios para administradores. Permite la creación de cuentas sin inicio de sesión automático y con contraseñas seguras autogeneradas en el servidor, garantizando la trazabilidad de las acciones administrativas mediante el registro automático en el Moderation Hub.

**Archivos creados/modificados:**

- `app/(dashboard)/admin/moderation/users/create/page.tsx` — Server Component protegido con control de acceso (session + rol ADMIN) para el formulario de creación.
- `components/forms/create-user-form.tsx` — Formulario interactivo en el cliente para el alta de usuarios con soporte de justificaciones y modales de confirmación.
- `app/api/admin/users/route.ts` — Endpoint POST seguro para procesar la creación, hasheo de contraseñas y registro de auditoría.
- `lib/services/user.service.ts` — Inclusión del método `createUserByAdmin` utilizando una transacción interactiva de Prisma.
- `lib/validations/user.schema.ts` — Esquema Zod `createUserByAdminSchema` con regla de refinamiento de justificación obligatoria.
- `lib/auth/password.ts` — Agregado `generateTempPassword` para la generación de contraseñas seguras y legibles.
- `lib/validations/user.schema.test.ts`, `app/api/admin/users/route.test.ts`, `lib/services/user.service.spec.ts`, `lib/auth/password.test.ts` — Cobertura de pruebas unitarias y de integración para todo el flujo.

**Detalles Técnicos:**

- **Validación con Refinamientos Zod:** El esquema de creación administrativa implementa una validación raíz condicional. Cuando el rol asignado al usuario es diferente a `ADOPTER` (tales como `ADMIN`, `SHELTER`, `VENDOR`), se exige obligatoriamente un campo `reason` (justificación) con un mínimo de 10 caracteres. Esto asegura la justificación de los privilegios asignados.
- **Transacción Interactiva y Atomicidad:** El servicio `createUserByAdmin` encapsula el alta del registro en la colección `User` y la bitácora en `SystemAuditLog` dentro de una transacción interactiva de Prisma (`prisma.$transaction(async (tx) => ...)`). Esto permite recuperar el ID autogenerado del nuevo usuario e inyectarlo de forma segura como `resourceId` en el log de auditoría antes de consolidar la operación.
- **Generación de Contraseña Segura:** La contraseña temporal se genera mediante `crypto.randomBytes(16)` formateada a base64 (removiendo caracteres confusos) y limitándola a 12 caracteres. Posteriormente se hashea utilizando `bcryptjs` con 12 rondas de sal, garantizando el almacenamiento cifrado y seguro de las credenciales.
- **Auditoría e Integración de IA:** En el formulario, los administradores cuentan con el botón `AiRefineButton` integrado en el campo de justificación. Esto permite refinar y formatear formalmente el texto de justificación utilizando IA (Gemini) antes de enviarlo. El SystemAuditLog registra la acción como `CREATE` bajo la categoría `USER_MANAGEMENT`, guardando los metadatos de IP, User-Agent, y el payload de cambios en los campos `before` (null) y `after` (email y rol creados).
- **Caché y Revalidación:** Tras un alta exitosa, se invalida el tag de caché `user-detail` (`revalidateTag("user-detail")`) asegurando que los listados y las vistas administrativas se actualicen inmediatamente sin necesidad de recargas manuales de página.

---

## Seguridad en Multimedia y Ciclo de Solicitudes (v1.14.0 — 12-06-2026)

Mejoras críticas de seguridad y control de propiedad de imágenes en Cloudinary y corrección en el reenvío de formularios de solicitud de cuentas comerciales/refugios.

**Archivos creados/modificados:**

- `app/api/cloudinary/delete/route.ts` — Endpoint centralizado para la eliminación segura de imágenes con control RBAC.
- `lib/cloudinary.ts` — Agregado `extractPublicId` y el método `deleteImagesFromCloudinary` para borrado en lote no bloqueante.
- `app/api/upload/route.ts` — Eliminación del handler DELETE obsoleto y no seguro.
- `app/api/user/request-shelter-account/route.ts` — Corrección de validación lógica para permitir reenvíos tras denegación de cuenta.
- `app/api/user/request-vendor-account/route.ts` — Corrección de validación lógica para permitir reenvíos tras denegación de cuenta.
- `components/forms/pet-form.tsx` — Modificación para interactuar con el endpoint seguro de Cloudinary.
- `components/forms/product-form.tsx` — Modificación para interactuar con el endpoint seguro de Cloudinary.
- `lib/validations/cloudinary.schema.ts` — Validación Zod para el borrado seguro.

**Detalles Técnicos:**

- **Control de Propiedad RBAC**: Se implementó la verificación de propiedad para SHELTER, VENDOR y ADOPTER a través de búsquedas dinámicas en Prisma. El endpoint asegura que un usuario solo pueda eliminar imágenes que le pertenecen (por ejemplo, mascotas pertenecientes al albergue asociado). Los administradores están exentos de esta verificación para fines de moderación global.
- **Seguridad en API de Carga**: Se removió el handler DELETE en `/api/upload` que permitía eliminar recursos arbitrariamente sin control de sesión. Ahora todo flujo de eliminación multimedia debe consumir `/api/cloudinary/delete`.
- **Desbloqueo de Solicitudes (ISSUE-139)**: Se corrigió la regla restrictiva que buscaba cualquier registro previo de solicitud en base de datos. Ahora la validación solo bloquea la creación si existe una solicitud activa en estado `PENDING` o `APPROVED`, permitiendo que usuarios con solicitudes previas `REJECTED` puedan corregir errores y reenviar el formulario.
- **Borrado en Lote Silencioso**: `deleteImagesFromCloudinary` utiliza `Promise.allSettled` permitiendo que fallas individuales en la API de Cloudinary no detengan la limpieza del lote restante, optimizando el rendimiento.

---

## Moderation Hub: Refactorización de Rutas y Componentes (v1.13.1 — 25-05-2026)

Consolidación de la gestión de usuarios dentro del Moderation Hub, eliminando la sección independiente y unificando todas las operaciones administrativas bajo `/admin/moderation/*`.

**Archivos creados/modificados:**

- `lib/constants.ts` — Nuevos enlaces de navegación del Moderation Hub (`/admin/moderation/users`, `/admin/moderation/shelters`, etc.).
- `components/admin/BlockUserButton.tsx` — Actualizado para referenciar la nueva ruta del modal de moderación.
- `components/admin/EditUserButton.tsx` — Actualizado para reflejar las nuevas rutas de moderación.
- `components/admin/AdminDashboardClient.tsx` — Eliminado el enlace independiente de gestión de usuarios; ahora apunta al hub.
- `app/(dashboard)/admin/profile/page.tsx` — Enlace actualizado a `/admin/moderation/users`.
- `app/api/admin/moderation/shelters/route.ts` & `vendors/route.ts` — Filtrado por estado (`PENDING`, `APPROVED`, `REJECTED`) para gestión granular.
- `app/api/admin/users/[id]/block/route.ts` — Rutas actualizadas para reflejar la nueva arquitectura de moderación.
- `components/admin/moderation/UserRoleLimitSelect.tsx` — Nuevo componente de selección para filtros de rol y límite en la vista de usuarios.
- `package.json` — Actualización de `@prisma/client` y `prisma` a `6.19.3`.

**Detalles Técnicos:**

- **Eliminación de Duplicidad**: Los componentes `BlockUserModal` y `UsersManagementClient` fueron removidos al quedar su funcionalidad absorbida por los componentes del Moderation Hub (`shelter-moderation-client.tsx`, `vendor-moderation-client.tsx`).
- **Filtrado por Estado en API**: Los endpoints de listado de albergues y vendedores ahora aceptan un parámetro `status` para filtrar por `PENDING`, `APPROVED` o `REJECTED`, permitiendo vistas segmentadas en el hub.
- **Selector de Filtros Reutilizable**: `UserRoleLimitSelect` implementado como componente controlado con `useSearchParams` para sincronizar el estado de filtros con la URL, compatible con el estándar de `<Suspense>` del App Router.
- **Compatibilidad Prisma 6.19.3**: Actualización de dependencias para aprovechar mejoras de rendimiento y compatibilidad con MongoDB Atlas.

---

## Moderation Hub Integrado — Control Centralizado y Auditoría (v1.13.0 — 25-05-2026)

Implementación del módulo de moderación centralizado para administradores que permite gestionar las solicitudes de albergues y vendedores (negocios), manteniendo un historial de auditoría del sistema completo y seguro.

**Archivos creados/modificados:**

- `prisma/schema.prisma` — Adición del modelo `SystemAuditLog` y los enums `AuditCategory` y `AuditAction`.
- `lib/services/moderation.service.ts` — Lógica de negocio orquestada con transacciones de Prisma para el flujo de aprobación y rechazo de solicitudes.
- `lib/services/__tests__/moderation.service.spec.ts` — Pruebas unitarias para validar las operaciones y auditorías del servicio de moderación.
- `app/api/admin/moderation/shelters/route.ts` & `[id]/route.ts` — Endpoints RESTful para la gestión y listado de solicitudes de albergues.
- `app/api/admin/moderation/vendors/route.ts` & `[id]/route.ts` — Endpoints RESTful para la gestión y listado de solicitudes de vendedores.
- `app/api/admin/moderation/audit/route.ts` — Endpoint para el listado paginado y filtrado de la bitácora de auditoría.
- `app/(dashboard)/admin/moderation/page.tsx` — Página principal del Moderation Hub con menú de pestañas.
- `components/admin/shelter-moderation-client.tsx` — Componente cliente para visualización y acciones sobre albergues.
- `components/admin/vendor-moderation-client.tsx` — Componente cliente para visualización y acciones sobre vendedores.
- `components/admin/audit-log-viewer.tsx` — Componente interactivo para el visor de la bitácora de auditoría.

**Detalles Técnicos:**

- **Auditoría Polimórfica:** Diseño del modelo `SystemAuditLog` en Prisma para almacenar eventos de auditoría a nivel de sistema. Admite relaciones lógicas variables con usuarios, albergues o vendedores mediante campos de ID genéricos (`targetId`), categoría (`AuditCategory`) y acción (`AuditAction`).
- **Transacciones Robustas en Prisma:** Aprobaciones de solicitudes empaquetadas en `prisma.$transaction`. Esto garantiza que los cambios de estado (e.g. `User.role` a `SHELTER` o `VENDOR`, y `Shelter.status` o `Vendor.status` a `APPROVED`) y la inserción del log de auditoría se realicen de forma atómica.
- **Notificaciones Asíncronas No Bloqueantes:** El envío de notificaciones por correo electrónico (Resend) tras la decisión del administrador se realiza de forma asíncrona, evitando bloquear la respuesta de la transacción en la API y permitiendo tolerancia ante fallos del proveedor de email.
- **Compatibilidad con Suspense:** Todos los componentes cliente (`shelter-moderation-client.tsx`, `vendor-moderation-client.tsx`, `audit-log-viewer.tsx`) que consumen parámetros de búsqueda dinámicos están envueltos en componentes `<Suspense>` para cumplir estrictamente con los estándares de hidratación del Next.js App Router.

---

## Dashboard del Administrador y Enlaces de Gestión (v1.13.0 — 23-05-2026)

Implementación del panel de control centralizado para administradores con validación de seguridad de servidor y accesos directos para la administración del sistema.

**Archivos creados/modificados:**

- `app/(dashboard)/admin/page.tsx` — Página de servidor para la validación de rol administrativo y renderizado del dashboard.
- `components/admin/AdminDashboardClient.tsx` — Interfaz interactiva de administración con accesos a moderación, usuarios, métricas y desarrollo.

**Detalles Técnicos:**

- **Control de Acceso Seguro:** Validación de la sesión en el servidor con NextAuth (`getServerSession`) y doble verificación del rol `ADMIN` en la base de datos de Prisma, redirigiendo a los usuarios no autorizados de forma segura.
- **UI Modular del Administrador:** Grid de accesos rápidos con componentes de tarjetas (`Card`) interactivos para las áreas críticas de Moderación, Usuarios, Métricas y enlaces técnicos.
- **Acceso a Desarrollo y Repositorio:** Integración directa en el panel de enlaces al repositorio de GitHub del proyecto y a la página interna de Notas de Desarrollo.

---

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
