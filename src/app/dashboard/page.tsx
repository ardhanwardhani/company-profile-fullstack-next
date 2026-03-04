import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import Link from 'next/link';
import AnalyticsWidget from '@/components/dashboard/AnalyticsWidget';
import { ROLE_GROUPS, ROLES } from '@/lib/roles';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role || 'viewer';

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1 dark:text-gray-400">Welcome back, {session?.user?.name || 'User'}</p>
      </div>

      <div className="mb-8">
        <AnalyticsWidget />
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Available Modules</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ROLE_GROUPS.CAN_MANAGE_BLOG.includes(role) && (
            <Link href="/dashboard/blog/posts" className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors">
              <p className="font-medium text-gray-900  dark:text-gray-100">Blog Management</p>
              <p className="text-sm text-gray-500 mt-1">Posts, Categories, Tags, Authors</p>
            </Link>
          )}
          {(role === ROLES.ADMIN || role === ROLES.HR || role === ROLES.HR_MANAGER) && (
            <Link href="/dashboard/careers/jobs" className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors">
              <p className="font-medium text-gray-900 dark:text-gray-100">Careers Management</p>
              <p className="text-sm text-gray-500 mt-1">Jobs, Departments, Locations</p>
            </Link>
          )}
          {role === ROLES.ADMIN && (
            <Link href="/dashboard/users" className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors">
              <p className="font-medium text-gray-900 dark:text-gray-100">User Management</p>
              <p className="text-sm text-gray-500 mt-1">Manage user accounts and roles</p>
            </Link>
          )}
          {role === ROLES.ADMIN && (
            <Link href="/dashboard/settings" className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors">
              <p className="font-medium text-gray-900 dark:text-gray-100">Settings</p>
              <p className="text-sm text-gray-500 mt-1">Configure site settings and options</p>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
