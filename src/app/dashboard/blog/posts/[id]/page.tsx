import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getBlogPostById } from '@/lib/blog';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowLeft, Edit, Calendar, User, Folder, Tag } from 'lucide-react';
import DeletePostButton from './DeletePostButton';

export default async function BlogPostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }

  const role = (session.user as any)?.role;
  
  if (!['admin', 'editor', 'content_manager'].includes(role)) {
    redirect('/dashboard');
  }

  const { id } = await params;
  const post = await getBlogPostById(id);

  if (!post) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h1>
        <Link href="/dashboard/blog/posts" className="text-primary-600 hover:underline">
          ← Back to Posts
        </Link>
      </div>
    );
  }

  const isAdmin = role === 'admin';

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/blog/posts"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={18} />
            <span>Back</span>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/dashboard/blog/posts/${id}/edit`}
            className="btn btn-secondary flex items-center gap-2"
          >
            <Edit size={16} />
            Edit
          </Link>
          {isAdmin && (
            <DeletePostButton postId={id} />
          )}
        </div>
      </div>

      <article className="card">
        <header className="mb-6 pb-6 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <span className={`inline-flex px-3 py-1 text-sm rounded-full ${
              post.status === 'published' ? 'bg-green-100 text-green-700' :
              post.status === 'draft' ? 'bg-gray-100 text-gray-700' :
              post.status === 'review' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {post.status}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>

          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <User size={16} />
              <span>{post.author?.name || 'Unknown'}</span>
            </div>
            {post.category && (
              <div className="flex items-center gap-2">
                <Folder size={16} />
                <span>{post.category.name}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>Created: {new Date(post.created_at).toLocaleDateString()}</span>
            </div>
            {post.published_at && (
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>Published: {new Date(post.published_at).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </header>

        {post.featured_image && (
          <div className="mb-6">
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        )}

        {post.excerpt && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-600 italic">{post.excerpt}</p>
          </div>
        )}

        {post.content && (
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        )}

        {post.tags && post.tags.length > 0 && (
          <footer className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-2 flex-wrap">
              <Tag size={16} className="text-gray-400" />
              {post.tags.map((tag: any) => (
                <span
                  key={tag.id}
                  className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </footer>
        )}
      </article>
    </div>
  );
}
