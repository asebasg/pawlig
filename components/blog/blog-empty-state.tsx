import React from "react";
import Link from "next/link";
import { SearchX, Sparkles } from "lucide-react";

/**
 * Descripción: Componente para manejar estados vacíos en el blog.
 * Requiere: Ninguno
 * Implementa: ISSUE-157
 */

interface BlogEmptyStateProps {
  mode: "initial" | "filtered";
}

export function BlogEmptyState({ mode }: BlogEmptyStateProps) {
  if (mode === "initial") {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-20 text-center dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="bg-primary/10 mb-6 flex h-16 w-16 items-center justify-center rounded-2xl">
          <Sparkles className="h-8 w-8 text-primary" />
        </div>
        <h3 className="mb-3 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Estamos preparando nuevas historias y consejos
        </h3>
        <p className="mb-8 max-w-md text-zinc-600 dark:text-zinc-400">
          Pronto publicaremos artículos sobre el cuidado, entrenamiento y
          bienestar de tus mascotas. Mientras tanto, explora nuestra plataforma.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Link
            href="/adopciones"
            className="hover:bg-primary/90 inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 font-medium text-primary-foreground active:scale-[0.97] transition-[transform,background-color] duration-150 ease-out"
          >
            Conocer mascotas en adopción
          </Link>
          <Link
            href="/productos"
            className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-6 py-3 font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-800/80 active:scale-[0.97] transition-[transform,background-color] duration-150 ease-out"
          >
            Explorar productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-20 text-center dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-200/50 dark:bg-zinc-800/50">
        <SearchX className="h-8 w-8 text-zinc-500 dark:text-zinc-400" />
      </div>
      <h3 className="mb-2 text-xl font-bold text-zinc-900 dark:text-zinc-50">
        No encontramos artículos coincidentes
      </h3>
      <p className="mb-8 max-w-sm text-zinc-600 dark:text-zinc-400">
        Intenta ajustar tu búsqueda o limpiar los filtros para ver más
        resultados.
      </p>
      <Link
        href="/blog"
        className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-6 py-3 font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-800/80 active:scale-[0.97] transition-[transform,background-color] duration-150 ease-out"
      >
        Limpiar filtros
      </Link>
    </div>
  );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Componente para manejar estados vacíos en el blog.
 *
 * Lógica Clave:
 * - "initial": Sin artículos creados en la base de datos global.
 * - "filtered": Sin resultados tras aplicar búsqueda o etiquetas.
 */
