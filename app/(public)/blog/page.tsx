import React from 'react';
import { getBlogPosts } from '@/lib/services/blog.service';
import { BlogCard } from '@/components/blog/blog-card';

export default async function PublicBlogPage() {
  const postsResponse = await getBlogPosts({ page: 1, limit: 12, sort: 'recent' }, false);
  const posts = postsResponse.data;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 min-h-screen">
      <div className="text-center space-y-4 max-w-2xl mx-auto mt-8">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">Nuestro Blog</h1>
        <p className="text-sm font-normal leading-relaxed text-zinc-700 dark:text-zinc-300">
          Últimas noticias, consejos y recursos para el cuidado de tus mascotas.
        </p>
      </div>

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Aún no hay artículos publicados. ¡Vuelve pronto!</p>
        </div>
      )}
    </div>
  );
}
