'use client';

import Link from 'next/link';
import { MapPin, MessageSquare, Linkedin, Twitter, Github } from 'lucide-react';

interface PublicFooterProps {
  companyName: string;
  address: string;
  phone: string;
  email: string;
  linkedinUrl: string;
  twitterUrl: string;
  facebookUrl: string;
}

export function PublicFooter({ companyName, address, phone, email, linkedinUrl, twitterUrl, facebookUrl }: PublicFooterProps) {
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
