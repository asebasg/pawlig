import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { UserRole } from '@prisma/client';
import AdopterDashboardClient from '@/components/adopter/AdopterDashboardClient';

/**
 * Ruta/Componente/Servicio: UserDashboardPage
 * Descripción: Panel principal para el usuario con rol de adoptante.
 * Requiere: next-auth, prisma
 * Implementa: Vista consolidada de favoritos y solicitudes de adopción.
 */

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
        <h1 className="text-4xl font-bold text-foreground mb-2">Mi Panel de Adopción</h1>
        <p className="text-lg text-muted-foreground">Gestiona tus mascotas favoritas y realiza seguimiento a tus solicitudes de adopción</p>
      </div>

      <AdopterDashboardClient userSession={{
        id: session.user.id || '',
        name: session.user.name || '',
        email: session.user.email || '',
        role: session.user.role || UserRole.ADOPTER,
      }} />
    </main>
  );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Este es el punto de entrada para los usuarios que buscan adoptar. Proporciona
 * acceso rápido a sus mascotas guardadas y al estado de sus trámites.
 *
 * Lógica Clave:
 * - 'Protección de Ruta': Verifica que el usuario esté autenticado y tenga el
 *   rol 'ADOPTER'. De lo contrario, redirige a login o a una página de no
 *   autorizado.
 * - 'AdopterDashboardClient': Delega el renderizado de la interfaz interactiva
 *   a un componente cliente para manejar el estado de las pestañas y la carga
 *   de datos asíncrona.
 *
 * Dependencias Externas:
 * - 'next-auth': Para la validación de sesión y roles en el lado del servidor.
 * - '@prisma/client': Para el uso de enums de roles.
 *
 */
