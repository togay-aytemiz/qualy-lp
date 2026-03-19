export type BlogLocale = 'en' | 'tr';

export type BlogCategory = {
  slug: string;
  label: string;
};

export type BlogLocalization = {
  id?: string | null;
  locale: BlogLocale;
  slug: string;
  path: string;
  canonicalUrl: string;
  sharedAcrossLocales?: boolean;
};

export type BlogPostSummary = {
  id?: string;
  translationKey?: string;
  slug: string;
  title: string;
  excerpt?: string;
  publishedAt?: string;
  path?: string;
  canonicalUrl?: string;
  locale?: BlogLocale;
  seoTitle?: string;
  seoDescription?: string;
  coverImage?: string | null;
  category?: BlogCategory | null;
  contentHtml?: string;
  sharedAcrossLocales?: boolean;
  localizations?: BlogLocalization[];
};

export type BlogPostRecord = BlogPostSummary & {
  content?: string;
};

export type BlogIndexBootstrapData = {
  route: 'index';
  path: string;
  language: BlogLocale;
  posts: BlogPostSummary[];
};

export type BlogPostBootstrapData = {
  route: 'post';
  path: string;
  language: BlogLocale;
  slug: string;
  post: BlogPostRecord | null;
};

export type BlogBootstrapData = BlogIndexBootstrapData | BlogPostBootstrapData;

export const BLOG_BOOTSTRAP_ELEMENT_ID = '__BLOG_BOOTSTRAP__';

export const normalizeBlogClientPath = (value: string) => {
  const cleaned = String(value || '/').trim().replace(/\/+$/, '');
  return cleaned === '' ? '/' : cleaned;
};

const isBlogLocale = (value: unknown): value is BlogLocale => value === 'tr' || value === 'en';

export const isBlogBootstrapData = (value: unknown): value is BlogBootstrapData => {
  if (!value || typeof value !== 'object') return false;

  const entry = value as Partial<BlogBootstrapData>;
  if (!isBlogLocale(entry.language) || typeof entry.path !== 'string') {
    return false;
  }

  if (entry.route === 'index') {
    return Array.isArray(entry.posts);
  }

  if (entry.route === 'post') {
    return typeof entry.slug === 'string' && 'post' in entry;
  }

  return false;
};

export const readBlogBootstrapData = (documentRef: Document): BlogBootstrapData | null => {
  const element = documentRef.getElementById(BLOG_BOOTSTRAP_ELEMENT_ID);
  if (!element?.textContent) return null;

  try {
    const parsed = JSON.parse(element.textContent) as unknown;
    return isBlogBootstrapData(parsed) ? parsed : null;
  } catch {
    return null;
  }
};
