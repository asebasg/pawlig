import React from "react";
import { getBlogPosts, getBlogTags } from "@/lib/services/blog.service";
import { BlogCard } from "@/components/blog/blog-card";
import { BlogEmptyState } from "@/components/blog/blog-empty-state";
import { BlogFilters } from "@/components/blog/blog-filters";
import { BlogFeaturedCard } from "@/components/blog/blog-featured-card";
import { BlogPagination } from "@/components/blog/blog-pagination";
import { BlogResources } from "@/components/blog/blog-resources";
import { prisma } from "@/lib/utils/db";

/**
 * RUTA /blog
 * Descripción: Página principal del blog público, con filtrado, destacado y recursos.
 * Requiere: Ninguno
 * Implementa: ISSUE-157
 */

interface PublicBlogPageProps {
  searchParams: {
    page?: string;
    tag?: string;
    search?: string;
    sort?: string;
  };
}

export default async function PublicBlogPage({
  searchParams,
}: PublicBlogPageProps) {
  const page = Number(searchParams.page) || 1;
  const tag = searchParams.tag || undefined;
  const search = searchParams.search || undefined;
  const sort = (searchParams.sort as "recent" | "views") || "recent";

  const totalGlobal = await prisma.blogPost.count({
    where: { status: "PUBLISHED" },
  });

  const postsResponse = await getBlogPosts(
    { page, limit: 12, tag, search, sort },
    false,
  );

  const tagsResponse = await getBlogTags();
  const tags = tagsResponse.map((t) => t.name);

  const posts = postsResponse.data;
  const totalPages = postsResponse.meta.totalPages;

  return (
    <div className="mx-auto min-h-screen max-w-6xl space-y-10 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto mb-12 mt-8 max-w-2xl space-y-4 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 md:text-4xl">
          Nuestro Blog
        </h1>
        <p className="text-base font-normal leading-relaxed text-zinc-700 dark:text-zinc-300 md:text-lg">
          Últimas noticias, consejos y recursos para el cuidado de tus mascotas.
        </p>
      </div>

      {totalGlobal === 0 ? (
        <BlogEmptyState mode="initial" />
      ) : (
        <>
          <BlogFilters tags={tags} />

          {posts.length > 0 ? (
            <>
              {page === 1 && !search && !tag && posts[0] && (
                <BlogFeaturedCard post={posts[0]} />
              )}

              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {posts
                  .slice(page === 1 && !search && !tag ? 1 : 0)
                  .map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
              </div>

              <BlogPagination totalPages={totalPages} />
            </>
          ) : (
            <BlogEmptyState mode="filtered" />
          )}
        </>
      )}

      <hr className="my-16 border-zinc-200 dark:border-zinc-800" />

      <BlogResources />
    </div>
  );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Página principal del blog público, con filtrado, destacado y recursos.
 *
 * Lógica Clave:
 * - Renderiza el primer post como destacado (BlogFeaturedCard) solo en pag 1 sin filtros.
 * - Utiliza estados vacíos diferenciados (initial vs filtered).
 * - Centraliza recursos migrados de /recursos al final de la página.
 */
