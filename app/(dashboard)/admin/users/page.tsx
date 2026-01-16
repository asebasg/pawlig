import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { UserRole } from "@prisma/client";
import UsersManagementClient from "./UsersManagementClient";
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
    title: "Gestión de usuarios del sistema",
    description: "Panel de administración general para usuarios del sistema"
}
export default async function AdminUsersPage() {
    const session = await getServerSession(authOptions);
    // Verificar autenticación, rol y verificación de rol
    if (!session || !session.user) {
        redirect("/login?callbackUrl=/admin/users");
    }

    if (session.user.role !== UserRole.ADMIN) {
        redirect("/unauthorized?reason=admin_only");
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen py-6">
            <Link href="/admin" className="inline-flex items-center gap-2 mb-4 text-purple-600 hover:text-purple-700 text-base font-semibold">
                <ArrowLeft className="w-4 h-4" />
                Volver al Dashboard
            </Link>
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-gray-900">
                    Gestión de usuarios
                </h1>
                <p className="mt-2 text-gray-600">
                    Administra usuarios, roles y bloqueos del sistema
                </p>
            </div>

            <UsersManagementClient />
        </div>
    );
}
