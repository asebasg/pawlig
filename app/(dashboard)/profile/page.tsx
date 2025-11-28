import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { redirect } from 'next/navigation';
import UserProfileForm from '@/components/forms/user-profile-form';

export const metadata: Metadata = {
  title: 'Editar Perfil Personal - PawLig',
  description: 'Actualiza tu información personal en PawLig',
};

export default async function UserProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login?callbackUrl=/dashboard/profile');
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <a href="/user" className="text-purple-600 hover:text-purple-700 text-sm font-semibold">
          ← Volver a Mi Panel
        </a>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <UserProfileForm />
      </div>

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
