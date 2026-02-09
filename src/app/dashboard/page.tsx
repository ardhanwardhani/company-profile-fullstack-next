import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Link from 'next/link';
import AnalyticsWidget from '@/components/dashboard/AnalyticsWidget';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role || 'viewer';

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">Welcome back, {session?.user?.name || 'User'}</p>
      </div>

      <div className="mb-8">
        <AnalyticsWidget />
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <h3 className="text-lg font-semibold mb-2 text-gray-900">Your Role</h3>
          <p className="text-gray-600 capitalize">{role.replace('_', ' ')}</p>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-2 text-gray-900">Quick Actions</h3>
          <div className="flex flex-wrap gap-2">
            {(role === 'admin' || role === 'editor' || role === 'content_manager') && (
              <Link href="/dashboard/blog/posts/new" className="btn btn-primary text-sm">
                New Post
              </Link>
            )}
            {(role === 'admin' || role === 'hr') && (
              <Link href="/dashboard/careers/jobs/new" className="btn btn-secondary text-sm">
                New Job
              </Link>
            )}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-2 text-gray-900">Getting Started</h3>
          <p className="text-gray-600 text-sm">Use the sidebar to navigate to Blog Posts, Job Listings, or other sections.</p>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Available Modules</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(role === 'admin' || role === 'editor' || role === 'content_manager') && (
            <Link href="/dashboard/blog/posts" className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors">
              <p className="font-medium text-gray-900">Blog Management</p>
              <p className="text-sm text-gray-500 mt-1">Posts, Categories, Tags, Authors</p>
            </Link>
          )}
          {(role === 'admin' || role === 'hr') && (
            <Link href="/dashboard/careers/jobs" className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors">
              <p className="font-medium text-gray-900">Careers Management</p>
              <p className="text-sm text-gray-500 mt-1">Jobs, Departments, Locations</p>
            </Link>
          )}
          {role === 'admin' && (
            <Link href="/dashboard/users" className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors">
              <p className="font-medium text-gray-900">User Management</p>
              <p className="text-sm text-gray-500 mt-1">Manage user accounts and roles</p>
            </Link>
          )}
          {role === 'admin' && (
            <Link href="/dashboard/settings" className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors">
              <p className="font-medium text-gray-900">Settings</p>
              <p className="text-sm text-gray-500 mt-1">Configure site settings and options</p>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
