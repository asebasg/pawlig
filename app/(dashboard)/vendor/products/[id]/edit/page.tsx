import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/utils/db";
import { UserRole } from "@prisma/client";
import ProductForm from "@/components/forms/product-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface PageProps {
    params: {
        id: string;
    };
}

export async function generateMetadata({ params }: PageProps) {
    const product = await prisma.product.findUnique({
        where: { id: params.id },
        select: { name: true },
    });

    return {
        title: product ? `Editar ${product.name}` : "Editar Producto",
        description: "Actualiza la información de tu producto",
    };
}

export default async function EditProductPage({ params }: PageProps) {

    const session = await getServerSession(authOptions)
    // Verificar autenticación, rol y verificación de rol
    if (!session || !session.user) {
        redirect("/login?callbackUrl=/vendor/products");
    }

    if (session.user.role !== UserRole.VENDOR) {
        redirect("/unauthorized?reason=vendor_only");
    }

    // Obtener id de VENDOR
    const vendorId = session.user.vendorId as string;
    const vendor = await prisma.vendor.findUnique({
        where: { id: vendorId as string },
        select: { id: true, verified: true },
    });

    if (!vendor?.verified) {
        redirect("/unauthorized?reason=vendor_not_verified");
    }

    //  2. Obtener producto
    const product = await prisma.product.findUnique({
        where: { id: params.id },
        select: {
            id: true,
            name: true,
            price: true,
            stock: true,
            category: true,
            description: true,
            images: true,
            vendorId: true,
        },
    });

    // Validaciones de propiedad
    if (!product) {
        notFound();
    }

    if (product.vendorId !== vendor.id) {
        redirect("/unauthorized?reason=wrong_product");
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/vendor/products"
                        className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-4"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Volver a Mis Productos
                    </Link>
                    <div className="text-center">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                            Editar {product.name}
                        </h1>
                        <p className="mt-2 text-sm sm:text-base text-gray-600">
                            Actualiza la información de tu producto. Los campos marcados con{" "}
                            <span className="text-red-500">*</span> son obligatorios.
                        </p>
                    </div>
                </div>

                {/* Formulario Pre-cargado */}
                <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 md:p-8">
                    <ProductForm
                        mode="edit"
                        initialData={{
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            stock: product.stock,
                            category: product.category,
                            description: product.description ?? undefined,
                            images: product.images,
                        }}
                        vendorId={vendor.id}
                    />
                </div>
            </div>
        </div>
    );
}