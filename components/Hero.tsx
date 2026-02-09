import React from 'react';
import { ArrowRight, Bot, Zap, CheckCircle2, ChevronRight } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="flex flex-col min-h-screen pt-32 md:pt-48 relative overflow-hidden bg-white">
      
      {/* Ambient Background Glow (Subtler) */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 1.5 }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-50/50 rounded-[100%] blur-3xl -z-10 pointer-events-none"
      ></motion.div>
      
      {/* Top Badge */}
      <div className="flex justify-center">
        <motion.button 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-slate-50 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-px text-[10px] sm:text-xs font-semibold leading-6 text-slate-700 inline-block w-fit mx-auto"
        >
          <span className="absolute inset-0 overflow-hidden rounded-full">
            <span className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-slate-100"></span>
          </span>
          <div className="relative flex space-x-2 items-center z-10 rounded-full bg-slate-50 py-1.5 px-4 ring-1 ring-slate-200">
            <span>{t.hero.status}</span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
          </div>
          <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-slate-400/0 via-slate-400/90 to-slate-400/0 transition-opacity duration-500 group-hover:opacity-40"></span>
        </motion.button>
      </div>

      {/* Headline */}
      <motion.h1 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="text-4xl md:text-6xl lg:text-8xl font-semibold max-w-6xl mx-auto text-center mt-6 relative z-10 tracking-tight text-slate-900 leading-tight md:leading-tight lg:leading-[1.1]" 
        dangerouslySetInnerHTML={{ __html: t.hero.headline }} 
      />

      {/* Subheadline */}
      <motion.p 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="text-center mt-8 text-base md:text-xl text-slate-500 max-w-3xl mx-auto relative z-10 leading-relaxed px-6"
      >
        {t.hero.subheadline}
      </motion.p>

      {/* Buttons */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex flex-col sm:flex-row items-center gap-4 justify-center mt-10 relative z-10 px-6"
      >
        <button className="w-full sm:w-auto bg-slate-900 relative z-10 hover:bg-slate-800 border border-transparent text-white text-sm md:text-base transition font-medium duration-200 rounded-full px-8 py-3 flex items-center justify-center shadow-[0px_-1px_0px_0px_#FFFFFF40_inset,_0px_1px_0px_0px_#FFFFFF40_inset]">
          {t.hero.ctaPrimary}
        </button>
        <a className="w-full sm:w-auto relative z-10 bg-transparent hover:bg-slate-100 border border-transparent text-slate-900 text-sm md:text-base transition font-medium duration-200 rounded-full px-8 py-3 justify-center flex space-x-2 items-center group cursor-pointer" href="#">
          <span>{t.hero.ctaSecondary}</span>
          <ArrowRight className="text-slate-400 group-hover:translate-x-1 stroke-[2px] h-4 w-4 transition-transform duration-200" />
        </a>
      </motion.div>

      {/* Dashboard Visual */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 w-full">
        <motion.div 
          initial={{ opacity: 0, y: 100, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="p-4 border border-slate-200 bg-slate-100 rounded-[32px] mt-20 relative"
        >
          
          {/* Bottom Fade Overlay */}
          <div className="absolute inset-x-0 bottom-0 h-40 w-full bg-gradient-to-b from-transparent via-white to-white scale-[1.01] pointer-events-none z-20 rounded-b-[32px]"></div>
          
          <div className="p-2 bg-white border border-slate-200 rounded-[24px] overflow-hidden shadow-sm relative z-10">
             
             {/* Re-using the Mockup Code (Flattened) */}
             <div className="relative bg-white rounded-[20px] overflow-hidden aspect-[16/10] md:aspect-[16/9] flex flex-col">
              
              {/* Mockup Header */}
              <div className="h-14 border-b border-slate-100 flex items-center px-6 justify-between bg-white sticky top-0 z-20">
                 <div className="flex items-center gap-4">
                   <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                      <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                      <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                   </div>
                   <div className="h-6 w-px bg-slate-200 mx-2"></div>
                   <div className="font-semibold text-sm text-slate-700">{t.hero.mockup.dashboard}</div>
                 </div>
                 <div className="flex items-center gap-3">
                   <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                      <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide">{t.hero.mockup.online}</div>
                   </div>
                 </div>
              </div>

              {/* Mockup Body */}
              <div className="flex-1 flex overflow-hidden">
                {/* Sidebar */}
                <div className="hidden md:flex w-72 lg:w-80 border-r border-slate-100 flex-col bg-slate-50/50">
                   <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.hero.mockup.priorityInbox}</div>
                      <div className="bg-slate-200 text-slate-600 text-[10px] px-1.5 py-0.5 rounded font-bold">3</div>
                   </div>
                   <div className="flex-1 overflow-y-auto">
                      {/* Chat Item 1 */}
                      <div className="flex items-center gap-3 p-4 bg-white border-l-[3px] border-emerald-500 shadow-sm cursor-pointer relative z-10 mx-2 mt-2 rounded-r-lg">
                         <div className="relative">
                           <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-700 font-bold text-xs ring-2 ring-white">MK</div>
                           <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                              <div className="w-2.5 h-2.5 bg-green-500 rounded-full border border-white"></div>
                           </div>
                         </div>
                         <div className="flex-1 min-w-0">
                           <div className="flex justify-between items-center mb-1">
                              <span className="font-semibold text-sm text-slate-900">Murat K.</span>
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">9.4</span>
                           </div>
                           <p className="text-xs text-slate-500 truncate font-medium">{t.hero.mockup.readyToSign}</p>
                         </div>
                      </div>
                      {/* Chat Item 2 */}
                      <div className="flex items-center gap-3 p-4 hover:bg-slate-50 cursor-pointer opacity-60 mx-2 rounded-lg">
                         <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold text-xs">AS</div>
                         <div className="flex-1 min-w-0">
                           <div className="flex justify-between items-center mb-1">
                              <span className="font-semibold text-sm text-slate-900">Ayşe S.</span>
                              <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded">6.2</span>
                           </div>
                           <p className="text-xs text-slate-500 truncate">{t.hero.mockup.hours}</p>
                         </div>
                      </div>
                      {/* Chat Item 3 */}
                      <div className="flex items-center gap-3 p-4 hover:bg-slate-50 cursor-pointer opacity-40 mx-2 rounded-lg">
                         <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs">U</div>
                         <div className="flex-1 min-w-0">
                           <div className="flex justify-between items-center mb-1">
                              <span className="font-semibold text-sm text-slate-900">{t.hero.mockup.unknown}</span>
                              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">2.1</span>
                           </div>
                           <p className="text-xs text-slate-500 truncate">hi</p>
                         </div>
                      </div>
                   </div>
                </div>
                
                {/* Chat Area */}
                <div className="flex-1 flex flex-col bg-slate-50/20">
                   {/* Chat Header */}
                   <div className="h-16 border-b border-slate-100 flex items-center justify-between px-6 bg-white/50 backdrop-blur-sm">
                      <div className="flex items-center gap-3">
                         <div className="w-2 h-2 rounded-full bg-green-500"></div>
                         <div>
                            <h3 className="font-bold text-slate-900 text-sm">Murat K.</h3>
                         </div>
                      </div>
                      <div className="flex items-center gap-3">
                         <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm flex items-center gap-2">
                            <Zap className="w-3 h-3 fill-current" />
                            <span className="hidden sm:inline">{t.hero.mockup.leadScore}:</span> 9.4
                         </div>
                         <button className="bg-slate-900 text-white text-xs px-4 py-2 rounded-lg font-medium hover:bg-slate-800 transition-colors shadow-sm hidden sm:block">
                            {t.hero.mockup.takeOver}
                         </button>
                      </div>
                   </div>

                   {/* Messages */}
                   <div className="flex-1 p-8 flex flex-col gap-6 overflow-y-auto">
                      <div className="flex justify-center mb-4">
                         <span className="text-[10px] text-slate-400 font-medium uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">{t.hero.mockup.today}</span>
                      </div>

                      {/* Customer Message */}
                      <div className="flex gap-4 group">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center text-blue-700 text-xs font-bold mt-2">MK</div>
                        <div className="bg-white border border-slate-200 p-5 rounded-2xl rounded-tl-none shadow-sm max-w-lg group-hover:shadow-md transition-shadow">
                          <p className="text-slate-800 text-sm leading-relaxed">{t.hero.mockup.customerMsg}</p>
                        </div>
                      </div>

                      {/* AI Thinking */}
                      <div className="flex items-center gap-3 ml-12 opacity-90 my-2">
                          <div className="w-6 h-6 rounded-full bg-purple-50 flex items-center justify-center">
                             <Bot className="w-3.5 h-3.5 text-purple-600 animate-pulse" />
                          </div>
                          <span className="text-xs text-purple-700 font-medium bg-purple-50 px-3 py-1 rounded-full border border-purple-100">{t.hero.mockup.aiDetected} <span className="font-bold">{t.hero.mockup.intent}</span></span>
                      </div>

                      {/* AI Response */}
                      <div className="flex flex-row-reverse gap-4">
                        <div className="w-8 h-8 rounded-full bg-slate-900 flex-shrink-0 flex items-center justify-center text-white text-xs font-bold mt-2 shadow-lg shadow-purple-500/20">AI</div>
                        <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 text-slate-900 p-5 rounded-2xl rounded-tr-none max-w-lg shadow-sm">
                          <p className="text-sm leading-relaxed">{t.hero.mockup.aiResponse}</p>
                        </div>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>

        </motion.div>
      </div>
    </section>
  );
};

export default Hero;