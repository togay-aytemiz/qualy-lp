import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../LanguageContext';
import { AUTH_URLS } from '../lib/auth-links';
import { resolvePricingCurrencyFromBrowser } from '../lib/pricing-currency';

type PricingTier = {
  name: string;
  priceTry: string;
  priceUsd: string;
  credits: string;
  conversations: string;
  bestFor: string;
  subject: string;
};

type PricingPageCopy = {
  title: string;
  subtitle: string;
  trialInlineText: string;
  trialNoCardLabel: string;
  planCta: string;
  planIncludesLabel: string;
  planIncludedFeatures: string[];
  monthlyPriceLabel: Record<'TRY' | 'USD', string>;
  creditsPerMonthLabel: string;
  plans: PricingTier[];
  footnote: string;
  enterpriseCard: {
    kicker: string;
    title: string;
    description: string;
    cta: string;
    subject: string;
    responseSla: string;
    bullets: string[];
  };
};

const COPY_BY_LANGUAGE: Record<'en' | 'tr', PricingPageCopy> = {
  en: {
    title: 'Go live in minutes. Scale as conversations grow.',
    subtitle:
      'Starter, Growth, and Scale include the same core product. Choose your plan by monthly credits and expected conversation volume.',
    trialInlineText: 'Start your 14-day free trial. No credit card required.',
    trialNoCardLabel: 'No credit card required',
    planCta: 'Start your 14-day free trial',
    planIncludesLabel: 'Standard in every plan',
    monthlyPriceLabel: {
      TRY: 'TRY / month',
      USD: 'USD / month',
    },
    creditsPerMonthLabel: 'credits / month',
    planIncludedFeatures: [
      'Shared inbox for WhatsApp, Instagram, and Telegram',
      'AI auto-replies with lead qualification',
      'Team assignment and human handover flow',
      'Saved replies (templates)',
      'Conversation summary and scoring view',
    ],
    plans: [
      {
        name: 'Starter',
        priceTry: '349',
        priceUsd: '9.99',
        credits: '1000',
        conversations: 'About 90-120 conversations/month',
        bestFor: 'Best for teams starting to automate',
        subject: 'Starter Plan Free Trial Inquiry',
      },
      {
        name: 'Growth',
        priceTry: '649',
        priceUsd: '17.99',
        credits: '2000',
        conversations: 'About 180-240 conversations/month',
        bestFor: 'Best for teams with steady lead volume',
        subject: 'Growth Plan Free Trial Inquiry',
      },
      {
        name: 'Scale',
        priceTry: '949',
        priceUsd: '26.99',
        credits: '4000',
        conversations: 'About 360-480 conversations/month',
        bestFor: 'Best for high-volume sales operations',
        subject: 'Scale Plan Free Trial Inquiry',
      },
    ],
    footnote: 'Conversation range may vary by message length, language, and response complexity.',
    enterpriseCard: {
      kicker: 'Custom',
      title: 'Custom Plan',
      description:
        'For teams that outgrow package credits or need tailored integrations, workflows, and rollout support.',
      cta: 'Get Custom Offer',
      subject: 'Custom Plan Inquiry',
      responseSla: 'Response within 1 business day',
      bullets: [
        'Extra monthly credits beyond package limits',
        'Tailored integration and workflow requirements',
        'Dedicated onboarding and migration planning',
      ],
    },
  },
  tr: {
    title: 'Hemen başla. Hacim arttıkça ölçekle.',
    subtitle:
      'Tüm paketlerde aynı güçlü ürün var. Temel ile hemen başla; hacim arttıkça Gelişmiş ve Profesyonel paketlerine geç.',
    trialInlineText: '14 gün ücretsiz dene. Kredi kartı gerekmez.',
    trialNoCardLabel: 'Kredi kartı gerekmez',
    planCta: '14 gün ücretsiz dene',
    planIncludesLabel: 'Her pakette standart',
    monthlyPriceLabel: {
      TRY: 'TRY / ay',
      USD: 'USD / ay',
    },
    creditsPerMonthLabel: 'kredi / ay',
    planIncludedFeatures: [
      'WhatsApp, Instagram, Telegram tek gelen kutusu',
      'Yetenek + Bilgi Bankası ile yapay zeka yanıtı',
      'Kişi nitelendirme ve skorlama',
      'Atama ve insan devri',
      'Konuşma özeti',
    ],
    plans: [
      {
        name: 'Temel',
        priceTry: '349',
        priceUsd: '9.99',
        credits: '1000',
        conversations: 'Ayda yaklaşık 90-120 konuşma',
        bestFor: 'İlk otomasyon adımını atan işletmeler',
        subject: 'Temel Plan Ücretsiz Deneme Talebi',
      },
      {
        name: 'Gelişmiş',
        priceTry: '649',
        priceUsd: '17.99',
        credits: '2000',
        conversations: 'Ayda yaklaşık 180-240 konuşma',
        bestFor: 'Düzenli mesaj trafiği olan işletmeler',
        subject: 'Gelişmiş Plan Ücretsiz Deneme Talebi',
      },
      {
        name: 'Profesyonel',
        priceTry: '949',
        priceUsd: '26.99',
        credits: '4000',
        conversations: 'Ayda yaklaşık 360-480 konuşma',
        bestFor: 'Yüksek konuşma hacmi yöneten işletmeler',
        subject: 'Profesyonel Plan Ücretsiz Deneme Talebi',
      },
    ],
    footnote: 'Konuşma aralığı; mesaj uzunluğu, dil ve yanıt karmaşıklığına göre değişebilir.',
    enterpriseCard: {
      kicker: 'Özel Paket',
      title: 'İhtiyaca Özel Çözüm',
      description:
        'Paket kredileri yetmiyorsa veya farklı ihtiyaçların varsa, işletmene özel kredi hacmi ve kurulum planı oluşturuyoruz.',
      cta: 'Özel Teklif Al',
      subject: 'Özel Paket Talebi',
      responseSla: '1 iş günü içinde dönüş',
      bullets: [
        'Paket limitini aşan kredi ihtiyacı için özel hacim',
        'İşletmene özel entegrasyon ve süreç tasarımı',
        'Öncelikli kurulum ve geçiş planı',
      ],
    },
  },
};

const Pricing: React.FC = () => {
  const { language } = useLanguage();
  const copy = COPY_BY_LANGUAGE[language];
  const pricingCurrency = React.useMemo(() => resolvePricingCurrencyFromBrowser(), []);

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(to_bottom,#f8fafc_0%,#f8fafc_82%,#ffffff_100%)] pb-24 pt-36 md:pb-32 md:pt-44">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(15,23,42,0.14),transparent_58%)]" />
        <div className="absolute -left-20 top-20 h-64 w-64 rounded-full bg-amber-200/40 blur-3xl" />
        <div className="absolute -right-24 top-40 h-72 w-72 rounded-full bg-cyan-200/50 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl" />
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
          <p className="mx-auto mt-4 inline-flex rounded-full border border-slate-300 bg-white/90 px-4 py-1.5 text-sm font-semibold text-slate-700">
            {copy.trialInlineText}
          </p>
        </motion.div>

        <div className="mx-auto mt-12 grid max-w-6xl gap-6 lg:grid-cols-3 lg:items-stretch">
          {copy.plans.map((plan, index) => {
            const planPrice = pricingCurrency === 'TRY' ? plan.priceTry : plan.priceUsd;
            const isFeatured = index === 1;
            const cardBaseClass = isFeatured
              ? 'relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-900 bg-[radial-gradient(125%_140%_at_50%_0%,#1E3A5F_0%,#0F172A_52%,#020617_100%)] p-8 pt-10 text-white shadow-2xl'
              : 'relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 pt-10 text-slate-900 shadow-lg';
            const badgeClass = isFeatured
              ? 'border-white/30 bg-white/15 text-white'
              : 'border-slate-200 bg-slate-50 text-slate-700';
            const creditClass = isFeatured
              ? 'border-white/20 bg-white/10 text-white'
              : 'border-slate-200 bg-slate-100 text-slate-900';
            const includedClass = isFeatured
              ? 'border-white/20 bg-white/5 text-slate-100'
              : 'border-slate-200 bg-slate-50 text-slate-700';
            const ctaClass = isFeatured
              ? 'bg-white text-slate-900 hover:bg-slate-100'
              : 'bg-slate-900 text-white hover:bg-slate-700';
            const helperClass = isFeatured ? 'text-slate-200' : 'text-slate-500';
            const subLabelClass = isFeatured ? 'text-slate-200' : 'text-slate-600';

            return (
              <motion.article
                key={plan.name}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.12 + index * 0.08 }}
                className={cardBaseClass}
              >
                {isFeatured ? (
                  <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-300/35 blur-3xl" />
                ) : null}

                <div
                  className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${badgeClass}`}
                >
                  {plan.name}
                </div>

                <p title={plan.bestFor} className={`mt-3 truncate whitespace-nowrap text-sm font-medium ${subLabelClass}`}>
                  {plan.bestFor}
                </p>

                <p className="mt-6 text-5xl font-semibold tracking-tight">
                  {planPrice}
                  <span className={`ml-2 text-base font-medium ${helperClass}`}>
                    {copy.monthlyPriceLabel[pricingCurrency]}
                  </span>
                </p>

                <div className={`mt-6 min-h-[102px] rounded-2xl border px-4 py-4 ${creditClass}`}>
                  <p className="text-sm font-semibold uppercase tracking-[0.12em]">
                    {plan.credits} {copy.creditsPerMonthLabel}
                  </p>
                  <p className={`mt-2 text-sm ${isFeatured ? 'text-slate-100' : 'text-slate-600'}`}>
                    {plan.conversations}
                  </p>
                </div>

                <div className={`mt-4 mb-6 rounded-2xl border px-4 py-4 ${includedClass}`}>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em]">{copy.planIncludesLabel}</p>
                  <ul className="mt-3 space-y-2.5">
                    {copy.planIncludedFeatures.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm leading-6">
                        <Check
                          className={`mt-1 h-4 w-4 flex-none ${isFeatured ? 'text-cyan-200' : 'text-slate-600'}`}
                          aria-hidden="true"
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href={AUTH_URLS.register}
                  className={`mt-auto inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold transition-colors ${ctaClass}`}
                >
                  {copy.planCta}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>

                <p className={`mt-3 text-center text-xs ${isFeatured ? 'text-slate-200' : 'text-slate-500'}`}>
                  {copy.trialNoCardLabel}
                </p>
              </motion.article>
            );
          })}
        </div>

        <p className="mx-auto mt-6 max-w-6xl text-xs leading-6 text-slate-500">{copy.footnote}</p>

        <motion.article
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.42 }}
          data-pricing-enterprise="true"
          className="relative mx-auto mt-8 max-w-6xl overflow-hidden rounded-3xl border border-slate-300 bg-[radial-gradient(120%_190%_at_0%_0%,#FFFFFF_0%,#F8FAFC_52%,#E5E7EB_100%)] p-8 text-slate-900 shadow-lg md:p-10"
        >
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 bg-[linear-gradient(120deg,rgba(148,163,184,0.10)_0%,rgba(241,245,249,0.65)_100%)] md:block" />

          <div className="relative grid gap-8 md:grid-cols-2 md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
                {copy.enterpriseCard.kicker}
              </p>
              <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
                {copy.enterpriseCard.title}
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-700">{copy.enterpriseCard.description}</p>
              <p className="mt-6 inline-flex items-center rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                {copy.enterpriseCard.responseSla}
              </p>
            </div>

            <div>
              <ul className="space-y-3">
                {copy.enterpriseCard.bullets.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-slate-700">
                    <Check className="mt-0.5 h-4 w-4 flex-none text-slate-600" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <a
                href={`mailto:askqualy@gmail.com?subject=${encodeURIComponent(copy.enterpriseCard.subject)}`}
                className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-700 md:w-auto md:min-w-[220px]"
              >
                {copy.enterpriseCard.cta}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </motion.article>
      </div>
    </section>
  );
};

export default Pricing;
