import React, { useEffect } from 'react';
import LegalShell from '../components/LegalShell';
import { getLegalDoc } from '../lib/legal';
import { useLanguage } from '../LanguageContext';

type Props = {
  slug: string;
};

const LegalPage: React.FC<Props> = ({ slug }) => {
  const { t, language } = useLanguage();
  const doc = getLegalDoc(slug, language);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (!doc) {
    return (
      <LegalShell title={t.legal.notFoundTitle} subtitle={t.legal.centerTitle}>
        <p className="mt-4 text-base text-slate-600">{t.legal.notFoundDescription}</p>
      </LegalShell>
    );
  }

  return (
    <LegalShell title={doc.title} subtitle={t.legal.centerTitle}>
      <p className="mt-4 text-sm text-slate-500">
        {t.legal.lastUpdated}: {doc.lastUpdated} • {t.legal.version}: {doc.version}
      </p>
      <article className="legal-content mt-8" dangerouslySetInnerHTML={{ __html: doc.html }} />
    </LegalShell>
  );
};

export default LegalPage;
