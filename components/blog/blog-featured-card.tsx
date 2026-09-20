/* eslint-disable @next/next/no-img-element */
import React from "react";
import Link from "next/link";
import { BlogPost } from "@prisma/client";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, Eye, Sparkles } from "lucide-react";

/**
 * Descripción: Tarjeta destacada para el blog, se muestra típicamente como el primer resultado.
 * Requiere: Objeto BlogPost de Prisma
 * Implementa: ISSUE-157
 */

interface BlogFeaturedCardProps {
  post: BlogPost & { author?: { name: string | null } };
}

export function BlogFeaturedCard({ post }: BlogFeaturedCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group mb-12 flex h-full flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm active:scale-[0.99] transition-[transform,box-shadow] duration-200 ease-out hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 md:flex-row"
    >
      {post.featured ? (
        <div className="relative h-64 w-full overflow-hidden md:h-auto md:w-1/2">
          <div className="absolute left-4 top-4 z-10 flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow-lg backdrop-blur-md">
            <Sparkles className="h-4 w-4" />
            Destacado
          </div>
          <img
            src={post.featured}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] [@media(hover:hover)]:group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="relative flex h-64 w-full items-center justify-center bg-zinc-100 dark:bg-zinc-800 md:h-auto md:w-1/2">
          <div className="absolute left-4 top-4 z-10 flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow-lg backdrop-blur-md">
            <Sparkles className="h-4 w-4" />
            Destacado
          </div>
          <span className="font-medium text-zinc-400 dark:text-zinc-600">
            Sin imagen
          </span>
        </div>
      )}

      <div className="flex flex-1 flex-col justify-center p-8 md:p-10">
        {post.tags && post.tags.length > 0 && (
          <div className="mb-4 flex items-center gap-2 overflow-x-auto pb-2">
            {post.tags.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="whitespace-nowrap rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700 dark:bg-purple-950/30 dark:text-purple-400"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <h3 className="mb-4 line-clamp-2 text-2xl font-bold text-zinc-900 transition-colors group-hover:text-primary dark:text-zinc-50 md:text-3xl">
          {post.title}
        </h3>
        <p className="mb-8 line-clamp-3 text-base text-zinc-600 dark:text-zinc-400">
          {post.excerpt}
        </p>

        <div className="mt-auto flex items-center gap-6 text-sm font-medium text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" strokeWidth={1.5} />
            {format(new Date(post.createdAt), "d 'de' MMMM, yyyy", {
              locale: es,
            })}
          </div>
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4" strokeWidth={1.5} />
            {post.views} vistas
          </div>
        </div>
      </div>
    </Link>
  );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Tarjeta destacada para el blog. Se muestra típicamente como el primer resultado.
 *
 * Lógica Clave:
 * - Layout horizontal en desktop (md:flex-row).
 * - Badge especial de "Destacado" usando lucide-react.
 */
