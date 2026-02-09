import React from 'react';
import { useLanguage } from '../LanguageContext';
import { motion } from 'framer-motion';
import { Shield, Sparkles, FileText, Lock, Mic, Send, Mail, ArrowRight, Zap } from 'lucide-react';

const CTA: React.FC = () => {
  const { t } = useLanguage();

  // Configuration for the floating icons matching the reference image layout
  // Using larger sizing and solid colors (monochrome)
  const icons = [
    // Top Row
    { Icon: Lock, position: "top-[12%] left-[15%] lg:left-[22%]", delay: 0 },
    { Icon: Sparkles, position: "top-[5%] left-[50%] -translate-x-1/2", delay: 1.5 },
    { Icon: FileText, position: "top-[12%] right-[15%] lg:right-[22%]", delay: 0.5 },
    
    // Middle Row (sides)
    { Icon: Shield, position: "top-[45%] left-[5%] lg:left-[15%]", delay: 2 },
    { Icon: Mic, position: "top-[45%] right-[5%] lg:right-[15%]", delay: 1 },

    // Bottom Row
    { Icon: Zap, position: "bottom-[12%] left-[15%] lg:left-[22%]", delay: 2.5 }, 
    { Icon: Send, position: "bottom-[5%] left-[50%] -translate-x-1/2", delay: 0.8 },
    { Icon: Mail, position: "bottom-[12%] right-[15%] lg:right-[22%]", delay: 1.8 },
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
            key={index}
            className={`absolute ${item.position} hidden md:flex items-center justify-center`}
            initial={{ y: 0 }}
            animate={{ 
              y: [0, -20, 0],
            }}
            transition={{ 
              duration: 4 + index * 0.5, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: item.delay 
            }}
          >
            {/* Icon Circle */}
            <div className="w-20 h-20 lg:w-24 lg:h-24 bg-white rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-slate-100 flex items-center justify-center transform transition-transform hover:scale-110 duration-300">
              {/* Solid filled icons */}
              <item.Icon 
                className="w-8 h-8 lg:w-10 lg:h-10 text-slate-900 fill-slate-900" 
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Central Content */}
      <div className="relative z-30 px-6 max-w-4xl mx-auto text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 leading-tight md:leading-[1.1]"
        >
          {t.cta.title}
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-8 text-xl md:text-2xl text-slate-500 max-w-2xl mx-auto leading-relaxed"
        >
          {t.cta.desc}
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <button className="bg-slate-900 hover:bg-black text-white text-lg md:text-xl font-medium transition-all duration-300 rounded-full px-10 py-5 shadow-2xl shadow-slate-900/20 hover:shadow-slate-900/40 hover:-translate-y-1 flex items-center gap-3 group">
            {t.cta.primary}
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 text-sm text-slate-400 font-medium"
        >
          {t.cta.note}
        </motion.p>
      </div>

      {/* Bottom Gradient for smooth transition to Footer */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-20 pointer-events-none" />

    </section>
  );
};

export default CTA;