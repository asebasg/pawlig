import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { UserRole } from "@prisma/client";
import UsersManagementClient from "./UsersManagementClient";

export default async function AdminUsersPage() {
    //  Validacion de autenticacion y autorizacion
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect('/login?callbackUrl=/admin/users')
    }

    // Solo ADMIN puede acceder
    if (session.user.role !== UserRole.ADMIN) {
        redirect('/unauthorized?reason=admin_only')
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-gray-900">
                    Gestión de usuarios
                </h1>
                <p className="mt-2 text-gray-600">
                    Administra usuarios, roles y bloqueos del sistema
                </p>
            </div>

            <UsersManagementClient adminUser={session.user} />
        </div>
    );
}

export const metadata = {
    title: "Gestión de usuarios del sistema",
    description: "Panel de administración general para usuarios del sistema"
}