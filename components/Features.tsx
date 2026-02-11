import React, { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { FileText, CheckCircle2, Shield } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { RiInstagramFill, RiMessengerFill, RiTelegramFill, RiWhatsappFill } from 'react-icons/ri';
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

type FeatureMessageRole = 'customer' | 'assistant';

const clampScore = (value: number) => Math.max(0.2, Math.min(9.9, value));

const toInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

const Features: React.FC = () => {
  const { t } = useLanguage();
  const baseScenarios = t.hero.mockup.animatedScenarios;

  const extraScenarios = useMemo(() => {
    const first = baseScenarios[0];
    const second = baseScenarios[1] ?? first;
    const fallbackScenarioName = second?.name ?? t.hero.mockup.thirdLeadName;
    const fallbackMessage = t.hero.mockup.customerMsg;
    const fallbackReply = t.hero.mockup.aiResponse;

    return [
      {
        initials: toInitials(t.hero.mockup.thirdLeadName) || 'BK',
        name: t.hero.mockup.thirdLeadName,
        platform: first?.platform ?? 'whatsapp',
        preview: t.hero.mockup.thirdLeadPreview,
        lastMessageAt: first?.lastMessageAt ?? '5m',
        messages: [
          t.hero.mockup.thirdLeadPreview,
          fallbackReply,
          t.hero.mockup.hours,
          first?.messages[3] ?? fallbackReply,
        ],
        scores: [6.4, 8.6],
      },
      {
        initials: toInitials(fallbackScenarioName) || 'BK',
        name: second?.name ?? t.hero.mockup.thirdLeadName,
        platform: second?.platform ?? 'telegram',
        preview: fallbackMessage,
        lastMessageAt: second?.lastMessageAt ?? '11m',
        messages: [
          fallbackMessage,
          fallbackReply,
          second?.messages[2] ?? t.hero.mockup.hours,
          second?.messages[3] ?? fallbackReply,
        ],
        scores: [4.7, 9.1],
      },
    ];
  }, [baseScenarios, t.hero.mockup.aiResponse, t.hero.mockup.customerMsg, t.hero.mockup.hours, t.hero.mockup.thirdLeadName, t.hero.mockup.thirdLeadPreview]);

  const intentScenarios = useMemo(() => {
    const seeded = baseScenarios.length ? baseScenarios : extraScenarios.slice(0, 1);
    return [...seeded, ...extraScenarios].slice(0, 5);
  }, [baseScenarios, extraScenarios]);

  const [activeScenarioIndex, setActiveScenarioIndex] = useState(0);
  const [activeMessageIndex, setActiveMessageIndex] = useState(0);

  useEffect(() => {
    if (!intentScenarios.length) return;
    const activeScenario = intentScenarios[activeScenarioIndex % intentScenarios.length];
    if (!activeScenario || !activeScenario.messages.length) return;

    const hasNextMessage = activeMessageIndex < activeScenario.messages.length - 1;
    const timer = window.setTimeout(() => {
      if (hasNextMessage) {
        setActiveMessageIndex((prev) => prev + 1);
        return;
      }

      setActiveScenarioIndex((prev) => (prev + 1) % intentScenarios.length);
      setActiveMessageIndex(0);
    }, hasNextMessage ? 1800 : 1400);

    return () => window.clearTimeout(timer);
  }, [activeMessageIndex, activeScenarioIndex, intentScenarios]);

  const activeScenario = intentScenarios[activeScenarioIndex % Math.max(intentScenarios.length, 1)];
  const visibleMessages = (activeScenario?.messages ?? [])
    .slice(0, activeMessageIndex + 1)
    .map((text, index) => ({
      id: `${activeScenarioIndex}-${index}-${text.slice(0, 16)}`,
      text,
      role: (index % 2 === 0 ? 'customer' : 'assistant') as FeatureMessageRole,
    }));

  const customerMessageCount = visibleMessages.filter((message) => message.role === 'customer').length;
  const scoreStep = Math.max(0, customerMessageCount - 1);
  const currentScore = clampScore(activeScenario?.scores[Math.min(scoreStep, (activeScenario?.scores.length ?? 1) - 1)] ?? 0);
  const previousScore = clampScore(activeScenario?.scores[Math.max(0, scoreStep - 1)] ?? currentScore);
  const scoreDelta = currentScore - previousScore;
  const scoreProgress = Math.max(6, Math.min(100, currentScore * 10));

  const hasNextMessage = activeMessageIndex < ((activeScenario?.messages.length ?? 1) - 1);
  const leftStatusLabel = hasNextMessage ? t.features.feat2_mockup_processing : t.features.feat2_mockup_done;
  const extractionPhaseLabel = !hasNextMessage
    ? t.features.feat2_mockup_done
    : scoreStep <= 0
      ? t.features.feat2_mockup_check1
      : scoreStep === 1
        ? t.features.feat2_mockup_check2
        : t.features.feat2_mockup_check3;

  const intentTone =
    currentScore >= 8
      ? {
        badge: 'bg-emerald-100 text-emerald-800',
        chip: 'border-emerald-200 bg-emerald-50 text-emerald-700',
        bar: 'bg-emerald-500',
        label: t.hero.mockup.intentHot,
      }
      : currentScore >= 5
        ? {
          badge: 'bg-amber-100 text-amber-800',
          chip: 'border-amber-200 bg-amber-50 text-amber-700',
          bar: 'bg-amber-500',
          label: t.hero.mockup.intentWarm,
        }
        : {
          badge: 'bg-slate-200 text-slate-700',
          chip: 'border-slate-200 bg-slate-100 text-slate-600',
          bar: 'bg-slate-500',
          label: t.hero.mockup.intentCold,
        };

  const platformMetaMap = {
    whatsapp: {
      label: 'WhatsApp',
      icon: RiWhatsappFill,
      chip: 'border-[#25D366]/40 bg-[#25D366]/10 text-[#1e8f47]',
    },
    instagram: {
      label: 'Instagram',
      icon: RiInstagramFill,
      chip: 'border-[#E1306C]/40 bg-[#E1306C]/10 text-[#b61f55]',
    },
    telegram: {
      label: 'Telegram',
      icon: RiTelegramFill,
      chip: 'border-[#229ED9]/40 bg-[#229ED9]/10 text-[#1d7eac]',
    },
  } as const;

  const activeScenarioPlatform = platformMetaMap[activeScenario?.platform ?? 'whatsapp'];
  const ActiveScenarioPlatformIcon = activeScenarioPlatform.icon;

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
      title={
        <>
          <span className="md:hidden">{t.features.heading_mobile}</span>
          <span className="hidden md:inline">{t.features.heading}</span>
        </>
      }
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
            <motion.div variants={item} className="col-span-1 lg:col-span-4 p-8 border-b border-r border-slate-200 border-dashed bg-white relative group transition-colors hover:bg-slate-50/50 flex flex-col">
              <FeatureBlockHeader
                title={t.features.feat2_title}
                description={t.features.feat2_desc}
                html
              />

              <div className="mt-auto relative h-[380px] md:h-[350px] w-full bg-white border border-slate-200 rounded-[24px] overflow-hidden flex shadow-sm group-hover:shadow-md transition-all">
                <div className="md:hidden h-full w-full bg-white p-2 flex flex-col">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-2">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-900 truncate">{activeScenario?.name}</p>
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[10px] font-semibold ${activeScenarioPlatform.chip}`}>
                        <ActiveScenarioPlatformIcon className="h-3.5 w-3.5" />
                        {activeScenarioPlatform.label}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">{t.hero.mockup.leadScore}</p>
                      <motion.div
                        key={`mobile-${activeScenarioIndex}-${scoreStep}-score`}
                        initial={{ scale: 0.88, opacity: 0.6 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.24 }}
                        className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${intentTone.badge}`}
                      >
                        {currentScore.toFixed(1)}
                      </motion.div>
                    </div>
                    <div className="mt-2 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                      <motion.div
                        initial={false}
                        animate={{ width: `${scoreProgress}%` }}
                        transition={{ duration: 0.45, ease: 'easeOut' }}
                        className={`h-full ${intentTone.bar}`}
                      />
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
                      <span className="truncate">{intentTone.label}</span>
                      <span>{scoreDelta >= 0 ? '+' : '-'}{Math.abs(scoreDelta).toFixed(1)} {t.hero.mockup.leadScoreShort}</span>
                    </div>
                  </div>

                  <div className="mt-2 flex-1 rounded-2xl border border-slate-200 bg-slate-50/60 p-2 overflow-hidden">
                    <div className="flex h-full flex-col justify-end gap-2">
                      <AnimatePresence initial={false}>
                        {visibleMessages.map((message) => (
                          <motion.div
                            key={`mobile-${message.id}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                            className={`flex ${message.role === 'assistant' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[90%] rounded-2xl px-3 py-2 text-[11px] leading-relaxed shadow-sm ${
                                message.role === 'assistant'
                                  ? 'rounded-br-none bg-blue-600 text-white'
                                  : 'rounded-bl-none border border-slate-200 bg-white text-slate-700'
                              }`}
                            >
                              {message.text}
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 p-2">
                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span className="font-semibold uppercase tracking-[0.12em]">{leftStatusLabel}</span>
                      <span className="font-medium">{extractionPhaseLabel}</span>
                    </div>
                    <div className="mt-2 grid grid-cols-4 gap-1.5">
                      {(activeScenario?.messages ?? []).map((_, index) => (
                        <div key={`mobile-${activeScenarioIndex}-step-${index}`} className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
                          <motion.div
                            initial={false}
                            animate={{ width: activeMessageIndex >= index ? '100%' : '0%' }}
                            transition={{ duration: 0.25 }}
                            className="h-full bg-slate-700"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="hidden md:flex h-full w-full">
                  <div className="w-1/2 border-r border-slate-100 bg-white p-3 md:p-4 flex flex-col">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.14em] text-slate-500 font-semibold">
                          {t.hero.mockup.newLead}
                        </p>
                        <p className="text-xs font-semibold text-slate-900 mt-0.5">{activeScenario?.name}</p>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[10px] font-semibold ${activeScenarioPlatform.chip}`}>
                        <ActiveScenarioPlatformIcon className="h-3.5 w-3.5" />
                        {activeScenarioPlatform.label}
                      </span>
                    </div>

                    <div className="mt-3 flex-1 rounded-2xl border border-slate-200 bg-slate-50/60 p-2.5 md:p-3 overflow-hidden">
                      <div className="flex h-full flex-col justify-end gap-2">
                        <AnimatePresence initial={false}>
                          {visibleMessages.map((message) => (
                            <motion.div
                              key={message.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -6 }}
                              transition={{ duration: 0.2, ease: 'easeOut' }}
                              className={`flex ${message.role === 'assistant' ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-[88%] rounded-2xl px-3 py-2 text-[11px] leading-relaxed shadow-sm ${
                                  message.role === 'assistant'
                                    ? 'rounded-br-none bg-blue-600 text-white'
                                    : 'rounded-bl-none border border-slate-200 bg-white text-slate-700'
                                }`}
                              >
                                {message.text}
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    </div>

                    <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-2.5">
                      <div className="flex items-center justify-between text-[10px] text-slate-500">
                        <span className="font-semibold uppercase tracking-[0.12em]">{leftStatusLabel}</span>
                        <span className="font-medium">{extractionPhaseLabel}</span>
                      </div>
                      <div className="mt-2 grid grid-cols-4 gap-1.5">
                        {(activeScenario?.messages ?? []).map((_, index) => (
                          <div key={`${activeScenarioIndex}-step-${index}`} className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
                            <motion.div
                              initial={false}
                              animate={{ width: activeMessageIndex >= index ? '100%' : '0%' }}
                              transition={{ duration: 0.25 }}
                              className="h-full bg-slate-700"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 bg-slate-50/60 p-3 md:p-4 flex flex-col relative">
                    <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
                    <div className="relative z-10 flex h-full flex-col">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                          {t.features.feat2_mockup_potential}
                        </p>
                        <span className={`rounded-full border px-2 py-1 text-[10px] font-semibold ${intentTone.chip}`}>
                          {intentTone.label}
                        </span>
                      </div>

                      <div className="mt-3 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm">
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-sm font-bold text-slate-900">{activeScenario?.name}</div>
                          <motion.div
                            key={`${activeScenarioIndex}-${scoreStep}-score`}
                            initial={{ scale: 0.88, opacity: 0.6 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.24 }}
                            className={`rounded-full px-2.5 py-1 text-xs font-bold ${intentTone.badge}`}
                          >
                            {currentScore.toFixed(1)}
                          </motion.div>
                        </div>

                        <div className="mt-3 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                          <motion.div
                            initial={false}
                            animate={{ width: `${scoreProgress}%` }}
                            transition={{ duration: 0.45, ease: 'easeOut' }}
                            className={`h-full ${intentTone.bar}`}
                          />
                        </div>

                        <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
                          <span>{scoreDelta >= 0 ? '+' : '-'}{Math.abs(scoreDelta).toFixed(1)} {t.hero.mockup.leadScoreShort}</span>
                          <span>{t.features.feat2_mockup_btn}</span>
                        </div>
                      </div>

                      <div className="mt-3 flex-1 rounded-2xl border border-slate-200 bg-white/95 p-3">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                          {t.hero.mockup.priorityInbox}
                        </p>
                        <div className="mt-2 space-y-1.5">
                          {intentScenarios.map((scenario, index) => {
                            const scenarioScore = clampScore(scenario.scores[scenario.scores.length - 1] ?? 0);
                            const isActive = index === activeScenarioIndex;

                            const scenarioPlatform = platformMetaMap[scenario.platform];
                            const ScenarioPlatformIcon = scenarioPlatform.icon;

                            return (
                              <div
                                key={`${scenario.name}-${index}`}
                                className={`rounded-lg border px-2 py-1.5 transition-colors ${isActive ? 'border-blue-200 bg-blue-50/70' : 'border-slate-200 bg-white'}`}
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <span className="min-w-0 inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-700">
                                    <ScenarioPlatformIcon className="h-3.5 w-3.5 shrink-0 text-slate-500" />
                                    <span className="truncate">{scenario.name}</span>
                                  </span>
                                  <span className="text-[10px] font-semibold text-slate-500">{scenarioScore.toFixed(1)}</span>
                                </div>
                                <div className="mt-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                                  <div className="h-full bg-slate-600 transition-all duration-500" style={{ width: `${Math.max(5, scenarioScore * 10)}%` }} />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Feature 2: Knowledge Base (2 cols) */}
            <motion.div variants={item} className="col-span-1 lg:col-span-2 p-8 border-b border-r border-slate-200 border-dashed bg-white relative group transition-colors hover:bg-slate-50/50 flex flex-col">
               <FeatureBlockHeader
                 title={t.features.feat1_title}
                 description={t.features.feat1_desc1}
               />
               
               {/* Visual: Mobile Chat */}
               <div className="mt-auto relative h-[300px] md:h-[350px] w-full bg-white rounded-[24px] border border-slate-200 shadow-sm overflow-hidden p-2 group-hover:shadow-md transition-all">
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
                        { name: 'WhatsApp', status: true, iconClass: 'bg-[#25D366]', icon: RiWhatsappFill },
                        { name: 'Instagram', status: true, iconClass: 'bg-[#E1306C]', icon: RiInstagramFill },
                        { name: 'Telegram', status: true, iconClass: 'bg-[#229ED9]', icon: RiTelegramFill },
                        { name: 'Messenger', status: false, iconClass: 'bg-[#6B7280]', icon: RiMessengerFill },
                     ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                           <div className="flex items-center gap-2">
                              <div className={`w-6 h-6 rounded-md ${item.iconClass} flex items-center justify-center text-white`}>
                                 <item.icon className="w-3.5 h-3.5" />
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
