import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/utils/db";
import { UserRole } from "@prisma/client";
import ProductForm from "@/components/forms/product-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Nuevo Producto - Panel de Vendedor",
    description: "Crea y gestiona un nuevo producto para tu catálogo.",
};

export default async function NewProductPage() {
    //  1. Verificar autenticación
    const session = await getServerSession(authOptions);

    // No esta autenticado
    if (!session?.user) {
        redirect("/login?callbackUrl=/vendor/products/new");
    }

    // No tiene el rol VENDOR
    if (session.user.role !== UserRole.VENDOR) {
        redirect("/unauthorized?reason=vendor_only");
    }

    // Obtener ID del vendor y verificar estado
    const vendorId = session.user.vendorId as string;

    // Obtener datos del vendor para verificar estado de verificación
    const vendor = await prisma.vendor.findUnique({
        where: { id: vendorId as string },
        select: { verified: true },
    });

    // Usuario con rol VENDOR no esta verificado
    if (!vendor?.verified) {
        // Tiene cuenta de vendedor pero aún no ha sido aprobada por admin
        redirect("/unauthorized?reason=vendor_not_verified");
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/vendor/products"
                        className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Volver a Mis Productos
                    </Link>
                    <div className="text-center">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Publicar Nuevo Producto</h1>
                        <p className="mt-2 text-sm sm:text-base text-gray-600">
                            Completa el formulario para registrar un producto en tu inventario. Los campos marcados con{" "}
                            <span className="text-red-500">*</span> son obligatorios.
                        </p>
                        {/* Tips de buenas prácticas */}
                    </div>
                    <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="font-semibold text-blue-900 mb-2">💡 Tips para una buena publicación</h3>
                        <ul className="text-sm text-blue-800 space-y-1">
                            <li>• Usa fotos claras y con fondo neutro</li>
                            <li>• Describe detalladamente las características técnicas</li>
                            <li>• Mantén el stock actualizado para evitar cancelaciones</li>
                            <li>• Responde rápido a las dudas de los clientes</li>
                            <li>• Asegúrate de que el precio sea competitivo</li>
                        </ul>
                    </div>
                </div>

                {/* Formulario */}
                <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 md:p-8">
                    <ProductForm mode="create" />
                </div>
            </div>
        </div>
    );
}