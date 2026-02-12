import React, { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { BellRing, CheckCircle2, FileText, Hand, Undo2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import SectionWithHeader from './SectionWithHeader';

interface FeatureBlockHeaderProps {
  title: string;
  description: string;
  html?: boolean;
  titleHighlight?: string;
  titleHighlightClassName?: string;
}

const FeatureBlockHeader: React.FC<FeatureBlockHeaderProps> = ({
  title,
  description,
  html = false,
  titleHighlight,
  titleHighlightClassName,
}) => (
  <div className="relative z-10 mb-8">
    <h3 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">
      {(() => {
        if (!titleHighlight) return title;
        const highlightIndex = title.indexOf(titleHighlight);
        if (highlightIndex < 0) return title;

        const before = title.slice(0, highlightIndex);
        const after = title.slice(highlightIndex + titleHighlight.length);

        return (
          <>
            {before}
            <span className={`${titleHighlightClassName ?? 'bg-gradient-to-r from-violet-600 via-fuchsia-500 to-orange-500'} bg-clip-text text-transparent`}>
              {titleHighlight}
            </span>
            {after}
          </>
        );
      })()}
    </h3>
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
  const { t, language } = useLanguage();
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
  const [handoverStep, setHandoverStep] = useState(0);

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

  const handoverStages = useMemo(
    () => [
      { label: t.features.feat4_badges[4], icon: BellRing },
      { label: t.features.feat4_badges[1], icon: Hand },
      { label: t.features.feat4_badges[2], icon: Undo2 },
    ],
    [t.features.feat4_badges]
  );

  useEffect(() => {
    if (!handoverStages.length) return;
    const timer = window.setTimeout(() => {
      setHandoverStep((prev) => (prev + 1) % handoverStages.length);
    }, 1800);
    return () => window.clearTimeout(timer);
  }, [handoverStep, handoverStages.length]);

  const activeScenario = intentScenarios[activeScenarioIndex % Math.max(intentScenarios.length, 1)];
  const visibleMessages = (activeScenario?.messages ?? [])
    .slice(0, activeMessageIndex + 1)
    .map((text, index) => ({
      id: `${activeScenarioIndex}-${index}-${text.slice(0, 16)}`,
      text,
      role: (index % 2 === 0 ? 'customer' : 'assistant') as FeatureMessageRole,
    }));
  const mobileVisibleMessages = visibleMessages.slice(-2);
  const desktopVisibleMessages = visibleMessages.slice(-3);

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
      logo: '/whatsapp.svg',
      chip: 'border-[#25D366]/40 bg-[#25D366]/10 text-[#1e8f47]',
    },
    instagram: {
      label: 'Instagram',
      logo: '/instagram.svg',
      chip: 'border-[#E1306C]/40 bg-[#E1306C]/10 text-[#b61f55]',
    },
    telegram: {
      label: 'Telegram',
      logo: '/Telegram.svg',
      chip: 'border-[#229ED9]/40 bg-[#229ED9]/10 text-[#1d7eac]',
    },
  } as const;

  const activeScenarioPlatform = platformMetaMap[activeScenario?.platform ?? 'whatsapp'];
  const activeScenarioPlatformLogo = activeScenarioPlatform.logo;
  const handoverOwner = handoverStep === 1 ? (language === 'tr' ? 'İnsan' : 'Human') : 'AI';
  const handoverOwnerLabel = language === 'tr' ? 'Sahip' : 'Owner';
  const handoverHistoryNote = t.features.feat4_badges[3] ?? (language === 'tr' ? 'Konuşma geçmişi korunur' : 'Conversation history stays intact');
  const omnichannelChannels = [
    { name: 'WhatsApp', status: true, logo: '/whatsapp.svg' },
    { name: 'Instagram', status: false, logo: '/instagram.svg' },
    { name: 'Telegram', status: true, logo: '/Telegram.svg' },
    { name: 'Messenger', status: false, logo: '/messenger.svg' },
  ] as const;

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
                titleHighlight={t.features.feat2_title_highlight}
                titleHighlightClassName="bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-500"
                html
              />

              <div
                className="mt-auto relative h-[380px] md:h-[350px] w-full bg-white border border-slate-200 rounded-[24px] overflow-hidden flex shadow-sm group-hover:shadow-md transition-all"
                style={{ overflowAnchor: 'none' }}
              >
                <div className="md:hidden h-full w-full bg-white p-2 flex min-h-0 flex-col">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-2">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-900 truncate">{activeScenario?.name}</p>
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[10px] font-semibold ${activeScenarioPlatform.chip}`}>
                        <img src={activeScenarioPlatformLogo} alt="" aria-hidden className="h-3.5 w-3.5 rounded-sm object-cover" loading="lazy" />
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

                  <div className="mt-2 min-h-0 flex-1 rounded-2xl border border-slate-200 bg-slate-50/60 p-2 overflow-hidden">
                    <div className="flex h-full min-h-0 flex-col justify-end gap-2 overflow-hidden">
                      <AnimatePresence initial={false}>
                        {mobileVisibleMessages.map((message) => (
                          <motion.div
                            key={`mobile-${message.id}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                            className={`flex ${message.role === 'assistant' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-h-[54px] overflow-hidden max-w-[90%] rounded-2xl px-3 py-2 text-[11px] leading-relaxed shadow-sm ${
                                message.role === 'assistant'
                                  ? 'rounded-br-none bg-blue-600 text-white'
                                  : 'rounded-bl-none border border-slate-300 bg-slate-100 text-slate-700'
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
                      <span className="max-w-[44%] truncate font-semibold uppercase tracking-[0.12em]">{leftStatusLabel}</span>
                      <span className="max-w-[52%] truncate text-right font-medium">{extractionPhaseLabel}</span>
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

                <div className="hidden md:flex h-full w-full min-h-0">
                  <div className="w-1/2 border-r border-slate-100 bg-white p-3 md:p-4 flex flex-col min-h-0 overflow-hidden">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.14em] text-slate-500 font-semibold">
                          {t.hero.mockup.newLead}
                        </p>
                        <p className="text-xs font-semibold text-slate-900 mt-0.5">{activeScenario?.name}</p>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[10px] font-semibold ${activeScenarioPlatform.chip}`}>
                        <img src={activeScenarioPlatformLogo} alt="" aria-hidden className="h-3.5 w-3.5 rounded-sm object-cover" loading="lazy" />
                        {activeScenarioPlatform.label}
                      </span>
                    </div>

                    <div className="mt-3 min-h-0 flex-1 rounded-2xl border border-slate-200 bg-slate-50/60 p-2.5 md:p-3 overflow-hidden">
                      <div className="flex h-full min-h-0 flex-col justify-end gap-2 overflow-hidden">
                        <AnimatePresence initial={false}>
                          {desktopVisibleMessages.map((message) => (
                            <motion.div
                              key={message.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -6 }}
                              transition={{ duration: 0.2, ease: 'easeOut' }}
                              className={`flex ${message.role === 'assistant' ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-h-[56px] overflow-hidden max-w-[88%] rounded-2xl px-3 py-2 text-[11px] leading-relaxed shadow-sm ${
                                  message.role === 'assistant'
                                    ? 'rounded-br-none bg-blue-600 text-white'
                                    : 'rounded-bl-none border border-slate-300 bg-slate-100 text-slate-700'
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

                            return (
                              <div
                                key={`${scenario.name}-${index}`}
                                className={`rounded-lg border px-2 py-1.5 transition-colors ${isActive ? 'border-blue-200 bg-blue-50/70' : 'border-slate-200 bg-white'}`}
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <span className="min-w-0 inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-700">
                                    <img src={scenarioPlatform.logo} alt="" aria-hidden className="h-3.5 w-3.5 shrink-0 rounded-sm object-cover" loading="lazy" />
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
                 titleHighlight={t.features.feat1_title_highlight}
               />
               
               {/* Visual: No-code setup flow */}
               <div className="mt-auto relative h-[320px] md:h-[350px] w-full bg-white rounded-[24px] border border-slate-200 shadow-sm overflow-hidden p-1.5 md:p-2 group-hover:shadow-md transition-all">
                  <div className="w-full h-full bg-slate-50 rounded-[20px] p-2 md:p-4 flex flex-col gap-2 md:gap-2.5 overflow-hidden">
                     <div className="rounded-xl border border-slate-200 bg-white p-2 md:p-2.5 shadow-sm">
                        <div className="flex items-center justify-between gap-2">
                           <p className="text-[11px] md:text-[10px] font-semibold uppercase tracking-[0.11em] text-slate-500">{t.features.feat1_mockup_source}</p>
                        </div>
                        <p className="mt-1.5 text-[12px] md:text-[10px] leading-relaxed text-slate-600">{t.features.feat1_mockup_kb_detail}</p>
                     </div>

                     <div className="rounded-xl border border-slate-200 bg-white p-2 md:p-2.5 shadow-sm">
                        <p className="text-[11px] md:text-[10px] font-semibold uppercase tracking-[0.11em] text-slate-500">{t.features.feat1_mockup_kb_title}</p>
                        <div className="mt-2 space-y-1 md:space-y-1.5">
                           {t.features.feat1_mockup_kb_items.map((item) => (
                              <div key={item} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5">
                                 <FileText className="h-4 w-4 md:h-3.5 md:w-3.5 shrink-0 text-rose-500" />
                                 <span className="text-[12px] md:text-[11px] text-slate-700">{item}</span>
                              </div>
                           ))}
                        </div>
                     </div>

                     <div className="rounded-xl border border-slate-200 bg-white p-2 md:p-2.5 shadow-sm">
                        <div className="flex items-center justify-between gap-2">
                           <p className="text-[11px] md:text-[10px] font-semibold uppercase tracking-[0.11em] text-slate-500">{t.features.feat1_mockup_skill_title}</p>
                           <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] md:text-[10px] font-semibold text-emerald-700">
                              {t.features.feat1_mockup_processed}
                           </span>
                        </div>
                        <div className="mt-2 space-y-1 md:space-y-1.5">
                           {t.features.feat1_mockup_skill_items.map((item) => (
                              <div key={item} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5">
                                 <CheckCircle2 className="h-4 w-4 md:h-3.5 md:w-3.5 shrink-0 text-blue-600" />
                                 <span className="text-[12px] md:text-[11px] text-slate-700">{item}</span>
                              </div>
                           ))}
                        </div>
                     </div>

                     <p className="mt-auto px-0.5 text-[11px] md:text-[10px] leading-relaxed text-slate-500">{t.features.feat1_mockup_quote}</p>
                  </div>
               </div>
            </motion.div>

            {/* Feature 3: Integrations (3 cols) */}
            <motion.div variants={item} className="col-span-1 lg:col-span-3 p-8 border-b border-r border-slate-200 border-dashed bg-white relative group transition-colors hover:bg-slate-50/50">
               <FeatureBlockHeader
                  title={t.features.feat3_title}
                  description={t.features.feat3_desc1}
                  titleHighlight={t.features.feat3_title_highlight}
                  titleHighlightClassName="bg-gradient-to-r from-emerald-500 via-green-500 to-lime-500"
               />

               {/* Visual: Channel list + connection statuses */}
               <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {omnichannelChannels.map((channel) => (
                     <div key={channel.name} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                        <div className="flex items-center gap-2">
                           <img
                             src={channel.logo}
                             alt={`${channel.name} logo`}
                             className="h-6 w-6 rounded-md object-cover"
                             loading="lazy"
                           />
                           <span className="text-xs font-semibold text-slate-900">{channel.name}</span>
                        </div>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${channel.status ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                           {channel.status ? t.features.feat3_mockup_connected : t.features.feat3_mockup_connect}
                        </span>
                     </div>
                  ))}
               </div>
            </motion.div>

            {/* Feature 4: Focus / Security (3 cols) */}
            <motion.div variants={item} className="col-span-1 lg:col-span-3 p-8 border-b border-r border-slate-200 border-dashed bg-white relative overflow-hidden flex flex-col group transition-colors hover:bg-slate-50/50">
               <FeatureBlockHeader
                  title={t.features.feat4_title}
                  description={t.features.feat4_desc}
                  titleHighlight={t.features.feat4_title_highlight}
                  titleHighlightClassName="bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500"
               />

               {/* Visual: Human handover flow loop */}
               <div className="mt-auto">
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                     {handoverStages.map((stage, index) => {
                       const isActive = handoverStep === index;
                       const StageIcon = stage.icon;
                       return (
                         <motion.div
                           key={stage.label}
                           initial={false}
                           animate={{
                             borderColor: isActive ? '#86efac' : '#e2e8f0',
                             backgroundColor: isActive ? '#f0fdf4' : '#f8fafc',
                           }}
                           transition={{ duration: 0.22 }}
                           className="flex items-center gap-2 rounded-xl border px-3 py-2"
                         >
                           <StageIcon className={`h-4 w-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                           <span className={`text-xs font-semibold ${isActive ? 'text-emerald-800' : 'text-slate-600'}`}>{stage.label}</span>
                         </motion.div>
                       );
                     })}
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-3">
                     <p className="text-xs italic text-slate-500">{handoverHistoryNote}</p>
                     <motion.span
                       key={`owner-${handoverStep}`}
                       initial={{ opacity: 0.45, y: -3 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ duration: 0.2 }}
                       className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700"
                     >
                       {handoverOwnerLabel}: {handoverOwner}
                     </motion.span>
                  </div>
               </div>
            </motion.div>

            {/* Feature 5: Service Profile + Key Info (Full width) */}
            <motion.div variants={item} className="col-span-1 lg:col-span-6 p-8 border-b border-r border-slate-200 border-dashed bg-white relative group transition-colors hover:bg-slate-50/50">
               <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                  <FeatureBlockHeader
                    title={t.features.feat5_title}
                    description={t.features.feat5_desc}
                    titleHighlight={t.features.feat5_title_highlight}
                    titleHighlightClassName="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"
                  />

                  <div className="relative w-full rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition-all group-hover:shadow-md">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between md:gap-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm md:text-xs font-bold normal-case md:uppercase tracking-[0.03em] md:tracking-[0.14em] text-slate-500 leading-tight">
                          {t.features.feat5_mockup_title}
                        </p>
                        <span className="normal-case tracking-normal rounded-full border border-cyan-200 bg-cyan-50 px-2 py-0.5 text-[10px] font-semibold text-cyan-700">
                          {t.features.feat5_mockup_title_tag}
                        </span>
                      </div>
                      <span className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-2.5 md:px-3 py-1 text-[10px] md:text-[11px] font-semibold text-emerald-700">
                        <motion.span
                          aria-hidden
                          className="h-2 w-2 rounded-full bg-emerald-500"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1.4, ease: 'linear', repeat: Infinity }}
                        />
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
