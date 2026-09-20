/* eslint-disable @next/next/no-img-element */
import React from "react";
import Link from "next/link";
import { BlogPost } from "@prisma/client";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, Eye } from "lucide-react";

interface BlogCardProps {
  post: BlogPost & { author?: { name: string | null } };
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/60 bg-white/80 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-zinc-900/80 active:scale-[0.98] transition-[transform,box-shadow] duration-200 ease-out hover:shadow-md"
    >
      {post.featured && (
        <div className="relative h-48 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
          <img
            src={post.featured}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] [@media(hover:hover)]:group-hover:scale-105"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-4">
        {post.tags && post.tags.length > 0 && (
          <div className="mb-3 flex items-center gap-2 overflow-x-auto pb-2">
            {post.tags.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="whitespace-nowrap rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-950/30 dark:text-purple-400"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <h3 className="mb-2 line-clamp-2 text-base font-medium text-zinc-800 transition-colors group-hover:text-purple-600 dark:text-zinc-100 dark:group-hover:text-purple-400">
          {post.title}
        </h3>
        <p className="mb-4 line-clamp-3 flex-1 text-sm font-normal leading-relaxed text-zinc-700 dark:text-zinc-300">
          {post.excerpt}
        </p>

        <div className="mt-auto flex items-center justify-between border-t border-zinc-100 pt-4 text-xs font-medium text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" strokeWidth={1.5} />
            {format(new Date(post.createdAt), "d 'de' MMMM, yyyy", {
              locale: es,
            })}
          </div>
          <div className="flex items-center gap-1.5">
            <Eye className="h-4 w-4" strokeWidth={1.5} />
            {post.views} vistas
          </div>
        </div>
      </div>
    </Link>
  );
}
