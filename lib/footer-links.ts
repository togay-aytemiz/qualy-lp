export type ProductFooterLinkKey = 'features' | 'pricing' | 'leadScoring' | 'updates';

const PRODUCT_SECTION_MAP: Record<ProductFooterLinkKey, string> = {
  features: 'features',
  pricing: 'pricing',
  leadScoring: 'testimonials',
  updates: 'how-it-works',
};

export const getProductFooterSectionId = (key: ProductFooterLinkKey) => PRODUCT_SECTION_MAP[key];

export const buildHomeSectionHref = (sectionId: string) => `/#${sectionId}`;

export const isHomePath = (pathname: string) => pathname === '' || pathname === '/';
