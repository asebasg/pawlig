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
    <div className="max-w-4xl mx-auto p-6 space-y-10 min-h-screen">
      <div className="mt-8">
        <Link href="/blog" className="text-sm text-gray-500 hover:text-gray-900 inline-flex items-center gap-1 mb-6">
          <ArrowLeft size={16} /> Volver al blog
        </Link>

        {post.tags && post.tags.length > 0 && (
          <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
            {post.tags.map((tag, i) => (
              <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium whitespace-nowrap">
                {tag}
              </span>
            ))}
          </div>
        )}

        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 pb-8 border-b">
          <div className="flex items-center gap-1.5">
            <Calendar size={16} />
            {format(new Date(post.publishedAt || post.createdAt), "d 'de' MMMM, yyyy", { locale: es })}
          </div>
          <div className="flex items-center gap-1.5">
            <Eye size={16} />
            {post.views} vistas
          </div>
          {post.author?.name && (
            <div className="flex items-center gap-1.5">
              <User size={16} />
              {post.author.name}
            </div>
          )}
        </div>
      </div>

      {post.featured && (
        <div className="w-full h-[400px] md:h-[500px] bg-gray-100 rounded-2xl overflow-hidden relative">
          <img 
            src={post.featured} 
            alt={post.title} 
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="prose prose-lg max-w-none prose-blue">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>

      {relatedPosts.length > 0 && (
        <div className="pt-12 border-t mt-12">
          <h3 className="text-2xl font-bold mb-6">Artículos Relacionados</h3>
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
