export type ProductFooterSectionKey = 'features' | 'faq' | 'leadScoring' | 'updates';

const PRODUCT_SECTION_MAP: Record<ProductFooterSectionKey, string> = {
  features: 'features',
  faq: 'faq',
  leadScoring: 'testimonials',
  updates: 'how-it-works',
};

export const PRICING_PAGE_HREF = '/pricing';

export const getProductFooterSectionId = (key: ProductFooterSectionKey) => PRODUCT_SECTION_MAP[key];

const normalizePathname = (pathname: string) => {
  const cleaned = pathname.replace(/\/+$/, '');
  return cleaned === '' ? '/' : cleaned;
};

export const buildHomeSectionHref = (sectionId: string, homePath = '/') => `${homePath}#${sectionId}`;

export const isHomePath = (pathname: string) => {
  const normalized = normalizePathname(pathname);
  return normalized === '/' || normalized === '/en';
};
