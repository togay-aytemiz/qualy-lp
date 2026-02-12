import React, { useEffect, useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { AUTH_URLS } from '../lib/auth-links';
import { cn } from '../lib/utils';
import SectionWithHeader from './SectionWithHeader';

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

const FAQ: React.FC = () => {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState(0);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [demoFormData, setDemoFormData] = useState<DemoFormData>(initialDemoFormData);
  const [demoFormError, setDemoFormError] = useState<string | null>(null);

  useEffect(() => {
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
          <button
            type="button"
            onClick={openDemoModal}
            className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-8 py-3 text-sm font-semibold text-slate-900 shadow-[0_8px_20px_rgba(15,23,42,0.08)] transition-colors hover:bg-slate-100"
          >
            {t.hero.ctaSecondary}
          </button>
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

      {isDemoModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/55 px-4 py-6" onClick={closeDemoModal}>
          <div
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="faq-demo-modal-title"
            className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_24px_64px_rgba(15,23,42,0.35)] sm:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="faq-demo-modal-title" className="text-2xl font-semibold text-slate-900">
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
                <label htmlFor="faq-demo-full-name" className="text-sm font-medium text-slate-800">
                  {t.hero.demoModal.fullNameLabel}
                </label>
                <input
                  id="faq-demo-full-name"
                  type="text"
                  value={demoFormData.fullName}
                  onChange={updateDemoField('fullName')}
                  placeholder={t.hero.demoModal.fullNamePlaceholder}
                  className="h-11 w-full rounded-xl border border-slate-300 px-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label htmlFor="faq-demo-email" className="text-sm font-medium text-slate-800">
                    {t.hero.demoModal.emailLabel}
                  </label>
                  <input
                    id="faq-demo-email"
                    type="email"
                    value={demoFormData.email}
                    onChange={updateDemoField('email')}
                    placeholder={t.hero.demoModal.emailPlaceholder}
                    className="h-11 w-full rounded-xl border border-slate-300 px-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="faq-demo-phone" className="text-sm font-medium text-slate-800">
                    {t.hero.demoModal.phoneLabel}
                  </label>
                  <input
                    id="faq-demo-phone"
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
                <label htmlFor="faq-demo-note" className="text-sm font-medium text-slate-800">
                  {t.hero.demoModal.noteLabel}
                </label>
                <textarea
                  id="faq-demo-note"
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

export default FAQ;
