import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { redirect } from 'next/navigation';
import { UserRole } from '@prisma/client';

/**
 * Ruta/Componente/Servicio: Servicio de Autorización por Rol
 * Descripción: Proporciona funciones para proteger rutas y páginas del servidor, asegurando que solo los usuarios con roles específicos puedan acceder.
 * Requiere: Autenticación de usuario.
 * Implementa: RF-006, RNF-002
 */

export async function requireRole(allowedRoles: UserRole[]) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect('/login');
    }

    const userRole = session.user.role as UserRole;

    if (!allowedRoles.includes(userRole)) {
        const roleRedirects: Record<UserRole, string> = {
            ADMIN: '/admin',
            SHELTER: '/shelter',
            VENDOR: '/vendor',
            ADOPTER: '/user',
        };

        redirect(roleRedirects[userRole] || '/');
    }

    return session;
}

export async function requireAdmin() {
    return requireRole(['ADMIN']);
}

export async function requireShelter() {
    return requireRole(['SHELTER']);
}

export async function requireVendor() {
    return requireRole(['VENDOR']);
}

export async function requireAdopter() {
    return requireRole(['ADOPTER']);
}

export async function requireAuth() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect('/login');
    }

    return session;
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Este archivo es un componente crítico de la capa de autorización de la aplicación.
 * Se utiliza directamente en Server Components de Next.js para validar la sesión
 * y el rol del usuario al inicio de la renderización de una página. Si el usuario
 * no cumple los requisitos, es redirigido a una página apropiada, previniendo
 * de forma efectiva el acceso no autorizado a nivel de ruta.
 *
 * Lógica Clave:
 * - 'requireRole': Es la función principal que obtiene la sesión del servidor.
 *   Valida si la sesión existe y si el rol del usuario ('userRole') está incluido
 *   en la lista de roles permitidos ('allowedRoles'). Si la validación falla,
 *   redirige al usuario. Es la base para todas las demás funciones de ayuda.
 * - 'Funciones de ayuda (requireAdmin, etc.)': Son atajos (shortcuts) que
 *   invocan a 'requireRole' con un rol predefinido. Su propósito es simplificar
 *   el código en las páginas y mejorar la legibilidad, haciendo la intención de
 *   la autorización más explícita (ej: 'requireAdmin()' en lugar de 'requireRole(['ADMIN'])').
 * - 'Estrategia de Redirección': Si un usuario autenticado intenta acceder a una
 *   ruta para la que no tiene permisos, no se le envía a la página de login,
 *   sino a su dashboard principal correspondiente. Esto mejora la experiencia
 *   de usuario al evitar confusiones.
 *
 * Dependencias Externas:
 * - 'next-auth': Se utiliza para obtener la sesión del usuario en el servidor
 *   a través de 'getServerSession'.
 * - 'next/navigation': Proporciona la función 'redirect' para redirigir a los
 *   usuarios que no cumplen con los requisitos de autorización.
 * - '@prisma/client': Se usa para importar el tipo 'UserRole', asegurando la
 *   consistencia de tipos con el esquema de la base de datos.
 *
 */
