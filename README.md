# PawLig - Plataforma de Adopción de Mascotas

Proyecto académico del SENA - Análisis y Desarrollo de Software  
**Equipo:** Andrés Ospina (Líder), Mateo Úsuga, Santiago Lezcano  
**Instructor:** Mateo Arroyave Quintero

## 📋 Descripción

PawLig es una plataforma web integral para la adopción responsable de mascotas y comercio electrónico de productos para animales en el Valle de Aburrá.

## Características Principales

- **Autenticación Segura:** Sistema de login y registro con roles diferenciados (Admin, Albergue, Proveedor, Adoptante) usando NextAuth.js
- **Gestión de Adopciones:** Módulo completo para publicar mascotas, búsqueda con filtros avanzados y sistema de postulaciones
- **Tienda Virtual:** E-commerce de productos para el cuidado animal con gestión de inventario y checkout simulado
- **Panel de Administración:** Dashboard para supervisión de usuarios, albergues, productos y métricas del sistema
- **Comunicación Externa:** Integración con WhatsApp e Instagram para contacto directo entre adoptantes y albergues
- **Diseño Responsivo:** Interfaz adaptable a dispositivos móviles, tablets y desktop desarrollada con Tailwind CSS

## Tecnologías Utilizadas

- **Framework:** Next.js 14 (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **Autenticación:** NextAuth.js
- **ORM:** Prisma
- **Validación de Datos:** Zod
- **Base de Datos:** MongoDB Atlas
- **Almacenamiento:** Cloudinary
- **Deployment:** Vercel

## 📦 Instalación

### Prerrequisitos

- Node.js 18+ instalado
- npm o yarn
- Cuenta de MongoDB Atlas
- Git configurado

### Pasos de instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/pawlig.git
cd pawlig
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.local.example .env.local
```

Edita `.env.local` con tus credenciales:
- `DATABASE_URL`: Connection string de MongoDB Atlas
- `NEXTAUTH_SECRET`: Genera uno con `openssl rand -base64 32`
- `NEXTAUTH_URL`: `http://localhost:3000`

4. **Generar cliente de Prisma**
```bash
npx prisma generate
```

5. **Sincronizar schema con MongoDB**
```bash
npx prisma db push
```

6. **Iniciar servidor de desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## 🗂️ Estructura del Proyecto

```
pawlig/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Rutas de autenticación
│   ├── (dashboard)/         # Rutas protegidas
│   ├── api/                 # API Routes
│   │   └── auth/[...nextauth]/ # NextAuth endpoint
│   ├── adopciones/          # Módulo público de adopción
│   ├── productos/           # Módulo de tienda
│   └── albergues/           # Información de albergues
├── components/              # Componentes React
│   ├── ui/                  # Componentes base
│   ├── forms/               # Formularios
│   ├── cards/               # Tarjetas
│   ├── layout/              # Layout components
│   └── providers/           # Context providers
├── lib/                     # Lógica de negocio
│   ├── auth/                # Autenticación
│   ├── services/            # Servicios
│   ├── validations/         # Schemas Zod
│   └── utils/               # Utilidades
├── hooks/                   # Custom hooks
├── types/                   # TypeScript types
├── prisma/                  # Prisma schema
│   └── schema.prisma
└── public/                  # Assets estáticos
```

## 🔑 Roles de Usuario

- **ADMIN:** Control total del sistema
- **SHELTER:** Gestión de albergues y mascotas
- **PROVIDER:** Gestión de productos
- **ADOPTER:** Usuario que puede adoptar

## 🧪 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Inicia servidor de desarrollo

# Build
npm run build            # Construye para producción
npm start                # Inicia servidor de producción

# Prisma
npx prisma studio        # Interfaz visual de base de datos
npx prisma generate      # Genera cliente Prisma
npx prisma db push       # Sincroniza schema con MongoDB

# Linting
npm run lint             # Ejecuta ESLint
```

## 📚 Documentación del Proyecto

Ver carpeta `/docs` para:
- Acta de Constitución
- Requerimientos funcionales
- Historias de usuario
- Arquitectura del software
- Casos de uso
- Diagramas UML

## 🔄 Flujo de Trabajo Git

### Crear nueva feature

```bash
git checkout -b feature/nombre-feature
# Desarrollar...
git add .
git commit -m "feat(modulo): descripción del cambio"
git push origin feature/nombre-feature
```

### Convención de commits

- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Formato de código (no afecta funcionalidad)
- `refactor`: Refactorización de código
- `test`: Agregar o modificar tests
- `chore`: Cambios en build/config

### Pull Requests

1. Crear PR desde tu rama hacia `main`
2. Esperar revisión del líder (Andrés)
3. Resolver comentarios si los hay
4. Merge después de aprobación

## 🛠️ Configuración de MongoDB Atlas

1. Crear cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crear cluster gratuito (M0)
3. Configurar usuario de base de datos
4. Whitelist IP: `0.0.0.0/0` (todas las IPs)
5. Obtener connection string
6. Reemplazar `<username>`, `<password>` y `<dbname>` en `.env.local`

## 🔐 NextAuth Configuration

El proyecto usa NextAuth.js con:
- Strategy: JWT (stateless)
- Provider: Credentials (email/password)
- Session: 24 horas
- Password hashing: bcrypt (12 rounds)

## 🚧 Estado del Proyecto

**Sprint actual:** Sprint 1 - Infraestructura y Autenticación  
**Duración:** 14-18 de noviembre, 2025  
**Progreso:** Configuración inicial completada

## 👥 Equipo

- **Andrés Sebastián Ospina Guzmán** - Líder y Desarrollador Backend
- **Mateo Úsuga Vasco** - Desarrollador y Analista
- **Santiago Lezcano Escobar** - Diseñador y Tester

## 📞 Contacto

Para dudas o sugerencias, contactar al líder del proyecto:  
📧 asebasg07@gmail.com

## 📝 Licencia

Proyecto académico - SENA 2025. Todos los derechos reservados.