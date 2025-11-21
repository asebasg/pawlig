import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { redirect } from 'next/navigation';
import { UserRole } from '@prisma/client';

/**
 * Requiere que el usuario tenga uno de los roles especificados
 * 
 * @param allowedRoles - Array de roles permitidos para acceder a la ruta
 * @returns Session del usuario si tiene permisos, redirige si no
 * 
 * @example
 * // Solo ADOPTER puede acceder
 * await requireRole(['ADOPTER']);
 * 
 * @example
 * // ADMIN o SHELTER pueden acceder
 * const session = await requireRole(['ADMIN', 'SHELTER']);
 * console.log(session.user.name); // Usar datos del usuario
 */

export async function requireRole(allowedRoles: UserRole[]) {
    // 1️⃣ Obtener sesión del usuario
    const session = await getServerSession(authOptions);

    // 2️⃣ VALIDACIÓN: Usuario debe estar autenticado
    if (!session || !session.user) {
        // No hay sesión → redirigir a login con callback
        // El middleware ya debería bloquear esto, pero esta es una segunda capa de seguridad
        redirect('/login');
    }

    const userRole = session.user.role as UserRole;

    // 3️⃣ VALIDACIÓN: Usuario debe tener uno de los roles permitidos
    if (!allowedRoles.includes(userRole)) {
        // Tiene rol pero no el correcto → redirigir a su dashboard correspondiente
        const roleRedirects: Record<UserRole, string> = {
            ADMIN: '/admin',
            SHELTER: '/shelter',
            VENDOR: '/vendor',
            ADOPTER: '/user',
        };

        redirect(roleRedirects[userRole] || '/');
    }

    // 4️⃣ ✅ Usuario autenticado con rol correcto
    return session;
}

/**
 * Requiere específicamente rol ADMIN (shortcut helper)
 * 
 * @example
 * await requireAdmin(); // Solo ADMIN puede acceder
 */
export async function requireAdmin() {
    return requireRole(['ADMIN']);
}

/**
 * Requiere específicamente rol SHELTER (shortcut helper)
 * 
 * @example
 * await requireShelter(); // Solo SHELTER puede acceder
 */
export async function requireShelter() {
    return requireRole(['SHELTER']);
}

/**
 * Requiere específicamente rol VENDOR (shortcut helper)
 * 
 * @example
 * await requireVendor(); // Solo VENDOR puede acceder
 */
export async function requireVendor() {
    return requireRole(['VENDOR']);
}

/**
 * Requiere específicamente rol ADOPTER (shortcut helper)
 * 
 * @example
 * await requireAdopter(); // Solo ADOPTER puede acceder
 */
export async function requireAdopter() {
    return requireRole(['ADOPTER']);
}

/**
 * Requiere que el usuario esté autenticado (cualquier rol)
 * 
 * @example
 * const session = await requireAuth();
 * // Útil para páginas que requieren login pero aceptan cualquier rol
 */
export async function requireAuth() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect('/login');
    }

    return session;
}

/**
 * 📚 NOTAS DE IMPLEMENTACIÓN:
 * 
 * 1. USO EN PÁGINAS:
 *    // app/request-shelter/page.tsx
 *    export default async function RequestShelterPage() {
 *      await requireAdopter(); // ✅ Una sola línea
 *      return <div>Contenido protegido</div>;
 *    }
 * 
 * 2. USO CON MÚLTIPLES ROLES:
 *    // app/some-page/page.tsx
 *    export default async function SomePage() {
 *      await requireRole(['ADMIN', 'SHELTER']); // Admin o Shelter pueden acceder
 *      return <div>Contenido</div>;
 *    }
 * 
 * 3. USO CON DATOS DEL USUARIO:
 *    // app/profile/page.tsx
 *    export default async function ProfilePage() {
 *      const session = await requireAuth();
 *      return <div>Hola {session.user.name}</div>;
 *    }
 * 
 * 4. SEGURIDAD EN CAPAS:
 *    Capa 1: Middleware bloquea anónimos (eficiente)
 *    Capa 2: requireRole() valida rol específico (preciso)
 *    Capa 3: API Routes validan sesión nuevamente (defense in depth)
 * 
 * 5. TRAZABILIDAD:
 *    - RF-006: Gestión de roles y permisos ✅
 *    - RNF-002: Seguridad (autorización) ✅
 *    - HU-002: Solicitud de albergue (protección) ✅
 *    - HU-014: Gestión de usuarios (solo ADMIN) ✅
 * 
 * 6. VENTAJAS SOBRE VALIDACIÓN MANUAL:
 *    ✅ Código más limpio (1 línea vs 8)
 *    ✅ Menos errores humanos
 *    ✅ Fácil de testear (función pura)
 *    ✅ Consistente en todo el proyecto
 *    ✅ Fácil de modificar lógica global
 * 
 * 7. COMPATIBILIDAD:
 *    - Next.js 14 App Router ✅
 *    - Server Components only (no funciona en Client Components)
 *    - TypeScript type-safe ✅
 *    - Vercel serverless ✅
 */