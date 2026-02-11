import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, ChevronDown, Zap } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiMiniSparkles } from 'react-icons/hi2';
import { AUTH_URLS } from '../lib/auth-links';

type Platform = 'whatsapp' | 'instagram' | 'telegram';
type MessageRole = 'customer' | 'bot';

const Hero: React.FC = () => {
  const { t } = useLanguage();
  const prefersReducedMotion = useReducedMotion();
  const scenarios = useMemo(() => t.hero.mockup.animatedScenarios, [t]);
  const [activeScenarioIndex, setActiveScenarioIndex] = useState(0);
  const [visibleStep, setVisibleStep] = useState(0);
  const [simulationPhase, setSimulationPhase] = useState<'idle' | 'typing'>('idle');
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const chatViewportRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scenarios.length === 0) return;
    if (activeScenarioIndex >= scenarios.length) {
      setActiveScenarioIndex(0);
      setVisibleStep(0);
      setSimulationPhase('idle');
      return;
    }

    const maxStep = Math.max(0, (scenarios[activeScenarioIndex]?.messages.length ?? 1) - 1);
    if (visibleStep > maxStep) {
      setVisibleStep(0);
    }
  }, [activeScenarioIndex, scenarios, visibleStep]);

  useEffect(() => {
    if (!prefersReducedMotion || scenarios.length === 0) return;

    const fullStep = Math.max(0, scenarios[0].messages.length - 1);
    if (activeScenarioIndex !== 0) setActiveScenarioIndex(0);
    if (visibleStep !== fullStep) setVisibleStep(fullStep);
    if (simulationPhase !== 'idle') setSimulationPhase('idle');
  }, [activeScenarioIndex, prefersReducedMotion, scenarios, simulationPhase, visibleStep]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(max-width: 767px)');
    const handleChange = () => setIsMobileViewport(mediaQuery.matches);
    handleChange();

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  useEffect(() => {
    const viewport = chatViewportRef.current;
    if (!viewport) return;

    const frame = window.requestAnimationFrame(() => {
      viewport.scrollTo({
        top: viewport.scrollHeight,
        behavior: prefersReducedMotion ? 'auto' : isMobileViewport ? 'smooth' : 'auto',
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [activeScenarioIndex, isMobileViewport, prefersReducedMotion, simulationPhase, visibleStep]);

  useEffect(() => {
    if (prefersReducedMotion || scenarios.length === 0) return;

    const activeScenario = scenarios[activeScenarioIndex] ?? scenarios[0];
    const hasNextStep = visibleStep < activeScenario.messages.length - 1;
    const nextRole: MessageRole = (visibleStep + 1) % 2 === 0 ? 'customer' : 'bot';

    const timer = window.setTimeout(() => {
      if (!hasNextStep) {
        setSimulationPhase('idle');
        setVisibleStep(0);
        setActiveScenarioIndex((current) => (current + 1) % scenarios.length);
        return;
      }
      if (simulationPhase === 'idle') {
        setSimulationPhase('typing');
        return;
      }
      setSimulationPhase('idle');
      setVisibleStep((current) => current + 1);
    }, hasNextStep ? (simulationPhase === 'idle' ? 1900 : nextRole === 'customer' ? 1600 : 1450) : 4300);

    return () => window.clearTimeout(timer);
  }, [activeScenarioIndex, prefersReducedMotion, scenarios, simulationPhase, visibleStep]);

  const activeScenario = scenarios[activeScenarioIndex] ?? scenarios[0];
  const visibleMessages = activeScenario
    ? activeScenario.messages.slice(0, visibleStep + 1).map((text, index) => ({
        id: `${activeScenarioIndex}-${index}`,
        role: (index % 2 === 0 ? 'customer' : 'bot') as MessageRole,
        text,
      }))
    : [];

  const lastVisibleMessage = visibleMessages[visibleMessages.length - 1];
  const visibleCustomerMessages = visibleMessages.filter((message) => message.role === 'customer');
  const visibleCustomerStep = Math.max(0, visibleCustomerMessages.length - 1);
  const selectedLeadScore = activeScenario
    ? activeScenario.scores[Math.min(visibleCustomerStep, activeScenario.scores.length - 1)] ?? 0
    : 0;
  const scoreProgressPercent = Math.max(8, Math.min(100, selectedLeadScore * 10));
  const hasNextMessage = Boolean(activeScenario) && visibleStep < (activeScenario?.messages.length ?? 1) - 1;
  const nextMessageRole: MessageRole = (visibleStep + 1) % 2 === 0 ? 'customer' : 'bot';

  const getLeadTone = (score: number): 'hot' | 'warm' | 'cold' => {
    if (score >= 8) return 'hot';
    if (score >= 4.5) return 'warm';
    return 'cold';
  };

  const getLeadToneLabel = (score: number) => {
    const tone = getLeadTone(score);
    if (tone === 'hot') return t.hero.mockup.toneHot;
    if (tone === 'warm') return t.hero.mockup.toneWarm;
    return t.hero.mockup.toneCold;
  };

  const getScoreBadgeClasses = (score: number) => {
    if (score >= 8) return 'border-red-100 bg-red-50 text-red-700';
    if (score >= 4.5) return 'border-amber-100 bg-amber-50 text-amber-700';
    return 'border-slate-200 bg-slate-100 text-slate-600';
  };

  const getHeaderScoreTone = (score: number) => {
    if (score >= 8) {
      return {
        badge: 'border-red-200 bg-red-50 text-red-800',
        track: 'bg-red-100',
        fill: 'bg-red-500',
      };
    }
    if (score >= 4.5) {
      return {
        badge: 'border-amber-200 bg-amber-50 text-amber-800',
        track: 'bg-amber-100',
        fill: 'bg-amber-500',
      };
    }
    return {
      badge: 'border-slate-200 bg-slate-100 text-slate-700',
      track: 'bg-slate-200',
      fill: 'bg-slate-500',
    };
  };

  const getIntentLabel = (score: number) => {
    if (score >= 8) return t.hero.mockup.intentHot;
    if (score >= 4.5) return t.hero.mockup.intentWarm;
    return t.hero.mockup.intentCold;
  };

  const getIntentChipClasses = (score: number) => {
    if (score >= 8) return 'border-red-100 bg-red-50 text-red-700';
    if (score >= 4.5) return 'border-amber-100 bg-amber-50 text-amber-700';
    return 'border-slate-200 bg-slate-100 text-slate-600';
  };

  const platformLogoMap: Record<Platform, string> = {
    whatsapp: '/whatsapp.svg',
    instagram: '/instagram.svg',
    telegram: '/Telegram.svg',
  };

  const renderPlatformIcon = (platform: Platform, size = 20) => (
    <img
      src={platformLogoMap[platform]}
      alt={`${platform} logo`}
      loading="lazy"
      className="object-contain"
      style={{ width: size, height: size }}
    />
  );
  const scoreTone = getHeaderScoreTone(selectedLeadScore);
  const heroChannelLogos = [
    { name: 'WhatsApp', logo: '/whatsapp.svg' },
    { name: 'Instagram', logo: '/instagram.svg' },
    { name: 'Telegram', logo: '/Telegram.svg' },
    { name: 'Messenger', logo: '/messenger.svg' },
  ] as const;

  return (
    <section className="relative flex flex-col overflow-hidden bg-white pb-12 pt-24 md:min-h-screen md:pb-0 md:pt-48">
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0 }}
        animate={prefersReducedMotion ? { opacity: 0.25 } : { opacity: 0.4 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-50/50 rounded-[100%] blur-3xl -z-10 pointer-events-none"
      ></motion.div>

      <motion.h1
        initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="text-4xl md:text-6xl lg:text-8xl font-semibold max-w-6xl mx-auto text-center mt-6 relative z-10 tracking-tight text-slate-900 leading-tight md:leading-tight lg:leading-[1.1] px-5 sm:px-6 md:px-8"
        dangerouslySetInnerHTML={{ __html: t.hero.headline }}
      />

      <motion.p
        initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="text-center mt-8 text-base md:text-xl text-slate-500 max-w-3xl mx-auto relative z-10 leading-relaxed px-6"
        dangerouslySetInnerHTML={{ __html: t.hero.subheadline }}
      />

      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.25 }}
        className="flex items-center justify-center mt-10 relative z-10 px-6"
      >
        <a
          href={AUTH_URLS.register}
          className="w-full sm:w-auto bg-slate-900 relative z-10 hover:bg-slate-800 border border-transparent text-white text-sm md:text-base transition font-medium duration-200 rounded-full px-8 py-3 flex items-center justify-center shadow-[0px_-1px_0px_0px_#FFFFFF40_inset,_0px_1px_0px_0px_#FFFFFF40_inset]"
        >
          {t.hero.ctaPrimary}
        </a>
      </motion.div>

      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.25, delay: prefersReducedMotion ? 0 : 0.04 }}
        className="relative z-10 mt-4 flex flex-col items-center gap-3 px-6"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-[11px] font-medium text-slate-600">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span>{t.hero.connects}</span>
          <span className="text-slate-300">•</span>
          <span>{t.hero.noCard}</span>
        </div>

        <div className="flex items-center justify-center gap-2.5">
          {heroChannelLogos.map((channel) => (
            <div
              key={channel.name}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-[0_6px_16px_rgba(15,23,42,0.06)] transition-transform duration-200 hover:-translate-y-0.5"
            >
              <img src={channel.logo} alt={channel.name} className="h-7 w-7 object-contain" loading="lazy" />
            </div>
          ))}
        </div>
      </motion.div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-8">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-12 rounded-[30px] border border-slate-200 bg-[#ECEFF3] p-3 sm:p-4 md:mt-20"
        >
          <div className="relative z-10 overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
            <div className="relative flex h-[650px] flex-col overflow-hidden rounded-[22px] bg-white sm:h-[700px] md:h-auto md:aspect-[16/9]">
              <div className="flex h-14 items-center justify-between border-b border-gray-200 bg-gray-50/30 px-4 sm:px-6">
                <div className="flex items-center gap-4">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                    <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                    <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                  </div>
                  <div className="mx-1 hidden h-6 w-px bg-slate-200 sm:block"></div>
                  <div className="hidden text-sm font-semibold text-slate-700 sm:block">{t.hero.mockup.dashboard}</div>
                </div>
                <div className="text-sm font-semibold text-slate-700 sm:hidden">{t.hero.mockup.dashboard}</div>
                <div className="hidden items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 sm:flex">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide">{t.hero.mockup.online}</div>
                </div>
              </div>

              <div className="flex min-h-0 flex-1 overflow-hidden">
                <div className="hidden md:flex w-72 lg:w-80 border-r border-gray-200 flex-col bg-gray-50/30">
                  <div className="flex h-14 items-center justify-between border-b border-gray-200 px-4">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.hero.mockup.priorityInbox}</div>
                    <div className="h-6 min-w-6 px-1.5 rounded-md bg-slate-200 text-slate-600 text-[10px] font-bold flex items-center justify-center">
                      {scenarios.length}
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    {scenarios.map((scenario, index) => {
                      const isActive = index === activeScenarioIndex;
                      const previewText = isActive ? (lastVisibleMessage?.text ?? scenario.preview) : scenario.preview;
                      const previewRole: MessageRole = isActive ? (lastVisibleMessage?.role ?? 'customer') : 'customer';
                      const score = isActive
                        ? selectedLeadScore
                        : scenario.scores[scenario.scores.length - 1] ?? scenario.scores[0] ?? 0;

                      return (
                        <div
                          key={`${scenario.name}-${index}`}
                          className={`relative cursor-pointer border-b border-gray-100 bg-white px-4 py-4 transition-colors ${
                            isActive ? 'bg-blue-50/30' : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="relative shrink-0">
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${
                                  isActive ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-600'
                                }`}
                              >
                                {scenario.initials}
                              </div>
                              <div className="absolute -bottom-4 left-1/2 z-10 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full border-[0.15px] border-white/20 bg-white/95 shadow-sm">
                                {renderPlatformIcon(scenario.platform)}
                              </div>
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <span className="truncate text-sm font-semibold text-slate-800">{scenario.name}</span>
                                <span
                                  className={`shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${getScoreBadgeClasses(
                                    score
                                  )}`}
                                >
                                  {getLeadToneLabel(score)}
                                </span>
                              </div>
                              <p className="mt-1 flex items-center gap-1 truncate text-sm text-slate-500 leading-relaxed">
                                {previewRole === 'customer' ? (
                                  <ArrowDownRight className="h-3 w-3 shrink-0 text-slate-400" />
                                ) : (
                                  <ArrowUpRight className="h-3 w-3 shrink-0 text-slate-400" />
                                )}
                                <span className="truncate">{previewText}</span>
                              </p>
                              <div className="mt-0.5 flex items-center justify-between">
                                <span className="text-xs text-slate-400">{scenario.lastMessageAt}</span>
                                {isActive && <span className="h-2 w-2 rounded-full bg-blue-500" />}
                              </div>
                            </div>
                          </div>
                          {isActive && <div className="absolute bottom-0 left-0 top-0 w-0.5 bg-blue-500"></div>}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex min-h-0 flex-1 flex-col bg-white">
                  <div className="flex min-h-14 items-center justify-between border-b border-gray-200 bg-white px-3 py-2 sm:h-14 sm:px-4 sm:py-0 md:px-6">
                    <div className="flex flex-col items-start gap-1">
                      <div className="flex items-center gap-3">
                        <span className="sm:hidden leading-none">{activeScenario ? renderPlatformIcon(activeScenario.platform, 16) : null}</span>
                        <div className="hidden h-2 w-2 rounded-full bg-emerald-500 sm:block"></div>
                        <h3 className="font-bold text-slate-900 text-sm">{activeScenario?.name}</h3>
                      </div>
                      <div className="sm:hidden flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-0.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                        <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide">{t.hero.mockup.onlineShort}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.div
                        key={`${activeScenarioIndex}-${visibleCustomerStep}-intent`}
                        initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: prefersReducedMotion ? 0 : 0.24 }}
                        className={`hidden lg:flex items-center rounded-full border px-3 py-1 text-[11px] font-medium ${getIntentChipClasses(
                          selectedLeadScore
                        )}`}
                      >
                        {t.hero.mockup.aiDetected} <span className="ml-1 font-semibold">{getIntentLabel(selectedLeadScore)}</span>
                      </motion.div>
                      <motion.div
                        key={`${activeScenarioIndex}-${visibleCustomerStep}-${selectedLeadScore}`}
                        initial={prefersReducedMotion ? false : { scale: 0.92, opacity: 0.6 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: prefersReducedMotion ? 0 : 0.24 }}
                        className={`min-w-[112px] rounded-lg border px-2.5 py-1.5 text-xs font-semibold sm:min-w-[132px] sm:px-3 ${scoreTone.badge}`}
                      >
                        <div className="flex items-center gap-1.5">
                          <Zap className="h-3 w-3" />
                          <span className="sm:hidden">{t.hero.mockup.leadScoreShort}:</span>
                          <span className="hidden sm:inline">{t.hero.mockup.leadScore}:</span> {selectedLeadScore.toFixed(1)}
                        </div>
                        <div className={`mt-1 h-1.5 w-full overflow-hidden rounded-full ${scoreTone.track}`}>
                          <motion.div
                            key={`${activeScenarioIndex}-${visibleCustomerStep}-score-progress`}
                            initial={prefersReducedMotion ? false : { width: 0 }}
                            animate={{ width: `${scoreProgressPercent}%` }}
                            transition={{ duration: prefersReducedMotion ? 0 : 0.32 }}
                            className={`h-full rounded-full ${scoreTone.fill}`}
                          />
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  <div className="flex min-h-0 flex-1 flex-col bg-gray-50/30">
                    <div ref={chatViewportRef} className="mobile-scrollbar-hide flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5 md:p-8">
                      <div className="flex min-h-full flex-col justify-end gap-5">
                        <div className="flex justify-center">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200">
                            {t.hero.mockup.today}
                          </span>
                        </div>

                        <AnimatePresence initial={false}>
                          {visibleMessages.map((message) =>
                            message.role === 'customer' ? (
                              <motion.div
                                key={message.id}
                                layout={isMobileViewport && !prefersReducedMotion}
                                initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: prefersReducedMotion ? 0 : 0.22 }}
                                className="flex items-end gap-3"
                              >
                                <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                                  {activeScenario?.initials}
                                </div>
                                <div className="max-w-[84%] md:max-w-[76%] rounded-2xl rounded-bl-none border border-gray-200 bg-gray-100 px-4 py-3 text-sm leading-relaxed text-gray-900">
                                  {message.text}
                                </div>
                              </motion.div>
                            ) : (
                              <motion.div
                                key={message.id}
                                layout={isMobileViewport && !prefersReducedMotion}
                                initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: prefersReducedMotion ? 0 : 0.22 }}
                                className="flex items-end justify-end gap-3"
                              >
                                <div className="max-w-[80%] md:max-w-[68%] rounded-2xl rounded-br-none bg-purple-700 px-4 py-3 text-sm leading-relaxed text-white shadow-sm">
                                  {message.text}
                                </div>
                                <div className="h-8 w-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-semibold">
                                  AI
                                </div>
                              </motion.div>
                            )
                          )}
                        </AnimatePresence>

                        {hasNextMessage && simulationPhase === 'typing' && (
                          nextMessageRole === 'customer' ? (
                            <motion.div
                              layout={isMobileViewport && !prefersReducedMotion}
                              initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
                              className="flex items-end gap-3"
                            >
                              <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                                {activeScenario?.initials}
                              </div>
                              <div className="inline-flex items-center gap-2 rounded-2xl rounded-bl-none border border-gray-200 bg-white px-3 py-2 text-xs text-slate-500 shadow-sm">
                                <span className="flex gap-1">
                                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.2s]"></span>
                                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.1s]"></span>
                                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce"></span>
                                </span>
                                {t.hero.mockup.typing}
                              </div>
                            </motion.div>
                          ) : (
                            <motion.div
                              layout={isMobileViewport && !prefersReducedMotion}
                              initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
                              className="flex items-end justify-end gap-3"
                            >
                              <div className="inline-flex items-center gap-2 rounded-2xl rounded-br-none border border-purple-100 bg-purple-50 px-3 py-2 text-xs text-purple-700 shadow-sm">
                                <span className="flex gap-1">
                                  <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-bounce [animation-delay:-0.2s]"></span>
                                  <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-bounce [animation-delay:-0.1s]"></span>
                                  <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-bounce"></span>
                                </span>
                                {t.hero.mockup.thinking}
                              </div>
                              <div className="h-8 w-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-semibold">
                                AI
                              </div>
                            </motion.div>
                          )
                        )}
                      </div>
                    </div>

                    {!prefersReducedMotion && !hasNextMessage && (
                      <div className="flex items-center justify-center py-2.5">
                        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-200">
                          <motion.div
                            key={`scenario-switch-${activeScenarioIndex}`}
                            initial={{ width: '0%' }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 4, ease: 'linear' }}
                            className="h-full rounded-full bg-slate-500"
                          />
                        </div>
                        <span className="sr-only">Preparing next conversation</span>
                      </div>
                    )}

                    <div className="border-t border-gray-200 bg-white px-4 py-3 sm:px-5 md:px-6">
                      <motion.button
                        type="button"
                        aria-label={`${t.hero.mockup.summaryTitle} ${t.hero.mockup.summaryPlaceholder}`}
                        initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: prefersReducedMotion ? 0 : 0.24 }}
                        className="relative inline-flex w-fit items-center gap-2.5 rounded-full border border-violet-200 bg-white px-3.5 py-2 text-sm font-semibold text-violet-900 shadow-[0_8px_18px_rgba(139,92,246,0.16)]"
                      >
                        <span className="relative inline-flex h-5 w-5 items-center justify-center">
                          <span
                            aria-hidden
                            className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500 via-fuchsia-500 to-orange-400 opacity-80 blur-[3px]"
                          />
                          <span
                            aria-hidden
                            className="relative inline-flex h-[17px] w-[17px] items-center justify-center rounded-full bg-gradient-to-br from-violet-500 via-fuchsia-500 to-orange-400 shadow-[0_0_8px_rgba(168,85,247,0.6)]"
                          >
                            <HiMiniSparkles className="text-white" size={11} />
                          </span>
                        </span>
                        <span>{t.hero.mockup.summaryTitle}</span>
                        <ChevronDown className="h-4 w-4 text-violet-700/90" />
                        <span className="sr-only">{t.hero.mockup.summaryPlaceholder}</span>
                      </motion.button>
                    </div>

                    <div className="border-t border-gray-200 bg-slate-50/80 px-4 py-3 md:px-6">
                      <div className="flex items-center gap-3">
                        <input
                          type="text"
                          placeholder={t.hero.mockup.composerPlaceholder}
                          className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                        />
                        <button className="h-10 shrink-0 rounded-lg bg-gray-900 px-3.5 text-xs font-semibold text-white transition-colors hover:bg-gray-800">
                          {t.hero.mockup.takeOver}
                        </button>
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
