'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { SectionWrapper } from '@/components/ui/section-wrapper';
import { ArrowLeft, ArrowRight } from 'lucide-react';

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
  {
    quote: 'Outstanding work on our mobile app. The team was responsive, professional, and delivered on time.',
    author: 'Sarah Johnson',
    company: 'MobileFirst Inc',
    logo: 'MF',
  },
  {
    quote: 'Their creative team captured our brand perfectly. We saw a 40% increase in engagement after the redesign.',
    author: 'Robert Chen',
    company: 'BrandWorks',
    logo: 'BW',
  },
  {
    quote: 'Exceptional technical expertise and communication throughout the project. Highly recommended!',
    author: 'Amanda Lee',
    company: 'TechCorp',
    logo: 'TC',
  },
];

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3;
  const totalSlides = Math.ceil(testimonials.length / itemsPerPage);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const getVisibleTestimonials = () => {
    const start = currentIndex * itemsPerPage;
    return testimonials.slice(start, start + itemsPerPage);
  };

  return (
    <SectionWrapper className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-1 bg-primary-700"></div>
            <span className="text-primary-700 uppercase tracking-widest text-sm font-medium">Testimonials</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Clients Say</h2>
          <p className="text-xl text-gray-600">Real feedback from companies who trusted us with their projects.</p>
        </motion.div>

        <div className="relative">
          <div className="grid md:grid-cols-3 gap-6">
            {getVisibleTestimonials().map((testimonial, index) => (
              <motion.div
                key={`${currentIndex}-${index}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border border-gray-200 p-8 relative hover:shadow-lg transition-shadow"
              >
                <span className="text-6xl text-primary-700/20 font-serif absolute top-4 left-4">"</span>
                <p className="text-gray-700 mb-6 relative z-10">{testimonial.quote}</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-700 flex items-center justify-center font-semibold text-white">{testimonial.logo}</div>
                  <div>
                    <div className="font-medium text-gray-900">{testimonial.author}</div>
                    <div className="text-sm text-gray-500">{testimonial.company}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-4 mt-12">
            <button
              onClick={prevSlide}
              className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-primary-700 hover:text-white transition-colors"
              aria-label="Previous testimonial"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    currentIndex === index ? 'bg-primary-700' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
            <button
              onClick={nextSlide}
              className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-primary-700 hover:text-white transition-colors"
              aria-label="Next testimonial"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
