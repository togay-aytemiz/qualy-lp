import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../LanguageContext';

type PricingPageCopy = {
  title: string;
  subtitle: string;
  plansCard: {
    title: string;
    description: string;
    note: string;
    bullets: string[];
  };
  enterpriseCard: {
    title: string;
    contact: string;
    description: string;
    cta: string;
    subject: string;
    bullets: string[];
  };
};

const COPY_BY_LANGUAGE: Record<'en' | 'tr', PricingPageCopy> = {
  en: {
    title: 'Simple pricing, flexible rollout.',
    subtitle:
      'We are still finalizing standard packages. Enterprise is available today with a custom setup and onboarding support.',
    plansCard: {
      title: 'Standard plans are in progress',
      description:
        'We are shaping self-serve package tiers to match real customer usage. Share your use case and we can notify you when plans are finalized.',
      note: 'You can still start with Enterprise while standard plans are being finalized.',
      bullets: [
        'Self-serve package details are being finalized',
        'Final limits and pricing will be announced soon',
        'Early feedback helps us shape the right plans',
      ],
    },
    enterpriseCard: {
      title: 'Enterprise',
      contact: 'Contact Us',
      description:
        'For teams needing custom rollout, advanced controls, and coordinated onboarding across channels.',
      cta: 'Contact Us',
      subject: 'Enterprise Plan Inquiry',
      bullets: [
        'Custom setup and implementation support',
        'Priority onboarding and migration planning',
        'Advanced workflow and governance alignment',
      ],
    },
  },
  tr: {
    title: 'Basit fiyatlandırma, esnek kurulum.',
    subtitle:
      'Standart paketleri şu anda netleştiriyoruz. Enterprise planı ise özel kurulum ve onboarding desteğiyle hemen kullanılabilir.',
    plansCard: {
      title: 'Standart paketler hazırlanıyor',
      description:
        'Self-serve paket katmanlarını gerçek kullanım senaryolarına göre şekillendiriyoruz. İhtiyacını paylaşırsan paketler netleştiğinde seni bilgilendirebiliriz.',
      note: 'Standart paketler netleşene kadar Enterprise ile başlayabilirsin.',
      bullets: [
        'Self-serve paket detayları netleştiriliyor',
        'Final limitler ve fiyatlar yakında duyurulacak',
        'Erken geri bildirimler doğru paketi oluşturmamıza yardımcı oluyor',
      ],
    },
    enterpriseCard: {
      title: 'Enterprise',
      contact: 'Contact Us',
      description:
        'Özel kurulum, ileri seviye kontroller ve çok kanallı onboarding koordinasyonuna ihtiyaç duyan ekipler için.',
      cta: 'Contact Us',
      subject: 'Enterprise Plan Talebi',
      bullets: [
        'Özel kurulum ve implementasyon desteği',
        'Öncelikli onboarding ve geçiş planlaması',
        'İleri seviye workflow ve yönetim uyumu',
      ],
    },
  },
};

const Pricing: React.FC = () => {
  const { language } = useLanguage();
  const copy = COPY_BY_LANGUAGE[language];

  return (
    <section className="relative overflow-hidden bg-white pb-24 pt-36 md:pb-32 md:pt-44">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(15,23,42,0.09),transparent_60%)]" />
        <div className="absolute inset-0 [background-size:34px_34px] [background-image:linear-gradient(to_right,rgba(15,23,42,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.06)_1px,transparent_1px)]" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white via-white/90 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mx-auto max-w-4xl text-center"
        >
          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-slate-900 md:text-6xl">
            {copy.title}
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-slate-600 md:text-xl">
            {copy.subtitle}
          </p>
        </motion.div>

        <div className="mx-auto mt-14 grid max-w-5xl gap-6 lg:grid-cols-2">
          <motion.article
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="rounded-3xl border border-slate-200 bg-white/95 p-8 shadow-sm backdrop-blur"
          >
            <h2 className="text-2xl font-semibold text-slate-900">{copy.plansCard.title}</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">{copy.plansCard.description}</p>

            <ul className="mt-8 space-y-3">
              {copy.plansCard.bullets.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-slate-700">
                  <Check className="mt-0.5 h-4 w-4 flex-none text-slate-500" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              {copy.plansCard.note}
            </div>
          </motion.article>

          <motion.article
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.18 }}
            className="rounded-3xl bg-[radial-gradient(164.75%_100%_at_50%_0%,#334155_0%,#0F172A_48.73%)] p-8 text-white shadow-2xl"
          >
            <h2 className="text-2xl font-semibold">{copy.enterpriseCard.title}</h2>
            <p className="mt-4 text-4xl font-bold tracking-tight">{copy.enterpriseCard.contact}</p>
            <p className="mt-4 text-sm leading-7 text-slate-200">{copy.enterpriseCard.description}</p>

            <ul className="mt-8 space-y-3">
              {copy.enterpriseCard.bullets.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-slate-100">
                  <Check className="mt-0.5 h-4 w-4 flex-none text-white" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <a
              href={`mailto:askqualy@gmail.com?subject=${encodeURIComponent(copy.enterpriseCard.subject)}`}
              className="mt-10 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-100"
            >
              {copy.enterpriseCard.cta}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </motion.article>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
