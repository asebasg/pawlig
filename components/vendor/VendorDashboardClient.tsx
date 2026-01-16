'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ShoppingBag, FileChartPie, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Page: /vendor
 * Descripción: Componente cliente para el dashboard del vendedor. Muestra las secciones
 * principales (Productos y Pedidos) mediante un diseño de grid con tarjetas interactivas.
 * Requiere: Información de sesión del usuario (userSession).
 * Implementa: Navegación principal del panel de control para vendedores.
 */

interface VendorDashboardClientProps {
    userSession: {
        id: string;
        name: string;
        email: string;
        role: string;
    };
}

export default function VendorDashboardClient({ userSession }: VendorDashboardClientProps) {
    const sections = [
        {
            title: 'Mis Productos',
            description: 'Gestiona tu inventario, agrega nuevos productos y actualiza precios.',
            icon: Package,
            href: '/vendor/products',
            color: 'text-blue-500',
            bgColor: 'bg-blue-50',
        },
        {
            title: 'Mis Pedidos',
            description: 'Revisa las órdenes de compra, actualiza estados y gestiona envíos.',
            icon: ShoppingBag,
            href: '/vendor/orders',
            color: 'text-green-500',
            bgColor: 'bg-green-50',
        },
        {
            title: 'Métricas',
            description: 'Consulta tus métricas de negocio, para saber cuál será tu siguiente paso.',
            icon: FileChartPie,
            href: '/vendor/metrics',
            color: 'text-pink-500',
            bgColor: 'bg-pink-50',
        }
    ];

    return (
        <div className="space-y-2">
            <div className="bg-white p-2 rounded-2xl mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">
                    ¡Hola de nuevo, <span className="text-primary">{userSession.name}</span>! 👋
                </h2>
                <p className="text-gray-500">¿Qué te gustaría gestionar hoy?</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {sections.map((section) => (
                    <Link key={section.href} href={section.href} className="group">
                        <Card className="h-full transition-all duration-200 hover:shadow-lg hover:cursor-pointer border-2">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-xl font-bold text-gray-800">
                                    {section.title}
                                </CardTitle>
                                <div className={`${section.bgColor} p-3 rounded-xl transition-colors group-hover:bg-opacity-80`}>
                                    <section.icon className={`h-6 w-6 ${section.color}`} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-sm text-gray-500 mb-6 min-h-[40px]">
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
 * Componente de dashboard principal para usuarios con rol de vendedor.
 *
 * Lógica Clave:
 * - Navegación: Utiliza un sistema de tarjetas (Cards) que actúan como enlaces
 *   principales a las subsecciones de Productos y Pedidos.
 * - Saludo Personalizado: Utiliza la prop userSession para mostrar el nombre
 *   del vendedor, mejorando la personalización del panel.
 * - UX: Implementa estados de hover y transiciones suaves para mejorar la
 *   interactividad del dashboard.
 *
 * Dependencias Externas:
 * - Lucide React: Proporciona los iconos visuales para cada sección.
 * - Shadcn/UI: Utiliza los componentes de Card para mantener la consistencia visual.
 * - Next.js (Link): Para la navegación optimizada entre rutas del dashboard.
 *
 */

