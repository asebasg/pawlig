'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bone, Sparkles, ChartSpline, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Page: /shelter
 * Descripción: Componente cliente para el dashboard del albergue. Muestra las secciones
 * principales (Mascotas, Aplicaciones y Métricas) mediante un diseño de grid con tarjetas interactivas.
 * Requiere: Información de sesión del usuario (userSession).
 * Implementa: Navegación principal del panel de control para albergues.
 */

interface ShelterDashboardClientProps {
    userSession: {
        id: string;
        name: string;
        email: string;
        role: string;
    };
}

export default function ShelterDashboardClient({ userSession }: ShelterDashboardClientProps) {
    const sections = [
        {
            title: 'Mis Mascotas',
            description: 'Gestiona a tus mascotas, agrega nuevas mascotas y gestiónalas.',
            icon: Bone,
            href: '/shelter/pets',
            color: 'text-emerald-500',
            bgColor: 'bg-emerald-50',
        },
        {
            title: 'Postulaciones',
            description: 'Revisa las postulaciones de tus mascotas y gestiona las adopciones.',
            icon: Sparkles,
            href: '/shelter/adoptions',
            color: 'text-yellow-400',
            bgColor: 'bg-yellow-100',
        },
        {
            title: 'Métricas',
            description: 'Consulta tus métricas de tu albergue, para recibir estadísticas de adopciones.',
            icon: ChartSpline,
            href: '/shelter/metrics',
            color: 'text-red-500',
            bgColor: 'bg-red-50',
        }
    ];

    return (
        <div className="space-y-2">
            <div className="bg-card p-2 rounded-2xl mb-4">
                <h2 className="text-2xl font-semibold text-foreground">
                    ¡Hola de nuevo, <span className="text-primary">{userSession.name}</span>! 👋
                </h2>
                <p className="text-muted-foreground">¿Qué te gustaría gestionar hoy?</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {sections.map((section) => (
                    <Link key={section.href} href={section.href} className="group">
                        <Card className="h-full transition-all duration-200 hover:shadow-lg hover:cursor-pointer border-2">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-xl font-bold text-foreground">
                                    {section.title}
                                </CardTitle>
                                <div className={`${section.bgColor} p-3 rounded-xl transition-colors group-hover:bg-opacity-80`}>
                                    <section.icon className={`h-6 w-6 ${section.color}`} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-sm text-muted-foreground mb-6 min-h-[40px]">
                                    {section.description}
                                </CardDescription>
                                <div className="flex items-center text-sm font-semibold text-primary">
                                    <Button variant="default" className="pointer-events-none">
                                        Acceder
                                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Componente de dashboard principal para usuarios con rol de albergue.
 *
 * Lógica Clave:
 * - Navegación: Utiliza un sistema de tarjetas (Cards) que actúan como enlaces
 *   principales a las subsecciones de Mascotas, Postulaciones y Métricas.
 * - Saludo Personalizado: Utiliza la prop userSession para mostrar el nombre
 *   del albergue, mejorando la personalización del panel.
 * - UX: Implementa estados de hover y transiciones suaves para mejorar la
 *   interactividad del dashboard.
 *
 * Dependencias Externas:
 * - Lucide React: Proporciona los iconos visuales para cada sección.
 * - Shadcn/UI: Utiliza los componentes de Card para mantener la consistencia visual.
 * - Next.js (Link): Para la navegación optimizada entre rutas del dashboard.
 *
 */

