"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, ArrowRight, CodeXml, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Descripción: Componente cliente para el dashboard de desarrollo. Muestra enlaces
 * a notas de desarrollo, documentación técnica interna y repositorio de código.
 * Requiere: Información de sesión del usuario (userSession).
 * Implementa: Panel de navegación interna para desarrolladores.
 */

interface DevDashboardClientProps {
  userSession: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export default function AdminDashboardClient({}: DevDashboardClientProps) {
  const sections = [
    {
      title: "Notas de desarrollo",
      description:
        "Registro cronológico de actualizaciones, nuevas características, correcciones de errores y parches de la plataforma.",
      icon: CodeXml,
      href: "/changelog/dev",
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "Documentación",
      description:
        "Guías técnicas, arquitectura del sistema, manuales de configuración y referencias de la API.",
      icon: FileText,
      href: "/admin/dev/docs",
      color: "text-orange-500",
      bgColor: "bg-orange-50",
    },
    {
      title: "Repositorio",
      description:
        "Acceso al código fuente, control de versiones, rastreo de issues y revisión de pull requests.",
      icon: Github,
      href: "https://github.com/asebasg/pawlig",
      color: "text-white",
      bgColor: "bg-gray-700",
    },
  ];

  return (
    <div className="space-y-2">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => (
          <Link key={section.href} href={section.href} className="group">
            <Card className="h-full transition-all duration-200 hover:shadow-lg hover:cursor-pointer border-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-bold text-gray-800">
                  {section.title}
                </CardTitle>
                <div
                  className={`${section.bgColor} p-3 rounded-xl transition-colors group-hover:bg-opacity-80`}
                >
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
 * Componente de dashboard de desarrollo para usuarios con rol de administrador.
 *
 * Lógica Clave:
 * - Navegación: Utiliza un sistema de tarjetas (Cards) que actúan como enlaces
 *   principales a las subsecciones de Dev Notes, Documentación, Repositorio, etc.
 * - UX: Implementa estados de hover y transiciones suaves para mejorar la
 *   interactividad del dashboard.
 *
 * Dependencias Externas:
 * - Lucide React: Proporciona los iconos visuales para cada sección.
 * - Shadcn/UI: Utiliza los componentes de Card para mantener la consistencia visual.
 * - Next.js (Link): Para la navegación optimizada entre rutas del dashboard.
 *
 */
