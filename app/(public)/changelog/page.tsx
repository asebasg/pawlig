import { Metadata } from 'next';
import React from 'react';
import { ArrowLeft, Rocket, History, Sparkles, AlertCircle, Wrench, Bug, Zap, Calendar, GitPullRequest } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Notas de Lanzamiento (Changelog) - PawLig',
    description: 'Historial de actualizaciones, mejoras y nuevas funcionalidades integradas en la plataforma PawLig.',
};

export default function ChangelogPage() {
    const lastUpdate = new Date().toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    const versions = [
        {
            version: 'v1.2.0',
            date: '15 de Enero, 2026',
            title: 'Mejoras en la Gestión de Productos',
            description: 'Esta actualización se enfoca en optimizar la experiencia de los vendedores y la búsqueda de productos.',
            updates: [
                { type: 'added', title: 'Filtros Dinámicos', description: 'Implementación de contadores reactivos en las categorías de productos que se ajustan según la búsqueda.', icon: <Sparkles size={18} className="text-amber-500" /> },
                { type: 'improved', title: 'Optimización de Imágenes', description: 'Migración a Next/Image para una carga más rápida y eficiente de las fotografías de mascotas y productos.', icon: <Zap size={18} className="text-blue-500" /> },
                { type: 'fixed', title: 'Error de Hidratación', description: 'Se corrigieron errores de anidamiento HTML en las tarjetas de productos que causaban problemas de renderizado.', icon: <Bug size={18} className="text-red-500" /> }
            ]
        },
        {
            version: 'v1.1.0',
            date: '10 de Enero, 2026',
            title: 'Estandarización de Interfaz',
            description: 'Refactorización visual y técnica de los componentes principales para una experiencia más cohesiva.',
            updates: [
                { type: 'added', title: 'Botón de Favoritos', description: 'Nueva funcionalidad para que adoptantes puedan guardar sus mascotas preferidas directamente desde la galería.', icon: <GitPullRequest size={18} className="text-pink-500" /> },
                { type: 'improved', title: 'Tarjetas de Mascotas', description: 'Rediseño completo de las tarjetas para incluir slots de overlay y footer dinámicos.', icon: <Wrench size={18} className="text-slate-500" /> },
                { type: 'fixed', title: 'Filtros de Favoritos', description: 'Se solucionó un problema donde los filtros no se aplicaban correctamente en la vista de favoritos del usuario.', icon: <AlertCircle size={18} className="text-orange-500" /> }
            ]
        },
        {
            version: 'v1.0.0',
            date: '1 de Enero, 2026',
            title: 'Lanzamiento Oficial',
            description: 'Primera versión estable de PawLig con soporte para adopciones, gestión de albergues y catálogo veterinario.',
            updates: [
                { type: 'added', title: 'Sistema de Adopción', description: 'Flujo completo desde la publicación hasta la solicitud de adopción.', icon: <Rocket size={18} className="text-primary" /> },
                { type: 'added', title: 'Panel de Control', description: 'Interfaz dedicada para albergues, vendedores y administradores.', icon: <Sparkles size={18} className="text-amber-500" /> }
            ]
        }
    ];

    return (
        <main className="container mx-auto px-4 py-16 max-w-5xl">
            {/* Navegación de regreso */}
            <div className="mb-12">
                <Link
                    href="/"
                    className="group inline-flex items-center text-sm font-semibold text-primary hover:opacity-80 transition-all"
                >
                    <ArrowLeft size={18} className="mr-2 transition-transform group-hover:-translate-x-1" />
                    Volver a la plataforma
                </Link>
            </div>

            {/* Cabecera */}
            <div className="flex flex-col md:flex-row md:items-center gap-6 mb-12 pb-8 border-b border-slate-100">
                <div className="p-4 bg-primary/10 rounded-2xl w-fit">
                    <History className="text-primary" size={40} />
                </div>
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">Notas de Lanzamiento</h1>
                    <p className="text-slate-500 font-medium">Sigue la evolución de PawLig: actualizaciones, mejoras y correcciones</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                {/* Navegación Lateral (Versiones) */}
                <aside className="hidden lg:block space-y-4 sticky top-24 h-fit">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Versiones</h3>
                    <nav className="flex flex-col gap-3 text-sm font-medium text-slate-600">
                        {versions.map((v) => (
                            <a
                                key={v.version}
                                href={`#${v.version}`}
                                className="flex items-center gap-2 hover:text-primary transition-colors group"
                            >
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-primary transition-colors" />
                                {v.version}
                            </a>
                        ))}
                    </nav>
                </aside>

                {/* Contenido Principal */}
                <div className="lg:col-span-3 space-y-16">
                    <p className="text-sm text-slate-400 font-medium">Última actualización documentada: {lastUpdate}</p>

                    {versions.map((v) => (
                        <section key={v.version} id={v.version} className="scroll-mt-24">
                            <div className="flex flex-wrap items-baseline gap-4 mb-6">
                                <h2 className="text-3xl font-extrabold text-slate-900">{v.version}</h2>
                                <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full uppercase tracking-wider">
                                    <Calendar size={14} />
                                    {v.date}
                                </span>
                            </div>

                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-slate-800 mb-2">{v.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{v.description}</p>
                            </div>

                            <div className="space-y-4">
                                {v.updates.map((update, idx) => (
                                    <div key={idx} className="group p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md hover:border-primary/20 transition-all">
                                        <div className="flex items-start gap-4">
                                            <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-primary/5 transition-colors">
                                                {update.icon}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 mb-1">{update.title}</h4>
                                                <p className="text-sm text-slate-500 leading-relaxed">{update.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    ))}

                    {/* Footer de la página */}
                    <section id="feedback" className="scroll-mt-24 p-8 bg-slate-900 text-white rounded-3xl shadow-xl">
                        <div className="flex items-center gap-3 mb-6">
                            <Rocket className="text-primary-foreground" size={28} />
                            <h2 className="text-2xl font-bold">Ayúdanos a mejorar</h2>
                        </div>
                        <p className="opacity-80 text-sm mb-6">
                            ¿Tienes alguna sugerencia para la próxima versión o encontraste algo que no funciona como debería? Tu feedback es fundamental para hacer de PawLig la mejor plataforma para nuestras mascotas.
                        </p>
                        <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                            <span className="text-xs font-semibold">dev-team@pawlig.com</span>
                            <Link
                                href="https://github.com/asebasg/pawlig/issues/new/choose"
                                className="flex items-center px-6 py-2 bg-white text-slate-900 text-xs font-bold rounded-lg hover:bg-primary hover:text-yellow-400 transition-all uppercase tracking-widest"
                            >
                                <Sparkles className="mr-2 text-amber-500" size={18} />
                                Enviar Sugerencia
                            </Link>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}
