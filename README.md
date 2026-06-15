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
> **Estándar de Codificación (Gold Standard):** Se recomienda encarecidamente consultar y adherirse al [Manual de Reglas y Estándares (.rules.md)](https://raw.githubusercontent.com/asebasg/pawlig/refs/heads/main/.rules.md?token=GHSAT0AAAAAAD7IEHQWCQPVD6CWJDKPHZAG2RPQXYA) antes de iniciar cualquier labor de desarrollo. Este documento establece las directrices críticas de arquitectura, nomenclatura y calidad de código del proyecto.


---

## 📖 Descripción General

**PawLig** es una solución full-stack robusta diseñada para mitigar la fragmentación en los procesos de adopción de mascotas y dinamizar el mercado de productos para animales en la región del Valle de Aburrá. La plataforma actúa como un nexo tecnológico entre tres actores clave:

1.  **Albergues (Shelters):** Gestión integral del ciclo de vida de la mascota, seguimiento de adopciones y analítica de impacto.
2.  **Proveedores (Vendors):** Marketplace especializado con gestión de inventario en tiempo real y reportes de ventas.
3.  **Adoptantes (Adopters):** Experiencia de usuario optimizada para la búsqueda empática de compañeros, gestión de favoritos y adquisición de suministros.

A través de la integración de **IA Generativa**, **Geolocalización** y un **Motor de Simulación Física**, PawLig redefine la experiencia de bienestar animal digital, asegurando trazabilidad, seguridad y eficiencia operativa.

---

## ✨ Características Principales

### 🧠 Asistente de IA (Google Gemini 2.5-flash)
- **Refinamiento Automático:** Endpoint `/api/ai/refine` que transforma descripciones originales en textos persuasivos y optimizados.
- **Contextualización:** Prompting dinámico especializado para perfiles de mascotas (emocional) y productos (comercial).

### 🌌 404 Orbital Engine
- **Simulación Física:** Motor en Canvas 2D basado en las Leyes de Kepler para una experiencia visual inmersiva en páginas no encontradas.
- **Proyección Isométrica:** Simulación de profundidad 3D con oclusión dinámica de elementos de marca.

### 🛡️ Moderation Hub & Seguridad
- **Gestión Centralizada:** Panel administrativo unificado para la supervisión de usuarios, albergues y vendedores.
- **Auditoría Polimórfica:** Sistema `SystemAuditLog` para el rastreo atómico de acciones administrativas con justificación obligatoria.
- **Protección de Datos:** Implementación de `PasswordInput` con toggle de visibilidad y validaciones estrictas vía Zod.

### 🗺️ Visualización Geoespacial
- **Mapa Interactivo:** Integración con Leaflet para la localización de refugios en el Valle de Aburrá mediante geocodificación proactiva.

### 📧 Sistema de Notificaciones
- **Email Engine:** Integración con Resend y React Email para el envío de notificaciones transaccionales (adopciones, pedidos, seguridad) con 11 plantillas personalizadas.

### 📊 Analítica y Reportes
- **Dashboard de Métricas:** Visualización de tendencias mediante Recharts.
- **Motores de Exportación:** Generación de reportes profesionales en formatos Excel, PDF (con autotable) y CSV.

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
| **IA** | Google Generative AI | 0.24.1 |
| **Emails** | Resend / React Email | 6.12.2 / 1.0.12 |
| **Mapas** | Leaflet / React Leaflet | 1.9.4 / 4.2.1 |
| **Analítica** | Recharts | 3.8.1 |
| **Testing** | Vitest / JSDOM | 4.0.16 / 27.4.0 |

---

## 📂 Estructura del Proyecto

```text
├── app/                # Rutas, APIs y Layouts (App Router)
├── components/         # Componentes React (UI, Forms, Layout, etc.)
├── docs/               # Documentación técnica y legal del proyecto
├── lib/                # Servicios, utilidades, hooks y validaciones
├── prisma/             # Esquema de base de datos y scripts de seed
├── public/             # Assets estáticos (imágenes, fuentes)
├── scripts/            # Scripts de automatización y mantenimiento
├── types/              # Definiciones de tipos TypeScript globales
└── tests/              # Suite de pruebas unitarias y de integración
```

---

## 🚀 Instalación y Configuración

### Prerrequisitos
- **Node.js:** 18.17 o superior.
- **npm:** 9 o superior.
- **Base de Datos:** Instancia de MongoDB activa (local o Atlas).

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
    Cree un archivo `.env` en la raíz basado en el estándar del proyecto:
    ```env
    DATABASE_URL="mongodb+srv://..."
    NEXTAUTH_SECRET="su_secreto"
    GEMINI_API_KEY="su_api_key"
    RESEND_API_KEY="su_api_key"
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="su_cloud_name"
    ```
4.  **Inicializar Base de Datos:**
    ```bash
    npx prisma generate
    npx prisma db push
    ```

---

## 💻 Guía de Uso

- **Desarrollo:** `npm run dev` (Inicia en `localhost:3000`)
- **Producción:** `npm run build` seguido de `npm run start`
- **Pruebas:** `npm run test` (Ejecuta Vitest)
- **Linting:** `npm run lint` (Verifica estándares de código)

---

## 🤝 Contribución y Licencia

### Contribuir
1. Realice un **Fork** del proyecto.
2. Cree una rama para su mejora: `git checkout -b feat/nueva-funcionalidad`.
3. Siga el [**Estándar de Oro**](https://raw.githubusercontent.com/asebasg/pawlig/refs/heads/main/.rules.md?token=GHSAT0AAAAAAD7IEHQWCQPVD6CWJDKPHZAG2RPQXYA) documentado en `.rules.md`.
4. Envíe un **Pull Request** detallado en español.

### Licencia
Este proyecto es un trabajo académico desarrollado para la **Universidad de San Buenaventura**. Todos los derechos reservados © 2026.

---
<div align="center">
Desarrollado con ❤️ por el equipo de PawLig en Medellín, Colombia 🇨🇴.
</div>
