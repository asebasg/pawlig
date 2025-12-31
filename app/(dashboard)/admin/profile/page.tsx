import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Editar Perfil de Administrador - PawLig',
  description: 'Actualiza tu información de administrador',
};

export default async function AdminProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login?callbackUrl=/admin/profile');
  }

  if (session.user.role !== 'ADMIN') {
    redirect('/unauthorized');
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <a href="/admin/users" className="text-purple-600 hover:text-purple-700 text-sm font-semibold">
          ← Volver a Usuarios
        </a>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Editar Perfil de Administrador</h2>
        <p className="text-gray-600">Funcionalidad en desarrollo</p>
      </div>
    </main>
  );
}
