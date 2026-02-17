'use client';

import { motion } from 'framer-motion';
import { SectionWrapper } from '@/components/ui/section-wrapper';
import { Search, Palette, Code2, Rocket } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Search,
    title: 'Discovery',
    description: 'We dive deep into understanding your business, goals, and challenges to create a solid foundation for your project.',
  },
  {
    number: '02',
    icon: Palette,
    title: 'Design',
    description: 'Our creative team crafts stunning visuals and user-centered designs that align with your brand identity.',
  },
  {
    number: '03',
    icon: Code2,
    title: 'Development',
    description: 'We build robust, scalable solutions using cutting-edge technologies and best practices.',
  },
  {
    number: '04',
    icon: Rocket,
    title: 'Launch',
    description: 'We deploy your project with thorough testing, ensuring everything runs smoothly from day one.',
  },
];

export function HowItWorks() {
  return (
    <SectionWrapper id="process" className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-12 h-1 bg-primary-700"></div>
            <span className="text-primary-700 uppercase tracking-widest text-sm font-medium">Our Process</span>
          </div>
          <h2 className="text-4xl font-bold mb-4">How We Work</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            A proven process that delivers exceptional results, every single time.
          </p>
        </motion.div>

        <div className="relative">
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gray-800 -translate-y-1/2 z-0" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                className="text-center"
              >
                <div className="relative inline-block mb-6">
                  <div className="w-24 h-24 rounded-full bg-gray-800 border-4 border-gray-900 flex items-center justify-center mx-auto group-hover:border-primary-700 transition-colors">
                    <step.icon className="w-10 h-10 text-primary-700" />
                  </div>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 bg-primary-700 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-white">{step.number}</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-400 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
