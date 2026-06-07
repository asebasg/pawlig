# 🐾 PawLig — Plataforma Integral de Adopción y Marketplace

<div align="center">

**Ecosistema digital unificado para la conexión de mascotas, hogares responsables y comercio especializado en el Valle de Aburrá.**

![Next.js](https://img.shields.io/badge/Next.js-14.2.33-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-38B2AC?style=flat-square&logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-6.19.3-2D3748?style=flat-square&logo=prisma)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=flat-square&logo=mongodb)
![Google Gemini](https://img.shields.io/badge/Google%20Gemini-2.5--flash-orange?style=flat-square&logo=google-gemini)

**Proyecto de Grado** <br>
📍 Medellín, Antioquia, Colombia
<br>
_Versión v1.13.1 | Última actualización: 31-05-2026_

</div>

---

> [!IMPORTANT]
> **Estándar de Codificación (Gold Standard):** Se recomienda encarecidamente consultar y adherirse al [Manual de Reglas y Estándares (.rules.md)](https://raw.githubusercontent.com/asebasg/pawlig/refs/heads/main/.rules.md?token=GHSAT0AAAAAAD64R4DLTFA44UVLOWT5UOGS2RE43TQ) antes de iniciar cualquier labor de desarrollo. Este documento establece las directrices críticas de arquitectura, nomenclatura y calidad de código del proyecto.

---

## 📖 Descripción Detallada

**PawLig** es una solución full-stack robusta diseñada para mitigar la fragmentación en los procesos de adopción de mascotas y dinamizar el mercado de productos para animales en la región del Valle de Aburrá. La plataforma actúa como un nexo tecnológico entre tres actores clave:

1.  **Albergues (Shelters):** Gestión integral del ciclo de vida de la mascota y seguimiento de adopciones.
2.  **Proveedores (Vendors):** Marketplace especializado con gestión de inventario en tiempo real.
3.  **Adoptantes (Adopters):** Experiencia de usuario optimizada para la búsqueda empática de compañeros y adquisición de suministros.

A través de la integración de **IA Generativa**, **Geolocalización** y un **Motor de Simulación Física**, PawLig redefine la experiencia de usuario en plataformas de bienestar animal, asegurando trazabilidad, seguridad y eficiencia operativa.

---

## ✨ Características Técnicas Principales

### 🧠 Asistente de IA (Google Gemini 2.5-flash)
- **Refinamiento Automático:** Endpoint `/api/ai/refine` que procesa descripciones originales mediante el modelo `gemini-2.5-flash`.
- **Contextualización:** Prompting dinámico para optimizar el impacto emocional en perfiles de mascotas o la conversión de ventas en productos.
- **Validación:** Restricción estricta de 500 caracteres para asegurar legibilidad.

### 🌌 404 Orbital Engine (Motor de Simulación Física)
- **Cinemática:** Implementación de las Leyes de Kepler (Ley de Áreas) para simular velocidades orbitales realistas en un Canvas 2D.
- **Proyección 3D:** Uso de proyección paralela con compresión del eje Y (0.4x) para generar una perspectiva isométrica profunda.
- **Oclusión Dinámica:** Clasificación de profundidad por eje Z que permite a los iconos de la marca pasar por delante y detrás del núcleo "404".

### 🛡️ Moderation Hub & Auditoría Polimórfica
- **SystemAuditLog:** Modelo Prisma diseñado para rastrear acciones administrativas (BLOCK, UNBLOCK, CHANGE_ROLE, DELETE).
- **Atomicidad:** Transacciones transaccionales en `moderation.service.ts` mediante `$transaction` para asegurar la integridad en cambios de rol y estados.
- **Control Granular:** Filtrado por estado (`PENDING`, `APPROVED`, `REJECTED`) en los paneles de administración de albergues y vendedores.

### 🗺️ Visualización Geoespacial (Leaflet)
- **Búsqueda Proactiva:** Mapa interactivo integrado con la API de Nominatim (OpenStreetMap) para geolocalización de refugios.
- **Normalización:** Servicio de geocodificación interna con estrategias de fallback y respeto estricto de rate-limits (1 req/sec).

### 📊 Reportes y Analítica Avanzada
- **Motores de Exportación:** Generación asíncrona de reportes en formatos Excel (`exceljs`), PDF (`jspdf`, `jspdf-autotable`) y CSV.
- **Visualización:** Dashboards dinámicos implementados con `recharts` para el seguimiento de tendencias de adopción y ventas.

---

## 🛠️ Arquitectura y Tech Stack

| Capa | Tecnología | Versión |
| :--- | :--- | :--- |
| **Framework** | Next.js (App Router) | 14.2.33 |
| **Lenguaje** | TypeScript | 5.0+ |
| **Base de Datos** | MongoDB Atlas | Cloud |
| **ORM** | Prisma | 6.19.3 |
| **Autenticación** | NextAuth.js | 4.24.7 |
| **Estilos** | Tailwind CSS | 3.4.1 |
| **IA** | Google Generative AI | 0.24.1 |
| **Emails** | Resend / React Email | 6.12.2 / 1.0.12 |
| **Mapas** | Leaflet / React Leaflet | 1.9.4 / 4.2.1 |
| **Testing** | Vitest / JSDOM | 4.0.16 / 27.4.0 |

---

## 🚀 Instalación y Configuración

### Prerrequisitos
- **Node.js:** 18.17 o superior.
- **npm:** 9 o superior.
- **Base de Datos:** Instancia de MongoDB Atlas activa.

### Guía de Inicio Rápido
1.  **Clonar y Acceder:**
    ```bash
    git clone https://github.com/asebasg/pawlig.git
    cd pawlig
    ```
2.  **Instalar Dependencias:**
    ```bash
    npm install
    ```
3.  **Variables de Entorno:**
    Duplica el archivo `.env.local.example` a `.env.local` y configura las siguientes claves:
    ```env
    # DB & Auth
    DATABASE_URL="mongodb+srv://..."
    NEXTAUTH_SECRET="your_secret_key"
    NEXTAUTH_URL="http://localhost:3000"

    # Services
    GEMINI_API_KEY="your_google_ai_key"
    RESEND_API_KEY="your_resend_api_key"
    EMAIL_FROM="PawLig <soporte@pawlig.com>"

    # Assets
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
    CLOUDINARY_API_KEY="your_api_key"
    CLOUDINARY_API_SECRET="your_api_secret"
    ```
4.  **Sincronizar Esquema:**
    ```bash
    npx prisma generate
    npx prisma db push
    ```
5.  **Ejecutar Desarrollo:**
    ```bash
    npm run dev
    ```

---

## 💻 Ejemplos de Uso

### Refinamiento de Descripción con IA
Para utilizar el asistente de IA en un componente personalizado:
```typescript
const response = await fetch("/api/ai/refine", {
  method: "POST",
  body: JSON.stringify({
    description: "Perro pequeño y juguetón busca casa",
    type: "pet"
  })
});
const { refinedText } = await response.json();
// Resultado: "Este encantador perrito de energía vibrante..."
```

### Formateo de Edad Localizado
La plataforma utiliza una utilidad centralizada para la precisión de edad (`lib/utils/age-formatter.ts`):
```typescript
import { formatAge } from "@/lib/utils/age-formatter";

const label = formatAge(1, 3); // Retorna: "1 año y 3 meses"
const babyLabel = formatAge(0, 0); // Retorna: "Recién nacido"
```

---

## 📋 Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo en `localhost:3000`.
- `npm run build`: Compila la aplicación, genera el cliente de Prisma y optimiza assets.
- `npm run start`: Arranca la aplicación compilada en modo producción.
- `npm run test`: Ejecuta la suite de pruebas unitarias y de integración con Vitest.
- `npm run lint`: Verifica la adherencia a las reglas de estilo y tipado.

---

## 🤝 Contribución y Soporte

Para contribuir al proyecto:
1. Realice un Fork del repositorio.
2. Cree una rama para su feature (`git checkout -b feat/amazing-feature`).
3. Asegúrese de cumplir con el **Estándar de Oro** documentado en `.rules.md`.
4. Envíe un Pull Request detallado en **español**.

**Contacto Técnico:**
- **Andrés Sebastián Ospina Guzmán** — [asebasg07@gmail.com](mailto:asebasg07@gmail.com)
- **Mateo Úsuga Vasco** — [mateo.usuga.v21@gmail.com](mailto:mateo.usuga.v21@gmail.com)
- **Santiago Lezcano Escobar** — [santiag1725g@gmail.com](mailto:santiag1725g@gmail.com)

---
<div align="center">
Desarrollado con ❤️ por el equipo de PawLig en Medellín, Antioquia, Colombia 🇨🇴.
</div>
