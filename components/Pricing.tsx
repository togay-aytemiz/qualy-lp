import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import SectionHeader from './SectionHeader';
import { motion } from 'framer-motion';

const Pricing: React.FC = () => {
  const { t } = useLanguage();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <section id="pricing" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <SectionHeader 
          title={t.pricing.title}
          subtitle={t.pricing.subtitle}
        />

        <div className="flex flex-col items-center">
          {/* Custom Toggle from Reference */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center bg-neutral-100 p-1 w-fit mx-auto mb-12 rounded-md overflow-hidden"
          >
            <button 
              onClick={() => setBillingCycle('monthly')}
              className={`text-sm font-medium px-6 py-2 rounded-md relative transition-all duration-200 ${billingCycle === 'monthly' ? 'text-white' : 'text-gray-500 hover:text-gray-900'}`}
            >
              {billingCycle === 'monthly' && (
                <span className="absolute inset-0 bg-black rounded-md shadow-sm"></span>
              )}
              <span className="relative z-10">{t.pricing.monthly}</span>
            </button>
            <button 
              onClick={() => setBillingCycle('yearly')}
              className={`text-sm font-medium px-6 py-2 rounded-md relative transition-all duration-200 ${billingCycle === 'yearly' ? 'text-white' : 'text-gray-500 hover:text-gray-900'}`}
            >
              {billingCycle === 'yearly' && (
                <span className="absolute inset-0 bg-black rounded-md shadow-sm"></span>
              )}
              <span className="relative z-10">{t.pricing.yearly}</span>
            </button>
          </motion.div>

          {/* Single Premium Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-lg mx-auto"
          >
            <div className="relative bg-[radial-gradient(164.75%_100%_at_50%_0%,#334155_0%,#0F172A_48.73%)] shadow-2xl rounded-2xl px-8 py-10 flex flex-col h-full border border-slate-700">
              <div className="mb-8">
                <h3 className="text-white text-xl font-bold leading-7">{t.pricing.professional.title}</h3>
                <p className="text-slate-300 mt-2 text-sm leading-6">
                  {t.pricing.professional.desc}
                </p>
                <div className="mt-6 flex items-baseline gap-x-2">
                  <span className="text-5xl font-bold tracking-tight text-white">
                    {billingCycle === 'monthly' ? t.pricing.professional.priceMonthly : t.pricing.professional.priceYearly}
                  </span>
                  {billingCycle === 'yearly' && (
                     <span className="text-sm font-semibold leading-6 text-emerald-400">
                       {t.pricing.save}
                     </span>
                  )}
                </div>
              </div>
              
              <ul role="list" className="flex-1 space-y-4 text-sm leading-6 text-slate-300 mb-10">
                {t.pricing.professional.features.map((feature, index) => (
                  <li key={index} className="flex gap-x-3 items-start">
                    <Check className="h-6 w-5 flex-none text-white" aria-hidden="true" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button className="bg-white text-black hover:bg-slate-100 transition-colors duration-200 w-full rounded-full py-3 px-4 text-center text-sm font-bold shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                {t.pricing.professional.cta}
              </button>
            </div>
            
            {/* Decoration behind card */}
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-[2rem] blur-2xl opacity-20 -z-10"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;