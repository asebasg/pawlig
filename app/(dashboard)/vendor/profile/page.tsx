import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { redirect } from 'next/navigation';
import VendorProfileForm from '@/components/forms/vendor-profile-form';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

/**
 * Metadata para SEO
 */
export const metadata: Metadata = {
  title: 'Editar Perfil de Negocio - PawLig',
  description: 'Actualiza la información de tu negocio de productos para mascotas',
};

/**
 * Página de edición de perfil de vendedor
 * Implementa HU-003: Actualización del perfil del vendedor
 * 
 * Criterios de aceptación:
 * 1. Edita información y la guarda → sistema guarda cambios y aplica inmediatamente
 * 2. Campo obligatorio vacío → sistema notifica qué campo debe ser completado
 * 
 * Ruta: /vendor/profile (solo VENDOR)
 */
export default async function VendorProfilePage() {
  // Obtener sesión del usuario
  const session = await getServerSession(authOptions);

  // Verificar autenticación
  if (!session?.user) {
    redirect('/login?callbackUrl=/vendor/profile');
  }

  // Verificar rol de vendedor
  if (session.user.role !== 'VENDOR') {
    redirect('/unauthorized');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al Inicio
          </Link>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <VendorProfileForm />
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            📋 Información Importante
          </h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>
              <strong>✓ Cambios inmediatos:</strong> Los cambios se aplicarán inmediatamente en tu tienda visible a los clientes.
            </li>
            <li>
              <strong>✓ Validación:</strong> El sistema valida automáticamente que todos los campos obligatorios estén completos.
            </li>
            <li>
              <strong>✓ Logo:</strong> Puedes usar una URL de imagen o subir a través de servicios como imgur.com.
            </li>
            <li>
              <strong>✓ Descripción:</strong> Una descripción clara y atractiva ayuda a aumentar tus ventas.
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}

/**
 * 📚 NOTAS DE IMPLEMENTACIÓN:
 * 
 * 1. SEGURIDAD:
 *    - Requiere autenticación con NextAuth
 *    - Verifica rol VENDOR antes de mostrar formulario
 *    - Redirige a login si no está autenticado
 *    - Redirige a /unauthorized si no tiene rol VENDOR
 * 
 * 2. FLUJO DE EDICIÓN (HU-003):
 *    1. Usuario VENDOR accede a /vendor/profile
 *    2. Página carga con datos actuales del perfil (GET /api/vendors/profile)
 *    3. Usuario edita campos y hace clic en "Guardar Cambios"
 *    4. Formulario valida datos localmente con Zod
 *    5. Si validación OK → envía PUT /api/vendors/profile
 *    6. Backend valida nuevamente y actualiza en MongoDB
 *    7. Respuesta con éxito o errores de validación
 *    8. Si éxito → muestra mensaje verde "Perfil actualizado exitosamente"
 *    9. Si error en campo → muestra en rojo qué debe ser corregido
 * 
 * 3. CRITERIOS DE ACEPTACIÓN HU-003:
 *    ✓ Criterio 1: "Cuando edito y guardo → sistema guarda y aplica inmediatamente"
 *      - Implementado: PUT endpoint actualiza MongoDB inmediatamente
 *      - Frontend: No necesita reload, datos persisten en formData
 *      - Visible: Mensaje de éxito confirma guardado
 *    
 *    ✓ Criterio 2: "Campo obligatorio vacío → notifica qué campo completar"
 *      - Implementado: Validación Zod con mensajes específicos
 *      - Frontend: Muestra errores en rojo debajo del campo
 *      - Backend: Retorna 400 con detalles de errores
 *      - UX: Campo se marca en rojo para visibilidad
 * 
 * 4. CAMPOS ACTUALIZABLES:
 *    - businessName (Obligatorio)
 *    - businessPhone (Opcional)
 *    - description (Opcional)
 *    - logo (Opcional, URL)
 *    - municipality (Obligatorio)
 *    - address (Obligatorio)
 * 
 * 5. CAMPOS NO ACTUALIZABLES (protegidos):
 *    - verified: Solo admin puede cambiar
 *    - rejectionReason: Solo admin asigna
 *    - createdAt: Inmutable
 *    - userId: Inmutable
 * 
 * 6. ESTADOS DEL FORMULARIO:
 *    - isFetching: Mientras carga datos iniciales
 *    - isLoading: Mientras procesa envío
 *    - successMessage: Confirma guardado
 *    - serverError: Error general
 *    - errors: Errores por campo
 * 
 * 7. VALIDACIONES (Zod):
 *    - businessName: 3-100 caracteres
 *    - businessPhone: 7-15 caracteres (opcional)
 *    - description: 20-1000 caracteres (opcional)
 *    - logo: URL válida (opcional)
 *    - municipality: Debe ser del enum Municipality
 *    - address: 5-200 caracteres
 */
