"use client";

import React, { useCallback, useState, useEffect, Suspense } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

/**
 * Descripción: Filtros de la página del blog (búsqueda, tags, orden).
 * Requiere: uso de searchParams desde Next.js App Router
 * Implementa: ISSUE-157
 */

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

interface BlogFiltersProps {
  tags?: string[];
}

function FiltersContent({ tags = [] }: BlogFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("search") || "";
  const currentTag = searchParams.get("tag") || "";
  const currentSort = searchParams.get("sort") || "recent";

  const [searchTerm, setSearchTerm] = useState(currentSearch);
  const debouncedSearch = useDebounce(searchTerm, 500);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      params.delete("page"); // Reset page on filter change
      return params.toString();
    },
    [searchParams],
  );

  useEffect(() => {
    if (debouncedSearch !== currentSearch) {
      router.push(
        `${pathname}?${createQueryString("search", debouncedSearch)}`,
      );
    }
  }, [debouncedSearch, currentSearch, pathname, router, createQueryString]);

  const handleTagClick = (tag: string) => {
    const newTag = currentTag === tag ? "" : tag;
    router.push(`${pathname}?${createQueryString("tag", newTag)}`);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.push(`${pathname}?${createQueryString("sort", e.target.value)}`);
  };

  return (
    <div className="mb-8 flex w-full flex-col items-center justify-between gap-4 md:flex-row">
      <div className="relative w-full md:w-96">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
        <input
          type="text"
          placeholder="Buscar artículos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="focus:ring-primary/50 w-full rounded-xl border border-zinc-200 bg-white py-2 pl-10 pr-4 text-zinc-900 focus:outline-none focus:ring-2 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
        />
      </div>

      <div className="flex w-full flex-col items-center gap-4 sm:flex-row md:w-auto">
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  currentTag === tag
                    ? "bg-primary text-primary-foreground"
                    : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        <select
          value={currentSort}
          onChange={handleSortChange}
          className="focus:ring-primary/50 cursor-pointer rounded-xl border border-zinc-200 bg-white px-4 py-2 text-zinc-900 focus:outline-none focus:ring-2 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
        >
          <option value="recent">Más recientes</option>
          <option value="popular">Más leídos</option>
        </select>
      </div>
    </div>
  );
}

export function BlogFilters(props: BlogFiltersProps) {
  return (
    <Suspense
      fallback={
        <div className="mb-8 h-12 w-full animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-800"></div>
      }
    >
      <FiltersContent {...props} />
    </Suspense>
  );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Filtros de la página del blog (búsqueda, tags, orden).
 *
 * Lógica Clave:
 * - Uso de useSearchParams envuelto en Suspense.
 * - Sincronización de estado local con URL via debounce para búsqueda.
 */
