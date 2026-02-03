import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/admin" className="text-xl font-bold text-primary-600">
                CMS Dashboard
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">
                {session.user?.name} ({session.user?.role})
              </span>
              <Link href="/api/auth/signout" className="text-gray-600 hover:text-gray-900">
                Sign Out
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        <aside className="w-64 bg-white shadow-sm min-h-screen p-4">
          <nav className="space-y-2">
            <Link href="/admin/dashboard" className="block px-4 py-2 rounded-lg hover:bg-gray-100">
              Dashboard
            </Link>
            
            {(session.user as any).role === 'admin' || (session.user as any).role === 'content_manager' || (session.user as any).role === 'editor' ? (
              <Link href="/admin/blog/posts" className="block px-4 py-2 rounded-lg hover:bg-gray-100">
                Blog Posts
              </Link>
            ) : null}
            
            {(session.user as any).role === 'admin' || (session.user as any).role === 'content_manager' ? (
              <Link href="/admin/blog/categories" className="block px-4 py-2 rounded-lg hover:bg-gray-100">
                Categories
              </Link>
            ) : null}
            
            {(session.user as any).role === 'admin' || (session.user as any).role === 'hr' ? (
              <Link href="/admin/careers/jobs" className="block px-4 py-2 rounded-lg hover:bg-gray-100">
                Job Listings
              </Link>
            ) : null}
            
            {(session.user as any).role === 'admin' || (session.user as any).role === 'hr' ? (
              <Link href="/admin/careers/lookup" className="block px-4 py-2 rounded-lg hover:bg-gray-100">
                Departments & Locations
              </Link>
            ) : null}
            
            {(session.user as any).role === 'admin' ? (
              <Link href="/admin/users" className="block px-4 py-2 rounded-lg hover:bg-gray-100">
                User Management
              </Link>
            ) : null}
          </nav>
        </aside>

        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
