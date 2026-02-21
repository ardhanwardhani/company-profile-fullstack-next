import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import JobStatusButton from './JobStatusButton';
import { getApiUrl } from '@/lib/fetch-utils';

interface SearchParams {
  search?: string;
  status?: string;
  location_id?: string;
  department_id?: string;
  employment_type?: string;
  page?: string;
}

async function getJobs(params: SearchParams) {
  const searchParams = new URLSearchParams();
  if (params.search) searchParams.set('search', params.search);
  if (params.status) searchParams.set('status', params.status);
  if (params.location_id) searchParams.set('location_id', params.location_id);
  if (params.department_id) searchParams.set('department_id', params.department_id);
  if (params.employment_type) searchParams.set('employment_type', params.employment_type);
  if (params.page) searchParams.set('page', params.page);
  searchParams.set('limit', '20');

  try {
    const res = await fetch(getApiUrl(`/api/careers/jobs?${searchParams.toString()}`), {
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: 'Failed to fetch jobs' }));
      console.error('API Error:', errorData);
      return { jobs: [], total: 0, totalPages: 1, error: errorData.error || 'Failed to fetch jobs' };
    }

    const response = await res.json();

    if (!response.success) {
      console.error('API Error:', response.error);
      return { jobs: [], total: 0, totalPages: 1, error: response.error || 'Failed to fetch jobs' };
    }

    return {
      jobs: response.data || [],
      total: parseInt(res.headers.get('X-Total-Count') || '0'),
      totalPages: parseInt(res.headers.get('X-Total-Pages') || '1'),
    };
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return { jobs: [], total: 0, totalPages: 1, error: 'Network error. Please try again.' };
  }
}

async function getDepartments() {
  try {
    const res = await fetch(getApiUrl('/api/master-data/departments'), { cache: 'no-store' });
    if (!res.ok) return [];
    return (await res.json()).data || [];
  } catch (error) {
    console.error('Error fetching departments:', error);
    return [];
  }
}

async function getLocations() {
  try {
    const res = await fetch(getApiUrl('/api/master-data/locations'), { cache: 'no-store' });
    if (!res.ok) return [];
    return (await res.json()).data || [];
  } catch (error) {
    console.error('Error fetching locations:', error);
    return [];
  }
}

async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user as any;
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-700',
    open: 'bg-green-100 text-green-700',
    closed: 'bg-red-100 text-red-700',
    archived: 'bg-yellow-100 text-yellow-700',
  };

  return <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status] || 'bg-gray-100 text-gray-700'}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
}

export default async function JobsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const resolvedParams = await searchParams;
  const departments = await getDepartments();
  const locations = await getLocations();
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  if (!['admin', 'hr_manager'].includes(user.role)) {
    redirect('/dashboard');
  }

  const { jobs, total, totalPages, error } = await getJobs(resolvedParams);

  const currentSearch = resolvedParams.search || '';
  const currentStatus = resolvedParams.status || '';
  const currentLocationId = resolvedParams.location_id || '';
  const currentDepartmentId = resolvedParams.department_id || '';
  const currentEmploymentType = resolvedParams.employment_type || '';
  const hasFilters = currentSearch || currentStatus || currentLocationId || currentDepartmentId || currentEmploymentType;

  const page = parseInt(resolvedParams.page || '1');
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Job Listings</h1>
          <p className="text-sm text-gray-500">{total} jobs listed</p>
        </div>
        <Link href="/dashboard/careers/jobs/new" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
          Add New Job
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
              placeholder="Search jobs..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Departments</label>
            <select name="department_id" defaultValue={currentDepartmentId} className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[160px]">
              <option value="">All Departments</option>
              {departments.map((dept: any) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Location</label>
            <select name="location_id" defaultValue={currentLocationId} className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[160px]">
              <option value="">All Locations</option>
              {locations.map((cat: any) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Employment Type</label>
            <select name="employment_type" defaultValue={currentEmploymentType} className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[140px]">
              <option value="">All Types</option>
              <option value="full-time">Full-time</option>
              <option value="contract">Contract</option>
              <option value="intern">Intern</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
            <select name="status" defaultValue={currentStatus} className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[140px]">
              <option value="">All Status</option>
              <option value="draft">Draft</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <button type="submit" className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium">
            Filter
          </button>

          {hasFilters && (
            <Link href="/dashboard/careers/jobs" className="px-4 py-2 text-gray-600 hover:text-gray-900 text-sm">
              Clear
            </Link>
          )}
        </form>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          <p className="font-medium">Error loading jobs</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {jobs.length > 0 ? (
          <>
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-28">Department</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-28">Location</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-28">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-28">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-32">Date</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider w-40">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {jobs.map((job: any) => (
                  <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4">
                      <Link href={`/dashboard/careers/jobs/${job.id}`} className="font-medium text-gray-900 hover:text-blue-600 transition-colors">
                        {job.title}
                      </Link>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-600">{job.department?.name || '-'}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-600">{job.location?.name || '-'}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-600">{job.employment_type ? job.employment_type.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) : '-'}</span>
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={job.status} />
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-500">{job.created_at ? new Date(job.created_at).toLocaleDateString() : '-'}</span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        {user.role === 'admin' && job.status === 'draft' && (
                          <JobStatusButton jobId={job.id} jobTitle={job.title} currentStatus={job.status} targetStatus="open" />
                        )}
                        {(user.role === 'admin' || user.role === 'hr_manager') && job.status === 'open' && (
                          <JobStatusButton jobId={job.id} jobTitle={job.title} currentStatus={job.status} targetStatus="archived" />
                        )}
                        <Link href={`/dashboard/careers/jobs/${job.id}/edit`} className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
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
                      href={`/dashboard/careers/jobs?${new URLSearchParams({
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
                      href={`/dashboard/careers/jobs?${new URLSearchParams({
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
            <p className="text-gray-500 mb-2">No jobs found</p>
            <p className="text-sm text-gray-400">{hasFilters ? 'Try adjusting your filters' : 'Create your first job posting to get started'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
