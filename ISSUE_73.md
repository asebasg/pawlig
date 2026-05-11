title:	[FEATURE] - Panel de Gestión de Postulaciones
state:	OPEN
author:	asebasg (Sebastián Ospina)
labels:	enhancement
comments:	0
assignees:	asebasg (Sebastián Ospina)
projects:	
milestone:	
number:	73
--
## ✨ Feature

**¿Qué?**
<!-- Qué nueva funcionalidad quieres agregar -->
Sistema completo de gestión de postulaciones de adopción para albergues, incluyendo visualización segregada (activas/gestionadas), aprobación/rechazo de solicitudes y notificaciones automáticas por email.

**¿Por qué?**
<!-- Por qué quieres agregar esta funcionalidad -->
Actualmente existe una implementación básica en `app/(dashboard)/shelter/adoptions/page.tsx` que no sigue la arquitectura modular del proyecto. Necesitamos refactorizar esta página y completar el flujo end-to-end de postulaciones (HU-007, RF-011) con gestión de estados y notificaciones (RN-012).

**¿Cómo funciona?**
<!-- Cómo quieres que funcione la funcionalidad -->

1. Usuario adoptante visualiza mascota → Clic en "Solicitar Adopción" → Modal de confirmación con requisitos → Confirmación crea postulación (PENDING)
2. Sistema envía email al albergue notificando nueva postulación
3. Albergue accede a `/shelter/adoptions` → Ve tabla de mascotas con botón "Ver postulaciones" → Gestiona solicitudes (Aprobar/Rechazar)
4. Sistema actualiza estado (APPROVED/REJECTED) y notifica al adoptante por email.
5. En caso de ser `APROVED`, la mascota pasa a estado `IN_PROCESS` y todas las otras postulaciones de la misma mascota quedan deshabilitadas. Se eliminan si el estado de la mascota es `ADOPTED` o se restauran si el estado cambia a `AVAILABLE` nuevamente.

---

## 📋 Metadata

**Status:**

- [ ] 📋 Todo (no iniciado)
- [x] 🔄 En Progreso (trabajando activamente)
- [ ] 👀 En Revisión (para ser aprobado)
- [ ] ✅ Finalizado (completado)

**Priority:**

- [X] P0 - Crítico (blocker/requerimiento esencial)
- [ ] P1 - Alto (alta demanda/valor de negocio)
- [ ] P2 - Medio (mejora importante)
- [ ] P3 - Bajo (nice-to-have)

**Size (Story Points):**

- [ ] XS (< 1h - cambio trivial)
- [ ] S (1-2h - cambio simple)
- [ ] M (2-4h - cambio pequeño)
- [ ] L (1 día - cambio mediano)
- [ ] XL (2-3 días - cambio grande)
- [X] XXL (> 3 días - cambio muy grande)

**Componentes:**

- [X] Frontend
- [X] Backend
- [X] Database
- [X] API
- [X] Tests
- [X] Docs

---

## ✅ TODO

### Diseño

- [ ] Revisar arquitectura actual en `app/(dashboard)/shelter/adoptions/page.tsx`
- [ ] Diseñar estructura modular de componentes según `.rules.md`
- [x] Definir esquema de emails (plantillas HTML para Resend)
- [ ] Wireframe de modal de confirmación (seguir estilos del proyecto).

### Implementación

**Refactor página principal**

- [ ] Convertir `app/(dashboard)/shelter/adoptions/page.tsx` a Server Component limpio
- [ ] Crear `components/shelter/adoptions/AdoptionsClient.tsx` (Client Component principal)
- [ ] Crear `components/shelter/adoptions/AdoptionsTable.tsx` (tabla de mascotas)
- [ ] Crear `components/shelter/adoptions/ApplicationsList.tsx` (lista de postulaciones por mascota)
- [ ] Crear `components/shelter/adoptions/ApplicationCard.tsx` (tarjeta individual de postulación)
- [ ] Crear `components/shelter/adoptions/ApprovalModal.tsx` (modal para aprobar/rechazar)

**Modal de adopción (usuario)**:

- [ ] Crear components/modals/AdoptionConfirmModal.tsx
- [ ] Integrar en components/PetDetailClient.tsx (botón "Solicitar Adopción")

**Backend**
**Endpoints**

- [ ] Refactorizar `app/api/adoptions/route.ts:`
  - `GET`: Filtrar por rol (adoptante → sus solicitudes, albergue → solicitudes a sus mascotas)
  - `POST`: Crear postulación + enviar email a albergue (RN-012)

- [ ] Crear `app/api/adoptions/[id]/route.ts`:
  - `PATCH`: Actualizar estado + enviar email a adoptante

**Servicios**

- [ ] Crear `lib/services/adoption.service.ts`:
  - `getUserAdoptions(userId)` - para adoptantes
  - `getShelterAdoptions(shelterId, status?)` - para albergues (filtrar por PENDING/APPROVED/REJECTED)
  - `createAdoption(data)` - validar con Zod
  - `updateAdoptionStatus(id, status, performedBy)` - incluir auditoría

- [ ] Crear `lib/services/email.service.ts`:
  - `sendAdoptionNotificationToShelter(adoption)`
  - `sendAdoptionStatusToAdopter(adoption)`

**Validaciones** 

- [ ] Actualizar `lib/validations/adoption.schema.ts`:
  - Schema para creación de postulación
  - Schema para actualización de estado (solo APPROVED/REJECTED permitidos)

**Implementación de emails**

- [X] Configurar Resend en variables de entorno (RESEND_API_KEY)
- [ ] Crear plantillas HTML en lib/email/templates/:
  - `adoption-notification-shelter.html` (notificación a albergue)
  - `adoption-approved.html` (confirmación a adoptante)
  - `adoption-rejected.html` (rechazo a adoptante)

### Testing

- [ ] Unit tests en `lib/services/adoption.service.spec.ts`
- [ ] Integration tests para endpoints de API
- [ ] Test de validaciones Zod
- [ ] Test de envío de emails (mock de Resend)

### Finalización

- [ ] Code review (verificar nomenclatura según .rules.md)
- [ ] Actualizar CHANGELOG.md con entry detallado
- [ ] Verificar cumplimiento de 12_Manual_de_Diseño_UI.pdf (colores, tipografía)
- [ ] Performance check (paginación en tabla si >50 mascotas)

## 🎯 Acceptance Criteria

**Funcionales**

- [ ] Adoptante puede solicitar adopción con modal de confirmación de requisitos
- [ ]  Sistema crea postulación con estado `PENDING` automáticamente
- [ ]  Albergue recibe email inmediatamente al crearse postulación (RN-012)
- [ ]  Albergue ve tabla con todas sus mascotas + botón "Ver postulaciones"
- [ ]  Panel muestra dos secciones: "Activas" (`PENDING`) y "Gestionadas" (`APPROVED`/`REJECTED`)
- [ ]  Albergue puede aprobar/rechazar postulación desde modal de confirmación
- [ ]  Adoptante recibe email al cambiar estado de su postulación
- [ ]  Solo se permite 1 postulación por usuario-mascota (validación en BD + frontend)

**Técnicos**

- [ ] Endpoints siguen estructura RESTful (`GET /api/adoptions`, `PATCH /api/adoptions/[id]`)
- [ ]  Componentes siguen nomenclatura de `.rules.md` (`PascalCase` para componentes, `camelCase` para funciones)
- [ ]  Server Components para fetch de datos, Client Components solo cuando necesario (`"use client"`)
- [ ]  Errores manejados con `try-catch` y mensajes claros al usuario
- [ ]  Queries de Prisma optimizadas con include selectivo (no traer datos innecesarios)
- [ ]  Emails enviados de forma asíncrona (no bloquean respuesta de API)

**UX/UI**

- [ ] Modal de confirmación sigue diseño de `components/ui/modal.tsx`
- [ ] Tabla de postulaciones responsive (mobile-friendly)
- [ ] Badges de estado usan colores definidos en `12_Manual_de_Diseño_UI.pdf`
  - `PENDING`: Amarillo `#F59E0B`
  - `APPROVED`: Verde azulado `#14B8A6`
  - `REJECTED`: Rosa `#EC4899`
- [ ] Loading states en botones de acción
- [ ] Toast notifications para confirmaciones (éxito/error)

## 🔧 Tech Spec

**Stack sugerido:**

- **Frontend**: Next.js 14 App Router, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM, Zod
- **Email**: Resend (SDK oficial)
- **Validación**: Zod schemas
- **Estado**: React hooks (useState, useTransition para acciones de servidor)

**Endpoints/Componentes nuevos:**

**Endpoints**

```text
// app/api/adoptions/route.ts
GET /api/adoptions
  Query params: ?role=shelter|adopter&shelterId=xxx&userId=xxx&status=PENDING|APPROVED|REJECTED
  Response: { adoptions: Adoption[] }

POST /api/adoptions
  Body: { petId: string, userId: string }
  Response: { adoption: Adoption, message: "Solicitud enviada" }
  Side effect: Envía email a albergue

// app/api/adoptions/[id]/route.ts
PATCH /api/adoptions/[id]
  Body: { status: "APPROVED" | "REJECTED", rejectionReason?: string }
  Response: { adoption: Adoption, message: "Estado actualizado" }
  Side effect: Envía email a adoptante
```

**Componentes**

```text
components/
├── shelter/
│   └── adoptions/
│       ├── AdoptionsClient.tsx         (Client, maneja estado y tabs)
│       ├── AdoptionsTable.tsx          (Client, tabla de mascotas)
│       ├── ApplicationsList.tsx        (Client, lista de postulaciones)
│       ├── ApplicationCard.tsx         (Client, tarjeta con botones)
│       └── ApprovalModal.tsx           (Client, modal de confirmación)
└── modals/
    └── AdoptionConfirmModal.tsx        (Client, modal de usuario)
```

**Migrations/Schema changes:**

```sql
-- Ya existe, solo query optimization
-- Agregar índice compuesto para mejorar performance:
CREATE INDEX idx_adoption_shelter_status ON Adoption(shelterId, status);
```

**Dependencies:**

```json
{
  "resend": "^3.0.0" 
}
```

```env
RESEND_API_KEY=re_xxxxxxxxxxxxx
EMAIL_FROM=noreply@pawlig.vercel.app
```

## 📎 Referencias

- Diseño: `12_Manual_de_Diseño_UI.pdf` → Sección 5.4 (Modals), 5.3 (Badges), 10.4 (Dashboard)
- Similar a: `app/(dashboard)/shelter/pets/page.tsx` → Estructura de tabla con acciones; `components/cards/shelter-pet-card.tsx` → Diseño de tarjetas
- Docs: `lib/services/pet.service.ts` → Patrón de servicios; `components/forms/pet-form.tsx` → Manejo de modals y confirmaciones

---

**Para Jules:** Implementar esta funcionalidad siguiendo estrictamente .rules.md y la arquitectura definida en `08_Arquitectura_del_Software.pdf`. Priorizar la separación de responsabilidades (Server Components para datos, Client Components para interactividad). Validar todos los acceptance criteria antes de marcar como completo.
