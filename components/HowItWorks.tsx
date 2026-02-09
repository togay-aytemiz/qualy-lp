import React from 'react';
import { Smartphone, Upload, Trophy } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import SectionHeader from './SectionHeader';
import { motion } from 'framer-motion';

const HowItWorks: React.FC = () => {
  const { t } = useLanguage();

  const steps = [
    {
      title: t.howItWorks.step1_title,
      desc: t.howItWorks.step1_desc,
      icon: <Smartphone className="w-6 h-6" />,
      color: "group-hover:bg-blue-600"
    },
    {
      title: t.howItWorks.step2_title,
      desc: t.howItWorks.step2_desc,
      icon: <Upload className="w-6 h-6" />,
      color: "group-hover:bg-purple-600"
    },
    {
      title: t.howItWorks.step3_title,
      desc: t.howItWorks.step3_desc,
      icon: <Trophy className="w-6 h-6" />,
      color: "group-hover:bg-emerald-600"
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <section id="how-it-works" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <SectionHeader 
          title={t.howItWorks.title}
          subtitle={t.howItWorks.subtitle}
        />

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 border-t border-l border-slate-200 border-dashed mt-12 rounded-3xl overflow-hidden bg-slate-50/30"
        >
           {steps.map((step, index) => (
             <motion.div 
               variants={item}
               key={index} 
               className="flex flex-col border-b border-r border-slate-200 border-dashed py-12 md:py-16 relative group bg-white hover:bg-slate-50 transition-colors duration-300"
             >
                {/* Hover Gradient */}
                <div className="opacity-0 group-hover:opacity-100 transition duration-500 group absolute inset-0 h-full w-full bg-gradient-to-t from-slate-100 to-transparent pointer-events-none"></div>
                
                {/* Icon */}
                <div className="mb-6 relative z-10 px-8 text-slate-400 group-hover:text-slate-900 transition-colors duration-300">
                   {step.icon}
                </div>

                {/* Title & Bar */}
                <div className="text-xl font-bold mb-4 relative z-10 px-8 flex items-center">
                   <div className={`absolute left-0 h-8 w-1 rounded-r-full bg-slate-200 ${step.color} transition-all duration-300`}></div>
                   <span className="group-hover:translate-x-2 transition-transform duration-300 inline-block text-slate-900">{step.title}</span>
                </div>

                {/* Description */}
                <p className="text-base text-slate-500 relative z-10 px-8 leading-relaxed max-w-sm">
                   {step.desc}
                </p>
             </motion.div>
           ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;