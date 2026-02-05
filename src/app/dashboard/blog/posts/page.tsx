import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Link from 'next/link';
import { redirect } from 'next/navigation';

async function getBlogPosts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/blog/posts?limit=100`, {
    cache: 'no-store',
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.data || [];
}

async function getCategories() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/master-data/categories`, {
    cache: 'no-store',
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.data || [];
}

export default async function BlogPostsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const role = (session.user as any)?.role;

  if (!['admin', 'editor', 'content_manager'].includes(role)) {
    redirect('/dashboard');
  }

  const [posts, categories] = await Promise.all([getBlogPosts(), getCategories()]);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Blog Posts</h1>
        <Link href="/dashboard/blog/posts/new" className="btn btn-primary">
          New Post
        </Link>
      </div>

      <div className="card mb-6">
        <div className="flex gap-4 flex-wrap">
          <input type="text" placeholder="Search posts..." className="input flex-1 min-w-[200px]" />
          <select className="input w-40">
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="review">Review</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
          <select className="input w-40">
            <option value="">All Categories</option>
            {categories.map((cat: any) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Title</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Category</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Author</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Date</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {posts.map((post: any) => (
              <tr key={post.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <Link href={`/dashboard/blog/posts/${post.id}`} className="font-medium text-gray-900 hover:text-gray-700">
                    {post.title}
                  </Link>
                </td>
                <td className="px-4 py-3 text-gray-600">{post.category?.name || '-'}</td>
                <td className="px-4 py-3 text-gray-600">{post.author?.name || '-'}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex px-2 py-1 text-xs rounded-full ${
                      post.status === 'published' ? 'bg-green-100 text-green-700' : post.status === 'draft' ? 'bg-gray-100 text-gray-700' : post.status === 'review' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {post.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600 text-sm">{post.created_at ? new Date(post.created_at).toLocaleDateString() : '-'}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/dashboard/blog/posts/${post.id}/edit`} className="text-gray-600 hover:text-gray-900 text-sm">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  No blog posts yet.{' '}
                  <Link href="/dashboard/blog/posts/new" className="text-gray-900 hover:underline">
                    Create your first post
                  </Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
