# 🐾 PawLig - Plataforma Integral de Adopción de Mascotas

<div align="center">

**Una plataforma moderna para conectar mascotas con hogares responsables**

![Next.js](https://img.shields.io/badge/Next.js-14.2.33-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-38B2AC?style=flat-square&logo=tailwind-css)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=flat-square&logo=mongodb)
![Prisma](https://img.shields.io/badge/Prisma-6.19-2D3748?style=flat-square&logo=prisma)
![Google Gemini](https://img.shields.io/badge/Google%20Gemini-AI-orange?style=flat-square&logo=google-gemini)

**Proyecto de grado** <br>
📍 Medellín, Antioquia, Colombia
<br>
_Versión v1.8.0 | Última actualización: 28-04-2026_

</div>

---

## 📋 Tabla de Contenidos

1. [Descripción General](#-descripción-general)
2. [Características Principales](#-características-principales)
3. [Tecnologías Utilizadas](#-tecnologías-utilizadas)
4. [Instalación y Configuración](#-instalación-y-configuración)
5. [Estructura del Proyecto](#-estructura-del-proyecto)
6. [Roles y Permisos](#-roles-y-permisos-de-usuario)
7. [Modelo de Datos](#-modelo-de-datos)
8. [Scripts Disponibles](#-scripts-disponibles)
9. [Características de Seguridad](#-características-de-seguridad)
10. [Cómo Contribuir](#-cómo-contribuir)
11. [Licencia](#-licencia)
12. [Contacto](#-soporte-y-contacto)

---

## 📜 Descripción General

**PawLig** es una plataforma web full-stack integral diseñada para facilitar la adopción responsable de mascotas y dinamizar el comercio de productos especializados en el Valle de Aburrá. Nuestra misión es conectar a albergues, proveedores y adoptantes en un ecosistema seguro, eficiente y empático.

La plataforma integra tecnologías de vanguardia, incluyendo **Inteligencia Artificial Generativa**, para mejorar la calidad de las publicaciones y asegurar que cada mascota encuentre el hogar que merece.

---

## ✨ Características Principales

### 🔐 Autenticación y Seguridad de Nivel Empresarial

- **Sistema multi-rol estricto:** Admin, Albergue (Shelter), Proveedor (Vendor) y Adoptante (Adopter).
- **Protección de rutas:** Middleware avanzado que valida sesiones y permisos en tiempo real.
- **Auditoría completa:** Registro detallado de acciones administrativas (bloqueos, cambios de rol) con justificaciones obligatorias, IP y User-Agent.
- **Seguridad en UI:** Inputs de contraseña con toggle de visibilidad y protección contra duplicidad de iconos nativos del navegador.

### 🐕 Ecosistema de Adopciones con IA

- **Asistente de IA (Google Gemini):** Refinamiento automático de descripciones de mascotas para maximizar el impacto emocional y la claridad.
- **Gestión integral:** Ciclo de vida completo de la adopción, desde la publicación hasta la aprobación final.
- **Búsqueda inteligente:** Filtros avanzados por especie, raza, edad, sexo y ubicación.

### 🛍️ Marketplace Especializado

- **Catálogo dinámico:** Gestión de inventario en tiempo real para proveedores.
- **IA para Ventas:** Optimizador de descripciones de productos mediante IA para mejorar la conversión.
- **Carrito persistente:** Experiencia de compra fluida con persistencia local y sincronización de estado.

### 📧 Sistema de Notificaciones por Email

- **Comunicación omnicanal:** 11 plantillas personalizadas para flujos críticos (adopciones, pedidos, seguridad).
- **Branding Cohesivo:** Correos electrónicos diseñados con React Email para una experiencia de marca consistente.
- **Automatización:** Envío inteligente de estados de pedido y confirmaciones de adopción vía Resend.

### 📑 Centro de Ayuda y Documentación

- **Help Center Integrado:** Manual de usuario y guías rápidas accesibles directamente en la plataforma.
- **Transparencia:** Acceso público a términos, privacidad y registro de cambios (Changelog).

### 📊 Paneles de Control (Dashboards)

- **Métricas e Indicadores:** Visualización de datos clave adaptada a cada rol de usuario.
- **Gestión de Usuarios:** Herramientas administrativas para la moderación y seguridad de la comunidad.

---

## 🛠️ Tecnologías Utilizadas

### Frontend & UI

- **Next.js 14 (App Router):** Framework principal para una experiencia web moderna y rápida.
- **React 18:** Biblioteca base para la construcción de interfaces.
- **Tailwind CSS:** Estilizado basado en utilidades con un sistema de diseño cohesivo.
- **Lucide React:** Set de iconos consistente y ligero.
- **Radix UI:** Primitivas de componentes accesibles.

### Backend & Lógica

- **TypeScript 5:** Tipado estático para un código robusto y mantenible.
- **NextAuth.js:** Gestión de autenticación y sesiones seguras.
- **Prisma ORM:** Modelado de datos y consultas tipadas a la base de datos.
- **Zod:** Validación rigurosa de esquemas en cliente y servidor.
- **Google Generative AI:** Integración con el modelo `gemini-2.5-flash`.
- **Resend & React Email:** Infraestructura y diseño para comunicaciones transaccionales.

### Infraestructura

- **MongoDB Atlas:** Base de datos NoSQL escalable.
- **Cloudinary:** Gestión y optimización de activos multimedia (imágenes).
- **Vitest:** Framework de pruebas unitarias y de integración de alto rendimiento.

---

## 📦 Instalación y Configuración

### Prerrequisitos

- Node.js 18.17 o superior.
- npm 9 o superior.
- Una instancia de MongoDB (Local o Atlas).
- Credenciales de Cloudinary y Google Gemini API.

### Pasos de Configuración

1. **Clonar el Repositorio:**

   ```bash
   git clone https://github.com/asebasg/pawlig.git
   cd pawlig
   ```

2. **Instalar Dependencias:**

   ```bash
   npm install
   ```

3. **Configurar el Entorno:**
   Crea un archivo `.env` basado en `.env.local.example` y completa las variables:

   ```env
   DATABASE_URL="mongodb+srv://..."
   NEXTAUTH_SECRET="tu-secreto"
   NEXTAUTH_URL="http://localhost:3000"
   CLOUDINARY_API_KEY="..."
   GEMINI_API_KEY="..."
   RESEND_API_KEY="..."
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. **Preparar la Base de Datos:**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Lanzar el Entorno de Desarrollo:**

   ```bash
   npm run dev
   ```

---

## 🗂️ Estructura del Proyecto

```text
pawlig/
├── app/                  # App Router: Rutas, layouts y componentes de página
│   ├── (auth)/           # Rutas de autenticación (Login, Registro)
│   ├── (dashboard)/      # Paneles privados protegidos por rol
│   ├── (public)/         # Páginas de acceso libre (Adopciones, Productos, Ayuda)
│   └── api/              # Endpoints de la API interna
├── components/           # Componentes React organizados por dominio
│   ├── ui/               # Componentes atómicos (Botones, Inputs, etc.)
│   ├── forms/            # Lógica de formularios y validaciones
│   └── layout/           # Elementos estructurales (Navbar, Footer)
├── lib/                  # Núcleo: Servicios, utilidades y configuraciones
│   ├── email/            # Plantillas y componentes de correo electrónico
│   └── services/         # Lógica de negocio y servicios externos
├── prisma/               # Esquema de datos y migraciones
├── public/               # Assets estáticos (Imágenes, Iconos)
├── types/                # Definiciones de tipos TypeScript globales
└── middleware.ts         # Control de acceso y seguridad de rutas
```

---

## 🔑 Roles y Permisos

- **👑 ADMIN:** Supervisión global, auditoría de seguridad y gestión de roles/bloqueos.
- **🏠 SHELTER (Albergue):** Publicación de mascotas, gestión de solicitudes de adopción y métricas de impacto.
- **🏬 VENDOR (Proveedor):** Gestión de catálogo de productos, inventario y procesamiento de pedidos.
- **🐾 ADOPTER (Adoptante):** Proceso de adopción, compras en el marketplace y gestión de favoritos.

---

## 🧪 Scripts Disponibles

| Comando             | Descripción                                                  |
| :------------------ | :----------------------------------------------------------- |
| `npm run dev`       | Inicia el servidor de desarrollo con Hot Reload.             |
| `npm run build`     | Genera la versión optimizada para producción.                |
| `npm run start`     | Inicia el servidor de producción.                            |
| `npm run test`      | Ejecuta la suite de pruebas con Vitest.                      |
| `npm run lint`      | Analiza el código en busca de problemas de estilo o errores. |
| `npx prisma studio` | Abre una interfaz web para explorar la base de datos.        |

---

## 🔐 Seguridad y Calidad

- **Validación Zod:** Ningún dato entra a la base de datos sin ser validado estrictamente.
- **Manejo de Errores:** Sistema centralizado para respuestas de API y retroalimentación al usuario.
- **Testing:** Suite de pruebas que asegura la integridad de los servicios críticos de mascotas y usuarios.
- **Escalabilidad:** Arquitectura basada en servicios que separa la lógica de negocio de los controladores de API.

---

## 🤝 Cómo Contribuir

1. Realiza un **Fork** del proyecto.
2. Crea una **Rama** para tu funcionalidad (`git checkout -b feat/nueva-funcionalidad`).
3. Realiza tus cambios siguiendo los estándares de **Conventional Commits**.
4. Asegúrate de que las pruebas pasen (`npm run test`).
5. Envía un **Pull Request** detallando tus cambios.

---

## 📝 Licencia

Este proyecto ha sido desarrollado con fines académicos en la **Universidad de San Buenaventura, Medellín**. Todos los derechos reservados © 2026.

---

## 📞 Soporte y Contacto

**Equipo de Desarrollo:**

- **Andrés Sebastián Ospina Guzmán** - [asebasg07@gmail.com](mailto:asebasg07@gmail.com)
- **Mateo Úsuga Vasco** - [mateo.usuga.v21@gmail.com](mailto:mateo.usuga.v21@gmail.com)
- **Santiago Lezcano Escobar** - [santiag1725g@gmail.com](mailto:santiag1725g@gmail.com)

---

<div align="center">

**Desarrollado con ❤️ para transformar la vida de las mascotas.**

[⬆ Volver al inicio](#-pawlig---plataforma-integral-de-adopción-de-mascotas)

</div>
