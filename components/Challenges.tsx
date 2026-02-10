import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { motion } from 'framer-motion';
import SectionWithHeader from './SectionWithHeader';

const Challenges: React.FC = () => {
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);

  const challenges = [
    {
      id: 'founders',
      title: t.challenges.roles.founders,
      headline: t.challenges.cards.founders.headline,
      desc: t.challenges.cards.founders.desc,
      image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=600&h=800"
    },
    {
      id: 'customerSuccess',
      title: t.challenges.roles.customerSuccess,
      headline: t.challenges.cards.customerSuccess.headline,
      desc: t.challenges.cards.customerSuccess.desc,
      image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=600&h=800"
    },
    {
      id: 'sales',
      title: t.challenges.roles.sales,
      headline: t.challenges.cards.sales.headline,
      desc: t.challenges.cards.sales.desc,
      image: "https://images.unsplash.com/photo-1553877616-1528073ee413?auto=format&fit=crop&q=80&w=600&h=800"
    },
    {
      id: 'marketing',
      title: t.challenges.roles.marketing,
      headline: t.challenges.cards.marketing.headline,
      desc: t.challenges.cards.marketing.desc,
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=600&h=800"
    }
  ];

  return (
    <SectionWithHeader
      className="border-b border-slate-100"
      title={
        <>
          {t.challenges.title_part1} <span className="text-purple-600">{t.challenges.title_part2}</span>
        </>
      }
      subtitle={t.challenges.subtitle}
    >

        {/* Tab Buttons (syncs with cards) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-start md:justify-center overflow-x-auto gap-4 mb-8 pb-4 md:pb-0 scrollbar-hide"
        >
          {challenges.map((challenge, index) => (
            <button
              key={challenge.id}
              onClick={() => setActiveIndex(index)}
              className={`px-8 py-4 rounded-xl text-sm font-semibold whitespace-nowrap border transition-all duration-300 ${
                activeIndex === index
                  ? 'bg-purple-600 text-white border-purple-600 shadow-lg shadow-purple-200'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-purple-200 hover:text-purple-600'
              }`}
            >
              {challenge.title}
            </button>
          ))}
        </motion.div>

        {/* Expanding Cards Container */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col md:flex-row gap-4 h-auto md:h-[600px]"
        >
          {challenges.map((challenge, index) => (
            <div
              key={challenge.id}
              onClick={() => setActiveIndex(index)}
              className={`
                relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 ease-in-out group
                ${activeIndex === index ? 'flex-[3] shadow-2xl scale-[1.01]' : 'flex-[1] grayscale hover:grayscale-0 opacity-70 hover:opacity-100'}
                ${activeIndex === index ? 'h-[500px] md:h-auto' : 'hidden md:block'}
              `}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img 
                  src={challenge.image} 
                  alt={challenge.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className={`absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent transition-opacity duration-500 ${activeIndex === index ? 'opacity-90' : 'opacity-60'}`}></div>
              </div>

              {/* Content Overlay */}
              <div className="absolute bottom-0 left-0 w-full p-8 md:p-10 flex flex-col justify-end h-full">
                <div className={`transition-all duration-500 ${activeIndex === index ? 'translate-y-0 opacity-100' : 'translate-y-4 md:translate-y-8'}`}>
                  <h3 className={`font-bold text-white mb-4 leading-tight ${activeIndex === index ? 'text-2xl md:text-3xl' : 'text-xl'}`}>
                    {challenge.headline}
                  </h3>
                  <p className={`text-slate-200 text-base md:text-lg leading-relaxed transition-all duration-500 delay-100 ${
                    activeIndex === index 
                      ? 'opacity-100 max-h-40' 
                      : 'opacity-0 max-h-0 hidden md:block'
                  }`}>
                    {challenge.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

    </SectionWithHeader>
  );
};

export default Challenges;
