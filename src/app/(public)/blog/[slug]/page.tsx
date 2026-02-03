import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getBlogPostBySlug, getBlogPosts } from '@/lib/blog';

export const revalidate = 3600;

export async function generateStaticParams() {
  const posts = await getBlogPosts({ status: 'published', limit: 100 });
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-primary-600">
                Company Profile
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900">Home</Link>
              <Link href="/blog" className="text-primary-600 font-medium">Blog</Link>
              <Link href="/careers" className="text-gray-600 hover:text-gray-900">Careers</Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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

          {post.cover_image_id && (
            <div className="aspect-video bg-gray-200 rounded-xl mb-8" />
          )}

          <div className="prose prose-lg max-w-none">
            {typeof post.content === 'string' ? (
              <p>{post.content}</p>
            ) : (
              <p>{JSON.stringify(post.content)}</p>
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

      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 Company Profile. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
