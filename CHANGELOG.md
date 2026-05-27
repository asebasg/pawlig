# CHANGELOG.md

## Registro de Cambios del Proyecto PawLig

---

## 25-05-2026 - Moderation Hub: Refactorización de Rutas y Componentes (v1.13.1)

**Commit:** `6239ec2`
**Tipo:** Refactor
**Scope:** admin, moderation

### Descripción

Refactorización del módulo de moderación para consolidar la gestión de usuarios directamente en el Moderation Hub, eliminando la sección independiente de gestión de usuarios y unificando todas las operaciones administrativas bajo `/admin/moderation/*`.

### Cambios

- **Rutas Unificadas**: El enlace del perfil de administrador ahora apunta a `/admin/moderation/users`. Eliminada la página independiente de gestión de usuarios.
- **Componentes Eliminados**: `BlockUserModal` y `UsersManagementClient` removidos al quedar absorbidos por el hub.
- **API de Moderación Mejorada**: Los endpoints de albergues y vendedores ahora filtran por estado (`PENDING`, `APPROVED`, `REJECTED`) para una gestión más granular.
- **Constantes Actualizadas**: `lib/constants.ts` incluye los nuevos enlaces de navegación del Moderation Hub.
- **Botones Refactorizados**: `BlockUserButton` y `EditUserButton` actualizados para referenciar las nuevas rutas de moderación.
- **Selector de Filtros**: Nuevo componente de selección para filtros de rol y límite de usuarios en la vista de moderación.
- **Prisma Actualizado**: Versiones de `@prisma/client` y `prisma` actualizadas a `6.19.3`.

---

## 25-05-2026 - Creación del Moderation Hub Integrado (v1.13.0)

**Commit:** `0e4dfd8`
**Tipo:** Feature
**Scope:** admin, moderation

### Descripción

Implementación del módulo unificado **Moderation Hub** bajo el segmento de rutas `/admin/moderation/*` (`/shelters`, `/vendors` y `/audit`). Este módulo centraliza las vistas y operaciones de administración para revisar, aprobar o declinar solicitudes de albergues y negocios/vendedores de manera transaccional, consolidando un registro de auditoría polimórfico persistente en base de datos.

### Mejoras

- **Aprobaciones/Rechazos Transaccionales**: Uso de Prisma transactions para aprobar solicitudes y actualizar el rol del usuario simultáneamente.
- **Registro de Auditoría Polimórfico**: Nuevo modelo `SystemAuditLog` para rastrear los cambios en albergues, negocios y usuarios.
- **Visor de Auditoría (Audit Log Viewer)**: Interfaz interactiva y paginada para consultar los eventos y operaciones realizadas por los administradores.
- **Flujos de Notificación y Email**: Integración con servicios de correo electrónico para notificar de forma asíncrona la aprobación o declinación con sus respectivos motivos.

---

## 21-05-2026 - Planificación y Estabilidad de la Plataforma (v1.12.0)

**Commit:** `c7334a8`
**Tipo:** Mantenimiento y Estabilidad
**Scope:** plataforma, soporte

### Descripción

Revisión general de la plataforma para optimizar la velocidad de carga y asegurar la estabilidad de las secciones principales. Además, se actualizó el portal de soporte y las guías de ayuda al usuario.

### Mejoras

- **Optimización y Estabilidad**: Evaluación del rendimiento de la plataforma para asegurar una navegación fluida y sin interrupciones en los servicios de adopción y tienda.
- **Centro de Soporte Actualizado**: Mejoras en la documentación interna de ayuda para resolver dudas frecuentes de forma más rápida.
- **Preparación de Próximas Funciones**: Estructuración técnica de cara a futuros lanzamientos y mejoras operativas.

---

## 16-05-2026 - Mejoras de Búsqueda y Seguridad en Tienda (v1.11.0)

**Commit:** `9883d7e`
**Tipo:** Mejora de Experiencia y Seguridad
**Scope:** tienda, seguridad

### Descripción

Optimización de las funciones de búsqueda en el marketplace de mascotas y refuerzo en las medidas de seguridad del panel de tiendas asociadas.

### Mejoras

- **Búsqueda Precisa**: Ajustes en el motor de búsqueda de productos para garantizar que las categorías muestren resultados exactos e instantáneos.
- **Seguridad en Cuentas**: Fortalecimiento de los accesos y controles de seguridad para vendedores y comercios aliados en su panel de administración.
- **Diseño de Productos**: Refinamientos visuales en las páginas de productos para mejorar la lectura y visualización de la información.

---

## 15-05-2026 - Sistema de Métricas y Mapa Interactivo (v1.10.0)

**Commit:** `#126`
**Tipo:** Feature
**Scope:** metrics, map, shelter, vendor, admin

### Descripción

Implementación de un avanzado sistema de métricas y reportes para administradores, refugios y vendedores, junto con una nueva funcionalidad de mapa interactivo para facilitar la localización de albergues.

### Nuevas Funcionalidades

- **Dashboard de Métricas**: Paneles analíticos para vendedores (ventas, productos, tendencias) y refugios (adopciones).
- **Reportes Exportables**: Funcionalidad para exportar datos estadísticos a formatos CSV, Excel y PDF.
- **Mapa Interactivo de Refugios**: Visualización geoespacial de albergues con búsqueda por municipio, marcadores personalizados y filtrado basado en ubicación.
- **Geocodificación**: Servicio interno para normalizar y geolocalizar las direcciones de los refugios registrados.

### Archivos Creados/Modificados

- **`lib/services/vendor-metrics.service.ts`** (A) - Lógica de negocio para métricas de venta.
- **`components/map/interactive-map.tsx`** (A) - Componente principal de mapa.
- **`components/shelters/shelter-search.tsx`** (A) - Interfaz de búsqueda y filtrado de refugios.
- **`app/api/shelters/map/route.ts`** (A) - API para datos del mapa.
- **`lib/utils/export-csv.ts`** (A) - Utilidad para exportación de reportes.
- **`prisma/schema.prisma`** (M) - Actualización de modelos para soportar geolocalización.

---

## 28-04-2026 - Mejoras de Seguridad y UX en Formularios (v1.8.0)

**Commit:** `dc28ed2`
**Tipo:** Feature / Fix
**Scope:** auth, ui

### Descripción

Implementación del componente `PasswordInput` con funcionalidad de alternancia de visibilidad de contraseña, integrado en todos los formularios de autenticación y solicitud de la plataforma. Se incluyó una corrección CSS para ocultar los botones nativos de revelación de contraseña en navegadores basados en Chromium (Edge/IE), evitando la duplicación de iconos.

### Archivos Creados

- **`components/ui/password-input.tsx`** (A) - Componente reutilizable de input con toggle de visibilidad (ojo abierto/cerrado).

### Archivos Modificados

- **`components/forms/login-form.tsx`** (M) - Integración del nuevo `PasswordInput` en el formulario de inicio de sesión.
- **`components/forms/register-form.tsx`** (M) - Integración del nuevo `PasswordInput` en el formulario de registro.
- **`components/forms/shelter-request-form.tsx`** (M) - Integración del nuevo `PasswordInput` en el formulario de solicitud de albergue.
- **`components/forms/vendor-request-form.tsx`** (M) - Integración del nuevo `PasswordInput` en el formulario de solicitud de vendedor.
- **`app/globals.css`** (M) - Reglas CSS para ocultar el botón nativo de revelar contraseña en Edge/IE y evitar iconos duplicados.

### Decisiones Técnicas

- Se creó un componente dedicado en lugar de añadir la lógica inline para garantizar consistencia y reutilización.

---

## 24-04-2026 - Bloqueo de Usuarios y Sincronización de Auditoría (v1.7.1)

**Commit:** `29323ee`
**Tipo:** Fix / Feature
**Scope:** admin, users

### Descripción

Resolución del problema de sincronización en el historial de auditoría del panel de administración. Tras bloquear o desbloquear un usuario, los registros de auditoría ahora se actualizan automáticamente sin requerir una recarga manual de la página.

### Archivos Creados

- **`components/admin/EditUserButton.tsx`** (A) - Botón de edición de usuario con modal integrado, siguiendo la arquitectura de `BlockUserButton`.

### Archivos Modificados

- **`app/api/admin/users/[id]/block/route.ts`** (M) - Sincronización de la UI tras bloqueo/desbloqueo.
- **`components/admin/AuditHistoryCard.tsx`** (M) - Refactorización con paginación y controles de layout consistentes.
- **`components/admin/UserActionsClient.tsx`** (M) - Integración del nuevo `EditUserButton` y mejora del flujo de acciones.

### Decisiones Técnicas

- El componente `EditUserButton` sigue el mismo patrón arquitectónico que `BlockUserButton` para mantener consistencia.

---

## 24-04-2026 - Sistema de Notificaciones por Email (v1.7.0)

**Commit:** `feat(email): Implementa el sistema de notificaciones por email con Resend y React Email`
**Tipo:** Feature
**Scope:** email, auth, adoptions, admin

### Descripción

Implementación del sistema completo de notificaciones por email usando Resend y React Email. Se crearon 11 plantillas HTML responsive con el branding de PawLig, integradas en los flujos críticos de la plataforma: recuperación de contraseñas, cambios de estado en adopciones, aprobaciones/rechazos de albergues y vendedores, gestión de cuentas y procesamiento de órdenes.

### Nuevas Funcionalidades

- **Recuperación de contraseña**: Email con enlace seguro de un solo uso (1 hora de vigencia) para restablecer la contraseña.
- **Notificaciones de adopción**: Correo al albergue cuando llega una nueva postulación y al adoptante cuando su solicitud cambia de estado.
- **Aprobación/Rechazo de Albergues**: El representante recibe confirmación con acceso directo a la plataforma o el motivo del rechazo.
- **Aprobación/Rechazo de Vendedores**: El solicitante recibe confirmación o explicación detallada del rechazo.
- **Bloqueo/Desbloqueo de Cuenta**: Aviso al usuario cuando su cuenta es suspendida o reactivada por un administrador.
- **Órdenes de Compra**: Confirmación al cliente y notificación de nueva venta al vendedor.
- **Actualización de Estado de Pedido**: Correo con número de guía cuando el pedido es despachado.

### Archivos Creados

- **`lib/services/email.service.ts`** (A) - Servicio central de envío de correos vía Resend API.
- **`lib/email/components/EmailLayout.tsx`** (A) - Layout base reutilizable con branding de PawLig.
- **`lib/email/templates/password-reset.tsx`** (A)
- **`lib/email/templates/adoption-status.tsx`** (A)
- **`lib/email/templates/new-adoption.tsx`** (A)
- **`lib/email/templates/order-confirmation.tsx`** (A)
- **`lib/email/templates/new-order-vendor.tsx`** (A)
- **`lib/email/templates/order-status.tsx`** (A)
- **`lib/email/templates/account-blocked.tsx`** (A)
- **`lib/email/templates/shelter-approved.tsx`** (A)
- **`lib/email/templates/shelter-rejected.tsx`** (A)
- **`lib/email/templates/vendor-approved.tsx`** (A)
- **`lib/email/templates/vendor-rejected.tsx`** (A)
- **`types/email.types.ts`** (A) - Interfaces TypeScript para los payloads de cada plantilla.
- **`app/api/auth/forgot-password/route.ts`** (A) - Endpoint de solicitud de recuperación de contraseña.

### Archivos Modificados

- **`prisma/schema.prisma`** (M) - Modelo `PasswordResetToken` para gestión de tokens con expiración.
- **`app/api/adoptions/route.ts`** (M) - Envío de notificación al albergue al crear nueva postulación.
- **`app/api/adoptions/[id]/route.ts`** (M) - Notificación al adoptante al aprobar/rechazar su solicitud.
- **`app/api/admin/users/[id]/block/route.ts`** (M) - Email de bloqueo/desbloqueo al usuario afectado.
- **`app/api/admin/shelters/[shelterId]/route.ts`** (M) - Emails de aprobación y rechazo de albergues.

---

## 20-04-2026 - Auditoría Administrativa y Enlaces Sociales (v1.6.0)

**Commit:** `N/A`
**Tipo:** Feature / Refactor
**Scope:** admin, ui

### Descripción

Implementación del componente `AuditHistoryCard` para fortalecer el módulo de administración, permitiendo visualizar el historial de acciones sobre usuarios. Paralelamente, se realizó una actualización de los enlaces de redes sociales globales en la configuración de constantes del proyecto.

### Archivos Modificados

- **`components/admin/AuditHistoryCard.tsx`** (A) - Nuevo componente de historial de auditoría.
- **`lib/constants.ts`** (M) - Actualización de enlaces sociales.

---

## 20-02-2026 - Centro de Ayuda y Estabilización del Entorno (v1.5.0)

**Commit:** `N/A`
**Tipo:** Feature / Stability
**Scope:** help, docs, testing

### Descripción

Implementación de la página oficial de ayuda al usuario en `/help` como un componente estático de alto rendimiento, alineado con el estilo visual de la plataforma y sin dependencias externas.

### Archivos Modificados

- **`app/(public)/help/page.tsx`** (A) - Nueva página de Centro de Ayuda con navegación por anclas.
- **`CHANGELOG.md`** (M) - Actualización del registro técnico.
- **`app/(public)/changelog/page.tsx`** (M) - Actualización del registro visual para el usuario.

Este documento detalla los cambios realizados en el proyecto PawLig, documentando las modificaciones a nivel de código, arquitectura y funcionalidades implementadas.

---

## 20-01-2026 - Integración de Inteligencia Artificial Generativa (v1.4.0)

**Commit:** `N/A`
**Tipo:** Feature
**Scope:** ai, pet-adoption, marketplace

### Descripción

Implementación de un asistente de Inteligencia Artificial Generativa basado en Google Gemini para el refinamiento automático de descripciones. Este asistente ayuda a los usuarios a crear perfiles de adopción más atractivos y descripciones de productos de marketplace más persuasivas, optimizando el tono, la gramática y el impacto emocional.

### Archivos Modificados

- **`package.json`** (M) - Adición de `@google/generative-ai`
- **`app/api/ai/refine/route.ts`** (A) - Endpoint para procesamiento de IA
- **`components/forms/pet-form.tsx`** (M) - Integración del asistente en formulario de mascotas
- **`components/forms/product-form.tsx`** (M) - Integración del asistente en formulario de productos

---

## 16-01-2026 - Implementación de Páginas Públicas y Legales (v1.3.0)

**Commit:** `a270c42`
**Tipo:** Feature
**Scope:** public, docs, legal

### Descripción

Implementación de la infraestructura para páginas públicas de la plataforma. Se han creado las secciones de FAQ, Privacidad, Términos y Condiciones, y el Registro de Cambios (Changelog) para el usuario final. Estas páginas siguen un diseño limpio y legalmente apropiado, facilitando la transparencia con los usuarios.

### Archivos Modificados

- **`app/(public)/faq/page.tsx`** (A)
- **`app/(public)/privacy/page.tsx`** (A)
- **`app/(public)/terms/page.tsx`** (A)
- **`app/(public)/changelog/page.tsx`** (A)
- **`Preguntas_Frecuentes.md`** (A)

---

## 15-01-2026 - Módulo de Marketplace y Gestión de Productos (v1.2.0)

**Commit:** `811248f`
**Tipo:** Feature
**Scope:** products, vendor, marketplace

### Descripción

Despliegue integral del módulo de productos que transforma a PawLig en un marketplace funcional. Se ha implementado el catálogo de productos con filtros avanzados por categoría y precio, junto con un sistema de gestión de inventario para vendedores que permite crear, editar y actualizar stock de productos en tiempo real.

### Archivos Modificados

- **`app/productos/`** (A) - Galería pública de productos y vista de detalle
- **`app/(dashboard)/vendor/products/`** (A) - Panel de gestión para vendedores
- **`components/ProductGalleryClient.tsx`** (A)
- **`components/vendor/ProductsClient.tsx`** (A)
- **`lib/services/product.service.ts`** (A)
- **`lib/validations/product.schema.ts`** (A)

---

---

## 10-01-2026 - Estandarización de Interfaz y UX Cohesiva (v1.1.0)

**Commit:** `N/A`
**Tipo:** Improvement
**Scope:** ui, ux

### Descripción

Refactorización de los componentes base de la interfaz de usuario para asegurar consistencia visual en toda la plataforma. Se han unificado estilos de botones, tarjetas y sistemas de navegación móvil para mejorar la experiencia del usuario final.

### Archivos Modificados

- **`components/ui/`** (M) - Ajustes en variantes de botones y sombras de tarjetas.
- **`components/layout/navbar-mobile.tsx`** (M) - Mejoras en la transición de menús.

---

## 05-01-2026 - Migración de Estilos y Refactorización General (v1.0.0)

**Commits:** `7d51b22`
**Tipo:** Refactor (Core)
**Scope:** core, styles, architecture

### Descripción

Este commit representa una refactorización masiva del frontend y la migración completa de la base de código a una nueva arquitectura de estilos. El objetivo era modernizar la base del código, mejorar la mantenibilidad y establecer una configuración de proyecto robusta.

La implementación consistió en:

1. **Revisión de Estilos:** Se eliminaron todos los estilos CSS anteriores y se reemplazaron con una implementación basada en Tailwind CSS.
2. **Reorganización de Componentes:** Los componentes de React se reestructuraron siguiendo una convención de nomenclatura y organización basada en features.
3. **Configuración de Herramientas:** Se configuraron desde cero herramientas de desarrollo como ESLint para el linting de código, TypeScript para el tipado estático y Next.js como framework principal.
4. **Actualización del Esquema de BD:** Se modificó el esquema de Prisma para alinear los modelos de datos con las nuevas necesidades de la aplicación.

### Archivos Modificados

- **Configuración del Proyecto (A):**
  - Se añadieron y configuraron `.eslintrc.json`, `next.config.mjs`, `tailwind.config.ts`, `tsconfig.json` y `vitest.config.ts`.
- **Estructura de la Aplicación (A):**
  - Se crearon los archivos base de la aplicación, incluyendo `app/layout.tsx`, `app/page.tsx` y el `middleware.ts` para la gestión de rutas.
- **API Endpoints (A):**
  - Se implementaron múltiples rutas de API en `app/api/` para gestionar la lógica de negocio de usuarios, mascotas, adopciones y productos.
- **Componentes de UI (A):**
  - Se crearon todos los componentes de UI base en `components/ui/`, como `Button`, `Card`, `Input`, etc.
- **Componentes de Formularios (A):**
  - Se implementaron todos los formularios de la aplicación en `components/forms/`, incluyendo los de login, registro y creación de mascotas.
- **Servicios de Lógica de Negocio (A):**
  - Se crearon los servicios en `lib/services/` para encapsular la lógica de negocio de usuarios, mascotas y productos.
- **Esquema de Base de Datos (A):**
  - Se definió el esquema inicial de la base de datos en `prisma/schema.prisma`.

---

## 03-01-2026 - Documentación Estandarizada en Archivos Clave

**Commits:** `15e4885`
**Tipo:** Documentation (Core)
**Scope:** docs, core, components

### Descripción

Para mejorar la calidad y mantenibilidad del código, se llevó a cabo una iniciativa de documentación masiva. El objetivo era asegurar que cualquier desarrollador, nuevo o existente, pudiera entender rápidamente la funcionalidad, el propósito y las dependencias de los archivos más importantes del proyecto.

La implementación se basó en las directrices del archivo `.rules.md`, que estandariza el formato de la documentación. Se añadieron:

1. **Cabeceras de Resumen:** Un resumen de alto nivel al principio de cada archivo, describiendo su propósito.
2. **Notas de Implementación:** Comentarios detallados en el código, explicando la lógica de negocio y las decisiones de arquitectura.
3. **Descripciones de Dependencias:** Aclaraciones sobre las dependencias externas utilizadas en cada archivo.

### Archivos Modificados

- **`lib/auth/auth-options.ts`** (A)
  - Se añadió documentación detallada de la configuración de NextAuth, explicando el funcionamiento de los proveedores de autenticación y los callbacks.
- **`app/api/pets/route.ts`** (A)
  - Se documentaron los endpoints de la API para la gestión de mascotas, explicando cómo se manejan las peticiones GET, POST, etc.
- **`components/forms/pet-form.tsx`** (A)
  - Se añadió documentación al formulario de creación y edición de mascotas, detallando las validaciones y el manejo del estado.
- **`middleware.ts`** (A)
  - Se documentó el middleware de autenticación, explicando cómo se protegen las rutas y se gestionan los roles de usuario.
- ... y otros 100+ archivos de componentes, servicios y API.

---

## 31-12-2025 - Gestión de Usuarios y Visualización Detallada (Admin)

**Commits:** `0e3b7e3`, `78409cf`, `bba8cb4`  
**Tipo:** Feature (Admin)  
**Scope:** admin, users

### Descripción

Implementación integral de la gestión de usuarios para administradores. Se añade una vista detallada del usuario, historial de auditoría de cambios y la capacidad de modificar roles de usuario de forma segura con validaciones.

### Archivos Modificados

- **`app/(dashboard)/admin/users/[id]/view/page.tsx`** (A)
  - Nueva página de vista detallada de usuario
- **`components/admin/UserViewClient.tsx`** (A)
  - Cliente para la visualización y gestión de la vista de usuario
- **`components/admin/RoleChangeModal.tsx`** (A)
  - Modal para cambio de roles con confirmación
- **`components/admin/AuditHistoryCard.tsx`** (A)
  - Componente para visualizar el historial de cambios (auditoría)
- **`lib/services/user.service.ts`** (M)
  - Nuevos métodos para obtener usuario por ID y actualizar roles
- **`lib/validations/user.schema.ts`** (M)
  - Esquemas de validación actualizados

---

## 31-12-2025 - Mejoras en Componentes de Mascotas

**Commit:** `fd9d17a`  
**Tipo:** Feature  
**Scope:** mascotas, ui

### Descripción

Refactorización del componente cliente de detalles de mascota y actualizaciones en las tarjetas de presentación para albergues.

### Archivos Modificados

- **`components/PetDetailClient.tsx`** (M)
  - Optimizaciones en la visualización de detalles
- **`components/cards/shelter-pet-card.tsx`** (M)
  - Ajustes de UI en la tarjeta de mascota

---

## 31-12-2025 - Actualización de Documentación del Proyecto

**Commits:** `91656f8`, `0f13c4e`, `34f458a`  
**Tipo:** Documentation  
**Scope:** docs

### Descripción

Creación inicial del archivo `CHANGES.md` para seguimiento de cambios y actualizaciones de formato y contenido en el `README.md`.

### Archivos Modificados

- **`CHANGES.md`** (A)
  - Creación del archivo de registro de cambios
- **`README.md`** (M)
  - Mejoras de formato, corrección de instrucciones y actualización de metadatos

---

## 31-12-2025 - Actualización de Assets: Imagen del Mapa de Medellín

**Commit:** `33c4a6d6f2dd5916631c8ab3f09e0764838cc271`  
**Tipo:** Feature (Assets)  
**Scope:** assets

### Descripción

Modificación de la imagen del mapa de Medellín utilizada en la aplicación.

### Archivos Modificados

- **`public/images/medellin-map.png`** (M)
  - Actualización del archivo de imagen del mapa de Medellín

---

## 30-12-2025 - Corrección del Filtro de Sexo en Adopciones

**Commit:** `b18cf9bbc23207efbcd4c6674a1783bda6f8ad67`  
**Tipo:** Fix  
**Scope:** adoptions

### Descripción

Se corrigió un bug crítico en el filtro de búsqueda por sexo en la galería de adopciones. El problema radicaba en que los valores del filtro ('M'/'F') no coincidían con los valores almacenados en la base de datos ('Macho'/'Hembra'), lo que impedía que la búsqueda retornara resultados.

### Archivos Modificados

- **`components/filters/pet-filters.tsx`** (M)
  - Actualización de los valores de las opciones del filtro de sexo de 'M'/'F' a 'Macho'/'Hembra'
- **`components/pet-gallery-client.tsx`** (M)
  - Ajuste del componente para manejar correctamente los nuevos valores del filtro

### Impacto

- Corrección del bug reportado en la ruta `/adopciones`
- Mejora en la experiencia de usuario al permitir filtrado correcto por sexo de mascotas

---

---

## 30-12-2025 - Documentación: Notas de Implementación en Archivos Clave

**Commit:** `72f1bc1cfc6973070ccc0ca4a0bf526392a7b901`  
**Tipo:** Documentation  
**Scope:** docs

### Descripción

Adición de notas de implementación detalladas en archivos críticos del proyecto, siguiendo el formato especificado en `.rules.md`. Mejora la claridad del código y facilita el mantenimiento futuro.

### Archivos Modificados

- **`app/api/pets/route.ts`** (M)

  - Adición de comentarios de implementación

- **`components/forms/pet-form.tsx`** (M)

  - Documentación de la lógica del formulario

- **`lib/auth/auth-options.ts`** (M)

  - Documentación de opciones de autenticación

- **`lib/services/pet.service.ts`** (M)

  - Documentación de servicios de mascotas

- **`middleware.ts`** (M)
  - Documentación del middleware de autenticación

### Nota

Se removió el formato Markdown de los comentarios para asegurar que se rendericen correctamente como texto plano en el código fuente.

---

## 29-12-2025 - Implementación de Página de Detalle de Mascota

**Commit:** `19012eec60cb5d4add3208bffd6af869ba9c6fa0`  
**Tipo:** Feature  
**Scope:** adopciones

### Descripción

Implementación completa de la página de detalle de mascota con metadatos dinámicos y funcionalidades de interacción.

### Archivos Modificados

- **`app/adopciones/[id]/page.tsx`** (M)
  - Implementación de metadatos dinámicos (SEO)
  - Adición de funcionalidades de interacción (favoritos, adopción)
  - Mejora en la presentación de información de la mascota

---

## 29-12-2025 - Páginas de Autenticación y Componentes de UI

**Commit:** `28cb88315d55ae4c665833e8720c9d6bb161a615`  
**Tipo:** Feature  
**Scope:** auth, ui

### Descripción

Implementación de páginas de login y registro con redirección basada en roles, formularios de autenticación mejorados, constantes de navegación y componentes de pie de página.

### Archivos Modificados

- **`app/(auth)/login/page.tsx`** (M)

  - Actualización de la página de login con redirección por rol

- **`app/(auth)/register/page.tsx`** (M)

  - Actualización de la página de registro con validaciones mejoradas

- **`app/favicon.ico`** (D)

  - Eliminación del favicon por defecto

- **`app/icon.png`** (A)

  - Adición de nuevo icono personalizado de la aplicación

- **`components/forms/login-form.tsx`** (M)

  - Mejoras en el formulario de login
  - Implementación de manejo de errores

- **`components/forms/register-form.tsx`** (M)

  - Mejoras en el formulario de registro
  - Validaciones del lado del cliente

- **`components/layout/footer.tsx`** (M)

  - Actualización del componente de pie de página

- **`lib/constants.ts`** (M)
  - Adición de constantes de navegación por rol

---

---

## 29-12-2025 - Implementación de la Página de Inicio y Layout Principal

**Commit:** `0b0dc4cd7fa535b3db5219fe16cc1bc0d0a760b9`  
**Tipo:** Feature  
**Scope:** app

### Descripción

Implementación completa de la página de inicio (landing page), el layout principal de la aplicación y componentes UI esenciales.

### Archivos Modificados

- **`app/(dashboard)/admin/profile/page.tsx`** (M)

  - Actualización de la página de perfil de administrador

- **`app/layout.tsx`** (M)

  - Implementación del layout principal con navegación

- **`app/page.tsx`** (M)

  - Rediseño completo de la página de inicio
  - Implementación de secciones: Hero, Features, Did You Know, Emotional CTA

- **`components/layout/footer.tsx`** (M)

  - Actualización del footer con información de contacto

- **`components/layout/navbar-auth.tsx`** (M)

  - Mejoras en la barra de navegación autenticada

- **`components/layout/user-menu.tsx`** (M)

  - Actualización del menú de usuario con opciones por rol

- **`components/ui/star-button.tsx`** (A)

  - Nuevo componente de botón con efecto de estrella

- **`lib/constants.ts`** (M)
  - Actualización de constantes de navegación

### Nuevos Assets

- **`public/images/medellin-map.png`** (A)

  - Imagen del mapa de Medellín para la sección de ubicación

- **`public/images/pet-adopted.png`** (A)

  - Imagen de mascota adoptada

- **`public/images/pet-community.png`** (A)

  - Imagen de comunidad de mascotas

- **`public/images/pet-home.png`** (A)
  - Imagen de mascota en hogar

---

## 24-12-2025 - Adición de Guías para Agentes de IA

**Commit:** `1290d2efd4430b38ff426f1322dbfb3cde654d68`  
**Tipo:** Feature  
**Scope:** docs

### Descripción

Introducción del archivo `.rules.md` que documenta los estándares de codificación, convenciones de nomenclatura, estructura de código y mejores prácticas para agentes de IA que trabajen en el repositorio.

### Archivos Modificados

- **`.rules.md`** (A)
  - Documentación de estilo de código (indentación, comillas, etc.)
  - Convenciones de nomenclatura para variables, componentes y archivos
  - Estructura del proyecto basada en Next.js App Router
  - Mejores prácticas para React, TypeScript y manejo de errores
  - Template para notas de implementación
  - Lista de anti-patrones a evitar

### Objetivo

Asegurar consistencia y mantener la calidad del código al usar herramientas de desarrollo asistidas por IA.

---

## 15-12-2025 - Mejora y Estructuración del README

**Commit:** `beeaccb863092e7a7dc76c2ee51a05bb72509838`  
**Tipo:** Documentation  
**Scope:** docs

### Descripción

Reestructuración del `README.md` para hacerlo más profesional y fácil de navegar.

### Archivos Modificados

- **`README.md`** (M)
  - Adición de Tabla de Contenidos para mejor legibilidad
  - Adición de sección "Cómo Contribuir"
  - Corrección de enlaces internos rotos basados en feedback de code review

---

## 11-12-2025 - Actualización de Descripción y Ubicación del Proyecto

**Commit:** `d56ed09c6fd3616e5d1e11fb0fd18cb0d4d85904`  
**Tipo:** Documentation  
**Scope:** README

### Descripción

Actualización de la descripción y ubicación del proyecto en el README.

### Archivos Modificados

- **`README.md`** (M)
  - Eliminación de mención explícita de "SENA Análisis y Desarrollo de Software"
  - Adición de salto de línea antes de la ubicación
  - Actualización del formato de ubicación a "📍 Medellín, Antioquia, Colombia"

---

---

## 28-11-2025 - Actualización de Documentación y Estructura del Proyecto

**Commit:** `1507f043a3025928ead2ab3bab154c56d73a2f44`  
**Tipo:** Fix  
**Scope:** docs

### Descripción

Actualización completa del README del proyecto con información detallada sobre configuración, despliegue y contribución.

### Archivos Modificados

- **`README.md`** (M)
  - Actualización con información detallada del proyecto
  - Adición de sección de variables de entorno
  - Inclusión de instrucciones de despliegue para Vercel
  - Mejora del flujo de trabajo de Git y directrices de contribución
  - Actualización de información de contacto del equipo
  - Refactorización de la estructura del documento para mejor legibilidad

---

## 28-11-2025 - Páginas de Adopciones y Favoritos del Usuario

**Commit:** `9f632d662753d2c76187f58a98507b1813612537`  
**Tipo:** Feature  
**Scope:** usuario

### Descripción

Implementación de las páginas de adopciones y favoritos para usuarios autenticados.

### Archivos Creados

- **`app/(dashboard)/user/adoptions/page.tsx`** (A)

  - Página para mostrar las solicitudes de adopción del usuario
  - Comprobaciones de autenticación y redirección
  - Obtención y visualización de insignias de estado de adopción
  - Fechas formateadas
  - Opciones para navegar a detalles de mascota y contactar refugios

- **`app/(dashboard)/user/favorites/page.tsx`** (A)
  - Página para mostrar las mascotas favoritas del usuario
  - Interfaz de usuario para estado vacío cuando no hay favoritos
  - Integración con sistema de favoritos

---

## 28-11-2025 - Componentes de Layout Compartidos

**Commit:** `1bd45e3cecc37d902e8078c37d89ede287cc30fc`  
**Tipo:** Feature  
**Scope:** componentes

### Descripción

Adición de componentes de diseño compartidos para navegación, menú de usuario, carrito y pie de página.

### Archivos Modificados

- **`app/(dashboard)/user/page.tsx`** (M)

  - Integración con nuevos componentes de layout

- **`app/adopciones/[id]/page.tsx`** (M)

  - Actualización para usar componentes compartidos

- **`app/adopciones/page.tsx`** (M)

  - Integración con navbar y footer

- **`app/globals.css`** (M)

  - Estilos globales actualizados

- **`app/layout.tsx`** (M)
  - Implementación del layout con navbar y footer

### Nuevos Componentes

- **`components/layout/cart-button.tsx`** (A)

  - Botón de carrito con contador de artículos

- **`components/layout/footer.tsx`** (A)

  - Componente de pie de página con información de contacto y redes sociales

- **`components/layout/index.ts`** (A)

  - Archivo de índice para exportaciones

- **`components/layout/navbar-auth.tsx`** (A)

  - Barra de navegación para usuarios autenticados

- **`components/layout/navbar-mobile.tsx`** (A)

  - Navegación móvil responsive

- **`components/layout/navbar-public.tsx`** (A)

  - Barra de navegación pública

- **`components/layout/navbar.tsx`** (A)

  - Componente principal de navegación

- **`components/layout/user-menu.tsx`** (A)

  - Menú desplegable de usuario con opciones de perfil y acciones

- **`components/ui/logo.tsx`** (A)
  - Componente de logo reutilizable

### Archivos de Configuración

- **`lib/auth/session.ts`** (A)

  - Utilidades para manejo de sesiones

- **`lib/constants.ts`** (A)

  - Constantes de navegación y configuración

- **`tailwind.config.ts`** (M)
  - Actualización de configuración de Tailwind

### Documentación

- Adición de documentación de pull request para Navbar-Footer

---

## 28-11-2025 - Refactorización de Endpoints de Adopción

**Commit:** `6a55c87425e981cb7f4987db39624dd864b440f7`  
**Tipo:** Refactor  
**Scope:** api

### Descripción

Renombre y actualización de los endpoints de adopción para mejor organización y consistencia.

### Archivos Modificados

- **`app/api/adopter/adoptions/route.ts`** (D)

  - Eliminación de la antigua ruta de adopción

- **`app/api/pets/[id]/favorite/route.ts`** (M)

  - Actualización del endpoint de favoritos

- **`app/api/user/adoptions/route.ts`** (A)

  - Nueva ruta de adopción en `/api/user/adoptions`
  - Método POST para solicitudes de adopción actualizado
  - Método GET para obtener adopciones de un usuario

- **`components/PetDetailClient.tsx`** (M)
  - Frontend actualizado para utilizar el nuevo endpoint de la API

---

## 28-11-2025 - Mejora de UI en Página de Mascotas del Refugio

**Commit:** `8e4d82ad5e15ecf4e391fba485a00fd92c4a2bcb`  
**Tipo:** Feature  
**Scope:** ui

### Descripción

Mejora de la interfaz de usuario en la página de mascotas del refugio con filtros mejorados y optimizaciones en las tarjetas.

### Archivos Modificados

- **`app/(dashboard)/shelter/pets/page.tsx`** (M)

  - Adición de iconos a los botones de filtro

- **`app/api/adopter/adoptions/route.ts`** (M)

  - Restricción de solicitudes de adopción únicamente a usuarios de tipo adoptante

- **`components/cards/pet-card.tsx`** (M)

  - Movimiento del botón "Ver Detalles" dentro de PetCard para mejor UX

- **`components/cards/shelter-pet-card.tsx`** (M)
  - Actualización del icono de postulación a BookOpenCheck
  - Mejoras visuales en la tarjeta

### Impacto

- Mejora en la interfaz y experiencia para usuarios del refugio
- Aumento de seguridad al restringir adopciones a usuarios autorizados

---

## 28-11-2025 - Componentes de Tarjeta de Mascota y Filtros

**Commit:** `4a59e5b1362671e83249c65e17aa702f012aebe5`  
**Tipo:** Feature  
**Scope:** componentes

### Descripción

Creación de componentes reutilizables para tarjetas de mascotas y sistema de filtros de búsqueda.

### Archivos Modificados

- **`.gitignore`** (M)

  - Actualización de archivos ignorados

- **`app/(dashboard)/profile/page.tsx`** (D)

  - Eliminación de página de perfil antigua

- **`app/adopciones/[id]/page.tsx`** (M)

  - Actualización para usar nuevos componentes

- **`app/api/pets/route.ts`** (M)

  - Actualización del endpoint de mascotas

- **`components/PetDetailClient.tsx`** (M)

  - Actualización para usar nuevos componentes y mejorar UI

- **`components/pet-gallery-client.tsx`** (M)

  - Integración con sistema de filtros

- **`next.config.mjs`** (M)
  - Actualización de configuración de Next.js

### Nuevos Componentes

- **`components/cards/pet-card.tsx`** (A)

  - Componente para mostrar información de mascotas en formato de tarjeta
  - Soporte para favoritos y acciones

- **`components/filters/pet-filters.tsx`** (A)

  - Componente de filtros de búsqueda
  - Filtros por especie, tamaño, edad, sexo, etc.

- **`components/ui/badge.tsx`** (A)
  - Componente de insignia reutilizable

### Nuevos Servicios

- **`lib/services/pet.service.ts`** (A)
  - Servicio para operaciones relacionadas con mascotas
  - Funciones de búsqueda y filtrado

### Nuevas APIs

- **`app/api/adopter/adoptions/route.ts`** (A)

  - Endpoint para solicitudes de adopción

- **`app/api/pets/[id]/favorite/route.ts`** (A)

  - Endpoint para marcar/desmarcar favoritos

- **`app/api/user/favorites/check/route.ts`** (A)
  - Endpoint para verificar estado de favoritos

### Documentación

- **`documentation/pull-request/TAREA-016/TAREA-016-CORRECTIONS.md`** (A)

  - Documentación de correcciones

- **`documentation/pull-request/TAREA-016/TAREA-016-README.md`** (M)
  - Actualización de documentación

---

## 28-11-2025 - Limpieza de Archivos de Documentación

**Commit:** `73e3802f10cfa7d9fa87359a49bb5b70dcf1b027`  
**Tipo:** Chore  
**Scope:** docs

### Descripción

Eliminación de archivos de documentación obsoletos y reorganización de estructura.

### Archivos Eliminados

- `IMPLEMENTATION_REPORT.md`
- `NOMENCLATURE-CORRECTION.md`

### Archivos Movidos

- **`CAMBIOS_ESTRUCTURA.md`** → **`documentation/pull-request/refactor-dashboard/CAMBIOS_ESTRUCTURA.md`** (R100)
  - Movimiento del archivo de cambios de estructura al directorio de documentación

---
