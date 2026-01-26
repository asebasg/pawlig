import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { redirect } from 'next/navigation';
import LoginForm from '@/components/forms/login-form';
import Link from 'next/link';

/**
 * GET /login
 * Descripción: Página de inicio de sesión. Redirige a los usuarios autenticados a sus respectivas páginas según su rol.
 * Requiere: Acceso público (usuarios no autenticados).
 * Implementa: HU-001 (Inicio de Sesión)
 */
export const metadata: Metadata = {
    title: 'Iniciar Sesión',
    description: 'Accede a tu cuenta de PawLig para adoptar mascotas o gestionar tu albergue',
};

export default async function LoginPage() {
    //  Verificar si ya hay sesión activa
    const session = await getServerSession(authOptions);

    if (session && session.user) {
        //  Usuario ya autenticado → redirigir según rol
        const roleRedirects: Record<string, string> = {
            ADMIN: '/admin',
            SHELTER: '/shelter',
            VENDOR: '/vendor',
            ADOPTER: '/adopciones',
        };

        redirect(roleRedirects[session.user.role] || '/adopciones');
    }

    return (
        <div className='min-h-screen bg-muted flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
            <div className='w-full max-w-md'>
                {/* Card contenedor del formulario */}
                <div className='bg-card rounded-2xl shadow-lg p-8 w-full max-w-md'>
                    <LoginForm />
                    <div className='mt-8'>
                        <p className='text-center text-xs text-muted-foreground'>
                            Al iniciar sesión, aceptas nuestros {' '}

                            <Link href='/terms' className='text-primary hover:underline font-bold'>
                                Términos y Condiciones
                            </Link> {' '}
                            y{' '}
                            <Link href='/privacy' className='text-primary hover:underline font-bold'>
                                Política de Privacidad
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Gestiona el acceso de usuarios al sistema mediante el formulario de login.
 * Si el usuario ya está autenticado, lo redirige automáticamente a su panel
 * correspondiente según su rol.
 *
 * Lógica Clave:
 * - Redirección Automática: Utiliza getServerSession para verificar si existe
 *   una sesión activa. Si es así, redirige al usuario a la ruta definida en
 *   roleRedirects para evitar que acceda nuevamente al formulario de login.
 * - Validación de Sesión: La verificación se realiza en el servidor antes de
 *   renderizar el componente para mejorar la seguridad y el rendimiento.
 *
 * Dependencias Externas:
 * - next-auth: Para la gestión de la sesión y autenticación del usuario.
 * - next/navigation: Para realizar la redirección (redirect) si el usuario ya
 *   está autenticado.
 * - LoginForm: Componente reutilizable que contiene la lógica del formulario.
 *
 */