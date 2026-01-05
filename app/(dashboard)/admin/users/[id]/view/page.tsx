import { notFound } from "next/navigation";
import { getUserById } from "@/lib/services/user.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User as PrismaUser, AuditAction } from "@prisma/client";
import { AuditHistoryCard } from "@/components/admin/AuditHistoryCard";
import UserViewClient from "@/components/admin/UserViewClient";
import Link from "next/link";
import { User, Mail, Phone, MapPin, Calendar, CheckCircle, XCircle, ArrowLeft, CalendarCheck2 } from "lucide-react";

type UserWithAudit = PrismaUser & {
  auditRecords: ({
    performedBy: {
      name: string;
      email: string;
    };
  } & {
    id: string;
    action: AuditAction;
    reason: string;
    oldValue: string | null;
    newValue: string | null;
    adminId: string;
    userId: string;
    ipAddress: string | null;
    userAgent: string | null;
    createdAt: Date;
  })[];
};

export default async function UserViewPage({ params }: { params: { id: string } }) {
  const user = await getUserById(params.id) as UserWithAudit | null;

  if (!user) {
    notFound();
    return null;
  }

  const formatDate = (date: Date | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <Link
        href="/admin/users"
        className="inline-flex items-center gap-2 py-4 mb-2 rounded-lg text-black hover:text-gray-700 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Regresar al Panel de Gestión
      </Link>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
        <p className="text-gray-600">{user.email}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Columna Izquierda: Información y Gestión */}
        <div className="lg:col-span-2 space-y-6">
          <Card accentColor="teal">
            <CardHeader>
              <CardTitle>
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  <span>Información Personal</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <InfoItem icon={Mail} label="Email" value={user.email} />
              <InfoItem icon={Phone} label="Teléfono" value={user.phone} />
              <InfoItem icon={MapPin} label="Municipio" value={`${user.municipality}, ANTIOQUIA`} />
              <InfoItem icon={Calendar} label="Fecha de Nacimiento" value={formatDate(user.birthDate)} />
              <InfoItem icon={CalendarCheck2} label="Fecha de Registro" value={formatDate(user.createdAt)} />
              <div className="sm:col-span-2">
                <InfoItem icon={user.isActive ? CheckCircle : XCircle} label="Estado"
                  value={user.isActive ? "Activo" : 'Bloqueado desde ${formatDate(user.blockedAt)}'}
                  valueColor={user.isActive ? "text-green-600" : "text-red-600"} />
                {!user.isActive && user.blockReason && <p className="text-xs text-gray-500 mt-1 ml-6">Razón: {user.blockReason}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Solo mostrar gestión de roles si el usuario no es ADMIN */}
          {user.role !== 'ADMIN' && <UserViewClient user={{ id: user.id, name: user.name, role: user.role }} />}
        </div>

        {/* Columna Derecha: Auditoría */}
        <div className="lg:col-span-1">
          <AuditHistoryCard auditRecords={user.auditRecords.map(r => ({ ...r, createdAt: new Date(r.createdAt) }))} />
        </div>

      </div>
    </div>
  );
}

// Componente de ayuda para mostrar items de información
function InfoItem({ icon: Icon, label, value, valueColor = "text-gray-800" }: { icon: React.ElementType, label: string, value: string, valueColor?: string }) {
  return (
    <div>
      <div className="flex items-center gap-2 text-gray-500">
        <Icon className="w-4 h-4" />
        <span className="font-semibold">{label}:</span>
      </div>
      <p className={'ml-6 ${valueColor}'}>{value}</p>
    </div>
  );
}

export const metadata = {
  title: 'Detalles del Usuario',
};

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Este es el Server Component principal para la página de vista de detalle
 * de un usuario. Su responsabilidad es obtener los datos del servidor,
 * manejar el estado de "no encontrado" y componer la UI general de la página,
 * delegando la interactividad a componentes de cliente.
 *
 * Lógica Clave:
 * - Obtención de Datos del Servidor ('fetch'): La página es 'async', lo que
 *   le permite llamar directamente a 'getUserById' (que usa la caché de
 *   Next.js) para obtener los datos del usuario antes del renderizado.
 * - Manejo de 404: Si 'getUserById' devuelve 'null', se llama a 'notFound()'
 *   de Next.js. Esto interrumpe el renderizado y muestra la página 404 más
 *   cercana, lo cual es la práctica recomendada.
 * - Estructura de Layout (Grid): La página utiliza un sistema de grid de
 *   Tailwind CSS para crear un layout responsive: una sola columna en móviles
 *   ('grid-cols-1') que se convierte en un layout de 2/3 + 1/3 en pantallas
 *   grandes ('lg:grid-cols-3').
 * - Composición de Componentes: Este componente actúa como un orquestador.
 *   Renderiza los diferentes 'Card', el 'AuditHistoryCard' y el
 *   'UserViewClient', pasándoles los datos necesarios como props.
 * - Renderizado Condicional: La sección de "Gestión de Roles"
 *   ('UserViewClient') solo se renderiza si el rol del usuario que se está
 *   viendo no es   'ADMIN', cumpliendo con la regla de negocio de no permitir
 *   la modificación de otros administradores.
 *
 * Dependencias Externas:
 * - 'next/navigation': Para 'notFound'.
 * - '@/lib/services/user.service': Para obtener los datos del usuario.
 * - Componentes UI: 'Card', 'AuditHistoryCard', 'UserViewClient'.
 * - 'lucide-react': Para los iconos.
 *
 */
