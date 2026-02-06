'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  author?: {
    name: string;
  };
  created_at: string;
}

interface BlogGridProps {
  posts: BlogPost[];
}

export function BlogGrid({ posts }: BlogGridProps) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {posts.length > 0 ? (
        posts.slice(0, 4).map((post, index) => (
          <Link key={post.id} href={`/blog/${post.slug}`}>
            <Card delay={index * 0.1} className="h-full hover:border-primary-200">
              <div className="aspect-video bg-neutral-100" />
              <div className="p-6">
                <h3 className="font-semibold text-neutral-900 mb-2 line-clamp-2">{post.title}</h3>
                <p className="text-sm text-neutral-600 line-clamp-3 mb-4">{post.excerpt}</p>
                <div className="flex items-center text-xs text-neutral-500">
                  <span>{post.author?.name || 'Anonymous'}</span>
                  <span className="mx-2">•</span>
                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </Card>
          </Link>
        ))
      ) : (
        <>
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="h-full p-6">
              <div className="aspect-video bg-neutral-100 rounded-lg mb-4" />
              <h3 className="font-semibold text-neutral-900 mb-2">Building Modern Web Applications</h3>
              <p className="text-sm text-neutral-600 mb-4">Learn the latest techniques for creating fast, accessible websites.</p>
              <div className="flex items-center text-xs text-neutral-500">
                <span>Author Name</span>
                <span className="mx-2">•</span>
                <span>Jan {10 + i}, 2025</span>
              </div>
            </Card>
          ))}
        </>
      )}
    </div>
  );
}
