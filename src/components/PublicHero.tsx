'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PublicHeroProps {
  tagline: string;
}

export function PublicHero({ tagline }: PublicHeroProps) {
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
            <span className="block text-primary-700">Digital Solutions</span>
          </h1>

          <p className="text-xl text-neutral-300 mb-10 max-w-2xl mx-auto text-center">{tagline}</p>

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
