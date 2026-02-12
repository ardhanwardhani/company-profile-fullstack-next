import Link from 'next/link';
import UserStatusButton from './UserStatusButton';
import { getUsers } from '@/lib/users';

interface SearchParams {
  search?: string;
  role?: string;
  status?: string;
  page?: string;
}

async function getUsersData(params: SearchParams) {
  const search = params.search;
  const role = params.role;
  const status = params.status;
  const page = parseInt(params.page || '1');

  const { users, total, totalPages } = await getUsers({
    search,
    role,
    status,
    page,
    limit: 20,
  });

  return { users, total, totalPages };
}

export default async function UsersPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const resolvedParams = await searchParams;
  const { users, total, totalPages } = await getUsersData(resolvedParams);

  const currentSearch = resolvedParams.search || '';
  const currentRole = resolvedParams.role || '';
  const currentStatus = resolvedParams.status || '';
  const hasFilters = currentSearch || currentRole || currentStatus;

  const page = parseInt(resolvedParams.page || '1');
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-sm text-gray-500 mt-1">{total} users total</p>
        </div>
        <Link href="/dashboard/users/new" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New User
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <form method="GET" className="flex items-end gap-3">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              name="search"
              defaultValue={currentSearch}
              placeholder="Search by name or email..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Role</label>
            <select name="role" defaultValue={currentRole} className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[140px]">
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
              <option value="hr">HR</option>
              <option value="content_manager">Content Manager</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
            <select name="status" defaultValue={currentStatus} className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[140px]">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <button type="submit" className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium">
            Filter
          </button>

          {hasFilters && (
            <Link href="/dashboard/users" className="px-4 py-2 text-gray-600 hover:text-gray-900 text-sm">
              Clear
            </Link>
          )}
        </form>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {users.length > 0 ? (
          <>
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-32">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-28">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-32">Last Login</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-28">Date</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider w-40">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user: any) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4">
                      <Link href={`/dashboard/users/${user.id}`} className="font-medium text-gray-900 hover:text-blue-600 transition-colors">
                        {user.name}
                      </Link>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-600">{user.email}</span>
                    </td>
                    <td className="px-4 py-4">
                      <RoleBadge role={user.role} />
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={user.status} />
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-500">{user.last_login_at ? new Date(user.last_login_at).toLocaleDateString() : 'Never'}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-500">{new Date(user.created_at).toLocaleDateString()}</span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <UserStatusButton userId={user.id} userName={user.name} currentStatus={user.status} />
                        <Link href={`/dashboard/users/${user.id}/edit`} className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Page {page} of {totalPages}
                </span>
                <div className="flex items-center gap-2">
                  {hasPrev && (
                    <Link
                      href={`/dashboard/users?${new URLSearchParams({
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
                      href={`/dashboard/users?${new URLSearchParams({
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
            <p className="text-gray-500 mb-2">No users found</p>
            <p className="text-sm text-gray-400">{hasFilters ? 'Try adjusting your filters' : 'Create your first user to get started'}</p>
          </div>
        )}
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

  return <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${colors[role] || 'bg-gray-100 text-gray-700'}`}>{labels[role] || role}</span>;
}

function StatusBadge({ status }: { status: string }) {
  return <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{status === 'active' ? 'Active' : 'Inactive'}</span>;
}
