'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PublicNavigation } from '@/components/PublicNavigation';
import { PublicFooter } from '@/components/PublicFooter';
import { getPublicSettings, defaultSettings, Settings } from '@/lib/settings';
import { Users, Award, Heart, Target, Clock, Globe, Lightbulb, Shield } from 'lucide-react';

const teamMembers = [
  {
    name: 'John Doe',
    role: 'Chief Executive Officer',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop',
  },
  {
    name: 'Jane Smith',
    role: 'Chief Technology Officer',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
  },
  {
    name: 'Michael Johnson',
    role: 'Head of Design',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
  },
  {
    name: 'Sarah Williams',
    role: 'Head of Marketing',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop',
  },
];

const historyMilestones = [
  { year: '2018', title: 'Company Founded', description: 'Started with a vision to transform digital experiences.' },
  { year: '2019', title: 'First Major Client', description: 'Onboarded our first enterprise client.' },
  { year: '2020', title: 'Team Expansion', description: 'Grew to 20 talented team members.' },
  { year: '2021', title: 'Global Reach', description: 'Expanded services to international markets.' },
  { year: '2022', title: 'Innovation Award', description: 'Received recognition for innovative solutions.' },
  { year: '2023', title: '100+ Projects', description: 'Successfully delivered over 100 projects.' },
];

const cultureValues = [
  {
    icon: Heart,
    title: 'People First',
    description: 'We prioritize the well-being and growth of our team members and clients.',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'We constantly push boundaries to find creative solutions to complex problems.',
  },
  {
    icon: Users,
    title: 'Collaboration',
    description: 'We believe the best results come from working together as one team.',
  },
  {
    icon: Globe,
    title: 'Global Mindset',
    description: 'We embrace diversity and work with clients from around the world.',
  },
];

const principles = [
  {
    icon: Target,
    title: 'Customer Focus',
    description: 'We put our customers at the center of everything we do.',
  },
  {
    icon: Shield,
    title: 'Quality Assurance',
    description: 'We maintain the highest standards in all our deliverables.',
  },
  {
    icon: Clock,
    title: 'Timely Delivery',
    description: 'We respect deadlines and deliver on our commitments.',
  },
  {
    icon: Award,
    title: 'Excellence',
    description: 'We strive for excellence in every aspect of our work.',
  },
];

export default function AboutPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublicSettings().then((data) => {
      setSettings(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const companyName = settings.general?.company_name || 'A+ Digital';
  const aboutExcerpt = settings.company?.about_excerpt || 'We create innovative solutions that make a difference.';
  const email = settings.general?.contact_email || '';
  const address = settings.company?.address || '';
  const phone = settings.company?.phone || '';
  const linkedinUrl = settings.company?.linkedin_url || '';
  const twitterUrl = settings.company?.twitter_url || '';
  const facebookUrl = settings.company?.facebook_url || '';

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNavigation companyName={companyName} activePage="/about" />

      <main>
        {/* Hero Section */}
        <section className="bg-primary-600 text-white py-20 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-5xl font-bold mb-6">About {companyName}</h1>
            <p className="text-xl opacity-90 max-w-2xl">{aboutExcerpt}</p>
          </div>
        </section>

        {/* Company History */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Our History</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">The journey of how we became who we are today.</p>
            </motion.div>

            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary-200 hidden md:block"></div>
              <div className="space-y-12">
                {historyMilestones.map((milestone, index) => (
                  <motion.div
                    key={milestone.year}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                  >
                    <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'}`}>
                      <div className="bg-gray-50 rounded-lg p-6 inline-block">
                        <span className="text-primary-600 font-bold text-lg">{milestone.year}</span>
                        <h3 className="text-xl font-semibold text-gray-900 mt-2">{milestone.title}</h3>
                        <p className="text-gray-600 mt-1">{milestone.description}</p>
                      </div>
                    </div>
                    <div className="hidden md:flex w-4 h-4 bg-primary-600 rounded-full absolute left-1/2 transform -translate-x-1/2 items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div className="flex-1"></div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Our Culture */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Culture</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">The values and beliefs that define who we are.</p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {cultureValues.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-14 h-14 bg-primary-50 rounded-xl flex items-center justify-center mb-4">
                    <value.icon className="w-7 h-7 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Principles */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Principles</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">The guiding principles that drive our decisions and actions.</p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {principles.map((principle, index) => (
                <motion.div
                  key={principle.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <principle.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{principle.title}</h3>
                  <p className="text-gray-600">{principle.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Team */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Team</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">Meet the talented people behind our success.</p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="aspect-square bg-gray-200">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                    <p className="text-primary-600">{member.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold mb-4">Join Our Team</h2>
            <p className="text-xl opacity-90 mb-8">Be part of something great. We're always looking for talented people.</p>
            <Link 
              href="/careers" 
              className="inline-block bg-white text-primary-600 px-8 py-4 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              View Open Positions
            </Link>
          </div>
        </section>
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
