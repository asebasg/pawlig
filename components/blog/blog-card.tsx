/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Link from 'next/link';
import { BlogPost } from '@prisma/client';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, Eye } from 'lucide-react';

interface BlogCardProps {
  post: BlogPost & { author?: { name: string | null } };
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="group flex flex-col bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md shadow-sm border border-white/60 dark:border-white/10 rounded-2xl overflow-hidden h-full">
      {post.featured && (
        <div className="w-full h-48 bg-zinc-100 dark:bg-zinc-800 overflow-hidden relative">
          <img 
            src={post.featured} 
            alt={post.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <div className="p-4 flex-1 flex flex-col">
        {post.tags && post.tags.length > 0 && (
          <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-2">
            {post.tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="px-2.5 py-0.5 bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400 text-xs rounded-full font-medium whitespace-nowrap">
                {tag}
              </span>
            ))}
          </div>
        )}
        <h3 className="text-base font-medium text-zinc-800 dark:text-zinc-100 mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2">{post.title}</h3>
        <p className="text-sm font-normal leading-relaxed text-zinc-700 dark:text-zinc-300 mb-4 line-clamp-3 flex-1">{post.excerpt}</p>
        
        <div className="flex items-center justify-between text-xs font-medium text-zinc-500 dark:text-zinc-400 mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" strokeWidth={1.5} />
            {format(new Date(post.createdAt), "d 'de' MMMM, yyyy", { locale: es })}
          </div>
          <div className="flex items-center gap-1.5">
            <Eye className="w-4 h-4" strokeWidth={1.5} />
            {post.views} vistas
          </div>
        </div>
      </div>
    </Link>
  );
}
