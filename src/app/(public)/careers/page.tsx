import Link from 'next/link';

async function getJobs() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/careers/jobs?status=open`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.data || [];
}

async function getLookup() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/careers/lookup`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return { departments: [], locations: [] };
  const data = await res.json();
  return data.data || { departments: [], locations: [] };
}

export const revalidate = 3600;

export default async function CareersPage() {
  const [jobs, lookup] = await Promise.all([
    getJobs(),
    getLookup(),
  ]);

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
              <Link href="/" className="text-gray-600 hover:text-gray-900">Home</Link>
              <Link href="/about" className="text-gray-600 hover:text-gray-900">About</Link>
              <Link href="/blog" className="text-gray-600 hover:text-gray-900">Blog</Link>
              <Link href="/careers" className="text-primary-600 font-medium">Careers</Link>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <section className="bg-primary-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold mb-4">Join Our Team</h1>
            <p className="text-xl opacity-90">
              We're looking for passionate people to help us build the future.
            </p>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row gap-8">
            <aside className="md:w-64">
              <div className="card sticky top-4">
                <h3 className="font-semibold mb-4">Filter Jobs</h3>
                
                <div className="mb-4">
                  <label className="block text-sm text-gray-600 mb-2">Department</label>
                  <select className="input">
                    <option value="">All Departments</option>
                    {lookup.departments?.map((dept: any) => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm text-gray-600 mb-2">Location</label>
                  <select className="input">
                    <option value="">All Locations</option>
                    {lookup.locations?.map((loc: any) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.name} {loc.is_remote && '(Remote)'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">Type</label>
                  <select className="input">
                    <option value="">All Types</option>
                    <option value="full-time">Full-time</option>
                    <option value="contract">Contract</option>
                    <option value="intern">Intern</option>
                  </select>
                </div>
              </div>
            </aside>

            <div className="flex-1">
              <p className="text-gray-600 mb-6">{jobs.length} open positions</p>

              <div className="space-y-4">
                {jobs.map((job: any) => (
                  <Link href={`/careers/${job.slug}`} key={job.id} className="card hover:shadow-lg transition-shadow block">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <span>{job.department?.name}</span>
                          <span>•</span>
                          <span>{job.location?.name}</span>
                          {job.location?.is_remote && (
                            <>
                              <span>•</span>
                              <span className="text-green-600">Remote</span>
                            </>
                          )}
                          <span>•</span>
                          <span className="capitalize">{job.employment_type?.replace('-', ' ')}</span>
                        </div>
                      </div>
                      <span className="text-primary-600 font-medium">Apply →</span>
                    </div>
                  </Link>
                ))}
                {jobs.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">No open positions at the moment.</p>
                    <p className="text-gray-600">
                      Check back later or subscribe to our newsletter for updates.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-6">Why Work With Us?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-2">Remote-Friendly</h3>
                <p className="text-gray-600">Work from anywhere. We trust you to manage your time.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Growth Opportunities</h3>
                <p className="text-gray-600">Learning budget and clear career progression paths.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Great Benefits</h3>
                <p className="text-gray-600">Health insurance, PTO, and competitive compensation.</p>
              </div>
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
