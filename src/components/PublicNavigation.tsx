'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PublicNavigationProps {
  companyName: string;
  activePage?: string;
  variant?: 'transparent' | 'white' | 'dark';
}

interface NavLink {
  href: string;
  label: string;
  children?: { href: string; label: string }[];
}

const navLinks: NavLink[] = [
  { href: '/', label: 'Home' },
  { 
    href: '/services', 
    label: 'Services',
    children: [
      { href: '/services/company-profile', label: 'Company Profile Package' },
      { href: '/services/custom-software', label: 'Custom Software Development' },
      { href: '/services/creative-design', label: 'Creative Design' },
    ]
  },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
  { href: '/careers', label: 'Careers' },
];

export function PublicNavigation({ companyName, activePage, variant = 'white' }: PublicNavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(event.target as Node)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (href: string) => {
    if (href === '/') return activePage === '/';
    return activePage?.startsWith(href);
  };

  const isTransparent = variant === 'transparent' && !scrolled;
  const isDark = variant === 'dark';
  const isWhite = variant === 'white';
  const isScrolled = isTransparent ? false : scrolled;

  const bgClass = isTransparent 
    ? 'bg-transparent' 
    : isDark 
      ? 'bg-dark-900/90 backdrop-blur-md border-b border-dark-700' 
      : isWhite && !scrolled
        ? 'bg-white' 
        : 'bg-white shadow-sm border-b border-gray-200';

  const textClass = isTransparent 
    ? 'text-white' 
    : isDark 
      ? 'text-white' 
      : 'text-neutral-900';

  const linkClass = isTransparent 
    ? 'text-white' 
    : isDark 
      ? 'text-gray-300 hover:text-white' 
      : 'text-neutral-700';

  const ServicesDropdown = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className={isMobile ? 'space-y-2 pl-4' : ''}>
      <button
        onClick={() => setServicesOpen(!servicesOpen)}
        className={`flex items-center justify-between w-full text-sm font-medium hover:text-primary-700 transition-colors ${linkClass} ${isActive('/services') ? 'text-primary-700' : ''} ${isMobile ? 'py-2' : ''}`}
      >
        Services
        <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
      </button>
      {servicesOpen && (
        <div className={isMobile ? 'space-y-2 mt-2' : 'absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2'}>
          {isMobile ? (
            <>
              <Link href="/services/company-profile" className="block py-2 pl-4 text-gray-600 hover:text-primary-700" onClick={() => setMobileMenuOpen(false)}>
                Company Profile Package
              </Link>
              <Link href="/services/custom-software" className="block py-2 pl-4 text-gray-600 hover:text-primary-700" onClick={() => setMobileMenuOpen(false)}>
                Custom Software Development
              </Link>
              <Link href="/services/creative-design" className="block py-2 pl-4 text-gray-600 hover:text-primary-700" onClick={() => setMobileMenuOpen(false)}>
                Creative Design
              </Link>
            </>
          ) : (
            <>
              <Link href="/services/company-profile" className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary-700">
                Company Profile Package
              </Link>
              <Link href="/services/custom-software" className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary-700">
                Custom Software Development
              </Link>
              <Link href="/services/creative-design" className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary-700">
                Creative Design
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );

  return (
    <motion.nav initial={{ y: -100 }} animate={{ y: 0 }} className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${bgClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className={`text-2xl font-bold transition-colors text-primary-700 ${textClass}`}>
            {companyName}
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              link.children ? (
                <div key={link.href} ref={servicesRef} className="relative">
                  <ServicesDropdown />
                </div>
              ) : (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  className={`text-sm font-medium hover:text-primary-700 transition-colors ${linkClass} ${isActive(link.href) ? 'text-primary-700' : ''}`}
                >
                  {link.label}
                </Link>
              )
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
                link.children ? (
                  <ServicesDropdown key={link.href} isMobile />
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block px-4 py-2 hover:text-primary-700 ${isActive(link.href) ? 'text-primary-700 font-medium' : isDark ? 'text-gray-300' : 'text-neutral-600'}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                )
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
