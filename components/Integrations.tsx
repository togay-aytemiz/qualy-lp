import React from 'react';
import { useLanguage } from '../LanguageContext';
import { motion } from 'framer-motion';

const Integrations: React.FC = () => {
  const { t } = useLanguage();
  const companies = [
    "Acme Corp", "GlobalBank", "Nebula", "Vortex", "Sisyphus", "AltShift"
  ];

  return (
    <section id="customers" className="py-10 border-y border-slate-100 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-sm font-semibold text-slate-500 mb-8 uppercase tracking-widest"
        >
          {t.integrations.trustedBy}
        </motion.p>
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
           {/* Placeholder for Logos using text for now, in real app use SVGs */}
           {companies.map((company, idx) => (
             <motion.div 
               key={idx} 
               initial={{ opacity: 0, y: 10 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.5, delay: idx * 0.1 }}
               className="text-xl md:text-2xl font-bold text-slate-800 flex items-center gap-2"
             >
               <div className="w-6 h-6 bg-slate-300 rounded-full"></div>
               {company}
             </motion.div>
           ))}
        </div>
      </div>
    </section>
  );
};

export default Integrations;