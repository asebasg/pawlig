import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { UserRole } from "@prisma/client";
import UnifiedProfileClient from '@/components/profile/unified-profile-client';

export const metadata: Metadata = {
  title: 'Editar Perfil',
  description: 'Actualiza tu información de administrador',
};

export default async function AdminProfilePage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    redirect("/login?callbackUrl=/admin/profile");
  }

  if (session.user.role !== UserRole.ADMIN) {
    redirect("/unauthorized?reason=admin_only");
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <Link href="/admin/moderation/users" className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 text-sm font-semibold">
          <ArrowLeft className="w-4 h-4" />
          Volver a Usuarios
        </Link>
      </div>

      <UnifiedProfileClient role={session.user.role} />
    </main>
  );
}
