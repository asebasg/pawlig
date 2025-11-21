import { Metadata } from 'next';
import LoginForm from '@/components/forms/login-form';
import Link from 'next/link';

/**
 * Metadata para SEO y redes sociales
 * aparece en el <head> de la pagina
 */

export const metadata: Metadata = {
    title: 'Iniciar Sesión - PawLig',
    description: 'Accede a tu cuenta de PawLig para adoptar mascotas o gestionar tu albergue',
};

/**
 * Página de login
 * 
 * Layout:
 * - Fondo gris claro (bg-gray-50)
 * - Fondo gris claro (bg-gray-50)
 * - Contenedor centrado vertical y horizontalmente
 * - Card blanca con sombra que contiene el formulario
 * - Logo/título en la parte superior
 * - Footer con enlaces legales
 */

export default function LoginPage() {
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
 * 📚 NOTAS TÉCNICAS:
 * 
 * 1. ESTRUCTURA DE CARPETAS:
 *    - (auth) es un grupo de rutas (route group) en Next.js
 *    - No afecta la URL, solo organiza archivos
 *    - /login/page.tsx se accede como /login
 * 
 * 2. METADATA:
 *    - Generada en el servidor (SEO-friendly)
 *    - Aparece en <title> y meta tags
 *    - Mejora la indexación en buscadores
 * 
 * 3. RESPONSIVE DESIGN:
 *    - sm:mx-auto: Centrado horizontal en pantallas pequeñas+
 *    - sm:w-full sm:max-w-md: Ancho limitado en desktop
 *    - px-4 sm:px-6 lg:px-8: Padding adaptativo
 * 
 * 4. ACCESIBILIDAD:
 *    - min-h-screen: Altura mínima completa de viewport
 *    - flex flex-col justify-center: Centrado vertical
 *    - text-center para alineación visual
 * 
 * 5. INTEGRACIÓN:
 *    - LoginForm es un Client Component ('use client')
 *    - Esta página es Server Component (por defecto)
 *    - La página es estática, el form es interactivo
 */