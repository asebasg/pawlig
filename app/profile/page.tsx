import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { UserRole } from "@prisma/client";
import { prisma } from '@/lib/utils/db';
import UnifiedProfileClient from '@/components/profile/unified-profile-client';

export const metadata: Metadata = {
  title: 'Mi Perfil | PawLig',
  description: 'Gestiona tu información personal y configuración de cuenta.',
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    redirect("/login?callbackUrl=/profile");
  }

  // Validaciones específicas según el rol
  if (session.user.role === UserRole.SHELTER) {
    const shelter = await prisma.shelter.findUnique({
      where: { id: session.user.shelterId as string },
      select: { verified: true },
    });
    if (!shelter?.verified) {
      redirect("/unauthorized?reason=shelter_not_verified");
    }
  } else if (session.user.role === UserRole.VENDOR) {
    const vendor = await prisma.vendor.findUnique({
      where: { id: session.user.vendorId as string },
      select: { verified: true },
    });
    if (!vendor?.verified) {
      redirect("/unauthorized?reason=vendor_not_verified");
    }
  }

  // Determinar la URL y texto del botón "Volver"
  let backUrl = "/";
  let backText = "Volver al Inicio";

  switch (session.user.role) {
    case UserRole.ADMIN:
      backUrl = "/admin";
      backText = "Volver al Dashboard";
      break;
    case UserRole.SHELTER:
      backUrl = "/shelter";
      backText = "Volver al Dashboard";
      break;
    case UserRole.VENDOR:
      backUrl = "/vendor";
      backText = "Volver al Dashboard";
      break;
    case UserRole.ADOPTER:
      backUrl = "/user";
      backText = "Volver al Dashboard";
      break;
  }

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <Link href={backUrl} className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 text-sm font-semibold">
          <ArrowLeft className="w-4 h-4" />
          {backText}
        </Link>
      </div>

      <UnifiedProfileClient role={session.user.role as UserRole} />

      {/* Información específica para roles */}
      {session.user.role === UserRole.ADOPTER && (
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">📋 Información Importante</h3>
          <ul className="list-disc pl-5 space-y-2 text-blue-800 text-sm">
            <li>La información actualizada se reflejará en todas tus nuevas postulaciones.</li>
            <li>Asegúrate de mantener tu número de teléfono vigente para facilitar el contacto.</li>
          </ul>
        </div>
      )}
    </main>
  );
}
