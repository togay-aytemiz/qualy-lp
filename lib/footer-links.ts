export type ProductFooterSectionKey = 'features' | 'faq' | 'leadScoring' | 'updates';
export type FooterLanguage = 'en' | 'tr';

type LocalizedRouteEntry = {
  path: string;
  locale: FooterLanguage;
  localizations?: Array<{
    locale: FooterLanguage;
    path: string;
  }>;
};

const PRODUCT_SECTION_MAP: Record<ProductFooterSectionKey, string> = {
  features: 'features',
  faq: 'faq',
  leadScoring: 'testimonials',
  updates: 'how-it-works',
};

export const PRICING_PAGE_HREF = '/pricing';
const BLOG_MANIFEST_PATH = '/blog_manifest.json';
const STATIC_LOCALIZED_PATHS: Record<string, Record<FooterLanguage, string>> = {
  '/': { tr: '/', en: '/en' },
  '/en': { tr: '/', en: '/en' },
  '/blog': { tr: '/blog', en: '/en/blog' },
  '/en/blog': { tr: '/blog', en: '/en/blog' },
  '/pricing': { tr: '/pricing', en: '/en/pricing' },
  '/en/pricing': { tr: '/pricing', en: '/en/pricing' },
  '/about': { tr: '/about', en: '/en/about' },
  '/en/about': { tr: '/about', en: '/en/about' },
  '/data-deletion': { tr: '/data-deletion', en: '/en/data-deletion' },
  '/en/data-deletion': { tr: '/data-deletion', en: '/en/data-deletion' },
  '/legal': { tr: '/legal', en: '/en/legal' },
  '/en/legal': { tr: '/legal', en: '/en/legal' },
  '/terms': { tr: '/terms', en: '/en/terms' },
  '/en/terms': { tr: '/terms', en: '/en/terms' },
  '/privacy': { tr: '/privacy', en: '/en/privacy' },
  '/en/privacy': { tr: '/privacy', en: '/en/privacy' },
  '/kvkk': { tr: '/kvkk', en: '/en/kvkk' },
  '/en/kvkk': { tr: '/kvkk', en: '/en/kvkk' },
  '/pre-information': { tr: '/pre-information', en: '/en/pre-information' },
  '/en/pre-information': { tr: '/pre-information', en: '/en/pre-information' },
  '/distance-sales-agreement': { tr: '/distance-sales-agreement', en: '/en/distance-sales-agreement' },
  '/en/distance-sales-agreement': { tr: '/distance-sales-agreement', en: '/en/distance-sales-agreement' },
  '/cancellation-refund': { tr: '/cancellation-refund', en: '/en/cancellation-refund' },
  '/en/cancellation-refund': { tr: '/cancellation-refund', en: '/en/cancellation-refund' },
  '/subscription-trial': { tr: '/subscription-trial', en: '/en/subscription-trial' },
  '/en/subscription-trial': { tr: '/subscription-trial', en: '/en/subscription-trial' },
};

export const getProductFooterSectionId = (key: ProductFooterSectionKey) => PRODUCT_SECTION_MAP[key];

const normalizePathname = (pathname: string) => {
  const cleaned = pathname.replace(/\/+$/, '');
  return cleaned === '' ? '/' : cleaned;
};

const isBlogPath = (pathname: string) => {
  const normalized = normalizePathname(pathname);
  return normalized === '/blog' || normalized === '/en/blog' || normalized.startsWith('/blog/') || normalized.startsWith('/en/blog/');
};

const getFallbackBlogPath = (pathname: string, language: FooterLanguage) => {
  const normalized = normalizePathname(pathname);
  if (language === 'en' && normalized.startsWith('/blog/')) {
    return `/en${normalized}`;
  }

  if (language === 'tr' && normalized.startsWith('/en/blog/')) {
    const strippedPath = normalized.slice(3);
    return strippedPath === '' ? '/blog' : strippedPath;
  }

  return language === 'en' ? '/en/blog' : '/blog';
};

export const buildHomeSectionHref = (sectionId: string, homePath = '/') => `${homePath}#${sectionId}`;

export const isHomePath = (pathname: string) => {
  const normalized = normalizePathname(pathname);
  return normalized === '/' || normalized === '/en';
};

export const getLocalizedPathname = (
  pathname: string,
  language: FooterLanguage,
  blogPosts: LocalizedRouteEntry[] = [],
) => {
  const normalized = normalizePathname(pathname);
  const staticLocalizedPath = STATIC_LOCALIZED_PATHS[normalized];

  if (staticLocalizedPath) {
    return staticLocalizedPath[language];
  }

  if (!isBlogPath(normalized)) {
    return normalized;
  }

  const matchingPost = blogPosts.find((post) => normalizePathname(post.path) === normalized);
  if (matchingPost) {
    if (matchingPost.locale === language) {
      return normalizePathname(matchingPost.path);
    }

    const localizedEntry = matchingPost.localizations?.find((entry) => entry.locale === language);
    if (localizedEntry?.path) {
      return normalizePathname(localizedEntry.path);
    }
  }

  return getFallbackBlogPath(normalized, language);
};

type FooterFetch = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

async function loadBlogLocalizationEntries(fetcher: FooterFetch) {
  const response = await fetcher(BLOG_MANIFEST_PATH, { headers: { Accept: 'application/json' } });

  if (!response.ok) {
    return [];
  }

  const manifest = await response.json();
  return Array.isArray(manifest?.posts) ? (manifest.posts as LocalizedRouteEntry[]) : [];
}

export const resolveLocalizedPathname = async (
  pathname: string,
  language: FooterLanguage,
  fetcher?: FooterFetch,
) => {
  if (!fetcher || !isBlogPath(pathname)) {
    return getLocalizedPathname(pathname, language);
  }

  try {
    const blogPosts = await loadBlogLocalizationEntries(fetcher);
    return getLocalizedPathname(pathname, language, blogPosts);
  } catch {
    return getLocalizedPathname(pathname, language);
  }
};
