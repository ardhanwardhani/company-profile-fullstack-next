'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PublicNavigation } from '@/components/PublicNavigation';
import { PublicFooter } from '@/components/PublicFooter';
import { getPublicSettings, defaultSettings, Settings } from '@/lib/settings';

export default function BlogPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [posts, setPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getPublicSettings(),
      fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/blog/posts?status=published&limit=100`).then(r => r.json()),
      fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/blog/categories`).then(r => r.json()),
    ]).then(([settingsData, postsData, categoriesData]) => {
      setSettings(settingsData);
      setPosts(postsData.data || []);
      setCategories(categoriesData.data || []);
      setLoading(false);
    });
  }, []);

  const filteredPosts = selectedCategory
    ? posts.filter((post: any) => post.category?.id === selectedCategory)
    : posts;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const companyName = settings.general?.company_name || 'A+ Digital';
  const email = settings.general?.contact_email || '';
  const address = settings.company?.address || '';
  const phone = settings.company?.phone || '';
  const linkedinUrl = settings.company?.linkedin_url || '';
  const twitterUrl = settings.company?.twitter_url || '';
  const facebookUrl = settings.company?.facebook_url || '';

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNavigation companyName={companyName} activePage="/blog" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h1 className="text-4xl font-bold mb-4">Our Blog</h1>
        <p className="text-xl text-gray-600 mb-8">Insights, updates, and stories from our team.</p>

        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === null
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All
            </button>
            {categories.map((cat: any) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post: any) => (
            <Link href={`/blog/${post.slug}`} key={post.id} className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow overflow-hidden">
              {post.featured_image && (
                <div 
                  className="aspect-video bg-gray-200 rounded-t-lg bg-cover bg-center" 
                  style={{ backgroundImage: `url(${post.featured_image})` }}
                />
              )}
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <span className="text-primary-600">{post.category?.name}</span>
                  <span>•</span>
                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
                </div>
                <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 text-sm font-medium">{post.author?.name?.charAt(0) || 'A'}</span>
                  </div>
                  <span className="ml-2 text-sm text-gray-600">{post.author?.name}</span>
                </div>
              </div>
            </Link>
          ))}
          {filteredPosts.length === 0 && (
            <p className="text-gray-500 col-span-3 text-center py-12">
              {selectedCategory ? 'No posts found in this category.' : 'No blog posts yet. Check back soon!'}
            </p>
          )}
        </div>
      </main>

      <PublicFooter 
        companyName={companyName} 
        address={address} 
        phone={phone} 
        email={email} 
        linkedinUrl={linkedinUrl} 
        twitterUrl={twitterUrl} 
        facebookUrl={facebookUrl} 
      />
    </div>
  );
}
