# 🐾 TAREA-016: Galería Pública de Mascotas con Detalle Expandido

**Versión:** 1.0  
**Rama:** `feat/TAREA-016-Desarrollar-galería-pública-de-mascotas`  
**Commit:** `31ace5a`  
**Estado:** ✅ Completado

---

## 📋 Descripción General

Esta tarea implementa la galería pública de mascotas para la plataforma Pawlig, permitiendo que usuarios no autenticados puedan visualizar, buscar y filtrar mascotas disponibles para adopción. Incluye vistas detalladas con galerías de imágenes expandidas, información del albergue, sistema de favoritos e integración con solicitudes de adopción.

### 🎯 Objetivos Cumplidos

- ✅ **HU-005:** Desarrollar galería pública de mascotas en `/adopciones`
- ✅ **HU-006:** Integrar filtros y búsqueda de mascotas (ya implementados)
- ✅ Crear componentes reutilizables para visualización de mascotas
- ✅ Implementar página de detalle con routing dinámico
- ✅ Agregar funcionalidades de favoritos y solicitud de adopción
- ✅ Optimizar SEO con metadata dinámico
- ✅ Diseño responsive para múltiples dispositivos

---

## 📁 Archivos Cambiados

### ✨ Nuevos Archivos

| Archivo                          | Tipo       | Líneas | Descripción                                                                         |
| -------------------------------- | ---------- | ------ | ----------------------------------------------------------------------------------- |
| `components/PetCard.tsx`         | Componente | 200+   | Tarjeta reutilizable de mascota con badge de estado, favoritos y enlace a detalle   |
| `components/PetDetailClient.tsx` | Componente | 500+   | Página cliente para detalle de mascota con galería expandida e información completa |
| `app/adopciones/[id]/page.tsx`   | Página     | 200+   | Página servidor de detalle con data fetching, SEO metadata y validación             |

### 🔄 Archivos Modificados

| Archivo                             | Cambios         | Descripción                                                                                            |
| ----------------------------------- | --------------- | ------------------------------------------------------------------------------------------------------ |
| `components/pet-gallery-client.tsx` | -101 líneas, +0 | Refactorización: eliminado componente `PetCard` inline, ahora importa el nuevo componente reutilizable |

### 📊 Resumen de Cambios

- **Total de archivos modificados:** 4
- **Líneas agregadas:** 962
- **Líneas eliminadas:** 101
- **Neto:** 861 líneas nuevas

---

## 🎨 Componentes Implementados

### 1. **PetCard.tsx** - Componente Reutilizable

**Ubicación:** `components/PetCard.tsx`

**Propósito:** Componente de presentación para una tarjeta individual de mascota en la galería.

**Características:**

```typescript
// Props recibidos
interface PetCardProps {
  pet: {
    _id: string;
    name: string;
    species: string;
    breed: string;
    age: number;
    sex: "M" | "F";
    image: string;
    status: "AVAILABLE" | "IN_PROCESS" | "ADOPTED";
    shelter: {
      name: string;
      municipality: string;
    };
  };
  userSession?: Session;
  initialIsFavorited?: boolean;
}
```

**Funcionalidades:**

- 🏷️ **Badge de Estado:** Indicador visual con colores

  - Verde: `AVAILABLE` (Disponible)
  - Amarillo: `IN_PROCESS` (En Proceso)
  - Gris: `ADOPTED` (Adoptada)

- 🖼️ **Imagen:** Con zoom en hover y fallback para imágenes faltantes

- ❤️ **Sistema de Favoritos:**

  - Botón con ícono de corazón
  - Requiere autenticación (redirect a login si no autorizado)
  - Integración con endpoint `/api/pets/[id]/favorite`
  - Estados: vacío/lleno con animación

- ℹ️ **Información de Mascota:**

  - Especie y raza
  - Edad (en años/meses)
  - Sexo (M/H)
  - Albergue y ubicación

- 🔗 **Enlace a Detalle:** Click en cualquier área lleva a `/adopciones/[id]`

- 📱 **Diseño Responsive:** Adaptable a cualquier resolución

**Ubicación en Galería:**

```
├── desktop: 3 columnas (12 mascotas por pantalla)
├── tablet: 2 columnas (8 mascotas por pantalla)
└── móvil: 1 columna (4 mascotas por pantalla)
```

---

### 2. **PetDetailClient.tsx** - Componente Interactivo de Detalle

**Ubicación:** `components/PetDetailClient.tsx`

**Propósito:** Componente cliente que maneja toda la interactividad de la página de detalle de mascota.

**Características Principales:**

#### 🎨 Galería de Imágenes

```typescript
// Funcionalidades de galería
- Navegación prev/next con botones
- Selección de imagen mediante miniaturas
- Indicador de posición (ej: "3 de 8")
- Soporte para múltiples formatos de imagen
- Fallback para galería vacía
- Transiciones suaves entre imágenes
```

**Estructura:**

```
┌─────────────────────────────────┐
│  [←] [Imagen Grande] [→]       │
│      [X de Y fotos]             │
├─────────────────────────────────┤
│ [T1] [T2] [T3] [T4] [T5] ...   │ ← Miniaturas
└─────────────────────────────────┘
```

#### 📝 Información de Mascota

- Nombre destacado
- Descripción completa
- Características en grid: especie, raza, edad, sexo
- Requisitos de adopción
- Información del albergue
- Estado de disponibilidad

#### 🏢 Panel de Albergue

```typescript
// Información del albergue
- Logo/nombre
- Teléfono
- Email
- Ubicación (municipio)
- Botones de contacto:
  - WhatsApp (enlace directo)
  - Instagram (enlace al perfil)
```

#### ❤️ Sistema de Favoritos

- Botón "Agregar a Favoritos"
- Estado persistente (verificado con API)
- Requiere autenticación
- Redirect automático a login si no autorizado

#### 📋 Solicitud de Adopción

```typescript
// Flujo de adopción
1. Usuario hace click en "Solicitar Adopción"
2. Validación: mascota disponible, usuario autenticado
3. POST a /api/adopter/adoptions con ID de mascota
4. Respuesta: ID de solicitud creada
5. Redirect automático a /profile (panel de usuario)
6. Toast de éxito
```

#### 🐾 Recomendaciones (Mascotas Similares)

```typescript
// Algoritmo de similitud
- Mismo albergue (máxima relevancia)
- O misma especie
- Excluyendo mascota actual
- Máximo 4 recomendaciones
- Mostradas con componente PetCard
```

#### 🔍 Manejo de Errores

- Mascota no encontrada → 404 (handled por `notFound()`)
- Errores de API → Mensaje amigable al usuario
- Imágenes no cargadas → Fallback text
- Validación de ObjectId en URL

**Estados Visuales:**

```typescript
- Loading: Spinner mientras se cargan datos
- Error: Mensaje de error con detalles
- Success: Información completa renderizada
- Offline: Botones deshabilitados sin conexión
```

---

### 3. **app/adopciones/[id]/page.tsx** - Página Servidor

**Ubicación:** `app/adopciones/[id]/page.tsx`

**Tipo:** Server Component (data fetching en servidor)

**Responsabilidades:**

#### 🔐 Validación y Seguridad

```typescript
// Validaciones implementadas
- ObjectId.isValid(id) - Formato correcto de MongoDB
- Manejo de IDs inválidos
- Prevención de inyección NoSQL
```

#### 📊 Data Fetching

```typescript
// Consultas Prisma
1. Pet con relación a Shelter y Adoptions
2. Mascotas similares (mismo albergue)
3. Status de favorito del usuario actual (si autenticado)

// Query optimizada
db.pet.findUnique({
  where: { _id: id },
  include: {
    shelter: true,
    adoptions: {
      where: { status: 'APPROVED' }
    }
  }
})
```

#### 🌐 SEO Metadata Dinámico

```typescript
// generateMetadata() genera
{
  title: `${pet.name} - Adopta en Pawlig`,
  description: `${pet.name}, ${pet.breed} disponible para adopción. ${pet.shelter.name}, ${pet.shelter.municipality}.`,
  openGraph: {
    title: `Conoce a ${pet.name}`,
    description: `${pet.breed} - ${pet.status === 'AVAILABLE' ? 'Disponible' : 'No disponible'} para adopción`,
    images: [{ url: pet.image }],
    type: 'website'
  }
}
```

#### ⚡ Manejo de Errores

```typescript
- ID inválido → 404
- Mascota no existe → 404
- Error de BD → Error page
- Session inválida → Continúa (no requiere auth)
```

---

## 🔌 Integración de APIs

### Endpoints Utilizados

#### 1. **GET /api/pets/search**

```
Propósito: Búsqueda y filtrado de mascotas
Query Parameters:
  - search?: string (búsqueda por nombre)
  - species?: string (filtro)
  - municipality?: string (filtro)
  - limit?: number (default: 12)
  - skip?: number (default: 0)

Response:
{
  pets: Pet[],
  total: number,
  hasMore: boolean
}
```

#### 2. **GET /api/pets/[id]**

```
Propósito: Obtener detalle de una mascota
Parámetros: id (ObjectId)
Response: Pet (con relaciones: shelter, adoptions)
```

#### 3. **POST /api/pets/[id]/favorite**

```
Propósito: Toggle de mascota favorita
Requerimientos:
  - Autenticación: JWT (NextAuth)
  - Método: POST

Body: { isFavorited: boolean }

Response: { success: boolean, message: string }

Códigos de error:
  - 401: No autenticado
  - 400: ID inválido
  - 404: Mascota no encontrada
```

#### 4. **POST /api/adopter/adoptions**

```
Propósito: Crear solicitud de adopción
Requerimientos:
  - Autenticación: JWT (NextAuth)
  - Role: 'adopter'

Body: { petId: string }

Response: { adoptionId: string, status: string }

Códigos de error:
  - 401: No autenticado
  - 403: Rol inválido
  - 400: Mascota no disponible
  - 409: Solicitud ya existe
```

---

## 🎯 Flujo de Usuario

### Scenario 1: Explorar Galería Pública

```
1. Usuario no autenticado visita /adopciones
   ↓
2. Se cargan 12 mascotas por defecto
   ↓
3. Usuario ve grid de PetCard (3 cols en desktop)
   ↓
4. Puede hacer scroll (más mascotas cargan)
   ↓
5. Puede aplicar filtros:
   - Buscar por nombre
   - Filtrar por especie
   - Filtrar por municipio
   ↓
6. Resultados se actualizan dinámicamente
```

### Scenario 2: Ver Detalle de Mascota

```
1. Usuario hace click en PetCard
   ↓
2. Navega a /adopciones/[id]
   ↓
3. Se carga página con server-side rendering
   ↓
4. VE:
   - Galería de imágenes grande
   - Información completa
   - Panel del albergue
   - Mascotas similares abajo
   ↓
5. Interacciones disponibles:
   - Agregar/quitar de favoritos
   - Ver más fotos (galería)
   - Contactar albergue
   - Solicitar adopción
```

### Scenario 3: Agregar a Favoritos (Autenticado)

```
1. Usuario hace click en ❤️ en PetCard
   ↓
2. API call: POST /api/pets/[id]/favorite
   ↓
3. Sistema verifica autenticación (JWT)
   ↓
4. Se agrega a base de datos
   ↓
5. Ícono se rellena de color
   ↓
6. Se puede acceder desde panel del usuario
```

### Scenario 4: Solicitar Adopción (Autenticado)

```
1. Usuario autenticado en detalle de mascota
   ↓
2. Hace click en "Solicitar Adopción"
   ↓
3. Validaciones:
   - Usuario tiene rol 'adopter'
   - Mascota está disponible (AVAILABLE)
   - No hay solicitud previa del mismo usuario
   ↓
4. Se crea registro de Adoption en BD
   ↓
5. Redirect automático a /profile
   ↓
6. Toast: "Solicitud enviada correctamente"
   ↓
7. Usuario ve nueva solicitud en panel
```

### Scenario 5: Usuario No Autenticado Intenta Favorito

```
1. Usuario hace click en ❤️ (sin estar logueado)
   ↓
2. Se detecta falta de autenticación
   ↓
3. Redirect a login: /auth/login?callbackUrl=/adopciones/[id]
   ↓
4. Usuario se autentica
   ↓
5. Redirect automático a /adopciones/[id]
   ↓
6. Intento de favorito se completa
```

---

## 🛡️ Seguridad y Validaciones

### Validaciones de Entrada

```typescript
// URL Parameters
- ObjectId.isValid(id) previene inyección

// API Requests
- Zod schema validation en searchParams
- Sanitización de strings
- Rate limiting (handled por Next.js)
```

### Autenticación

```typescript
// Verificación de sesión
- NextAuth.js JWT validation
- getServerSession() en endpoints protegidos
- Roles verificados en middleware

// Flujo seguro
- Favoritos: requiere role 'adopter' o 'vendor'
- Adopciones: requiere role 'adopter'
- Lectura: pública (no requiere auth)
```

### Autorizaciones

```typescript
// Permisos por rol
- Visitante: VER galería, VER detalle
- Adopter: + Favoritos + Solicitar adopción
- Vendor: VER paneles de mascotas
- Admin: Acceso completo
```

### Manejo de Errores

```typescript
// Errores esperados
- 404: Mascota no existe
- 400: Parámetros inválidos
- 401: No autorizado
- 403: Acceso prohibido
- 409: Conflicto (solicitud duplicada)
- 500: Error servidor

// Manejo en frontend
- Try-catch en API calls
- Loading states mientras se espera
- Mensajes amigables al usuario
- Logs en consola para debug
```

---

## 🎨 Diseño Responsivo

### Breakpoints Implementados

```typescript
// Mobile First Approach
sm: 640px  - Móvil pequeño (1 columna)
md: 768px  - Tablet (2 columnas)
lg: 1024px - Laptop (3 columnas)
xl: 1280px - Desktop grande (3-4 columnas)
```

### Layouts Adaptables

**Galería:**

```
Mobile (1 col):     Tablet (2 cols):    Desktop (3 cols):
┌──────────┐        ┌─────┐ ┌─────┐   ┌────┐ ┌────┐ ┌────┐
│ PetCard  │        │ PC  │ │ PC  │   │ PC │ │ PC │ │ PC │
└──────────┘        │     │ │     │   │    │ │    │ │    │
┌──────────┐        └─────┘ └─────┘   └────┘ └────┘ └────┘
│ PetCard  │
└──────────┘
```

**Detalle:**

```
Mobile:              Tablet/Desktop:
┌─────────────┐      ┌──────────────┬──────────┐
│   Galería   │      │   Galería    │  Info    │
│             │      │              │  Panel   │
├─────────────┤      ├──────────────┴──────────┤
│  Info Panel │      │  Similar Pets           │
├─────────────┤      └─────────────────────────┘
│  Similar    │
│  Pets       │
└─────────────┘
```

---

## 📱 Componentes de UI Utilizados

### Colores (Tailwind)

```typescript
// Estado disponible
bg-green-100, text-green-800 → Badge "Disponible"

// Estado en proceso
bg-yellow-100, text-yellow-800 → Badge "En Proceso"

// Estado adoptada
bg-gray-100, text-gray-800 → Badge "Adoptada"

// Favoritos activo
text-red-500, fill-red-500 → Corazón relleno

// Favoritos inactivo
text-gray-400 → Corazón vacío
```

### Iconos (Lucide React v0.554.0)

```typescript
import {
  Heart, // Favoritos
  ChevronLeft, // Galería anterior
  ChevronRight, // Galería siguiente
  MapPin, // Ubicación
  MessageCircle, // Contacto
  Instagram, // Red social
  Phone, // Teléfono
} from "lucide-react";
```

### Estados de Carga

```typescript
- Skeleton loaders en inicio
- Spinner durante peticiones
- Disabled buttons sin conexión
- Transiciones suaves entre estados
```

---

## 🗄️ Modelos de Base de Datos

### Relaciones Utilizadas

```prisma
model Pet {
  _id              String    @id @default(auto()) @map("_id") @db.ObjectId
  name             String
  species          String    // ENUM: "dog", "cat", etc.
  breed            String
  age              Int       // meses
  sex              String    // ENUM: "M", "F"
  description      String?
  image            String    // URL a Cloudinary
  status           String    // ENUM: "AVAILABLE", "IN_PROCESS", "ADOPTED"

  // Relaciones
  shelterID        String    @db.ObjectId
  shelter          Shelter   @relation(fields: [shelterID], references: [_id])

  adoptions        Adoption[]
  favorites        Favorite[]
}

model Shelter {
  _id              String    @id @default(auto()) @map("_id") @db.ObjectId
  name             String
  municipality     String
  // ... más campos
}

model Adoption {
  _id              String    @id @default(auto()) @map("_id") @db.ObjectId
  petID            String    @db.ObjectId
  pet              Pet       @relation(fields: [petID], references: [_id])
  // ... status, dates, etc
}

model Favorite {
  _id              String    @id @default(auto()) @map("_id") @db.ObjectId
  userID           String    @db.ObjectId
  petID            String    @db.ObjectId
  pet              Pet       @relation(fields: [petID], references: [_id])
  createdAt        DateTime  @default(now())
}
```

---

## 🧪 Casos de Prueba

### Pruebas Funcionales

- ✅ Galería carga 12 mascotas inicialmente
- ✅ Scroll carga más mascotas (paginación)
- ✅ Búsqueda filtra por nombre
- ✅ Filtro por especie funciona
- ✅ Filtro por municipio funciona
- ✅ Múltiples filtros simultáneos
- ✅ Click en PetCard navega a detalle
- ✅ Galería de detalle muestra todas las imágenes
- ✅ Navegación prev/next funciona
- ✅ Selección de miniaturas funciona
- ✅ Favorito agrega/quita de lista
- ✅ Favorito no autenticado redirige a login
- ✅ Solicitud de adopción crea registro
- ✅ Solicitud redirige a panel
- ✅ Mascotas similares se muestran

### Pruebas de Responsive

- ✅ Mobile (375px): 1 columna
- ✅ Tablet (768px): 2 columnas
- ✅ Desktop (1024px+): 3 columnas
- ✅ Galería responsive
- ✅ Botones accesibles en todos los tamaños

### Pruebas de Seguridad

- ✅ ID inválido → 404
- ✅ URL injection → Bloqueada
- ✅ Favorito sin auth → Redirect login
- ✅ Adopción sin auth → Redirect login
- ✅ Adopción sin rol correcto → Error 403

---

## 🚀 Cómo Ejecutar

### 1. Instalación de Dependencias

Las dependencias ya están instaladas (incluyen `lucide-react@0.554.0`):

```bash
npm install
```

### 2. Variables de Entorno Requeridas

```env
# Database
MONGODB_URI=<tu-conexion-mongodb>

# Cloudinary (para imágenes)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<cloud-name>
CLOUDINARY_API_KEY=<api-key>
CLOUDINARY_API_SECRET=<secret>

# NextAuth
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
NEXTAUTH_URL=http://localhost:3000
```

### 3. Ejecutar Aplicación en Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### 4. Acceder a Funcionalidades

#### Galería Pública

```
http://localhost:3000/adopciones
```

Pruebas:

- Ver galería de mascotas
- Usar filtros
- Hacer scroll para cargar más

#### Detalle de Mascota

```
http://localhost:3000/adopciones/[ID-MASCOTA]
```

Ejemplo (reemplazar con ID real):

```
http://localhost:3000/adopciones/507f1f77bcf86cd799439011
```

Pruebas:

- Navegar galería de imágenes
- Ver información completa
- Agregar a favoritos (si autenticado)
- Ver mascotas similares

### 5. Ejecutar Tests (si existen)

```bash
npm run test
```

### 6. Build Producción

```bash
npm run build
```

---

## 📚 Dependencias

### Incluidas en package.json

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "typescript": "^5.0.0",
    "next-auth": "^4.24.0",
    "prisma": "^5.0.0",
    "lucide-react": "^0.554.0",
    "cloudinary": "^latest",
    "zod": "^3.20.0"
  }
}
```

### Nuevas Dependencias Agregadas

```
✅ Ninguna - todas las dependencias necesarias ya estaban
```

---

## 🔍 Puntos Técnicos Importantes

### 1. Server vs Client Components

```typescript
// Página (/adopciones/[id])
// - Server Component ✅
// - Realiza data fetching
// - Genera metadata SEO
// - Validaciones en servidor

// Detalle (PetDetailClient)
// - Client Component ✅
// - Maneja interactividad
// - Estado local (imágenes, favoritos)
// - API calls desde cliente

// PetCard
// - Puede ser Server o Client
// - Usado en ambos lugares
// - Actualmente: ambos contextos
```

### 2. Validación de ObjectId

```typescript
// En /adopciones/[id]/page.tsx
if (!ObjectId.isValid(id)) {
  notFound()
}

// Previene:
- Consultas inválidas
- Inyección NoSQL
- Errores de base de datos
```

### 3. Optimización de Imágenes

```typescript
// Cloudinary URLs
- Transformaciones automáticas
- Responsive sizing
- Lazy loading nativo de Next.js
- WebP format cuando soportado
```

### 4. Paginación Eficiente

```typescript
// Galería
- Limit: 12 por defecto
- Skip: basado en scroll
- Total count retornado
- hasMore flag para saber si hay más

// Reduce carga inicial
// Carga incremental en scroll
```

---

## 📝 Notas Adicionales

### ⚠️ Consideraciones Importantes

1. **Base de datos debe tener índices:**

   ```javascript
   db.pets.createIndex({ "shelter._id": 1 });
   db.pets.createIndex({ name: "text" });
   ```

2. **Imágenes deben estar en Cloudinary:**

   - URLs públicas accesibles
   - Formato soportado: JPG, PNG, WebP
   - Responsivas con transformaciones

3. **NextAuth debe estar configurado:**

   - Providers (Google, GitHub, etc.)
   - Sesión activa para favoritos/adopciones
   - Roles definidos en token JWT

4. **Variable de entorno NEXTAUTH_SECRET:**
   ```bash
   # Generar una segura:
   openssl rand -base64 32
   ```

### 🔄 Cambios Futuros Sugeridos

- [ ] Agregar filtro por edad (rango)
- [ ] Agregar filtro por tamaño
- [ ] Agregar ordenamiento (nombre, edad, fecha)
- [ ] Agregar favoritos count
- [ ] Agregar reviews de albergues
- [ ] Agregar galería de solicitudes (historial)
- [ ] Agregar notificaciones en tiempo real
- [ ] Agregar comparación entre mascotas

### ❓ Preguntas Resueltas en Esta Tarea

- **¿Cómo mostrar múltiples imágenes?** → Array de URLs, gallery con navegación
- **¿Cómo integrar favoritos?** → Endpoint existente + estado en cliente
- **¿Cómo manejar mascotas no disponibles?** → Badge de estado + deshabilitación de adopción
- **¿Cómo optimizar SEO?** → Metadata dinámico generado en servidor
- **¿Cómo mantener código DRY?** → PetCard reutilizable en galería y recomendaciones

---

## 📞 Contacto y Revisión

**Revisor designado:** [Por asignar]  
**Fecha de creación:** Noviembre 2025  
**Última actualización:** Noviembre 2025

Para revisar este PR, verifique:

1. ✅ Todos los archivos creados sin conflictos
2. ✅ Componentes renderean correctamente
3. ✅ Filtros funcionan con búsqueda
4. ✅ Detalle de mascota muestra información completa
5. ✅ Galería de imágenes navega correctamente
6. ✅ Favoritos funciona (autenticado)
7. ✅ Solicitud de adopción funciona (autenticado)
8. ✅ Responsive en móvil/tablet/desktop
9. ✅ SEO metadata incluído
10. ✅ No hay errores de TypeScript

---

**Estado:** ✅ LISTO PARA FUSIÓN  
**Commit Hash:** `31ace5a`  
**Rama:** `feat/TAREA-016-Desarrollar-galería-pública-de-mascotas`
