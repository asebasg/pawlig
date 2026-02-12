import { Metadata } from 'next';
import React from 'react';
import { ArrowLeft, Rocket, History, Sparkles, Wrench, Bug, Zap, Calendar, GitPullRequest, Star, Heart } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
    title: 'Notas de Lanzamiento',
    description: 'Historial de actualizaciones, mejoras y nuevas funcionalidades integradas en la plataforma PawLig.',
};

export default function ChangelogPage() {
    const lastUpdate = "20 de enero de 2026";

    const versions = [
        {
            version: 'v1.4.0',
            date: '20 de Enero, 2026',
            title: 'Inteligencia Artificial Generativa',
            description: 'Integración de IA para potenciar las descripciones de mascotas y productos.',
            color: 'from-pink-500 to-rose-500',
            updates: [
                { type: 'added', title: 'Asistente de Redacción IA', description: 'Refinamiento automático de descripciones para mascotas y productos usando Google Gemini.', icon: <Sparkles size={20} className="text-white" />, bg: "bg-amber-400" },
                { type: 'improved', title: 'Optimización de Perfiles', description: 'Mejora del impacto emocional en perfiles de adopción para aumentar las tasas de éxito.', icon: <Zap size={20} className="text-white" />, bg: "bg-blue-500" },
                { type: 'added', title: 'Copywriting para Marketplace', description: 'Generación de descripciones persuasivas para productos del marketplace.', icon: <Rocket size={20} className="text-white" />, bg: "bg-purple-500" }
            ]
        },
        {
            version: 'v1.3.0',
            date: '16 de Enero, 2026',
            title: 'Transparencia y Legalidad',
            description: 'Implementación de páginas informativas esenciales para mejorar la comunicación y cumplimiento legal.',
            color: 'from-purple-500 to-indigo-500',
            updates: [
                { type: 'added', title: 'Páginas Legales', description: 'Nuevas secciones de Términos y Condiciones y Política de Privacidad.', icon: <Sparkles size={20} className="text-white" />, bg: "bg-amber-400" },
                { type: 'added', title: 'Centro de Ayuda (FAQ)', description: 'Preguntas frecuentes para resolver dudas rápidas de los usuarios.', icon: <Zap size={20} className="text-white" />, bg: "bg-blue-500" },
                { type: 'added', title: 'Registro de Cambios Público', description: 'Esta misma página ahora permite a los usuarios seguir la evolución del proyecto.', icon: <GitPullRequest size={20} className="text-white" />, bg: "bg-pink-500" }
            ]
        },
        {
            version: 'v1.2.0',
            date: '15 de Enero, 2026',
            title: 'Marketplace PawLig',
            description: 'Lanzamiento del módulo de productos y servicios veterinarios para vendedores.',
            color: 'from-blue-500 to-cyan-500',
            updates: [
                { type: 'added', title: 'Gestión de Productos', description: 'Los vendedores ahora pueden publicar y gestionar su inventario desde un panel dedicado.', icon: <Rocket size={20} className="text-white" />, bg: "bg-purple-500" },
                { type: 'improved', title: 'Galería de Productos', description: 'Filtros avanzados por categoría y precio para encontrar lo que tu mascota necesita.', icon: <Wrench size={20} className="text-white" />, bg: "bg-slate-500" },
                { type: 'added', title: 'Métricas para Vendedores', description: 'Visualización de estadísticas de ventas y stock en tiempo real.', icon: <Sparkles size={20} className="text-white" />, bg: "bg-amber-400" }
            ]
        },
        {
            version: 'v1.1.0',
            date: '10 de Enero, 2026',
            title: 'Optimización de Interfaz',
            description: 'Mejoras visuales y de rendimiento en los componentes principales del sistema.',
            color: 'from-teal-400 to-emerald-500',
            updates: [
                { type: 'improved', title: 'Estandarización de UI', description: 'Refactorización de botones y tarjetas para una experiencia más fluida.', icon: <Wrench size={20} className="text-white" />, bg: "bg-slate-500" },
                { type: 'improved', title: 'Navegación Móvil', description: 'Ajustes en el menú móvil para mejorar la accesibilidad en dispositivos pequeños.', icon: <Zap size={20} className="text-white" />, bg: "bg-blue-500" },
                { type: 'fixed', title: 'Plantillas de Reportes', description: 'Se optimizaron los flujos de reporte de errores para el equipo técnico.', icon: <Bug size={20} className="text-white" />, bg: "bg-red-500" }
            ]
        },
        {
            version: 'v1.0.0',
            date: '05 de Enero, 2026',
            title: 'Lanzamiento y Gran Refactorización',
            description: 'Migración completa a Tailwind CSS y nueva arquitectura de componentes.',
            color: 'from-orange-400 to-red-500',
            updates: [
                { type: 'added', title: 'Nueva Arquitectura', description: 'Reestructuración total del proyecto para mayor escalabilidad.', icon: <Rocket size={20} className="text-white" />, bg: "bg-purple-500" },
                { type: 'improved', title: 'Diseño con Tailwind', description: 'Migración completa del sistema de estilos para una carga más rápida.', icon: <Sparkles size={20} className="text-white" />, bg: "bg-amber-400" },
                { type: 'added', title: 'Sistema de Adopción Base', description: 'Funcionalidad núcleo para la publicación y solicitud de mascotas.', icon: <Rocket size={20} className="text-white" />, bg: "bg-purple-500" }
            ]
        }
    ];

    return (
        <main className="min-h-screen bg-slate-50 pb-20">
            {/* Hero Section */}
            <div className="relative w-full h-[500px] overflow-hidden flex items-center justify-center">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/pet-community.png"
                        alt="PawLig Community"
                        fill
                        className="object-cover opacity-20 scale-105 animate-[pulse_8s_ease-in-out_infinite]"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-purple-900/80 via-indigo-900/80 to-slate-50" />
                </div>

                {/* Floating Shapes */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-10 w-32 h-32 bg-pink-500 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob" />
                    <div className="absolute top-20 right-10 w-32 h-32 bg-yellow-500 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob" style={{ animationDelay: '2s' }} />
                    <div className="absolute -bottom-8 left-20 w-32 h-32 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob" style={{ animationDelay: '4s' }} />
                </div>

                {/* Hero Content */}
                <div className="relative z-10 container mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium mb-6 animate-[bounce_3s_infinite]">
                        <Star className="text-yellow-400" size={16} fill="currentColor" />
                        <span>¡Descubre nuestras últimas novedades!</span>
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 mb-6 drop-shadow-sm tracking-tight">
                        Notas de Lanzamiento
                    </h1>
                    
                    <p className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto font-light leading-relaxed">
                        Explora la evolución de <span className="font-bold text-white">PawLig</span>. Cada actualización es un paso más hacia un mundo mejor para nuestras mascotas.
                    </p>

                    <div className="mt-10">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-700 font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                        >
                            <ArrowLeft size={20} />
                            Volver a la plataforma
                        </Link>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-20 relative z-20 max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    
                    {/* Navegación Lateral (Sticky) */}
                    <aside className="hidden lg:block lg:col-span-3">
                        <div className="sticky top-24 bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-white/50">
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                                <History size={14} /> Historial
                            </h3>
                            <nav className="flex flex-col gap-2">
                                {versions.map((v) => (
                                    <a
                                        key={v.version}
                                        href={`#${v.version}`}
                                        className="group flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-all"
                                    >
                                        <div className={`w-3 h-3 rounded-full bg-gradient-to-tr ${v.color} shadow-sm group-hover:scale-125 transition-transform duration-300`} />
                                        <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900">{v.version}</span>
                                    </a>
                                ))}
                            </nav>
                            <div className="mt-8 pt-6 border-t border-slate-100">
                                <p className="text-xs text-slate-400 text-center font-medium">
                                    Última actualización: <br/> <span className="text-slate-600 font-bold">{lastUpdate}</span>
                                </p>
                            </div>
                        </div>
                    </aside>

                    {/* Contenido Principal */}
                    <div className="lg:col-span-9 space-y-16">
                        {versions.map((v, i) => (
                            <section key={v.version} id={v.version} className="scroll-mt-32 group">
                                <div className="relative pl-8 md:pl-0">
                                    {/* Timeline Line (Mobile/Tablet) */}
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-slate-200 to-transparent md:hidden rounded-full" />
                                    
                                    {/* Version Header */}
                                    <div className="flex flex-col md:flex-row md:items-baseline gap-4 mb-8 relative">
                                        <div className={`hidden md:flex absolute -left-[4.5rem] top-2 w-12 h-12 rounded-full bg-gradient-to-br ${v.color} items-center justify-center shadow-lg text-white font-bold text-sm ring-4 ring-slate-50 z-10`}>
                                            {i + 1}
                                        </div>
                                        
                                        <div className="flex-1">
                                            <div className="flex items-center gap-4 mb-2">
                                                <h2 className={`text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r ${v.color}`}>
                                                    {v.version}
                                                </h2>
                                                <span className="px-4 py-1.5 bg-white shadow-sm border border-slate-100 text-slate-600 text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-2">
                                                    <Calendar size={14} className="text-slate-400" />
                                                    {v.date}
                                                </span>
                                            </div>
                                            <h3 className="text-2xl font-bold text-slate-800 mb-2">{v.title}</h3>
                                            <p className="text-slate-600 text-lg leading-relaxed max-w-2xl">{v.description}</p>
                                        </div>
                                    </div>

                                    {/* Updates Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {v.updates.map((update, idx) => (
                                            <div 
                                                key={idx} 
                                                className="relative p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                                            >
                                                <div className={`absolute top-0 right-0 w-24 h-24 ${update.bg} opacity-10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110`} />
                                                
                                                <div className="flex items-start gap-4 relative z-10">
                                                    <div className={`p-3 ${update.bg} rounded-2xl shadow-md text-white shrink-0`}>
                                                        {update.icon}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-slate-900 text-lg mb-1">{update.title}</h4>
                                                        <p className="text-sm text-slate-500 leading-relaxed font-medium">{update.description}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        ))}

                        {/* Feedback Section */}
                        <section id="feedback" className="scroll-mt-32 relative overflow-hidden p-10 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-[2.5rem] shadow-2xl">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-20 -mt-20" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl -ml-20 -mb-20" />
                            
                            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                                <div className="p-6 bg-white/10 backdrop-blur-md rounded-full shadow-inner">
                                    <Heart className="text-pink-500 fill-pink-500 animate-pulse" size={48} />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-3xl font-extrabold mb-3">Tu opinión construye PawLig</h2>
                                    <p className="text-slate-300 leading-relaxed text-lg mb-6">
                                        ¿Encontraste un error o tienes una idea genial? Somos todo oídos. Ayúdanos a crear la mejor plataforma para el cuidado animal.
                                    </p>
                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                                        <Link
                                            href="https://github.com/asebasg/pawlig/issues/new/choose"
                                            className="px-8 py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-yellow-400 transition-colors shadow-lg flex items-center gap-2"
                                        >
                                            <Bug size={18} />
                                            Reportar Error
                                        </Link>
                                        <Link
                                            href="https://github.com/asebasg/pawlig/discussions"
                                            className="px-8 py-3 bg-white/10 backdrop-blur-sm text-white font-bold rounded-xl hover:bg-white/20 transition-colors border border-white/10 flex items-center gap-2"
                                        >
                                            <Sparkles size={18} />
                                            Sugerir Idea
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
            
        </main>
    );
}
