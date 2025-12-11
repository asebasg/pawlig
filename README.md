# 🐾 PawLig - Plataforma Integral de Adopción de Mascotas

<div align="center">

**Una plataforma moderna para conectar mascotas con hogares responsables**

![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=flat-square&logo=mongodb)
![NextAuth](https://img.shields.io/badge/NextAuth-4.24-yellow?style=flat-square)

**Proyecto de grado** <br>
📍 Medellín, Antioquia, Colombia

</div>

---

## 📋 Descripción General

**PawLig** es una plataforma web full-stack integral que facilita la adopción responsable de mascotas y el comercio de productos para animales en el Valle de Aburrá. Permite a albergues publicar mascotas en adopción, a usuarios adoptar responsablemente, a proveedores vender productos especializados, y a administradores supervisar todo el ecosistema de manera segura y eficiente.

El proyecto está diseñado con arquitectura moderna, seguridad empresarial y experiencia de usuario optimizada para dispositivos móviles y desktop.

---

## ✨ Características Principales

### 🔐 Autenticación y Seguridad

- **Sistema multi-rol** con 4 tipos de usuarios: Admin, Albergue, Proveedor, Adoptante
- **Autenticación JWT** stateless mediante NextAuth.js
- **Contraseñas encriptadas** con bcryptjs (12 rounds)
- **Bloqueo de usuarios** con auditoría completa (HU-014)
- **Validación de datos** con esquemas Zod tipados
- **Middleware de protección** de rutas por rol

### 🐕 Módulo de Adopciones

- **Publicación de mascotas** por albergues con múltiples imágenes
- **Búsqueda avanzada** con filtros por especie, raza, edad, estado
- **Galería interactiva** de mascotas disponibles
- **Sistema de favoritos** para seguimiento de mascotas de interés
- **Postulaciones de adopción** con historial y seguimiento
- **Estados de mascota:** Disponible, En proceso, Adoptada
- **Gestión de estado de adopción:** Pendiente, Aprobada, Rechazada

### 🛍️ Tienda Virtual (E-commerce)

- **Catálogo de productos** para cuidado animal
- **Gestión de inventario** con control de stock
- **Sistema de órdenes** con múltiples estados (Pendiente, Confirmada, Enviada, Entregada)
- **Carrito de compras** persistente
- **Dirección de envío** con municipios del Valle de Aburrá
- **Métodos de pago** (simulados para ambiente académico)

### 👥 Panel de Control Personalizado

- **Dashboard Admin:** Supervisión de usuarios, albergues, proveedores, productos y métricas
- **Dashboard Albergue:** Gestión de mascotas, postulaciones, perfil del refugio
- **Dashboard Proveedor:** Gestión de productos, inventario, pedidos
- **Dashboard Adoptante:** Mis adopciones, favoritos, perfil, historial de compras

### 📊 Auditoría y Moderación

- **Historial de acciones** administrativas completo (HU-014)
- **Razones de bloqueo/desbloqueo** obligatorias
- **Registro de IP y User-Agent** para seguridad
- **Verificación de albergues y proveedores** por administrador
- **Motivos de rechazo** documentados

### 📱 Diseño Responsivo

- **Mobile-first** diseñado para todos los dispositivos
- **Interfaz adaptable** a smartphone, tablet y desktop
- **Componentes accesibles** con Tailwind CSS
- **Navbar adaptativo** con navegación mobile
- **Formularios optimizados** para entrada táctil

### 🌐 Integración Externa

- **WhatsApp** para contacto directo entre adoptantes y albergues
- **Instagram** para seguimiento de albergues
- **Cloudinary** para almacenamiento y optimización de imágenes
- **Geolocalización** por municipios del Valle de Aburrá

---

## 🛠️ Tecnologías Utilizadas

### Frontend

| Tecnología          | Versión | Propósito                                   |
| ------------------- | ------- | ------------------------------------------- |
| **Next.js**         | 14.2    | Framework React con renderizado server-side |
| **React**           | 18      | Librería base para componentes UI           |
| **TypeScript**      | 5.0     | Tipado estático para mayor seguridad        |
| **Tailwind CSS**    | 3.4     | Framework de estilos utility-first          |
| **React Hook Form** | 7.66    | Gestión eficiente de formularios            |
| **Lucide React**    | 0.554   | Iconografía moderna y consistente           |

### Backend & Autenticación

| Tecnología      | Versión | Propósito                          |
| --------------- | ------- | ---------------------------------- |
| **NextAuth.js** | 4.24    | Autenticación y manejo de sesiones |
| **bcryptjs**    | 3.0     | Encriptación de contraseñas        |
| **Prisma**      | 6.19    | ORM y gestión de base de datos     |
| **Zod**         | 4.1     | Validación y parsing de datos      |
| **Axios**       | 1.13    | Cliente HTTP para llamadas API     |

### Base de Datos & Almacenamiento

| Tecnología        | Propósito                                 |
| ----------------- | ----------------------------------------- |
| **MongoDB Atlas** | Base de datos NoSQL cloud                 |
| **Cloudinary**    | Almacenamiento y optimización de imágenes |

### Herramientas de Desarrollo

| Herramienta | Versión | Propósito                    |
| ----------- | ------- | ---------------------------- |
| **ESLint**  | 8       | Linting y análisis de código |
| **PostCSS** | 8       | Procesamiento de CSS         |
| **Node.js** | 18+     | Runtime de JavaScript        |

### Deployment

| Servicio          | Propósito                    |
| ----------------- | ---------------------------- |
| **Vercel**        | Hosting y CI/CD del frontend |
| **MongoDB Atlas** | Base de datos cloud          |

---

## 📦 Instalación y Configuración

### Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** 18.17+ ([Descargar](https://nodejs.org))
- **npm** 9+ o **yarn** 1.22+ (incluidos con Node.js)
- **Git** configurado
- Cuenta en **MongoDB Atlas** ([Crear cuenta](https://www.mongodb.com/cloud/atlas))
- Cuenta en **Cloudinary** ([Crear cuenta](https://cloudinary.com))

### Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/asebasg/pawlig.git
cd pawlig
```

### Paso 2: Instalar Dependencias

```bash
npm install
# o si usas yarn
yarn install
```

Este comando descargará todas las librerías necesarias según `package.json`.

### Paso 3: Configurar Variables de Entorno

Copia el archivo de ejemplo:

```bash
cp .env.local.example .env.local
```

Luego edita `.env.local` con tus credenciales:

```env
# Base de Datos MongoDB
DATABASE_URL="mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority"

# NextAuth Configuration
NEXTAUTH_SECRET="<genera-con-openssl-rand-base64-32>"
NEXTAUTH_URL="http://localhost:3000"

# Cloudinary (Almacenamiento de imágenes)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="<tu-cloud-name>"
CLOUDINARY_API_KEY="<tu-api-key>"
CLOUDINARY_API_SECRET="<tu-api-secret>"
```

#### Generar NEXTAUTH_SECRET

En tu terminal ejecuta:

```bash
# En Windows (PowerShell)
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))

# En macOS/Linux
openssl rand -base64 32
```

### Paso 4: Configurar MongoDB Atlas

1. Accede a [MongoDB Atlas](https://account.mongodb.com/account/login)
2. **Crea un nuevo proyecto** (si no tienes uno)
3. **Crea un cluster** (versión gratuita M0)
4. **Configura un usuario de base de datos:**
   - Ve a Security → Database Access
   - Click en "Add New Database User"
   - Usa credenciales seguras
5. **Whitelist tu IP:**
   - Ve a Security → Network Access
   - Click "Add IP Address"
   - Selecciona "Allow Access from Anywhere" (0.0.0.0/0) para desarrollo
6. **Obtén la connection string:**
   - Click "Connect" en tu cluster
   - Selecciona "Drivers"
   - Copia el connection string
   - Reemplaza `<username>`, `<password>` y `<dbname>`

### Paso 5: Inicializar Base de Datos

```bash
# Generar cliente de Prisma
npx prisma generate

# Sincronizar schema con MongoDB (crear colecciones)
npx prisma db push
```

### Paso 6: Iniciar Servidor de Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en: **[http://localhost:3000](http://localhost:3000)**

---

## 🗂️ Estructura del Proyecto

```
pawlig/
├── 📄 middleware.ts                  # Middleware de autenticación y protección de rutas
├── 📦 package.json                   # Dependencias y scripts
├── 🔧 next.config.mjs                # Configuración de Next.js (Cloudinary)
├── 📋 tsconfig.json                  # Configuración de TypeScript
├── 🎨 tailwind.config.ts             # Configuración de Tailwind CSS
│
├── 📁 app/                           # Next.js App Router
│   ├── layout.tsx                    # Layout principal
│   ├── page.tsx                      # Página de inicio
│   ├── globals.css                   # Estilos globales
│   │
│   ├── 📁 (auth)/                    # Rutas de autenticación
│   │   ├── login/page.tsx            # Página de login
│   │   ├── register/page.tsx         # Registro de usuario
│   │   ├── request-shelter/page.tsx  # Solicitud para ser albergue
│   │   └── unauthorized/page.tsx     # Página de acceso denegado
│   │
│   ├── 📁 (dashboard)/               # Rutas protegidas por rol
│   │   ├── admin/                    # Panel administrador
│   │   │   ├── profile/              # Perfil del admin
│   │   │   ├── users/                # Gestión de usuarios
│   │   │   └── shelters/             # Gestión de albergues
│   │   ├── shelter/                  # Panel de albergue
│   │   │   ├── profile/              # Perfil del albergue
│   │   │   ├── pets/                 # Gestión de mascotas
│   │   │   └── adoptions/            # Postulaciones recibidas
│   │   ├── vendor/                   # Panel de proveedor
│   │   │   └── profile/              # Perfil del proveedor
│   │   └── user/                     # Panel del adoptante
│   │       ├── page.tsx              # Dashboard principal
│   │       ├── profile/              # Perfil del usuario
│   │       ├── adoptions/            # Mis adopciones
│   │       ├── favorites/            # Mis favoritos
│   │       └── orders/               # Mis compras
│   │
│   ├── 📁 adopciones/                # Módulo público de adopción
│   │   ├── page.tsx                  # Listado de mascotas
│   │   └── [id]/page.tsx             # Detalle de mascota
│   │
│   ├── 📁 api/                       # API Routes (Backend)
│   │   ├── auth/[...nextauth]/       # Endpoints de autenticación
│   │   ├── admin/                    # Endpoints administrativos
│   │   │   ├── users/                # Gestión de usuarios
│   │   │   ├── shelters/             # Gestión de albergues
│   │   │   └── shelter-requests/     # Solicitudes de albergue
│   │   ├── adopter/                  # Endpoints de adoptante
│   │   │   ├── adoptions/            # Gestión de adopciones
│   │   │   └── favorites/            # Gestión de favoritos
│   │   ├── pets/                     # Endpoints de mascotas
│   │   │   ├── route.ts              # CRUD mascotas
│   │   │   ├── [id]/                 # Detalle de mascota
│   │   │   └── search/               # Búsqueda avanzada
│   │   ├── products/                 # Endpoints de productos
│   │   ├── orders/                   # Endpoints de órdenes
│   │   ├── cloudinary/sign/          # Firma de Cloudinary
│   │   ├── upload/route.ts           # Upload de imágenes
│   │   └── user/                     # Endpoints de usuario
│   │
│   └── 📁 fonts/                     # Fuentes locales
│
├── 📁 components/                    # Componentes React reutilizables
│   ├── 📁 layout/                    # Componentes de layout
│   │   ├── navbar.tsx                # Navbar principal
│   │   ├── navbar-public.tsx         # Navbar sin autenticación
│   │   ├── navbar-mobile.tsx         # Navbar móvil responsive
│   │   ├── navbar-auth.tsx           # Navbar autenticado
│   │   ├── user-menu.tsx             # Menú de usuario
│   │   ├── cart-button.tsx           # Botón del carrito
│   │   ├── footer.tsx                # Pie de página
│   │   └── index.ts                  # Exportaciones
│   │
│   ├── 📁 ui/                        # Componentes UI base
│   │   ├── badge.tsx                 # Etiquetas/badges
│   │   └── logo.tsx                  # Logo de la aplicación
│   │
│   ├── 📁 forms/                     # Componentes de formularios
│   │   ├── login-form.tsx            # Formulario de login
│   │   ├── register-form.tsx         # Formulario de registro
│   │   ├── pet-form.tsx              # Formulario de mascota
│   │   ├── pet-filter.tsx            # Filtros de búsqueda
│   │   ├── user-profile-form.tsx     # Formulario perfil usuario
│   │   ├── shelter-request-form.tsx  # Solicitud de albergue
│   │   └── vendor-profile-form.tsx   # Formulario proveedor
│   │
│   ├── 📁 cards/                     # Componentes de tarjetas
│   │   ├── pet-card.tsx              # Tarjeta de mascota
│   │   └── shelter-pet-card.tsx      # Tarjeta para albergue
│   │
│   ├── 📁 filters/                   # Componentes de filtros
│   │   └── pet-filters.tsx           # Panel de filtros
│   │
│   ├── 📁 adopter/                   # Componentes específicos adoptante
│   │   ├── AdopterDashboardClient.tsx    # Dashboard adoptante
│   │   ├── AdoptionsSection.tsx          # Sección de adopciones
│   │   ├── FavoritesSection.tsx          # Sección de favoritos
│   │   └── NotificationBanner.tsx        # Banner de notificaciones
│   │
│   ├── adoption-applications-client.tsx  # Aplicaciones de adopción
│   ├── pet-gallery-client.tsx            # Galería de mascotas
│   ├── PetCard.tsx                       # Tarjeta individual
│   ├── PetDetailClient.tsx               # Detalle de mascota
│   └── index.ts                          # Exportaciones
│
├── 📁 lib/                           # Lógica compartida y utilidades
│   ├── 📁 auth/                      # Configuración de autenticación
│   │   ├── auth-options.ts           # Configuración de NextAuth
│   │   ├── password.ts               # Funciones de contraseña
│   │   ├── require-role.ts           # Protección por rol
│   │   └── session.ts                # Gestión de sesiones
│   │
│   ├── 📁 services/                  # Servicios de negocio
│   │   ├── pet.service.ts            # Lógica de mascotas
│   │   └── [otros servicios]
│   │
│   ├── 📁 utils/                     # Utilidades
│   │   ├── db.ts                     # Conexión a DB
│   │   └── [otras utilidades]
│   │
│   ├── 📁 validations/               # Esquemas Zod
│   │   ├── pet.schema.ts             # Validación de mascota
│   │   ├── user.schema.ts            # Validación de usuario
│   │   ├── adoption.schema.ts        # Validación de adopción
│   │   ├── cloudinary.schema.ts      # Validación de imágenes
│   │   └── pet-search.schema.ts      # Validación de búsqueda
│   │
│   ├── constants.ts                  # Constantes de la aplicación
│   └── cloudinary.ts                 # Configuración Cloudinary
│
├── 📁 hooks/                         # Custom React Hooks
│   └── [hooks personalizados]
│
├── 📁 types/                         # Definiciones de TypeScript
│   └── next-auth.d.ts               # Extensión de tipos NextAuth
│
├── 📁 prisma/                        # ORM y Base de Datos
│   └── schema.prisma                # Esquema de datos
│
├── 📁 documentation/                 # Documentación del proyecto
│   └── pull-request/                # Cambios y historias de usuario
│
└── 📁 -p/                            # Archivos de configuración adicionales
```

---

## 🔑 Roles y Permisos de Usuario

### ADMIN - Administrador

- Control total del sistema
- Gestionar usuarios (bloquear, cambiar rol)
- Aprobar/Rechazar albergues y proveedores
- Ver auditoría completa del sistema
- Gestionar denuncias y reportes

### SHELTER - Albergue/Refugio

- Crear y gestionar mascotas en adopción
- Ver postulaciones de adopción
- Aprobar o rechazar solicitudes
- Actualizar perfil del albergue
- Comunicarse vía WhatsApp/Instagram

### VENDOR - Proveedor

- Crear y gestionar catálogo de productos
- Gestionar inventario y stock
- Ver pedidos realizados
- Actualizar perfil del negocio

### ADOPTER - Adoptante/Usuario

- Buscar y filtrar mascotas
- Crear postulación para adoptar
- Agregar mascotas a favoritos
- Comprar productos en la tienda
- Gestionar perfil y historial

---

## 🗄️ Modelo de Datos

### Entidades Principales

**User** - Usuarios del sistema

- Email, contraseña, nombre, teléfono
- Rol (ADMIN, SHELTER, VENDOR, ADOPTER)
- Municipio y dirección
- Estado de bloqueo y auditoría

**Shelter** - Albergues/Refugios

- Nombre, NIT, municipio
- Estado de verificación
- Contactos (WhatsApp, Instagram)
- Relación con usuario propietario

**Pet** - Mascotas en adopción

- Nombre, especie, raza, edad
- Estado (AVAILABLE, IN_PROCESS, ADOPTED)
- Descripción, requisitos, imágenes
- Pertenece a un albergue

**Adoption** - Postulaciones de adopción

- Estado (PENDING, APPROVED, REJECTED)
- Mensaje de postulante
- Relación adoptante-mascota

**Vendor** - Proveedores de productos

- Nombre de negocio, teléfono
- Estado de verificación
- Logo y descripción
- Relación con usuario propietario

**Product** - Productos en venta

- Nombre, precio, stock, categoría
- Imágenes y descripción
- Pertenece a un proveedor

**Order** - Órdenes de compra

- Estado (PENDING, CONFIRMED, SHIPPED, DELIVERED)
- Total, municipio envío, método pago
- Relación con usuario y items

**Favorite** - Mascotas favoritas

- Relación usuario-mascota
- Fecha de creación

**UserAudit** - Auditoría de acciones

- Acción (BLOCK, UNBLOCK, CHANGE_ROLE, DELETE)
- Razón obligatoria
- IP y User-Agent
- Trazabilidad completa

### Municipios Soportados

- Medellín
- Bello
- Itagüí
- Envigado
- Sabaneta
- La Estrella
- Caldas
- Copacabana
- Girardota
- Barbosa

---

## 🧪 Scripts Disponibles

### Desarrollo

```bash
# Inicia servidor de desarrollo (hot reload)
npm run dev
# Accesible en http://localhost:3000
```

### Producción

```bash
# Construir optimizado para producción
npm run build

# Iniciar servidor de producción
npm start
```

### Prisma & Base de Datos

```bash
# Generar cliente Prisma (después de cambios en schema)
npx prisma generate

# Sincronizar schema con base de datos
npx prisma db push

# Studio - Interfaz visual para explorar DB
npx prisma studio
# Accesible en http://localhost:5555
```

### Linting & Código

```bash
# Ejecutar ESLint en el proyecto
npm run lint

# Arreglar automáticamente issues de ESLint
npm run lint -- --fix
```

---

## 🔐 Características de Seguridad

### Autenticación

- ✅ JWT (JSON Web Tokens) stateless
- ✅ Contraseñas encriptadas con bcryptjs (12 rounds)
- ✅ Sesiones seguras con NextAuth.js
- ✅ CSRF protection automático

### Autorización

- ✅ Protección de rutas por rol
- ✅ Middleware en servidor (no solo cliente)
- ✅ Validación en cada endpoint
- ✅ Bloqueo de usuarios con auditoría

### Datos

- ✅ Validación con Zod en cliente y servidor
- ✅ Sanitización de inputs
- ✅ Protección contra inyección de MongoDB
- ✅ Índices de base de datos optimizados

### Auditoría

- ✅ Registro de acciones administrativas completo
- ✅ Captura de IP y User-Agent
- ✅ Razones obligatorias para bloqueos
- ✅ Historial inmutable de cambios

---

## 🌐 Variables de Entorno Completas

```env
# ============ DATABASE ============
DATABASE_URL=mongodb+srv://user:password@cluster.mongodb.net/pawlig

# ============ NEXTAUTH ============
NEXTAUTH_SECRET=<generate-with-openssl>
NEXTAUTH_URL=http://localhost:3000

# ============ CLOUDINARY ============
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# ============ RESEND ============
RESEND_API_KEY=""
EMAIL_FROM="noreply@pawlig.vercel.app"

# ============ NODE ENV ============
NODE_ENV="development"

# ============ URL de la aplicación (desarrollo) ============
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 📚 Funcionalidades por Módulo

### 🏠 Adopciones (Público)

- Listar mascotas disponibles
- Filtros avanzados (especie, edad, raza, municipio)
- Ver detalle de mascota
- Agregar a favoritos (requiere login)
- Crear postulación (requiere login)

### 💳 Tienda (Público/Autenticado)

- Navegar catálogo de productos
- Filtrar por categoría
- Agregar al carrito
- Checkout simulado
- Historial de compras (autenticado)

### 👤 Perfil de Usuario

- Actualizar datos personales
- Cambiar contraseña
- Ver historial de actividad
- Gestionar favoritos
- Gestionar adopciones

### 🏠 Albergue

- Crear/editar mascotas
- Subir imágenes (Cloudinary)
- Gestionar postulaciones
- Ver estadísticas
- Actualizar perfil

### 🛒 Proveedor

- Gestionar productos
- Controlar inventario
- Ver pedidos
- Actualizar perfil

### ⚙️ Administración

- Gestionar usuarios (bloquear/desbloquear)
- Verificar albergues
- Verificar proveedores
- Ver auditoría
- Estadísticas del sistema

---

## 🚀 Deployment en Vercel

### Pasos rápidos:

1. **Push a GitHub**

```bash
git push origin main
```

2. **Conectar con Vercel**

   - Ir a [vercel.com](https://vercel.com)
   - Conectar repositorio de GitHub
   - Seleccionar proyecto `pawlig`

3. **Configurar variables de entorno**

   - En Vercel dashboard → Settings → Environment Variables
   - Agregar todas las variables de `.env.local`

4. **Deploy automático**
   - Vercel desplegará automáticamente con cada push a `main`
   - Puedes ver logs en tiempo real

---

## 🔄 Flujo de Trabajo Git

### Crear una nueva rama para feature

```bash
# Actualizar rama main
git checkout main
git pull origin main

# Crear rama feature
git checkout -b feature/nombre-descriptivo
```

### Hacer commits con convención

```bash
git add .
git commit -m "feat(modulo): descripción clara del cambio"
```

### Convenciones de commit

- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Documentación
- `style`: Formato de código
- `refactor`: Refactorización
- `test`: Tests
- `chore`: Build/config

### Crear Pull Request

```bash
git push origin feature/nombre-descriptivo
# Luego crear PR en GitHub
```

---

## 📞 Soporte y Contacto

### Equipo de Desarrollo

| Rol                         | Nombre                         | Contacto                  |
| --------------------------- | ------------------------------ | ------------------------- |
| 👨‍💼 Líder & Backend          | Andrés Sebastián Ospina Guzmán | asebasg07@gmail.com       |
| 👨‍💻 Desarrollador & Analista | Mateo Úsuga Vasco              | mateo.usuga.v21@gmail.com |
| 🎨 Diseñador & QA           | Santiago Lezcano Escobar       | santiag1725g@gmail.com    |

**Instructor:** Mateo Arroyave Quintero

### Para dudas o sugerencias:

📧 asebasg07@gmail.com

---

## 📝 Licencia

Proyecto de grado - SENA 2025 Análisis y Desarrollo de Software (ADSO)
Todos los derechos reservados.

---

<div align="center">

**Hecho con el ❤️ por el equipo de PawLig**_

[⬆ Volver al inicio](#-pawlig---plataforma-integral-de-adopción-de-mascotas)

</div>
