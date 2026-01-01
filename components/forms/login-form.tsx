'use client';

/**
 * Componente: Formulario de Login
 * Descripción: Proporciona la interfaz y la lógica para que los usuarios inicien sesión.
 * Requiere: -
 * Implementa: Interacción con NextAuth para la autenticación de credenciales.
 */
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from 'next/link';
import { loginSchema, LoginInput } from "@/lib/validations/user.schema";
import { PawPrint } from 'lucide-react';

export default function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Obtener URL de retorno (si el usuario fue redirigido a login)
    const callbackUrl = searchParams.get('callbackUrl') || '/adopciones';

    // Estados del formulario
    const [formData, setFormData] = useState<LoginInput>({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [loginError, setLoginError] = useState('');

    /**
     * Manejo de cambios en los inputs del formulario
     */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Limpiar errores al editar
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }

        // Limpiar error general al editar
        if (loginError) {
            setLoginError('');
        }
    };

    /**
     * Se maneja el envío del formulario de login
     * 
     *  Flujo:
     * 1. Validar datos con Zod
     * 2. Llamar a signIn() de NextAuth
     * 3. NextAuth valida contar el backend (auth-options.ts)
     * 4. Si hay éxito: Redirige según rol.
     * 5. Si hay error: Muestra el mensaje apropiado
     */

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setLoginError('');
        setErrors({});

        try {
            //  1. Validar datos en el cliente de Zod
            const validatedData = loginSchema.parse(formData);

            //  2. Intentar autenticación con NextAuth
            const result = await signIn('credentials', {
                email: validatedData.email,
                password: validatedData.password,
                redirect: false,
            });

            //  3. Verificar resultado de la autenticación
            if (result?.error) {
                // Autenticación fallida
                setLoginError(result.error);
                return;
            }

            if (result?.ok) {
                //  4️. Autenticación exitosa
                // NextAuth ya guarda la sesión automáticamente
                // Redirigir a la URL solicitada o al dashboard
                router.push(callbackUrl);
                router.refresh(); // Refrescar para actualizar la sesión en el servidor
            }
        } catch (error) {
            // Manejar errores de validación de Zod
            if (error && typeof error === 'object' && 'errors' in error) {
                const zodError = error as { errors: Array<{ path: (string | number)[]; message: string }> };
                const fieldErrors: Record<string, string> = {};
                zodError.errors.forEach((err) => {
                    const field = err.path[0];
                    if (typeof field === 'string') {
                        fieldErrors[field] = err.message;
                    }
                });
                setErrors(fieldErrors);
            } else {
                setLoginError('Error inesperado. Intenta de nuevo')
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <PawPrint className="w-12 h-12 text-purple-900" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Iniciar sesión</h1>
                <p className="text-gray-600 mt-2">Accede a tu cuenta</p>
            </div>

            {/* Error general de login */}
            {loginError && (
                <div
                    className="bg-red-50 border border-red-200 rounded-lg p-4"
                    role="alert"
                    aria-live="polite"
                >
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3 flex-1">
                            <p className="text-sm font-medium text-red-800">
                                {loginError === 'CredentialsSignin' || loginError === 'Usuario no encontrado' || loginError === 'Contraseña incorrecta'
                                    ? 'Email o contraseña incorrectos'
                                    : loginError}
                            </p>
                            {/* Sugerencia de recuperación de contraseña - Solo si NO es cuenta bloqueada */}
                            {!loginError.includes('Cuenta bloqueada') && (
                                <p className="mt-2 text-sm text-red-700">
                                    ¿Olvidaste tu contraseña?{' '}
                                    <Link
                                        href="/forgot-password"
                                        className="font-semibold underline hover:text-red-900"
                                    >
                                        Recupérala aquí
                                    </Link>
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Campo: email */}
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Correo electrónico</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required autoComplete="email"
                    aria-required="true"
                    aria-invalid={errors.email ? 'true' : 'false'}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    className={`text-black w-full px-4 py-2 border rounded-lg focus: ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                    placeholder="tu@email.com"
                />
                {errors.email && (
                    <p className="text-red-500 text-sm mt-1" id="email-error" role="alert">
                        {errors.email}
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
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        autoComplete="current-password"
                        aria-required="true"
                        aria-invalid={errors.password ? 'true' : 'false'}
                        aria-describedby={errors.password ? 'password-error' : undefined}
                        className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${errors.password ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="Tu contraseña"
                    />
                    {!loginError?.includes('Cuenta bloqueada') && (
                        <Link
                            href="/forgot-password"
                            className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                        >
                            ¿Olvidaste tu contraseña?
                        </Link>
                    )}
                    {errors.password && (
                        <p className="text-red-500 text-sm mt-1" id="password-error" role="alert">
                            {errors.password}
                        </p>
                    )}
                </div>

                {/* Botón de envío */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-purple-600 text-white py-3 mt-3 mb-5 rounded-lg font-semibold hover:bg-purple-700 focus:ring-4 focus:ring-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isLoading ? (
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
                <div className="text-center">
                    <Link
                        href="/register"
                        className="text-purple-600 hover:text-purple-700 font-semibold hover:underline"
                    >
                        Regístrate gratis
                    </Link>
                </div>
            </div>
        </form>
    )
};

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Este componente es un formulario de cliente ('use client') que maneja el
 * proceso de inicio de sesión. Integra la validación de datos del lado del
 * cliente con Zod y se comunica con NextAuth.js para realizar la
 * autenticación de credenciales.
 *
 * Lógica Clave:
 * - 'Validación con Zod en el Cliente': Antes de intentar el inicio de
 *   sesión, los datos del formulario se validan contra el 'loginSchema'.
 *   Esto proporciona una retroalimentación rápida al usuario sobre errores
 *   de formato (ej: email inválido) sin necesidad de una solicitud al
 *   servidor.
 * - 'Integración con NextAuth.js': La función 'signIn' de 'next-auth/react'
 *   se utiliza para iniciar el flujo de autenticación.
 *   - 'redirect: false': Esta opción es crucial. Evita que NextAuth
 *     redirija automáticamente, permitiendo al componente manejar el
 *     resultado de la autenticación (éxito o error) en el cliente.
 * - 'Manejo de Errores':
 *   - Los errores de validación de Zod se capturan y se muestran junto a
 *     los campos correspondientes.
 *   - Los errores de autenticación devueltos por NextAuth (ej:
 *     'CredentialsSignin') se capturan en 'result.error' y se muestran
 *     en un mensaje de error general. Por seguridad, los mensajes
 *     específicos como "Usuario no encontrado" se mapean a un error
 *     genérico de "Email o contraseña incorrectos".
 * - 'Manejo de Redirección (callbackUrl)': El componente utiliza el hook
 *   'useSearchParams' para leer el 'callbackUrl' de la URL. Esto permite
 *   redirigir al usuario a la página que intentaba visitar antes de ser
 *   enviado al login, mejorando la experiencia de usuario.
 *
 * Dependencias Externas:
 * - 'next-auth/react': Principalmente la función 'signIn'.
 * - 'next/navigation': Para 'useRouter' y 'useSearchParams'.
 * - 'zod': Para la validación del esquema de login.
 *
 */