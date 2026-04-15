import { getSiteUrl, resolveAbsoluteUrl } from './site-url';

export type SeoLanguage = 'en' | 'tr';
export type SeoRouteKey =
  | 'home'
  | 'blogIndex'
  | 'pricing'
  | 'about'
  | 'dataDeletion'
  | 'legalIndex'
  | 'terms'
  | 'privacy'
  | 'kvkk'
  | 'preInformation'
  | 'distanceSalesAgreement'
  | 'cancellationRefund'
  | 'subscriptionTrial'
  | 'faqDirectory';

type LocalizedSeoCopy = {
  title: string;
  description: string;
};

type RouteSeoMap = Record<SeoRouteKey, LocalizedSeoCopy>;

export type SeoAlternate = {
  hrefLang: string;
  href: string;
};

export type SeoPayload = {
  routeKey: SeoRouteKey;
  title: string;
  description: string;
  robots: string;
  canonicalUrl: string;
  alternates: SeoAlternate[];
  og: {
    type: 'website';
    siteName: string;
    title: string;
    description: string;
    url: string;
    image: string;
    locale: string;
  };
  twitter: {
    card: 'summary_large_image';
    title: string;
    description: string;
    image: string;
  };
  jsonLd: Record<string, unknown>[];
};

const HOME_PATH_BY_LANGUAGE: Record<SeoLanguage, string> = {
  tr: '/',
  en: '/en/',
};

const SEO_COPY: Record<SeoLanguage, RouteSeoMap> = {
  en: {
    home: {
      title: 'Qualy | AI-First Inbox for WhatsApp, Instagram, Messenger, and Telegram',
      description:
        'Automate repetitive chats, qualify leads with AI scoring, and hand over high-intent conversations at the right moment.',
    },
    blogIndex: {
      title: 'Blog | Qualy',
      description:
        'Read the latest product notes, operational guides, and platform updates from Qualy.',
    },
    pricing: {
      title: 'Pricing | Qualy',
      description:
        'Start Qualy with a 14-day free trial. No card required. Compare Starter, Growth, and Scale as software subscriptions with included monthly usage allowance, with a Custom plan available.',
    },
    about: {
      title: 'About Qualy | Qualy',
      description:
        'Learn how Qualy combines WhatsApp auto reply, Instagram message management, AI customer communication, and lead qualification for service teams.',
    },
    dataDeletion: {
      title: 'Data Deletion Instructions | Qualy',
      description:
        'Learn simple steps to delete your data in Qualy, including what is deleted, processing time, confirmation, and support contact.',
    },
    legalIndex: {
      title: 'Legal Center | Qualy',
      description:
        'Access Qualy legal documents from one place, including Terms of Service and Privacy Policy version details.',
    },
    terms: {
      title: 'Terms of Service | Qualy',
      description: 'Read the Terms of Service governing Qualy platform usage, responsibilities, and legal conditions.',
    },
    privacy: {
      title: 'Privacy Policy | Qualy',
      description: 'Review how Qualy collects, uses, stores, and protects personal data across the service.',
    },
    kvkk: {
      title: 'Personal Data Disclosure (KVKK) | Qualy',
      description:
        'Review Qualy personal data disclosure prepared under Turkish KVKK, including legal bases, transfers, and data subject rights.',
    },
    preInformation: {
      title: 'Pre-Information Form | Qualy',
      description:
        'Read Qualy pre-information details before purchase, including plan fees, trial model, payment flow, and withdrawal information.',
    },
    distanceSalesAgreement: {
      title: 'Distance Sales Agreement | Qualy',
      description:
        'Review the distance sales agreement for Qualy digital services, including subscription terms, delivery model, and legal conditions.',
    },
    cancellationRefund: {
      title: 'Cancellation, Refund, and Withdrawal Policy | Qualy',
      description:
        'See Qualy cancellation, refund, and withdrawal conditions for SaaS subscriptions, including trial and recurring billing scenarios.',
    },
    subscriptionTrial: {
      title: 'Subscription and 14-Day Trial Terms | Qualy',
      description:
        'Understand Qualy 14-day trial and subscription renewal model, including billing cycles, cancellation timing, and failed payment handling.',
    },
    faqDirectory: {
      title: 'LLM-Optimized FAQs | Qualy',
      description:
        'Browse Qualy answer-first FAQs designed for both humans and language models, with links to markdown and llms resources.',
    },
  },
  tr: {
    home: {
      title: 'Qualy | WhatsApp, Instagram, Messenger ve Telegram için AI Gelen Kutusu',
      description:
        'Tekrarlayan konuşmaları otomatikleştir, AI skorlama ile adayları nitelendir ve yüksek niyetli konuşmaları doğru anda devral.',
    },
    blogIndex: {
      title: 'Blog | Qualy',
      description:
        'Qualy’den ürün notları, operasyon rehberleri ve platform güncellemelerini oku.',
    },
    pricing: {
      title: 'Fiyatlandırma | Qualy',
      description:
        "Qualy'yi 14 gün ücretsiz dene. Kart bilgisi gerekmez. Temel, Gelişmiş ve Profesyonel paketlerini yazılım aboneliği ve dahil aylık kullanım hakkına göre karşılaştır; Özel Paket seçeneği hazır.",
    },
    about: {
      title: 'Hakkımızda | Qualy',
      description:
        'Qualy hakkında; WhatsApp otomatik yanıt, Instagram mesaj yönetimi, AI müşteri iletişimi ve potansiyel müşteri nitelendirme yaklaşımını incele.',
    },
    dataDeletion: {
      title: 'Veri Silme Talimatları | Qualy',
      description:
        'Qualy’de verilerini nasıl sileceğini adım adım öğren. Bu sayfada silinen veriler, işlem süresi, onay ve destek bilgisi yer alır.',
    },
    legalIndex: {
      title: 'Yasal Merkez | Qualy',
      description:
        'Qualy yasal dokümanlarına tek sayfadan eriş; Hizmet Şartları ve Gizlilik Politikası sürüm bilgilerini görüntüle.',
    },
    terms: {
      title: 'Hizmet Şartları | Qualy',
      description: 'Qualy platform kullanımını düzenleyen Hizmet Şartları, sorumluluklar ve hukuki koşulları incele.',
    },
    privacy: {
      title: 'Gizlilik Politikası | Qualy',
      description: 'Qualy’nin kişisel verileri nasıl topladığını, kullandığını, sakladığını ve koruduğunu incele.',
    },
    kvkk: {
      title: 'KVKK Aydınlatma Metni | Qualy',
      description:
        'Qualy KVKK aydınlatma metnini incele; işlenen veri kategorileri, hukuki dayanaklar, aktarımlar ve ilgili kişi haklarını görüntüle.',
    },
    preInformation: {
      title: 'Ön Bilgilendirme Formu | Qualy',
      description:
        'Satın alma öncesi plan ücretleri, deneme modeli, ödeme akışı ve cayma bilgilerini içeren Qualy ön bilgilendirme formunu incele.',
    },
    distanceSalesAgreement: {
      title: 'Mesafeli Hizmet Sözleşmesi | Qualy',
      description:
        'Qualy dijital hizmetlerine ilişkin mesafeli sözleşme koşullarını, abonelik modelini ve hukuki şartları incele.',
    },
    cancellationRefund: {
      title: 'İptal, İade ve Cayma Politikası | Qualy',
      description:
        'Qualy SaaS abonelikleri için iptal, iade ve cayma süreçlerini; deneme ve tekrarlayan tahsilat senaryolarıyla birlikte incele.',
    },
    subscriptionTrial: {
      title: 'Abonelik ve 14 Gün Deneme Koşulları | Qualy',
      description:
        'Qualy’de 14 gün deneme, ücretli plana geçiş, otomatik yenileme, iptal zamanı ve başarısız ödeme yönetimi kurallarını incele.',
    },
    faqDirectory: {
      title: 'LLM Odaklı SSS | Qualy',
      description:
        'Qualy için hem insanlar hem de dil modelleri için hazırlanan SSS yanıtlarını ve markdown kaynaklarını görüntüle.',
    },
  },
};

const ROUTE_PATHS: Record<Exclude<SeoRouteKey, 'home'>, Record<SeoLanguage, string>> = {
  blogIndex: {
    tr: '/blog/',
    en: '/en/blog/',
  },
  pricing: {
    tr: '/pricing/',
    en: '/en/pricing/',
  },
  about: {
    tr: '/about/',
    en: '/en/about/',
  },
  dataDeletion: {
    tr: '/data-deletion/',
    en: '/en/data-deletion/',
  },
  legalIndex: {
    tr: '/legal/',
    en: '/en/legal/',
  },
  terms: {
    tr: '/terms/',
    en: '/en/terms/',
  },
  privacy: {
    tr: '/privacy/',
    en: '/en/privacy/',
  },
  kvkk: {
    tr: '/kvkk/',
    en: '/en/kvkk/',
  },
  preInformation: {
    tr: '/pre-information/',
    en: '/en/pre-information/',
  },
  distanceSalesAgreement: {
    tr: '/distance-sales-agreement/',
    en: '/en/distance-sales-agreement/',
  },
  cancellationRefund: {
    tr: '/cancellation-refund/',
    en: '/en/cancellation-refund/',
  },
  subscriptionTrial: {
    tr: '/subscription-trial/',
    en: '/en/subscription-trial/',
  },
  faqDirectory: {
    tr: '/faqs-directory/',
    en: '/faqs-directory/',
  },
};

const OG_IMAGE_PATH_BY_LANGUAGE: Record<SeoLanguage, string> = {
  tr: '/og/qualy-og-tr.png',
  en: '/og/qualy-og-en.png',
};
const DEFAULT_ROBOTS = 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1';

export const normalizeRoutePath = (path: string) => {
  const cleaned = (path || '/').replace(/\/+$/, '');
  return cleaned === '' ? '/' : cleaned;
};

const stripLocalizedPrefix = (path: string) => {
  const normalized = normalizeRoutePath(path);
  if (normalized === '/en') return '/';
  if (normalized.startsWith('/en/')) {
    const stripped = normalized.slice(3);
    return stripped === '' ? '/' : stripped;
  }
  return normalized;
};

export const getSeoRouteKeyByPath = (path: string): SeoRouteKey => {
  const normalized = stripLocalizedPrefix(path);
  if (normalized === '/') return 'home';
  if (normalized === '/blog') return 'blogIndex';
  if (normalized === '/pricing') return 'pricing';
  if (normalized === '/about') return 'about';
  if (normalized === '/data-deletion') return 'dataDeletion';
  if (normalized === '/legal') return 'legalIndex';
  if (normalized === '/terms') return 'terms';
  if (normalized === '/privacy') return 'privacy';
  if (normalized === '/kvkk') return 'kvkk';
  if (normalized === '/pre-information') return 'preInformation';
  if (normalized === '/distance-sales-agreement') return 'distanceSalesAgreement';
  if (normalized === '/cancellation-refund') return 'cancellationRefund';
  if (normalized === '/subscription-trial') return 'subscriptionTrial';
  if (normalized === '/faqs-directory') return 'faqDirectory';
  return 'home';
};

const toOgLocale = (language: SeoLanguage) => (language === 'tr' ? 'tr_TR' : 'en_US');

const getCanonicalPathForRoute = (
  routeKey: SeoRouteKey,
  language: SeoLanguage,
) => {
  if (routeKey === 'home') {
    return HOME_PATH_BY_LANGUAGE[language];
  }

  return ROUTE_PATHS[routeKey][language];
};

const buildAlternates = ({
  routeKey,
  siteUrl,
}: {
  routeKey: SeoRouteKey;
  siteUrl: string;
}): SeoAlternate[] => {
  const trPath = getCanonicalPathForRoute(routeKey, 'tr');
  const enPath = getCanonicalPathForRoute(routeKey, 'en');
  if (trPath === enPath) return [];

  return [
    { hrefLang: 'tr', href: resolveAbsoluteUrl(siteUrl, trPath) },
    { hrefLang: 'en', href: resolveAbsoluteUrl(siteUrl, enPath) },
    { hrefLang: 'x-default', href: resolveAbsoluteUrl(siteUrl, trPath) },
  ];
};

const buildHomeJsonLd = ({
  siteUrl,
  language,
  title,
  description,
}: {
  siteUrl: string;
  language: SeoLanguage;
  title: string;
  description: string;
}) => [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Qualy',
    url: siteUrl,
    logo: resolveAbsoluteUrl(siteUrl, '/icon-black.svg'),
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Qualy',
    url: siteUrl,
    inLanguage: language,
  },
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Qualy',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description,
    inLanguage: language,
    offers: {
      '@type': 'Offer',
      price: '79',
      priceCurrency: 'USD',
      url: resolveAbsoluteUrl(siteUrl, '/'),
      name: title,
    },
  },
];

const buildLegalJsonLd = ({
  siteUrl,
  language,
  title,
  description,
  canonicalUrl,
}: {
  siteUrl: string;
  language: SeoLanguage;
  title: string;
  description: string;
  canonicalUrl: string;
}) => [
  {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    inLanguage: language,
    url: canonicalUrl,
    isPartOf: {
      '@type': 'WebSite',
      name: 'Qualy',
      url: siteUrl,
    },
  },
];

export const getSeoByRoute = (
  routeKey: SeoRouteKey,
  language: SeoLanguage,
  options: {
    siteUrl?: string;
  } = {}
): SeoPayload => {
  const siteUrl = options.siteUrl ? options.siteUrl : getSiteUrl();
  const copy = SEO_COPY[language][routeKey];
  const canonicalPath = getCanonicalPathForRoute(routeKey, language);
  const canonicalUrl = resolveAbsoluteUrl(siteUrl, canonicalPath);
  const ogImage = resolveAbsoluteUrl(siteUrl, OG_IMAGE_PATH_BY_LANGUAGE[language]);
  const alternates = buildAlternates({ routeKey, siteUrl });
  const robots = DEFAULT_ROBOTS;

  const basePayload: Omit<SeoPayload, 'jsonLd'> = {
    routeKey,
    title: copy.title,
    description: copy.description,
    robots,
    canonicalUrl,
    alternates,
    og: {
      type: 'website',
      siteName: 'Qualy',
      title: copy.title,
      description: copy.description,
      url: canonicalUrl,
      image: ogImage,
      locale: toOgLocale(language),
    },
    twitter: {
      card: 'summary_large_image',
      title: copy.title,
      description: copy.description,
      image: ogImage,
    },
  };

  const jsonLd =
    routeKey === 'home'
      ? buildHomeJsonLd({
          siteUrl,
          language,
          title: copy.title,
          description: copy.description,
        })
      : buildLegalJsonLd({
          siteUrl,
          language,
          title: copy.title,
          description: copy.description,
          canonicalUrl,
        });

  return {
    ...basePayload,
    jsonLd,
  };
};
