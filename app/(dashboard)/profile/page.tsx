import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { redirect } from 'next/navigation';
import UserProfileForm from '@/components/forms/user-profile-form';

/**
 * Metadata para SEO
 */
export const metadata: Metadata = {
  title: 'Editar Perfil Personal - PawLig',
  description: 'Actualiza tu información personal en PawLig',
};

/**
 * Página de edición de perfil de usuario adoptante
 * Implementa HU-003: Actualización del perfil del usuario
 * 
 * Criterios de aceptación:
 * 1. Edita información y la guarda → sistema guarda cambios y aplica inmediatamente
 * 2. Campo obligatorio vacío → sistema notifica qué campo debe ser completado
 * 
 * Ruta: /dashboard/profile (para cualquier usuario autenticado)
 */
export default async function UserProfilePage() {
  // Obtener sesión del usuario
  const session = await getServerSession(authOptions);

  // Verificar autenticación
  if (!session?.user) {
    redirect('/login?callbackUrl=/dashboard/profile');
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="mb-8">
        <a href="/user" className="text-purple-600 hover:text-purple-700 text-sm font-semibold">
          ← Volver a Mi Panel
        </a>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <UserProfileForm />
      </div>

      {/* Info Section */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          📋 Información Importante
        </h3>
        <ul className="text-sm text-blue-800 space-y-2">
          <li>
            <strong>✓ Cambios inmediatos:</strong> Los cambios se aplicarán inmediatamente en tu cuenta.
          </li>
          <li>
            <strong>✓ Validación:</strong> El sistema valida automáticamente que todos los campos obligatorios estén completos.
          </li>
          <li>
            <strong>✓ Edad mínima:</strong> Debes tener al menos 18 años para usar PawLig.
          </li>
          <li>
            <strong>✓ Información personal:</strong> Tu información se mantiene segura y privada.
          </li>
        </ul>
      </div>
    </main>
  );
}

/**
 * 📚 NOTAS DE IMPLEMENTACIÓN:
 * 
 * 1. SEGURIDAD:
 *    - Requiere autenticación con NextAuth
 *    - Accesible solo para usuarios autenticados
 *    - Redirige a login si no está autenticado
 * 
 * 2. FLUJO DE EDICIÓN (HU-003):
 *    1. Usuario accede a /dashboard/profile
 *    2. Página carga con datos actuales del usuario (GET /api/users/profile)
 *    3. Usuario edita campos y hace clic en "Guardar Cambios"
 *    4. Formulario valida datos localmente con Zod
 *    5. Si validación OK → envía PUT /api/users/profile
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
 *    - name (Obligatorio)
 *    - phone (Obligatorio)
 *    - municipality (Obligatorio)
 *    - address (Obligatorio)
 *    - idNumber (Obligatorio)
 *    - birthDate (Obligatorio)
 * 
 * 5. CAMPOS NO ACTUALIZABLES (protegidos):
 *    - email: No se puede cambiar desde aquí
 *    - password: Se cambiaría en otra página separada
 *    - role: Inmutable después de registro
 *    - isActive: Solo admin puede cambiar
 * 
 * 6. ESTADOS DEL FORMULARIO:
 *    - isFetching: Mientras carga datos iniciales
 *    - isLoading: Mientras procesa envío
 *    - successMessage: Confirma guardado
 *    - serverError: Error general
 *    - errors: Errores por campo
 * 
 * 7. VALIDACIONES (Zod):
 *    - name: 2-100 caracteres
 *    - phone: 7-15 caracteres
 *    - idNumber: 5-20 caracteres
 *    - birthDate: Mayor de 18 años
 *    - municipality: Debe ser del enum Municipality
 *    - address: 5-200 caracteres
 */
