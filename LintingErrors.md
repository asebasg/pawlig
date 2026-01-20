# Registro de Errores de Linting y Compilación

Este archivo documenta los errores encontrados durante el proceso de build (`npm run build`) y las correcciones aplicadas para asegurar un despliegue exitoso.

## Errores de TypeScript (TSC)

### 1. Identificadores Duplicados en `lib/validations/user.schema.ts`
- **Error**: `Type error: Duplicate identifier 'RegisterUserInput'.`, `LoginInput`, `ShelterApplicationInput`.
- **Archivo**: `lib/validations/user.schema.ts`
- **Causa**: Los tipos inferidos de Zod se estaban exportando dos veces en el mismo archivo, una vez a mitad del archivo y otra al final.
- **Corrección**: Se eliminaron las exportaciones duplicadas y se unificaron al final del archivo. Se aprovechó para ajustar el estilo de documentación y corregir importaciones.
- **Impacto**: Corrige el error de compilación de TypeScript. No afecta la lógica de la aplicación ya que los tipos siguen estando disponibles.

### 2. Error de Espacio de Nombres en Pruebas Unitarias
- **Error**: `error TS2503: Cannot find namespace 'vi'.`
- **Archivo**: `lib/services/pet.service.spec.ts`
- **Causa**: Uso incorrecto de `vi.Mock` como un tipo de TypeScript.
- **Corrección**: Se importó explícitamente el tipo `Mock` de `vitest` y se utilizó para el casting de los métodos mockeados de Prisma.
- **Impacto**: Permite que las pruebas compilen correctamente durante el proceso de build.

## Errores de Prerrenderizado (Next.js Build)

### 3. Falta de Suspense en `useSearchParams`
- **Error**: `useSearchParams() should be wrapped in a suspense boundary at page "/unauthorized"`.
- **Archivo**: `app/(auth)/unauthorized/page.tsx`
- **Causa**: Next.js requiere que los componentes de cliente que utilizan `useSearchParams` estén envueltos en un límite de `Suspense` para poder ser pre-renderizados estáticamente.
- **Corrección**: Se refactorizó la página para mover la lógica que usa `useSearchParams` a un subcomponente (`UnauthorizedContent`) y se envolvió este en un bloque `Suspense`. Se corrigió también un error gramatical en los mensajes ("autorizada" -> "autorizado").
- **Impacto**: Corrige el fallo del build durante la generación de páginas estáticas.

### 4. Validación Fail-Fast en Cloudinary
- **Error**: `❌ Faltan variables de entorno críticas de Cloudinary en .env`
- **Archivo**: `lib/cloudinary.ts`
- **Causa**: El código lanzaba un error fatal si faltaban las variables de entorno, lo que impedía que el build de Next.js terminara exitosamente al procesar rutas de API.
- **Corrección**: Se modificó la lógica en `lib/cloudinary.ts` para que la falta de variables solo genere una advertencia (`console.warn`) durante la inicialización, lanzando el error solo si se intenta ejecutar una función que realmente requiere la configuración. Además, se actualizó `.env.local.example` con el nombre correcto de la variable `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`.
- **Impacto**: Permite que el proceso de build progrese sin necesidad de tener las llaves reales configuradas en el entorno de construcción, manteniendo la seguridad en tiempo de ejecución.
