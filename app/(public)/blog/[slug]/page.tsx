/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getBlogPostBySlug, getRelatedBlogPosts } from '@/lib/services/blog.service';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ArrowLeft, Calendar, Eye, User } from 'lucide-react';
import { BlogCard } from '@/components/blog/blog-card';

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPostBySlug(params.slug);

  if (!post || post.status !== 'PUBLISHED') {
    notFound();
  }

  const relatedPosts = await getRelatedBlogPosts(post.slug, 3);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 min-h-screen">
      <div className="mt-8">
        <Link href="/blog" className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2 rounded-sm mb-6">
          <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
          Volver al blog
        </Link>

        {post.tags && post.tags.length > 0 && (
          <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
            {post.tags.map((tag, i) => (
              <span key={i} className="px-3 py-1 bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400 text-xs rounded-full font-medium whitespace-nowrap">
                {tag}
              </span>
            ))}
          </div>
        )}

        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 mb-6">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-zinc-500 dark:text-zinc-400 pb-8 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" strokeWidth={1.5} />
            {format(new Date(post.publishedAt || post.createdAt), "d 'de' MMMM, yyyy", { locale: es })}
          </div>
          <div className="flex items-center gap-1.5">
            <Eye className="w-4 h-4" strokeWidth={1.5} />
            {post.views} vistas
          </div>
          {post.author?.name && (
            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4" strokeWidth={1.5} />
              {post.author.name}
            </div>
          )}
        </div>
      </div>

      {post.featured && (
        <div className="w-full h-[400px] md:h-[500px] bg-zinc-100 dark:bg-zinc-900 rounded-2xl overflow-hidden relative">
          <img 
            src={post.featured} 
            alt={post.title} 
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none prose-zinc">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>

      {relatedPosts.length > 0 && (
        <div className="pt-12 border-t border-zinc-200 dark:border-zinc-800 mt-12">
          <h3 className="text-lg font-medium tracking-tight text-zinc-900 dark:text-zinc-50 mb-6">Artículos Relacionados</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((relatedPost) => (
              <BlogCard key={relatedPost.id} post={relatedPost} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
