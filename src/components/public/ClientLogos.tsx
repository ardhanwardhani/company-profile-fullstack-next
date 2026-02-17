'use client';

import { motion } from 'framer-motion';

const clients = [
  { name: 'TechStart', logo: 'TS' },
  { name: 'GrowthVentures', logo: 'GV' },
  { name: 'InnovationLabs', logo: 'IL' },
  { name: 'MobileFirst', logo: 'MF' },
  { name: 'BrandWorks', logo: 'BW' },
  { name: 'TechCorp', logo: 'TC' },
  { name: 'DataFlow', logo: 'DF' },
  { name: 'CloudNine', logo: 'CN' },
];

export function ClientLogos() {
  const duplicatedClients = [...clients, ...clients, ...clients];

  return (
    <section className="py-16 bg-gray-50 border-y border-gray-200 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12 px-4"
      >
        <p className="text-primary-700 uppercase tracking-widest text-sm font-medium mb-2">Trusted By</p>
        <h2 className="text-2xl font-bold text-gray-900">Leading Companies Choose Us</h2>
      </motion.div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none" />
        
        <div className="flex">
          <motion.div
            className="flex items-center gap-12"
            animate={{
              x: [0, -50 * clients.length * 4 - 200],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 30,
                ease: "linear",
              },
            }}
          >
            {duplicatedClients.map((client, index) => (
              <div
                key={`${client.name}-${index}`}
                className="flex-shrink-0 flex flex-col items-center"
              >
                <div className="w-24 h-24 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:border-primary-700 hover:shadow-lg transition-all group">
                  <span className="text-2xl font-bold text-gray-400 group-hover:text-primary-700 transition-colors">
                    {client.logo}
                  </span>
                </div>
                <span className="text-sm text-gray-500 font-medium mt-2 whitespace-nowrap">{client.name}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
