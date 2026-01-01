import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth/auth-options';
import { ShelterRequestForm } from '@/components/forms/shelter-request-form';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

/**
 * PAGE /user/request-shelter
 * Descripción: Página de solicitud de registro como albergue. Protegida para usuarios autenticados con rol 'ADOPTER'.
 * Requiere: Usuario autenticado, Rol ADOPTER
 * Implementa: Solicitud de Registro de Albergue
 */

export const metadata: Metadata = {
  title: "Solicitar Cuenta de Albergue",
  description: "Formulario para solicitar el registro de una cuenta de albergue en PawLig.",
};

export default async function RequestShelterPage() {
  const session = await getServerSession(authOptions);

  //  1. Validar sesión
  if (!session?.user) {
    redirect('/login?callbackUrl=/user/request-shelter');
  }

  //  2. Validar roles permitidos
  // Solo los usuarios 'ADOPTER' pueden solicitar ser albergues.
  // Los albergues y admins no necesitan acceder aquí.
  const allowedRoles = ['ADOPTER'];
  if (!allowedRoles.includes(session.user.role)) {
    // Redirigir a página de no autorizado o al dashboard
    // Usamos query param para mostrar un mensaje específico si existe la página de error
    redirect('/unauthorized?reason=role_not_allowed');
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl">
        <Link
          href="/user"
          className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a Mi Panel
        </Link>
        {/* Card contenedor del formulario */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Información introductoria */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Solicitar Cuenta de Albergue
            </h2>
            <p className="text-gray-600">
              Completa el siguiente formulario para solicitar una cuenta especializada
              de albergue. Un administrador revisará tu solicitud en un plazo de 2-3 días laborables.
            </p>
            <p className="text-gray-600 mt-2.5">Los campos con <span className='text-red-500 font-bold'>*</span> son <span className='font-bold'>campos obligatorios</span>.</p>

            {/* Información adicional */}
            <div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-bold text-purple-800">
                    Requisitos para albergues
                  </h3>
                  <div className="mt-2 text-sm text-purple-700">
                    <ul className="list-disc list-inside space-y-1">
                      <li>Ser una entidad legalmente constituida en el Valle de Aburrá</li>
                      <li>Contar con al menos un método de contacto (WhatsApp o Instagram)</li>
                      <li>Proporcionar información veraz y completa</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario de solicitud */}
          <ShelterRequestForm />

          {/* Disclaimer legal */}
          <p className="text-center text-xs text-gray-500 mt-6">
            Al enviar esta solicitud, confirmas que la información proporcionada es veraz y
            aceptas los{' '}
            <Link href="/terminos" className="text-purple-600 hover:underline font-bold">
              Términos de Servicio
            </Link>{' '}
            de PawLig.
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
 * Esta página actúa como un contenedor seguro para el formulario de solicitud
 * de albergue. Su responsabilidad principal es garantizar que solo los usuarios
 * con rol 'ADOPTER' puedan acceder al formulario.
 *
 * Lógica Clave:
 * - Server-Side Rendering (SSR): Se utiliza getServerSession para validar
 *   la autenticación antes de servir cualquier contenido HTML.
 * - Control de Acceso Basado en Roles (RBAC): Se verifica explícitamente
 *   que el rol del usuario sea 'ADOPTER'.
 * - Redirección Automática: 
 *   - Si no hay sesión -> redirige a /login.
 *   - Si el rol no es válido -> redirige a /unauthorized.
 *
 * Dependencias Externas:
 * - NextAuth: Utilizado para verificar la sesión del usuario del lado del servidor.
 * - Next.js Navigation: Utilizado para manejar las redirecciones (redirect).
 * - ShelterRequestForm: Componente interno que renderiza el formulario de solicitud.
 *
 */
