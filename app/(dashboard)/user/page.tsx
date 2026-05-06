import * as React from 'react';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { UserRole } from '@prisma/client';
import AdopterDashboardClient from '@/components/adopter/adopter-dashboard-client';

export const metadata = {
  title: 'Mi Panel de Adopción - PawLig',
  description: 'Gestiona tus mascotas favoritas y solicitudes de adopción',
};

export default async function UserDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/login?callbackUrl=/user');
  }

  if (session.user.role !== UserRole.ADOPTER) {
    redirect('/unauthorized?reason=adopter_only');
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Mi Panel de Adopción</h1>
        <p className="text-lg text-gray-600">Gestiona tus mascotas favoritas y realiza seguimiento a tus solicitudes de adopción</p>
      </div>

      <React.Suspense fallback={<div className="text-center py-12">Cargando panel...</div>}>
        <AdopterDashboardClient userSession={{
          id: session.user.id || '',
          name: session.user.name || '',
          email: session.user.email || '',
          role: session.user.role || UserRole.ADOPTER,
        }} />
      </React.Suspense>
    </main>
  );
}
