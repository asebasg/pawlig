import { Metadata } from 'next';
import React from 'react';
import { ArrowLeft, Rocket, History, Sparkles, AlertCircle, Wrench, Bug, Zap, Calendar, GitPullRequest } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Notas de Lanzamiento (Changelog) - PawLig',
    description: 'Historial de actualizaciones, mejoras y nuevas funcionalidades integradas en la plataforma PawLig.',
};

export default function ChangelogPage() {
    const lastUpdate = "16 de enero de 2026";

    const versions = [
        {
            version: 'v1.3.0',
            date: '16 de Enero, 2026',
            title: 'Transparencia y Legalidad',
            description: 'Implementación de páginas informativas esenciales para mejorar la comunicación y cumplimiento legal.',
            updates: [
                { type: 'added', title: 'Páginas Legales', description: 'Nuevas secciones de Términos y Condiciones y Política de Privacidad.', icon: <Sparkles size={18} className="text-amber-500" /> },
                { type: 'added', title: 'Centro de Ayuda (FAQ)', description: 'Preguntas frecuentes para resolver dudas rápidas de los usuarios.', icon: <Zap size={18} className="text-blue-500" /> },
                { type: 'added', title: 'Registro de Cambios Público', description: 'Esta misma página ahora permite a los usuarios seguir la evolución del proyecto.', icon: <GitPullRequest size={18} className="text-pink-500" /> }
            ]
        },
        {
            version: 'v1.2.0',
            date: '15 de Enero, 2026',
            title: 'Marketplace PawLig',
            description: 'Lanzamiento del módulo de productos y servicios veterinarios para vendedores.',
            updates: [
                { type: 'added', title: 'Gestión de Productos', description: 'Los vendedores ahora pueden publicar y gestionar su inventario desde un panel dedicado.', icon: <Rocket size={18} className="text-primary" /> },
                { type: 'improved', title: 'Galería de Productos', description: 'Filtros avanzados por categoría y precio para encontrar lo que tu mascota necesita.', icon: <Wrench size={18} className="text-slate-500" /> },
                { type: 'added', title: 'Métricas para Vendedores', description: 'Visualización de estadísticas de ventas y stock en tiempo real.', icon: <Sparkles size={18} className="text-amber-500" /> }
            ]
        },
        {
            version: 'v1.1.0',
            date: '10 de Enero, 2026',
            title: 'Optimización de Interfaz',
            description: 'Mejoras visuales y de rendimiento en los componentes principales del sistema.',
            updates: [
                { type: 'improved', title: 'Estandarización de UI', description: 'Refactorización de botones y tarjetas para una experiencia más fluida.', icon: <Wrench size={18} className="text-slate-500" /> },
                { type: 'improved', title: 'Navegación Móvil', description: 'Ajustes en el menú móvil para mejorar la accesibilidad en dispositivos pequeños.', icon: <Zap size={18} className="text-blue-500" /> },
                { type: 'fixed', title: 'Plantillas de Reportes', description: 'Se optimizaron los flujos de reporte de errores para el equipo técnico.', icon: <Bug size={18} className="text-red-500" /> }
            ]
        },
        {
            version: 'v1.0.0',
            date: '05 de Enero, 2026',
            title: 'Lanzamiento y Gran Refactorización',
            description: 'Migración completa a Tailwind CSS y nueva arquitectura de componentes.',
            updates: [
                { type: 'added', title: 'Nueva Arquitectura', description: 'Reestructuración total del proyecto para mayor escalabilidad.', icon: <Rocket size={18} className="text-primary" /> },
                { type: 'improved', title: 'Diseño con Tailwind', description: 'Migración completa del sistema de estilos para una carga más rápida.', icon: <Sparkles size={18} className="text-amber-500" /> },
                { type: 'added', title: 'Sistema de Adopción Base', description: 'Funcionalidad núcleo para la publicación y solicitud de mascotas.', icon: <Rocket size={18} className="text-primary" /> }
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
