import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Link from 'next/link';

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Welcome back!</h3>
          <p className="text-gray-600">
            Logged in as <strong>{session?.user?.name}</strong>
          </p>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Your Role</h3>
          <p className="text-gray-600 capitalize">
            {(session?.user as any)?.role?.replace('_', ' ')}
          </p>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Quick Actions</h3>
          <div className="flex flex-wrap gap-2">
            <Link href="/admin/blog/posts/new" className="btn btn-primary text-sm">
              New Post
            </Link>
            <Link href="/admin/careers/jobs/new" className="btn btn-secondary text-sm">
              New Job
            </Link>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Getting Started</h3>
        <div className="space-y-2 text-gray-600">
          <p>1. Navigate to Blog Posts or Job Listings using the sidebar</p>
          <p>2. Click "New" to create content</p>
          <p>3. Fill in the required fields and publish</p>
          <p>4. Content will appear on the public website</p>
        </div>
      </div>
    </div>
  );
}
