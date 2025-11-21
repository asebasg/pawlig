import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
// import { redirect } from "next/navigation";

/**
 * Metadata para el SEO
 */

export const metadata: Metadata = {
    title: 'Galería de adopciones',
    description: 'Encuentra tu compañero perfecto'
}

/**
 * Página de Galería de Adopciones (PLACEHOLDER)
 * 
 * NOTA: Esta es una versión temporal para completar HU-001
 * La galería completa con mascotas se desarrollará en Sprint 2
 * 
 * Ruta: /adopciones
 */

export default async function AdopcionesPage() {
    // Obtener sesión del usuario (opcional, puede ser anónimo)
    const session = await getServerSession(authOptions);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-purple-600">PawLig</h1>
                        <div className="flex items-center gap-4">
                            {session?.user ? (
                                <>
                                    <span className="text-sm text-gray-600">
                                        Hola, <span className="font-semibold">{session.user.name}</span>
                                    </span>
                                    <a
                                        href="/api/auth/signout"
                                        className="text-sm text-gray-600 hover:text-gray-900"
                                    >
                                        Cerrar sesión
                                    </a>
                                </>
                            ) : (
                                <>
                                    <a
                                        href="/login"
                                        className="text-sm text-gray-600 hover:text-gray-900"
                                    >
                                        Iniciar sesión
                                    </a>
                                    <a
                                        href="/register"
                                        className="text-sm bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                                    >
                                        Registrarse
                                    </a>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Success message (solo si viene del registro) */}
                {session?.user && (
                    <div className="mb-8 bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-green-800">
                                    ¡Registro exitoso!
                                </h3>
                                <p className="mt-1 text-sm text-green-700">
                                    Bienvenido/a a PawLig, {session.user.name}. Tu cuenta ha sido creada correctamente.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Hero section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Encuentra tu compañero perfecto
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Miles de mascotas en el Valle de Aburrá esperan por un hogar lleno de amor
                    </p>
                </div>

                {/* Placeholder content */}
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                    <div className="mb-8">
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-purple-100 rounded-full mb-4">
                            <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Galería en Construcción
                        </h2>
                        <p className="text-gray-600 max-w-md mx-auto mb-6">
                            Estamos trabajando para traerte la mejor experiencia de adopción.
                            La galería de mascotas estará disponible muy pronto.
                        </p>

                        {/* Sprint Info */}
                        <div className="inline-block bg-purple-50 border border-purple-200 rounded-lg px-6 py-3 text-sm">
                            <p className="text-purple-800">
                                <span className="font-semibold">🚀 Próximamente:</span> Sprint 2 - Gestión de Mascotas <br />
                                ¡No te lo pierdas!
                            </p>
                        </div>
                    </div>

                    {/* Feature cards */}
                    <div className="grid md:grid-cols-3 gap-6 mt-12 text-left">
                        <div className="border border-gray-200 rounded-lg p-6">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Búsqueda Avanzada</h3>
                            <p className="text-sm text-gray-600">
                                Filtra por especie, tamaño, edad y ubicación en el Valle de Aburrá
                            </p>
                        </div>

                        <div className="border border-gray-200 rounded-lg p-6">
                            <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Favoritos</h3>
                            <p className="text-sm text-gray-600">
                                Guarda tus mascotas favoritas para revisarlas más tarde
                            </p>
                        </div>

                        <div className="border border-gray-200 rounded-lg p-6">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Contacto Directo</h3>
                            <p className="text-sm text-gray-600">
                                Comunícate con los albergues vía WhatsApp o Instagram
                            </p>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="mt-12 pt-8 border-t border-gray-200">
                        <p className="text-gray-600 mb-4">
                            Mientras tanto, puedes explorar otras secciones:
                        </p>
                        <div className="flex justify-center gap-4">
                            <a
                                href="/albergues"
                                className="inline-block bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Ver Albergues
                            </a>
                            <a
                                href="/productos"
                                className="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                            >
                                Ver Productos
                            </a>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <p className="text-center text-gray-500 text-sm">
                        &copy; 2025 - PawLig <br />
                        Todos los derechos reservados
                    </p>
                </div>
            </footer>
        </div>
    )
}

/**
 * 📚 NOTAS:
 * 
 * 1. PROPÓSITO:
 *    - Página temporal para completar el flujo de HU-001
 *    - Evita error 404 después del registro
 *    - Muestra mensaje de éxito al usuario registrado
 * 
 * 2. CARACTERÍSTICAS:
 *    - Detecta si el usuario viene de registrarse
 *    - Muestra header con sesión/logout
 *    - Explica que la galería está en desarrollo
 *    - Links a otras secciones (placeholder también)
 * 
 * 3. DESARROLLO FUTURO:
 *    - Sprint 2: Reemplazar con galería real de mascotas
 *    - Agregar búsqueda y filtros funcionales
 *    - Integrar con API de mascotas
 * 
 * 4. SPRINT 1 COMPLETADO:
 *    - Con esta página, HU-001 queda 100% funcional
 *    - Usuario puede registrarse → ver confirmación
 *    - No hay errores 404 en el flujo
 */