'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ArrowRight, Code2, Palette, Briefcase, Users, MessageSquare, Mail, MapPin, Linkedin, Twitter, Github, ChevronDown, ArrowUpRight, Facebook } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionWrapper } from '@/components/ui/section-wrapper';
import { Counter } from '@/components/ui/counter';
import { PublicNavigation } from '@/components/PublicNavigation';
import { PublicHero } from '@/components/PublicHero';

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
    icon: Briefcase,
    title: 'Company Profile Package',
    description: 'Complete CMS solution with job listings, blog management, and customizable company profiles tailored to your brand.',
  },
  {
    icon: Code2,
    title: 'Custom Software Development',
    description: 'Tailored software solutions built from scratch to address your unique business challenges and requirements.',
  },
  {
    icon: Palette,
    title: 'Creative Design',
    description: 'Brand identity, UI/UX design, and visual storytelling that elevates your digital presence.',
  },
];

const team = [
  {
    name: 'Anugrah Wardhani',
    role: 'CEO & Founder',
    image: '/api/placeholder/300/300',
  },
  {
    name: 'Adit Raharditya',
    role: 'CTO & Founder',
    image: '/api/placeholder/300/300',
  },
  {
    name: 'Anugrah W',
    role: 'Creative Director',
    image: '/api/placeholder/300/300',
  },
  {
    name: 'M Raharditya',
    role: 'Software Engineer',
    image: '/api/placeholder/300/300',
  },
];

const testimonials = [
  {
    quote: 'Nexora transformed our online presence completely. Their team understood our vision and delivered beyond our expectations.',
    author: 'Michael Torres',
    company: 'TechStart Solutions',
    logo: 'TS',
  },
  {
    quote: 'Professional, creative, and technically excellent. They became our trusted partner for all digital initiatives.',
    author: 'Emily Watson',
    company: 'Growth Ventures',
    logo: 'GV',
  },
  {
    quote: 'The company profile package saved us weeks of development time. Clean code and excellent support.',
    author: 'David Park',
    company: 'Innovation Labs',
    logo: 'IL',
  },
];

const stats = [
  { value: 50, suffix: '+', label: 'Projects Delivered' },
  { value: 30, suffix: '+', label: 'Happy Clients' },
  { value: 5, suffix: '+', label: 'Years Experience' },
  { value: 15, suffix: '+', label: 'Team Members' },
];

function Stats() {
  return (
    <div className="bg-white py-20 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-gray-200">
          {stats.map((stat, index) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1, duration: 0.5 }} className="text-center px-8 py-4">
              <div className="text-4xl sm:text-5xl font-bold text-primary-800 mb-2">
                <Counter value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-gray-500 text-sm uppercase tracking-wider">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Services() {
  return (
    <SectionWrapper id="services" className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
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
                <Link href="#" className="inline-flex items-center gap-2 text-primary-700 hover:text-primary-800 mt-6 font-medium transition-colors">
                  Learn more <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="flex-1 w-full">
                <div className="aspect-video bg-gray-100 border border-gray-200 rounded-lg p-8 flex items-center justify-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-primary-700/5 group-hover:bg-primary-700/10 transition-colors"></div>
                  <div className="w-24 h-24 rounded-lg bg-white shadow-sm flex items-center justify-center">
                    <service.icon className="w-12 h-12 text-primary-700" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}

function WhyChooseUs() {
  const benefits = [
    {
      icon: Users,
      title: 'Expert Team',
      description: 'Our experienced professionals bring years of industry expertise to deliver exceptional results for your project.',
    },
    {
      icon: Code2,
      title: 'Customized Solutions',
      description: 'We tailor our services to meet your unique business needs, ensuring personalized strategies that drive growth.',
    },
    {
      icon: ChevronDown,
      title: 'On-Time Delivery',
      description: 'We respect your timeline and deliver projects on schedule without compromising on quality.',
    },
    {
      icon: MessageSquare,
      title: 'Dedicated Support',
      description: 'Our committed support team is always available to assist you before, during, and after project completion.',
    },
  ];

  return (
    <SectionWrapper id="why-choose-us" className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-1 bg-primary-700"></div>
            <span className="text-primary-700 uppercase tracking-widest text-sm font-medium">Why Us</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
          <p className="text-xl text-gray-600 max-w-2xl">We stand out from the competition with our commitment to excellence and client success.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-white border-l-4 border-l-primary-700 p-8 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-50 flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="w-6 h-6 text-primary-700" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{benefit.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}

function Team() {
  return (
    <SectionWrapper id="team" className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-1 bg-primary-700"></div>
            <span className="text-primary-700 uppercase tracking-widest text-sm font-medium">Our People</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
          <p className="text-xl text-gray-600 max-w-2xl">Passionate experts dedicated to bringing your digital vision to life.</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-white border border-gray-200 p-6 hover:border-primary-700 hover:shadow-lg transition-all group text-center"
            >
              <div className="w-24 h-24 rounded-full bg-gray-100 mx-auto mb-4 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-2xl font-bold text-gray-500 group-hover:text-primary-700 transition-colors">
                  {member.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 text-center mb-1 group-hover:text-primary-700 transition-colors">{member.name}</h3>
              <p className="text-sm text-gray-500 text-center">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}

function Testimonials() {
  return (
    <SectionWrapper className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-1 bg-primary-700"></div>
            <span className="text-primary-700 uppercase tracking-widest text-sm font-medium">Testimonials</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Clients Say</h2>
          <p className="text-xl text-gray-600">Real feedback from companies who trusted us with their projects.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-white border border-gray-200 p-8 relative hover:shadow-lg transition-shadow"
            >
              <span className="text-6xl text-primary-700/20 font-serif absolute top-4 left-4">"</span>
              <p className="text-gray-700 mb-6 relative z-10">{testimonial.quote}</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-700 flex items-center justify-center font-semibold text-white">{testimonial.logo}</div>
                <div>
                  <div className="font-medium text-gray-900">{testimonial.author}</div>
                  <div className="text-sm text-gray-500">{testimonial.company}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}

function CultureAndCareers() {
  return (
    <SectionWrapper id="careers" className="bg-primary-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-1 bg-white"></div>
              <span className="text-white uppercase tracking-widest text-sm font-medium">Join Us</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-200 mb-6">Join Our Team</h2>
            <p className="text-xl text-gray-200 mb-10">We're always looking for talented individuals who share our passion for creating exceptional digital experiences.</p>

            <div className="grid sm:grid-cols-2 gap-6 mb-10">
              {[
                { title: 'Continuous Learning', desc: 'Growth opportunities and skill development.' },
                { title: 'Collaborative Culture', desc: 'Work with passionate, like-minded professionals.' },
                { title: 'Impactful Work', desc: 'Projects that make a real difference.' },
                { title: 'Modern Tools', desc: 'Latest technologies and best practices.' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary-700 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-medium text-gray-200">{item.title}</h4>
                    <p className="text-sm text-gray-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button href="/careers" variant="white">
              <div className="flex flex-row items-center">
                View Open Positions
                <ArrowRight className="ml-2 w-4 h-4" />
              </div>
            </Button>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
            <div className="aspect-square bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center relative overflow-hidden">
              <div className="text-center relative z-10">
                <div className="w-20 h-20 mx-auto mb-4 bg-primary-700 flex items-center justify-center">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <p className="text-gray-900 font-medium text-lg">Ready to make an impact?</p>
                <p className="text-gray-500 mt-2">Check out our current openings</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
}

function Newsletter() {
  return (
    <SectionWrapper className="bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="w-16 h-16 mx-auto mb-6 bg-primary-700 flex items-center justify-center">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Stay Updated</h2>
          <p className="text-xl text-gray-600 mb-8">Subscribe to our newsletter for the latest insights, tutorials, and company updates.</p>

          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-white border-2 border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700 transition-colors"
            />
            <Button variant="primary" className="whitespace-nowrap">
              Subscribe
            </Button>
          </form>

          <p className="text-sm text-gray-500 mt-4">No spam, unsubscribe at any time.</p>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}

function Footer({ companyName, address, phone, email, linkedinUrl, twitterUrl, facebookUrl }: { companyName: string; address: string; phone: string; email: string; linkedinUrl: string; twitterUrl: string; facebookUrl: string }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-900 text-gray-400 py-16 border-t border-dark-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="text-2xl font-bold text-white mb-4">{companyName}</div>
            <p className="text-gray-500 mb-6">Your trusted partner for digital solutions. We help companies build exceptional software and brands.</p>
            <div className="flex gap-3">
              {linkedinUrl && (
                <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-dark-800 flex items-center justify-center hover:bg-primary-700 transition-colors">
                  <Linkedin className="w-5 h-5 text-white" />
                </a>
              )}
              {twitterUrl && (
                <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-dark-800 flex items-center justify-center hover:bg-primary-700 transition-colors">
                  <Twitter className="w-5 h-5 text-white" />
                </a>
              )}
              {facebookUrl && (
                <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-dark-800 flex items-center justify-center hover:bg-primary-700 transition-colors">
                  <Facebook className="w-5 h-5 text-white" />
                </a>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Services</h4>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="hover:text-primary-500 transition-colors">
                  Company Profile Package
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary-500 transition-colors">
                  Custom Software
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary-500 transition-colors">
                  Creative Design
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary-500 transition-colors">
                  Consulting
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="hover:text-primary-500 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-primary-500 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-primary-500 transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary-500 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Get in Touch</h4>
            <ul className="space-y-3">
              {address && (
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary-700 flex-shrink-0 mt-0.5" />
                  <span className="whitespace-pre-line">{address}</span>
                </li>
              )}
              {phone && (
                <li className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-primary-700 flex-shrink-0" />
                  <a href={`tel:${phone}`} className="hover:text-primary-500 transition-colors">
                    {phone}
                  </a>
                </li>
              )}
              {email && (
                <li className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-primary-700 flex-shrink-0" />
                  <a href={`mailto:${email}`} className="hover:text-primary-500 transition-colors">
                    {email}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-dark-700 pt-8 text-center text-gray-600 text-sm">
          <p>
            &copy; {currentYear} {companyName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function HomePage() {
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
  const tagline = settings.general?.site_tagline || 'We help companies and startups build exceptional software, craft compelling brands, and create digital products that drive growth.';
  const email = settings.general?.contact_email || '';
  const address = settings.company?.address || '';
  const phone = settings.company?.phone || '';
  const linkedinUrl = settings.company?.linkedin_url || '';
  const twitterUrl = settings.company?.twitter_url || '';
  const facebookUrl = settings.company?.facebook_url || '';

  return (
    <div className="min-h-screen bg-white">
      <PublicNavigation companyName={companyName} variant="transparent" />
      <main>
        <PublicHero tagline={tagline} />
        <Stats />
        <Services />
        <WhyChooseUs />
        <Team />
        <Testimonials />
        <CultureAndCareers />
        <Newsletter />
      </main>
      <Footer companyName={companyName} address={address} phone={phone} email={email} linkedinUrl={linkedinUrl} twitterUrl={twitterUrl} facebookUrl={facebookUrl} />
    </div>
  );
}
