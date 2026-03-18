import type { SeoLanguage } from './seo';

export type BlogLocale = SeoLanguage;

export type BlogSlug = string;

export type BlogPostSummary = {
  slug: BlogSlug;
  title: string;
  excerpt: string;
  publishedAt: string;
  locale: BlogLocale;
};

export type BlogPostRecord = BlogPostSummary & {
  content: string;
  seoTitle?: string;
  seoDescription?: string;
  coverImage?: string | null;
  canonicalPath?: string;
};

export type BlogManifest = {
  generatedAt: string;
  posts: BlogPostSummary[];
};

export type BlogSeo = {
  title: string;
  description: string;
  canonicalUrl: string;
  robots: 'noindex,follow';
  siteName: string;
  locale: BlogLocale;
  image?: string;
  jsonLd: Record<string, unknown>[];
};

export const BLOG_INDEX_PATHS: Record<BlogLocale, string> = {
  tr: '/blog',
  en: '/en/blog',
};

export const getBlogIndexPath = (locale: BlogLocale) => BLOG_INDEX_PATHS[locale];

export const getBlogPostPath = (slug: BlogSlug, locale: BlogLocale) => {
  const cleanSlug = String(slug || '').trim().replace(/^\/+|\/+$/g, '');
  const prefix = locale === 'en' ? '/en/blog' : '/blog';
  return `${prefix}/${cleanSlug}`;
};

