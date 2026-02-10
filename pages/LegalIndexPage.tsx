import React, { useEffect } from 'react';
import LegalShell from '../components/LegalShell';
import { legalDocs } from '../lib/legal';
import { useLanguage } from '../LanguageContext';

const LegalIndexPage: React.FC = () => {
  const { t } = useLanguage();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <LegalShell title={t.legal.centerTitle} subtitle={t.legal.center}>
      <p className="mt-4 text-base text-slate-600">{t.legal.centerDescription}</p>

      <div className="mt-10 space-y-5">
        {legalDocs.map((doc) => (
          <div key={doc.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <a
              href={`/${doc.slug}`}
              className="text-lg font-semibold text-slate-900 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-800"
            >
              {doc.title}
            </a>
            <p className="mt-2 text-sm text-slate-500">
              {t.legal.lastUpdated}: {doc.lastUpdated} • {t.legal.version}: {doc.version}
            </p>
          </div>
        ))}
      </div>
    </LegalShell>
  );
};

export default LegalIndexPage;
