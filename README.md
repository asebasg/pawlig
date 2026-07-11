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
_Versión v1.14.0 | Última actualización: 12 de junio de 2026_

</div>

---

## 📖 1. Descripción General

**PawLig** es una solución tecnológica integral diseñada para centralizar y dinamizar el ecosistema de bienestar animal en el Valle de Aburrá. La plataforma resuelve la fragmentación del sector conectando de manera eficiente a tres actores clave:

1.  **Albergues (Shelters):** Centros de rescate que gestionan el ciclo de vida de las mascotas, desde el rescate hasta el seguimiento de adopciones.
2.  **Vendedores (Vendors):** Comercios especializados que acceden a un marketplace regional con gestión avanzada de inventario y analítica.
3.  **Adoptantes (Adopters):** Usuarios finales que buscan mascotas de forma empática y adquieren suministros de calidad.

Mediante el uso de **Inteligencia Artificial**, **Visualización Geoespacial** y **Auditoría Transaccional**, PawLig garantiza trazabilidad absoluta y una experiencia de usuario superior en pro del bienestar animal.

---

## ✨ 2. Características Principales

### 🧠 Inteligencia Artificial (Google Gemini)
- **Refinamiento de Contenido:** Uso de IA para transformar descripciones técnicas en textos persuasivos y emocionales para mascotas y productos.
- **Contextualización Inteligente:** Ajuste automático del tono de comunicación según el tipo de publicación.

### 🛡️ Moderation Hub & Seguridad Multimedia
- **Gestión Centralizada:** Panel administrativo para la supervisión de usuarios, albergues y vendedores en `/admin/moderation`.
- **RBAC Multimedia:** Implementación estricta de control de acceso para la gestión de recursos en Cloudinary, garantizando que solo los propietarios autorizados puedan eliminar archivos.
- **Registro de Auditoría (v1.13.0):** Sistema `SystemAuditLog` que rastrea de forma atómica cada acción administrativa con justificación obligatoria.

### 🌌 404 Orbital Engine
- **Simulación Física:** Motor basado en Canvas 2D que implementa las leyes de Kepler para simular órbitas planetarias reales con los elementos de marca.
- **Proyección Isométrica:** Experiencia visual inmersiva con oclusión dinámica de capas (z-indexing real).

### 🗺️ Visualización Geoespacial (Leaflet)
- **Mapa de Refugios:** Localización interactiva de albergues en el Valle de Aburrá con geocodificación proactiva.
- **Búsqueda por Municipio:** Filtrado avanzado basado en la división política de la región.

### 📧 Engine de Notificaciones (Resend)
- **Flujos Transaccionales:** Sistema con más de 11 plantillas personalizadas para adopciones, pedidos, seguridad y gestión de cuentas.
- **Asincronía Garantizada:** Procesamiento de envíos no bloqueante para mantener la alta disponibilidad de la API.

---

## 🛠️ 3. Requisitos e Instalación

### Prerrequisitos
- **Node.js:** Versión 18.17 o superior (LTS recomendada).
- **npm:** Versión 9 o superior.
- **Base de Datos:** Instancia activa de MongoDB (Atlas recomendada).

### Guía de Instalación
1.  **Clonar el proyecto:**
    ```bash
    git clone https://github.com/asebasg/pawlig.git
    cd pawlig
    ```
2.  **Instalar dependencias:**
    ```bash
    npm install
    ```
3.  **Configurar el entorno:**
    Cree un archivo `.env` basado en `.env.local.example` con las siguientes claves críticas:
    ```env
    DATABASE_URL="mongodb+srv://..."
    NEXTAUTH_SECRET="tu_secreto_openssl"
    NEXTAUTH_URL="http://localhost:3000"
    GEMINI_API_KEY="tu_key_de_google"
    RESEND_API_KEY="tu_key_de_resend"
    CLOUDINARY_URL="tu_url_cloudinary"
    ```
4.  **Sincronizar la Base de Datos:**
    ```bash
    npx prisma generate
    npx prisma db push
    ```

---

## 💻 4. Guía de Uso

Ejecute el proyecto localmente o realice tareas de mantenimiento con los siguientes comandos:

- **Desarrollo:** `npm run dev` (Acceso en `http://localhost:3000`).
- **Pruebas Unitarias:** `npm run test` (Vitest).
- **Construcción para Producción:** `npm run build`.
- **Poblar Base de Datos (Seed):** `npx prisma db seed`.
- **Análisis de Código (Lint):** `npm run lint`.

---

## 🚀 5. Tecnologías

El stack tecnológico ha sido seleccionado para garantizar escalabilidad, seguridad y rendimiento:

- **Framework:** [Next.js 14 (App Router)](https://nextjs.org/)
- **Lenguaje:** [TypeScript 5](https://www.typescriptlang.org/)
- **Base de Datos:** [MongoDB](https://www.mongodb.com/) + [Prisma ORM 6](https://www.prisma.io/)
- **Autenticación:** [NextAuth.js](https://next-auth.js.org/)
- **Estilos:** [Tailwind CSS](https://tailwindcss.com/) + [Radix UI](https://www.radix-ui.com/)
- **Servicios Cloud:** Cloudinary (Multimedia) y Resend (Emails)
- **Gráficos y Mapas:** Recharts y Leaflet

---

## 📂 6. Estructura del Proyecto

```text
├── app/                # Rutas, API handlers y Layouts (Next.js App Router)
├── components/         # Componentes de UI, formularios y dashboards
├── lib/                # Lógica de negocio, servicios, hooks y validaciones
├── prisma/             # Esquema de datos y scripts de población (Seed)
├── public/             # Assets estáticos y documentación técnica (.md)
├── scripts/            # Scripts de automatización y mantenimiento
├── types/              # Definiciones globales de TypeScript
└── (root)              # Archivos de configuración (Tailwind, Vitest, TS)
```

---

## 🤝 7. Contribución y Licencia

### Cómo Contribuir
1. Realice un **Fork** del repositorio.
2. Cree una rama para su cambio: `feat/nueva-funcionalidad`, `fix/correccion-error` o `refactor/mejorar-codigo`.
3. Asegúrese de cumplir con los estándares definidos en `.rules.md`.
4. Verifique que todas las pruebas pasen con `npm test`.
5. Abra un **Pull Request** detallando los cambios realizados.

### Licencia
Este software es un proyecto académico desarrollado para la **Universidad de San Buenaventura**. Todos los derechos reservados © 2026.

---

<div align="center">
Desarrollado con ❤️ por el equipo de PawLig en Medellín, Colombia 🇨🇴.
</div>
