"use client";

import * as React from "react";
import { Moon, Sun, Monitor, Palette } from "lucide-react";
import { useTheme } from "next-themes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * Ruta/Componente/Servicio: ThemeToggle
 * Descripción: Botón global para cambiar el tema de la aplicación.
 * Requiere: next-themes, lucide-react, Select
 * Implementa: HU-XXX (Cambio de tema)
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Evitar desajustes de hidratación al renderizar solo después de montar
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-[140px] h-9 bg-muted animate-pulse rounded-md" />;
  }

  return (
    <div className="flex items-center gap-2">
      <Select value={theme} onValueChange={setTheme}>
        <SelectTrigger className="w-[150px] h-9 border-none bg-accent/50 hover:bg-accent transition-colors">
          <SelectValue placeholder="Tema" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">
            <div className="flex items-center gap-2">
              <Sun size={16} />
              <span>Claro</span>
            </div>
          </SelectItem>
          <SelectItem value="dark">
            <div className="flex items-center gap-2">
              <Moon size={16} />
              <span>Oscuro</span>
            </div>
          </SelectItem>
          <SelectItem value="solarized-light">
            <div className="flex items-center gap-2">
              <Palette size={16} className="text-orange-500" />
              <span>Solarized Claro</span>
            </div>
          </SelectItem>
          <SelectItem value="solarized-dark">
            <div className="flex items-center gap-2">
              <Palette size={16} className="text-blue-500" />
              <span>Solarized Oscuro</span>
            </div>
          </SelectItem>
          <SelectItem value="system">
            <div className="flex items-center gap-2">
              <Monitor size={16} />
              <span>Sistema</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Este componente permite al usuario cambiar entre los temas disponibles:
 * Claro, Oscuro, Solarized Claro, Solarized Oscuro y Sistema.
 *
 * Lógica Clave:
 * - 'useTheme': Hook de 'next-themes' para obtener y establecer el tema actual.
 * - 'mounted': Se utiliza un estado para asegurar que el componente solo se
 *   renderice en el cliente, evitando errores de hidratación ya que el tema
 *   se lee del almacenamiento local.
 * - 'Select': Se utiliza un componente de selección para ofrecer todas las
 *   opciones de tema de forma clara.
 *
 * Dependencias Externas:
 * - 'next-themes': Para la gestión del tema.
 * - 'lucide-react': Para los iconos de sol, luna, etc.
 *
 */
