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
_Versión v1.14.0 | Última actualización: 15 de junio de 2026_

</div>

---

> [!IMPORTANT]
> **Estándar de Codificación (Gold Standard):** Se recomienda encarecidamente consultar y adherirse al __**Manual de Reglas y Estándares (.rules.md)**__ antes de iniciar cualquier labor de desarrollo. Este documento establece las directrices críticas de arquitectura, nomenclatura y calidad de código del proyecto.

---

## 1. Descripción general

**PawLig** es un ecosistema digital unificado y de nivel empresarial diseñado para consolidar y dinamizar los procesos de adopción de mascotas y el marketplace de bienestar animal en la región del Valle de Aburrá, Colombia. La plataforma proporciona una solución integral de pila completa (full-stack) para mitigar la fragmentación existente en el sector, conectando de forma directa y transparente a tres actores fundamentales:

*   **Albergues de Mascotas (Shelters):** Organizaciones dedicadas al rescate animal que gestionan de forma estructurada el ciclo de vida de las mascotas, desde su ingreso y publicación hasta el seguimiento detallado de las solicitudes de adopción.
*   **Vendedores Especializados (Vendors):** Comercios locales y proveedores de productos de bienestar animal que acceden a un canal de ventas digital especializado, con capacidades avanzadas de administración de inventarios, procesamiento de órdenes y métricas de desempeño comercial.
*   **Adoptantes y Clientes (Adopters):** Usuarios finales que disfrutan de una experiencia fluida y optimizada para la búsqueda empática de mascotas, gestión de favoritos, postulación para adopciones responsables y adquisición de suministros de alta calidad.

El sistema destaca por incorporar capacidades avanzadas de **Inteligencia Artificial** para la optimización de contenido, **Visualización Geoespacial** interactiva y un **Motor de Simulación Física** 3D en la gestión de errores, redefiniendo los estándares de bienestar animal digital con una arquitectura transaccional sólida, segura y escalable.

---

## 2. Características principales

La plataforma de PawLig está dotada de una serie de módulos robustos y características técnicas avanzadas:

### 🧠 Inteligencia Artificial Generativa (Google Gemini 2.5-flash)
*   **Refinamiento Persuasivo de Contenido:** Integración del endpoint inteligente `/api/ai/refine` que analiza e incrementa el atractivo emocional de las descripciones básicas de mascotas, así como el tono persuasivo y comercial de las descripciones de productos de tienda.
*   **Contextualización Adaptativa:** Modelado semántico mediante prompts especializados para adaptar dinámicamente el estilo textual (tono de empatía para adopciones vs. tono de venta técnica para el marketplace).

### 🛡️ Moderation Hub Centralizado y Auditoría Polimórfica
*   **Centro Administrativo Consolidado:** Gestión centralizada de solicitudes de verificación de albergues, vendedores y moderación de usuarios bajo el módulo administrativo `/admin/moderation`.
*   **Registro de Auditoría Polimórfico (`SystemAuditLog`):** Sistema atómico que captura, almacena y expone de forma paginada un historial inalterable de cada evento administrativo crucial (bloqueos de cuentas, aprobación/rechazo de solicitudes, asignación de roles) exigiendo justificaciones obligatorias y almacenando estados diferenciales en formato JSON (estados *antes/después*).
*   **Seguridad Multimedia Reforzada:** Endpoint seguro `/api/cloudinary/delete` que verifica la propiedad de los recursos a través del control de acceso basado en roles (RBAC), impidiendo la eliminación no autorizada de recursos en la nube de Cloudinary por parte de agentes o usuarios ajenos al recurso original.
*   **Flujo de Reenvío de Solicitudes Desbloqueado:** Corrección lógica que permite a albergues o vendedores cuyas postulaciones fueron previamente denegadas reenviar una nueva solicitud de verificación, manteniendo la restricción de reenvío únicamente si hay una solicitud actual con estado `PENDING` o `APPROVED`.

### 📧 Motor de Notificaciones Transaccionales (Resend & React Email)
*   **11 Plantillas Responsive Integradas:** Emails completamente responsivos y personalizados bajo la identidad visual de PawLig, cubriendo flujos críticos como:
    *   Recuperación segura de contraseñas con tokens de un solo uso con vigencia de una hora.
    *   Notificación instantánea de nuevas postulaciones de adopción al albergue.
    *   Actualización de estados de solicitudes de adopción enviadas al adoptante.
    *   Confirmación de órdenes de compra al comprador y avisos automáticos de venta a los comercios implicados.
    *   Notificaciones de despacho y envío de pedidos con números de guía.
    *   Alertas de seguridad por bloqueo o desbloqueo administrativo de cuentas.
    *   Aprobaciones y rechazos detallados (con motivos explícitos) para las solicitudes de comercios y albergues.
*   **Envío No Bloqueante:** Procesamiento asíncrono para garantizar que el tiempo de respuesta de los endpoints del backend no se vea penalizado por la latencia en el servicio de correos.

### 🗺️ Visualización Geoespacial e Interactiva (Leaflet)
*   **Localización y Búsqueda por Mapa:** Mapa interactivo integrado que posiciona geográficamente los refugios verificados en el Valle de Aburrá, facilitando búsquedas personalizadas por municipios.
*   **Servicio de Geocodificación Interno:** Script automático y capa de servicios (`geocoding.service.ts`) para convertir direcciones físicas registradas por los refugios en coordenadas geoespaciales (latitud y longitud) persistidas de forma segura en MongoDB.

### 🌌 404 Orbital Engine (Simulación en Canvas 2D)
*   **Simulación Física Kepleriana:** La página de error 404 implementa un motor interactivo escrito en Canvas 2D que simula las leyes orbitales de Kepler para orbitar elementos visuales de la marca.
*   **Proyección Isométrica 3D y Oclusión Dinámica:** Algoritmos matemáticos personalizados para renderizar volumen 3D real y oclusión de capas directamente sobre coordenadas bidimensionales con altísima eficiencia y rendimiento móvil.

### 📊 Sistema de Métricas y Reportes
*   **Paneles Analíticos Dinámicos:** Gráficos e indicadores en tiempo real mediante `Recharts` para ilustrar las tendencias de adopción, volúmenes de ventas de productos y comportamiento del inventario.
*   **Exportación Multi-formato:** Soporte nativo para descargar reportes estructurados de transacciones y adopciones en formatos **Excel** (vía ExcelJS), **PDF** con formato de tabla profesional (vía jsPDF y autotable) y **CSV**.

---

## 3. Requisitos e instalación

### Prerrequisitos de Entorno
*   **Node.js:** Versión `18.17.0` o superior (se recomienda encarecidamente utilizar versiones LTS estables como Node v18 o v20).
*   **npm:** Versión `9.0.0` o superior.
*   **Base de Datos:** Acceso a un clúster de **MongoDB** (local o a través de MongoDB Atlas Cloud).

### Guía de Instalación Paso a Paso

1.  **Clonación del Repositorio:**
    ```bash
    git clone https://github.com/asebasg/pawlig.git
    cd pawlig
    ```

2.  **Instalación de Dependencias del Proyecto:**
    Este comando descargará todos los paquetes necesarios y ejecutará automáticamente el script de post-instalación de Prisma (`prisma generate`) para compilar los clientes type-safe adaptados a la base de datos MongoDB:
    ```bash
    npm install
    ```

3.  **Configuración de Variables de Entorno:**
    Cree un archivo `.env` en el directorio raíz de la aplicación. Puede tomar como referencia el archivo `.env.local.example`:
    ```env
    # Conexión a Base de Datos
    DATABASE_URL="mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/pawlig"

    # Autenticación y Seguridad
    NEXTAUTH_SECRET="ej: generar usando -> openssl rand -base64 32"
    NEXTAUTH_URL="http://localhost:3000"

    # Servicios de Inteligencia Artificial (Google Gemini)
    GEMINI_API_KEY="tu_clave_de_api_de_google_gemini"

    # Proveedor de Almacenamiento Multimedia (Cloudinary)
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="tu_nombre_de_cloud"
    CLOUDINARY_URL="cloudinary://api_key:api_secret@tu_nombre_de_cloud"

    # Sistema de Envío de Correos (Resend)
    RESEND_API_KEY="re_tu_clave_de_api_de_resend"
    EMAIL_FROM="onboarding@resend.dev"
    ```

4.  **Generación de la Base de Datos y Sincronización del Esquema:**
    Ejecute los siguientes comandos para sincronizar la definición del modelo de Prisma con su base de datos MongoDB:
    ```bash
    npx prisma db push
    ```

5.  **Poblar la Base de Datos con Datos de Semilla (Opcional):**
    Si desea cargar un conjunto de datos ficticios iniciales para pruebas locales (usuarios administradores, albergues, vendedores, mascotas, productos), ejecute:
    ```bash
    npx prisma db seed
    ```
    *Nota: Las credenciales de acceso creadas por la semilla se listan de forma detallada en el archivo `credentials-seed.txt` en la raíz del proyecto.*

---

## 4. Guía de uso

La ejecución diaria y la interacción con las capacidades de desarrollo del ecosistema se gestionan a través de los siguientes comandos de consola estandarizados:

### Ejecución en Desarrollo Local
Para levantar un servidor de desarrollo interactivo y con soporte de recarga en caliente (*Hot Module Replacement*):
```bash
npm run dev
```
La aplicación se servirá automáticamente en el puerto local y estará disponible en [http://localhost:3000](http://localhost:3000).

### Compilación y Construcción para Producción
Para compilar la aplicación, optimizar los activos estáticos y preparar la estructura del lado del servidor de Next.js:
```bash
npm run build
```

### Ejecución en Modo Producción
Una vez que el proyecto se ha compilado con éxito mediante el comando anterior, inicie el servidor optimizado para entornos de producción:
```bash
npm run start
```

### Ejecución de Pruebas Unitarias y de Integración (Vitest)
El proyecto cuenta con un entorno riguroso de pruebas unitarias. Para ejecutar toda la suite de pruebas locales:
```bash
EMAIL_FROM=onboarding@resend.dev npm test -- --run
```
*Nota: Es mandatorio proveer de manera temporal la variable de entorno `EMAIL_FROM` en la consola para la ejecución correcta de las pruebas asociadas al servicio de mensajería electrónica.*

### Análisis de Calidad de Código (ESLint)
Para validar que las contribuciones se adhieran rigurosamente a los estándares de formato y de TypeScript del ecosistema:
```bash
npm run lint
```

---

## 5. Tecnologías

El stack tecnológico de PawLig ha sido rigurosamente estructurado para ofrecer el máximo rendimiento, seguridad del lado del servidor y compatibilidad con tipado estricto:

### Núcleo de Aplicación (Framework & Lenguaje)
*   **Framework:** Next.js (App Router) v14.2.33 — Generación del lado del servidor (SSR) y Static Site Generation (SSG).
*   **Lenguaje:** TypeScript v5.x — Garantiza solidez en el desarrollo de software mediante tipado estático y robusto.
*   **Entorno de Ejecución:** Node.js v18+ — Capa base del ecosistema JavaScript de servidor.

### Base de Datos y Persistencia
*   **Motor de Base de Datos:** MongoDB Atlas — Motor NoSQL flexible orientado a documentos en la nube.
*   **ORM:** Prisma ORM v6.2.1 — Capa de mapeo de objetos segura y autogenerada de alta eficiencia con soporte para transacciones de MongoDB.

### Autenticación y Seguridad
*   **Módulo de Autenticación:** NextAuth.js v4.24.7 — Autenticación robusta basada en cookies de sesión y roles (`ADMIN`, `SHELTER`, `VENDOR`, `ADOPTER`).
*   **Cifrado de Datos:** bcryptjs v3.0.3 — Hashing criptográfico unidireccional de contraseñas.

### Diseño, Estilos y UI
*   **Estructuración de Diseño:** Tailwind CSS v3.4.1 — Estilos adaptativos basados en clases de utilidad rápidas y variables semánticas.
*   **Componentes UI Accesibles:** Radix UI Primitives — Primitivas interactivas sin estilos que garantizan el cumplimiento de normativas de accesibilidad (WAI-ARIA).
*   **Visualización de Datos:** Recharts v3.8.1 — Gráficas interactivas y modulares para analíticas de negocio.

### Servicios Externos e Inteligencia Artificial
*   **Motor de IA:** Google Generative AI SDK (Gemini AI) v0.24.1 — Integración con el modelo de lenguaje `gemini-2.5-flash` para refinamiento de descripciones.
*   **Proveedor Multimedia:** Cloudinary SDK v2.8.0 — Gestión y optimización automatizada de recursos gráficos y fotografías de mascotas/productos.
*   **Mensajería Electrónica:** Resend SDK v6.12.2 & React Email v1.0.12 — Infraestructura premium para el modelado y envío masivo de correos corporativos.

### Servicios Geoespaciales
*   **Motor de Mapas:** Leaflet v1.9.4 & React Leaflet v4.2.1 — Visualización de mapas vectoriales e interacción dinámica.

---

## 6. Estructura del Proyecto

El repositorio de PawLig sigue las mejores convenciones de organización por capas técnicas y características funcionales para garantizar la mantenibilidad a largo plazo:

```text
├── app/                  # Núcleo de Rutas, APIs y Segmentos del Sistema
│   ├── (auth)/           # Segmento de Autenticación (Login, Registro, Recuperación)
│   ├── (dashboard)/      # Paneles de Administración y Gestión Privada
│   │   ├── admin/        # Dashboard del Administrador y Moderation Hub
│   │   ├── user/         # Panel del Adoptante (Favoritos, Carrito, Historial)
│   │   ├── shelter/      # Gestión del Albergue (Publicación de Mascotas, Adopciones)
│   │   └── vendor/       # Gestión del Vendedor (Catálogo, Stock, Pedidos)
│   ├── (public)/         # Vistas Públicas (Adopciones, Tienda, Albergues, Ayuda, Legal)
│   ├── api/              # Endpoints de la API RESTful de la Aplicación
│   ├── globals.css       # Configuración global de estilos Tailwind CSS
│   ├── layout.tsx        # Diseño maestro (Master Layout) compartido de la aplicación
│   └── not-found.tsx     # Página de error 404 inmersiva con el Motor Orbital 3D
├── components/           # Componentes Modulares de React y UI Reutilizable
│   ├── admin/            # Vistas internas del Moderation Hub y Auditoría
│   ├── cards/            # Tarjetas de presentación visual de Mascotas y Productos
│   ├── filters/          # Filtros avanzados interactivos de búsqueda de adopciones y tienda
│   ├── forms/            # Lógica y validaciones de todos los formularios de captura
│   ├── layout/           # Componentes estructurales (Barra de navegación por rol, Footer)
│   ├── map/              # Componentes de interacción con Leaflet
│   ├── ui/               # Botones, entradas de texto, modales y alertas base del sistema
│   └── vendor/           # Componentes analíticos y de inventario para vendedores
├── lib/                  # Núcleo de la Lógica de Negocio y Utilidades de Backend
│   ├── auth/             # Configuración de NextAuth, callbacks y control de accesos
│   ├── email/            # Código base y 11 plantillas interactivas de React Email
│   ├── services/         # Capa de Servicios de Acceso a Base de Datos (Mascotas, Ventas, Correos)
│   ├── utils/            # Generadores de Reportes (Excel, PDF, CSV), formateadores y base de datos
│   └── validations/      # Definiciones de Esquemas de Zod para la verificación en cascada
├── prisma/               # Definición del Modelo de Datos Prisma y Script de Semilla
│   ├── schema.prisma     # Definición del esquema unificado de base de datos de MongoDB
│   └── seed.ts           # Script de carga inicial de datos de prueba
├── public/               # Documentación Técnica Formal (.md) y Recursos Estáticos
│   ├── docs/             # Actas del proyecto, diagramas de procesos, requerimientos e historias
│   └── images/           # Activos gráficos, logos y diagramas UML explicativos
├── types/                # Declaraciones de tipos globales de TypeScript
└── scripts/              # Herramientas de automatización de geocodificación y validación de correos
```

---

## 7. Contribución y licencia

### Contribución al Proyecto

Agradecemos enormemente cualquier colaboración orientada a elevar el valor técnico del ecosistema. Siga de forma estricta los siguientes pasos para proponer mejoras al proyecto:

1.  **Fork del Repositorio:** Genere una bifurcación del repositorio principal a su cuenta personal.
2.  **Creación de una Rama Temática:** Use una nomenclatura de rama que declare el tipo de intervención:
    *   `feat/nueva-funcionalidad` para el desarrollo de nuevos requerimientos.
    *   `fix/correccion-de-error` para solventar un bug.
    *   `refactor/mejora-arquitectonica` para reestructurar código existente sin alterar su lógica de funcionamiento.
3.  **Adhesión al Estándar de Oro:** Es obligatorio seguir de forma estricta el manual de codificación y diseño detallado en el archivo `.rules.md`.
4.  **Aseguramiento de Pruebas:** Ejecute toda la suite de pruebas del proyecto y cerciórese de que sigan pasando de manera exitosa:
    ```bash
    EMAIL_FROM=onboarding@resend.dev npm test -- --run
    ```
5.  **Análisis Estático de Código:** Valide que el código no contenga inconsistencias de linting:
    ```bash
    npm run lint
    ```
6.  **Apertura del Pull Request (PR):** Abra un Pull Request dirigido a la rama de desarrollo principal, describiendo detalladamente en **idioma español** las modificaciones introducidas, las decisiones técnicas adoptadas y las capturas o evidencias de las pruebas realizadas.

### Licencia

Este software es un trabajo académico y de investigación desarrollado exclusivamente para la **Universidad de San Buenaventura, Seccional Medellín**. Todos los derechos reservados © 2026. Queda estrictamente prohibida la redistribución y el uso comercial de este material sin el consentimiento expreso y por escrito del equipo de desarrollo de PawLig y de las autoridades de la institución educativa.

---

<div align="center">
Desarrollado con pasión y compromiso ❤️ por el equipo de PawLig desde Medellín, Colombia 🇨🇴.
</div>
