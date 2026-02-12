import React from 'react';
import { useLanguage } from '../LanguageContext';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { AUTH_URLS } from '../lib/auth-links';

type FloatingBadge = {
  src: string;
  position: string;
  delay: number;
  label: string;
};

const CTA: React.FC = () => {
  const { t } = useLanguage();
  const prefersReducedMotion = useReducedMotion();

  const icons: FloatingBadge[] = [
    { src: '/whatsapp.svg', label: 'WhatsApp', position: "top-[12%] left-[15%] lg:left-[22%]", delay: 0 },
    { src: '/instagram.svg', label: 'Instagram', position: "top-[5%] left-[50%] -translate-x-1/2", delay: 1.5 },
    { src: '/Telegram.svg', label: 'Telegram', position: "top-[12%] right-[15%] lg:right-[22%]", delay: 0.5 },
    { src: '/messenger.svg', label: 'Messenger', position: "top-[45%] left-[5%] lg:left-[15%]", delay: 2 },
    { src: '/whatsapp.svg', label: 'WhatsApp', position: "top-[45%] right-[5%] lg:right-[15%]", delay: 1 },
    { src: '/instagram.svg', label: 'Instagram', position: "bottom-[12%] left-[15%] lg:left-[22%]", delay: 2.5 },
    { src: '/Telegram.svg', label: 'Telegram', position: "bottom-[5%] left-[50%] -translate-x-1/2", delay: 0.8 },
    { src: '/messenger.svg', label: 'Messenger', position: "bottom-[12%] right-[15%] lg:right-[22%]", delay: 1.8 },
  ];

  return (
    <section className="py-32 relative overflow-hidden flex items-center justify-center min-h-[800px] bg-gradient-to-b from-white via-slate-50/50 to-white">
      
      {/* Top Gradient for smooth transition from Pricing */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white to-transparent z-20 pointer-events-none" />

      {/* Background Radial Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(241,245,249,0.8)_0%,rgba(255,255,255,0)_60%)] pointer-events-none" />

      {/* Floating Icons Container */}
      <div className="absolute inset-0 w-full h-full max-w-[90rem] mx-auto pointer-events-none">
        {icons.map((item, index) => (
          <motion.div
            key={`${item.label}-${index}`}
            className={`absolute ${item.position} hidden md:flex items-center justify-center`}
            initial={prefersReducedMotion ? false : { y: 0 }}
            animate={prefersReducedMotion ? { y: 0 } : { y: [0, -20, 0] }}
            transition={{ 
              duration: 4 + index * 0.5, 
              repeat: prefersReducedMotion ? 0 : Infinity, 
              ease: "easeInOut",
              delay: item.delay 
            }}
          >
            <div className="w-20 h-20 lg:w-24 lg:h-24 bg-white rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.08)] flex items-center justify-center transform transition-transform hover:scale-110 duration-300">
              <img src={item.src} alt={`${item.label} logo`} className="w-8 h-8 lg:w-10 lg:h-10 object-contain" loading="lazy" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Central Content */}
      <div className="relative z-30 px-6 max-w-4xl mx-auto text-center">
        <motion.h2 
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
          className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 leading-tight md:leading-[1.1]"
        >
          {t.cta.title}
        </motion.h2>

        <motion.p 
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.3, delay: prefersReducedMotion ? 0 : 0.05 }}
          className="mt-8 text-xl md:text-2xl text-slate-500 max-w-2xl mx-auto leading-relaxed"
        >
          {t.cta.desc}
        </motion.p>

        <motion.div 
          initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.3, delay: prefersReducedMotion ? 0 : 0.1 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <a href={AUTH_URLS.register} className="bg-slate-900 hover:bg-black text-white text-lg md:text-xl font-medium transition-all duration-300 rounded-full px-10 py-5 shadow-2xl shadow-slate-900/20 hover:shadow-slate-900/40 hover:-translate-y-1 flex items-center gap-3 group">
            {t.cta.primary}
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>

      </div>

      {/* Bottom Gradient for smooth transition to Footer */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-20 pointer-events-none" />

    </section>
  );
};

export default CTA;
