'use client';

import { motion } from 'framer-motion';
import { SectionWrapper } from '@/components/ui/section-wrapper';

const team = [
  {
    name: 'Anugrah Wardhani',
    role: 'CEO & Founder',
    image: '/api/placeholder/300/300',
  },
  {
    name: 'Adit Raharditya',
    role: 'CTO & Founder',
    image: '/api/placeholder/300/300',
  },
  {
    name: 'Anugrah W',
    role: 'Creative Director',
    image: '/api/placeholder/300/300',
  },
  {
    name: 'M Raharditya',
    role: 'Software Engineer',
    image: '/api/placeholder/300/300',
  },
];

export function Team() {
  return (
    <SectionWrapper id="team" className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-1 bg-primary-700"></div>
            <span className="text-primary-700 uppercase tracking-widest text-sm font-medium">Our People</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
          <p className="text-xl text-gray-600 max-w-2xl">Passionate experts dedicated to bringing your digital vision to life.</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-white border border-gray-200 p-6 hover:border-primary-700 hover:shadow-lg transition-all group text-center"
            >
              <div className="w-24 h-24 rounded-full bg-gray-100 mx-auto mb-4 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-2xl font-bold text-gray-500 group-hover:text-primary-700 transition-colors">
                  {member.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 text-center mb-1 group-hover:text-primary-700 transition-colors">{member.name}</h3>
              <p className="text-sm text-gray-500 text-center">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
