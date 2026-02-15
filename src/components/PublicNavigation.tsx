'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface PublicNavigationProps {
  companyName: string;
  activePage?: string;
  variant?: 'transparent' | 'white';
}

interface NavLink {
  href: string;
  label: string;
}

const navLinks: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/careers', label: 'Careers' },
];

export function PublicNavigation({ companyName, activePage, variant = 'white' }: PublicNavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === '/') return activePage === '/';
    return activePage?.startsWith(href);
  };

  const isTransparent = variant === 'transparent' && !scrolled;

  return (
    <motion.nav 
      initial={{ y: -100 }} 
      animate={{ y: 0 }} 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isTransparent ? 'bg-transparent' : 'bg-white shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link 
            href="/" 
            className={`text-2xl font-bold transition-colors ${
              isTransparent ? 'text-white' : 'text-neutral-900'
            }`}
          >
            {companyName}
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                className={`text-sm font-medium hover:text-primary-600 transition-colors ${
                  isTransparent ? 'text-white' : 'text-neutral-700'
                } ${isActive(link.href) ? 'text-primary-600' : ''}`}
              >
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
                <Link 
                  key={link.href} 
                  href={link.href} 
                  className={`block px-4 py-2 hover:text-primary-600 ${isActive(link.href) ? 'text-primary-600 font-medium' : 'text-neutral-600'}`} 
                  onClick={() => setMobileMenuOpen(false)}
                >
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
