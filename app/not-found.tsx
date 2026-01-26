/**
 * Página 404 (Not Found)
 * Descripción: Página de error personalizada que se muestra cuando el usuario intenta acceder a una ruta inexistente.
 * Requiere: Ninguna autenticación
 * Implementa: Navegación útil y diseño coherente con el proyecto
 */

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
} from "lucide-react";
import Image from 'next/image';

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

    return (
        <main className="container mx-auto px-4 py-10 max-w-5xl">
            <div className="text-center mb-12">
                <div className="mb-8 flex justify-center">
                    <Image
                        src='/images/404-page.png'
                        alt="Pagina no encontrada"
                        width={350}
                        height={350}
                        className="object-cover pointer-events-none"
                    />
                </div>

                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                    ¡Ups! Página no encontrada
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                    Parece que esta página se ha escapado como un cachorro travieso. No te preocupes, te ayudaremos a encontrar el camino de vuelta.
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
                        className="bg-primary hover:bg-primary/90"
                    >
                        <Link href="/">
                            <Home className="mr-2 h-5 w-5" />
                            Ir al inicio
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="mb-8">
                <h3 className="text-xl font-semibold text-foreground text-center mb-6">
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
                                            <div className="p-2 rounded-lg bg-muted group-hover:bg-slate-200 transition-colors">
                                                <Icon className="w-5 h-5 text-slate-700" />
                                            </div>
                                        </div>
                                        <CardTitle className="text-base">{link.title}</CardTitle>
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
                <p className="text-sm text-slate-500">
                    ¿Necesitas más ayuda?{" "}
                    <Link
                        href="/faq"
                        className="text-primary hover:text-purple-700 font-semibold hover:underline transition-all"
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
 * Página 404 personalizada que se muestra cuando el usuario intenta acceder
 * a una ruta que no existe. Proporciona navegación útil mediante enlaces
 * rápidos a las secciones principales del sitio y mantiene la coherencia
 * visual con el resto del proyecto.
 *
 * Lógica Clave:
 * - useRouter: Permite al usuario regresar a la página anterior mediante
 *   el botón "Volver atrás", mejorando la experiencia de navegación.
 * - Enlaces rápidos: Se definen 4 enlaces principales (Inicio, Mascotas,
 *   Productos, Ayuda) con iconos y colores de acento personalizados para
 *   facilitar la navegación del usuario.
 * - Diseño responsive: Utiliza grid de Tailwind que se adapta de 1 columna
 *   en móvil a 4 columnas en pantallas grandes.
 * - Paleta de colores: Usa los colores oficiales del proyecto (purple-600,
 *   slate-900, slate-600) para mantener consistencia visual.
 * - Espaciado: Utiliza container mx-auto y padding apropiado para evitar
 *   solapamiento con navbar y footer.
 *
 * Dependencias Externas:
 * - next/link: Para navegación entre páginas de Next.js.
 * - next/navigation: Para acceder al router y permitir navegación programática.
 * - lucide-react: Biblioteca de iconos para los elementos visuales.
 * - @/components/ui/button: Componente de botón de shadcn/ui.
 * - @/components/ui/card: Componente de tarjeta de shadcn/ui con soporte
 *   para acentos de color personalizados.
 *
 */
