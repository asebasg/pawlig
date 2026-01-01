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
