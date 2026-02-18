import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { SectionWrapper } from '@/components/ui/section-wrapper';
import { BlogGrid } from './blog-grid';

async function getRecentPosts() {
  try {
    const res = await fetch('/api/blog/posts?limit=4&status=published', {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

export async function LatestPosts() {
  const recentPosts = await getRecentPosts();

  return (
    <SectionWrapper id="blog" className="bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">Latest from Blog</h2>
            <p className="text-xl text-neutral-600">Insights, tutorials, and updates from our team.</p>
          </div>
          <Link href="/blog" className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium group">
            View all posts
            <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <BlogGrid posts={recentPosts} />
      </div>
    </SectionWrapper>
  );
}
