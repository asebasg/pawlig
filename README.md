# 🐾 PawLig — Plataforma Integral de Adopción y Marketplace

<div align="center">

**Ecosistema digital unificado para la conexión de mascotas, albergues de rescate animal y comercio especializado en el Valle de Aburrá.**

![Next.js](https://img.shields.io/badge/Next.js-14.2.33-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-38B2AC?style=flat-square&logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-6.2.1-2D3748?style=flat-square&logo=prisma)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=flat-square&logo=mongodb)
![Google Gemini](https://img.shields.io/badge/Google%20Gemini-2.5--flash-orange?style=flat-square&logo=google-gemini)

**Proyecto de Grado** <br>
📍 Medellín, Antioquia, Colombia
<br>
_Versión v1.15.1 | Última actualización: 21 de agosto de 2026_

</div>

---

> [!IMPORTANT]
> **Estándar de Codificación (Gold Standard):** Se recomienda encarecidamente consultar y adherirse al __**Manual de Reglas y Estándares (.rules.md)**__ antes de iniciar cualquier labor de desarrollo. Este documento establece las directrices críticas de arquitectura, nomenclatura y calidad de código del proyecto.

---

## 1. Descripción general

**PawLig** es un ecosistema digital de nivel empresarial de pila completa (full-stack) diseñado para centralizar, estructurar y potenciar las iniciativas de bienestar animal y el marketplace especializado en la región del Valle de Aburrá, Antioquia, Colombia. El proyecto tiene como propósito mitigar la fragmentación actual del sector, unificando en una única plataforma transaccional robusta, segura y escalable a tres actores clave del ecosistema:

* **Albergues de Mascotas (Shelters):** Organizaciones enfocadas en el rescate animal que gestionan de forma integral el ciclo de vida de las mascotas, controlando desde su ingreso, publicación de fichas de adopción, hasta el seguimiento transaccional de las postulaciones.
* **Vendedores Especializados (Vendors):** Comercios locales independientes y proveedores de insumos de bienestar animal que disponen de un marketplace especializado con un panel interactivo para la gestión de stocks, procesamiento de pedidos y métricas de desempeño comercial.
* **Adoptantes y Clientes (Adopters):** Usuarios finales con acceso a un entorno de búsqueda geoespacial y filtros avanzados para adopciones éticas, gestión de favoritos, solicitudes de adopción responsable y adquisición directa de productos de alta calidad para mascotas.

Con una arquitectura basada en tecnologías web de última generación, PawLig integra capacidades avanzadas de **Inteligencia Artificial Generativa**, **Geolocalización Interactiva**, **Notificaciones Transaccionales Robustas** y un **Motor de Simulación Física 2D** en la experiencia de errores, transformando la gestión digital de bienestar animal con el máximo nivel de rigor técnico.

---

## 2. Características principales

El ecosistema cuenta con módulos robustos y funcionalidades altamente técnicas diseñadas para garantizar la seguridad, usabilidad y rendimiento:

### 🧹 Eliminación Segura y Limpieza Automatizada en Cloudinary (v1.15.1)
* **Borrado en Cascada en Cloudinary:** Integración del método `deletePet` en `pet.service.ts` que desencadena la purga automática de activos multimedia en Cloudinary inmediatamente después de remover una mascota de la base de datos, previniendo el almacenamiento huérfano.
* **Integridad Relacional de Adopciones:** Verificación preventiva que bloquea la eliminación física de cualquier mascota que posea solicitudes de adopción registradas, preservando la consistencia transaccional del sistema.

### 👤 Alta Manual de Usuarios y Auditoría Administrativa (v1.15.0)
* **Creación Segura en el Servidor:** Flujo de alta manual de usuarios para administradores desde la interfaz `/admin/moderation/users/create`, permitiendo registrar nuevas cuentas sin requerir el inicio de sesión automático del creador.
* **Contraseñas Seguras Autogeneradas:** Generación de contraseñas temporales y robustas en el backend (mediante entropía criptográfica `crypto.randomBytes` formateada a base64 y filtrada de caracteres ambiguos) que se hashean con `bcryptjs` (12 rondas de sal) para una persistencia segura.
* **Justificación Obligatoria de Roles:** Validación con refinamientos condicionales de Zod (`createUserByAdminSchema.refine`). Al asignar roles administrativos o comerciales (`ADMIN`, `SHELTER`, `VENDOR`), se exige una justificación con un mínimo de 10 caracteres. Para el rol por defecto `ADOPTER`, se asigna una justificación estándar.
* **Integración de IA en Auditoría:** Los administradores disponen del componente `AiRefineButton` para mejorar y redactar formalmente los motivos de creación utilizando el endpoint de IA inteligente.
* **Transacciones Atómicas y Revalidación de Caché:** El servicio `createUserByAdmin` agrupa la creación del registro `User` y su bitácora en `SystemAuditLog` dentro de una transacción interactiva de Prisma (`prisma.$transaction`). Una vez guardado con éxito, se invalida el tag de caché `user-detail` (`revalidateTag`) para mantener los listados administrativos sincronizados instantáneamente.

### 🧠 Inteligencia Artificial Generativa (Google Gemini 2.5-flash)
* **Asistente IA Multi-propósito:** Incorporación de botones inteligentes `AiRefineButton` que se comunican con `/api/ai/refine` para el refinamiento contextual de descripciones de mascotas en fichas de adopción y productos en el marketplace.
* **Asistente de Moderación:** Facilita a los administradores la redacción y optimización gramatical y respetuosa de los motivos de aprobación, rechazo y bloqueo en el Moderation Hub.
* **Saneamiento y Seguridad:** Validación y sanitización estricta de las entradas y salidas de la API generativa para mitigar ataques de inyección de prompts y garantizar la idoneidad del contenido visualizado.

### 🛡️ Moderation Hub Centralizado y Auditoría Polimórfica
* **Consolidación de Control:** Unificación de los procesos administrativos bajo el prefijo de rutas `/admin/moderation/*` (`/users`, `/shelters`, `/vendors`, `/audit`), eliminando pantallas independientes y robusteciendo la verificación administrativa.
* **Auditoría Polimórfica (`SystemAuditLog`):** Registro inmutable y atómico que almacena logs de auditoría para múltiples tipos de recursos, guardando el estado previo y posterior (`before` / `after`) en formato de texto JSON para garantizar trazabilidad técnica total.
* **Seguridad de Archivos:** Endpoint seguro `/api/cloudinary/delete` que verifica la propiedad de las imágenes a través de control de accesos basado en roles (RBAC), evitando que usuarios no autorizados eliminen recursos multimedia en Cloudinary.
* **Desbloqueo de Reenvíos:** Permite a los albergues o vendedores cuyas solicitudes fueron denegadas previamente corregir la información y reenviar un nuevo formulario, manteniendo el bloqueo únicamente cuando existe una postulación activa en estado `PENDING` o `APPROVED`.

### 📧 Motor de Notificaciones Transaccionales (Resend & React Email)
* **11 Plantillas de Correo Responsive:** Diseños responsivos construidos con React Email bajo el branding oficial de PawLig, cubriendo flujos transaccionales críticos:
  * Recuperación segura de contraseña con tokens de un solo uso válidos por una hora.
  * Notificación de nuevas solicitudes de adopción para los albergues.
  * Actualizaciones de estado de adopción dirigidas al adoptante.
  * Confirmación de órdenes de compra para el comprador y avisos automáticos de venta a los comercios.
  * Notificación de despacho con número de guía de envío de pedidos.
  * Alertas de seguridad por bloqueo o desbloqueo administrativo de cuentas de usuario.
  * Notificación formal de aprobación o rechazo con motivos explícitos para albergues y vendedores.
* **Envío Asíncrono No Bloqueante:** Procesamiento en segundo plano de las promesas de envío de correo para garantizar que la latencia del proveedor externo no penalice el tiempo de respuesta del backend ni interrumpa la experiencia del usuario.

### 🗺️ Visualización Geoespacial e Interactiva (Leaflet)
* **Localización en Mapa:** Mapa interactivo integrado que renderiza la ubicación de los refugios autorizados en el Valle de Aburrá, facilitando búsquedas personalizadas por municipio.
* **Servicio de Geocodificación Automático:** Módulo interno (`geocoding.service.ts`) y script ejecutable que convierte direcciones físicas registradas por los refugios en coordenadas (latitud y longitud) para su almacenamiento seguro en MongoDB.

### 🐾 Flexibilidad en Fichas de Adopción
* **Requisitos de Adopción Flexibles:** Los albergues pueden omitir de forma flexible la inserción de requerimientos adicionales en la ficha de adopción. La UI informa con claridad cuando no existen requisitos de adopción adicionales para una mascota, reduciendo las barreras iniciales de postulación.

### 🛒 Carrito de Compras de Alto Rendimiento y Sincronización Eficiente
* **Optimización Dinámica (useCart y useCartSync):** La lógica de obtención y sincronización del carrito del usuario se ejecuta condicionalmente solo cuando el usuario tiene una sesión autenticada y se encuentra navegando activamente en el catálogo de productos.
* **Reducción del Polling:** Evita peticiones innecesarias, revalidaciones en segundo plano y consultas repetitivas para usuarios anónimos o en rutas administrativas, optimizando notablemente la velocidad global del sitio.

### 🌌 404 Orbital Engine (Simulación Física en Canvas 2D)
* **Simulación Física Kepleriana:** La página de error 404 integra un motor de renderizado Canvas 2D interactivo que simula las leyes de órbitas elípticas de Kepler utilizando la variación de velocidad orbital según la excentricidad de la elipse.
* **Proyección Isométrica 3D y Oclusión:** Algoritmos matemáticos personalizados para proyectar volumen 3D y gestionar la profundidad (Z-ordering) de elementos visuales en un lienzo bidimensional.

### 📊 Sistema de Métricas y Reportes
* **Visualización Analítica de Negocio:** Paneles interactivos que ilustran tendencias de ventas, métricas de adopción e inventario en tiempo real mediante `Recharts`.
* **Exportación Multi-formato:** Soporte nativo para descargar reportes estadísticos y estructurados de transacciones y adopciones en formatos **Excel** (vía ExcelJS), **PDF** con formato de tabla profesional (vía jsPDF y autotable) y **CSV**.

---

## 3. Requisitos e instalación

### Prerrequisitos de Entorno
* **Entorno de Ejecución:** Node.js versión `18.17.0` o superior (LTS recomendada, como Node v18 o v20).
* **Gestor de Paquetes:** npm versión `9.0.0` o superior.
* **Base de Datos:** Acceso a un clúster de **MongoDB** (local o clúster en la nube con MongoDB Atlas).

### Guía de Instalación y Configuración Local

1. **Clonación del Repositorio:**
   ```bash
   git clone https://github.com/asebasg/pawlig.git
   cd pawlig
   ```

2. **Instalación de Dependencias del Proyecto:**
   Este comando descarga e instala todas las librerías necesarias del proyecto. Adicionalmente, el script de post-instalación de Prisma (`prisma generate`) se ejecutará automáticamente para generar y sincronizar el cliente type-safe adaptado al esquema de base de datos de MongoDB:
   ```bash
   npm install
   ```

3. **Configuración de Variables de Entorno:**
   Cree un archivo `.env` en la raíz del proyecto tomando como referencia el archivo `.env.local.example` y configure sus credenciales de la siguiente manera:
   ```env
   # Conexión a Base de Datos de MongoDB
   DATABASE_URL="mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/pawlig"

   # Autenticación y Seguridad (NextAuth)
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

4. **Sincronización del Esquema con la Base de Datos:**
   Sincronice la definición del esquema de Prisma (`prisma/schema.prisma`) con su base de datos de MongoDB en la nube o local:
   ```bash
   npx prisma db push
   ```

5. **Poblamiento de Datos de Semilla (Seed - Opcional):**
   Para cargar un conjunto de datos iniciales en la base de datos (usuarios con roles especiales, albergues, vendedores, mascotas, productos de prueba), ejecute:
   ```bash
   npx prisma db seed
   ```
   *Nota: Las credenciales de acceso creadas por la semilla de datos se listan detalladamente en el archivo `credentials-seed.txt` localizado en la raíz de la aplicación.*

---

## 4. Guía de uso

Las operaciones diarias de desarrollo y administración del proyecto se gestionan a través de los siguientes scripts de consola:

### Servidor de Desarrollo Local
Para iniciar un servidor de desarrollo interactivo con recarga en caliente (Hot Module Replacement):
```bash
npm run dev
```
La aplicación estará disponible para interactuar localmente en la dirección: [http://localhost:3000](http://localhost:3000).

### Compilación y Construcción para Producción
Para compilar la aplicación, optimizar los activos y recursos del lado del cliente y servidor:
```bash
npm run build
```

### Ejecución en Modo Producción
Una vez finalizada la compilación para producción con éxito, levante el servidor optimizado para producción mediante:
```bash
npm run start
```

### Ejecución de Pruebas Unitarias y de Integración (Vitest)
El proyecto cuenta con un entorno riguroso de testing configurado mediante Vitest. Para ejecutar la suite de pruebas locales de manera segura y evitar fallos de aserción en el servicio de correos, se debe proveer la variable de entorno `EMAIL_FROM`:
```bash
EMAIL_FROM=onboarding@resend.dev npm test -- --run
```

### Análisis de Calidad y Linting (ESLint)
Para validar que el código se adhiera estrictamente a las reglas y estándares de TypeScript del proyecto:
```bash
npm run lint
```

### Scripts de Mantenimiento y Automatización
El proyecto incluye scripts ejecutables para realizar tareas de administración de manera directa empleando `npx tsx scripts/<script-name>`:
* **Limpieza de Imágenes Huérfanas:** Mantenimiento de Cloudinary para identificar y remover imágenes que no se muestren o referencien en la base de datos.
  ```bash
  npx tsx scripts/cleanup-orphaned-images.ts
  ```
* **Prueba de Envío de Correos Reales:** Valida la integración de envío de correos directos consumiendo la API de Resend.
  ```bash
  npx tsx scripts/test-live-emails.ts
  ```
* **Geocodificación Automática de Albergues:** Procesa las direcciones de los albergues registrados en la base de datos que no cuentan con coordenadas geoespaciales y las geolocaliza automáticamente.
  ```bash
  npx tsx scripts/geocode-shelters.ts
  ```

---

## 5. Tecnologías

El stack tecnológico de PawLig ha sido seleccionado minuciosamente para garantizar un entorno seguro, escalable, con tipado estático robusto y excelente rendimiento:

### Framework & Lenguaje
* **Next.js (App Router) v14.2.33:** Framework de React para renderizado del lado del servidor (SSR), Static Site Generation (SSG) y optimizaciones avanzadas.
* **TypeScript v5.x:** Superset de JavaScript que proporciona tipado estático fuerte para evitar errores en tiempo de ejecución.
* **Node.js v18.17+:** Entorno de ejecución estándar de la capa de backend de la aplicación.

### Base de Datos y ORM
* **MongoDB Atlas:** Base de datos NoSQL flexible orientada a documentos persistida en la nube.
* **Prisma ORM v6.2.1 (con cliente v6.19.3):** Capa de acceso a datos de alto rendimiento, autogenerada y type-safe para el control transaccional de MongoDB.

### Autenticación y Seguridad
* **NextAuth.js v4.24.7:** Sistema seguro de autenticación y sesiones basado en roles de usuario (`ADMIN`, `SHELTER`, `VENDOR`, `ADOPTER`).
* **bcryptjs v3.0.3:** Algoritmo seguro para el hashing y almacenamiento criptográfico de contraseñas de usuarios en el servidor.

### Diseño, Estilos y UI
* **Tailwind CSS v3.4.1:** Framework CSS basado en clases de utilidad y variables semánticas para interfaces responsivas.
* **Radix UI Primitives:** Primitivas de interfaz de usuario sin estilos y accesibles (cumplimiento estricto de WCAG AA y estándares WAI-ARIA).
* **Recharts v3.8.1:** Librería de visualización interactiva de datos y analíticas de negocio en React.
* **Lucide React v0.554.0:** Conjunto unificado de iconos vectoriales SVG limpios y ligeros.

### Servicios de Inteligencia Artificial
* **Google Generative AI SDK (Gemini AI) v0.24.1:** Integración con el modelo `gemini-2.5-flash` para el refinamiento automático de descripciones y motivos de moderación administrativa.

### Mensajería Electrónica y Multimedia
* **Resend SDK v6.12.2:** API premium de envío de correos transaccionales estables.
* **React Email v1.0.12:** Biblioteca de componentes para el diseño y renderizado seguro de correos en formato HTML responsivo.
* **Cloudinary SDK v2.8.0:** Plataforma inteligente para el almacenamiento, carga segura y optimización dinámica de imágenes y activos multimedia.

### Servicios Geoespaciales y Mapas
* **Leaflet v1.9.4 & React Leaflet v4.2.1:** Biblioteca de mapas interactivos ligeros del lado del cliente.

### Reportes & Utilidades
* **ExcelJS v4.4.0:** Herramienta para lectura, edición y escritura de reportes complejos en formato de hoja de cálculo XLSX.
* **jsPDF v4.2.1 & jsPDF-autotable v5.0.7:** Generación dinámica de documentos PDF interactivos directamente en el cliente.
* **date-fns v4.1.0:** Manipulación avanzada y formateo localizado de fechas.
* **remark v15.0.1, remark-gfm, remark-html y unist-util-visit:** Motor para procesamiento de Markdown a HTML.

---

## 6. Estructura del proyecto

El repositorio de PawLig sigue las directrices arquitectónicas más estrictas de Next.js. A continuación, se detalla la disposición jerárquica de carpetas y archivos clave del proyecto (con conectores de árbol correctamente alineados y directorios finalizados con `/`):

```text
./
├── app/                      # Rutas de Next.js, APIs de Servidor y Segmentos del Sistema
│   ├── (auth)/               # Segmento de Autenticación (Login, Register, Unauthorized)
│   │   ├── login/            # Componentes de servidor y páginas para inicio de sesión
│   │   ├── register/         # Creación de cuentas públicas de adoptantes
│   │   └── unauthorized/     # Redirección en caso de accesos denegados por rol
│   ├── (dashboard)/          # Paneles privados con accesos de seguridad por Rol
│   │   ├── admin/            # Panel administrativo: métricas, desarrollo y Moderation Hub
│   │   │   ├── dev/          # Entorno de pruebas y desarrollo interno
│   │   │   ├── metrics/      # Dashboard analítico global para administradores
│   │   │   └── moderation/   # Moderation Hub: gestión unificada de albergues, vendedores, usuarios y logs
│   │   │       ├── audit/    # Interfaz interactiva y paginada para visualización de SystemAuditLog
│   │   │       ├── shelters/ # Moderación de solicitudes de verificación de albergues
│   │   │       ├── users/    # Administración de bloqueos, roles y alta manual de usuarios
│   │   │       └── vendors/  # Moderación de solicitudes de verificación de tiendas
│   │   ├── shelter/          # Panel de albergues autorizados
│   │   │   ├── adoptions/    # Visualización y control de postulaciones de adopción recibidas
│   │   │   ├── metrics/      # Métricas analíticas de adopción de mascotas
│   │   │   └── pets/         # Gestión CRUD de fichas de mascotas disponibles
│   │   ├── user/             # Panel del Adoptante autenticado
│   │   │   ├── request-shelter/  # Formulario de postulación de nuevo albergue
│   │   │   └── request-vendor/   # Formulario de postulación de nueva tienda/comercio
│   │   └── vendor/           # Panel comercial para vendedores autorizados
│   │       ├── metrics/      # Analíticas de ventas, tendencias e ingresos del comercio
│   │       ├── orders/       # Procesamiento de pedidos de productos y estados de envío
│   │       └── products/     # Gestión CRUD del catálogo de productos y actualización de stock
│   ├── (public)/             # Rutas públicas visibles por cualquier visitante
│   │   ├── adopciones/       # Galería interactiva con filtros avanzados y detalle de mascotas
│   │   ├── albergues/        # Directorio geográfico de refugios autorizados en el mapa
│   │   ├── changelog/        # Registro técnico e historial visual de cambios del ecosistema
│   │   ├── faq/              # Respuestas a las preguntas frecuentes
│   │   ├── help/             # Centro de Ayuda e instructivo estructurado del usuario
│   │   ├── nosotros/         # Información del equipo, misión y visión del proyecto
│   │   ├── privacy/          # Políticas de privacidad y tratamiento de datos personales
│   │   ├── productos/        # Marketplace público: galería de productos de bienestar animal
│   │   └── terms/            # Términos y condiciones legales del servicio
│   ├── api/                  # Endpoints RESTful de backend de la plataforma (Next.js API Routes)
│   ├── fonts/                # Fuentes locales tipográficas optimizadas
│   ├── profile/              # Perfil unificado de usuario
│   ├── globals.css           # Estilos CSS globales y variables de tema de Tailwind
│   ├── layout.tsx            # Diseño estructural maestro compartido del ecosistema
│   ├── not-found.tsx         # Página de error 404 con el simulador de física orbital Kepler 2D
│   └── page.tsx              # Landing Page oficial de PawLig
├── components/               # Componentes modulares de React reutilizables
│   ├── admin/                # Componentes interactivos dedicados a las vistas del Moderation Hub
│   ├── adopter/              # Componentes del dashboard de adoptantes
│   ├── cards/                # Tarjetas de presentación de mascotas y productos comerciales
│   ├── cart/                 # Componentes interactivos del carrito de compras
│   ├── filters/              # Menús de filtrado de búsqueda (mascotas y productos)
│   ├── forms/                # Formularios con validación e interactividad (login, registros, pet-form, etc.)
│   ├── help/                 # Componentes visuales tipo acordeón para soporte
│   ├── layout/               # Elementos del marco de aplicación (Navbar, Footer, Floating Cart)
│   ├── map/                  # Componentes de interacción geoespacial con Leaflet
│   ├── modals/               # Modales de confirmación de formularios e interacciones
│   ├── products/             # Componentes de pago y simulación de transacciones
│   ├── profile/              # Perfil de usuario unificado
│   ├── shelter/              # Componentes de visualización para refugios
│   ├── shelters/             # Buscador de albergues y filtros municipales
│   ├── ui/                   # Bloques visuales fundamentales (Button, Card, PasswordInput, AiRefineButton)
│   └── vendor/               # Tablas de stock, productos y gráficos analíticos para vendedores
├── lib/                      # Núcleo de la Lógica de Negocio y Utilidades de Backend
│   ├── auth/                 # Configuración de NextAuth, control de accesos y roles (RBAC)
│   ├── email/                # Lógica del motor de correos y 11 plantillas interactivas de React Email
│   ├── hooks/                # Hooks personalizados de React (useCart, useCartSync, etc.)
│   ├── services/             # Capa lógica de servicios CRUD y de negocio (Pet, Product, Moderation, User)
│   ├── utils/                # Utilidades multiplataforma (generadores de reportes PDF, Excel y CSV)
│   └── validations/          # Esquemas de Zod para validaciones estrictamente declarativas
├── prisma/                   # Configuración del motor de persistencia Prisma
│   ├── schema.prisma         # Esquema unificado y relacional de la base de datos MongoDB
│   └── seed.ts               # Script para la inyección inicial de datos de semilla
├── public/                   # Recursos estáticos y documentación formal del proyecto
│   ├── docs/                 # Documentación formal de grado (Actas, Requerimientos, Historias de Usuario)
│   └── images/               # Activos de marca, capturas de pantalla y diagramas técnicos UML
├── scripts/                  # Scripts de mantenimiento (Cloudinary, geocodificación, prueba de correos)
├── types/                    # Declaraciones de tipos e interfaces globales de TypeScript
├── credentials-seed.txt      # Credenciales de acceso de prueba generadas en el seeding
└── documentacion_y_gestion_de_prs.md # Guía para estandarización de PRs y control de versiones
```

---

## 7. Contribución y licencia

### Contribución al Proyecto

Agradecemos profundamente el compromiso y las contribuciones de desarrollo orientadas a robustecer las capacidades del ecosistema. Para garantizar la consistencia, se debe seguir de forma estricta el siguiente flujo de trabajo:

1. **Bifurcación (Fork):** Realice un fork del repositorio oficial a su cuenta de GitHub.
2. **Creación de una Rama Temática:** Use la nomenclatura estándar según el tipo de intervención:
   * `feat/nueva-funcionalidad` para desarrollos y nuevos requerimientos.
   * `fix/correccion-de-error` para mitigar regresiones o solucionar fallos del sistema.
   * `refactor/mejora-arquitectonica` para reestructurar código existente sin alterar su comportamiento externo.
3. **Adhesión al Estándar de Oro (.rules.md):** Asegúrese de seguir con total rigurosidad el formato de indentación (2 espacios), nomenclatura, comentarios obligatorios (JSDoc de cabecera y notas de implementación en el pie de página) definidos en el archivo `.rules.md`.
4. **Aseguramiento de Pruebas locales:** Ejecute la suite completa de pruebas del proyecto y valide que todas las aserciones pasen de forma exitosa:
   ```bash
   EMAIL_FROM=onboarding@resend.dev npm test -- --run
   ```
5. **Análisis de Estilo (Lint):** Valide que las reglas estáticas de TypeScript y ESLint no arrojen advertencias o errores:
   ```bash
   npm run lint
   ```
6. **Apertura del Pull Request (PR):** Envíe un Pull Request dirigido a la rama de desarrollo principal. El título y la descripción del PR deben detallarse estrictamente en **idioma español**, vinculando el número de Issue correspondiente (`Closes #N`), describiendo la solución adoptada, adjuntando evidencias (screenshots, logs) y siguiendo la guía en `documentacion_y_gestion_de_prs.md`.

### Licencia del Software

Este software es un desarrollo académico y de investigación desarrollado exclusivamente para la **Universidad de San Buenaventura, Seccional Medellín**. Todos los derechos reservados © 2026. Queda estrictamente prohibida la redistribución y el uso comercial no autorizado de este ecosistema digital sin el consentimiento expreso y por escrito del equipo de desarrollo de PawLig y de las autoridades de la institución educativa.

---

<div align="center">
Desarrollado con dedicación y compromiso por el bienestar animal ❤️ por el equipo de PawLig en Medellín, Colombia 🇨🇴.
</div>
