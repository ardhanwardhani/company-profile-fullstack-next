'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ArrowRight, Code2, Palette, Briefcase, Users, MessageSquare, Mail, MapPin, Linkedin, Twitter, Github, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SectionWrapper } from '@/components/ui/section-wrapper';
import { Counter } from '@/components/ui/counter';
import { Suspense } from 'react';
import { LatestPosts } from '@/components/blog/latest-posts';

const COMPANY_NAME = 'A+ Digital';

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
    name: 'Anugrah Wardhani',
    role: 'Creative Director',
    image: '/api/placeholder/300/300',
  },
  {
    name: 'Adit Raharditya',
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

const navLinks = [
  { href: '#services', label: 'Services' },
  { href: '#work', label: 'Our Work' },
  { href: '#blog', label: 'Blog' },
  { href: '#team', label: 'Team' },
  { href: '#careers', label: 'Careers' },
];

function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav initial={{ y: -100 }} animate={{ y: 0 }} className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/50 backdrop-blur-sm shadow-sm' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className={`text-2xl font-bold text-neutral-900 ${scrolled ? 'text-black' : 'text-white'}`}>
            {COMPANY_NAME}
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={`text-sm font-medium  hover:text-primary-600 transition-colors ${scrolled ? 'text-black' : 'text-white'}`}>
                {link.label}
              </Link>
            ))}
            <Button href="/contact">Let's Talk</Button>
          </div>

          <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <div className="w-6 h-5 flex flex-col justify-between">
              <span className={`h-0.5 w-full bg-neutral-900 transition-all ${mobileMenuOpen ? 'rotate-45 y-2' : ''}`} />
              <span className={`h-0.5 w-full bg-neutral-900 transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`h-0.5 w-full bg-neutral-900 transition-all ${mobileMenuOpen ? '-rotate-45 -y-2' : ''}`} />
            </div>
          </button>
        </div>

        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="md:hidden bg-white border-t">
            <div className="py-4 space-y-4">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="block px-4 py-2 text-neutral-600 hover:text-primary-600" onClick={() => setMobileMenuOpen(false)}>
                  {link.label}
                </Link>
              ))}
              <div className="px-4">
                <Button href="/contact" className="w-full">
                  Let's Talk
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}

function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 100]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <motion.div style={{ y }} className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80" alt="Modern office workspace" className="w-full h-full object-cover" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/90 via-neutral-900/70 to-neutral-900/50" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-3xl mx-auto">
          <h1 className="text-5xl sm:text-6xl lg:text-6xl font-bold text-white mb-6 leading-tight text-center">
            Your Trusted Partner for
            <span className="block text-primary-500">Digital Solutions</span>
          </h1>

          <p className="text-xl text-neutral-300 mb-10 max-w-2xl mx-auto text-center">We help companies and startups build exceptional software, craft compelling brands, and create digital products that drive growth.</p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button href="/contact" variant="primary">
              <div className="flex flex-row justify-between items-center">
                Start Your Project
                <ArrowRight className="ml-2 w-4 h-4" />
              </div>
            </Button>
            <Button href="/work" variant="outline">
              <p className="text-white">View Our Work</p>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

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

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-900 text-neutral-300 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="text-2xl font-bold text-white mb-4">{COMPANY_NAME}</div>
            <p className="text-neutral-400 mb-6">Your trusted partner for digital solutions. We help companies build exceptional software and brands.</p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center hover:bg-primary-600 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center hover:bg-primary-600 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center hover:bg-primary-600 transition-colors">
                <Github className="w-5 h-5" />
              </a>
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
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                <span>
                  Ngamprah Kidul No. 17
                  <br />
                  Bandung Barat, 40552
                </span>
              </li>
              <li className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-primary-500 flex-shrink-0" />
                <a href="mailto:hello@nexoradigital.com" className="hover:text-primary-400 transition-colors">
                  hello@nexoradigital.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-800 pt-8 text-center text-neutral-500 text-sm">
          <p>
            &copy; {currentYear} {COMPANY_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

function BlogLoadingFallback() {
  return (
    <SectionWrapper id="blog" className="bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">Latest from Blog</h2>
            <p className="text-xl text-neutral-600">Insights, tutorials, and updates from our team.</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-full p-6 border border-neutral-200 rounded-lg animate-pulse">
              <div className="aspect-video bg-neutral-100 rounded-lg mb-4" />
              <div className="h-4 bg-neutral-100 rounded mb-2" />
              <div className="h-4 bg-neutral-100 rounded w-3/4 mb-2" />
              <div className="h-3 bg-neutral-100 rounded w-1/2 mt-4" />
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main>
        <Hero />
        <Stats />
        <Services />
        <Suspense fallback={<BlogLoadingFallback />}>
          <LatestPosts />
        </Suspense>
        <Team />
        <Testimonials />
        <CultureAndCareers />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
