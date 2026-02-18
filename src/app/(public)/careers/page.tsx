'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PublicNavigation } from '@/components/PublicNavigation';
import { PublicFooter } from '@/components/PublicFooter';
import { getPublicSettings, defaultSettings, Settings } from '@/lib/settings';

export default function CareersPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [jobs, setJobs] = useState<any[]>([]);
  const [lookup, setLookup] = useState<{ departments: any[]; locations: any[] }>({ departments: [], locations: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getPublicSettings(), fetch('/api/careers/jobs?status=open').then((r) => r.json()), fetch('/api/careers/lookup').then((r) => r.json())]).then(
      ([settingsData, jobsData, lookupData]) => {
        setSettings(settingsData);
        setJobs(jobsData.data || []);
        setLookup(lookupData.data || { departments: [], locations: [] });
        setLoading(false);
      },
    );
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const companyName = settings.general?.company_name || 'A+ Digital';
  const email = settings.general?.contact_email || '';
  const address = settings.company?.address || '';
  const phone = settings.company?.phone || '';
  const linkedinUrl = settings.company?.linkedin_url || '';
  const twitterUrl = settings.company?.twitter_url || '';
  const facebookUrl = settings.company?.facebook_url || '';

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNavigation companyName={companyName} activePage="/careers" />

      <main>
        <section className="bg-primary-600 text-white py-16 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold mb-4">Join Our Team</h1>
            <p className="text-xl opacity-90">We're looking for passionate people to help us build the future.</p>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row gap-8">
            <aside className="md:w-64">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h3 className="font-semibold mb-4">Filter Jobs</h3>

                <div className="mb-4">
                  <label className="block text-sm text-gray-600 mb-2">Department</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    <option value="">All Departments</option>
                    {lookup.departments?.map((dept: any) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm text-gray-600 mb-2">Location</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
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
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
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
                  <Link href={`/careers/${job.slug}`} key={job.id} className="block bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow p-6">
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
                    <p className="text-gray-600">Check back later or subscribe to our newsletter for updates.</p>
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

      <PublicFooter companyName={companyName} address={address} phone={phone} email={email} linkedinUrl={linkedinUrl} twitterUrl={twitterUrl} facebookUrl={facebookUrl} />
    </div>
  );
}
