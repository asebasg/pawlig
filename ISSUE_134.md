title:	[FEATURE] - Creación del Moderation Hub Integrado
state:	OPEN
author:	asebasg (Sebastián Ospina)
labels:	enhancement
comments:	0
assignees:	asebasg (Sebastián Ospina)
projects:	
milestone:	
number:	134
--
## ✨ Feature

**¿Qué?**
Implementación del módulo unificado **Moderation Hub** bajo el segmento de rutas `/app/(dashboard)/admin/moderation/*` (`/shelters`, `/vendors` y `/audit`). Este módulo centraliza las vistas y operaciones de administración para revisar, aprobar o declinar solicitudes de albergues y negocios/vendedores de manera transaccional, consolidando un registro de auditoría polimórfico persistente en base de datos.

**¿Por qué?**
Actualmente el flujo de moderación de cuentas carece de una interfaz administrativa dedicada que unifique el ciclo de vida de las solicitudes (intake, revisión, aprobación/declinación con motivo, y provisionamiento). Adicionalmente, el modelo de auditoría actual (`UserAudit`) está acoplado exclusivamente a las operaciones de la cuenta de `User` y no admite trazabilidad polimórfica para entidades como `Shelter` o `Vendor`, limitando el registro actual a logs a nivel de servidor (`console.log`) que impiden auditorías e integraciones consultables desde el frontend.

**¿Cómo funciona?**

1. El administrador (rol `ADMIN`) accede al panel de moderación en `/admin/moderation/shelters` o `/admin/moderation/vendors`.
2. El frontend consume a través de la capa de servicios los registros pendientes de validación (`verified: false` y `rejectionReason: null`) consultados en la DB.
3. El administrador visualiza la información de la solicitud (formulario, NIT, datos del representante) y puede:
   * **Aprobar:** Ejecuta una transacción atómica de Prisma (`prisma.$transaction`) que marca `verified: true`, promociona el rol del usuario representante a `SHELTER` o `VENDOR`, despacha de forma asíncrona la notificación de bienvenida por email (`sendShelterApprovalEmail`/`sendVendorApprovalEmail`) e inserta un log estructurado en el registro de auditoría del sistema.
   * **Rechazar:** Requiere un motivo obligatorio (`rejectionReason`). Actualiza el registro manteniendo `verified: false`, asocia la razón del rechazo, despacha un email informativo de declinación e inserta el log de auditoría.
4. El administrador puede consultar el Audit Log en `/admin/moderation/audit` y filtrar eventos por rango de fechas, acción, tipo de recurso (`SHELTER`, `VENDOR`, `USER`) y trazar el ciclo de vida de operaciones correlacionadas por un `requestId` único.

---

## 📋 Metadata

**Status:**

- [ ] 📋 Todo (no iniciado)
- [ ] 🔄 En Progreso (trabajando activamente)
- [ ] 👀 En Revisión (para ser aprobado)
- [x] ✅ Finalizado (completado)

**Priority:**

- [ ] P0 - Crítico (blocker/requerimiento esencial)
- [x] P1 - Alto (alta demanda/valor de negocio)
- [ ] P2 - Medio (mejora importante)
- [ ] P3 - Bajo (nice-to-have)

**Size (Story Points):**

- [ ] XS (< 1h - cambio trivial)
- [ ] S (1-2h - cambio simple)
- [ ] M (2-4h - cambio pequeño)
- [ ] L (1 día - cambio mediano)
- [x] XL (2-3 días - cambio grande)
- [ ] XXL (> 3 días - cambio muy grande)

**Componentes:**

- [x] Frontend
- [x] Backend
- [x] Database
- [x] API
- [x] Tests
- [x] Docs

---

## ✅ TODO

### Diseño

- [x] Definir arquitectura (completado en especificación técnica)
- [x] Diseñar API/interfaces del Moderation Hub
- [x] Elaborar wireframes/layouts adaptables con el sistema de diseño

### Implementación

- [x] Ejecutar migración de Prisma para incorporar el modelo polimórfico `SystemAuditLog`
- [x] Implementar la capa de servicios `/lib/services/moderation.service.ts`
- [x] Desarrollar endpoints RESTful bajo `/api/admin/moderation/shelters/[id]` y `/api/admin/moderation/vendors/[id]`
- [x] Construir componentes UI del dashboard interactivo en `kebab-case.tsx` (`shelter-moderation-client.tsx`, `vendor-moderation-client.tsx`, `audit-log-viewer.tsx`)
- [x] Envolver componentes interactivos en `<Suspense>` para resolver dependencias de URL SearchParams

### Testing

- [x] Implementar tests unitarios para las transacciones de base de datos
- [x] Validar flujos E2E de aprobación y rechazo en entorno de staging

### Finalización

- [x] Code review
- [x] Actualizar documentación técnica e histórico del `CHANGELOG.md`
- [x] Validar directrices de contraste WCAG AA en temas de diseño

---

## 🎯 Acceptance Criteria

- [x] El acceso a `/admin/moderation/*` y sus APIs correspondientes debe estar estrictamente denegado a cualquier rol diferente a `UserRole.ADMIN`, retornando código HTTP `403 Forbidden` en servidor y redirección a `/unauthorized` en el cliente.
- [x] La aprobación y el cambio de rol del usuario de origen (`ADOPTER`/`VENDOR`) a su respectivo rol de destino (`SHELTER` o `VENDOR`) deben realizarse mediante una transacción atómica `prisma.$transaction`. Si falla un cambio, la transacción entera se revierte.
- [x] El rechazo de una solicitud debe validar que el campo `rejectionReason` sea de tipo string, no nulo y no esté vacío.
- [x] Los despachos de correos electrónicos informativos (`sendShelterApprovalEmail`, etc.) deben ejecutarse de forma asíncrona y no bloquear la respuesta HTTP del endpoint.
- [x] Toda acción de aprobación o rechazo exitosa debe insertar un registro en la tabla `SystemAuditLog` persistiendo el `actorId`, `actorEmail`, `resourceType`, `resourceId`, los estados JSON (`before`/`after`) y el `requestId` del flujo.
- [x] El visor de auditoría `/admin/moderation/audit` debe implementar filtros interactivos por rango de fecha, tipo de recurso y paginación con manejo robusto de hidratación de Next.js mediante límites de `<Suspense>`.
- [x] Cumplir estrictamente con la convención de nomenclatura `kebab-case.tsx` en todos los archivos de componentes y páginas cliente agregadas.

---

## 🔧 Tech Spec

**Stack sugerido:**
* Next.js App Router (React Server y Client Components)
* Prisma ORM (MongoDB)
* Tailwind CSS (basado en variables de diseño semánticas como `bg-background`, `text-primary`)
* Sonner (para toast notifications reactivos)
* Lucide React (única librería de iconografía autorizada)

**Endpoints/Componentes nuevos:**
* `/app/(dashboard)/admin/moderation/shelters/page.tsx` & `shelter-moderation-client.tsx`
* `/app/(dashboard)/admin/moderation/vendors/page.tsx` & `vendor-moderation-client.tsx`
* `/app/(dashboard)/admin/moderation/audit/page.tsx` & `audit-log-viewer.tsx`
* `/api/admin/moderation/shelters/[id]/route.ts` (PATCH)
* `/api/admin/moderation/vendors/[id]/route.ts` (PATCH)
* `/api/admin/moderation/audit/route.ts` (GET)

**Migrations/Schema changes:**
```prisma
enum AuditCategory {
  USER_MANAGEMENT
  SHELTER_MODERATION
  VENDOR_MODERATION
}

model SystemAuditLog {
  id           String        @id @default(auto()) @map("_id") @db.ObjectId
  category     AuditCategory
  action       String        // Ej: "APPROVE", "REJECT", "BLOCK", "CHANGE_ROLE"
  actorId      String        @db.ObjectId 
  actorEmail   String
  resourceType String        // Ej: "SHELTER", "VENDOR", "USER"
  resourceId   String        @db.ObjectId 
  before       String?       // JSON String
  after        String?       // JSON String
  reason       String
  ipAddress    String?
  userAgent    String?
  requestId    String?       // Correlación para tracing
  createdAt    DateTime      @default(now())

  @@index([category])
  @@index([action])
  @@index([resourceType, resourceId])
  @@index([createdAt])
}
```

**Dependencies:**
* `@prisma/client`
* `next-auth`
* `sonner`
* `lucide-react`

---

## 📎 Referencias

- Diseño: Modularidad en Dashboard Admin
- Similar a: [UsersManagementClient.tsx](file:///c:/Users/ultra/Proyectos/pawlig/app/(dashboard)/admin/users/UsersManagementClient.tsx)
- Docs: Especificación detallada de arquitectura en [moderation_hub_technical_spec.md](file:///C:/Users/ultra/.gemini/antigravity/brain/b551c6ce-ab13-4f87-9f51-605de5858c34/moderation_hub_technical_spec.md)

---

**Para Jules:** Implement this feature following the tech spec. Ensure all acceptance criteria are met and tests pass.
