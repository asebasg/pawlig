"use client";

import { Construction } from "lucide-react";
import { useRouter } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";

export default function UnderConstruction() {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] py-12 px-4 text-center">
            <div className="bg-orange-100 p-6 rounded-full mb-6 relative">
                <div className="absolute inset-0 bg-orange-200 rounded-full animate-ping opacity-20"></div>
                <Construction className="w-16 h-16 text-orange-600 relative z-10" />
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">
                Sitio en Construcción
            </h2>

            <p className="text-lg text-gray-600 max-w-md mx-auto mb-8">
                Estamos construyendo algo increíble para ti y tus mascotas. Esta sección estará disponible muy pronto.
            </p>

            <button
                onClick={() => router.back()}
                className={buttonVariants({ variant: "default" })}
            >
                Regresar
            </button>
        </div>
    );
}
