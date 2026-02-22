import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getApiUrl } from '@/lib/fetch-utils';
import ProjectStatusButton from './ProjectStatusButton';

interface SearchParams {
  search?: string;
  status?: string;
  category?: string;
  page?: string;
}

async function getProjects(params: SearchParams) {
  const searchParams = new URLSearchParams();
  if (params.search) searchParams.set('search', params.search);
  if (params.status) searchParams.set('status', params.status);
  if (params.category) searchParams.set('category', params.category);
  searchParams.set('limit', '20');

  const res = await fetch(getApiUrl(`/api/projects?${searchParams.toString()}`), { cache: 'no-store' });

  if (!res.ok) return { projects: [], total: 0, totalPages: 1 };

  return {
    projects: (await res.json()).data || [],
    total: parseInt(res.headers.get('X-Total-Count') || '0'),
    totalPages: parseInt(res.headers.get('X-Total-Pages') || '1'),
  };
}

async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user as any;
}

export default async function ProjectsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const resolvedParams = await searchParams;
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  const userRole = user?.role;

  if (!['admin', 'editor', 'content_manager'].includes(userRole)) {
    redirect('/dashboard');
  }

  const { projects, total, totalPages } = await getProjects(resolvedParams);

  const currentSearch = resolvedParams.search || '';
  const currentStatus = resolvedParams.status || '';
  const currentCategory = resolvedParams.category || '';
  const hasFilters = currentSearch || currentStatus || currentCategory;

  const page = parseInt(resolvedParams.page || '1');
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  const canPublish = ['admin', 'content_manager'].includes(userRole);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-sm text-gray-500 mt-1">{total} projects total</p>
        </div>
        <Link href="/dashboard/projects/new" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Project
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
              placeholder="Search projects..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
            <select name="status" defaultValue={currentStatus} className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[140px]">
              <option value="">All Status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <button type="submit" className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium">
            Filter
          </button>

          {hasFilters && (
            <Link href="/dashboard/projects" className="px-4 py-2 text-gray-600 hover:text-gray-900 text-sm">
              Clear
            </Link>
          )}
        </form>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {projects.length > 0 ? (
          <>
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Project</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-28">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-28">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-28">Client</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-28">Date</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider w-40">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {projects.map((project: any) => (
                  <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        {project.featured_image ? (
                          <img src={project.featured_image} alt={project.title} className="w-12 h-12 object-cover rounded" />
                        ) : (
                          <img src="https://placehold.co/48x48/e2e8f0/64748b?text=P" alt={project.title} className="w-12 h-12 object-cover rounded" />
                        )}
                        <Link href={`/dashboard/projects/${project.id}`} className="font-medium text-gray-900 hover:text-blue-600 transition-colors">
                          {project.title}
                        </Link>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-600">{project.category || '-'}</span>
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={project.status} />
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-600">{project.client_name || '-'}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-500">{project.created_at ? new Date(project.created_at).toLocaleDateString() : '-'}</span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        {canPublish && project.status === 'draft' && <ProjectStatusButton projectId={project.id} projectTitle={project.title} currentStatus={project.status} targetStatus="published" />}
                        {canPublish && project.status === 'published' && <ProjectStatusButton projectId={project.id} projectTitle={project.title} currentStatus={project.status} targetStatus="draft" />}
                        <Link href={`/dashboard/projects/${project.id}/edit`} className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
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
                      href={`/dashboard/projects?${new URLSearchParams({
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
                      href={`/dashboard/projects?${new URLSearchParams({
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="text-gray-500 mb-2">No projects found</p>
            <p className="text-sm text-gray-400">{hasFilters ? 'Try adjusting your filters' : 'Create your first project to get started'}</p>
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
  };

  return <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${styles[status] || 'bg-gray-100 text-gray-700'}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
}
