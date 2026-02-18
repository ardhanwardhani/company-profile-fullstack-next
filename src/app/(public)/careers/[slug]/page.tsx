'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PublicNavigation } from '@/components/PublicNavigation';
import { PublicFooter } from '@/components/PublicFooter';
import { getPublicSettings, defaultSettings, Settings } from '@/lib/settings';

interface JobPageProps {
  params: Promise<{ slug: string }>;
}

export default function JobPage({ params }: JobPageProps) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then(async (params) => {
      const [settingsData, jobData] = await Promise.all([
        getPublicSettings(),
        fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/public/jobs/${params.slug}`).then(r => r.json()),
      ]);
      
      setSettings(settingsData);
      if (jobData.success && jobData.data) {
        setJob(jobData.data);
        fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/analytics/jobs/${jobData.data.id}/view`, {
          method: 'POST',
        }).catch(console.error);
      } else {
        notFound();
      }
      setLoading(false);
    });
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!job) {
    notFound();
  }

  const companyName = settings.general?.company_name || 'A+ Digital';
  const email = settings.general?.contact_email || '';
  const address = settings.company?.address || '';
  const phone = settings.company?.phone || '';
  const linkedinUrl = settings.company?.linkedin_url || '';
  const twitterUrl = settings.company?.twitter_url || '';
  const facebookUrl = settings.company?.facebook_url || '';

  return (
    <div className="min-h-screen bg-white">
      <PublicNavigation companyName={companyName} activePage="/careers" />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
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
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24">
              <h3 className="font-semibold mb-4">Apply for this position</h3>
              <a
                href={job.apply_url}
                target={job.apply_url.startsWith('mailto:') ? undefined : '_blank'}
                rel={job.apply_url.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                className="block w-full bg-primary-600 text-white text-center py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors mb-4"
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

      <PublicFooter 
        companyName={companyName} 
        address={address} 
        phone={phone} 
        email={email} 
        linkedinUrl={linkedinUrl} 
        twitterUrl={twitterUrl} 
        facebookUrl={facebookUrl} 
      />
    </div>
  );
}
