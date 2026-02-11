import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getDepartmentById } from '@/lib/departments';
import { redirect } from 'next/navigation';
import { Edit, Calendar } from 'lucide-react';
import DeleteDepartmentButton from './DeleteDepartmentButton';
import BackButton from '@/components/BackButton';

export default async function DepartmentDetailPage({
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
  const department = await getDepartmentById(id);

  if (!department) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Department Not Found</h1>
        <BackButton href="/dashboard/master-data/departments" label="← Back to Departments" />
      </div>
    );
  }

  const isAdmin = role === 'admin';

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <BackButton href="/dashboard/master-data/departments" label="Back" />
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/dashboard/master-data/departments/${id}/edit`}
            className="btn btn-secondary flex items-center gap-2"
          >
            <Edit size={16} />
            Edit
          </Link>
          {isAdmin && (
            <DeleteDepartmentButton departmentId={id} />
          )}
        </div>
      </div>

      <article className="card">
        <header className="mb-6 pb-6 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <StatusBadge isActive={department.is_active} />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">{department.name}</h1>
        </header>

        <footer className="pt-6 border-t border-gray-200">
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>Created: {new Date(department.created_at).toLocaleDateString()}</span>
            </div>
            {department.updated_at && (
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>Updated: {new Date(department.updated_at).toLocaleDateString()}</span>
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
