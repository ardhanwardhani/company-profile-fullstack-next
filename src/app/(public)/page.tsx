'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ArrowRight, Code2, Palette, Briefcase, Users, MessageSquare, Mail, MapPin, Linkedin, Twitter, Github, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
    <div className="bg-neutral-900 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1, duration: 0.5 }} className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-white mb-2">
                <Counter value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-neutral-400">{stat.label}</div>
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
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="text-4xl font-bold text-neutral-900 mb-4">Our Services</h2>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">Comprehensive digital solutions designed to help your business grow and succeed in the digital landscape.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={service.title} delay={index * 0.1} className="p-8 hover:border-primary-200">
              <div className="w-14 h-14 bg-primary-50 rounded-xl flex items-center justify-center mb-6">
                <service.icon className="w-7 h-7 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">{service.title}</h3>
              <p className="text-neutral-600 leading-relaxed">{service.description}</p>
            </Card>
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
    <SectionWrapper id="why-choose-us" className="bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="text-4xl font-bold text-neutral-900 mb-4">Why Choose Us</h2>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">We stand out from the competition with our commitment to excellence and client success.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <Card key={benefit.title} delay={index * 0.1} className="p-8 text-center">
              <div className="w-14 h-14 bg-primary-50 rounded-xl flex items-center justify-center mb-6 mx-auto">
                <benefit.icon className="w-7 h-7 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">{benefit.title}</h3>
              <p className="text-neutral-600 leading-relaxed">{benefit.description}</p>
            </Card>
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
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="text-4xl font-bold text-neutral-900 mb-4">Meet Our Team</h2>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">Passionate experts dedicated to bringing your digital vision to life.</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <Card key={member.name} delay={index * 0.1} className="text-center p-6">
              <div className="w-24 h-24 rounded-full bg-neutral-100 mx-auto mb-4 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-primary-100 to-neutral-200 flex items-center justify-center text-2xl font-bold text-primary-600">
                  {member.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
              </div>
              <h3 className="font-semibold text-neutral-900 mb-1">{member.name}</h3>
              <p className="text-sm text-neutral-600">{member.role}</p>
            </Card>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}

function Testimonials() {
  return (
    <SectionWrapper className="bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="text-4xl font-bold text-neutral-900 mb-4">What Our Clients Say</h2>
          <p className="text-xl text-neutral-600">Real feedback from companies who trusted us with their projects.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={testimonial.author} delay={index * 0.1} className="p-8">
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <p className="text-neutral-700 mb-6 italic">"{testimonial.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center font-semibold text-primary-600">{testimonial.logo}</div>
                <div>
                  <div className="font-medium text-neutral-900">{testimonial.author}</div>
                  <div className="text-sm text-neutral-600">{testimonial.company}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}

function CultureAndCareers() {
  return (
    <SectionWrapper id="careers" className="bg-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl font-bold text-white mb-6">Join Our Team</h2>
            <p className="text-xl text-neutral-300 mb-8">We're always looking for talented individuals who share our passion for creating exceptional digital experiences.</p>

            <div className="grid sm:grid-cols-2 gap-6 mb-10">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary-600/20 flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 bg-primary-500 rounded-full" />
                </div>
                <div>
                  <h4 className="font-medium text-white">Continuous Learning</h4>
                  <p className="text-sm text-neutral-400">Growth opportunities and skill development.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary-600/20 flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 bg-primary-500 rounded-full" />
                </div>
                <div>
                  <h4 className="font-medium text-white">Collaborative Culture</h4>
                  <p className="text-sm text-neutral-400">Work with passionate, like-minded professionals.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary-600/20 flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 bg-primary-500 rounded-full" />
                </div>
                <div>
                  <h4 className="font-medium text-white">Impactful Work</h4>
                  <p className="text-sm text-neutral-400">Projects that make a real difference.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary-600/20 flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 bg-primary-500 rounded-full" />
                </div>
                <div>
                  <h4 className="font-medium text-white">Modern Tools</h4>
                  <p className="text-sm text-neutral-400">Latest technologies and best practices.</p>
                </div>
              </div>
            </div>

            <Button href="/careers" variant="primary">
              <div className="flex flex-row justify-between">
                View Open Positions
                <ArrowRight className="ml-2 w-4 h-4" />
              </div>
            </Button>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary-600/20 to-neutral-700/50 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <p className="text-white font-medium">Ready to make an impact?</p>
                <p className="text-sm text-neutral-400 mt-2">Check out our current openings</p>
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
          <Mail className="w-12 h-12 text-primary-600 mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-neutral-900 mb-4">Stay Updated</h2>
          <p className="text-xl text-neutral-600 mb-8">Subscribe to our newsletter for the latest insights, tutorials, and company updates.</p>

          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input type="email" placeholder="Enter your email" className="flex-1 px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
            <Button variant="primary" className="whitespace-nowrap">
              Subscribe
            </Button>
          </form>

          <p className="text-sm text-neutral-500 mt-4">No spam, unsubscribe at any time.</p>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}

function Footer({ companyName, address, phone, email, linkedinUrl, twitterUrl, facebookUrl }: { companyName: string; address: string; phone: string; email: string; linkedinUrl: string; twitterUrl: string; facebookUrl: string }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-900 text-neutral-300 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="text-2xl font-bold text-white mb-4">{companyName}</div>
            <p className="text-neutral-400 mb-6">Your trusted partner for digital solutions. We help companies build exceptional software and brands.</p>
            <div className="flex gap-4">
              {linkedinUrl && (
                <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center hover:bg-primary-600 transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
              {twitterUrl && (
                <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center hover:bg-primary-600 transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
              )}
              {facebookUrl && (
                <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center hover:bg-primary-600 transition-colors">
                  <Github className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Services</h4>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="hover:text-primary-400 transition-colors">
                  Company Profile Package
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary-400 transition-colors">
                  Custom Software
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary-400 transition-colors">
                  Creative Design
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary-400 transition-colors">
                  Consulting
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="hover:text-primary-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-primary-400 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-primary-400 transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary-400 transition-colors">
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
                  <MapPin className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                  <span className="whitespace-pre-line">{address}</span>
                </li>
              )}
              {phone && (
                <li className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-primary-500 flex-shrink-0" />
                  <a href={`tel:${phone}`} className="hover:text-primary-400 transition-colors">
                    {phone}
                  </a>
                </li>
              )}
              {email && (
                <li className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-primary-500 flex-shrink-0" />
                  <a href={`mailto:${email}`} className="hover:text-primary-400 transition-colors">
                    {email}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-800 pt-8 text-center text-neutral-500 text-sm">
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
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
