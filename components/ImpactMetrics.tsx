import React from 'react';
import { animate, motion, useInView, useReducedMotion } from 'framer-motion';
import { FaCalendarCheck, FaMessage, FaRankingStar, FaStopwatch } from 'react-icons/fa6';
import { useLanguage } from '../LanguageContext';
import { AUTH_URLS } from '../lib/auth-links';
import { formatMetricValue, getMetricSuffix, getMetricTargetValue } from '../lib/impact-metrics';
import Section from './Section';

interface MetricValueProps {
  value: string;
  prefersReducedMotion: boolean;
}

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

  return (
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
            <a
              href={AUTH_URLS.register}
              className="mt-6 inline-flex items-center justify-center rounded-full bg-slate-900 px-8 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(15,23,42,0.18)] transition-colors hover:bg-slate-800"
            >
              {t.impactMetrics.ctaPrimary}
            </a>
          </motion.div>
        </div>
      </div>
    </Section>
  );
};

export default ImpactMetrics;
