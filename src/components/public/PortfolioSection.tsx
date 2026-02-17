'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
import { SectionWrapper } from '@/components/ui/section-wrapper';

const projects = [
  {
    title: 'TechStart Platform',
    category: 'Web Application',
    description: 'A comprehensive platform for startups to manage their operations, track metrics, and collaborate with investors.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    tags: ['React', 'Node.js', 'PostgreSQL'],
  },
  {
    title: 'Mobile Banking App',
    category: 'Mobile Application',
    description: 'Secure and intuitive mobile banking solution with real-time transactions and biometric authentication.',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80',
    tags: ['React Native', 'Firebase', 'AWS'],
  },
  {
    title: 'E-Commerce Dashboard',
    category: 'Web Application',
    description: 'Full-featured admin dashboard for managing products, orders, and analytics for online retailers.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    tags: ['Next.js', 'GraphQL', 'Stripe'],
  },
];

export function PortfolioSection() {
  return (
    <SectionWrapper id="portfolio" className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-1 bg-primary-700"></div>
            <span className="text-primary-700 uppercase tracking-widest text-sm font-medium">Our Work</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Projects</h2>
              <p className="text-xl text-gray-600 max-w-2xl">A showcase of our recent work and successful client collaborations.</p>
            </div>
            <Link 
              href="/work" 
              className="inline-flex items-center gap-2 text-primary-700 hover:text-primary-800 font-medium transition-colors"
            >
              View All Projects <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-5">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4">
                    <Link 
                      href={`/work/${project.title.toLowerCase().replace(/\s+/g, '-')}`}
                      className="inline-flex items-center gap-2 text-white font-medium"
                    >
                      View Case Study <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-900 text-sm font-medium rounded-full">
                    {project.category}
                  </span>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-700 transition-colors">
                {project.title}
              </h3>
              <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
              
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span 
                    key={tag}
                    className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
