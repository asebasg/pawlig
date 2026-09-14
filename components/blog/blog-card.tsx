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
    <Link href={`/blog/${post.slug}`} className="group flex flex-col bg-white border rounded-xl overflow-hidden hover:shadow-md transition-shadow h-full">
      {post.featured && (
        <div className="w-full h-48 bg-gray-100 overflow-hidden relative">
          <img 
            src={post.featured} 
            alt={post.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <div className="p-5 flex-1 flex flex-col">
        {post.tags && post.tags.length > 0 && (
          <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-2">
            {post.tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full font-medium whitespace-nowrap">
                {tag}
              </span>
            ))}
          </div>
        )}
        <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">{post.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">{post.excerpt}</p>
        
        <div className="flex items-center justify-between text-xs text-gray-500 mt-auto pt-4 border-t">
          <div className="flex items-center gap-1.5">
            <Calendar size={14} />
            {format(new Date(post.createdAt), "d 'de' MMMM, yyyy", { locale: es })}
          </div>
          <div className="flex items-center gap-1.5">
            <Eye size={14} />
            {post.views} vistas
          </div>
        </div>
      </div>
    </Link>
  );
}
