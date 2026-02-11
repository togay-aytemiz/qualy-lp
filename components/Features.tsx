import React from 'react';
import { useLanguage } from '../LanguageContext';
import { FileText, CheckCircle2, Share2, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import SectionWithHeader from './SectionWithHeader';

interface FeatureBlockHeaderProps {
  title: string;
  description: string;
  html?: boolean;
}

const FeatureBlockHeader: React.FC<FeatureBlockHeaderProps> = ({
  title,
  description,
  html = false,
}) => (
  <div className="relative z-10 mb-8">
    <h3 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">{title}</h3>
    {html ? (
      <p
        className="text-slate-600 leading-relaxed max-w-lg text-sm"
        dangerouslySetInnerHTML={{ __html: description }}
      />
    ) : (
      <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
    )}
  </div>
);

const Features: React.FC = () => {
  const { t } = useLanguage();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <SectionWithHeader
      id="features"
      className="relative overflow-hidden"
      containerClassName="relative z-10 px-4 md:px-8"
      title={t.features.heading}
      subtitle={t.features.subheading}
    >

        {/* Dashed Border Bento Grid */}
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 lg:grid-cols-6 mt-12 border-t border-l border-slate-200 border-dashed rounded-[32px] overflow-hidden bg-slate-50/30"
        >
            
            {/* Feature 1: Intent Scoring (Large, 4 cols) */}
            <motion.div variants={item} className="col-span-1 lg:col-span-4 p-8 border-b border-r border-slate-200 border-dashed bg-white relative group transition-colors hover:bg-slate-50/50">
              <FeatureBlockHeader
                title={t.features.feat2_title}
                description={t.features.feat2_desc}
                html
              />

              {/* Visual: Chat Interface + Lead Score Card */}
              <div className="relative h-[300px] md:h-[350px] w-full bg-white border border-slate-200 rounded-[24px] overflow-hidden flex shadow-sm group-hover:shadow-md transition-all">
                 
                 {/* Chat Side */}
                 <div className="w-1/2 border-r border-slate-100 bg-white p-4 flex flex-col gap-3">
                    <div className="flex gap-2">
                       <div className="w-6 h-6 rounded-full bg-blue-100 flex-shrink-0"></div>
                       <div className="bg-slate-50 border border-slate-100 rounded-2xl rounded-tl-none p-3 text-[10px] text-slate-600 max-w-[90%]">
                          {t.hero.mockup.customerMsg}
                       </div>
                    </div>
                    <div className="flex gap-2 flex-row-reverse">
                       <div className="w-6 h-6 rounded-full bg-slate-900 flex-shrink-0"></div>
                       <div className="bg-blue-600 text-white rounded-2xl rounded-tr-none p-3 text-[10px] max-w-[90%] shadow-sm">
                          {t.hero.mockup.aiResponse}
                       </div>
                    </div>
                 </div>

                 {/* Analysis Side */}
                 <div className="flex-1 bg-slate-50/50 p-6 flex flex-col items-center justify-center relative">
                    <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-50"></div>
                    
                    {/* Floating Score Card */}
                    <div className="bg-white p-5 rounded-2xl shadow-xl border border-slate-100 relative z-10 w-full max-w-[200px] transform transition-transform group-hover:scale-105 duration-500">
                        <div className="flex justify-between items-center mb-3">
                           <div className="text-xs font-bold text-slate-900">Murat K.</div>
                           <div className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-full">9.4</div>
                        </div>
                        <div className="space-y-2">
                           <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-500 w-[94%]"></div>
                           </div>
                           <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                              <span>High Intent</span>
                           </div>
                        </div>
                    </div>
                 </div>
              </div>
            </motion.div>

            {/* Feature 2: Knowledge Base (2 cols) */}
            <motion.div variants={item} className="col-span-1 lg:col-span-2 p-8 border-b border-r border-slate-200 border-dashed bg-white relative group transition-colors hover:bg-slate-50/50">
               <FeatureBlockHeader
                 title={t.features.feat1_title}
                 description={t.features.feat1_desc1}
               />
               
               {/* Visual: Mobile Chat */}
               <div className="relative w-full h-[350px] bg-white rounded-[24px] border border-slate-200 shadow-sm overflow-hidden p-2 group-hover:shadow-md transition-all">
                  <div className="w-full h-full bg-slate-50 rounded-[20px] p-4 flex flex-col gap-3 overflow-hidden">
                     <div className="self-end bg-slate-900 text-white p-3 rounded-2xl rounded-tr-sm text-xs shadow-sm">
                        Do you have a price list?
                     </div>
                     <div className="self-start bg-white border border-slate-100 text-slate-700 p-3 rounded-2xl rounded-tl-sm text-xs shadow-sm max-w-[90%]">
                        <div className="flex items-center gap-2 mb-2">
                           <FileText className="w-4 h-4 text-red-500" />
                           <span className="font-bold">Pricing_2024.pdf</span>
                        </div>
                        Reading document...
                     </div>
                     <div className="self-start bg-white border border-slate-100 text-slate-700 p-3 rounded-2xl rounded-tl-sm text-xs shadow-sm mt-1">
                        Here is the summary of our Growth package...
                     </div>
                  </div>
               </div>
            </motion.div>

            {/* Feature 3: Integrations (3 cols) */}
            <motion.div variants={item} className="col-span-1 lg:col-span-3 p-8 border-b border-r border-slate-200 border-dashed bg-white relative group transition-colors hover:bg-slate-50/50">
               <FeatureBlockHeader
                  title={t.features.feat3_title}
                  description={t.features.feat3_desc1}
               />

               {/* Visual: Toggle List */}
               <div className="relative w-full bg-white rounded-[24px] border border-slate-200 shadow-sm p-4 overflow-hidden group-hover:shadow-md transition-all">
                  <div className="grid grid-cols-2 gap-3">
                     {[
                        { name: 'WhatsApp', icon: 'bg-green-500', status: true },
                        { name: 'Instagram', icon: 'bg-pink-500', status: true },
                        { name: 'Telegram', icon: 'bg-sky-500', status: true },
                        { name: 'Messenger', icon: 'bg-slate-400', status: false },
                     ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                           <div className="flex items-center gap-2">
                              <div className={`w-6 h-6 rounded-md ${item.icon} flex items-center justify-center text-white`}>
                                 <Share2 className="w-3 h-3" />
                              </div>
                              <span className="text-xs font-bold text-slate-900">{item.name}</span>
                           </div>
                           <div className={`w-8 h-4 rounded-full relative ${item.status ? 'bg-slate-900' : 'bg-slate-200'}`}>
                              <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${item.status ? 'left-[18px]' : 'left-0.5'}`}></div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </motion.div>

            {/* Feature 4: Focus / Security (3 cols) */}
            <motion.div variants={item} className="col-span-1 lg:col-span-3 p-8 border-b border-r border-slate-200 border-dashed bg-white relative overflow-hidden flex flex-col group transition-colors hover:bg-slate-50/50">
               <FeatureBlockHeader
                  title={t.features.feat4_title}
                  description={t.features.feat4_desc}
               />

               {/* Visual: Guardrail badges */}
               <div className="mt-auto relative w-full bg-white rounded-[24px] border border-slate-200 shadow-sm h-24 overflow-hidden flex items-center group-hover:shadow-md transition-all">
                  <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10"></div>
                  <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10"></div>
                  
                  <div className="flex gap-4 animate-scroll w-max px-4">
                     {t.features.feat4_badges.map((badge) => (
                        <div key={badge} className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-lg border border-slate-100 shadow-sm text-xs font-bold text-slate-600 whitespace-nowrap">
                           <Shield className="w-3 h-3 text-emerald-500" /> {badge}
                        </div>
                     ))}
                  </div>
               </div>
            </motion.div>

            {/* Feature 5: Service Profile + Key Info (Full width) */}
            <motion.div variants={item} className="col-span-1 lg:col-span-6 p-8 border-b border-r border-slate-200 border-dashed bg-white relative group transition-colors hover:bg-slate-50/50">
               <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                  <FeatureBlockHeader
                    title={t.features.feat5_title}
                    description={t.features.feat5_desc}
                  />

                  <div className="relative w-full rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition-all group-hover:shadow-md">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                        {t.features.feat5_mockup_title}
                      </p>
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700">
                        {t.features.feat5_mockup_badge}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {[
                        [t.features.feat5_mockup_service_label, t.features.feat5_mockup_service_value],
                        [t.features.feat5_mockup_date_label, t.features.feat5_mockup_date_value],
                        [t.features.feat5_mockup_budget_label, t.features.feat5_mockup_budget_value],
                        [t.features.feat5_mockup_location_label, t.features.feat5_mockup_location_value],
                      ].map(([label, value]) => (
                        <div key={String(label)} className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
                          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">{label}</p>
                          <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 flex items-start gap-2 rounded-xl border border-dashed border-amber-200 bg-amber-50/70 px-3 py-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-amber-600" />
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-amber-700">
                          {t.features.feat5_mockup_missing_label}
                        </p>
                        <p className="mt-1 text-sm text-amber-800">{t.features.feat5_mockup_missing_value}</p>
                      </div>
                    </div>
                  </div>
               </div>
            </motion.div>

        </motion.div>
    </SectionWithHeader>
  );
};

export default Features;
