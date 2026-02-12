import Link from 'next/link';
import { notFound } from 'next/navigation';
import UserStatusButton from '../UserStatusButton';
import DeleteUserButton from '../DeleteUserButton';
import AvatarUploadClient from '../AvatarUploadClient';

async function getUser(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/users/${id}`, { cache: 'no-store' });

  if (!res.ok) return null;

  const data = await res.json();
  return data.data || null;
}

export default async function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getUser(id);

  if (!user) {
    notFound();
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="mb-8">
        <Link href="/dashboard/users" className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-block">
          ← Back to Users
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden text-2xl font-bold text-gray-600">
              {user.avatar_url ? (
                <img src={`/uploads/avatars/${user.avatar_url}`} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-500">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href={`/dashboard/users/${user.id}/edit`} className="btn btn-secondary">
              Edit
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card md:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">User Details</h2>
          <dl className="space-y-4">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <dt className="text-gray-500">Role</dt>
              <dd className="font-medium">
                <RoleBadge role={user.role} />
              </dd>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <dt className="text-gray-500">Status</dt>
              <dd className="font-medium">
                <StatusBadge status={user.status} />
              </dd>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <dt className="text-gray-500">Last Login</dt>
              <dd className="font-medium text-gray-900">
                {user.last_login_at ? new Date(user.last_login_at).toLocaleString() : 'Never logged in'}
              </dd>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <dt className="text-gray-500">Created</dt>
              <dd className="font-medium text-gray-900">{new Date(user.created_at).toLocaleString()}</dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="text-gray-500">Last Updated</dt>
              <dd className="font-medium text-gray-900">
                {user.updated_at ? new Date(user.updated_at).toLocaleString() : '-'}
              </dd>
            </div>
          </dl>
        </div>

        <div className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Avatar</h2>
            <AvatarUploadClient userId={user.id} currentAvatar={user.avatar_url} />
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
            <div className="space-y-3">
              <UserStatusButton userId={user.id} userName={user.name} currentStatus={user.status} />
              <DeleteUserButton userId={user.id} userName={user.name} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  const colors: Record<string, string> = {
    admin: 'bg-purple-100 text-purple-700',
    editor: 'bg-blue-100 text-blue-700',
    hr: 'bg-green-100 text-green-700',
    content_manager: 'bg-orange-100 text-orange-700',
  };

  const labels: Record<string, string> = {
    admin: 'Admin',
    editor: 'Editor',
    hr: 'HR',
    content_manager: 'Content Manager',
  };

  return (
    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${colors[role] || 'bg-gray-100 text-gray-700'}`}>
      {labels[role] || role}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
      {status === 'active' ? 'Active' : 'Inactive'}
    </span>
  );
}
