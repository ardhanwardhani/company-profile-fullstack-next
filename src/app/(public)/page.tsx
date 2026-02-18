'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PublicNavigation } from '@/components/PublicNavigation';
import { PublicHero } from '@/components/PublicHero';
import { ClientLogos } from '@/components/public/ClientLogos';
import { Stats } from '@/components/public/sections/Stats';
import { Services } from '@/components/public/sections/Services';
import { PortfolioSection } from '@/components/public/PortfolioSection';
import { WhyChooseUs } from '@/components/public/sections/WhyChooseUs';
import { HowItWorks } from '@/components/public/HowItWorks';
import { Team } from '@/components/public/sections/Team';
import { Testimonials } from '@/components/public/sections/Testimonials';
import { FAQ } from '@/components/public/FAQ';
import { ContactCTA } from '@/components/public/ContactCTA';
import { CultureAndCareers } from '@/components/public/sections/CultureAndCareers';
import { Newsletter } from '@/components/public/sections/Newsletter';
import { MapPin, MessageSquare, Linkedin, Twitter, Facebook } from 'lucide-react';

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
    contact_email: 'hello@aplusdigital.com',
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
    const res = await fetch('/api/public/settings', { cache: 'no-store' });
    if (!res.ok) return defaultSettings;
    const data = await res.json();
    return data.data || defaultSettings;
  } catch {
    return defaultSettings;
  }
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
                <Link href="/services/company-profile" className="hover:text-primary-500 transition-colors">
                  Company Profile Package
                </Link>
              </li>
              <li>
                <Link href="/services/custom-software" className="hover:text-primary-500 transition-colors">
                  Custom Software
                </Link>
              </li>
              <li>
                <Link href="/services/creative-design" className="hover:text-primary-500 transition-colors">
                  Creative Design
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary-500 transition-colors">
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
        <ClientLogos />
        <Stats />
        <Services />
        <PortfolioSection />
        <WhyChooseUs />
        <HowItWorks />
        {/* <Team /> */}
        <Testimonials />
        <FAQ />
        <ContactCTA />
        {/* <CultureAndCareers /> */}
        <Newsletter />
      </main>
      <Footer companyName={companyName} address={address} phone={phone} email={email} linkedinUrl={linkedinUrl} twitterUrl={twitterUrl} facebookUrl={facebookUrl} />
    </div>
  );
}
