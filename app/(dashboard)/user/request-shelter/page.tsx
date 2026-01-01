'use client';

import { ShelterRequestForm } from '@/components/forms/shelter-request-form';
import Link from 'next/link';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

/**
 * GET /request-shelter
 * Descripción: Página para solicitar una cuenta de albergue.
 * Requiere: Usuario autenticado con rol 'ADOPTER' o 'VENDOR'.
 * Implementa: HU-003 (Solicitud de Albergue)
 */
export default function RequestShelterPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/login?callbackUrl=/request-shelter');
      return;
    }

    //  Solo ADOPTER y VENDOR pueden acceder
    const allowedRoles = ['ADOPTER', 'VENDOR'];
    if (!allowedRoles.includes(session.user.role)) {
      router.push('/unauthorized?reason=adopters_vendors_only');
      return;
    }
  }, [session, status, router]);

  //  Validación de rol en loading
  if (status === 'loading') {
    return <div>Cargando...</div>;
  }

  if (!session) {
    return <div>Redirigiendo...</div>;
  }

  //  Validación de rol antes de renderizar
  const allowedRoles = ['ADOPTER', 'VENDOR'];
  if (!allowedRoles.includes(session.user.role)) {
    return <div>Redirigiendo...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl">
        {/* Header con logo y navegación */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block mb-4">
            <h1 className="text-4xl font-bold text-purple-600">PawLig</h1>
          </Link>
          <p className="text-sm text-gray-600">Promoviendo la adopción responsable</p>
        </div>

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
                  <h3 className="text-sm font-medium text-purple-800">
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
        </div>

        {/* Disclaimer legal */}
        <p className="text-center text-xs text-gray-500 mt-6">
          Al enviar esta solicitud, confirmas que la información proporcionada es veraz y
          aceptas los{' '}
          <Link href="/terminos" className="text-purple-600 hover:underline">
            Términos de Servicio
          </Link>{' '}
          de PawLig.
        </p>
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
 * Página protegida que permite a usuarios con rol 'ADOPTER' o 'VENDOR' solicitar
 * la verificación como albergue. Incluye validaciones de seguridad tanto en el
 * cliente como en el servidor.
 *
 * Lógica Clave:
 * - Protección de Ruta: Implementa una triple verificación de seguridad:
 *   1. useEffect: Redirige si no hay sesión o el rol no es válido.
 *   2. Renderizado Condicional: No muestra contenido hasta validar la sesión.
 *   3. Validación de Roles: Restringe el acceso explícitamente a roles
 *      autorizados, redirigiendo intentos no válidos a la página de
 *      acceso no autorizado con un motivo específico.
 *
 * Dependencias Externas:
 * - next-auth/react: Hooks useSession para la gestión del estado de autenticación
 *   en el cliente.
 * - ShelterRequestForm: Componente que encapsula la lógica del formulario.
 *
 */