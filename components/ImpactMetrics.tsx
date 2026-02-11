import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../LanguageContext';
import Section from './Section';

const ImpactMetrics: React.FC = () => {
  const { t } = useLanguage();
  const prefersReducedMotion = useReducedMotion();

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
            {t.impactMetrics.items.map((metric, index) => (
              <motion.article
                key={metric.label}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.35,
                  delay: prefersReducedMotion ? 0 : index * 0.08,
                }}
                className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 backdrop-blur-sm md:p-6"
              >
                <div className="border-l border-slate-900 pl-4">
                  <p className="text-4xl font-semibold tracking-tight text-slate-900 tabular-nums md:text-5xl">
                    {metric.value}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-900 md:text-base">
                    {metric.label}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{metric.detail}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
};

export default ImpactMetrics;
