import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import PostStatusButton from '@/components/blog/PostStatusButton';

interface SearchParams {
  search?: string;
  status?: string;
  category_id?: string;
  page?: string;
}

async function getBlogPosts(params: SearchParams) {
  const searchParams = new URLSearchParams();
  if (params.search) searchParams.set('search', params.search);
  if (params.status) searchParams.set('status', params.status);
  if (params.category_id) searchParams.set('category_id', params.category_id);
  searchParams.set('limit', '20');

  const res = await fetch(`/api/blog/posts?${searchParams.toString()}`, { cache: 'no-store' });

  if (!res.ok) return { posts: [], total: 0, totalPages: 1 };

  return {
    posts: (await res.json()).data || [],
    total: parseInt(res.headers.get('X-Total-Count') || '0'),
    totalPages: parseInt(res.headers.get('X-Total-Pages') || '1'),
  };
}

async function getCategories() {
  const res = await fetch('/api/master-data/categories', {
    cache: 'no-store',
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.data || [];
}

async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user as any;
}

export default async function BlogPostsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const resolvedParams = await searchParams;
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  const userRole = user?.role;

  if (!['admin', 'editor', 'content_manager'].includes(userRole)) {
    redirect('/dashboard');
  }

  const [{ posts, total, totalPages }, categories] = await Promise.all([getBlogPosts(resolvedParams), getCategories()]);

  const currentSearch = resolvedParams.search || '';
  const currentStatus = resolvedParams.status || '';
  const currentCategory = resolvedParams.category_id || '';
  const hasFilters = currentSearch || currentStatus || currentCategory;

  const page = parseInt(resolvedParams.page || '1');
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  // Check if user can publish/archive
  const canPublish = ['admin', 'content_manager'].includes(userRole);

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
          <p className="text-sm text-gray-500 mt-1">{total} posts total</p>
        </div>
        <Link href="/dashboard/blog/posts/new" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Post
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <form method="GET" className="flex items-end gap-3">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              name="search"
              defaultValue={currentSearch}
              placeholder="Search posts..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
            <select name="status" defaultValue={currentStatus} className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[140px]">
              <option value="">All Status</option>
              <option value="draft">Draft</option>
              <option value="review">Review</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
            <select name="category_id" defaultValue={currentCategory} className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[160px]">
              <option value="">All Categories</option>
              {categories.map((cat: any) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Button */}
          <button type="submit" className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium">
            Filter
          </button>

          {/* Clear Button */}
          {hasFilters && (
            <Link href="/dashboard/blog/posts" className="px-4 py-2 text-gray-600 hover:text-gray-900 text-sm">
              Clear
            </Link>
          )}
        </form>
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {posts.length > 0 ? (
          <>
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-28">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-28">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-28">Author</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-28">Date</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider w-40">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {posts.map((post: any) => (
                  <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4">
                      <Link href={`/dashboard/blog/posts/${post.id}`} className="font-medium text-gray-900 hover:text-blue-600 transition-colors">
                        {post.title}
                      </Link>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-600">{post.category?.name || '-'}</span>
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={post.status} />
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-600">{post.author?.name || '-'}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-500">{post.created_at ? new Date(post.created_at).toLocaleDateString() : '-'}</span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        {/* Quick Status Actions */}
                        {canPublish && post.status === 'draft' && <PostStatusButton postId={post.id} postTitle={post.title} currentStatus={post.status} targetStatus="published" />}
                        {canPublish && post.status === 'published' && <PostStatusButton postId={post.id} postTitle={post.title} currentStatus={post.status} targetStatus="archived" />}

                        {/* Edit Link */}
                        <Link href={`/dashboard/blog/posts/${post.id}/edit`} className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Page {page} of {totalPages}
                </span>
                <div className="flex items-center gap-2">
                  {hasPrev && (
                    <Link
                      href={`/dashboard/blog/posts?${new URLSearchParams({
                        ...resolvedParams,
                        page: (page - 1).toString(),
                      }).toString()}`}
                      className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                    >
                      Previous
                    </Link>
                  )}
                  {hasNext && (
                    <Link
                      href={`/dashboard/blog/posts?${new URLSearchParams({
                        ...resolvedParams,
                        page: (page + 1).toString(),
                      }).toString()}`}
                      className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                    >
                      Next
                    </Link>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="px-4 py-16 text-center">
            <svg className="w-12 h-12 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500 mb-2">No blog posts found</p>
            <p className="text-sm text-gray-400">{hasFilters ? 'Try adjusting your filters' : 'Create your first post to get started'}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    published: 'bg-green-100 text-green-700',
    draft: 'bg-gray-100 text-gray-700',
    review: 'bg-yellow-100 text-yellow-700',
    archived: 'bg-red-100 text-red-700',
  };

  return <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${styles[status] || 'bg-gray-100 text-gray-700'}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
}
