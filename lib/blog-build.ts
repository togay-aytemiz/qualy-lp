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

type SanityBlogPost = {
  _id?: string;
  title?: string;
  slug?: {
    current?: string;
  } | string;
  excerpt?: string;
  bodyMarkdown?: string;
  seoTitle?: string;
  seoDescription?: string;
  publishedAt?: string;
  language?: BlogLocale;
  locale?: BlogLocale;
  coverImageUrl?: string;
};

type SanityQueryResponse = {
  result?: SanityBlogPost[];
};

const DEFAULT_SITE_NAME = 'Qualy';
const DEFAULT_IMAGE_PATH_BY_LOCALE: Record<BlogLocale, string> = {
  tr: '/og/qualy-og-tr.png',
  en: '/og/qualy-og-en.png',
};
const DEFAULT_BLOG_ROBOTS = 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1';

const normalizeText = (value: unknown) => String(value ?? '').trim();

const toLocale = (value: unknown): BlogLocale => (value === 'tr' ? 'tr' : 'en');

const toBlogSummary = (post: SanityBlogPost): BlogPostSummary => {
  const slug = normalizeText(typeof post.slug === 'string' ? post.slug : post.slug?.current || '');
  const title = normalizeText(post.title || '');
  const excerpt = normalizeText(post.excerpt || '');
  const publishedAt = normalizeText(post.publishedAt || '');
  const locale = toLocale(post.language || post.locale);

  if (!slug || !title || !publishedAt) {
    throw new Error('Invalid Sanity blog post payload.');
  }

  return {
    slug,
    title,
    excerpt,
    publishedAt,
    locale,
  };
};

export const normalizeSanityBlogResponse = (input: SanityQueryResponse): BlogPostRecord[] => {
  const posts = Array.isArray(input.result) ? input.result : [];

  return posts.map((post) => {
    const summary = toBlogSummary(post);

    return {
      ...summary,
      content: normalizeText(post.bodyMarkdown || ''),
      seoTitle: normalizeText(post.seoTitle || '') || undefined,
      seoDescription: normalizeText(post.seoDescription || '') || undefined,
      coverImage: normalizeText(post.coverImageUrl || '') || null,
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
  const imageUrl = post.coverImage
    ? resolveAbsoluteUrl(siteUrl, post.coverImage)
    : resolveAbsoluteUrl(siteUrl, DEFAULT_IMAGE_PATH_BY_LOCALE[post.locale]);

  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    canonicalUrl,
    robots: DEFAULT_BLOG_ROBOTS,
    siteName: DEFAULT_SITE_NAME,
    locale: post.locale,
    image: imageUrl,
    jsonLd: buildBlogJsonLd({
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      canonicalUrl,
      robots: DEFAULT_BLOG_ROBOTS,
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
