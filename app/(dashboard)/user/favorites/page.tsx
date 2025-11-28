import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Mis Favoritos - PawLig',
  description: 'Todas tus mascotas favoritas',
};

export default async function FavoritesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== 'ADOPTER') {
    redirect('/login?callbackUrl=/user/favorites');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            href="/user"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al panel
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Mis Favoritos</h1>
          <p className="text-gray-600 mt-2">Todas tus mascotas guardadas</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <p className="text-gray-600">Vista completa de favoritos - En desarrollo</p>
        </div>
      </main>
    </div>
  );
}
