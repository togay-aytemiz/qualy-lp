import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../LanguageContext';

type PricingTier = {
  name: string;
  price: string;
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
    planIncludedFeatures: [
      'Shared inbox for WhatsApp, Instagram, and Telegram',
      'AI auto-replies with lead qualification',
      'Team assignment and human handover flow',
      'Saved replies (templates)',
      'Basic reporting and usage visibility',
    ],
    plans: [
      {
        name: 'Starter',
        price: '349',
        credits: '1000',
        conversations: 'About 90-120 conversations/month',
        bestFor: 'Best for teams starting to automate',
        subject: 'Starter Plan Free Trial Inquiry',
      },
      {
        name: 'Growth',
        price: '649',
        credits: '2000',
        conversations: 'About 180-240 conversations/month',
        bestFor: 'Best for teams with steady lead volume',
        subject: 'Growth Plan Free Trial Inquiry',
      },
      {
        name: 'Scale',
        price: '999',
        credits: '4000',
        conversations: 'About 360-480 conversations/month',
        bestFor: 'Best for high-volume sales operations',
        subject: 'Scale Plan Free Trial Inquiry',
      },
    ],
    footnote: 'Conversation range may vary by message length, language, and response complexity.',
    enterpriseCard: {
      kicker: 'Enterprise',
      title: 'Enterprise',
      description:
        'For organizations that need custom integration, advanced governance, and rollout coordination across teams.',
      cta: 'Contact Us',
      subject: 'Enterprise Plan Inquiry',
      responseSla: 'Response within 1 business day',
      bullets: [
        'Custom deployment and integration planning',
        'Channel migration support with dedicated onboarding',
        'Security, governance, and workflow customization',
      ],
    },
  },
  tr: {
    title: 'Dakikalar içinde canlıya çık. Konuşma hacmi arttıkça ölçekle.',
    subtitle:
      "Tüm paketlerde aynı güçlü ürün var. Temel'le hemen başla, konuşma hacmin arttıkça Akış ve Yoğun'a geçerek daha fazla lead'i kaçırmadan yönet.",
    trialInlineText: '14 gün ücretsiz dene. Kredi kartı gerekmez.',
    trialNoCardLabel: 'Kredi kartı gerekmez',
    planCta: '14 gün ücretsiz dene',
    planIncludesLabel: 'Her pakette standart',
    planIncludedFeatures: [
      'WhatsApp, Instagram ve Telegram için ortak inbox',
      'AI otomatik yanıt ve lead nitelendirme',
      'Atama ve insan devri akışı',
      'Hazır yanıtlar (şablonlar)',
      'Temel raporlama ve kullanım görünümü',
    ],
    plans: [
      {
        name: 'Temel',
        price: '349',
        credits: '1000',
        conversations: 'Ayda yaklaşık 90-120 konuşma',
        bestFor: 'Otomasyona yeni başlayan işletmeler için',
        subject: 'Temel Plan Ücretsiz Deneme Talebi',
      },
      {
        name: 'Akış',
        price: '649',
        credits: '2000',
        conversations: 'Ayda yaklaşık 180-240 konuşma',
        bestFor: 'Düzenli lead akışı olan işletmeler için',
        subject: 'Akış Plan Ücretsiz Deneme Talebi',
      },
      {
        name: 'Yoğun',
        price: '999',
        credits: '4000',
        conversations: 'Ayda yaklaşık 360-480 konuşma',
        bestFor: 'Yüksek hacimli operasyonlar için',
        subject: 'Yoğun Plan Ücretsiz Deneme Talebi',
      },
    ],
    footnote: 'Konuşma aralığı; mesaj uzunluğu, dil ve yanıt karmaşıklığına göre değişebilir.',
    enterpriseCard: {
      kicker: 'Enterprise',
      title: 'Enterprise',
      description:
        'Kuruma özel entegrasyon, ileri seviye yönetim ve birimler arası rollout koordinasyonuna ihtiyaç duyan yapılar için.',
      cta: 'Bize Ulaşın',
      subject: 'Enterprise Plan Talebi',
      responseSla: '1 iş günü içinde dönüş',
      bullets: [
        'Kuruma özel kurulum ve entegrasyon planı',
        'Kanal geçişi ve öncelikli onboarding desteği',
        'Güvenlik, yetkilendirme ve workflow özelleştirmesi',
      ],
    },
  },
};

const Pricing: React.FC = () => {
  const { language } = useLanguage();
  const copy = COPY_BY_LANGUAGE[language];

  return (
    <section className="relative overflow-hidden bg-[#f8fafc] pb-24 pt-36 md:pb-32 md:pt-44">
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

                <p className={`mt-3 text-sm font-medium ${subLabelClass}`}>{plan.bestFor}</p>

                <p className="mt-6 text-5xl font-semibold tracking-tight">
                  {plan.price}
                  <span className={`ml-2 text-base font-medium ${helperClass}`}>TRY / ay</span>
                </p>

                <div className={`mt-6 min-h-[102px] rounded-2xl border px-4 py-4 ${creditClass}`}>
                  <p className="text-sm font-semibold uppercase tracking-[0.12em]">{plan.credits} kredi / ay</p>
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
                  href={`mailto:askqualy@gmail.com?subject=${encodeURIComponent(plan.subject)}`}
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
          className="relative mx-auto mt-8 max-w-6xl overflow-hidden rounded-3xl border border-slate-900/10 bg-[radial-gradient(100%_180%_at_0%_0%,#111827_0%,#0F172A_52%,#020617_100%)] p-8 text-white shadow-2xl md:p-10"
        >
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 bg-[linear-gradient(120deg,rgba(8,47,73,0.15)_0%,rgba(8,145,178,0.20)_100%)] md:block" />

          <div className="relative grid gap-8 md:grid-cols-2 md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200">
                {copy.enterpriseCard.kicker}
              </p>
              <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
                {copy.enterpriseCard.title}
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-200">{copy.enterpriseCard.description}</p>
              <p className="mt-6 inline-flex items-center rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold text-slate-100">
                {copy.enterpriseCard.responseSla}
              </p>
            </div>

            <div>
              <ul className="space-y-3">
                {copy.enterpriseCard.bullets.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-slate-100">
                    <Check className="mt-0.5 h-4 w-4 flex-none text-cyan-200" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <a
                href={`mailto:askqualy@gmail.com?subject=${encodeURIComponent(copy.enterpriseCard.subject)}`}
                className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition-colors hover:bg-cyan-50 md:w-auto md:min-w-[220px]"
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
