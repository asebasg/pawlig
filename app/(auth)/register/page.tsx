import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { redirect } from 'next/navigation';
import RegisterForm from '@/components/forms/register-form';

/**
 * Metadata para SEO y redes sociales
 */
export const metadata: Metadata = {
  title: 'Registro',
  description: 'Crea tu cuenta en PawLig para adoptar mascotas de forma responsable en el Valle de Aburrá',
};

/**
 *  Página de registro de nuevos usuarios adoptantes
 * Ruta: /register
 * Usuarios autenticados son redirigidos automáticamente
 */
export default async function RegisterPage() {
  //  Verificar si ya hay sesión activa
  const session = await getServerSession(authOptions);

  if (session && session.user) {
    // Usuario ya autenticado → redirigir según rol
    const roleRedirects: Record<string, string> = {
      ADMIN: '/admin',
      SHELTER: '/shelter',
      VENDOR: '/vendor',
      ADOPTER: '/adopciones',
    };

    redirect(roleRedirects[session.user.role] || '/adopciones');
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Card contenedor */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <RegisterForm />
        </div>

        {/* Disclaimer legal */}
        <p className="text-center text-xs text-gray-500 mt-6">
          Al registrarte, aceptas nuestros{' '}
          <a href="/terminos" className="text-purple-600 hover:underline">
            Términos de Servicio
          </a>{' '}
          y{' '}
          <a href="/privacidad" className="text-purple-600 hover:underline">
            Política de Privacidad
          </a>
        </p>
      </div>
    </div>
  );
}

/**
 * 📚 CAMBIOS IMPLEMENTADOS:
 * 
 * 1. MEJORA 2: Redirección automática de usuarios autenticados
 *    - getServerSession() verifica sesión activa
 *    - Si existe sesión → redirect según rol
 *    - Si no existe sesión → muestra formulario de registro
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
 *    - Previene doble registro accidental
 * 
 * 4. Trazabilidad:
 *    - Usuarios autenticados NO pueden acceder a /register ✅
 *    - RNF-002: Seguridad (gestión de sesiones) ✅
 */