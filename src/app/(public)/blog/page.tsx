import Link from 'next/link';

async function getPosts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/blog/posts?status=published&limit=100`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.data || [];
}

async function getCategories() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/blog/categories`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.data || [];
}

export const revalidate = 3600;

export default async function BlogPage() {
  const [posts, categories] = await Promise.all([
    getPosts(),
    getCategories(),
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-primary-600">
                Company Profile
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900">Home</Link>
              <Link href="/about" className="text-gray-600 hover:text-gray-900">About</Link>
              <Link href="/blog" className="text-primary-600 font-medium">Blog</Link>
              <Link href="/careers" className="text-gray-600 hover:text-gray-900">Careers</Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-4">Our Blog</h1>
        <p className="text-xl text-gray-600 mb-8">
          Insights, updates, and stories from our team.
        </p>

        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <button className="px-4 py-2 bg-primary-600 text-white rounded-full text-sm">
              All
            </button>
            {categories.map((cat: any) => (
              <button key={cat.id} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-sm hover:bg-gray-300">
                {cat.name}
              </button>
            ))}
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post: any) => (
            <Link href={`/blog/${post.slug}`} key={post.id} className="card hover:shadow-lg transition-shadow">
              {post.featured_image && (
                <div className="aspect-video bg-gray-200 rounded-lg mb-4" />
              )}
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <span className="text-primary-600">{post.category?.name}</span>
                <span>•</span>
                <span>{new Date(post.created_at).toLocaleDateString()}</span>
              </div>
              <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
              <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 text-sm font-medium">
                    {post.author?.name?.charAt(0) || 'A'}
                  </span>
                </div>
                <span className="ml-2 text-sm text-gray-600">{post.author?.name}</span>
              </div>
            </Link>
          ))}
          {posts.length === 0 && (
            <p className="text-gray-500 col-span-3 text-center py-12">
              No blog posts yet. Check back soon!
            </p>
          )}
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 Company Profile. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
