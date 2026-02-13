import Link from 'next/link';

export const revalidate = 3600;

async function getRecentPosts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/blog/posts?limit=3`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.data || [];
}

async function getOpenJobs() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/careers/jobs?limit=3&status=open`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.data || [];
}

export default async function HomePage() {
  const [recentPosts, openJobs] = await Promise.all([getRecentPosts(), getOpenJobs()]);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-primary-600">
                Company Profile
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/about" className="text-gray-600 hover:text-gray-900">
                About
              </Link>
              <Link href="/blog" className="text-gray-600 hover:text-gray-900">
                Blog
              </Link>
              <Link href="/careers" className="text-gray-600 hover:text-gray-900">
                Careers
              </Link>
              <Link href="/admin" className="text-gray-600 hover:text-gray-900">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <section className="bg-primary-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-5xl font-bold mb-6">About Our Company</h1>
            <p className="text-xl mb-8 opacity-90">We create innovative solutions that make a difference.</p>
            <div className="flex space-x-4">
              <Link href="/careers" className="btn bg-white text-primary-600 hover:bg-gray-100">
                Join Our Team
              </Link>
              <Link href="/about" className="btn border-2 border-white text-white hover:bg-white hover:text-primary-600">
                Learn More
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">Latest from Blog</h2>
              <Link href="/blog" className="text-primary-600 hover:text-primary-700">
                View all →
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {recentPosts.map((post: any) => (
                <Link href={`/blog/${post.slug}`} key={post.id} className="card hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{post.excerpt}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span>{post.author?.name || 'Anonymous'}</span>
                    <span className="mx-2">•</span>
                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                  </div>
                </Link>
              ))}
              {recentPosts.length === 0 && <p className="text-gray-500 col-span-3 text-center">No posts yet.</p>}
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">Open Positions</h2>
              <Link href="/careers" className="text-primary-600 hover:text-primary-700">
                View all →
              </Link>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {openJobs.map((job: any) => (
                <Link href={`/careers/${job.slug}`} key={job.id} className="card hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <span>{job.department?.name}</span>
                    <span>•</span>
                    <span>{job.location?.name}</span>
                    <span>•</span>
                    <span className="capitalize">{job.employment_type?.replace('-', ' ')}</span>
                  </div>
                </Link>
              ))}
              {openJobs.length === 0 && <p className="text-gray-500 col-span-2 text-center">No open positions.</p>}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 Company Profile. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
