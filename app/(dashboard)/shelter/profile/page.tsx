import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { UserRole } from '@prisma/client';
import { prisma } from '@/lib/utils/db';

export const metadata: Metadata = {
  title: 'Editar Perfil',
  description: 'Actualiza la información de tu albergue',
};

export default async function ShelterProfilePage() {
  const session = await getServerSession(authOptions);
  // Verificar autenticación, rol y verificación de rol
  if (!session || !session.user) {
    redirect("/login?callbackUrl=/shelter/profile");
  }

  if (session.user.role !== UserRole.SHELTER) {
    redirect("/unauthorized?reason=shelter_only");
  }
  // Obtener id de SHELTER
  const shelterId = session.user.shelterId as string;
  const shelter = await prisma.shelter.findUnique({
    where: { id: shelterId as string },
    select: { id: true, verified: true },
  });

  if (!shelter?.verified) {
    redirect("/unauthorized?reason=shelter_not_verified");
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
          <Link href="/shelter/pets" className="inline-flex items-center gap-2 text-primary hover:text-purple-700 text-sm font-semibold">
            <ArrowLeft className="w-4 h-4" />
            Volver a Mascotas
          </Link>
        </div>

        <div className="bg-card rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Editar Perfil del Albergue</h2>
          <p className="text-muted-foreground">Funcionalidad en desarrollo</p>
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
