import Link from 'next/link';
import DepartmentStatusButton from './DepartmentStatusButton';

interface SearchParams {
  search?: string;
  status?: string;
  page?: string;
}

async function getDepartments(params: SearchParams) {
  const searchParams = new URLSearchParams();
  if (params.search) searchParams.set('search', params.search);
  if (params.status) searchParams.set('status', params.status);
  searchParams.set('page', params.page || '1');
  searchParams.set('limit', '20');

  const res = await fetch(`/api/master-data/departments?${searchParams.toString()}`, { cache: 'no-store' });

  if (!res.ok) return { departments: [], total: 0, totalPages: 1 };

  return {
    departments: (await res.json()).data || [],
    total: parseInt(res.headers.get('X-Total-Count') || '0'),
    totalPages: parseInt(res.headers.get('X-Total-Pages') || '1'),
  };
}

export default async function DepartmentsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const resolvedParams = await searchParams;
  const { departments, total, totalPages } = await getDepartments(resolvedParams);

  const currentSearch = resolvedParams.search || '';
  const currentStatus = resolvedParams.status || '';
  const hasFilters = currentSearch || currentStatus;

  const page = parseInt(resolvedParams.page || '1');
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
          <p className="text-sm text-gray-500 mt-1">{total} departments total</p>
        </div>
        <Link href="/dashboard/master-data/departments/new" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Department
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
              placeholder="Search departments..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
            <select
              name="status"
              defaultValue={currentStatus}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[140px]"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <button type="submit" className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium">
            Filter
          </button>

          {hasFilters && (
            <Link href="/dashboard/master-data/departments" className="px-4 py-2 text-gray-600 hover:text-gray-900 text-sm">
              Clear
            </Link>
          )}
        </form>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {departments.length > 0 ? (
          <>
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-28">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-28">Date</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider w-40">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {departments.map((department: any) => (
                  <tr key={department.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4">
                      <Link href={`/dashboard/master-data/departments/${department.id}`} className="font-medium text-gray-900 hover:text-blue-600 transition-colors">
                        {department.name}
                      </Link>
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge isActive={department.is_active} />
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-500">{new Date(department.created_at).toLocaleDateString()}</span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <DepartmentStatusButton departmentId={department.id} departmentName={department.name} currentStatus={department.is_active} />
                        <Link href={`/dashboard/master-data/departments/${department.id}/edit`} className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
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
                      href={`/dashboard/master-data/departments?${new URLSearchParams({
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
                      href={`/dashboard/master-data/departments?${new URLSearchParams({
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
            <p className="text-gray-500 mb-2">No departments found</p>
            <p className="text-sm text-gray-400">{hasFilters ? 'Try adjusting your filters' : 'Create your first department to get started'}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
      {isActive ? 'Active' : 'Inactive'}
    </span>
  );
}
