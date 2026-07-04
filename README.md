# 🐾 PawLig — Plataforma Integral de Adopción y Marketplace

<div align="center">

**Ecosistema digital unificado para la conexión de mascotas, hogares responsables y comercio especializado en el Valle de Aburrá.**

![Next.js](https://img.shields.io/badge/Next.js-14.2.33-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-38B2AC?style=flat-square&logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-6.2.1-2D3748?style=flat-square&logo=prisma)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=flat-square&logo=mongodb)
![Google Gemini](https://img.shields.io/badge/Google%20Gemini-2.5--flash-orange?style=flat-square&logo=google-gemini)

**Proyecto de Grado** <br>
📍 Medellín, Antioquia, Colombia
<br>
_Versión v1.8.0 | Última actualización: 15 de junio de 2026_

</div>

---

> [!IMPORTANT]
> **Estándar de Codificación (Gold Standard):** Se recomienda encarecidamente consultar y adherirse al __**Manual de Reglas y Estándares (.rules.md)**__ antes de iniciar cualquier labor de desarrollo. Este documento establece las directrices críticas de arquitectura, nomenclatura y calidad de código del proyecto.


---

## 📖 Descripción General

**PawLig** es un ecosistema digital integral diseñado para unificar los procesos de adopción y dinamizar el marketplace de bienestar animal en el Valle de Aburrá. La plataforma mitiga la fragmentación del sector mediante una solución full-stack que conecta de forma transparente a:

1.  **Albergues (Shelters):** Centros de rescate que gestionan el ciclo de vida de las mascotas, desde la publicación hasta el seguimiento de adopciones aprobadas.
2.  **Vendedores (Vendors):** Comercios especializados con acceso a un marketplace regional con gestión de inventario y analítica de ventas.
3.  **Adoptantes (Adopters):** Usuarios finales con una experiencia optimizada para la búsqueda empática, gestión de favoritos y adquisición de suministros.

Mediante el uso de **Inteligencia Artificial**, **Visualización Geoespacial** y un **Motor de Simulación Física**, PawLig redefine el estándar de bienestar animal digital con trazabilidad absoluta y seguridad transaccional.

---

## ✨ Características Principales

### 🧠 Asistente de IA (Google Gemini 2.5-flash)
- **Refinamiento de Contenido:** Endpoint `/api/ai/refine` que transforma descripciones básicas en textos persuasivos y optimizados para adopción o venta.
- **Contextualización Dinámica:** Prompting especializado que ajusta el tono emocional para mascotas y el tono comercial para productos.

### 🛡️ Moderation Hub & Auditoría Polimórfica
- **Control Centralizado:** Gestión unificada de usuarios, albergues y vendedores bajo el segmento `/admin/moderation`.
- **Registro de Auditoría (HU-014):** Sistema `SystemAuditLog` que rastrea de forma atómica cada acción administrativa (bloqueos, cambios de rol, aprobaciones) con justificación obligatoria.
- **Seguridad Multimedia:** Gestión de Cloudinary con validación de propiedad (RBAC) para evitar la eliminación de recursos no autorizados.

### 🌌 404 Orbital Engine
- **Simulación Física Kepleriana:** Motor en Canvas 2D que simula órbitas planetarias reales para los elementos de marca en páginas no encontradas.
- **Proyección Isométrica:** Experiencia inmersiva con oclusión dinámica de capas y simulación de profundidad 3D.

### 🗺️ Visualización Geoespacial (Leaflet)
- **Localización de Refugios:** Mapa interactivo del Valle de Aburrá con geocodificación proactiva y búsqueda por municipio.
- **Normalización de Direcciones:** Servicio interno para la conversión de direcciones físicas a coordenadas geoespaciales.

### 📧 Email Engine (Resend + React Email)
- **Notificaciones Transaccionales:** Sistema automatizado con 11 plantillas personalizadas para flujos de adopción, pedidos, seguridad y recuperación de cuentas.
- **Envíos No Bloqueantes:** Arquitectura asíncrona que garantiza la disponibilidad de la API incluso ante fallas externas.

### 📊 Sistema de Métricas y Reportes
- **Dashboards Analíticos:** Visualización de tendencias de adopción y ventas mediante Recharts.
- **Exportación Multi-formato:** Generación de reportes profesionales en **Excel**, **PDF** (con autotable) y **CSV**.

---

## 🛠️ Tecnologías y Herramientas

| Capa | Tecnología | Versión |
| :--- | :--- | :--- |
| **Framework** | Next.js (App Router) | 14.2.33 |
| **Lenguaje** | TypeScript | 5.0 |
| **Base de Datos** | MongoDB Atlas | Cloud |
| **ORM** | Prisma | 6.2.1 |
| **Autenticación** | NextAuth.js | 4.24.7 |
| **Estilos** | Tailwind CSS | 3.4.1 |
| **IA** | Google Gemini AI | 0.24.1 |
| **Emails** | Resend / React Email | 6.12.2 / 1.0.12 |
| **Mapas** | Leaflet / React Leaflet | 1.9.4 / 4.2.1 |
| **Analítica** | Recharts | 3.8.1 |
| **Testing** | Vitest / JSDOM | 4.0.16 / 27.4.0 |

---

## 📂 Estructura del Proyecto

```text
├── app/                # Rutas (App Router), APIs y Layouts
├── components/         # Componentes modulares (UI, Forms, Cards, Admin)
├── lib/                # Núcleo: Servicios, hooks, esquemas y utilidades
├── prisma/             # Esquema de MongoDB y scripts de seeding
├── public/             # Documentación técnica (.md) y assets estáticos
├── scripts/            # Automatización (Geocodificación, Pruebas)
├── types/              # Definiciones globales de TypeScript
└── (root)              # Configuración (Tailwind, Vitest, Prisma, etc.)
```

---

## 🚀 Instalación y Configuración

### Prerrequisitos
- **Node.js:** 18.17 o superior (LTS recomendada).
- **npm:** 9 o superior.
- **Base de Datos:** Instancia de MongoDB activa (versión 6.0+ recomendada).

### Guía de Instalación
1.  **Clonar el Repositorio:**
    ```bash
    git clone https://github.com/asebasg/pawlig.git
    cd pawlig
    ```
2.  **Instalar Dependencias:**
    ```bash
    npm install
    ```
3.  **Configurar Variables de Entorno:**
    Cree un archivo `.env` en la raíz basado en `.env.local.example`:
    ```env
    DATABASE_URL="mongodb+srv://..."
    NEXTAUTH_SECRET="ej: openssl rand -base64 32"
    NEXTAUTH_URL="http://localhost:3000"

    # IA & Multimedia
    GEMINI_API_KEY="su_api_key"
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="su_cloud_name"
    CLOUDINARY_URL="su_cloudinary_url"

    # Email (Resend)
    RESEND_API_KEY="su_api_key"
    EMAIL_FROM="onboarding@resend.dev"
    ```
4.  **Inicializar Base de Datos (ORM):**
    ```bash
    npx prisma generate
    npx prisma db push
    ```

---

## 💻 Guía de Uso

- **Entorno de Desarrollo:** `npm run dev` (Disponible en `localhost:3000`).
- **Construcción de Producción:** `npm run build`.
- **Inicio de Producción:** `npm run start`.
- **Pruebas Unitarias:** `npm run test` (Vitest).
- **Verificación de Estándares:** `npm run lint` (ESLint).

---

## 🤝 Contribución y Licencia

### Contribuir
1. Realice un **Fork** del proyecto.
2. Cree una rama para su mejora siguiendo la nomenclatura: `feat/`, `fix/` o `refactor/`.
3. Adhiérase estrictamente al __**Estándar de Oro**__ documentado en `.rules.md`.
4. Asegúrese de que todas las pruebas pasen (`npm test`).
5. Envíe un **Pull Request** detallado en español siguiendo el template del repositorio.

### Licencia
Este proyecto es un trabajo académico desarrollado para la **Universidad de San Buenaventura**. Todos los derechos reservados © 2026.

---
<div align="center">
Desarrollado con ❤️ por el equipo de PawLig desde Medellín, Colombia 🇨🇴.
</div>
