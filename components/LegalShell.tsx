import React from 'react';
import Footer from './Footer';
import { Logo } from './Logo';
import { useLanguage } from '../LanguageContext';
import { homePathByLanguage } from '../lib/region-language';

type LegalShellProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

const LegalShell: React.FC<LegalShellProps> = ({ title, subtitle, children }) => {
  const { t, language } = useLanguage();
  const homePath = homePathByLanguage(language);
  const legalPath = language === 'en' ? '/en/legal' : '/legal';

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <a href={homePath} className="inline-flex items-center">
            <Logo className="h-7 w-auto" />
          </a>
          <div className="flex items-center gap-5 text-xs font-semibold text-slate-600 sm:text-sm">
            <a href={legalPath} className="hover:text-slate-900 transition-colors">
              {t.legal.center}
            </a>
            <a href={homePath} className="hover:text-slate-900 transition-colors">
              {t.legal.backToHome}
            </a>
          </div>
        </div>
      </header>

      <main className="px-4 pb-20 pt-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {subtitle ? (
            <p className="text-sm font-medium uppercase tracking-wider text-slate-500">{subtitle}</p>
          ) : null}
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{title}</h1>
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LegalShell;
