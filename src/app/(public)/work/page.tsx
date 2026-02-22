'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PublicNavigation } from '@/components/PublicNavigation';
import { PublicFooter } from '@/components/PublicFooter';
import { getPublicSettings, defaultSettings, Settings } from '@/lib/settings';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  featured_image: string;
  technologies: string[];
  client_name: string;
}

export default function WorkPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getPublicSettings(),
      fetch('/api/public/projects?limit=100').then(r => r.json()),
    ]).then(([settingsData, projectsData]) => {
      setSettings(settingsData);
      setProjects(projectsData.data || []);
      setLoading(false);
    });
  }, []);

  const companyName = settings.general?.company_name || 'A+ Digital';
  const email = settings.general?.contact_email || '';
  const address = settings.company?.address || '';
  const phone = settings.company?.phone || '';
  const linkedinUrl = settings.company?.linkedin_url || '';
  const twitterUrl = settings.company?.twitter_url || '';
  const facebookUrl = settings.company?.facebook_url || '';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNavigation companyName={companyName} activePage="/work" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-1 bg-primary-700"></div>
            <span className="text-primary-700 uppercase tracking-widest text-sm font-medium">Our Work</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Featured Projects</h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            A showcase of our recent work and successful client collaborations.
          </p>
        </motion.div>

        {projects.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group cursor-pointer"
              >
                <Link href={`/work/${project.slug}`}>
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-5">
                    {project.featured_image ? (
                      <img 
                        src={project.featured_image} 
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">No image</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 right-4">
                        <span className="inline-flex items-center gap-2 text-white font-medium">
                          View Project <ArrowUpRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                    {project.category && (
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-900 text-sm font-medium rounded-full">
                          {project.category}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-700 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
                  
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <span 
                          key={tech}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No projects to display yet.</p>
            <p className="text-gray-400 mt-2">Check back soon!</p>
          </div>
        )}
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
