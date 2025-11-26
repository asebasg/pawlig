"use client";

import Link from "next/link";
import { ShieldAlert, Home, ArrowLeft } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function UnauthorizedPage() {
    const searchParams = useSearchParams();
    const reason = searchParams.get('reason') || "unknown";

    const messages: Record<string, { title: string; description: string; suggestion: string }> = {
        // Mensaje para usuarios bloqueados
        account_blocked: {
            title: "Cuenta bloqueada",
            description: "Tu cuenta ha sido bloqueada por un administrador. No puedes acceder a la plataforma en este momento.",
            suggestion: "Revisa tu correo electrónico para más detalles sobre el motivo del bloqueo. Si crees que es un error, contacta con soporte."
        },
        // Mensaje para solicitud de albergue
        adopters_vendors_only: {
            title: "Acceso solo para adoptantes y vendedores",
            description: "Solo usuarios con rol de adoptante o vendedor pueden solicitar cuentas de albergue.",
            suggestion: "Si ya eres albergue o administrador, no necesitas solicitar una cuenta nueva. Si eres adoptante o vendedor, asegúrate de haber iniciado sesión."
        },
        // Mensaje para pagina de administradores
        admin_only: {
            title: "Acceso solo para administradores",
            description: "Esta sección está restringida exclusivamente para administradores del sistema.",
            suggestion: "Si crees que deberías tener acceso, contacta con el equipo de administración."
        },
        // Mensaje para pagina de albergues
        shelter_only: {
            title: "Acceso solo para albergues",
            description: "Esta sección está restringida para albergues verificados.",
            suggestion: "Si representas un albergue, puedes solicitar una cuenta desde tu perfil de usuario."
        },
        // Mensaje para pagina de vendedores
        vendor_only: {
            title: "Acceso solo para vendedores",
            description: "Esta sección está restringida para vendedores verificados.",
            suggestion: "Si eres un proveedor de productos, puedes solicitar una cuenta de vendedor."
        },
        // Acceso general denegado
        unknown: {
            title: "Acceso denegado",
            description: "No tienes los permisos necesarios para acceder a este recurso.",
            suggestion: "Verifica que hayas iniciado sesión con la cuenta correcta."
        }
    };

    const message = messages[reason] || messages.unknown;

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="bg-red-100 rounded-full p-4">
                            <ShieldAlert className="w-12 h-12 text-red-600" />
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl font-bold text-gray-900 mb-3">
                        {message.title}
                    </h1>

                    {/* Description */}
                    <p className="text-gray-600 mb-4">
                        {message.description}
                    </p>

                    {/* Suggestion */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                        <p className="text-sm text-yellow-800">
                            <strong>Sugerencia:</strong> {message.suggestion}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                        <Link
                            href="/"
                            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition"
                        >
                            <Home className="w-5 h-5" />
                            Volver al inicio
                        </Link>

                        <button
                            onClick={() => window.history.back()}
                            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Volver atrás
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-sm text-gray-500 mt-6">
                    ¿Necesitas ayuda?{" "}
                    <Link href="/contacto" className="text-purple-600 hover:underline">
                        Contacta con soporte
                    </Link>
                </p>
            </div>
        </div>
    );
}

/**
 * 📚 CAMBIOS IMPLEMENTADOS:
 * 
 * 1. Mensaje para cuenta bloqueada
 *    - Razón: account_blocked
 *    - Descripción clara del bloqueo
 *    - Sugerencia de revisar email y contactar soporte
 * 
 * 2. Mensaje para solicitud de albergue
 *    - Razón: adopters_vendors_only
 *    - Explicación de quién puede solicitar
 *    - Sugerencia de verificar sesión
 * 
 * 3. Mensajes por razón:
 *    - account_blocked: Usuario bloqueado
 *    - adopters_vendors_only: Solo ADOPTER/VENDOR
 *    - admin_only: Solo ADMIN
 *    - shelter_only: Solo SHELTER
 *    - vendor_only: Solo VENDOR
 *    - unknown: Error genérico
 * 
 * 4. UX mejorada:
 *    - Iconos descriptivos (ShieldAlert)
 *    - Colores apropiados (rojo = error, amarillo = sugerencia)
 *    - Acciones claras (volver al inicio, volver atrás)
 *    - Enlace a soporte visible
 * 
 * 5. Trazabilidad:
 *    - Mensaje de bloqueo ✅
 *    - Mensaje de restricción ✅
 *    - RNF-003: Usabilidad (mensajes claros) ✅
 */