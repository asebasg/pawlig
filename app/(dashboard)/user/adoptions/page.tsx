import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/utils/db';
import Image from 'next/image';
import { Clock, CheckCircle, XCircle, MessageCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Mis Postulaciones - PawLig',
  description: 'Todas tus solicitudes de adopción',
};

export default async function AdoptionsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login?callbackUrl=/user/adoptions');
  }

  const adoptions = await prisma.adoption.findMany({
    where: { adopterId: session.user.id },
    include: {
      pet: {
        select: {
          id: true,
          name: true,
          images: true,
          breed: true,
          shelter: {
            select: {
              id: true,
              name: true,
              contactWhatsApp: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; icon: typeof Clock; className: string }> = {
      PENDING: { label: 'Pendiente', icon: Clock, className: 'bg-yellow-100 text-yellow-800' },
      APPROVED: { label: 'Aprobada', icon: CheckCircle, className: 'bg-green-100 text-green-800' },
      REJECTED: { label: 'Rechazada', icon: XCircle, className: 'bg-red-100 text-red-800' },
      COMPLETED: { label: 'Completada', icon: CheckCircle, className: 'bg-blue-100 text-blue-800' },
      CANCELLED: { label: 'Cancelada', icon: XCircle, className: 'bg-gray-100 text-gray-800' },
    };
    const { label, icon: Icon, className } = config[status] || config.PENDING;
    return (
      <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full ${className}`}>
        <Icon className="w-4 h-4" />
        <span className="text-xs font-semibold">{label}</span>
      </div>
    );
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Postulaciones</h1>
        <p className="text-gray-600">{adoptions.length} solicitud{adoptions.length !== 1 ? 'es' : ''} de adopción</p>
      </div>

      {adoptions.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <p className="text-gray-600 mb-4">No tienes solicitudes de adopción</p>
          <a href="/adopciones" className="text-purple-600 hover:text-purple-700 font-semibold">
            Ver mascotas →
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {adoptions.map((adoption) => (
            <div key={adoption.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition">
              <div className="flex gap-4">
                <div className="w-20 h-20 flex-shrink-0">
                  {adoption.pet?.images?.[0] ? (
                    <Image
                      src={adoption.pet.images[0]}
                      alt={adoption.pet.name}
                      className="w-full h-full rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-lg bg-gray-200 flex items-center justify-center text-xs text-gray-400">
                      Sin foto
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {adoption.pet?.name || 'Mascota'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {adoption.pet?.shelter?.name}
                        {adoption.pet?.breed && ` • ${adoption.pet.breed}`}
                      </p>
                    </div>
                    {getStatusBadge(adoption.status)}
                  </div>

                  <p className="text-xs text-gray-500 mb-3">
                    Fecha de postulación: {formatDate(adoption.createdAt)}
                  </p>

                  <div className="flex gap-2">
                    {adoption.pet?.id && (
                      <a
                        href={`/adopciones/${adoption.pet.id}`}
                        className="text-sm font-medium text-purple-600 hover:text-purple-700 underline"
                      >
                        Ver mascota
                      </a>
                    )}
                    {adoption.pet?.shelter?.contactWhatsApp && (
                      <a
                        href={`https://wa.me/${adoption.pet.shelter.contactWhatsApp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm font-medium text-green-600 hover:text-green-700 underline"
                      >
                        <MessageCircle className="w-3 h-3" />
                        Contactar
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
