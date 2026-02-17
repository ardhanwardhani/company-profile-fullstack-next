'use client';

import { motion } from 'framer-motion';
import { SectionWrapper } from '@/components/ui/section-wrapper';
import { Users, Code2, ChevronDown, MessageSquare } from 'lucide-react';

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

export function WhyChooseUs() {
  return (
    <SectionWrapper id="why-choose-us" className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-1 bg-primary-700"></div>
            <span className="text-primary-700 uppercase tracking-widest text-sm font-medium">Why Us</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
          <p className="text-xl text-gray-600 max-w-2xl">We stand out from the competition with our commitment to excellence and client success.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-white border-l-4 border-l-primary-700 p-8 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-50 flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="w-6 h-6 text-primary-700" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{benefit.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
