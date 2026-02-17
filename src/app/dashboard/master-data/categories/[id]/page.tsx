import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getCategoryById } from '@/lib/categories';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Edit, Calendar } from 'lucide-react';
import DeleteCategoryButton from './DeleteCategoryButton';
import BackButton from '@/components/BackButton';

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const role = (session.user as any)?.role;

  if (!['admin', 'hr_manager', 'hr_staff'].includes(role)) {
    redirect('/dashboard');
  }

  const { id } = await params;
  const category = await getCategoryById(id);

  if (!category) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Category Not Found</h1>
        <BackButton href="/dashboard/master-data/categories" label="← Back to Categories" />
      </div>
    );
  }

  const isAdmin = role === 'admin';

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <BackButton href="/dashboard/master-data/categories" label="Back" />
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/dashboard/master-data/categories/${id}/edit`}
            className="btn btn-secondary flex items-center gap-2"
          >
            <Edit size={16} />
            Edit
          </Link>
          {isAdmin && (
            <DeleteCategoryButton categoryId={id} />
          )}
        </div>
      </div>

      <article className="card">
        <header className="mb-6 pb-6 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <StatusBadge isActive={category.is_active} />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">{category.name}</h1>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="font-mono bg-gray-100 px-2 py-1 rounded">{category.slug}</span>
          </div>
        </header>

        {category.description && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
            <p className="text-gray-700">{category.description}</p>
          </div>
        )}

        <footer className="pt-6 border-t border-gray-200">
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>Created: {new Date(category.created_at).toLocaleDateString()}</span>
            </div>
            {category.updated_at && (
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>Updated: {new Date(category.updated_at).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </footer>
      </article>
    </div>
  );
}

function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span className={`inline-flex px-3 py-1 text-sm rounded-full ${isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
      {isActive ? 'Active' : 'Inactive'}
    </span>
  );
}
