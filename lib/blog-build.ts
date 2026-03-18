import { getSiteUrl, resolveAbsoluteUrl } from './site-url';
import {
  BLOG_INDEX_PATHS,
  getBlogPostPath,
  type BlogLocale,
  type BlogManifest,
  type BlogPostRecord,
  type BlogPostSummary,
  type BlogSeo,
} from './blog';

type StrapiBlogPost = {
  id?: number | string;
  attributes?: {
    title?: string;
    slug?: string;
    excerpt?: string;
    content?: string;
    seoTitle?: string;
    seoDescription?: string;
    publishedAt?: string;
    locale?: BlogLocale;
    coverImage?: {
      data?: {
        attributes?: {
          url?: string;
        };
      } | null;
    } | null;
    localizations?: {
      data?: Array<{
        id?: number | string;
        attributes?: {
          slug?: string;
          locale?: BlogLocale;
        };
      }>;
    } | null;
  };
};

type StrapiResponse = {
  data?: StrapiBlogPost[];
};

const DEFAULT_SITE_NAME = 'Qualy';
const DEFAULT_IMAGE_PATH = '/og/qualy-default.png';

const normalizeText = (value: unknown) => String(value ?? '').trim();

const toLocale = (value: unknown): BlogLocale => (value === 'tr' ? 'tr' : 'en');

const toBlogSummary = (post: StrapiBlogPost): BlogPostSummary => {
  const attributes = post.attributes ?? {};
  const slug = normalizeText(attributes.slug || '');
  const title = normalizeText(attributes.title || '');
  const excerpt = normalizeText(attributes.excerpt || '');
  const publishedAt = normalizeText(attributes.publishedAt || '');
  const locale = toLocale(attributes.locale);

  if (!slug || !title || !publishedAt) {
    throw new Error('Invalid Strapi blog post payload.');
  }

  return {
    slug,
    title,
    excerpt,
    publishedAt,
    locale,
  };
};

export const normalizeStrapiBlogResponse = (input: StrapiResponse): BlogPostRecord[] => {
  const posts = Array.isArray(input.data) ? input.data : [];

  return posts.map((post) => {
    const attributes = post.attributes ?? {};
    const summary = toBlogSummary(post);

    return {
      ...summary,
      content: normalizeText(attributes.content || ''),
      seoTitle: normalizeText(attributes.seoTitle || '') || undefined,
      seoDescription: normalizeText(attributes.seoDescription || '') || undefined,
      coverImage: attributes.coverImage?.data?.attributes?.url || null,
      canonicalPath: getBlogPostPath(summary.slug, summary.locale),
    };
  });
};

export const groupLocalizedPosts = (posts: BlogPostRecord[]) => {
  return posts.reduce<Record<string, Partial<Record<BlogLocale, BlogPostRecord>>>>((acc, post) => {
    const current = acc[post.slug] ?? {};
    if (current[post.locale]) {
      throw new Error(`Duplicate blog slug for locale "${post.locale}": ${post.slug}`);
    }
    current[post.locale] = post;
    acc[post.slug] = current;
    return acc;
  }, {});
};

export const buildBlogManifest = (posts: BlogPostRecord[]): BlogManifest => ({
  generatedAt: new Date().toISOString(),
  posts: posts
    .slice()
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .map(({ content: _content, seoTitle: _seoTitle, seoDescription: _seoDescription, coverImage: _coverImage, canonicalPath: _canonicalPath, ...summary }) => summary),
});

const buildBlogJsonLd = (seo: BlogSeo, siteUrl: string) => [
  {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: seo.title,
    description: seo.description,
    url: seo.canonicalUrl,
    inLanguage: seo.locale,
    isPartOf: {
      '@type': 'WebSite',
      name: seo.siteName,
      url: siteUrl,
    },
  },
];

export const getBlogPostSeo = (post: BlogPostRecord, options: { siteUrl?: string } = {}): BlogSeo => {
  const siteUrl = options.siteUrl ? options.siteUrl : getSiteUrl();
  const canonicalPath = post.canonicalPath || getBlogPostPath(post.slug, post.locale);
  const canonicalUrl = resolveAbsoluteUrl(siteUrl, canonicalPath);
  const imageUrl = post.coverImage ? resolveAbsoluteUrl(siteUrl, post.coverImage) : resolveAbsoluteUrl(siteUrl, DEFAULT_IMAGE_PATH);

  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    canonicalUrl,
    robots: 'noindex,follow',
    siteName: DEFAULT_SITE_NAME,
    locale: post.locale,
    image: imageUrl,
    jsonLd: buildBlogJsonLd({
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      canonicalUrl,
      robots: 'noindex,follow',
      siteName: DEFAULT_SITE_NAME,
      locale: post.locale,
      image: imageUrl,
      jsonLd: [],
    }, siteUrl),
  };
};

export const renderBlogEntryHtml = (
  seo: BlogSeo,
  bodyContent = '<div id="root"></div>',
) => {
  const jsonLd = seo.jsonLd.length > 1 ? { '@context': 'https://schema.org', '@graph': seo.jsonLd } : seo.jsonLd[0] ?? {};
  const alternateTr = resolveAbsoluteUrl(getSiteUrl(), BLOG_INDEX_PATHS.tr);
  const alternateEn = resolveAbsoluteUrl(getSiteUrl(), BLOG_INDEX_PATHS.en);

  return [
    '<!DOCTYPE html>',
    '<html lang="' + seo.locale + '" class="scroll-smooth">',
    '<head>',
    '  <meta charset="UTF-8" />',
    '  <meta name="viewport" content="width=device-width, initial-scale=1.0" />',
    '  <title>' + seo.title + '</title>',
    '  <meta name="description" content="' + seo.description + '" />',
    '  <meta name="robots" content="' + seo.robots + '" />',
    '  <meta name="theme-color" content="#0f172a" />',
    '  <link rel="canonical" href="' + seo.canonicalUrl + '" />',
    '  <link rel="alternate" hreflang="tr" href="' + alternateTr + '" />',
    '  <link rel="alternate" hreflang="en" href="' + alternateEn + '" />',
    '  <link rel="alternate" hreflang="x-default" href="' + alternateTr + '" />',
    '  <meta property="og:type" content="website" />',
    '  <meta property="og:site_name" content="' + seo.siteName + '" />',
    '  <meta property="og:title" content="' + seo.title + '" />',
    '  <meta property="og:description" content="' + seo.description + '" />',
    '  <meta property="og:image" content="' + seo.image + '" />',
    '  <meta property="og:url" content="' + seo.canonicalUrl + '" />',
    '  <meta property="og:locale" content="' + (seo.locale === 'tr' ? 'tr_TR' : 'en_US') + '" />',
    '  <meta name="twitter:card" content="summary_large_image" />',
    '  <meta name="twitter:title" content="' + seo.title + '" />',
    '  <meta name="twitter:description" content="' + seo.description + '" />',
    '  <meta name="twitter:image" content="' + seo.image + '" />',
    '  <link rel="icon" href="/icon-black.svg" sizes="any" type="image/svg+xml" />',
    '  <link rel="shortcut icon" href="/icon-black.svg" type="image/svg+xml" />',
    '  <link rel="apple-touch-icon" href="/icon-black.svg" />',
    '  <link rel="stylesheet" href="/index.css" />',
    '  <script type="application/ld+json">' + JSON.stringify(jsonLd) + '</script>',
    '</head>',
    '<body class="bg-white text-slate-900">',
    bodyContent,
    '</body>',
    '</html>',
    '',
  ].join('\n');
};
