import React, { useEffect } from 'react';
import { useLanguage } from '../LanguageContext';

type DataDeletionCopy = {
  badge: string;
  title: string;
  intro: string;
  howTitle: string;
  howSteps: string[];
  whatTitle: string;
  whatItems: string[];
  timeTitle: string;
  timeText: string;
  confirmationTitle: string;
  confirmationText: string;
  supportTitle: string;
  supportPrefix: string;
};

const COPY: Record<'tr' | 'en', DataDeletionCopy> = {
  tr: {
    badge: 'Veri Silme',
    title: 'Veri Silme Talimatlari',
    intro: 'Bu sayfa, verilerini nasil silecegini adim adim anlatir.',
    howTitle: 'Nasil silerim?',
    howSteps: [
      'Hesabina giris yap.',
      'Ayarlar > Organizasyon sayfasina git.',
      'Veri Silme bolumunu ac.',
      'Verileri sil secenegine bas.',
      'Sifreni gir ve Simdi sil ile onayla.',
    ],
    whatTitle: 'Hangi veriler silinir?',
    whatItems: [
      'Konusmalar',
      'Mesajlar',
      'Lead ve qualification kayitlari',
      'Konusma ile ilgili AI kullanim metadata kayitlari',
    ],
    timeTitle: 'Ne kadar surer?',
    timeText: 'Talepler en gec 30 gun icinde tamamlanir. Cogu talep daha kisa surede biter.',
    confirmationTitle: 'Sonuc bildirimi',
    confirmationText: 'Islem bittiginde uygulama ici bildirim veya e-posta ile haber verilir.',
    supportTitle: 'Destek',
    supportPrefix: 'Yardim icin:',
  },
  en: {
    badge: 'Data Deletion',
    title: 'Data Deletion Instructions',
    intro: 'This page explains, in simple words, how you can delete your data.',
    howTitle: 'How do I delete my data?',
    howSteps: [
      'Sign in to your account.',
      'Go to Settings > Organization.',
      'Open the Data Deletion section.',
      'Click Delete data.',
      'Enter your password and confirm with Delete now.',
    ],
    whatTitle: 'What will be deleted?',
    whatItems: [
      'Conversations',
      'Messages',
      'Lead and qualification records',
      'Conversation-linked AI usage metadata records',
    ],
    timeTitle: 'How long does it take?',
    timeText: 'Requests are completed within 30 days. Most requests are completed sooner.',
    confirmationTitle: 'Confirmation',
    confirmationText: 'Once completed, you will receive a confirmation in-app or by email.',
    supportTitle: 'Support',
    supportPrefix: 'For help:',
  },
};

const DataDeletionPage: React.FC = () => {
  const { language } = useLanguage();
  const copy = language === 'tr' ? COPY.tr : COPY.en;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-4xl px-4 pb-14 pt-28 sm:px-6 sm:pt-32 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">{copy.badge}</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{copy.title}</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">{copy.intro}</p>

        <article className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-semibold text-slate-900">{copy.title}</h2>

          <h3 className="mt-6 text-lg font-semibold text-slate-900">{copy.howTitle}</h3>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-700">
            {copy.howSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>

          <h3 className="mt-6 text-lg font-semibold text-slate-900">{copy.whatTitle}</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-700">
            {copy.whatItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h3 className="mt-6 text-lg font-semibold text-slate-900">{copy.timeTitle}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-700">{copy.timeText}</p>

          <h3 className="mt-6 text-lg font-semibold text-slate-900">{copy.confirmationTitle}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-700">{copy.confirmationText}</p>

          <h3 className="mt-6 text-lg font-semibold text-slate-900">{copy.supportTitle}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            {copy.supportPrefix}{' '}
            <a className="font-semibold text-slate-900 underline" href="mailto:support@askqualy.com">
              support@askqualy.com
            </a>
          </p>
        </article>
      </div>
    </section>
  );
};

export default DataDeletionPage;
