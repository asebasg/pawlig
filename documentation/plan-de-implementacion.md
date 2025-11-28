# Plan de Implementación - TAREA-018: Dashboard de Usuario

## 1. Estructura de Archivos

```
src/
├── app/
│   └── (dashboard)/
│       └── user/
│           ├── page.tsx              # Dashboard principal
│           ├── favorites/
│           │   └── page.tsx          # Vista completa favoritos
│           └── adoptions/
│               └── page.tsx          # Vista completa postulaciones
├── components/
│   ├── dashboard/
│   │   ├── user-stats.tsx           # Estadísticas del usuario
│   │   ├── favorites-section.tsx    # Sección favoritos
│   │   └── adoptions-section.tsx    # Sección postulaciones
│   └── cards/
│       └── favorite-pet-card.tsx    # Card de mascota favorita
└── lib/
    └── services/
        ├── favorite.service.ts      # Lógica de favoritos
        └── adoption.service.ts      # Lógica de postulaciones
```

---

## 2. Implementación por Componentes

### 2.1. Dashboard Principal (/user/page.tsx)

Estructura visual:

Header con saludo personalizado: "Hola, [Nombre]"
Estadísticas rápidas (cards pequeñas):

Mascotas favoritas (cantidad)
Postulaciones activas (cantidad)
Postulaciones aprobadas (cantidad)

Secciones principales:

Mis Favoritos (muestra últimos 4)

Grid 4 cols (desktop), 2 (tablet), 1 (móvil)
Enlace "Ver todas" → /user/favorites
Mensaje si vacío: "Aún no tienes mascotas favoritas"

Mis Postulaciones (muestra últimas 3)

Lista con estado visual
Filtros rápidos: Pendientes, Aprobadas, Rechazadas
Enlace "Ver todas" → /user/adoptions

---

### 2.2. UserStats.tsx

Métricas a mostrar:
typescript{
favoritesCount: number
pendingAdoptions: number
approvedAdoptions: number
rejectedAdoptions: number
}
Diseño:

Grid 4 cards (desktop), 2 (móvil)
Ícono temático por métrica
Número grande (Poppins Bold 32px)
Descripción pequeña (Inter Regular 14px)

2.3. FavoritesSectiontsx
Funcionalidades:

Fetch últimos 4 favoritos del usuario
Muestra FavoritePetCard por cada mascota
Botón de eliminación rápida (ícono ❤ relleno)
Click en card → redirige a /adopciones/[id]

Estado vacío:

Ícono 64px (corazón vacío)
Mensaje: "Aún no tienes mascotas favoritas"
CTA: "Explorar mascotas disponibles" → /adopciones

2.4. AdoptionsSection.tsx
Información por postulación:

Foto de la mascota (thumbnail 80x80)
Nombre de la mascota
Albergue
Fecha de postulación
Estado con badge (PENDING/APPROVED/REJECTED)
Botón "Ver detalles"

Estados visuales (badges):

🟡 PENDING: Fondo amarillo, "Pendiente"
🟢 APPROVED: Fondo verde azulado, "Aprobada"
🔴 REJECTED: Fondo rosa, "Rechazada"

2.5. FavoritePetCard.tsx
Diseño diferenciado de PetCard:

Ícono de corazón relleno en esquina superior derecha
Click en corazón → elimina de favoritos (con confirmación)
Misma info base: foto, nombre, edad, municipio
Hover: elevación + efecto visual
Click en card → detalle mascota

Props:
typescript{
favoriteId: string # ID del registro Favorite
pet: {
id: string
name: string
age?: number
municipality: Municipality
images: string[]
shelter: { name: string }
}
onRemove?: () => void # Callback eliminación
} 3. Páginas Secundarias
3.1. /user/favorites/page.tsx
Vista completa de favoritos:

Grid responsive (mismo que galería pública)
Todas las mascotas favoritas sin límite
Filtros opcionales (especie, municipio)
Paginación cada 20 resultados
Opción "Eliminar todos" con confirmación

3.2. /user/adoptions/page.tsx
Vista completa de postulaciones:

Lista detallada con tarjetas expandibles
Filtros por estado (tabs superiores)
Ordenar por: Más reciente, Más antigua
Información completa por postulación:

Foto y datos de mascota
Mensaje enviado al albergue
Fecha de postulación
Estado actual
Botón "Contactar albergue" (si aprobada)

Acciones disponibles:

Ver detalle completo de mascota
Contactar albergue (WhatsApp/Instagram)
Ver historial de cambios de estado

4. Lógica de Negocio
   4.1. favorite.service.ts
   Funciones:
   typescriptgetUserFavorites(userId: string, limit?: number): Promise<Favorite[]>
   addFavorite(userId: string, petId: string): Promise<Favorite>
   removeFavorite(favoriteId: string): Promise<void>
   isFavorite(userId: string, petId: string): Promise<boolean>
   Query Prisma:

Include: { pet: { include: { shelter: true } } }
OrderBy: createdAt DESC
Where: userId, pet.status = AVAILABLE

4.2. adoption.service.ts
Funciones:
typescriptgetUserAdoptions(userId: string, status?: AdoptionStatus): Promise<Adoption[]>
getAdoptionById(id: string): Promise<Adoption | null>
getAdoptionStats(userId: string): Promise<AdoptionStats>
AdoptionStats:
typescript{
total: number
pending: number
approved: number
rejected: number
} 5. Protección de Rutas
Middleware de autenticación:

Verificar sesión activa (NextAuth)
Validar rol = ADOPTER
Redirigir a /login si no autenticado
Mostrar 403 si rol incorrecto

En layout.tsx de (dashboard):

Sidebar de navegación (desktop)
Navbar con foto de perfil
Links: Mi Panel, Favoritos, Mis Postulaciones, Mi Perfil

6. Responsive Design
   Desktop (>1024px):

Sidebar fijo 240px
Contenido principal con padding 32px
Grid favoritos 4 columnas
Estadísticas en una fila

Tablet (640-1024px):

Sidebar colapsable
Grid favoritos 2 columnas
Estadísticas 2x2

Móvil (<640px):

Drawer para navegación
Grid favoritos 1 columna
Estadísticas apiladas
Padding 16px

7. Estados de Carga y Vacíos
   Loading states:

Skeleton loader para favoritos (4 cards)
Skeleton loader para postulaciones (3 items)
Shimmer animation (#F3F4F6 → #E5E7EB)

Empty states:

Sin favoritos:

Ícono corazón 64px gris
"Aún no tienes mascotas favoritas"
Botón "Explorar mascotas"

Sin postulaciones:

Ícono lista 64px gris
"No tienes postulaciones activas"
Botón "Ver mascotas disponibles"

8. Interacciones
   8.1. Agregar/Eliminar Favoritos
   Flujo agregar:

Usuario hace click en ❤ (desde galería o detalle)
Validar autenticación
Crear registro en tabla Favorite
Actualizar UI (corazón relleno)
Toast: "Agregado a favoritos"

Flujo eliminar:

Usuario hace click en ❤ relleno
Modal confirmación: "¿Eliminar de favoritos?"
DELETE en tabla Favorite
Actualizar UI (corazón vacío)
Toast: "Eliminado de favoritos"

8.2. Ver Detalles de Postulación
Modal o página expandida:

Información completa de mascota
Mensaje enviado al albergue
Timeline de cambios de estado
Datos de contacto del albergue (si aprobada)
Botón "Contactar albergue"

9. Notificaciones
   Tipos de notificaciones:

Cambio de estado de postulación (email)
Mascota favorita adoptada por otro (opcional)
Recordatorio de postulaciones pendientes (semanal)

Integración con Resend:

Template para postulación aprobada
Template para postulación rechazada
Template de recordatorio

10. Trazabilidad con Documentación
    Cumple con:

HU-004: Visualización del Panel de Usuario
RF-005: Gestión de favoritos
CU-006: Postular para adopción
Adoption model en Prisma schema
Favorite model en Prisma schema

Referencias de diseño:

Manual UI: Sección 10.4 (Dashboard)
Mockup: Pantallas de usuario
Arquitectura: Server Components + Client Components

11. Optimizaciones
    Performance:

Server Components para fetch inicial
Client Components solo para interacciones
Prisma select específico (evitar overfetching)
Revalidación cada 60s (ISR)

UX:

Transiciones suaves (transition: all 0.2s ease)
Feedback inmediato en acciones
Optimistic updates al agregar/eliminar favoritos
Confirmaciones para acciones destructivas

12. Orden de Implementación

Modelo Favorite en Prisma (si no existe)
favorite.service.ts (lógica de favoritos)
adoption.service.ts (lógica de postulaciones)
FavoritePetCard.tsx (componente base)
UserStats.tsx (estadísticas)
FavoritesSection.tsx (sección favoritos)
AdoptionsSection.tsx (sección postulaciones)
/user/page.tsx (dashboard principal)
/user/favorites/page.tsx (vista completa)
/user/adoptions/page.tsx (vista completa)
Middleware de protección (auth)
Pruebas (CP-004: Panel de usuario)

13. Consideraciones Especiales

Modelo Favorite: Verificar si existe en schema Prisma (ver documento 09)
Unique constraint: (userId, petId) para evitar duplicados
Cascade delete: Si se elimina mascota, eliminar favoritos asociados
Validación: No permitir favoritos de mascotas adoptadas
Accesibilidad: Labels en botones de acción, aria-labels en íconos
Breadcrumbs: "Mi Panel > Favoritos" para navegación clara
