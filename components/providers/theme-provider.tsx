"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes";

/**
 * Ruta/Componente/Servicio: ThemeProvider
 * Descripción: Proveedor de temas para la aplicación, utilizando next-themes.
 * Requiere: next-themes
 * Implementa: Soporte para temas Light, Dark y Solarized.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Este componente envuelve la aplicación para proporcionar capacidades de
 * cambio de tema dinámico. Utiliza la biblioteca 'next-themes' para
 * gestionar la persistencia del tema y la aplicación de clases CSS o
 * atributos de datos.
 *
 * Lógica Clave:
 * - 'NextThemesProvider': Componente de orden superior que inyecta el contexto
 *   del tema en la jerarquía de componentes.
 * - 'props': Se pasan todas las propiedades recibidas al proveedor subyacente,
 *   permitiendo la configuración del atributo (class o data-theme), el tema
 *   predeterminado, etc.
 *
 * Dependencias Externas:
 * - 'next-themes': Biblioteca para la gestión de temas en aplicaciones Next.js.
 *
 */
