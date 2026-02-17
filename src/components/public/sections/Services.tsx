'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { SectionWrapper } from '@/components/ui/section-wrapper';
import { Briefcase, Code2, Palette, ArrowUpRight } from 'lucide-react';

const services = [
  {
    icon: Briefcase,
    title: 'Company Profile Package',
    description: 'Complete CMS solution with job listings, blog management, and customizable company profiles tailored to your brand.',
    href: '/services/company-profile',
    image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80',
    imageAlt: 'Modern corporate website on laptop',
  },
  {
    icon: Code2,
    title: 'Custom Software Development',
    description: 'Tailored software solutions built from scratch to address your unique business challenges and requirements.',
    href: '/services/custom-software',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
    imageAlt: 'Developer writing code on computer',
  },
  {
    icon: Palette,
    title: 'Creative Design',
    description: 'Brand identity, UI/UX design, and visual storytelling that elevates your digital presence.',
    href: '/services/creative-design',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
    imageAlt: 'Design workspace with sketches and tools',
  },
];

export function Services() {
  return (
    <SectionWrapper id="services" className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-1 bg-primary-700"></div>
            <span className="text-primary-700 uppercase tracking-widest text-sm font-medium">What We Do</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
          <p className="text-xl text-gray-600 max-w-2xl">Comprehensive digital solutions designed to help your business grow and succeed in the digital landscape.</p>
        </motion.div>

        <div className="space-y-24">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 lg:gap-20`}
            >
              <div className="flex-1">
                <div className="w-16 h-16 bg-primary-700 flex items-center justify-center mb-6">
                  <service.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed text-lg">{service.description}</p>
                <Link 
                  href={service.href || '#'} 
                  className="inline-flex items-center gap-2 text-primary-700 hover:text-primary-800 mt-6 font-medium transition-colors"
                >
                  Learn more <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="flex-1 w-full">
                <div className="relative rounded-xl overflow-hidden shadow-lg group">
                  <img 
                    src={service.image}
                    alt={service.imageAlt}
                    className="w-full h-auto object-cover aspect-video group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
