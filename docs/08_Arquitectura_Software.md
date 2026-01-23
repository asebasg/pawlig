# Arquitectura del Software

## Índice

1. Introducción
   &nbsp;&nbsp;&nbsp;&nbsp;1.1. Propósito del documento
   &nbsp;&nbsp;&nbsp;&nbsp;1.2. Alcance de la arquitectura
   &nbsp;&nbsp;&nbsp;&nbsp;1.3. Audiencia objetivo
   &nbsp;&nbsp;&nbsp;&nbsp;1.4. Definiciones y acrónimos
2. Representación arquitectónica general
   &nbsp;&nbsp;&nbsp;&nbsp;2.1. Diagrama de arquitectura de alto nivel
   &nbsp;&nbsp;&nbsp;&nbsp;2.2. Descripción general de componentes
   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;A. Cliente (frontend)
   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;B. Lógica de negocio (backend)
   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;C. Capa de datos
   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;D. Servicios externos
   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;E. Comunicación entre componentes
3. Decisiones arquitectónicas claves
   &nbsp;&nbsp;&nbsp;&nbsp;3.1. Patrón arquitectónico seleccionado
   &nbsp;&nbsp;&nbsp;&nbsp;3.2. Justificación de tecnologías
   &nbsp;&nbsp;&nbsp;&nbsp;3.3. Restricciones técnicas
4. Vistas arquitectónicas detalladas
   &nbsp;&nbsp;&nbsp;&nbsp;4.1. Capa de presentación (frontend)
   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4.1.1. Tecnologías y frameworks
   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4.1.2. Estructura de componentes
   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4.1.3. Enrutamiento y gestión de estado
   &nbsp;&nbsp;&nbsp;&nbsp;4.2. Capa de lógica de negocio (backend)
   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4.2.1. Tecnologías y frameworks
   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4.2.2. Estructura de la API y endpoints
   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4.2.3. Lógica de negocio y validaciones
   &nbsp;&nbsp;&nbsp;&nbsp;4.3. Capa de datos
   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4.3.1. Sistema de gestión de base de datos (SGBD)
   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4.3.2. Modelo de datos principal
   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4.3.3. Estrategia de persistencia y ORM
   &nbsp;&nbsp;&nbsp;&nbsp;4.4. Servicios externos e integraciones
   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4.4.1. Servicio de almacenamiento multimedia (Cloudinary)
   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4.4.2. Otros servicios externos
5. Consideraciones de despliegue
   &nbsp;&nbsp;&nbsp;&nbsp;5.1. Entornos (desarrollo y producción)
   &nbsp;&nbsp;&nbsp;&nbsp;5.2. Estrategia de despliegue
   &nbsp;&nbsp;&nbsp;&nbsp;5.3. Requisitos de infraestructura
6. Consideraciones de seguridad
   &nbsp;&nbsp;&nbsp;&nbsp;6.1. Estrategia de autenticación y autorización
   &nbsp;&nbsp;&nbsp;&nbsp;6.2. Protección de datos y comunicaciones
   &nbsp;&nbsp;&nbsp;&nbsp;6.3. Protección de datos personales

---

## 1. Introducción

### 1.1. Propósito del documento

Este documento describe la arquitectura de software propuesta para el sistema **PawLig**, una plataforma web integral para la adopción responsable de mascotas y comercio electrónico de productos para animales en el Valle de Aburrá. Su objetivo es establecer una guía técnica unificada que defina los componentes estructurales, las tecnologías, los patrones de diseño y las decisiones arquitectónicas que regirán el desarrollo del sistema. Esta arquitectura garantizará que el proyecto cumpla con los requerimientos funcionales y no funcionales especificados en la Fase 1, facilitando la escalabilidad, mantenibilidad y cohesión del producto final.

### 1.2. Alcance de la arquitectura

El alcance de esta arquitectura se limita a la **Versión 1.0** del sistema PawLig, cubriendo los módulos definidos en el documento de alcance:

- Gestión de usuarios y autenticación.
- Módulo de adopción de mascotas.
- Módulo de productos y pedidos simulados.
- Panel administrativo y de supervisión.
- Sistema de comunicación y contacto.
- Módulo educativo e informativo.

Quedan excluidas las integraciones con pasarelas de pago reales, aplicaciones móviles nativas y soporte multilingüe, las cuales serán consideradas en versiones futuras.

### 1.3. Audiencia objetivo

Este documento está dirigido a:

- **Equipo de desarrollo**: Para implementar consistentemente los componentes del sistema.
- **Líder de proyecto**: Para supervisar la alineación técnica con los objetivos establecidos.
- **Docente orientador**: Para validar las decisiones técnicas y la aplicabilidad de los conocimientos académicos.
- **Stakeholders técnicos**: Para comprender las capacidades y limitaciones técnicas de la plataforma.

### 1.4. Definiciones y acrónimos

- **SPA (Single Page Application)**: Aplicación web que carga una sola página y actualiza su contenido dinámicamente.
- **API REST (Representational State Transfer)**: Interfaz de programación que utiliza protocolos estándar (HTTP) para la comunicación entre componentes.
- **ORM (Object-Relational Mapping)**: Técnica de programación para convertir datos entre sistemas incompatibles (ej.: objetos de código y bases de datos).
- **JWT (JSON Web Token)**: Estándar abierto para la creación de tokens de acceso que permiten la autenticación y autorización segura.
- **SSR (Server-Side Rendering)**: Técnica donde las páginas web se renderizan en el servidor antes de ser enviadas al cliente.
- **PaaS (Platform as a Service)**: Servicio en la nube que proporciona una plataforma para desarrollar, ejecutar y gestionar aplicaciones.

---

## 2. Representación arquitectónica general

### 2.1. Diagrama de arquitectura de alto nivel

La arquitectura de PawLig sigue un patrón en capas con una clara separación de responsabilidades, facilitando el mantenimiento y la escalabilidad. El flujo básico es:

```mermaid
[Cliente (Navegador Web)]
⇅ HTTPS
[Next.js 14 Fullstack – Vercel]
├─ Client Components (React)
├─ Server Components (RSC)
├─ API Routes (/api/)
└─ Server Actions
└─ NextAuth.js (/api/auth/)
⇅ Prisma ORM
[Capa de datos (MongoDB Atlas)]
⇅ API
[Servicios externos (Cloudinary)]

```

### 2.2. Descripción general de componentes

#### A. Cliente (frontend)

- **Tecnología**: Next.js 14 con App Router.
- **Función**: Interfaz de usuario responsive que consume la API REST.
- **Características**: Renderizado híbrido (SSR/CSR), gestión de estado con React Context/useState, enrutamiento del framework.

#### B. Lógica de negocio (backend)

- **Tecnología**: Next.js API Routes y Server Actions.
- **Función**: Procesar solicitudes, aplicar reglas de negocio, orquestar operaciones mediante endpoints serverless.
- **Características**:
  - API RESTful con Route Handlers (`/app/api/*`).
  - Autenticación JWT gestionada por NextAuth.js.
  - Validación de datos con Zod.
  - Lógica de negocio centralizada en API Routes.
  - Server-Side Rendering (SSR) y Server Components.

#### C. Capa de datos

- **Tecnología**: MongoDB Atlas (base de datos NoSQL).
- **Función**: Almacenamiento persistente de todos los datos del sistema.
- **Características**: Esquema flexible mediante Prisma ORM, consultas optimizadas, backup automático.

#### D. Servicios externos

- **Cloudinary**: Gestión y optimización de imágenes (fotos de mascotas y productos).
- **Plataformas de despliegue**: Vercel (aplicación fullstack con frontend y backend unificados), MongoDB Atlas (base de datos en la nube).

#### E. Comunicación entre componentes

- **Cliente-servidor**: Comunicación interna Next.js (`fetch`/`axios`) + API Routes sobre HTTPS.
- **API Routes–Base de datos**: Prisma ORM con conexión segura desde Server Components.
- **API Routes–Cloudinary**: SDK oficial con autenticación por API key.
- **Autenticación**: NextAuth.js maneja tokens JWT automáticamente mediante cookies HttpOnly.
- **Comunicación externa**: Redirección a WhatsApp (`wa.me`) e Instagram para contacto directo entre adoptantes y albergues, sin integración con APIs de redes sociales (HU-008, CU-007).

> **Nota importante**: El sistema **NO incluye chat interno integrado**. Toda comunicación entre adoptantes y albergues se realiza mediante redirección a plataformas externas (WhatsApp e Instagram), donde los usuarios pueden iniciar conversaciones directas. Esta decisión se tomó para cumplir con las restricciones de presupuesto ($0 COP) y tiempo (7 semanas) del proyecto académico, enfocando recursos en las funcionalidades core de adopción y e-commerce.

---

## 3. Decisiones arquitectónicas claves

### 3.1. Patrón arquitectónico seleccionado

Se ha seleccionado la **Arquitectura Fullstack Monolítica (Next.js Fullstack)** con separación lógica de responsabilidades mediante la estructura de carpetas de Next.js 14 App Router. El patrón combina:

- **Frontend**: React Server Components (RSC) y Client Components.
- **Backend**: API Routes (Route Handlers) y Server Actions.
- **Autenticación**: NextAuth.js con estrategia JWT.

Esta arquitectura unifica frontend y backend en un solo framework, simplificando el desarrollo y deployment mientras mantiene la separación de responsabilidades.

**Justificación**:

- **Desarrollo acelerado**: Un solo repositorio, un solo framework, cumple con el cronograma de 7 semanas.
- **Deployment simplificado**: Una sola plataforma (Vercel) con optimizaciones automáticas.
- **Type-safety completo**: TypeScript end-to-end desde UI hasta base de datos.
- **Autenticación integrada**: NextAuth.js reduce complejidad de manejo de JWT manual.
- **Restricciones de presupuesto**: $0 COP, Vercel Hobby cubre frontend + backend + funciones serverless.

### 3.2. Justificación de tecnologías

**Frontend – Next.js**:

- SSR nativo: Cumple con RNF-001 (tiempos de carga < 3 segundos) y mejora SEO.
- Full-stack capabilities: Permite API routes para funcionalidades simples.
- Ecosistema React: Amplia adopción y compatibilidad con componentes modernos.
- Deploy en Vercel: Optimización automática y escalado sin configuración.

**Backend integrado – Next.js API Routes**:

- Serverless functions: Escalado automático sin configuración de servidores.
- Mismo contexto de ejecución: Comparte código, tipos y utilidades con el frontend.
- Optimización automática: Vercel optimiza code splitting y caching.
- Zero-config: No requiere configuración de CORS, middleware complejo o servidor Express.

**Autenticación – NextAuth.js**:

- JWT automático: Genera, firma y valida tokens sin configuración manual.
- Session management: Manejo de sesiones seguro con cookies HttpOnly (RNF-002).
- Múltiples providers: Preparado para OAuth (fuera del alcance v1.0) sin refactorización.
- Callbacks personalizados: Control total sobre los datos de sesión y JWT (RF-005: roles).
- Integración con Prisma: Adaptadores nativos para persistencia de sesiones si se requiere en el futuro.

**Base de datos – MongoDB + Prisma**:

- Esquema flexible: Ideal para datos de mascotas y productos con atributos variables.
- Prisma ORM: Type-safe, migraciones automáticas, validación de datos.
- MongoDB Atlas: Servicio gestionado, backup automático, compatible con restricciones de presupuesto ($0 COP).

**Almacenamiento – Cloudinary**:

- Optimización automática: Reducción de tamaño de imágenes manteniendo calidad.
- Transformaciones on-demand: Diferentes tamaños para diferentes vistas.
- CDN integrada: Entrega rápida de assets multimedia worldwide.

### 3.3. Restricciones técnicas

**Impuestas por el contexto académico**:

- Presupuesto $0 COP: Uso exclusivo de servicios gratuitos (Vercel Hobby, Railway Free, MongoDB Atlas M0).
- Tiempo limitado: 7 semanas de desarrollo, priorizando MVP funcional sobre optimizaciones avanzadas.
- Recursos computacionales: Límites en RAM, CPU y almacenamiento de planes gratuitos.
- Presupuesto $0 COP: Uso exclusivo de servicios gratuitos (Vercel Hobby, MongoDB Atlas M0, Cloudinary Free Tier).

**Arquitecturales**:

- Arquitectura full-stack: Next.js unifica frontend y backend en un solo monolito modular.
- Hybrid rendering: Combinación de SSR, SSG y CSR según necesidades de cada página.
- Serverless functions: API Routes desplegadas como funciones serverless en Vercel.

**Tecnológicas**:

- JavaScript/TypeScript only: Stack tecnológico unificado para todo el equipo.
- No microservicios iniciales: Arquitectura monolítica modular para reducir complejidad en v1.0.
- Sin WebSockets: Comunicación en tiempo real mediante polling para simplificar implementación.

---

## 4. Vistas arquitectónicas detalladas

### 4.1. Capa de presentación (frontend)

#### 4.1.1. Tecnologías y frameworks

- **Framework**: Next.js 14 con App Router (soporte para Server Components y Client Components).
- **Lenguaje**: TypeScript para tipado estático end-to-end desde UI hasta base de datos.
- **Estilos**: Tailwind CSS para diseño responsive y utility-first styling.
- **Gestión de estado**:
  - React Context API para estado global compartido (carrito de compras, notificaciones)
  - `useState`/`useReducer` para estado local de componentes
  - NextAuth.js `useSession()` hook para estado de autenticación
- **HTTP Client**: Fetch API nativo en Server Components, Axios opcional en Client Components.
- **Autenticación**: NextAuth.js v5 con `CredentialsProvider` para login basado en JWT.
- **Validación**: Zod para validación de formularios en cliente y esquemas en servidor.
- **Data Fetching**: Server Components con `fetch` directo desde componentes React sin necesidad de API Routes adicionales.
- **Optimización de imágenes**: Next.js Image component con lazy loading automático y optimización de formatos (WebP).

#### 4.1.2. Estructura de componentes

```mermaid
src/
├── app/ # App Router (Next.js 14)
│ ├── (auth)/ # Grupo de rutas de autenticación
│ │ ├── login/page.tsx # Página de login (RF-002)
│ │ ├── register/page.tsx # Página de registro (RF-001, HU-001)
│ │ └── forgot-password/page.tsx # Recuperación de contraseña (RF-004)
│ ├── (dashboard)/ # Grupo de rutas protegidas por autenticación
│ │ ├── admin/ # Panel administrativo (RF-017)
│ │ │ ├── page.tsx # Dashboard admin (HU-013)
│ │ │ ├── users/page.tsx # Gestión de usuarios (HU-014)
│ │ │ └── settings/page.tsx # Configuración del sistema (HU-015)
│ │ ├── shelter/ # Panel de albergues
│ │ │ ├── page.tsx # Dashboard de albergue
│ │ │ ├── pets/ # Gestión de mascotas
│ │ │ │ ├── page.tsx # Lista de mascotas (RF-008)
│ │ │ │ ├── new/page.tsx # Publicar mascota (HU-005)
│ │ │ │ └── [id]/edit/page.tsx # Editar mascota
│ │ │ └── reports/page.tsx # Reportes de adopciones (HU-011)
│ │ ├── vendor/ # Panel de vendedores
│ │ │ ├── page.tsx # Dashboard de vendedor
│ │ │ ├── products/page.tsx # Gestión de productos (HU-010)
│ │ │ └── orders/page.tsx # Órdenes recibidas (HU-012)
│ │ └── user/ # Panel de usuarios/adoptantes
│ │ ├── page.tsx # Dashboard de usuario (HU-004)
│ │ ├── profile/page.tsx # Perfil de usuario (RF-003)
│ │ ├── favorites/page.tsx # Mascotas favoritas
│ │ └── adoptions/page.tsx # Mis postulaciones (HU-007)
│ ├── adopciones/ # Módulo público de adopciones
│ │ ├── page.tsx # Galería de mascotas (RF-009, HU-006)
│ │ └── [id]/page.tsx # Detalle de mascota
│ ├── productos/ # Módulo público de tienda
│ │ ├── page.tsx # Catálogo de productos (RF-012)
│ │ ├── [id]/page.tsx # Detalle de producto
│ │ └── cart/page.tsx # Carrito de compras (RF-014)
│ ├── albergues/ # Página informativa
│ │ └── page.tsx # Mapa y listado de albergues
│ ├── api/ # API Routes (Backend)
│ │ ├── auth/
│ │ │ └── [...nextauth]/route.ts # NextAuth.js handler
│ │ ├── users/
│ │ │ ├── route.ts # CRUD usuarios (RF-001, RF-003)
│ │ │ └── [id]/route.ts
│ │ ├── shelters/
│ │ │ ├── route.ts # Gestión albergues (RF-006, HU-002)
│ │ │ └── [id]/route.ts
│ │ ├── pets/
│ │ │ ├── route.ts # CRUD mascotas (RF-008, RF-009)
│ │ │ └── [id]/route.ts
│ │ ├── products/
│ │ │ ├── route.ts # CRUD productos (RF-012, RF-013)
│ │ │ └── [id]/route.ts
│ │ ├── cart/route.ts # Gestión carrito (RF-014)
│ │ ├── orders/route.ts # Órdenes simuladas (RF-015)
│ │ └── admin/
│ │ ├── users/route.ts # Gestión admin (RF-005, HU-014)
│ │ └── dashboard/route.ts # Métricas (RF-017, HU-013)
│ ├── layout.tsx # Layout raíz con providers
│ ├── page.tsx # Página de inicio pública
│ └── not-found.tsx # Página 404
├── components/ # Componentes reutilizables
│ ├── ui/ # Componentes base de interfaz
│ │ ├── button.tsx
│ │ ├── input.tsx
│ │ ├── modal.tsx
│ │ ├── card.tsx
│ │ └── badge.tsx
│ ├── forms/ # Formularios reutilizables
│ │ ├── login-form.tsx # Formulario de login (RF-002)
│ │ ├── register-form.tsx # Formulario de registro (RF-001)
│ │ ├── pet-form.tsx # Formulario de mascota (RF-008)
│ │ └── product-form.tsx # Formulario de producto (RF-012)
│ ├── cards/ # Tarjetas de entidades
│ │ ├── pet-card.tsx # Tarjeta de mascota
│ │ ├── product-card.tsx # Tarjeta de producto
│ │ └── shelter-card.tsx # Tarjeta de albergue
│ └── layout/ # Componentes de layout
│ ├── header.tsx # Header con navegación
│ ├── footer.tsx # Footer
│ └── sidebar.tsx # Sidebar para dashboards
│ └── navbar.tsx # Navbar público
├── providers/ # Context providers
│ ├── auth-provider.tsx # Wrapper de NextAuth SessionProvider
│ └── cart-provider.tsx # Context del carrito (RF-014)
├── lib/ # Utilidades y lógica de negocio
│ ├── auth/
│ │ ├── auth-options.ts # Configuración de NextAuth.js
│ │ ├── permissions.ts # Helpers de permisos por rol (RF-005)
│ │ └── password.ts # Utilidades bcrypt (RNF-002)
│ ├── services/ # Lógica de negocio (capa de servicio)
│ │ ├── user.service.ts # Operaciones de usuarios
│ │ ├── pet.service.ts # Operaciones de mascotas
│ │ ├── product.service.ts # Operaciones de productos
│ │ └── adoption.service.ts # Operaciones de adopciones
│ ├── validations/ # Esquemas Zod de validación
│ │ ├── user.schema.ts # Validaciones de usuarios
│ │ ├── pet.schema.ts # Validaciones de mascotas
│ │ └── product.schema.ts # Validaciones de productos
│ └── utils/ # Utilidades generales
│ ├── db.ts # Cliente Prisma singleton
│ ├── cloudinary.ts # Helper para Cloudinary
│ ├── constants.ts # Constantes (municipios, roles)
│ └── formatters.ts # Funciones de formateo
├── hooks/ # Custom React hooks
│ ├── use-auth.ts # Hook de autenticación
│ ├── use-cart.ts # Hook del carrito
│ └── use-filters.ts # Hook para filtros (RF-009)
├── types/ # Definiciones TypeScript
│ ├── next-auth.d.ts # Extensión de tipos de NextAuth
│ ├── api.types.ts # Tipos de respuestas de API
│ └── models.types.ts # Tipos de entidades del dominio
├── middleware.ts # Middleware de Next.js (protección de rutas)
├── prisma/
│ └── schema.prisma # Schema de base de datos Prisma
└── public/ # Assets estáticos
└── images/
└── icons/
```

#### 4.1.3. Enrutamiento y gestión de estado

- **Enrutamiento**: File-based routing de Next.js App Router.
- **Protección de rutas**: Middleware para verificación de roles (HU-014).
- **Estado global**: Context API para datos compartidos (usuario, carrito).
- **Estado local**: `useState`/`useReducer` para estado de componentes.
- **Autenticación de rutas**: `getServerSession()` de NextAuth en Server Components y API Routes.
- **Sesión del cliente**: `useSession()` hook para acceso a usuario autenticado en Client Components.
- **Protección por roles**: Middleware de Next.js verifica roles antes de renderizar páginas (RF-005).

### 4.2. Capa de lógica de negocio (backend)

#### 4.2.1. Tecnologías y frameworks

- **Runtime**: Node.js 18+ (Vercel Serverless Functions).
- **Framework**: Next.js 14 API Routes (Route Handlers).
- **Autenticación**: NextAuth.js v5 con `CredentialsProvider` + `bcryptjs`.
- **Validación**: Zod para validación de esquemas de entrada.
- **Seguridad**:
  - Cookies HttpOnly para tokens JWT (protección XSS – RNF-002).
  - CORS configurado automáticamente por Vercel.
  - Rate limiting mediante Vercel Edge Config o Upstash Redis (plan gratuito).
  - Sanitización de inputs con validadores Zod.
- **ORM**: Prisma Client con conexión directa a MongoDB Atlas.

#### 4.2.2. Estructura de la API y endpoints

**Endpoints organizados por dominio**:

**AUTENTICACIÓN Y USUARIOS (`/api/auth/*`, `/api/users/*`)**

- `POST /api/auth/register` # HU-001: Registro adoptante
- `POST /api/auth/login` # RF-002: Autenticación usuarios
- `POST /api/auth/forgot-password` # RF-004: Recuperación contraseña
- `POST /api/auth/reset-password` # RF-004: Reset contraseña
- `POST /api/shelters/apply` # HU-002: Solicitud cuenta albergue
- `PUT /api/shelters/:id/approve` # HU-002: Aprobación administrador
- `GET /api/users/profile` # RF-003: Obtener perfil usuario
- `PUT /api/users/profile` # HU-003: Actualizar perfil
- `GET /api/users/dashboard` # HU-004: Panel de usuario

**GESTIÓN DE MASCOTAS (`/api/pets/*`, `/api/adoptions/*`)**

- `GET /api/pets` # HU-006: Buscar/filtrar mascotas
- `POST /api/pets` # HU-005: Publicar mascota
- `GET /api/pets/:id` # Obtener detalle mascota
- `PUT /api/pets/:id` # HU-005: Editar mascota
- `PUT /api/pets/:id/status` # HU-005: Cambiar estado
- `POST /api/adoptions/apply` # HU-007: Postular adopción
- `GET /api/adoptions/my-applications` # HU-004: Mis postulaciones
- `PUT /api/adoptions/:id/status` # HU-007: Cambiar estado postulación

**PRODUCTOS Y PEDIDOS (`/api/products/*`, `/api/orders/*`)**

- `GET /api/products` # Catálogo productos
- `POST /api/products` # HU-010: Añadir producto
- `PUT /api/products/:id/stock` # HU-010: Actualizar stock
- `GET /api/cart` # HU-009: Obtener carrito
- `POST /api/orders` # HU-009: Crear pedido simulado

**REPORTES Y ADMINISTRACIÓN (`/api/reports/*`, `/api/admin/*`)**

- `GET /api/reports/adoptions` # HU-011: Reporte adopciones
- `GET /api/reports/orders` # HU-012: Reporte órdenes
- `GET /api/admin/dashboard` # HU-013: Dashboard administración
- `PUT /api/admin/users/:id/block` # HU-014: Bloquear usuario

#### 4.2.3. Lógica de negocio y validaciones

**Reglas de negocio implementadas**

- RN-001: Validación contraseña mínima 8 caracteres en registro.
- RN-002: Verificación de email único en base de datos.
- RN-007: Validación de al menos una foto por mascota.
- RN-008: Verificación de ubicación en municipios del Valle de Aburrá.
- RN-011: Restricción de postulaciones solo a mascotas disponibles.
- RN-015: Simulación de checkout sin pasarelas de pago reales.
- RN-012: Notificación inmediata al albergue.
- RN-013: Albergues deben proporcionar al menos un contacto externo válido (WhatsApp o Instagram) para recibir consultas de adopción.
- RN-014: Contactos externos deben ser verificados durante el proceso de aprobación de cuenta de albergue.
- RN-021: Mensaje predeterminado de WhatsApp debe incluir referencia a PawLig y nombre de la mascota.

**Validaciones de entrada**: Esquemas TypeScript en runtime con verificación de tipos.  
**Flujos de trabajo complejos**:

- Proceso de adopción: Postulación → Revisión → Entrevista → Aprobación.
- Proceso de pedido: Carrito → Validación stock → Orden simulada → Notificación.

### 4.3. Capa de datos

#### 4.3.1. Sistema de gestión de base de datos (SGBD)

- **Base de datos principal**: MongoDB Atlas (M0 Free Tier).
- **Tipo de base de datos**: NoSQL documental.
- **Características**: ReplicaSet de 512MB, backup automático, alta disponibilidad.
- **Justificación**: Esquema flexible ideal para datos de mascotas y productos con atributos variables.

#### 4.3.2. Modelo de datos principal

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

//===== ENUMS =====
enum Municipality {
  MEDELLIN
  BELLO
  ITAGUI
  ENVIGADO
  SABANETA
  LA_ESTRELLA
  CALDAS
  COPACABANA
  GIRARDOTA
  BARBOSA
}

enum UserRole {
  ADMIN
  SHELTER
  VENDOR
  ADOPTER
}

enum AuditAction {
  BLOCK
  UNBLOCK
  CHANGE_ROLE
  DELETE
}

enum PetStatus {
  AVAILABLE
  IN_PROCESS
  ADOPTED
}

enum AdoptionStatus {
  PENDING
  APPROVED
  REJECTED
}

enum OrderStatus {
  PENDING
  CONFIRMED
  SHIPPED
  DELIVERED
  CANCELLED
}

//===== MODELS =====
model User {
  id           String       @id @default(auto()) @map("_id") @db.ObjectId
  email        String       @unique
  password     String
  name         String
  role         UserRole     @default(ADOPTER)
  phone        String
  municipality Municipality
  address      String
  idNumber     String
  birthDate    DateTime

  // Bloqueos de usuarios (HU-014)
  isActive     Boolean      @default(true)
  blockedAt    DateTime?
  blockedBy    String?      @db.ObjectId
  blockReason  String?

  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt

  // Relaciones
  shelter      Shelter?
  vendor       Vendor?
  adoptions    Adoption[]
  orders       Order[]
  favorites    Favorite[]

  // Auditoría (HU-014)
  adminActions UserAudit[] @relation("AdminActions")
  auditRecords UserAudit[] @relation("AffectedUser")

  @@index([role])
  @@index([isActive])
  @@index([municipality])
}

model UserAudit {
  id           String       @id @default(auto()) @map("_id") @db.ObjectId

  // Acción realizada (HU-014)
  action       AuditAction  // Enum tipado (no String)
  reason       String       // Justificación obligatoria (RN-017)

  // Trazabilidad
  oldValue     String?
  newValue     String?

  // Relaciones
  performedBy  User         @relation("AdminActions", fields: [adminId], references: [id], onDelete: Cascade)
  adminId      String       @db.ObjectId
  affectedUser User         @relation("AffectedUser", fields: [userId], references: [id], onDelete: Cascade)
  userId       String       @db.ObjectId

  // Metadata de seguridad (RNF-002)
  ipAddress    String?
  userAgent    String?
  createdAt    DateTime     @default(now())

  @@index([userId])
  @@index([adminId])
  @@index([action])
  @@index([createdAt])
}

model Shelter {
  id               String       @id @default(auto()) @map("_id") @db.ObjectId
  name             String
  nit              String       @unique
  municipality     Municipality
  address          String
  description      String?
  verified         Boolean      @default(false)
  contactWhatsApp  String?
  contactInstagram String?
  rejectionReason  String?
  createdAt        DateTime     @default(now())
  updatedAt        DateTime     @updatedAt

  user             User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId           String       @unique @db.ObjectId

  pets             Pet[]

  @@index([verified])
  @@index([municipality])
  @@index([name])
}

model Vendor {
  id               String       @id @default(auto()) @map("_id") @db.ObjectId
  businessName     String
  businessPhone    String?
  description      String?
  logo             String?
  municipality     Municipality
  address          String
  verified         Boolean      @default(false)
  rejectionReason  String?
  createdAt        DateTime     @default(now())
  updatedAt        DateTime     @updatedAt

  user             User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId           String       @unique @db.ObjectId

  products         Product[]

  @@index([verified])
  @@index([municipality])
  @@index([businessName])
}

model Pet {
  id          String       @id @default(auto()) @map("_id") @db.ObjectId
  name        String
  species     String
  breed       String?
  age         Int?
  sex         String?
  status      PetStatus    @default(AVAILABLE)
  description String
  requirements String?
  images      String[]

  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt

  shelter     Shelter      @relation(fields: [shelterId], references: [id], onDelete: Cascade)
  shelterId   String       @db.ObjectId

  adoptions   Adoption[]
  favorites   Favorite[]

  @@index([status])
  @@index([species])
  @@index([shelterId])
  @@index([createdAt])
  @@index([name])
  @@index([sex])
  @@index([age])
}

model Product {
  id          String       @id @default(auto()) @map("_id") @db.ObjectId
  name        String
  price       Float
  stock       Int          @default(0)
  category    String
  description String?
  images      String[]

  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt

  vendor      Vendor       @relation(fields: [vendorId], references: [id], onDelete: Cascade)
  vendorId    String       @db.ObjectId

  orderItems  OrderItem[]

  @@index([category])
  @@index([vendorId])
  @@index([stock])
  @@index([name])
  @@index([price])
}

model Adoption {
  id          String         @id @default(auto()) @map("_id") @db.ObjectId
  status      AdoptionStatus @default(PENDING)
  message     String?
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt

  adopter     User           @relation(fields: [adopterId], references: [id], onDelete: Cascade)
  adopterId   String         @db.ObjectId
  pet         Pet            @relation(fields: [petId], references: [id], onDelete: Cascade)
  petId       String         @db.ObjectId

  @@unique([adopterId, petId])
  @@index([status])
  @@index([adopterId])
  @@index([petId])
  @@index([createdAt])
}

model Order {
  id                   String         @id @default(auto()) @map("_id") @db.ObjectId
  status               OrderStatus    @default(PENDING)
  total                Float
  shippingMunicipality Municipality
  shippingAddress      String
  paymentMethod        String
  createdAt            DateTime       @default(now())
  updatedAt            DateTime       @updatedAt

  user                 User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId               String         @db.ObjectId

  items                OrderItem[]

  @@index([status])
  @@index([userId])
  @@index([shippingMunicipality])
  @@index([createdAt])
}

model OrderItem {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  quantity  Int
  price     Float

  order     Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  orderId   String   @db.ObjectId
  product   Product  @relation(fields: [productId], references: [id])
  productId String   @db.ObjectId

  @@index([orderId])
  @@index([productId])
}

model Favorite {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  createdAt DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId    String   @db.ObjectId
  pet       Pet      @relation(fields: [petId], references: [id], onDelete: Cascade)
  petId     String   @db.ObjectId

  @@unique([userId, petId])
  @@index([userId])
  @@index([petId])
  @@index([createdAt])
}
```

#### 4.3.3. Estrategia de persistencia y ORM

- **ORM**: Prisma con MongoDB connector.
- **Ventajas**: Type-safe queries, migraciones automáticas, validación de datos.
- **Índices optimizados**:
  - Mascotas por ubicación y estado (**HU-006**).
  - Productos por categoría y stock (**HU-009**).
  - Usuarios por email y rol (**RF-002**).
  - Favoritos por usuario para acceso rápido (**RF-018**).
- **Estrategia de consultas**: Queries optimizadas con proyección de campos necesarios.
- **Backup y recuperación**: Automático diario en MongoDB Atlas.

### 4.4. Servicios externos e integraciones

#### 4.4.1. Servicio de almacenamiento multimedia (Cloudinary)

- **Función principal**: Almacenamiento, optimización y entrega de imágenes.
- **Integración**: SDK oficial de Cloudinary en API Routes de Next.js (`app/api/*`).
- **Flujo de trabajo**:
  1. Frontend sube imagen a endpoint dedicado.
  2. Backend procesa con Cloudinary SDK.
  3. Optimización automática (formato, tamaño, calidad).
  4. Almacenamiento en CDN global.
  5. Retorno de URL optimizada para almacenar en MongoDB.
- **Configuración**: Plan Free Tier (25 créditos/mes, suficiente para MVP).
- **Características**: Transformaciones on-demand, optimización WebP automática.

#### 4.4.2. Otros servicios externos

- **Plataformas de despliegue**:
  - **Aplicación completa (frontend + backend)**: Vercel.
    - Deployment automático desde GitHub.
    - SSL/TLS incluido y gestionado automáticamente.
    - Funciones serverless para API Routes.
    - Edge Network con CDN global.
    - **Plan**: Hobby (gratuito) – 100GB bandwidth mensual.
  - **Base de datos**: MongoDB Atlas.
    - Cluster M0 Free Tier (512MB storage).
    - Backup automático.
    - **Región**: `us-east-1` (mejor latencia para Colombia).

- **Control de versiones**:
  - **GitHub**: Repositorio privado del equipo.
  - **GitHub Projects**: Gestión de tareas y sprints.
  - **Integración con Vercel**: Deploy automático en push a `main`.

- **Monitoreo y logs**:
  - **Vercel Analytics**: Métricas de performance frontend (Web Vitals).
  - **Vercel Logs**: Logs de API Routes y funciones serverless.
  - **MongoDB Atlas Metrics**: Monitoreo de operaciones de base de datos.
  - **Vercel Speed Insights**: Análisis de tiempos de carga (**RNF-001**).

- **Comunicación externa (HU-008, CU-007)**:

  El sistema facilita la comunicación entre adoptantes y albergues mediante redirección a plataformas de mensajería externas, sin integración con APIs de terceros.
  - **Redirección a WhatsApp**:
    - **Formato de enlace**: `https://wa.me/[número]?text=[mensaje]`
    - **Mensaje predeterminado**: "Hola, me interesa adoptar a [nombre mascota] que vi en PawLig"
    - **Codificación**: El mensaje se codifica con `encodeURIComponent()` para URLs válidas.
    - **Compatibilidad**: Abre WhatsApp Web en desktop, WhatsApp App en móviles.
    - **Sin integración**: NO se usa WhatsApp Business API (requiere costos y aprobación).

  - **Redirección a Instagram**:
    - **Formato de enlace**: `https://instagram.com/[usuario]`
    - **Acción**: Abre el perfil del albergue en Instagram Web/App.
    - **Uso**: El usuario puede iniciar conversación mediante direct messages.
    - **Sin integración**: NO se usa Instagram Graph API (requiere permisos y tokens).

  - **Almacenamiento en Base de Datos**:
    - El modelo `Shelter` incluye campos: `contactWhatsApp` (String), `contactInstagram` (String).
    - **Validación de formato de WhatsApp**: regex `/^\+?[0-9]{10,15}$/`
    - **Validación de formato de Instagram**: regex `/^@?[a-zA-Z0-9._]{1,30}$/`
    - Al menos un método de contacto debe estar configurado (**RN-013**).

  - **Flujo de Contacto**:
    a. Adoptante visualiza mascota de interés.
    b. Clic en botón "Contactar Albergue".
    c. Sistema muestra opciones disponibles (WhatsApp/Instagram).
    d. Usuario selecciona método preferido.
    e. Sistema redirige a aplicación externa con datos precargados.
    f. Conversación ocurre completamente fuera de PawLig.
    g. **NO** se registra historial de mensajes en la base de datos.

  - **Ventajas de este enfoque**:
    - Cero costos de implementación y mantenimiento.
    - No requiere infraestructura de mensajería en tiempo real.
    - Usuarios utilizan apps familiares (WhatsApp/Instagram).
    - Albergues gestionan comunicación en plataformas que ya usan.
    - Cumple con restricciones de presupuesto ($0 COP) y tiempo (7 semanas).

  - **Limitaciones conocidas**:
    - No hay historial de conversaciones en PawLig.
    - No hay notificaciones push desde el sistema.
    - El sistema no puede validar si el adoptante contactó efectivamente al albergue.
    - Depende de que albergues mantengan sus cuentas de redes sociales activas.

- **Notificaciones por email (RF-004, HU-002, HU-007)**:
  - **Servicio**: Resend (plan gratuito – 100 emails/día).
  - **Integración**: API simple desde API Routes de Next.js.
  - **Uso**: Recuperación de contraseñas, notificaciones de postulaciones.
  - **Alternativa**: Nodemailer con Gmail SMTP si Resend no está disponible.

---

## 5. Consideraciones de despliegue

### 5.1. Entornos (desarrollo y producción)

#### Entorno de desarrollo (local)

- **Acceso**: `http://localhost:3000`
- **Servidor**: Next.js dev server con hot-reload automático.
- **Frontend**: Server Components + Client Components.
- **Backend**: API Routes en `/api/*`.
- **Autenticación**: NextAuth.js en `/api/auth/[...nextauth]`.
- **Base de datos**: MongoDB Atlas (cluster compartido para desarrollo – `pawlig_dev`).
- **Cloudinary**: Carpeta de desarrollo (`pawlig/dev`).
- **Variables de entorno**: Archivo `.env` en la raíz del proyecto.

**Características**:

- Hot-reload en cambios de código.
- Source maps habilitados para debugging.
- Logs detallados en consola.
- CORS deshabilitado (mismo origen).
- Error stack traces completos.

**Comandos**:

- `npm run dev` — Inicia servidor de desarrollo.
- `npx prisma studio` — Interfaz visual para base de datos.
- `npx prisma db push` — Sincroniza schema con MongoDB.

#### Entorno de producción (Vercel)

- **Acceso**: `https://pawlig.vercel.app`
- **Frontend**: Optimizado con Server-Side Rendering (SSR).
- **Backend**: Desplegado como funciones serverless.
- **Dominio**: Mismo dominio para frontend y backend (sin CORS).
- **Base de datos**: MongoDB Atlas (cluster M0 – `pawlig_prod`).
- **Cloudinary**: Carpeta de producción (`pawlig/prod`).
- **Variables de entorno**: Configuradas en Vercel Dashboard (_Settings → Environment Variables_).

**Características**:

- Build optimizado con Next.js compiler.
- Code splitting automático.
- Compresión gzip/brotli.
- SSL/TLS automático (certificado gestionado por Vercel).
- CDN Edge Network global.
- Logs estructurados con Vercel Logs.
- Métricas de performance con Vercel Analytics.

**Estrategia de Deploy**:

- Automático en push a rama `main`.
- Preview deployments en pull requests.

#### Diferencias clave entre entornos

| Característica   | Desarrollo                           | Producción                               |
| :--------------- | :----------------------------------- | :--------------------------------------- |
| **Logs**         | Verbose con colores en consola       | Estructurados en formato JSON            |
| **Datos**        | De prueba (usuarios, mascotas, etc.) | Reales de usuarios y albergues           |
| **Variables**    | Archivo `.env.local` (local)         | Dashboard de Vercel (encriptadas)        |
| **Herramientas** | Prisma Studio habilitado             | Monitoring con Vercel Analytics          |
| **Optimización** | Enfoque en velocidad de desarrollo   | Minificación, tree-shaking, lazy loading |

### 5.2. Estrategia de despliegue

- **Aplicación completa (Next.js en Vercel)**:
  - **Plataforma**: Vercel con integración directa a GitHub.

- **Estrategia de deployment**:
  1. **Desarrollo continuo**:
     - Desarrolladores trabajan en ramas `feature/nombre-feature`.
     - Commits locales + push a GitHub.
  2. **Preview deployments (automático)**:
     - Vercel detecta push a cualquier rama.
     - Build automático: `next build`.
     - Tests (opcional): `npm run test`.
     - Deploy en URL preview única: `https://pawlig-git-[branch]-[team].vercel.app`
     - Notificación: Comentario automático en PR con URL de preview.
     - **Propósito**: Testing de features antes de merge a `main`.
  3. **Producción (automático en merge a main)**:
     - PR aprobado → merge a rama `main`.
     - Vercel detecta cambios en `main`.
     - **Build de producción**:
       - `NODE_ENV=production`
       - `next build` (optimización SSR, SSG, code splitting)
       - `npx prisma generate` (tipos de Prisma)
     - Deploy a dominio de producción: `https://pawlig.vercel.app`
     - **Zero-downtime deployment**: La nueva versión se activa solo cuando está lista.
     - **Rollback**: Instantáneo disponible desde Vercel Dashboard.

#### Build process detallado

1. **Instalación de dependencias**:

   ```bash
   npm ci
   ```

2. **Generación de cliente Prisma**:

   ```bash
   npx prisma generate
   ```

3. **Build de Next.js**:

   ```bash
   npm run build
   ```

   - Compilación de TypeScript.
   - Optimización de Server Components.
   - Generación de assets estáticos.
   - Tree-shaking y code splitting.
   - Minificación de JavaScript y CSS.

4. **Verificación**:

   ```bash
   next info
   ```

#### Estrategia de branches

- **`main`**: Producción estable (protegida, requiere PR).
- **`develop`**: Rama de integración del equipo (opcional).
- **`feature/*`**: Características individuales por desarrollador.
- **`hotfix/*`**: Arreglos urgentes que van directo a `main`.

#### Automatizaciones incluidas

- **Prisma migrations**: `npx prisma migrate deploy` en cada build.
- **Environment variables**: Inyectadas automáticamente por Vercel.
- **Linting**: ESLint ejecutado en pre-commit hook (Husky).
- **Type checking**: `tsc --noEmit` para verificar tipos antes de build.
- **Lighthouse CI**: Auditoría de performance en preview deployments (opcional).

#### Base de datos (MongoDB Atlas)

- **Proveedor**: MongoDB Atlas con integración en Vercel.
- **Configuración**:
  - **Cluster**: M0 Shared (Free Tier).
  - **Región**: `us-east-1` (N. Virginia) – mejor latencia para Colombia.
  - **Versión**: MongoDB 7.0+.
  - **Connection**: `mongodb+srv://` (connection string con SSL/TLS).
- **Estrategia de datos**:
  - **Desarrollo**: Base de datos `pawlig_dev` (datos de prueba).
  - **Producción**: Base de datos `pawlig_prod` (datos reales).
- **Migraciones**: Prisma Migrate para cambios de schema.
  - **Desarrollo**: `npx prisma migrate dev`
  - **Producción**: `npx prisma migrate deploy` (automático en build).
- **Backup y recuperación**:
  - **Backup automático diario**: Retención de 7 días en plan M0.
  - **Point-in-time recovery**: No disponible en M0 (requiere upgrade a M10).
  - **Export manual**: Opción de exportar colecciones como JSON/CSV desde Atlas UI.
- **Seguridad de conexión**:
  - **IP whitelisting**: `0.0.0.0/0` (permitir todas las IPs de Vercel).
  - **Database users**: Usuario con permisos `readWrite` en base de datos específica.
  - **Connection string**: Almacenada en variables de entorno de Vercel (`DATABASE_URL`).
  - **Encryption**: TLS 1.2+ obligatorio para todas las conexiones.
- **Monitoring**:
  - **MongoDB Atlas Dashboard**: Métricas de queries, operaciones/segundo, uso de storage.
  - **Alerts configuradas para**:
    - Conexiones > 450 (límite M0: 500).
    - Storage > 400MB (límite M0: 512MB).
    - Queries lentas > 100ms.

---

### 5.3. Requisitos de infraestructura

#### Requisitos mínimos de producción

- **Aplicación completa (Vercel Hobby – Free)**:
  - **Plan**: Hobby (gratuito).
  - **Límites**:
    - Funciones serverless: 100GB-hours/mes.
    - Bandwidth: 100GB/mes.
    - Build time: 100 horas/mes.
    - Deployments: Ilimitados.
    - Team members: 1 (plan Hobby).
  - **Características incluidas**:
    - SSL/TLS automático.
    - CDN Edge Network global.
    - Preview deployments ilimitados.
    - Analytics básico.
    - Logs en tiempo real (retención: 1 hora).

- **Base de datos (MongoDB Atlas M0 – Free)**:
  - **Plan**: M0 Shared Cluster (gratuito).
  - **Límites**:
    - Storage: 512MB.
    - Connections: 500 simultáneas.
    - Backup: Automático diario (retención: 7 días).
  - **Regiones**: `us-east-1`, `us-west-2`, `eu-west-1`.

- **Almacenamiento multimedia (Cloudinary Free)**:
  - **Plan**: Free Tier (gratuito).
  - **Límites**:
    - Storage: 25GB.
    - Bandwidth: 25GB/mes.
    - Transformations: 25,000 créditos/mes.
  - **Características**:
    - CDN incluido.
    - Optimización automática (WebP).
    - Transformaciones on-demand.

#### Configuración de variables de entorno (Vercel)

**Variables requeridas en producción**:

- **Base de datos**:

  ```env
  DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/"
  ```

- **NextAuth.js**:

  ```env
  NEXTAUTH_SECRET="[generar con: openssl rand -base64 32]"
  NEXTAUTH_URL="https://pawlig.vercel.app"
  ```

- **Cloudinary**:

  ```env
  CLOUDINARY_CLOUD_NAME="tu_cloud_name"
  CLOUDINARY_API_KEY="tu_api_key"
  CLOUDINARY_API_SECRET="tu_api_secret"
  ```

- **Email (Resend)**:

  ```env
  RESEND_API_KEY="re_xxxxxxxxxxxxx"
  EMAIL_FROM="noreply@pawlig.vercel.app"
  ```

- **Opcionales**:

  ```env
  NODE_ENV="production"
  NEXT_PUBLIC_APP_URL="https://pawlig.vercel.app"
  ```

1. Ir a **Settings → Environment Variables**.
2. Agregar cada variable con su valor.
3. Seleccionar entornos: **Production**, **Preview**.
4. **Sensitive variables**: Marcar como "Sensitive" para ocultar en logs.

#### Monitoreo y métricas incluidas

- **Vercel Analytics (Hobby)**:
  - Web Vitals: LCP, FID, CLS, FCP, TTFB.
  - Real User Monitoring (RUM).
  - Device distribution (desktop/mobile/tablet).
  - Límite: 100,000 page views/mes.
- **Vercel Logs (Hobby)**:
  - Real-time logs de funciones serverless.
  - Retención: 1 hora.
- **MongoDB Atlas Metrics (M0)**:
  - Operations per second, Network I/O.
  - Query execution time, Connections count.
  - Storage usage y Alertas configurables.

#### Límites conocidos y mitigaciones

- **Vercel Hobby**:
  - _Límite_: Timeout de 10s en funciones serverless.
  - _Mitigación_: Optimizar queries de Prisma, implementar paginación.
  - _Límite_: Sin team collaboration.
  - _Mitigación_: Usar un solo usuario con credenciales compartidas.
- **MongoDB M0**:
  - _Límite_: Storage de 512MB.
  - _Mitigación_: Límites de tamaño en Cloudinary, limpieza periódica.
  - _Límite_: Conexiones limitadas a 500.
  - _Mitigación_: Connection pooling en Prisma.
- **Cloudinary Free**:
  - _Límite_: 25 créditos/mes.
  - _Mitigación_: Cache en Vercel CDN, lazy loading estricto.

#### Servicios NO requeridos (reducción de costos)

- No se requiere servidor de WebSockets (chat interno eliminado).
- No se requiere Redis para manejo de sesiones de chat.
- No se requiere servicio de notificaciones push en tiempo real.
- No se requiere almacenamiento de mensajes históricos.

#### Servicios de terceros NO utilizados

- **WhatsApp Business API**: NO integrado (vía enlaces `wa.me`).
- **Instagram Graph API**: NO integrado (vía enlaces directos).
- **Twilio/SendGrid**: NO requerido para mensajería.

#### Plan de escalabilidad futura

Si se superan los límites del Free Tier:

- **Vercel Pro**: $20/mes por usuario.
- **MongoDB M10**: $0.08/hora (≈ $57/mes).
- **Cloudinary Plus**: $99/mes.

#### Costo total estimado en producción real (post-MVP)

- **Mensual**: $176 USD (Vercel Pro + MongoDB M10 + Cloudinary Plus).
- **Anual**: $2,112 USD.

#### Consideraciones de costo para proyecto académico (RNF-008)

- **Durante desarrollo**: **$0 USD** (free tiers suficientes).
- **Post-entrega**: Decidir si mantener en producción o archivar proyecto.

## 6. Consideraciones de seguridad

### 6.1. Estrategia de autenticación y autorización

**Sistema de autenticación**:
La plataforma implementa un sistema de autenticación basado en **JSON Web Tokens (JWT)** gestionado mediante **NextAuth.js**. Este enfoque proporciona autenticación stateless que escala eficientemente y cumple con los requisitos de seguridad establecidos en **RNF-002**.

**Mecanismos de autenticación**:

- **Credenciales tradicionales**: Email y contraseña con encriptación **bcrypt** (salt rounds 12).
- **Gestión de sesiones**: Tokens JWT con expiración de 24 horas almacenados en cookies **HttpOnly**.
- **Protección contra ataques**: Límite de 3 intentos fallidos de autenticación (**RF-002**).
- **Recuperación segura**: Tokens temporales con expiración de 1 hora para restablecimiento de contraseña (**RF-004**).

**Gestión de roles**:

- **Administrador**:
  - **Permisos**:
    - Aprobar/rechazar solicitudes de albergues (**HU-002**).
    - Bloquear usuarios (**HU-014**).
    - Configurar categorías y filtros (**HU-015**).
    - Acceso a dashboard centralizado (**HU-013**).
  - **Restricciones**: Acceso completo al sistema.

- **Albergue**:
  - **Permisos**:
    - Publicar y gestionar mascotas (**HU-005**).
    - Gestionar solicitudes de adopción (**HU-007**).
    - Generar reportes de adopciones (**HU-011**).
    - Actualizar métodos de contacto.
  - **Restricciones**: Solo gestión de sus propias mascotas y solicitudes de usuarios adoptantes.

- **Vendedor**:
  - **Permisos**:
    - Gestionar inventario de productos (**HU-010**).
    - Actualizar perfil de negocio (**HU-003**).
    - Generar reportes de órdenes (**HU-012**).
  - **Restricciones**: Solo gestión de sus propios productos y órdenes de compradores.

- **Usuario**:
  - **Permisos**:
    - Postularse a adopciones (**HU-007**).
    - Guardar mascotas favoritas (**HU-004**).
    - Simular compras (**HU-009**).
    - Actualizar perfil personal.
  - **Restricciones**: Solo acceso a sus propias postulaciones y favoritos.

- **Anónimo**:
  - **Permisos**:
    - Buscar y filtrar mascotas (**HU-006**).
    - Ver galería de adopciones.
    - Ver perfiles de mascotas y albergues.
  - **Restricciones**: Sin acceso a funcionalidades que requieran autenticación.

---

### 6.2. Protección de datos y comunicaciones

#### Protección de datos sensibles

- **Encriptación de contraseñas**: Bcrypt con salt rounds 12 (**RNF-002**).
- **Datos personales**: Encriptación en reposo mediante **MongoDB Atlas encryption-at-rest**.
- **Tokens de autenticación**: JWT firmados con secret key de 256 bits.
- **Información de contacto**: Validación de formato para WhatsApp e Instagram (**HU-008**).

#### Protección de comunicaciones

- **HTTPS obligatorio**: Todas las comunicaciones cliente-servidor utilizan **TLS 1.3**.
- **Cabeceras de seguridad**:
  - `Strict-Transport-Security` (HSTS)
  - `Content-Security-Policy` (CSP)
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`

#### Protección contra ataques comunes

- **SQL Injection**: Validación parametrizada mediante **Prisma ORM** (**RNF-002**).
- **XSS (Cross-Site Scripting)**: Sanitización de inputs y outputs con **DOMPurify**.
- **CSRF (Cross-Site Request Forgery)**: Tokens CSRF integrados en **NextAuth.js**.
- **Rate limiting**: Límite de 100 requests por minuto por IP para endpoints críticos.

#### Protección de archivos multimedia

- **Validación de imágenes**: Verificación de formato (JPEG/PNG) y tamaño máximo (**HU-005**).
- **Escaneo de malware**: **Cloudinary AI-based malware detection** para uploads.
- **Enlaces seguros**: URLs firmadas con expiración para recursos sensibles.

#### Gestión de sesiones

- **Tokens JWT**: Expiración configurable (default: 24 horas).
- **Logout seguro**: Invalida tokens del lado del servidor.
- **Reautenticación**: Requerida para operaciones sensibles (bloqueo de usuarios, cambios de rol).

#### Auditoría y monitoreo

- **Logs de seguridad**: Registro de intentos fallidos de autenticación, cambios de roles y bloqueos.
- **Auditoría de acceso**: Trazabilidad completa de operaciones administrativas (**HU-014**).
- **Alertas tempranas**: Notificaciones por email para múltiples intentos fallidos de acceso.

#### Cumplimiento de requisitos de seguridad (RNF-002)

- Encriptación de contraseñas con **bcrypt**.
- Protección contra **SQL Injection** mediante **Prisma ORM**.
- Protección contra **XSS** con sanitización de inputs.
- Manejo de sesiones con **JWT** y expiración de 24 horas.
- **HTTPS obligatorio** para todas las comunicaciones.

---

### 6.3. Protección de datos personales

**Principios de privacidad**:

- **Minimización de datos**: Solo se recopila información estrictamente necesaria.
- **Limitación de propósito**: Los datos se utilizan exclusivamente para los fines del sistema.
- **Almacenamiento limitado**: Datos personales retenidos solo durante el tiempo necesario.

**Datos protegidos**:

- Información de identificación personal (nombre, email, teléfono).
- Direcciones de ubicación dentro del Valle de Aburrá.
- Documentos de identificación de albergues.
- Historial de adopciones y transacciones.

**Acceso a usuarios**:

- **Usuarios**: Solo pueden acceder a sus propios datos.
- **Albergues**: Solo acceden a información de sus mascotas y postulantes.
- **Proveedores**: Solo acceden a información de sus productos y órdenes.
- **Administradores**: Acceso completo con justificación y auditoría.
