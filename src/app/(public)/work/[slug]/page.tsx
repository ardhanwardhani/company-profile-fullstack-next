'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PublicNavigation } from '@/components/PublicNavigation';
import { PublicFooter } from '@/components/PublicFooter';
import { getPublicSettings, defaultSettings, Settings } from '@/lib/settings';
import { ArrowLeft, ExternalLink, Calendar } from 'lucide-react';

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  category: string;
  featured_image: string;
  images: string[];
  technologies: string[];
  client_name: string;
  live_url: string;
  case_study_url: string;
  created_at: string;
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then(async (params) => {
      const [settingsData, projectData] = await Promise.all([
        getPublicSettings(),
        fetch(`/api/public/projects/${params.slug}`).then(r => r.json()),
      ]);
      
      setSettings(settingsData);
      if (projectData.success && projectData.data) {
        setProject(projectData.data);
      } else {
        notFound();
      }
      setLoading(false);
    });
  }, [params]);

  const companyName = settings.general?.company_name || 'A+ Digital';
  const email = settings.general?.contact_email || '';
  const address = settings.company?.address || '';
  const phone = settings.company?.phone || '';
  const linkedinUrl = settings.company?.linkedin_url || '';
  const twitterUrl = settings.company?.twitter_url || '';
  const facebookUrl = settings.company?.facebook_url || '';

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <PublicNavigation companyName={companyName} activePage="/work" />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <Link href="/work" className="text-primary-600 hover:text-primary-700 mb-8 inline-block">
          ← Back to Projects
        </Link>

        <article>
          <header className="mb-8">
            {project.category && (
              <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full mb-4">
                {project.category}
              </span>
            )}
            <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
              {project.client_name && (
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">Client:</span>
                  <span>{project.client_name}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{new Date(project.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </header>

          {project.featured_image && (
            <div className="aspect-video bg-gray-200 rounded-xl mb-8 overflow-hidden">
              <img
                src={project.featured_image}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {project.technologies && project.technologies.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span 
                    key={tech}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {project.description && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3">Overview</h3>
              <p className="text-gray-600">{project.description}</p>
            </div>
          )}

          {project.content && (
            <div className="prose prose-lg max-w-none mb-8" dangerouslySetInnerHTML={{ __html: project.content }} />
          )}

          {(project.live_url || project.case_study_url) && (
            <div className="flex gap-4 mb-8">
              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                >
                  Visit Live Site <ExternalLink size={16} />
                </a>
              )}
              {project.case_study_url && (
                <a
                  href={project.case_study_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Read Case Study <ExternalLink size={16} />
                </a>
              )}
            </div>
          )}
        </article>
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
