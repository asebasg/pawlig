import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { redirect } from 'next/navigation';
import { UserRole } from '@prisma/client';
import UserProfileForm from '@/components/forms/user-profile-form';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Editar Perfil Personal - PawLig',
  description: 'Actualiza tu información personal en PawLig',
};

export default async function UserProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login?callbackUrl=/user/profile');
  }

  if (session.user.role !== UserRole.ADOPTER) {
    redirect('/unauthorized?reason=adopter_only');
  }

  return (
    <div className="min-h-screen bg-muted">
      <header className="bg-card shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary">PawLig</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Hola, <span className="font-semibold">{session.user.name}</span>
              </span>
              <a href="/api/auth/signout" className="text-sm text-muted-foreground hover:text-foreground">
                Cerrar sesión
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link href="/user" className="inline-flex items-center gap-2 text-primary hover:text-purple-700 text-sm font-semibold">
            <ArrowLeft className="w-4 h-4" />
            Volver al Panel
          </Link>
        </div>

        <div className="bg-card rounded-lg shadow-md p-8">
          <UserProfileForm />
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">📋 Información Importante</h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li><strong>✓ Cambios inmediatos:</strong> Los cambios se aplicarán inmediatamente en tu cuenta.</li>
            <li><strong>✓ Validación:</strong> El sistema valida automáticamente que todos los campos obligatorios estén completos.</li>
            <li><strong>✓ Edad mínima:</strong> Debes tener al menos 18 años para usar PawLig.</li>
            <li><strong>✓ Información personal:</strong> Tu información se mantiene segura y privada.</li>
          </ul>
        </div>
      </main>

      <footer className="bg-card border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-muted-foreground text-sm">&copy; 2025 - PawLig<br />Todos los derechos reservados</p>
        </div>
      </footer>
    </div>
  );
}
