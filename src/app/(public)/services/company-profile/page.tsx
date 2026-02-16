'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PublicNavigation } from '@/components/PublicNavigation';
import { Briefcase, Layout, FileText, Users, Settings, Zap, CheckCircle, ArrowRight, Mail, BarChart, Globe, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Settings {
  general: {
    company_name?: string;
    site_title?: string;
    site_tagline?: string;
    contact_email?: string;
  };
  company: {
    about_excerpt?: string;
    facebook_url?: string;
    twitter_url?: string;
    linkedin_url?: string;
    instagram_url?: string;
    address?: string;
    phone?: string;
  };
}

const defaultSettings: Settings = {
  general: {
    company_name: 'A+ Digital',
    site_title: 'A+ Digital',
    site_tagline: 'We help companies and startups build exceptional software, craft compelling brands, and create digital products that drive growth.',
    contact_email: 'hello@nexoradigital.com',
  },
  company: {
    address: 'Ngamprah Kidul No. 17\nBandung Barat, 40552',
    phone: '',
    facebook_url: '',
    twitter_url: '',
    linkedin_url: '',
    instagram_url: '',
  },
};

async function getSettings(): Promise<Settings> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/public/settings`, { cache: 'no-store' });
    if (!res.ok) return defaultSettings;
    const data = await res.json();
    return data.data || defaultSettings;
  } catch {
    return defaultSettings;
  }
}

const features = [
  {
    icon: Layout,
    title: 'Customizable Company Profiles',
    description: 'Fully customizable company profile pages with logo, banner, about section, services, and team members.',
  },
  {
    icon: Briefcase,
    title: 'Job Listings Management',
    description: 'Post, manage, and track job openings with detailed descriptions, requirements, and application tracking.',
  },
  {
    icon: FileText,
    title: 'Blog Management',
    description: 'Create and publish blog posts with categories, tags, and author management. Perfect for content marketing.',
  },
  {
    icon: Users,
    title: 'Team Member Profiles',
    description: 'Showcase your team with individual profiles including photos, roles, and social links.',
  },
  {
    icon: BarChart,
    title: 'Analytics Dashboard',
    description: 'Track page views, visitor engagement, and content performance with built-in analytics.',
  },
  {
    icon: Globe,
    title: 'SEO Optimized',
    description: 'Built-in SEO features including meta tags, sitemaps, and structured data for better search visibility.',
  },
  {
    icon: Shield,
    title: 'User Authentication',
    description: 'Secure user system with role-based access control for admin, editors, and content managers.',
  },
  {
    icon: Settings,
    title: 'Easy Configuration',
    description: 'Intuitive admin dashboard to manage all content, settings, and configurations without coding.',
  },
];

const benefits = [
  'Save development time with ready-made solution',
  'Reduce costs with all-in-one platform',
  'Professional design that impresses clients',
  'Easy content management for non-tech users',
  'Scalable architecture that grows with your business',
  'Regular updates and security patches',
];

const relatedServices = [
  {
    title: 'Custom Software Development',
    description: 'Tailored software solutions built from scratch to address your unique business challenges.',
    icon: Zap,
    href: '/services/custom-software',
  },
  {
    title: 'Creative Design',
    description: 'Brand identity, UI/UX design, and visual storytelling that elevates your digital presence.',
    icon: Briefcase,
    href: '/services/creative-design',
  },
];

export default function CompanyProfilePage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSettings().then((data) => {
      setSettings(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-700"></div>
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
    <div className="min-h-screen bg-white">
      <PublicNavigation companyName={companyName} variant="white" />

      <main>
        {/* Hero Section */}
        <section className="bg-primary-700 text-white pt-32 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link href="/#services" className="inline-flex items-center text-white/80 hover:text-white mb-6">
                <ArrowRight className="w-4 h-4 rotate-180 mr-2" />
                Back to Services
              </Link>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center">
                  <Briefcase className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Company Profile Package</h1>
              <p className="text-xl text-white/90 max-w-2xl">
                Complete CMS solution with job listings, blog management, and customizable company profiles tailored to your brand.
              </p>
              <div className="flex flex-wrap gap-4 mt-8">
                <Button href="/contact" variant="white">
                  Request Demo
                </Button>
                <Link href="#features" className="px-6 py-3 border-2 border-white/30 text-white rounded-lg font-medium hover:bg-white/10 transition-colors">
                  Learn More
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Overview Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-1 bg-primary-700"></div>
                  <span className="text-primary-700 uppercase tracking-widest text-sm font-medium">Overview</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Everything You Need to Showcase Your Business
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  Our Company Profile Package is a comprehensive content management system designed specifically for companies wanting to establish a strong online presence. Whether you're a startup or an established enterprise, this package provides all the tools you need.
                </p>
                <p className="text-gray-600 mb-8">
                  From managing job listings and blog posts to showcasing your team and services, everything can be easily managed through our intuitive admin dashboard. No coding knowledge required.
                </p>
                <ul className="space-y-3">
                  {benefits.slice(0, 4).map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary-700 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="aspect-square bg-gray-100 rounded-2xl p-8 flex items-center justify-center">
                  <div className="w-full h-full bg-white rounded-xl shadow-lg p-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                          <Briefcase className="w-6 h-6 text-primary-700" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">Job Listings</div>
                          <div className="text-sm text-gray-500">Manage openings easily</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-primary-700" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">Blog Management</div>
                          <div className="text-sm text-gray-500">Publish content regularly</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                          <Users className="w-6 h-6 text-primary-700" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">Team Profiles</div>
                          <div className="text-sm text-gray-500">Showcase your talent</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                          <BarChart className="w-6 h-6 text-primary-700" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">Analytics</div>
                          <div className="text-sm text-gray-500">Track performance</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="w-12 h-1 bg-primary-700"></div>
                <span className="text-primary-700 uppercase tracking-widest text-sm font-medium">Features</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Everything you need to manage your company profile effectively.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary-700" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-1 bg-primary-700"></div>
                  <span className="text-primary-700 uppercase tracking-widest text-sm font-medium">Benefits</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Choose Our Package?</h2>
                <p className="text-lg text-gray-600 mb-8">
                  Our Company Profile Package offers numerous benefits that make it the ideal choice for businesses of all sizes.
                </p>
                <ul className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-primary-700 flex-shrink-0" />
                      <span className="text-gray-700 text-lg">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-primary-50 rounded-2xl p-8"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Ready to Get Started?</h3>
                <p className="text-gray-600 mb-8">
                  Contact us today to discuss your requirements and get a customized quote for your company profile package.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-primary-700" />
                    <span>Free consultation call</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-primary-700" />
                    <span>Customized solution proposal</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-primary-700" />
                    <span>Competitive pricing</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-primary-700" />
                    <span>Ongoing support available</span>
                  </div>
                </div>
                <Button href="/contact" variant="primary" className="w-full mt-8">
                  <div className="flex items-center justify-center">
                    Contact Us
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </div>
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary-700">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Build Your Company Profile?
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Let's create a professional online presence that impresses clients and helps your business grow.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button href="/contact" variant="white">
                  Get Started
                </Button>
                <Link href="/about" className="px-6 py-3 border-2 border-white/30 text-white rounded-lg font-medium hover:bg-white/10 transition-colors">
                  Learn More About Us
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Related Services */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="w-12 h-1 bg-primary-700"></div>
                <span className="text-primary-700 uppercase tracking-widest text-sm font-medium">Related Services</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Other Services</h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {relatedServices.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center mb-4">
                    <service.icon className="w-6 h-6 text-primary-700" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <Link href={service.href} className="inline-flex items-center text-primary-700 font-medium hover:text-primary-800">
                    Learn more <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-dark-900 text-gray-400 py-16 border-t border-dark-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="text-2xl font-bold text-white mb-4">{companyName}</div>
              <p className="text-gray-500 mb-6">Your trusted partner for digital solutions.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Services</h4>
              <ul className="space-y-3">
                <li><Link href="/services/company-profile" className="hover:text-primary-500 transition-colors">Company Profile Package</Link></li>
                <li><Link href="#" className="hover:text-primary-500 transition-colors">Custom Software</Link></li>
                <li><Link href="#" className="hover:text-primary-500 transition-colors">Creative Design</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-3">
                <li><Link href="/about" className="hover:text-primary-500 transition-colors">About Us</Link></li>
                <li><Link href="/blog" className="hover:text-primary-500 transition-colors">Blog</Link></li>
                <li><Link href="/careers" className="hover:text-primary-500 transition-colors">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Contact</h4>
              <ul className="space-y-3">
                {address && (
                  <li className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-primary-700 flex-shrink-0 mt-0.5" />
                    <span className="whitespace-pre-line">{address}</span>
                  </li>
                )}
                {email && (
                  <li><a href={`mailto:${email}`} className="hover:text-primary-500 transition-colors">{email}</a></li>
                )}
              </ul>
            </div>
          </div>
          <div className="border-t border-dark-700 pt-8 text-center text-gray-600 text-sm">
            <p>&copy; {new Date().getFullYear()} {companyName}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
