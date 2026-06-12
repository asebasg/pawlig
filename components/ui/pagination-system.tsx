"use client";

import React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Descripción: Componente de paginación inteligente y responsivo.
 * Incluye numeración con elipsis, botones de navegación y contador dinámico.
 *
 * Props:
 * - currentPage: Página actual.
 * - totalPages: Total de páginas.
 * - onPageChange: Callback al cambiar de página.
 * - totalItems: Número total de elementos.
 * - itemsPerPage: Elementos por página (default 10).
 */

interface PaginationSystemProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage?: number;
  className?: string;
}

export function PaginationSystem({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage = 10,
  className,
}: PaginationSystemProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generar el rango de páginas a mostrar
  const getPageNumbers = () => {
    const pages = [];
    const showMax = 5; // Número máximo de botones de página a mostrar sin elipsis

    if (totalPages <= showMax) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Siempre incluir la primera página
      pages.push(1);

      if (currentPage > 3) {
        pages.push("ellipsis-1");
      }

      // Páginas alrededor de la actual
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }

      if (currentPage < totalPages - 2) {
        pages.push("ellipsis-2");
      }

      // Siempre incluir la última página
      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }
    return pages;
  };

  if (totalPages <= 1 && totalItems <= itemsPerPage) {
    return (
      <div className={cn("flex flex-col items-center gap-4 py-8", className)}>
        <p className="text-sm text-slate-500 font-medium">
          Mostrando {totalItems} de {totalItems} resultados
        </p>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-center gap-6 py-10", className)}>
      {/* Contador Inteligente */}
      <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-100 rounded-full border border-slate-200 shadow-sm">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Página {currentPage} de {totalPages}
        </span>
        <span className="w-1 h-1 rounded-full bg-slate-300" />
        <span className="text-sm font-medium text-slate-600">
          Mostrando <span className="font-bold text-slate-900">{startItem}-{endItem}</span> de <span className="font-bold text-slate-900">{totalItems}</span> actualizaciones
        </span>
      </div>

      {/* Navegación */}
      <nav className="flex items-center gap-1 sm:gap-2" aria-label="Paginación">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="rounded-xl border-slate-200 hover:bg-slate-50 hover:text-purple-600 disabled:opacity-30 transition-all duration-300 shadow-sm"
        >
          <ChevronLeft size={20} />
          <span className="sr-only">Anterior</span>
        </Button>

        <div className="flex items-center gap-1 sm:gap-2">
          {getPageNumbers().map((page, index) => {
            if (typeof page === "string") {
              return (
                <div
                  key={`ellipsis-${index}`}
                  className="w-10 h-10 flex items-center justify-center text-slate-400"
                >
                  <MoreHorizontal size={20} />
                </div>
              );
            }

            const isCurrent = page === currentPage;

            return (
              <Button
                key={page}
                variant={isCurrent ? "default" : "outline"}
                onClick={() => onPageChange(page)}
                className={cn(
                  "w-10 h-10 rounded-xl transition-all duration-300 font-bold text-sm shadow-sm",
                  isCurrent
                    ? "bg-gradient-to-br from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white border-transparent"
                    : "border-slate-200 text-slate-600 hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700"
                )}
              >
                {page}
              </Button>
            );
          })}
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="rounded-xl border-slate-200 hover:bg-slate-50 hover:text-purple-600 disabled:opacity-30 transition-all duration-300 shadow-sm"
        >
          <ChevronRight size={20} />
          <span className="sr-only">Siguiente</span>
        </Button>
      </nav>
    </div>
  );
}
