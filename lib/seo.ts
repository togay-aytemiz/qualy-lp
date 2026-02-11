import { getSiteUrl, resolveAbsoluteUrl } from './site-url';

export type SeoLanguage = 'en' | 'tr';
export type SeoRouteKey = 'home' | 'legalIndex' | 'terms' | 'privacy';

type LocalizedSeoCopy = {
  title: string;
  description: string;
};

type RouteSeoMap = Record<SeoRouteKey, LocalizedSeoCopy>;

export type SeoPayload = {
  routeKey: SeoRouteKey;
  title: string;
  description: string;
  robots: string;
  canonicalUrl: string;
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

const SEO_COPY: Record<SeoLanguage, RouteSeoMap> = {
  en: {
    home: {
      title: 'Qualy | AI-First Inbox for WhatsApp, Instagram, and Telegram',
      description:
        'Automate repetitive chats, qualify leads with AI scoring, and hand over high-intent conversations at the right moment.',
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
  },
  tr: {
    home: {
      title: 'Qualy | WhatsApp, Instagram ve Telegram için AI Gelen Kutusu',
      description:
        'Tekrarlayan konuşmaları otomatikleştirin, AI skorlama ile adayları nitelendirin ve yüksek niyetli konuşmaları doğru anda devralın.',
    },
    legalIndex: {
      title: 'Yasal Merkez | Qualy',
      description:
        'Qualy yasal dokümanlarına tek sayfadan erişin; Hizmet Şartları ve Gizlilik Politikası sürüm bilgilerini görüntüleyin.',
    },
    terms: {
      title: 'Hizmet Şartları | Qualy',
      description: 'Qualy platform kullanımını düzenleyen Hizmet Şartları, sorumluluklar ve hukuki koşulları inceleyin.',
    },
    privacy: {
      title: 'Gizlilik Politikası | Qualy',
      description: 'Qualy’nin kişisel verileri nasıl topladığını, kullandığını, sakladığını ve koruduğunu inceleyin.',
    },
  },
};

const ROUTE_PATHS: Record<SeoRouteKey, string> = {
  home: '/',
  legalIndex: '/legal',
  terms: '/terms',
  privacy: '/privacy',
};

const OG_IMAGE_PATH = '/og/qualy-default.png';
const DEFAULT_ROBOTS = 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1';

export const normalizeRoutePath = (path: string) => {
  const cleaned = (path || '/').replace(/\/+$/, '');
  return cleaned === '' ? '/' : cleaned;
};

export const getSeoRouteKeyByPath = (path: string): SeoRouteKey => {
  const normalized = normalizeRoutePath(path);
  if (normalized === '/legal') return 'legalIndex';
  if (normalized === '/terms') return 'terms';
  if (normalized === '/privacy') return 'privacy';
  return 'home';
};

const toOgLocale = (language: SeoLanguage) => (language === 'tr' ? 'tr_TR' : 'en_US');

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
  const canonicalPath = ROUTE_PATHS[routeKey];
  const canonicalUrl = resolveAbsoluteUrl(siteUrl, canonicalPath);
  const ogImage = resolveAbsoluteUrl(siteUrl, OG_IMAGE_PATH);

  const basePayload: Omit<SeoPayload, 'jsonLd'> = {
    routeKey,
    title: copy.title,
    description: copy.description,
    robots: DEFAULT_ROBOTS,
    canonicalUrl,
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

