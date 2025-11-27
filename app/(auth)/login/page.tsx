import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { redirect } from 'next/navigation';
import LoginForm from '@/components/forms/login-form';
import Link from 'next/link';

/**
 * Metadata para SEO y redes sociales
 */
export const metadata: Metadata = {
    title: 'Iniciar Sesión',
    description: 'Accede a tu cuenta de PawLig para adoptar mascotas o gestionar tu albergue',
};

/**
 *  Página de login
 * Usuarios autenticados son redirigidos automáticamente
 */
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
        <div className='min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8'>
            <div className='sm:mx-auto sm:w-full sm:max-w-md'>
                <Link href='/' className='inline-block'>
                    <h1 className='text-4xl font-bold text-purple-600'>
                        PawLig
                    </h1>
                </Link>
                <p className='mt-2 mb-2 text-sm text-gray-600'>
                    Promoviendo la adopción responsable
                </p>
            </div>

            {/* Card contenedor del formulario */}
            <div className='bg-white rounded-2xl shadow-lg p-8'>
                <LoginForm />
            </div>

            {/* Footer */}
            <div className='mt-8'>
                <p className='text-center text-xs text-gray-500'>
                    Al iniciar sesión, aceptas nuestros {' '}

                    <Link href='/terminos' className='text-purple-600 hover:underline'>
                        Términos de servicio
                    </Link> {' '}
                    y{' '}
                    <Link href='/privacidad' className='text-purple-600 hover:underline'>
                        Política de Privacidad
                    </Link>
                </p>
            </div>
        </div>
    );
}

/**
 * 📚 CAMBIOS IMPLEMENTADOS:
 * 
 * 1. Redirección automática de usuarios autenticados
 *    - getServerSession() verifica sesión activa
 *    - Si existe sesión → redirect según rol
 *    - Si no existe sesión → muestra formulario de login
 * 
 * 2. Redirecciones por rol:
 *    - ADMIN → /admin
 *    - SHELTER → /shelter
 *    - VENDOR → /vendor
 *    - ADOPTER → /adopciones
 * 
 * 3. Seguridad:
 *    - Server Component (validación en servidor)
 *    - Sin renderizado innecesario si ya autenticado
 *    - Previene doble login accidental
 * 
 * 4. Trazabilidad:
 *    - Usuarios autenticados NO pueden acceder a /login ✅
 *    - RNF-002: Seguridad (gestión de sesiones) ✅
 */