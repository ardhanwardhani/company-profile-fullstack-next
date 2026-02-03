import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getJobBySlug, getJobs } from '@/lib/jobs';

export const revalidate = 3600;

export async function generateStaticParams() {
  const jobs = await getJobs({ status: 'open', limit: 100 });
  return jobs.map((job) => ({
    slug: job.slug,
  }));
}

export default async function JobPage({ params }: { params: { slug: string } }) {
  const job = await getJobBySlug(params.slug);

  if (!job) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-primary-600">
                Company Profile
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900">Home</Link>
              <Link href="/careers" className="text-primary-600 font-medium">Careers</Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/careers" className="text-primary-600 hover:text-primary-700 mb-8 inline-block">
          ← Back to Careers
        </Link>

        <header className="mb-8">
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
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
            {job.level && (
              <>
                <span>•</span>
                <span className="capitalize">{job.level}</span>
              </>
            )}
          </div>
          <h1 className="text-4xl font-bold mb-4">{job.title}</h1>
          <p className="text-gray-600">
            Posted {new Date(job.created_at).toLocaleDateString()}
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-4">About the Role</h2>
              <div className="prose">
                {typeof job.description === 'string' ? (
                  <p>{job.description}</p>
                ) : (
                  <p>Role description</p>
                )}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Responsibilities</h2>
              <div className="prose">
                {typeof job.responsibilities === 'string' ? (
                  <p>{job.responsibilities}</p>
                ) : (
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Responsibility details will appear here</li>
                  </ul>
                )}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Requirements</h2>
              <div className="prose">
                {typeof job.requirements === 'string' ? (
                  <p>{job.requirements}</p>
                ) : (
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Requirements will appear here</li>
                  </ul>
                )}
              </div>
            </section>

            {job.benefits && (
              <section>
                <h2 className="text-xl font-semibold mb-4">Benefits</h2>
                <div className="prose">
                  {typeof job.benefits === 'string' ? (
                    <p>{job.benefits}</p>
                  ) : (
                    <p>Benefits information</p>
                  )}
                </div>
              </section>
            )}
          </div>

          <aside>
            <div className="card sticky top-4">
              <h3 className="font-semibold mb-4">Apply for this position</h3>
              <a
                href={job.apply_url}
                target={job.apply_url.startsWith('mailto:') ? undefined : '_blank'}
                rel={job.apply_url.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                className="btn btn-primary w-full text-center mb-4"
              >
                Apply Now
              </a>
              <p className="text-sm text-gray-500 text-center">
                {job.apply_url.startsWith('mailto:') 
                  ? 'Send your application via email'
                  : 'You will be redirected to apply'}
              </p>
            </div>
          </aside>
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 Company Profile. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
