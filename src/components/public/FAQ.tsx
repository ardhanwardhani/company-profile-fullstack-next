'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionWrapper } from '@/components/ui/section-wrapper';
import { ChevronDown, MessageSquare } from 'lucide-react';

const faqs = [
  {
    question: 'How long does it take to complete a project?',
    answer: 'Project timelines vary depending on complexity. A typical website takes 4-8 weeks, while custom software development can take 2-6 months. We provide detailed timelines during the discovery phase.',
  },
  {
    question: 'What technologies do you use?',
    answer: 'We use modern, industry-standard technologies including React, Next.js, Node.js, TypeScript, PostgreSQL, and cloud platforms like AWS and Vercel. We choose the best stack based on your specific needs.',
  },
  {
    question: 'Do you offer post-launch support?',
    answer: 'Yes! We offer comprehensive post-launch support including bug fixes, security updates, performance monitoring, and ongoing maintenance packages tailored to your needs.',
  },
  {
    question: 'How do you handle project pricing?',
    answer: 'We offer both fixed-price and hourly billing options. For most projects, we provide a detailed proposal with fixed pricing after the discovery phase. We also offer retainer plans for ongoing work.',
  },
  {
    question: 'Can you work with our existing team?',
    answer: 'Absolutely! We frequently collaborate with in-house teams as an extension. We can integrate seamlessly with your existing workflows, tools, and team members.',
  },
  {
    question: 'Do you sign NDAs?',
    answer: 'Yes, we absolutely sign non-disclosure agreements for all client projects. Your intellectual property and business information are always protected.',
  },
];

function FAQItem({ question, answer, isOpen, onToggle }: { question: string; answer: string; isOpen: boolean; onToggle: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-b border-gray-200 last:border-0"
    >
      <button
        onClick={onToggle}
        className="w-full py-6 flex items-center justify-between text-left gap-4"
        aria-expanded={isOpen}
      >
        <span className="text-lg font-semibold text-gray-900">{question}</span>
        <ChevronDown className={`w-5 h-5 text-primary-700 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-gray-600 leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <SectionWrapper id="faq" className="bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-12 h-1 bg-primary-700"></div>
            <span className="text-primary-700 uppercase tracking-widest text-sm font-medium">FAQ</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-gray-600">
            Got questions? We've got answers. Can't find what you're looking for? <a href="/contact" className="text-primary-700 hover:underline">Contact us</a>.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 px-6"
        >
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
