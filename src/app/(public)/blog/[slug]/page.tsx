'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PublicNavigation } from '@/components/PublicNavigation';
import { PublicFooter } from '@/components/PublicFooter';
import { getPublicSettings, defaultSettings, Settings } from '@/lib/settings';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then(async (params) => {
      const [settingsData, postData] = await Promise.all([
        getPublicSettings(),
        fetch(`/api/public/blog/${params.slug}`).then(r => r.json()),
      ]);
      
      setSettings(settingsData);
      if (postData.success && postData.data) {
        setPost(postData.data);
        fetch(`/api/analytics/blog/${postData.data.id}/view`, {
          method: 'POST',
        }).catch(console.error);
      } else {
        notFound();
      }
      setLoading(false);
    });
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!post) {
    notFound();
  }

  const companyName = settings.general?.company_name || 'A+ Digital';
  const email = settings.general?.contact_email || '';
  const address = settings.company?.address || '';
  const phone = settings.company?.phone || '';
  const linkedinUrl = settings.company?.linkedin_url || '';
  const twitterUrl = settings.company?.twitter_url || '';
  const facebookUrl = settings.company?.facebook_url || '';

  return (
    <div className="min-h-screen bg-white">
      <PublicNavigation companyName={companyName} activePage="/blog" />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <Link href="/blog" className="text-primary-600 hover:text-primary-700 mb-8 inline-block">
          ← Back to Blog
        </Link>

        <article>
          <header className="mb-8">
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
              <Link href={`/blog?category=${post.category?.slug}`} className="text-primary-600 hover:underline">
                {post.category?.name}
              </Link>
              <span>•</span>
              <span>{new Date(post.created_at).toLocaleDateString()}</span>
            </div>
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            <div className="flex items-center">
              {post.author?.avatar ? (
                <img src={post.author.avatar} alt={post.author.name} className="w-12 h-12 rounded-full" />
              ) : (
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 text-lg font-medium">
                    {post.author?.name?.charAt(0) || 'A'}
                  </span>
                </div>
              )}
              <div className="ml-3">
                <p className="font-medium">{post.author?.name}</p>
                {post.author?.bio && (
                  <p className="text-sm text-gray-500">{post.author.bio}</p>
                )}
              </div>
            </div>
          </header>

          {post.featured_image && (
            <div 
              className="aspect-video bg-gray-200 rounded-xl mb-8 bg-cover bg-center" 
              style={{ backgroundImage: `url(${post.featured_image})` }}
            />
          )}

          <div className="prose prose-lg max-w-none">
            {post.content ? (
              typeof post.content === 'string' ? (
                <p>{post.content}</p>
              ) : (
                <div dangerouslySetInnerHTML={{ __html: JSON.stringify(post.content) }} />
              )
            ) : (
              <p>No content available</p>
            )}
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="mt-8 pt-8 border-t">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag: any) => (
                  <Link key={tag.id} href={`/blog?tag=${tag.slug}`} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200">
                    {tag.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
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
