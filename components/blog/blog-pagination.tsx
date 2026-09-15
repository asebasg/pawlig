"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Descripción: Control de paginación para el blog, preservando otros parámetros de URL.
 * Requiere: totalPages del servidor
 * Implementa: ISSUE-157
 */

interface BlogPaginationProps {
  totalPages: number;
}

function PaginationContent({ totalPages }: BlogPaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  if (totalPages <= 1) return null;

  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="mt-12 flex items-center justify-center gap-2">
      <Link
        href={createPageUrl(Math.max(1, currentPage - 1))}
        className={`flex items-center justify-center rounded-xl border border-zinc-200 p-2 transition-colors dark:border-zinc-800 ${
          currentPage === 1
            ? "pointer-events-none text-zinc-400 opacity-50"
            : "bg-white text-zinc-700 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
        }`}
      >
        <ChevronLeft className="h-5 w-5" />
        <span className="sr-only">Página anterior</span>
      </Link>

      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }).map((_, i) => {
          const page = i + 1;
          const isActive = page === currentPage;

          return (
            <Link
              key={page}
              href={createPageUrl(page)}
              className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
              }`}
            >
              {page}
            </Link>
          );
        })}
      </div>

      <Link
        href={createPageUrl(Math.min(totalPages, currentPage + 1))}
        className={`flex items-center justify-center rounded-xl border border-zinc-200 p-2 transition-colors dark:border-zinc-800 ${
          currentPage === totalPages
            ? "pointer-events-none text-zinc-400 opacity-50"
            : "bg-white text-zinc-700 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
        }`}
      >
        <ChevronRight className="h-5 w-5" />
        <span className="sr-only">Página siguiente</span>
      </Link>
    </div>
  );
}

export function BlogPagination(props: BlogPaginationProps) {
  return (
    <Suspense
      fallback={
        <div className="mt-12 h-10 w-full animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-800"></div>
      }
    >
      <PaginationContent {...props} />
    </Suspense>
  );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Control de paginación para el blog, preservando otros parámetros de URL.
 *
 * Lógica Clave:
 * - Suspense boundary requerido por el uso de useSearchParams en Next.js App Router.
 * - Calcula la nueva URL manteniendo tags, search, sort vigentes.
 */
