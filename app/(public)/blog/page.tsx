import React from 'react';
import { getBlogPosts } from '@/lib/services/blog.service';
import { BlogCard } from '@/components/blog/blog-card';

export default async function PublicBlogPage() {
  const postsResponse = await getBlogPosts({ page: 1, limit: 12, sort: 'recent' }, false);
  const posts = postsResponse.data;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10 min-h-screen">
      <div className="text-center space-y-4 max-w-2xl mx-auto mt-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Nuestro Blog</h1>
        <p className="text-xl text-gray-500">
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
        <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed">
          <p className="text-lg text-gray-500">Aún no hay artículos publicados. ¡Vuelve pronto!</p>
        </div>
      )}
    </div>
  );
}
