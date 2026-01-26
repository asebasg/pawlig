import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { redirect } from 'next/navigation';
import RegisterForm from '@/components/forms/register-form';
import Link from 'next/link';

/**
 * GET /register
 * Descripción: Página de registro para nuevos usuarios. Redirige a usuarios ya autenticados.
 * Requiere: Acceso público (usuarios no autenticados).
 * Implementa: HU-002 (Registro de Usuario)
 */
export const metadata: Metadata = {
  title: 'Registro',
  description: 'Crea tu cuenta en PawLig para adoptar mascotas de forma responsable en el Valle de Aburrá',
};

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
    <div className="min-h-screen bg-muted flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Card contenedor */}
        <div className="bg-card rounded-2xl shadow-lg p-8">
          <RegisterForm />
          <p className='text-center text-xs text-muted-foreground'>
            Al registrarte en PawLig, aceptas nuestros {' '}

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
  );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Facilita el registro de nuevos usuarios en la plataforma. Verifica si
 * existe una sesión activa y redirige a los usuarios autenticados para
 * prevenir accesos redundantes al formulario de registro.
 *
 * Lógica Clave:
 * - Verificación de Sesión: Utiliza getServerSession para comprobar si el
 *   usuario ya ha iniciado sesión.
 * - Redirección por Rol: Si el usuario está autenticado, se le redirige a la
 *   página correspondiente a su rol (Admin, Shelter, Vendor, Adopter).
 *
 * Dependencias Externas:
 * - next-auth: Para verificar el estado de la sesión del usuario.
 * - RegisterForm: Componente que maneja la lógica y validación del
 *   formulario de registro.
 *
 */