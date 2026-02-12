import React from 'react';
import { animate, motion, useInView, useReducedMotion } from 'framer-motion';
import { FaCalendarCheck, FaMessage, FaRankingStar, FaStopwatch } from 'react-icons/fa6';
import { X } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { AUTH_URLS } from '../lib/auth-links';
import { formatMetricValue, getMetricSuffix, getMetricTargetValue } from '../lib/impact-metrics';
import Section from './Section';

interface MetricValueProps {
  value: string;
  prefersReducedMotion: boolean;
}

type DemoFormData = {
  fullName: string;
  email: string;
  phone: string;
  note: string;
};

const initialDemoFormData: DemoFormData = {
  fullName: '',
  email: '',
  phone: '',
  note: '',
};

const MetricValue: React.FC<MetricValueProps> = ({ value, prefersReducedMotion }) => {
  const valueRef = React.useRef<HTMLParagraphElement | null>(null);
  const isInView = useInView(valueRef, { once: true, margin: '-20%' });
  const numericTarget = React.useMemo(() => getMetricTargetValue(value), [value]);
  const suffix = React.useMemo(() => getMetricSuffix(value), [value]);
  const [displayValue, setDisplayValue] = React.useState(prefersReducedMotion ? numericTarget : 0);

  React.useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayValue(numericTarget);
      return;
    }

    if (!isInView) {
      return;
    }

    const controls = animate(0, numericTarget, {
      duration: 1.15,
      ease: [0.2, 0.95, 0.25, 1],
      onUpdate: (latest) => {
        setDisplayValue(Math.round(latest));
      },
    });

    return () => {
      controls.stop();
    };
  }, [isInView, numericTarget, prefersReducedMotion]);

  return (
    <motion.p
      ref={valueRef}
      initial={prefersReducedMotion ? false : { opacity: 0, rotateX: 72, y: 8 }}
      animate={prefersReducedMotion ? { opacity: 1 } : isInView ? { opacity: 1, rotateX: 0, y: 0 } : {}}
      transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="text-4xl font-semibold tracking-tight text-slate-900 tabular-nums md:text-5xl"
    >
      {`${displayValue}${suffix}`}
    </motion.p>
  );
};

const ImpactMetrics: React.FC = () => {
  const { t } = useLanguage();
  const prefersReducedMotion = useReducedMotion();
  const metricIcons = [FaStopwatch, FaRankingStar, FaMessage, FaCalendarCheck] as const;
  const [isDemoModalOpen, setIsDemoModalOpen] = React.useState(false);
  const [demoFormData, setDemoFormData] = React.useState<DemoFormData>(initialDemoFormData);
  const [demoFormError, setDemoFormError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!isDemoModalOpen || typeof window === 'undefined') return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDemoModalOpen(false);
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isDemoModalOpen]);

  const openDemoModal = () => {
    setDemoFormData(initialDemoFormData);
    setDemoFormError(null);
    setIsDemoModalOpen(true);
  };

  const closeDemoModal = () => {
    setDemoFormError(null);
    setIsDemoModalOpen(false);
  };

  const updateDemoField = (field: keyof DemoFormData) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (demoFormError) {
      setDemoFormError(null);
    }
    setDemoFormData((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleDemoFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedFullName = demoFormData.fullName.trim();
    const trimmedEmail = demoFormData.email.trim();
    const trimmedPhone = demoFormData.phone.trim();
    const trimmedNote = demoFormData.note.trim();

    if (!trimmedFullName) {
      setDemoFormError(t.hero.demoModal.errors.fullNameRequired);
      return;
    }

    if (!trimmedEmail && !trimmedPhone) {
      setDemoFormError(t.hero.demoModal.errors.contactRequired);
      return;
    }

    const subject = `${t.hero.demoModal.mailSubject} - ${trimmedFullName}`;
    const body = [
      `${t.hero.demoModal.mailLabelName}: ${trimmedFullName}`,
      `${t.hero.demoModal.mailLabelEmail}: ${trimmedEmail || '-'}`,
      `${t.hero.demoModal.mailLabelPhone}: ${trimmedPhone || '-'}`,
      `${t.hero.demoModal.mailLabelNote}: ${trimmedNote || '-'}`,
    ].join('\n');
    const mailtoHref = `mailto:askqualy@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    if (typeof window !== 'undefined') {
      window.location.href = mailtoHref;
    }

    setIsDemoModalOpen(false);
  };

  return (
    <>
      <Section
        id="impact-metrics"
        className="border-b border-slate-100 bg-white py-20 md:py-24"
        containerClassName="relative"
      >
        <div className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-white">
        <div className="absolute inset-0 hidden grid-cols-12 lg:grid">
          {Array.from({ length: 12 }).map((_, index) => (
            <div
              key={`desktop-line-${index}`}
              className={index === 0 ? '' : 'border-l border-dashed border-slate-200'}
            />
          ))}
        </div>

        <div className="absolute inset-0 grid grid-cols-6 lg:hidden">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={`mobile-line-${index}`}
              className={index === 0 ? '' : 'border-l border-dashed border-slate-200/80'}
            />
          ))}
        </div>

        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 1400 600"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="impactMetricsGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="rgba(248,250,252,1)" />
              <stop offset="55%" stopColor="rgba(248,250,252,1)" />
              <stop offset="100%" stopColor="rgba(248,250,252,0)" />
            </linearGradient>
          </defs>
          <path
            d="M0 509C547 495 1041 303 1400 0V600H0V509Z"
            fill="url(#impactMetricsGradient)"
          />
          <path
            d="M1400 1C1041 303 548 495 1 509"
            fill="none"
            stroke="#2563eb"
            strokeWidth="1.25"
            strokeLinecap="round"
          />
        </svg>

        <div className="relative px-6 pb-10 pt-12 md:px-10 md:pb-12 md:pt-14 lg:px-14 lg:pb-14 lg:pt-20">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.45 }}
            className="max-w-3xl"
          >
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-5xl">
              {t.impactMetrics.title}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-slate-600 md:text-lg">
              {t.impactMetrics.subtitle}
            </p>
          </motion.div>

          <div className="relative mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-14 lg:gap-6">
            {t.impactMetrics.items.map((metric, index) => {
              const MetricIcon = metricIcons[index] ?? FaRankingStar;

              return (
                <motion.article
                  key={metric.label}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 16, rotate: -1.2 }}
                  whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{
                    duration: prefersReducedMotion ? 0 : 0.45,
                    delay: prefersReducedMotion ? 0 : index * 0.1,
                  }}
                  className="relative rounded-2xl border border-slate-200/80 bg-white/90 p-5 backdrop-blur-sm md:p-6"
                >
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute right-5 top-5 text-black"
                  >
                    <MetricIcon className="h-5 w-5 md:h-6 md:w-6" />
                  </div>

                  <div className="border-l border-slate-900 pl-4">
                    <MetricValue
                      value={formatMetricValue(metric.value)}
                      prefersReducedMotion={prefersReducedMotion}
                    />
                    <p className="mt-2 text-sm font-semibold text-slate-900 md:text-base">
                      {metric.label}
                    </p>
                    <p className="mt-2 max-w-[38ch] text-sm leading-relaxed text-slate-600">
                      {metric.detail}
                    </p>
                  </div>
                </motion.article>
              );
            })}
          </div>

            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.4, delay: prefersReducedMotion ? 0 : 0.12 }}
              className="mt-10 flex flex-col items-center text-center lg:mt-14"
            >
              <p className="max-w-2xl text-2xl font-semibold tracking-tight text-slate-900 md:text-4xl">
                {t.impactMetrics.ctaText}
              </p>
              <div className="mt-6 flex w-full max-w-xl flex-col items-center justify-center gap-3 sm:flex-row">
                <a
                  href={AUTH_URLS.register}
                  className="inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-8 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(15,23,42,0.18)] transition-colors hover:bg-slate-800 sm:w-auto"
                >
                  {t.impactMetrics.ctaPrimary}
                </a>
                <button
                  type="button"
                  onClick={openDemoModal}
                  className="inline-flex w-full items-center justify-center rounded-full border border-slate-300 bg-white px-8 py-3 text-sm font-semibold text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.08)] transition-colors hover:bg-slate-50 sm:w-auto"
                >
                  {t.hero.ctaSecondary}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </Section>

      {isDemoModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/55 px-4 py-6" onClick={closeDemoModal}>
          <div
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="impact-demo-modal-title"
            className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_24px_64px_rgba(15,23,42,0.35)] sm:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="impact-demo-modal-title" className="text-2xl font-semibold text-slate-900">
                  {t.hero.demoModal.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{t.hero.demoModal.subtitle}</p>
              </div>
              <button
                type="button"
                aria-label={t.hero.demoModal.closeLabel}
                onClick={closeDemoModal}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:border-slate-300 hover:text-slate-900"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form className="mt-6 space-y-4" onSubmit={handleDemoFormSubmit}>
              <div className="space-y-1.5">
                <label htmlFor="impact-demo-full-name" className="text-sm font-medium text-slate-800">
                  {t.hero.demoModal.fullNameLabel}
                </label>
                <input
                  id="impact-demo-full-name"
                  type="text"
                  value={demoFormData.fullName}
                  onChange={updateDemoField('fullName')}
                  placeholder={t.hero.demoModal.fullNamePlaceholder}
                  className="h-11 w-full rounded-xl border border-slate-300 px-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label htmlFor="impact-demo-email" className="text-sm font-medium text-slate-800">
                    {t.hero.demoModal.emailLabel}
                  </label>
                  <input
                    id="impact-demo-email"
                    type="email"
                    value={demoFormData.email}
                    onChange={updateDemoField('email')}
                    placeholder={t.hero.demoModal.emailPlaceholder}
                    className="h-11 w-full rounded-xl border border-slate-300 px-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="impact-demo-phone" className="text-sm font-medium text-slate-800">
                    {t.hero.demoModal.phoneLabel}
                  </label>
                  <input
                    id="impact-demo-phone"
                    type="tel"
                    value={demoFormData.phone}
                    onChange={updateDemoField('phone')}
                    placeholder={t.hero.demoModal.phonePlaceholder}
                    className="h-11 w-full rounded-xl border border-slate-300 px-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  />
                </div>
              </div>

              <p className="text-xs text-slate-500">{t.hero.demoModal.contactHint}</p>

              <div className="space-y-1.5">
                <label htmlFor="impact-demo-note" className="text-sm font-medium text-slate-800">
                  {t.hero.demoModal.noteLabel}
                </label>
                <textarea
                  id="impact-demo-note"
                  value={demoFormData.note}
                  onChange={updateDemoField('note')}
                  placeholder={t.hero.demoModal.notePlaceholder}
                  rows={4}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                />
              </div>

              {demoFormError && (
                <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{demoFormError}</p>
              )}

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeDemoModal}
                  className="inline-flex h-11 items-center justify-center rounded-full border border-slate-300 px-6 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
                >
                  {t.hero.demoModal.cancel}
                </button>
                <button
                  type="submit"
                  className="inline-flex h-11 items-center justify-center rounded-full bg-slate-900 px-6 text-sm font-medium text-white transition-colors hover:bg-slate-800"
                >
                  {t.hero.demoModal.submit}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ImpactMetrics;
