# Pawlig - Plataforma Digital de Servicios para la Adopción de Mascotas

Pawlig es una aplicación web moderna construida con el stack T3 (Next.js, TypeScript, Tailwind CSS), diseñada para simplificar la gestión de citas en clínicas veterinarias. Permite a los dueños de mascotas registrar a sus animales y agendar citas de manera eficiente, mientras que ofrece a los veterinarios una interfaz intuitiva para administrar su disponibilidad y confirmar solicitudes.

## Características Principales

- **Autenticación Segura:** Inicio de sesión y registro para usuarios (dueños de mascotas) y administradores (personal de la clínica) utilizando NextAuth.js.
- **Gestión de Perfiles:** Los usuarios pueden administrar la información de sus mascotas, incluyendo nombre, raza, edad y historial médico.
- **Sistema de Citas Completo:** Funcionalidad para solicitar, confirmar, y cancelar citas, con notificaciones para mantener a ambas partes informadas.
- **Panel de Administración:** Una vista dedicada para que el personal de la clínica gestione la disponibilidad, apruebe nuevas citas y visualice el calendario de actividades.
- **Diseño Responsivo:** Interfaz de usuario limpia y adaptable a cualquier dispositivo, desarrollada con Tailwind CSS.
- **Base de Datos Robusta:** Persistencia de datos gestionada con Prisma ORM, facilitando las operaciones de base de datos de manera segura y eficiente.

## Tecnologías Utilizadas

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

## Primeros Pasos

Sigue estas instrucciones para obtener una copia del proyecto en funcionamiento en tu máquina local para desarrollo y pruebas.

### Prerrequisitos

Asegúrate de tener instalado lo siguiente en tu sistema:

- [Node.js](https://nodejs.org/) (versión 18.x o superior)
- [npm](https://www.npmjs.com/) (o [yarn](https://yarnpkg.com/))
- Una instancia de base de datos en ejecución (ej. PostgreSQL, MySQL, SQLite).

### Instalación

1.  **Clona el repositorio:**

    ```bash
    git clone https://github.com/tu-usuario/pawlig.git
    cd pawlig
    ```

2.  **Instala las dependencias del proyecto:**
    ```bash
    npm install
    ```
    o si usas yarn:
    ```bash
    yarn install
    ```

### Configuración del Entorno Local

1.  **Crea un archivo `.env`** en la raíz del proyecto, puedes duplicar el archivo `.env.example` (si existe) o crearlo desde cero.

    ```bash
    cp .env.example .env
    ```

2.  **Configura la URL de la base de datos** en tu archivo `.env`. Asegúrate de que apunte a tu instancia de base de datos.

    ```
    DATABASE_URL="postgresql://user:password@localhost:5432/mydatabase"
    ```

3.  **Configura las variables de NextAuth.js** para la autenticación. Deberás generar un secreto.
    ```
    AUTH_SECRET="tu_secreto_super_secreto_aquí"
    # Agrega aquí otras variables de entorno que necesites, como proveedores de OAuth, etc.
    ```
    Puedes generar un `AUTH_SECRET` adecuado con el siguiente comando en tu terminal:
    ```bash
    openssl rand -base64 32
    ```

### Migraciones de la Base de Datos

Una vez que hayas configurado tu archivo `.env`, ejecuta las migraciones de Prisma para preparar tu base de datos.

1.  **Genera el cliente de Prisma:**

    ```bash
    npx prisma generate
    ```

2.  **Aplica las migraciones a tu base de datos:**
    ```bash
    npx prisma db push
    ```

### Ejecutar la Aplicación

Con la configuración completada, puedes iniciar el servidor de desarrollo.

```bash
npm run dev
```

o si usas yarn:

```bash
yarn dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación en funcionamiento.

## Scripts Disponibles

En el `package.json`, encontrarás varios scripts para automatizar tareas comunes:

- `npm run dev`: Inicia el servidor de desarrollo.
- `npm run build`: Compila la aplicación para producción.
- `npm run start`: Inicia un servidor de producción.
- `npm run lint`: Ejecuta el linter para identificar problemas en el código.

---

Desarrollado con ❤️ para los amantes de las mascotas.
