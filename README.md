# 🐾 PawLig - Plataforma Integral de Adopción de Mascotas

<div align="center">

**Una plataforma moderna para conectar mascotas con hogares responsables**

![Next.js](https://img.shields.io/badge/Next.js-14.2.33-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=flat-square&logo=mongodb)
![NextAuth](https://img.shields.io/badge/NextAuth-4.24.7-yellow?style=flat-square)

**Proyecto de grado** <br>
📍 Medellín, Antioquia, Colombia
<br>
_Última actualización: 31-12-2025_

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

**PawLig** es una plataforma web full-stack integral que facilita la adopción responsable de mascotas y el comercio de productos para animales en el Valle de Aburrá. Permite a albergues publicar mascotas en adopción, a usuarios adoptar responsablemente, a proveedores vender productos especializados, y a administradores supervisar todo el ecosistema de manera segura y eficiente.

El proyecto está diseñado con arquitectura moderna, seguridad empresarial y experiencia de usuario optimizada para dispositivos móviles y desktop.

---

## ✨ Características Principales

### 🔐 Autenticación y Seguridad

- **Sistema multi-rol** con 4 tipos de usuarios: Admin, Albergue, Proveedor, Adoptante.
- **Autenticación JWT** stateless mediante NextAuth.js.
- **Contraseñas encriptadas** con bcryptjs.
- **Validación de datos** con esquemas Zod.
- **Middleware de protección** de rutas por rol.

### 🐕 Módulo de Adopciones

- **Publicación de mascotas** por albergues con múltiples imágenes.
- **Búsqueda avanzada** con filtros por especie, raza, edad, etc.
- **Sistema de favoritos** y postulaciones de adopción.
- **Gestión de estado** de adopción (Pendiente, Aprobada, Rechazada).

### 🛍️ Tienda Virtual (E-commerce)

- **Catálogo de productos** y gestión de inventario.
- **Sistema de órdenes** con múltiples estados.
- **Carrito de compras** persistente.

### 👥 Paneles de Control Personalizados

- **Dashboards** para Admin, Albergue, Proveedor y Adoptante, cada uno con funcionalidades específicas a su rol.

### 📊 Auditoría y Moderación

- **Historial de acciones** administrativas.
- **Verificación de albergues** y proveedores.
- **Registro de IP y User-Agent** para seguridad.

### 📱 Diseño Responsivo

- **Mobile-first** y adaptable a todos los dispositivos.
- **Componentes accesibles** con Tailwind CSS.

### 🌐 Integraciones

- **WhatsApp e Instagram** para contacto.
- **Cloudinary** para almacenamiento de imágenes.

---

## 🛠️ Tecnologías Utilizadas

### Frontend

- **Next.js 14.2.33**: Framework React con SSR.
- **React 18**: Librería para UI.
- **TypeScript 5.0**: Tipado estático.
- **Tailwind CSS 3.4**: Framework de estilos.
- **React Hook Form 7.66.1**: Gestión de formularios.

### Backend & Autenticación

- **NextAuth.js 4.24.7**: Autenticación y sesiones.
- **Prisma 6.19**: ORM para base de datos.
- **Zod 4.1.12**: Validación de esquemas.

### Base de Datos & Almacenamiento

- **MongoDB Atlas**: Base de datos NoSQL.
- **Cloudinary**: Almacenamiento de imágenes.

---

## 📦 Instalación y Configuración

### Prerrequisitos

- Node.js 18.17+
- npm 9+ o yarn 1.22+
- Git
- Cuenta en MongoDB Atlas
- Cuenta en Cloudinary

### Pasos

1. **Clonar el Repositorio:**

   ```bash
   git clone https://github.com/asebasg/pawlig.git
   cd pawlig
   ```

2. **Instalar Dependencias:**

   ```bash
   npm install
   ```

3. **Configurar Variables de Entorno:**

   - Copia `.env.local.example` a `.env.local`.
   - Rellena las variables con tus credenciales de MongoDB, NextAuth y Cloudinary.

4. **Inicializar Base de Datos:**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Iniciar Servidor de Desarrollo:**
   ```bash
   npm run dev
   ```
   La aplicación estará disponible en `http://localhost:3000`.

---

## 🗂️ Estructura del Proyecto

```
pawlig/
├── app/             # Rutas, páginas y layouts (App Router)
├── components/      # Componentes React reutilizables
├── lib/             # Lógica compartida, utilidades y servicios
├── prisma/          # Esquema de la base de datos
├── types/           # Definiciones de TypeScript
├── middleware.ts    # Middleware de autenticación
└── ...              # Otros archivos de configuración
```

---

## 🔑 Roles y Permisos de Usuario

- **ADMIN:** Control total del sistema.
- **SHELTER:** Gestiona mascotas y adopciones.
- **VENDOR:** Gestiona productos y pedidos.
- **ADOPTER:** Busca mascotas, postula y compra productos.

---

## 🗄️ Modelo de Datos

El `schema.prisma` define las siguientes entidades principales:

- `User`
- `Shelter`
- `Pet`
- `Adoption`
- `Vendor`
- `Product`
- `Order`
- `Favorite`
- `UserAudit`

---

## 🧪 Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo.
- `npm run build`: Compila la aplicación para producción.
- `npm run start`: Inicia el servidor de producción.
- `npm run test`: Ejecuta las pruebas unitarias con Vitest.
- `npx prisma generate`: Genera el cliente de Prisma.
- `npx prisma db push`: Sincroniza el esquema con la base de datos.
- `npx prisma studio`: Abre la interfaz visual de la base de datos.
- `npm run lint`: Ejecuta el linter.

---

## 🔐 Características de Seguridad

- **Autenticación JWT** stateless.
- **Contraseñas encriptadas** con bcryptjs.
- **Protección de rutas** por rol.
- **Validación de datos** en cliente y servidor con Zod.
- **Auditoría completa** de acciones administrativas.

---

## 🤝 Cómo Contribuir

¡Las contribuciones son bienvenidas! Si deseas mejorar PawLig, sigue estos pasos:

1. **Haz un Fork** del repositorio.
2. **Crea una nueva Rama:**
   ```bash
   git checkout -b feature/nombre-descriptivo
   ```
3. **Realiza tus cambios** y haz commits siguiendo la [convención de commits](https://www.conventionalcommits.org/en/v1.0.0/).
   ```bash
   git commit -m "feat(adopciones): agrega filtro por tamaño"
   ```
4. **Haz Push** a tu rama:
   ```bash
   git push origin feature/nombre-descriptivo
   ```
5. **Crea un Pull Request** en GitHub.

---

## 📝 Licencia

Este proyecto es para fines académicos como parte del programa de Ingeniería de Software de la Universidad de San Buenaventura. Todos los derechos reservados.

---

## 📞 Soporte y Contacto

**Equipo de Desarrollo:**

- **Andrés Sebastián Ospina Guzmán:** asebasg07@gmail.com
- **Mateo Úsuga Vasco:** mateo.usuga.v21@gmail.com
- **Santiago Lezcano Escobar:** santiag1725g@gmail.com

Para dudas o sugerencias, no dudes en contactarnos.

---

<div align="center">

**Hecho con ❤️ por el equipo de PawLig**

[⬆ Volver al inicio](#)

</div>
