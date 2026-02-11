import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getLocationById } from '@/lib/locations';
import { redirect } from 'next/navigation';
import { Edit, Calendar } from 'lucide-react';
import DeleteLocationButton from './DeleteLocationButton';
import BackButton from '@/components/BackButton';

export default async function LocationDetailPage({
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
  const location = await getLocationById(id);

  if (!location) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Location Not Found</h1>
        <BackButton href="/dashboard/master-data/locations" label="← Back to Locations" />
      </div>
    );
  }

  const isAdmin = role === 'admin';

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <BackButton href="/dashboard/master-data/locations" label="Back" />
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/dashboard/master-data/locations/${id}/edit`}
            className="btn btn-secondary flex items-center gap-2"
          >
            <Edit size={16} />
            Edit
          </Link>
          {isAdmin && (
            <DeleteLocationButton locationId={id} />
          )}
        </div>
      </div>

      <article className="card">
        <header className="mb-6 pb-6 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <StatusBadge isActive={location.is_active} />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">{location.name}</h1>

          <div className="flex items-center gap-2">
            <span className={`inline-flex px-3 py-1 text-sm rounded-full ${location.is_remote ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
              {location.is_remote ? 'Remote' : 'On-site'}
            </span>
          </div>
        </header>

        <footer className="pt-6 border-t border-gray-200">
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>Created: {new Date(location.created_at).toLocaleDateString()}</span>
            </div>
            {location.updated_at && (
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>Updated: {new Date(location.updated_at).toLocaleDateString()}</span>
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
