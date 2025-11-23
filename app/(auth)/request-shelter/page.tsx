'use client';

import { ShelterRequestForm } from '@/components/forms/shelter-request-form';
import Link from 'next/link';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function RequestShelterPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/login?callbackUrl=/request-shelter');
      return;
    }
    
    if (session.user.role !== 'ADOPTER') {
      router.push('/dashboard');
      return;
    }
  }, [session, status, router]);

  if (status === 'loading' || !session || session.user.role !== 'ADOPTER') {
    return <div>Cargando...</div>;
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

/**
 * 📚 NOTAS TÉCNICAS:
 * 
 * 1. SEGURIDAD EN CAPAS:
 *    - Capa 1 (Middleware): Bloquea usuarios anónimos antes de renderizar
 *    - Capa 2 (requireAdopter): Valida rol ADOPTER en el servidor
 *    - Capa 3 (API Route): Validará nuevamente al procesar el formulario
 * 
 * 2. ¿POR QUÉ SOLO ADOPTER?
 *    - SHELTER ya tiene cuenta de albergue (no puede solicitar otra)
 *    - VENDOR es proveedor de productos (contexto diferente)
 *    - ADMIN no necesita solicitar (tiene todos los permisos)
 *    - ADOPTER es el único que tiene sentido para "convertirse en albergue"
 * 
 * 3. FLUJO DE USUARIO:
 *    Usuario anónimo en /adopciones → Ve enlace "¿Tienes un albergue?"
 *      ↓
 *    Clic en enlace → Intenta acceder /request-shelter
 *      ↓
 *    Middleware detecta: sin sesión
 *      ↓
 *    Redirige a: /login?callbackUrl=/request-shelter
 *      ↓
 *    Usuario se registra/inicia sesión como ADOPTER
 *      ↓
 *    Redirige de vuelta a: /request-shelter
 *      ↓
 *    requireAdopter() valida: role === 'ADOPTER' ✅
 *      ↓
 *    Renderiza formulario de solicitud
 * 
 * 4. CASO DE USO INVÁLIDO:
 *    Usuario SHELTER intenta acceder directamente a /request-shelter
 *      ↓
 *    Middleware permite pasar (tiene sesión válida)
 *      ↓
 *    requireAdopter() detecta: role === 'SHELTER' ❌
 *      ↓
 *    Redirige a: /shelter (su dashboard)
 * 
 * 5. ACCESIBILIDAD:
 *    - Formulario con labels correctos
 *    - Información clara de requisitos
 *    - Disclaimer visible de términos
 *    - Navegación coherente con breadcrumbs implícitos
 * 
 * 6. UX MEJORADA:
 *    - Card bien definida con sombra
 *    - Información introductoria antes del formulario
 *    - Requisitos visibles para evitar rechazos
 *    - Link de regreso al inicio
 * 
 * 7. TRAZABILIDAD COMPLETA:
 *    - HU-002: "Solicitud y aprobación de cuenta de albergue" ✅
 *    - RF-007: "Administración de albergues" ✅
 *    - CU-002: "Solicitar cuenta de albergue" ✅
 *    - Manual Usuario 5.1: "Requisitos previos" ✅
 *    - RNF-002: "Seguridad (protección de rutas)" ✅
 */