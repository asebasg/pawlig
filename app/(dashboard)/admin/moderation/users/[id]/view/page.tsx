import { notFound } from "next/navigation";
import { getUserById } from "@/lib/services/user.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User as PrismaUser, SystemAuditLog } from "@prisma/client";
import { AuditHistoryCard } from "@/components/admin/AuditHistoryCard";
import UserViewClient from "@/components/admin/UserViewClient";
import UserActionsClient from "@/components/admin/UserActionsClient";
import Link from "next/link";
import { User, Mail, Phone, MapPin, Calendar, CheckCircle, XCircle, ArrowLeft, CalendarCheck2 } from "lucide-react";

/**
 * Descripción: Página del servidor para mostrar la información detallada de un usuario y gestionar sus roles/estado.
 * Requiere: Identificador de usuario en los parámetros de ruta (`id`).
 * Implementa: Vista de detalle de usuario e historial de auditoría.
 */
type UserWithAudit = PrismaUser & {
  auditRecords: SystemAuditLog[];
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
        href="/admin/moderation/users"
        className="inline-flex items-center gap-2 py-4 mb-2 rounded-lg text-black hover:text-gray-700 transition-colors font-semibold"
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
                  value={user.isActive ? "Activo" : `Bloqueado desde el ${formatDate(user.blockedAt)}`}
                  valueColor={user.isActive ? "text-green-600" : "text-red-600"} />
                {!user.isActive && user.blockReason && <p className="text-xs text-gray-500 mt-1 ml-6"><strong>Razón:</strong> {user.blockReason}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Solo mostrar gestión de roles si el usuario no es ADMIN */}
          <div className="flex flex-col md:flex-row gap-6 w-full [&>*]:flex-1">
            {user.role !== "ADMIN" && <UserActionsClient user={{ id: user.id, name: user.name, email: user.email, isActive: user.isActive, role: user.role }} />}
            {user.role !== "ADMIN" && <UserViewClient user={{ id: user.id, name: user.name, role: user.role }} />}
          </div>
        </div>

        {/* Columna Derecha: Auditoría */}
        <div className="lg:col-span-1">
          <AuditHistoryCard auditRecords={user.auditRecords} />
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
      <p className={`ml-6 ${valueColor}`}>{value}</p>
    </div>
  );
}

export const metadata = {
  title: "Detalles del Usuario",
};

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Server Component principal para la página de vista de detalle de un usuario.
 *
 * Lógica Clave:
 * - Obtención de Datos del Servidor ('fetch'): Llama a 'getUserById' para obtener
 *   los datos y su historial de auditoría de forma asíncrona.
 * - Manejo de 404: Si el usuario no existe, invoca 'notFound()'.
 * - Control de Acceso UI: No permite que un admin modifique a otro admin.
 *
 * Dependencias Externas:
 * - Next.js (notFound, Link, metadata).
 * - Lucide React para iconos.
 *
 */

