import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/utils/db';
import AdoptionApplicationsClient from '@/components/AdoptionApplicationsClient';
import Link from 'next/link';
import { ArrowLeft, Info, Home } from 'lucide-react';
import { UserRole } from '@prisma/client';
import { Card, CardContent } from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import { AdoptionStats } from '@/components/shelter/AdoptionStats';

/**
 * PAGE: /shelter/adoptions
 * Descripción: Panel de gestión de postulaciones de adopción para albergues. Permite visualizar estadísticas, revisar solicitudes pendientes y gestionar aprobaciones/rechazos.
 * Requiere: Usuario autenticado con rol SHELTER y albergue verificado.
 * Implementa: TAREA-024 (Gestión de postulaciones)
 */

export const metadata = {
  title: 'Postulaciones',
  description: 'Gestiona las postulaciones de adopción de tu albergue',
};

export default async function ShelterAdoptionsPage() {
  const session = await getServerSession(authOptions);
  // Verificar autenticación, rol y verificación de rol
  if (!session || !session.user) {
    redirect("/login?callbackUrl=/shelter/adoptions");
  }

  if (session.user.role !== UserRole.SHELTER) {
    redirect("/unauthorized?reason=shelter_only");
  }
  // Obtener id de SHELTER
  const shelterId = session.user.shelterId as string;
  const shelter = await prisma.shelter.findUnique({
    where: { id: shelterId as string },
    select: { id: true, name: true, verified: true },
  });

  if (!shelter?.verified) {
    redirect("/unauthorized?reason=shelter_not_verified");
  }

  // 5. Obtener conteo de mascotas
  const petCount = await prisma.pet.count({
    where: { shelterId: shelter.id },
  });

  // 6. Obtener estadísticas de postulaciones (datos puros)
  const adoptionStats = await prisma.adoption.groupBy({
    by: ['status'],
    where: {
      pet: {
        shelterId: shelter.id,
      },
    },
    _count: true,
  });

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex flex-col">
          <Link href="/shelter" className="inline-flex items-center gap-2 mb-2 text-purple-600 hover:text-purple-700 text-sm font-semibold transition-colors w-fit">
            <ArrowLeft className="w-4 h-4" />
            Volver al Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 leading-tight">Postulaciones de Adopción</h1>
          <p className="text-gray-500 mt-1">Gestiona y revisa las solicitudes de adopción para tus mascotas</p>
        </div>

        {/* Info Albergue Rápida */}
        <div className="flex items-center gap-3 bg-white p-3 rounded-xl border shadow-sm self-start md:self-center">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Home className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Albergue</p>
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-gray-900">{shelter.name}</p>
              <Badge variant="default" className="bg-green-100 text-green-700 pointer-events-none">
                Verificado
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <AdoptionStats data={adoptionStats} />

      {/* Info Tips */}
      <Card className="mb-8 border-blue-100 bg-blue-50/50">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="hidden sm:flex p-3 bg-blue-100 rounded-xl h-fit">
              <Info className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex flex-col">
              <h3 className="hidden sm:block text-lg font-bold text-blue-900 mb-2">
                ¿Cómo funciona el sistema de postulaciones?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                  <p className="text-sm text-blue-800"><strong>Pendiente:</strong> Nuevas solicitudes esperando revisión. Puedes <strong>aprobar</strong> o <strong>rechazar</strong>.</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                  <p className="text-sm text-blue-800"><strong>Aprobada:</strong> La mascota pasará a estado <strong>&quot;En Proceso&quot;</strong> automáticamente.</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                  <p className="text-sm text-blue-800"><strong>Rechazada:</strong> Deberás indicar un motivo. El usuario podrá volver a postularse después.</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                  <p className="text-sm text-blue-800"><strong>Finalizada:</strong> Una vez completado el proceso, la mascota se marcará como <strong>Adoptada</strong>.</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de Postulaciones */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Lista de Postulaciones</h2>
          <Badge variant="outline" className="text-gray-500 font-normal">
            {petCount} Mascotas registradas
          </Badge>
        </div>
        <AdoptionApplicationsClient />
      </div>
    </div>
  );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Este archivo orquesta la vista del panel de adopción para los albergues.
 * Proporciona un resumen ejecutivo del estado de las postulaciones y una tabla
 * detallada para la gestión operativa.
 *
 * Lógica Clave:
 * - Validación de Cascada: Verifica autenticación, rol SHELTER y finalmente
 *   el estado de verificación del albergue antes de mostrar datos sensibles.
 * - SSR Stats: Las estadísticas se agrupan en el servidor mediante Prisma.groupBy
 *   para garantizar que el usuario vea datos actualizados al cargar la página.
 * - UI Consistente: Utiliza componentes estandarizados de la aplicación como 
 *   Card y Badge para mantener la coherencia visual con el panel de vendedores.
 *
 * Dependencias Externas:
 * - Prisma Client: Para la agregación de estadísticas y conteo de mascotas.
 * - NextAuth: Para la protección de la ruta y validación de sesión.
 * - AdoptionApplicationsClient: Componente interactivo para la gestión de la tabla.
 *
 */
