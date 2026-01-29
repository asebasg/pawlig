'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from 'next/link';
import { loginSchema, LoginInput } from "@/lib/validations/user.schema";
import { PawPrint } from 'lucide-react';

/**
 * Descripción: Formulario de inicio de sesión con validación Zod e integración con NextAuth.
 * Requiere: Configuración de proveedores en NextAuth y esquemas de validación.
 * Implementa: Autenticación de usuarios.
 */

export default function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Obtener URL de retorno
    const callbackUrl = searchParams.get('callbackUrl') || '/adopciones';

    // React Hook Form
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    /**
     * Manejo del envío del formulario
     */
    const onSubmit = async (data: LoginInput) => {
        try {
            // Intentar autenticación con NextAuth
            const result = await signIn('credentials', {
                email: data.email,
                password: data.password,
                redirect: false,
            });

            if (result?.error) {
                // Mensaje de error amigable
                let errorMessage = 'Email o contraseña incorrectos';
                if (result.error.includes('Cuenta bloqueada')) {
                    errorMessage = result.error; // Mostrar mensaje específico de bloqueo
                }
                toast.error(errorMessage);
                return;
            }

            if (result?.ok) {
                const session = await (await import("next-auth/react")).getSession();
                const userName = session?.user?.name || 'Usuario';
                toast.success(`¡Bienvenido de vuelta, ${userName}!`);
                // Redirigir
                router.push(callbackUrl);
                router.refresh();
            }
        } catch (error) {
            console.error(error);
            toast.error("Error inesperado al iniciar sesión");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-md mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <PawPrint className="w-12 h-12 text-purple-900" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Iniciar sesión</h1>
                <p className="text-gray-600 mt-2">Accede a tu cuenta</p>
            </div>

            {/* Campo: email */}
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Correo electrónico</label>
                <input
                    {...register('email')}
                    type="email"
                    id="email"
                    autoComplete="email"
                    className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="tu@email.com"
                />
                {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.email.message}
                    </p>
                )}
            </div>

            {/* Campo: Contraseña */}
            <div>
                <div className="block justify-between items-center mb-2">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Contraseña
                    </label>
                    <input
                        {...register('password')}
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Tu contraseña"
                    />
                    <div className="flex justify-end mt-1">
                        <Link
                            href="https://github.com/asebasg/pawlig" // TODO: Cambiar por la URL de la página de recuperación de contraseña
                            className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                        >
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>
                    {errors.password && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                {/* Botón de envío */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-purple-600 text-white py-3 mt-3 mb-5 rounded-lg font-semibold hover:bg-purple-700 focus:ring-4 focus:ring-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isSubmitting ? (
                        <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Iniciando sesión...
                        </span>
                    ) : (
                        'Iniciar sesión'
                    )}
                </button>

                {/* Divider */}
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">¿No tienes cuenta?</span>
                    </div>
                </div>

                {/* Link a registro */}
                <div className="text-center mt-4">
                    <Link
                        href="/register"
                        className="text-purple-600 hover:text-purple-700 font-semibold hover:underline"
                    >
                        Regístrate gratis
                    </Link>
                </div>
            </div>
        </form>
    );
};

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Este componente maneja la autenticación de usuarios mediante el flujo de
 * credenciales de NextAuth, asegurando una experiencia fluida y segura.
 *
 * Lógica Clave:
 * - signIn('credentials'): Orquesta la validación contra el backend a través de NextAuth.
 * - callbackUrl: Soporta la redirección inteligente tras el login exitoso.
 * - Validación Zod: Asegura que los datos tengan el formato correcto antes de enviarlos.
 *
 * Dependencias Externas:
 * - next-auth: Para la gestión de sesiones y autenticación.
 * - react-hook-form: Para el manejo eficiente del estado del formulario.
 * - sonner: Para notificaciones de éxito o error.
 *
 */