"use client";

import * as React from "react";
import { Moon, Sun, Palette, Zap } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

/**
 * Ruta/Componente/Servicio: ThemeToggle
 * Descripción: Botón circular que alterna entre los temas disponibles (Claro, Oscuro, Solarized Claro, Solarized Oscuro).
 * Requiere: next-themes, lucide-react, Button
 * Implementa: Mejora estética del cambio de tema (HU-XXX)
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  const themes = ["light", "dark", "solarized-light", "solarized-dark"];

  // Evitar desajustes de hidratación al renderizar solo después de montar
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-10 h-10 bg-muted animate-pulse rounded-full" />;
  }

  const toggleTheme = () => {
    const currentIndex = themes.indexOf(theme || "light");
    // Si el tema actual no está en la lista (ej. 'system'), empezamos por dark
    const nextIndex = currentIndex === -1 ? 1 : (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const getIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="h-5 w-5 text-yellow-500" />;
      case "dark":
        return <Moon className="h-5 w-5 text-blue-400" />;
      case "solarized-light":
        return <Palette className="h-5 w-5 text-orange-500" />;
      case "solarized-dark":
        return <Zap className="h-5 w-5 text-indigo-400" />;
      default:
        return <Sun className="h-5 w-5" />;
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full hover:bg-accent/50 transition-all duration-300"
      title="Cambiar tema"
    >
      {getIcon()}
      <span className="sr-only">Alternar tema</span>
    </Button>
  );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Este componente reemplaza el selector anterior por un botón único que rota
 * entre los cuatro temas definidos en el sistema.
 *
 * Lógica Clave:
 * - 'toggleTheme': Calcula el siguiente tema en el arreglo circular basándose
 *   en el estado actual proporcionado por 'next-themes'.
 * - 'getIcon': Devuelve un icono representativo diferente para cada estado
 *   del tema para dar feedback visual al usuario.
 * - 'mounted': Garantiza que no haya inconsistencias entre el servidor y el
 *   cliente al leer el tema del almacenamiento local.
 *
 * Dependencias Externas:
 * - 'next-themes': Para gestionar el estado global del tema.
 * - 'lucide-react': Iconografía para los diferentes modos.
 *
 */
