'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PublicNavigation } from '@/components/PublicNavigation';
import { Palette, PenTool, Layout, Zap, ArrowRight, Mail, CheckCircle, Figma, Image, Type, Smartphone, Monitor, Megaphone, Target, Droplet } from 'lucide-react';
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

const services = [
  {
    icon: PenTool,
    title: 'Brand Identity Design',
    description: 'Complete brand identity packages including logo design, color palettes, typography, and brand guidelines.',
  },
  {
    icon: Layout,
    title: 'UI/UX Design',
    description: 'User-centered design that combines aesthetics with functionality for exceptional digital experiences.',
  },
  {
    icon: Figma,
    title: 'Website Design',
    description: 'Beautiful, responsive website designs that engage visitors and drive conversions.',
  },
  {
    icon: Smartphone,
    title: 'Mobile App Design',
    description: 'Intuitive mobile app interfaces designed for the best user experience on iOS and Android.',
  },
  {
    icon: Megaphone,
    title: 'Marketing Materials',
    description: 'Eye-catching designs for advertisements, brochures, flyers, and other marketing collateral.',
  },
  {
    icon: Image,
    title: 'Social Media Design',
    description: 'Consistent visual content for your social media presence that builds brand awareness.',
  },
  {
    icon: Type,
    title: 'Typography & Copy Design',
    description: 'Carefully crafted text treatments and typography that enhance your brand message.',
  },
  {
    icon: Monitor,
    title: 'Presentation Design',
    description: 'Professional slide designs that make your presentations memorable and impactful.',
  },
];

const benefits = [
  'Stand out from the competition with a unique visual identity',
  'Consistent branding across all touchpoints',
  'Designs that resonate with your target audience',
  'Professional quality that builds trust',
  'Improved user engagement and conversion rates',
  'Long-term value with timeless design concepts',
];

const processSteps = [
  { step: '01', title: 'Discovery', description: 'We learn about your business, goals, and target audience.' },
  { step: '02', title: 'Research', description: 'We analyze your industry and competitors for insights.' },
  { step: '03', title: 'Concept', description: 'We create initial design concepts for your review.' },
  { step: '04', title: 'Refinement', description: 'We iterate and refine based on your feedback.' },
  { step: '05', title: 'Delivery', description: 'We provide final files with brand guidelines.' },
];

export default function CreativeDesignPage() {
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
                  <Palette className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Creative Design</h1>
              <p className="text-xl text-white/90 max-w-2xl">
                Brand identity, UI/UX design, and visual storytelling that elevates your digital presence.
              </p>
              <div className="flex flex-wrap gap-4 mt-8">
                <Button href="/contact" variant="white">
                  Start Your Project
                </Button>
                <Link href="#services" className="px-6 py-3 border-2 border-white/30 text-white rounded-lg font-medium hover:bg-white/10 transition-colors">
                  Our Services
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
                  Design That Tells Your Story
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  Great design is more than just aesthetics – it's about communicating your brand's unique story and values. We create visual experiences that connect with your audience and leave lasting impressions.
                </p>
                <p className="text-gray-600 mb-8">
                  From brand identity development to UI/UX design, our creative team combines artistic vision with strategic thinking to deliver designs that not only look beautiful but also achieve your business objectives.
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
                  <div className="grid grid-cols-2 gap-4 w-full h-full">
                    <div className="bg-primary-100 rounded-xl p-4 flex items-center justify-center">
                      <Palette className="w-12 h-12 text-primary-700" />
                    </div>
                    <div className="bg-primary-200 rounded-xl p-4 flex items-center justify-center">
                      <PenTool className="w-12 h-12 text-primary-800" />
                    </div>
                    <div className="bg-primary-300 rounded-xl p-4 flex items-center justify-center">
                      <Layout className="w-12 h-12 text-primary-900" />
                    </div>
                    <div className="bg-primary-100 rounded-xl p-4 flex items-center justify-center">
                      <Target className="w-12 h-12 text-primary-700" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="w-12 h-1 bg-primary-700"></div>
                <span className="text-primary-700 uppercase tracking-widest text-sm font-medium">Our Process</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How We Design</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                A collaborative approach that ensures results you'll love.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-5 gap-6">
              {processSteps.map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-primary-700 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="w-12 h-1 bg-primary-700"></div>
                <span className="text-primary-700 uppercase tracking-widest text-sm font-medium">What We Offer</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Design Services</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Comprehensive creative solutions for every need.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-50 p-6 rounded-xl hover:bg-primary-50 transition-colors"
                >
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                    <service.icon className="w-6 h-6 text-primary-700" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-gray-600 text-sm">{service.description}</p>
                </motion.div>
              ))}
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
                Let's Create Something Beautiful
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Get in touch to discuss your design needs and bring your vision to life.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button href="/contact" variant="white">
                  Start Your Project
                </Button>
                <Link href="/about" className="px-6 py-3 border-2 border-white/30 text-white rounded-lg font-medium hover:bg-white/10 transition-colors">
                  Learn More About Us
                </Link>
              </div>
            </motion.div>
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
                <li><Link href="/services/custom-software" className="hover:text-primary-500 transition-colors">Custom Software</Link></li>
                <li><Link href="/services/creative-design" className="hover:text-primary-500 transition-colors">Creative Design</Link></li>
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
