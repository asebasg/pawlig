# TAREA-024: Panel de Postulaciones para Albergues

## 📋 Información General

**Descripción:**

> Desarrollar panel de postulaciones para albergues con vista de lista de postulaciones pendientes, acciones de aprobar/rechazar y actualización automática de estado de mascota.

**Estado:** ✅ Completado  
**Rama:** `feat/tarea-024-panel-postulaciones-albergues`  
**Fecha:** 2025-01-XX

---

## 🎯 Objetivos Cumplidos

### Funcionalidad Implementada:

- ✅ Vista `/dashboard/shelter/adoptions` - Panel de postulaciones
- ✅ Lista de postulaciones pendientes con filtros
- ✅ Acciones de aprobar/rechazar con validación
- ✅ Actualización automática de estado de mascota
- ✅ Estadísticas en tiempo real
- ✅ Paginación y filtros avanzados

---

## 📍 Endpoints Implementados

### 1. Listar Postulaciones del Albergue

#### GET `/api/shelters/adoptions`

Obtiene la lista de postulaciones del albergue autenticado.

**Autenticación:** Requerida (SHELTER)  
**Método:** GET

**Query Parameters:**

- `status` (opcional): `PENDING` | `APPROVED` | `REJECTED`
- `petId` (opcional): Filtrar por mascota específica
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Resultados por página (default: 20, max: 50)

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "status": "PENDING | APPROVED | REJECTED",
      "message": "string | null",
      "createdAt": "string",
      "updatedAt": "string",
      "adopter": {
        "id": "string",
        "name": "string",
        "email": "string",
        "phone": "string",
        "municipality": "string",
        "address": "string",
        "createdAt": "string"
      },
      "pet": {
        "id": "string",
        "name": "string",
        "species": "string",
        "breed": "string | null",
        "age": "number | null",
        "sex": "string | null",
        "images": ["string"],
        "status": "string"
      }
    }
  ],
  "pagination": {
    "page": "number",
    "limit": "number",
    "totalCount": "number",
    "totalPages": "number",
    "hasNextPage": "boolean",
    "hasPrevPage": "boolean"
  },
  "filters": {
    "status": "string",
    "petId": "string | null"
  }
}
```

**Errores:**

- `401`: No autenticado
- `403`: No es SHELTER
- `404`: Albergue no encontrado
- `500`: Error del servidor

---

### 2. Cambiar Estado de Postulación

#### PATCH `/api/adoptions/[id]`

Aprueba o rechaza una postulación y actualiza automáticamente el estado de la mascota.

**Autenticación:** Requerida (SHELTER)  
**Método:** PATCH

**Body:**

```json
{
  "status": "APPROVED | REJECTED",
  "rejectionReason": "string (requerido si status es REJECTED)"
}
```

**Respuesta Exitosa (200):**

```json
{
  "message": "Postulación actualizada exitosamente",
  "code": "ADOPTION_UPDATED",
  "data": {
    "adoptionId": "string",
    "status": "APPROVED | REJECTED",
    "petStatusUpdate": "IN_PROCESS | ADOPTED | AVAILABLE | null",
    "adopter": {
      "id": "string",
      "email": "string",
      "name": "string"
    },
    "pet": {
      "id": "string",
      "name": "string",
      "newStatus": "string"
    },
    "updatedAt": "string"
  }
}
```

**Lógica de Actualización Automática:**

```
PENDING → APPROVED:
  - Adoption.status = APPROVED
  - Pet.status = IN_PROCESS
  - Si es la única APPROVED: Pet.status = ADOPTED

PENDING → REJECTED:
  - Adoption.status = REJECTED
  - Adoption.message = rejectionReason (obligatorio)
  - Si no hay otras APPROVED: Pet.status = AVAILABLE
```

**Errores:**

- `400`: Datos inválidos o razón de rechazo faltante
- `401`: No autenticado
- `403`: No es SHELTER o no es propietario
- `404`: Postulación o albergue no encontrado
- `500`: Error del servidor

---

## 📁 Archivos Implementados

### Backend (API Routes)

#### 1. `app/api/shelters/adoptions/route.ts`

**Funcionalidad:**

- GET: Obtiene postulaciones del albergue autenticado

**Características:**

- Autenticación verificada (SHELTER)
- Filtros: status, petId
- Paginación: page, limit
- Include de relaciones (adopter, pet)
- Ordenamiento por fecha descendente
- Cálculo de metadatos de paginación

**Validaciones:**

- Usuario debe tener rol SHELTER
- Usuario debe tener albergue registrado
- Query params validados con Zod
- Límite máximo de 50 resultados por página

**Performance:**

- Promise.all para findMany + count simultáneos
- Select específico de campos necesarios
- Índices en Adoption para status, createdAt

---

#### 2. `app/api/adoptions/[id]/route.ts`

**Funcionalidad:**

- PATCH: Cambia estado de postulación (aprobar/rechazar)

**Características:**

- Autenticación verificada (SHELTER)
- Validación de propiedad del albergue
- Transacción Prisma para consistencia
- Actualización automática de estado de mascota
- Lógica de negocio compleja

**Validaciones:**

- Usuario debe ser propietario del albergue de la mascota
- Razón de rechazo obligatoria si status es REJECTED
- Postulación debe existir
- Validación con adoptionStatusChangeSchema

**Transacción:**

```typescript
await prisma.$transaction(async (tx) => {
  // 1. Actualizar adoption
  const updatedAdoption = await tx.adoption.update({...});

  // 2. Actualizar pet status automáticamente
  if (status === 'APPROVED') {
    await tx.pet.update({ status: 'IN_PROCESS' });
    // Si es única APPROVED: status = 'ADOPTED'
  } else if (status === 'REJECTED') {
    // Si no hay otras APPROVED: status = 'AVAILABLE'
  }

  return { adoption, petStatusUpdate };
});
```

**Lógica de Negocio:**

- APPROVED: Pet → IN_PROCESS → ADOPTED (si única)
- REJECTED: Pet → AVAILABLE (si no hay otras APPROVED)
- Garantiza consistencia entre Adoption y Pet
- Rollback automático si hay error

---

### Frontend (Páginas)

#### 3. `app/(dashboard)/shelter/adoptions/page.tsx`

**Tipo:** Server Component  
**Ruta:** `/dashboard/shelter/adoptions`

**Funcionalidad:**

- Página principal del panel de postulaciones
- Validación de autenticación y rol SHELTER
- Carga de estadísticas en servidor (SSR)
- Layout completo con header, stats y panel

**Protecciones:**

- Requiere sesión activa
- Solo rol SHELTER
- Usuario debe tener albergue registrado
- Redirect a `/login` si no autenticado
- Redirect a `/unauthorized` si rol incorrecto

**Estadísticas Calculadas:**

```typescript
const stats = {
  pending: count de PENDING,
  approved: count de APPROVED,
  rejected: count de REJECTED,
  total: suma de todos
};
```

**Información Mostrada:**

- Nombre del albergue
- Cantidad de mascotas registradas
- Postulaciones pendientes
- Estado de verificación del albergue
- Tarjetas de estadísticas con colores

**Metadata SEO:**

```typescript
{
  title: 'Postulaciones - Panel del Albergue',
  description: 'Gestiona las postulaciones de adopción de tu albergue'
}
```

---

### Frontend (Componentes)

#### 4. `components/adoption-applications-client.tsx`

**Tipo:** Client Component

**Funcionalidad:**

- Tabla interactiva de postulaciones
- Filtros por estado
- Paginación
- Modales de aprobación/rechazo
- Actualización en tiempo real

**Estados:**

```typescript
- applications: Array de postulaciones
- loading: Estado de carga
- error: Mensaje de error
- selectedStatus: Filtro activo
- currentPage: Página actual
- modalState: Estado de modales (approve/reject)
```

**Características:**

- ✅ Carga asincrónica de postulaciones
- ✅ Filtrado por estado (ALL, PENDING, APPROVED, REJECTED)
- ✅ Paginación con navegación
- ✅ Modal de confirmación para aprobar
- ✅ Modal con textarea para rechazar (razón obligatoria)
- ✅ Actualización optimista del estado local
- ✅ Información detallada del adoptante
- ✅ Información detallada de la mascota
- ✅ Badges visuales por estado
- ✅ Estados de carga, error y vacío
- ✅ Responsive design

**Acciones:**

- Aprobar postulación (con confirmación)
- Rechazar postulación (con razón obligatoria)
- Filtrar por estado
- Navegar entre páginas
- Ver detalles de adoptante y mascota

---

### Validaciones

#### 5. `lib/validations/adoption.schema.ts`

**Funcionalidad:**

- Schemas Zod para validación de postulaciones

**Schemas Definidos:**

##### `adoptionStatusChangeSchema`

```typescript
z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
  rejectionReason: z
    .string()
    .min(10, "Razón debe tener al menos 10 caracteres")
    .max(500, "Razón no puede exceder 500 caracteres")
    .optional(),
}).refine((data) => data.status !== "REJECTED" || data.rejectionReason, {
  message: "Razón de rechazo es obligatoria",
});
```

##### `adoptionQueryStringSchema`

```typescript
z.object({
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
  petId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});
```

**Validaciones:**

- Status debe ser enum válido
- Razón de rechazo obligatoria si status es REJECTED
- Razón debe tener 10-500 caracteres
- petId debe ser ObjectId válido
- page debe ser número positivo
- limit entre 1 y 50

---

## 🔒 Seguridad Implementada

### Autenticación y Autorización

- ✅ Sesión verificada con `getServerSession(authOptions)`
- ✅ Verificación de rol SHELTER en página y endpoints
- ✅ Verificación de propiedad del albergue
- ✅ Validación de propiedad de la mascota
- ✅ Redirect automático si no autenticado

### Validación de Datos

- ✅ Validación con Zod en cliente y servidor
- ✅ Razón de rechazo obligatoria
- ✅ Validación de tipos y formatos
- ✅ Sanitización de inputs

### Transacciones

- ✅ Uso de `prisma.$transaction` para consistencia
- ✅ Rollback automático si hay error
- ✅ Garantiza que Adoption y Pet se actualizan juntos
- ✅ Evita estados inconsistentes

### Manejo de Errores

- ✅ Códigos HTTP apropiados (401, 403, 400, 404, 500)
- ✅ Mensajes específicos por escenario
- ✅ Sin exposición de stack traces
- ✅ Logs de errores en servidor

---

## 🎨 Diseño y UX

### Paleta de Colores

- **Pending:** Yellow-600 (amarillo)
- **Approved:** Green-600 (verde)
- **Rejected:** Red-600 (rojo)
- **Neutral:** Gray-50 a Gray-900

### Componentes Visuales

- **Tarjetas de estadísticas:** Con colores diferenciados
- **Tabla de postulaciones:** Responsive con scroll horizontal
- **Badges de estado:** Colores contextuales
- **Modales:** Confirmación y rechazo con formulario
- **Botones:** Primary (aprobar), Danger (rechazar)

### Responsive Design

- **Mobile:** Tabla con scroll horizontal
- **Tablet:** 2 columnas en stats
- **Desktop:** 4 columnas en stats
- **Breakpoints:** Tailwind CSS (sm, md, lg)

### Estados Visuales

- **Loading:** Spinner animado
- **Error:** Mensaje con botón de reintentar
- **Empty:** Mensaje descriptivo con ilustración
- **Success:** Mensaje de confirmación

---

## 🔄 Flujos de Usuario

### Flujo 1: Ver Postulaciones

1. Albergue inicia sesión como SHELTER
2. Navega a `/dashboard/shelter/adoptions`
3. Sistema carga estadísticas en servidor
4. Sistema carga postulaciones desde `/api/shelters/adoptions`
5. Usuario ve:
   - Estadísticas (total, pendientes, aprobadas, rechazadas)
   - Tabla de postulaciones
   - Filtros por estado
   - Paginación

### Flujo 2: Aprobar Postulación

1. Usuario está en panel de postulaciones
2. Click en botón "Aprobar" de una postulación PENDING
3. Sistema muestra modal de confirmación
4. Usuario confirma aprobación
5. Sistema envía PATCH a `/api/adoptions/[id]`
6. Backend:
   - Valida propiedad del albergue
   - Actualiza Adoption.status = APPROVED
   - Actualiza Pet.status = IN_PROCESS
   - Si es única APPROVED: Pet.status = ADOPTED
7. Frontend:
   - Actualiza estado local
   - Muestra mensaje de éxito
   - Actualiza estadísticas
8. Postulación aparece en sección "Aprobadas"

### Flujo 3: Rechazar Postulación

1. Usuario está en panel de postulaciones
2. Click en botón "Rechazar" de una postulación PENDING
3. Sistema muestra modal con textarea
4. Usuario escribe razón del rechazo (mínimo 10 caracteres)
5. Usuario confirma rechazo
6. Sistema envía PATCH a `/api/adoptions/[id]`
7. Backend:
   - Valida razón de rechazo
   - Actualiza Adoption.status = REJECTED
   - Guarda Adoption.message = rejectionReason
   - Si no hay otras APPROVED: Pet.status = AVAILABLE
8. Frontend:
   - Actualiza estado local
   - Muestra mensaje de éxito
   - Actualiza estadísticas
9. Postulación aparece en sección "Rechazadas"

### Flujo 4: Filtrar Postulaciones

1. Usuario está en panel de postulaciones
2. Click en filtro (Todas, Pendientes, Aprobadas, Rechazadas)
3. Sistema actualiza query param `status`
4. Sistema recarga postulaciones con filtro
5. Tabla muestra solo postulaciones del estado seleccionado
6. Contador en botón de filtro se actualiza

### Flujo 5: Navegar entre Páginas

1. Usuario está en panel de postulaciones
2. Click en botón "Siguiente" o "Anterior"
3. Sistema actualiza query param `page`
4. Sistema recarga postulaciones de la página solicitada
5. Tabla muestra nuevas postulaciones
6. Indicador de página se actualiza

---

## 📊 Lógica de Negocio

### Estados de Postulación

```
PENDING: Nueva postulación, espera revisión
APPROVED: Postulación aceptada por el albergue
REJECTED: Postulación rechazada por el albergue
```

### Estados de Mascota

```
AVAILABLE: Disponible para adopción
IN_PROCESS: En proceso de adopción
ADOPTED: Ya adoptada
```

### Transiciones de Estado

#### Aprobar Postulación:

```
1. Adoption: PENDING → APPROVED
2. Pet: AVAILABLE → IN_PROCESS
3. Verificar count de APPROVED para esta mascota
4. Si count === 1: Pet: IN_PROCESS → ADOPTED
```

#### Rechazar Postulación:

```
1. Adoption: PENDING → REJECTED
2. Adoption.message = rejectionReason
3. Verificar si hay otras APPROVED para esta mascota
4. Si NO hay otras APPROVED:
   - Si Pet.status === IN_PROCESS: Pet → AVAILABLE
```

### Reglas de Negocio

- ✅ Solo una adopción APPROVED por mascota
- ✅ Si se aprueba: automáticamente ADOPTED
- ✅ Razón de rechazo obligatoria
- ✅ Transacción garantiza consistencia
- ✅ No se puede aprobar si mascota ya ADOPTED

---

## 🧪 Escenarios de Testing

### Escenario 1: Aprobar Postulación Exitosamente

**Precondiciones:**

- Usuario autenticado como SHELTER
- Albergue tiene mascota con postulación PENDING
- Mascota en estado AVAILABLE

**Pasos:**

1. Acceder a `/dashboard/shelter/adoptions`
2. Click en "Aprobar" en postulación PENDING
3. Confirmar en modal

**Resultado Esperado:**

- ✅ Postulación cambia a APPROVED
- ✅ Mascota cambia a ADOPTED
- ✅ Mensaje de éxito mostrado
- ✅ Estadísticas actualizadas

---

### Escenario 2: Rechazar Postulación con Razón

**Precondiciones:**

- Usuario autenticado como SHELTER
- Albergue tiene mascota con postulación PENDING

**Pasos:**

1. Acceder a `/dashboard/shelter/adoptions`
2. Click en "Rechazar" en postulación PENDING
3. Escribir razón (mínimo 10 caracteres)
4. Confirmar rechazo

**Resultado Esperado:**

- ✅ Postulación cambia a REJECTED
- ✅ Razón guardada en Adoption.message
- ✅ Mascota vuelve a AVAILABLE (si no hay otras APPROVED)
- ✅ Mensaje de éxito mostrado

---

### Escenario 3: Rechazar sin Razón (Error)

**Precondiciones:**

- Usuario autenticado como SHELTER
- Albergue tiene mascota con postulación PENDING

**Pasos:**

1. Acceder a `/dashboard/shelter/adoptions`
2. Click en "Rechazar" en postulación PENDING
3. Dejar textarea vacío o con menos de 10 caracteres
4. Intentar confirmar

**Resultado Esperado:**

- ❌ Error de validación
- ❌ Mensaje: "Razón de rechazo es obligatoria"
- ❌ No se actualiza la postulación

---

### Escenario 4: Filtrar por Estado

**Precondiciones:**

- Usuario autenticado como SHELTER
- Albergue tiene postulaciones en diferentes estados

**Pasos:**

1. Acceder a `/dashboard/shelter/adoptions`
2. Click en filtro "Pendientes"

**Resultado Esperado:**

- ✅ Solo muestra postulaciones PENDING
- ✅ Contador en botón actualizado
- ✅ URL incluye `?status=PENDING`

---

### Escenario 5: Paginación

**Precondiciones:**

- Usuario autenticado como SHELTER
- Albergue tiene más de 20 postulaciones

**Pasos:**

1. Acceder a `/dashboard/shelter/adoptions`
2. Scroll hasta paginación
3. Click en "Siguiente"

**Resultado Esperado:**

- ✅ Carga página 2
- ✅ Muestra postulaciones 21-40
- ✅ URL incluye `?page=2`
- ✅ Botón "Anterior" habilitado

---

## 📈 Estadísticas y Métricas

### Datos Calculados en Servidor (SSR):

```typescript
const adoptionStats = await prisma.adoption.groupBy({
  by: ['status'],
  where: { pet: { shelterId: shelter.id } },
  _count: true
});

const stats = {
  pending: count de PENDING,
  approved: count de APPROVED,
  rejected: count de REJECTED,
  total: suma de todos
};
```

### Datos Calculados en Cliente:

- Total de postulaciones en página actual
- Número de página actual
- Total de páginas
- Tiene página siguiente/anterior

---

## 🔧 Configuración y Dependencias

### Dependencias Utilizadas:

- **Next.js 14:** App Router, Server Components
- **NextAuth.js:** Autenticación
- **Prisma:** ORM para MongoDB
- **Tailwind CSS:** Estilos
- **Lucide React:** Iconos
- **TypeScript:** Tipado estático
- **Zod:** Validación de datos

### Variables de Entorno:

```env
DATABASE_URL=mongodb+srv://...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
```

---

## 🚀 Mejoras Futuras

### Corto Plazo:

1. Notificaciones push al adoptante cuando cambia estado
2. Email automático al aprobar/rechazar
3. Exportar lista de postulaciones (CSV/PDF)
4. Búsqueda por nombre de adoptante o mascota

### Mediano Plazo:

1. Chat directo entre albergue y adoptante
2. Sistema de comentarios en postulaciones
3. Historial de cambios de estado
4. Dashboard con gráficas de estadísticas

### Largo Plazo:

1. IA para sugerir aprobaciones basadas en perfil
2. Sistema de scoring de adoptantes
3. Integración con sistema de seguimiento post-adopción
4. App móvil para albergues

---

## 📝 Notas Técnicas

### Transacciones Prisma:

```typescript
// Garantiza consistencia entre Adoption y Pet
await prisma.$transaction(async (tx) => {
  // Todas las operaciones dentro de la transacción
  // Si una falla, todas hacen rollback
});
```

### Performance:

- Promise.all para queries paralelas
- Select específico de campos necesarios
- Índices en Adoption (status, createdAt, petId)
- Paginación para evitar cargas grandes

### Seguridad:

- Validación en cliente y servidor
- Transacciones para consistencia
- Verificación de propiedad en cada operación
- Logs de auditoría en servidor

---

## ✅ Checklist de Implementación

- [x] Endpoint GET `/api/shelters/adoptions`
- [x] Endpoint PATCH `/api/adoptions/[id]`
- [x] Página `/dashboard/shelter/adoptions`
- [x] Componente `adoption-applications-client.tsx`
- [x] Schema `adoption.schema.ts`
- [x] Validación de datos con Zod
- [x] Transacciones Prisma
- [x] Actualización automática de estado de mascota
- [x] Filtros por estado
- [x] Paginación
- [x] Modales de confirmación
- [x] Estadísticas en tiempo real
- [x] Responsive design
- [x] Manejo de errores
- [x] Estados de carga
- [x] Documentación completa

---

## 📞 Contacto

**Equipo:** Andrés Ospina (Líder), Mateo Úsuga, Santiago Lezcano  
**Instructor:** Mateo Arroyave Quintero  
**Proyecto:** PawLig - SENA 2025

---

**Última actualización:** 2025-11-27  
**Estado:** ✅ Completado y validado
