import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { AUTH_URLS } from '../lib/auth-links';
import { cn } from '../lib/utils';
import SectionWithHeader from './SectionWithHeader';

const FAQ: React.FC = () => {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <SectionWithHeader
      id="faq"
      className="bg-white"
      title={t.faq.title}
      subtitle={t.faq.subtitle}
    >
      <div className="-mt-6 mb-10 flex w-full flex-col items-center justify-center gap-4 sm:-mt-8 sm:flex-row">
        <a
          href={AUTH_URLS.register}
          className="inline-flex items-center justify-center rounded-full bg-slate-900 px-8 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(15,23,42,0.18)] transition-colors hover:bg-slate-800"
        >
          {t.faq.primary}
        </a>
        <a
          href="mailto:askqualy@gmail.com"
          className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-8 py-3 text-sm font-semibold text-slate-900 shadow-[0_8px_20px_rgba(15,23,42,0.08)] transition-colors hover:bg-slate-100"
        >
          {t.faq.secondary}
        </a>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
        <div className="divide-y divide-slate-200">
          {t.faq.items.map((item, index) => {
            const isOpen = openIndex === index;
            const panelId = `faq-panel-${index}`;

            return (
              <div key={item.question}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-6 text-left md:px-8"
                >
                  <span className="text-base font-medium text-slate-900">{item.question}</span>
                  <span
                    className={cn(
                      'inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 transition-transform',
                      isOpen && 'rotate-180'
                    )}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </span>
                </button>
                <div
                  id={panelId}
                  role="region"
                  aria-hidden={!isOpen}
                  className={cn(
                    'grid px-6 md:px-8 transition-all duration-300',
                    isOpen ? 'grid-rows-[1fr] pb-6 opacity-100' : 'grid-rows-[0fr] opacity-0'
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="pl-1 pr-1 text-sm md:text-base leading-relaxed text-slate-600">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </SectionWithHeader>
  );
};

export default FAQ;
