# HU-004: Visualización del Panel de Usuario

## 📋 Información General

**Historia de Usuario:**

> Como adoptante registrado, quiero acceder a mi panel de usuario personal para ver mis mascotas favoritas guardadas, el estado de mis solicitudes de adopción activas y realizar seguimiento a mis procesos.

**Estado:** ✅ Completado  
**Rama:** `feat/HU-004--Visualización-del-Panel-de-Usuario`  
**Fecha:** 2025-01-XX

---

## 🎯 Criterios de Aceptación

### ✅ Criterio 1: Visualización de Favoritas y Solicitudes

**Dado que** he iniciado sesión como adoptante  
**Cuando** accedo a la sección "Mi Perfil" o "Mi Panel"  
**Entonces** veo una lista de las mascotas que marqué como favoritas y el estado de mis solicitudes de adopción

**Implementación:**

- Ruta `/adopter/profile` protegida con autenticación
- Sistema de tabs para navegar entre favoritas y solicitudes
- Carga asincrónica de datos desde endpoints dedicados
- Información detallada de mascotas y albergues

### ✅ Criterio 2: Notificación de Cambios de Estado

**Dado que** el estado de una de mis solicitudes de adopción ha cambiado  
**Cuando** consulto el panel  
**Entonces** el sistema me muestra una notificación destacada de la actualización del estado

**Implementación:**

- Banner de notificación destacado para cambios recientes (< 24 horas)
- Diferenciación visual por tipo de cambio (aprobado/rechazado)
- Información clara sobre la mascota y el cambio
- Botones de contacto directo con el albergue

---

## 📍 Endpoints Implementados

### 1. Solicitudes de Adopción

#### GET `/api/adopter/adoptions`

Obtiene las solicitudes de adopción del adoptante autenticado.

**Autenticación:** Requerida  
**Método:** GET

**Query Parameters:**

- `status` (opcional): `PENDING` | `APPROVED` | `REJECTED`

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "petId": "string",
      "petName": "string",
      "petSpecies": "string",
      "petBreed": "string | null",
      "petAge": "number | null",
      "petSex": "string | null",
      "petImages": ["string"],
      "shelter": {
        "id": "string",
        "name": "string",
        "municipality": "string",
        "contactWhatsApp": "string",
        "contactInstagram": "string"
      },
      "status": "PENDING | APPROVED | REJECTED",
      "message": "string | null",
      "createdAt": "string",
      "updatedAt": "string",
      "isRecent": "boolean"
    }
  ],
  "total": "number",
  "stats": {
    "pending": "number",
    "approved": "number",
    "rejected": "number"
  }
}
```

**Errores:**

- `401`: No autenticado
- `500`: Error del servidor

---

#### POST `/api/adopter/adoptions`

Crea una nueva solicitud de adopción.

**Autenticación:** Requerida  
**Método:** POST

**Body:**

```json
{
  "petId": "string (requerido)",
  "message": "string (opcional, max 500 caracteres)"
}
```

**Respuesta Exitosa (201):**

```json
{
  "success": true,
  "message": "Solicitud de adopción enviada exitosamente",
  "adoption": {
    "id": "string",
    "petId": "string",
    "petName": "string",
    "shelter": {
      "id": "string",
      "name": "string",
      "municipality": "string"
    },
    "status": "PENDING",
    "createdAt": "string"
  }
}
```

**Errores:**

- `400`: Datos inválidos o mascota no disponible
- `401`: No autenticado
- `404`: Mascota no encontrada
- `409`: Solicitud duplicada
- `500`: Error del servidor

---

### 2. Mascotas Favoritas

#### GET `/api/adopter/favorites`

Obtiene la lista de mascotas favoritas del adoptante autenticado.

**Autenticación:** Requerida  
**Método:** GET

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "name": "string",
      "species": "string",
      "breed": "string | null",
      "age": "number | null",
      "sex": "string | null",
      "status": "string",
      "description": "string",
      "images": ["string"],
      "shelter": {
        "id": "string",
        "name": "string",
        "municipality": "string",
        "contactWhatsApp": "string",
        "contactInstagram": "string"
      },
      "addedToFavoritesAt": "string"
    }
  ],
  "total": "number"
}
```

**Errores:**

- `401`: No autenticado
- `500`: Error del servidor

---

### 3. Toggle de Favorito

#### POST `/api/pets/[id]/favorite`

Agrega o remueve una mascota de los favoritos del usuario (toggle).

**Autenticación:** Requerida  
**Método:** POST  
**Parámetros:** `id` - ID de la mascota

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "message": "Mascota agregada a favoritos" | "Mascota removida de favoritos",
  "isFavorite": "boolean",
  "favorite": {
    "id": "string",
    "userId": "string",
    "petId": "string",
    "createdAt": "string"
  }
}
```

**Errores:**

- `401`: No autenticado
- `404`: Mascota no encontrada
- `500`: Error del servidor

---

## 📁 Archivos Implementados

### Backend (API Routes)

#### 1. `app/api/adopter/adoptions/route.ts`

**Funcionalidad:**

- GET: Obtiene solicitudes de adopción del usuario
- POST: Crea nueva solicitud de adopción

**Características:**

- Autenticación verificada
- Filtrado por estado (opcional)
- Validación de datos
- Prevención de duplicados
- Verificación de mascota disponible
- Cálculo de estadísticas
- Detección de cambios recientes (< 24h)

**Validaciones:**

- `petId`: Requerido, tipo string, mascota debe existir
- `message`: Opcional, máximo 500 caracteres
- Estado de mascota: Debe ser `AVAILABLE`
- Duplicados: Verifica unique constraint `adopterId_petId`

---

#### 2. `app/api/adopter/favorites/route.ts`

**Funcionalidad:**

- GET: Obtiene mascotas favoritas del usuario

**Características:**

- Autenticación verificada
- Include de relaciones (pet + shelter)
- Transformación de respuesta
- Ordenamiento por fecha descendente

---

#### 3. `app/api/pets/[id]/favorite/route.ts`

**Funcionalidad:**

- POST: Toggle de favorito (agregar/remover)

**Características:**

- Autenticación verificada
- Validación de existencia de mascota
- Lógica de toggle automática
- Respuesta con estado actual

---

### Frontend (Páginas)

#### 4. `app/(dashboard)/adopter/profile/page.tsx`

**Tipo:** Server Component  
**Ruta:** `/adopter/profile`

**Funcionalidad:**

- Página principal del panel de adoptante
- Validación de autenticación y rol
- Layout completo (header, main, footer)
- Integración con `AdopterDashboardClient`

**Protecciones:**

- Requiere sesión activa
- Solo rol `ADOPTER` (y `ADMIN` para supervisión)
- Redirect a `/login` si no autenticado
- Redirect a `/unauthorized` si rol incorrecto

**Metadata SEO:**

```typescript
{
  title: 'Mi Panel de Adopción - PawLig',
  description: 'Gestiona tus mascotas favoritas y solicitudes de adopción'
}
```

---

### Frontend (Componentes)

#### 5. `components/adopter/AdopterDashboardClient.tsx`

**Tipo:** Client Component

**Funcionalidad:**

- Componente principal del dashboard
- Sistema de navegación por tabs
- Integra `FavoritesSection` y `AdoptionsSection`

**Props:**

```typescript
interface AdopterDashboardClientProps {
  userSession: {
    id: string;
    name?: string;
    email?: string;
    role?: string;
  };
}
```

**Estados:**

- `activeTab`: 'adoptions' | 'favorites'

**Características:**

- Validación de userSession
- Animación suave al cambiar tabs
- Diseño responsive

---

#### 6. `components/adopter/AdoptionsSection.tsx`

**Tipo:** Client Component

**Funcionalidad:**

- Muestra solicitudes de adopción del usuario
- Filtrado por estado
- Estadísticas en tiempo real
- Notificaciones destacadas

**Props:**

```typescript
interface AdoptionsSectionProps {
  userId: string;
}
```

**Estados:**

- `adoptions`: Array de solicitudes
- `stats`: Estadísticas por estado
- `loading`: Estado de carga
- `error`: Mensaje de error
- `selectedStatus`: Filtro activo
- `notificationAdoption`: Adopción con cambio reciente

**Características:**

- ✅ Carga asincrónica de solicitudes
- ✅ Filtrado por estado (ALL, PENDING, APPROVED, REJECTED)
- ✅ Tarjetas de estadísticas (StatCard)
- ✅ Tarjetas de solicitud (AdoptionCard)
- ✅ Badges visuales por estado
- ✅ Enlaces de contacto directo (WhatsApp, Instagram)
- ✅ Información detallada de mascota y albergue
- ✅ Mensajes del albergue (razón de rechazo)
- ✅ Estados de carga, error y vacío
- ✅ CTA contextual por estado

**Componentes Auxiliares:**

- `StatCard`: Tarjeta de estadística con ícono
- `AdoptionCard`: Tarjeta de solicitud de adopción

---

#### 7. `components/adopter/FavoritesSection.tsx`

**Tipo:** Client Component

**Funcionalidad:**

- Muestra mascotas favoritas del usuario
- Búsqueda en tiempo real
- Remover de favoritos

**Props:**

```typescript
interface FavoritesSectionProps {
  userId: string;
}
```

**Estados:**

- `favorites`: Array de mascotas favoritas
- `loading`: Estado de carga
- `error`: Mensaje de error
- `searchQuery`: Texto de búsqueda

**Características:**

- ✅ Carga asincrónica de favoritos
- ✅ Búsqueda multi-campo (name, species, breed, shelter)
- ✅ Remover mascotas con botón corazón
- ✅ Grid responsive (1-3 columnas)
- ✅ Información detallada de mascota y albergue
- ✅ Estados de carga, error y vacío
- ✅ CTA para explorar mascotas si está vacío

**Componentes Auxiliares:**

- `FavoriteCard`: Tarjeta de mascota favorita

---

#### 8. `components/adopter/NotificationBanner.tsx`

**Tipo:** Client Component

**Funcionalidad:**

- Muestra notificación destacada para cambios de estado
- Diferenciación visual por tipo
- Auto-descarte configurable

**Props:**

```typescript
interface NotificationBannerProps {
  adoption: {
    id: string;
    petId: string;
    petName: string;
    petSpecies: string;
    petBreed: string | null;
    shelter: {
      id: string;
      name: string;
      municipality: string;
      contactWhatsApp?: string;
      contactInstagram?: string;
    };
    status: "PENDING" | "APPROVED" | "REJECTED";
    message: string | null;
    createdAt: string;
    updatedAt: string;
    isRecent: boolean;
  };
}
```

**Estados:**

- `isVisible`: Controla visibilidad del banner
- `autoHide`: Activa auto-descarte

**Características:**

- ✅ Notificación destacada con gradiente
- ✅ Diferenciación visual por estado:
  - **APPROVED**: Verde (8 segundos auto-hide)
  - **REJECTED**: Rojo (5 segundos auto-hide)
  - **PENDING**: Azul
- ✅ Íconos contextuales (CheckCircle, XCircle, Bell)
- ✅ Información clara y concisa
- ✅ Botones de contacto directo (WhatsApp, Instagram)
- ✅ Mostrar motivo del rechazo si aplica
- ✅ Botón de descarte manual
- ✅ Checkbox para auto-descarte
- ✅ Animación de entrada suave
- ✅ Accesible (role="alert")

---

## 🔒 Seguridad Implementada

### Autenticación y Autorización

- ✅ Sesión verificada con `getServerSession(authOptions)`
- ✅ Verificación de rol `ADOPTER` en página y endpoints
- ✅ Redirect automático si no autenticado
- ✅ Validación de propiedad de datos (userId de sesión)

### Validación de Datos

- ✅ Validación de tipos en endpoints
- ✅ Validación de existencia de recursos
- ✅ Prevención de duplicados (unique constraints)
- ✅ Sanitización de inputs

### Manejo de Errores

- ✅ Códigos HTTP apropiados (401, 404, 409, 500)
- ✅ Mensajes específicos por escenario
- ✅ Sin exposición de stack traces
- ✅ Logs de errores en servidor

---

## 🎨 Diseño y UX

### Paleta de Colores

- **Primary:** Purple-600 (botones, enlaces)
- **Success:** Green-600 (aprobado)
- **Error:** Red-600 (rechazado)
- **Warning:** Yellow-600 (pendiente)
- **Neutral:** Gray-50 a Gray-900

### Componentes Visuales

- **Badges:** Indicadores de estado con colores contextuales
- **Cards:** Tarjetas con sombra y hover effects
- **Gradients:** Fondos degradados para notificaciones
- **Icons:** Lucide React (CheckCircle, XCircle, Clock, Heart, etc.)

### Responsive Design

- **Mobile:** 1 columna
- **Tablet:** 2 columnas
- **Desktop:** 3 columnas
- **Breakpoints:** Tailwind CSS (sm, md, lg)

### Animaciones

- **Fade in:** Transición suave al cambiar tabs
- **Slide in:** Entrada de notificaciones
- **Hover:** Efectos en botones y cards
- **Loading:** Spinner animado

---

## 🧪 Flujos de Usuario

### Flujo 1: Ver Solicitudes de Adopción

1. Usuario inicia sesión como ADOPTER
2. Navega a `/adopter/profile`
3. Por defecto, ve tab "Mis Solicitudes de Adopción"
4. Sistema carga solicitudes desde `/api/adopter/adoptions`
5. Usuario ve:
   - Estadísticas (pendientes, aprobadas, rechazadas)
   - Filtros por estado
   - Lista de solicitudes con información detallada
   - Notificación destacada si hay cambios recientes

### Flujo 2: Ver Mascotas Favoritas

1. Usuario está en `/adopter/profile`
2. Click en tab "Mis Mascotas Favoritas"
3. Sistema carga favoritos desde `/api/adopter/favorites`
4. Usuario ve:
   - Barra de búsqueda
   - Grid de mascotas favoritas
   - Botón para remover de favoritos
   - Botón para ver detalles

### Flujo 3: Crear Solicitud de Adopción

1. Usuario explora mascotas en `/adopciones`
2. Click en "Solicitar adopción" en detalle de mascota
3. Sistema envía POST a `/api/adopter/adoptions`
4. Validaciones:
   - Mascota debe estar disponible
   - No debe existir solicitud previa
5. Si éxito:
   - Solicitud creada con estado PENDING
   - Usuario redirigido a `/adopter/profile`
   - Ve su nueva solicitud en el panel

### Flujo 4: Recibir Notificación de Cambio

1. Albergue cambia estado de solicitud (PENDING → APPROVED/REJECTED)
2. Usuario accede a `/adopter/profile`
3. Sistema detecta cambio reciente (< 24h)
4. Muestra `NotificationBanner` destacado
5. Usuario ve:
   - Mensaje claro sobre el cambio
   - Información de la mascota
   - Botones de contacto (si aprobado)
   - Motivo del rechazo (si rechazado)

### Flujo 5: Agregar/Remover Favorito

1. Usuario ve mascota en galería o detalle
2. Click en botón corazón
3. Sistema envía POST a `/api/pets/[id]/favorite`
4. Toggle automático:
   - Si no existe → Crea favorito
   - Si existe → Elimina favorito
5. Actualización visual inmediata

---

## 📊 Estadísticas y Métricas

### Datos Calculados

- **Total de solicitudes:** Count de adoptions por usuario
- **Solicitudes pendientes:** Count con status PENDING
- **Solicitudes aprobadas:** Count con status APPROVED
- **Solicitudes rechazadas:** Count con status REJECTED
- **Total de favoritos:** Count de favorites por usuario

### Detección de Cambios Recientes

```typescript
function isRecentUpdate(updatedAt: Date): boolean {
  const now = new Date();
  const diffInMs = now.getTime() - updatedAt.getTime();
  const diffInHours = diffInMs / (1000 * 60 * 60);
  return diffInHours < 24;
}
```

---

## 🔄 Estados de la Aplicación

### Estados de Carga

- **Loading:** Spinner animado con mensaje
- **Error:** Mensaje de error con botón de reintentar
- **Empty:** Mensaje descriptivo con CTA
- **Success:** Datos cargados y mostrados

### Estados de Solicitud

- **PENDING:** Amarillo, ícono Clock
- **APPROVED:** Verde, ícono CheckCircle
- **REJECTED:** Rojo, ícono XCircle

### Estados de Mascota

- **AVAILABLE:** Disponible para adopción
- **IN_PROCESS:** En proceso de adopción
- **ADOPTED:** Ya adoptada

---

## 🚀 Mejoras Futuras

### Corto Plazo

1. Implementar paginación en solicitudes y favoritos
2. Agregar ordenamiento personalizado
3. Notificaciones push en tiempo real
4. Exportar historial de solicitudes (PDF)

### Mediano Plazo

1. Chat directo con albergues
2. Sistema de calificaciones post-adopción
3. Recordatorios de seguimiento
4. Galería de fotos de mascotas adoptadas

### Largo Plazo

1. App móvil nativa
2. Integración con redes sociales
3. Sistema de recomendaciones basado en preferencias
4. Comunidad de adoptantes

---

## 📝 Notas Técnicas

### Dependencias

- **Next.js 14:** App Router, Server Components
- **NextAuth.js:** Autenticación
- **Prisma:** ORM para MongoDB
- **Tailwind CSS:** Estilos
- **Lucide React:** Iconos
- **TypeScript:** Tipado estático

### Optimizaciones

- Server Components para SEO y performance
- Client Components solo donde se necesita interactividad
- Carga asincrónica de datos
- Transformación de respuestas en backend
- Select específico de campos en queries

### Consideraciones

- Notificaciones solo para cambios < 24h
- Auto-hide configurable por usuario
- Búsqueda case-insensitive
- Responsive design mobile-first

---

## ✅ Checklist de Implementación

- [x] Endpoint GET `/api/adopter/adoptions`
- [x] Endpoint POST `/api/adopter/adoptions`
- [x] Endpoint GET `/api/adopter/favorites`
- [x] Endpoint POST `/api/pets/[id]/favorite`
- [x] Página `/adopter/profile`
- [x] Componente `AdopterDashboardClient`
- [x] Componente `AdoptionsSection`
- [x] Componente `FavoritesSection`
- [x] Componente `NotificationBanner`
- [x] Protección de rutas
- [x] Validación de datos
- [x] Manejo de errores
- [x] Estados de carga
- [x] Responsive design
- [x] Accesibilidad
- [x] Documentación

---

## 📞 Contacto

**Equipo:** Andrés Ospina (Líder), Mateo Úsuga, Santiago Lezcano  
**Instructor:** Mateo Arroyave Quintero  
**Proyecto:** PawLig - SENA 2025

---

**Última actualización:** 2025-01-XX  
**Estado:** ✅ Completado y validado
