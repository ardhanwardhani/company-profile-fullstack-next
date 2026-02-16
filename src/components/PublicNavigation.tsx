'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface PublicNavigationProps {
  companyName: string;
  activePage?: string;
  variant?: 'transparent' | 'white' | 'dark';
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
  const isDark = variant === 'dark';
  const isWhite = variant === 'white';
  const isScrolled = isTransparent ? false : scrolled;

  const bgClass = isTransparent ? 'bg-transparent' : isDark ? 'bg-dark-900/90 backdrop-blur-md border-b border-dark-700' : isWhite && !scrolled ? 'bg-white' : 'bg-white shadow-sm border-b border-gray-200';

  const textClass = isTransparent ? 'text-white' : isDark ? 'text-white' : 'text-neutral-900';

  const linkClass = isTransparent ? 'text-white' : isDark ? 'text-gray-300 hover:text-white' : 'text-neutral-700';

  return (
    <motion.nav initial={{ y: -100 }} animate={{ y: 0 }} className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${bgClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className={`text-2xl font-bold transition-colors text-primary-700 ${textClass}`}>
            {companyName}
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={`text-sm font-medium hover:text-primary-700 transition-colors ${linkClass} ${isActive(link.href) ? 'text-primary-700' : ''}`}>
                {link.label}
              </Link>
            ))}
            <Button href="/contact" variant={isDark && !isScrolled ? 'outline' : 'primary'}>
              Let's Talk
            </Button>
          </div>

          <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <div className="w-6 h-5 flex flex-col justify-between">
              <span className={`h-0.5 w-full ${isDark ? 'bg-white' : 'bg-neutral-900'} transition-all ${mobileMenuOpen ? 'rotate-45 y-2' : ''}`} />
              <span className={`h-0.5 w-full ${isDark ? 'bg-white' : 'bg-neutral-900'} transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`h-0.5 w-full ${isDark ? 'bg-white' : 'bg-neutral-900'} transition-all ${mobileMenuOpen ? '-rotate-45 -y-2' : ''}`} />
            </div>
          </button>
        </div>

        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className={`md:hidden border-t ${isDark ? 'bg-dark-900 border-dark-700' : 'bg-white border-gray-200'}`}>
            <div className="py-4 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-4 py-2 hover:text-primary-700 ${isActive(link.href) ? 'text-primary-700 font-medium' : isDark ? 'text-gray-300' : 'text-neutral-600'}`}
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
