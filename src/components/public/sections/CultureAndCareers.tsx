'use client';

import { motion } from 'framer-motion';
import { SectionWrapper } from '@/components/ui/section-wrapper';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users } from 'lucide-react';

export function CultureAndCareers() {
  return (
    <SectionWrapper id="careers" className="bg-primary-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }}
          >
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

          <motion.div 
            initial={{ opacity: 0, x: 30 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }} 
            className="relative"
          >
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
