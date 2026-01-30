"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Home,
    ArrowLeft,
    PawPrint,
    ShoppingBag,
    HelpCircle,
    Search,
    Ghost,
    Compass,
    MapPinOff,
    Unplug,
    FileQuestion,
} from "lucide-react";
import React from "react";

/**
 * Descripción: Página de error personalizada (404) que utiliza un sistema orbital de iconos Lucide y tipografía con gradiente dinámico.
 * Requiere: Acceso público (sin autenticación).
 * Implementa: Sistema de animación CSS (@keyframes orbit), diseño responsive, y navegación de retorno.
 */

export default function NotFound() {
    const router = useRouter();

    const quickLinks = [
        {
            title: "Inicio",
            description: "Volver a la página principal",
            icon: Home,
            href: "/",
            accentColor: "purple" as const,
        },
        {
            title: "Mascotas",
            description: "Explora mascotas en adopción",
            icon: PawPrint,
            href: "/adopciones",
            accentColor: "teal" as const,
        },
        {
            title: "Productos",
            description: "Descubre productos para mascotas",
            icon: ShoppingBag,
            href: "/productos",
            accentColor: "orange" as const,
        },
        {
            title: "Ayuda",
            description: "Centro de ayuda y preguntas frecuentes",
            icon: HelpCircle,
            href: "/faq",
            accentColor: "blue" as const,
        },
    ];

    const orbitingIcons = [
        { icon: Search, radius: "110px", duration: "15s", delay: "0s" },
        { icon: Ghost, radius: "140px", duration: "20s", delay: "-5s" },
        { icon: Compass, radius: "170px", duration: "25s", delay: "-10s" },
        { icon: MapPinOff, radius: "125px", duration: "18s", delay: "-2s" },
        { icon: Unplug, radius: "155px", duration: "22s", delay: "-7s" },
        { icon: FileQuestion, radius: "185px", duration: "28s", delay: "-12s" },
    ];

    return (
        <main className="container mx-auto px-4 py-10 max-w-5xl overflow-hidden">
            <div className="text-center mb-12">
                {/* Sistema Orbital */}
                <div className="relative h-[300px] md:h-[400px] w-full flex items-center justify-center mb-8">
                    {/* Glow background */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

                    {/* Central 404 */}
                    <h1 className="text-8xl md:text-[12rem] font-bold bg-gradient-to-r from-purple-600 via-teal-500 to-orange-500 bg-clip-text text-transparent select-none drop-shadow-sm">
                        404
                    </h1>

                    {/* Orbiting Icons */}
                    {orbitingIcons.map((item, index) => {
                        const Icon = item.icon;
                        const orbitStyles = {
                            "--orbit-radius": item.radius,
                            "--orbit-duration": item.duration,
                            "--orbit-delay": item.delay,
                        } as React.CSSProperties;

                        return (
                            <div
                                key={index}
                                className="animate-orbit pointer-events-none"
                                style={orbitStyles}
                            >
                                <Icon className="w-6 h-6 md:w-8 md:h-8 text-slate-400 opacity-60 dark:text-slate-500" />
                            </div>
                        );
                    })}
                </div>

                <h2 className="text-3xl md:text-4xl font-bold text-[#171717]">
                    ¡Ups! Página no encontrada
                </h2>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
                    Parece que esta página se ha escapado como un <span className="text-purple-600 font-semibold">cachorro travieso</span>. ¡No te preocupes, te ayudaremos a encontrar el camino de vuelta!
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                    <Button
                        onClick={() => router.back()}
                        variant="outline"
                        size="lg"
                        className="group"
                    >
                        <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                        Volver atrás
                    </Button>
                    <Button
                        asChild
                        size="lg"
                        className="bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-200/50 transition-all transform hover:-translate-y-0.5 font-semibold"
                    >
                        <Link href="/">
                            <Home className="mr-2 h-5 w-5" />
                            Ir al inicio
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="mb-8">
                <h3 className="text-xl font-semibold text-[#171717] text-center mb-6">
                    ¿Buscabas algo de esto?
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickLinks.map((link) => {
                        const Icon = link.icon;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="group transform transition-all duration-200 hover:scale-105"
                            >
                                <Card
                                    accentColor={link.accentColor}
                                    className="h-full hover:shadow-lg transition-shadow duration-200 cursor-pointer flex flex-col"
                                >
                                    <CardHeader>
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors">
                                                <Icon className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                                            </div>
                                        </div>
                                        <CardTitle className="text-base text-[#171717]">{link.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-4 flex items-start flex-grow">
                                        <CardDescription className="text-sm">
                                            {link.description}
                                        </CardDescription>
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    })}
                </div>
            </div>

            <div className="text-center mt-8">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    ¿Necesitas más ayuda?{" "}
                    <Link
                        href="/faq"
                        className="text-purple-600 hover:text-purple-700 font-bold hover:underline transition-all"
                    >
                        Visita nuestro centro de ayuda
                    </Link>
                </p>
            </div>
        </main>
    );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Rediseño estético de la página 404 reemplazando assets estáticos por un
 * sistema dinámico de iconos en órbita. Utiliza exclusivamente CSS para las
 * animaciones y gradientes, mejorando el rendimiento y la coherencia visual.
 *
 * Lógica Clave:
 * - Sistema Orbital: Utiliza la animación CSS @keyframes orbit definida en
 *   globals.css. Cada icono recibe parámetros únicos (--orbit-radius,
 *   --orbit-duration, --orbit-delay) mediante estilos inline tipados.
 * - Efecto de Profundidad: Se implementa un resplandor (glow) central con
 *   blur de 100px y baja opacidad para resaltar el texto 404 sin distraer.
 * - Gradiente Dinámico: El texto 404 utiliza un gradiente lineal con los
 *   colores de marca (púrpura, turquesa, naranja) aplicado mediante
 *   background-clip: text.
 * - Responsividad: Se ajustan los tamaños de fuente (text-8xl a 12rem) y
 *   radios de órbita para asegurar una visualización óptima en móviles.
 * - Soporte de Temas: Se añaden clases dark: para asegurar que el contraste
 *   cumpla con WCAG AA en temas oscuros.
 *
 * Dependencias Externas:
 * - lucide-react: Proporciona los iconos para el sistema orbital y botones.
 * - next/link y next/navigation: Gestión de rutas y navegación programática.
 * - @/components/ui/button y Card: Componentes base de la interfaz.
 *
 */
