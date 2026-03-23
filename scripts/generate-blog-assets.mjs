import { existsSync, readFileSync, promises as fs } from 'node:fs';
import path from 'node:path';
import { marked } from 'marked';
import { createServer } from 'vite';

const ROOT = process.cwd();
loadEnvironmentFiles();

const PUBLIC_DIR = path.join(ROOT, 'public');
const MANIFEST_PATH = path.join(PUBLIC_DIR, 'blog_manifest.json');
const POSTS_DIR = path.join(PUBLIC_DIR, 'blog-posts');
const BLOG_CACHE_DIR = path.join(ROOT, 'data', 'blog-cache');
const BLOG_CACHE_MANIFEST_PATH = path.join(BLOG_CACHE_DIR, 'blog_manifest.json');
const SITE_URL = normalizeBaseUrl(process.env.VITE_SITE_URL || 'https://www.askqualy.com');
const BLOG_BOOTSTRAP_ELEMENT_ID = '__BLOG_BOOTSTRAP__';
const CRAWLABLE_ROBOTS = 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1';
const NON_CRAWLABLE_ROBOTS = 'noindex,follow';

const INDEX_COPY = {
  tr: {
    title: 'Blog | Qualy',
    description: 'Qualy hakkinda guncellemeler, kullanici hikayeleri ve urun notlari.',
    image: '/og/qualy-og-tr.png',
    locale: 'tr_TR',
  },
  en: {
    title: 'Blog | Qualy',
    description: 'Updates, product notes, and customer stories from Qualy.',
    image: '/og/qualy-og-en.png',
    locale: 'en_US',
  },
};

const BLOG_LOCALES = ['tr', 'en'];
const FETCH_RETRY_DELAYS_MS = [0, 2000, 5000, 10000, 15000];
const FETCH_TIMEOUT_MS = 8000;
const DEFAULT_SANITY_API_VERSION = '2026-03-01';
const DEFAULT_SANITY_DOC_TYPE = 'post';
const BLOG_CATEGORY_LABELS = {
  'ultimate-guide': {
    tr: 'Kapsamlı Rehber',
    en: 'Ultimate Guide',
  },
  'how-to-article': {
    tr: 'Nasıl Yapılır',
    en: 'How To Article',
  },
  'practical-guide': {
    tr: 'Pratik Rehber',
    en: 'Practical Guide',
  },
  concepts: {
    tr: 'Kavramlar',
    en: 'Concepts',
  },
  'measurement-analytics': {
    tr: 'Ölçüm ve Analiz',
    en: 'Measurement and Analytics',
  },
  'sales-automation': {
    tr: 'Satış Otomasyonu',
    en: 'Sales Automation',
  },
  'use-cases': {
    tr: 'Kullanım Senaryoları',
    en: 'Use Cases',
  },
  'case-study': {
    tr: 'Vaka Analizi',
    en: 'Case Study',
  },
  comparisons: {
    tr: 'Karşılaştırmalar',
    en: 'Comparisons',
  },
  integrations: {
    tr: 'Entegrasyonlar',
    en: 'Integrations',
  },
  'platform-release': {
    tr: 'Platform Duyuruları',
    en: 'Platform Release',
  },
  'instant-messaging': {
    tr: 'Mesajlaşma',
    en: 'Instant Messaging',
  },
};
const BLOG_CATEGORY_ALIAS_MAP = {
  'ultimate-guide': 'ultimate-guide',
  'booking-conversion': 'ultimate-guide',
  'how-to-article': 'how-to-article',
  'how-to': 'how-to-article',
  'customer-stories': 'how-to-article',
  'practical-guide': 'practical-guide',
  'ai-automation': 'practical-guide',
  concepts: 'concepts',
  'lead-qualification': 'concepts',
  'measurement-analytics': 'measurement-analytics',
  'sales-automation': 'sales-automation',
  'use-cases': 'use-cases',
  'case-study': 'case-study',
  comparisons: 'comparisons',
  integrations: 'integrations',
  'platform-release': 'platform-release',
  'product-updates': 'platform-release',
  'instant-messaging': 'instant-messaging',
  'messaging-workflows': 'instant-messaging',
};

const truthy = (value) => /^(1|true|yes|on)$/i.test(String(value ?? '').trim());

function parseDotEnv(contents) {
  const parsed = {};

  for (const line of String(contents ?? '').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const equalsIndex = trimmed.indexOf('=');
    if (equalsIndex <= 0) continue;

    const key = trimmed.slice(0, equalsIndex).trim();
    let value = trimmed.slice(equalsIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    parsed[key] = value;
  }

  return parsed;
}

function loadEnvironmentFile(filePath) {
  if (!existsSync(filePath)) return;

  const parsed = parseDotEnv(readFileSync(filePath, 'utf8'));
  for (const [key, value] of Object.entries(parsed)) {
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

function loadEnvironmentFiles() {
  loadEnvironmentFile(path.join(ROOT, '.env'));
  loadEnvironmentFile(path.join(ROOT, '.env.local'));
}

function normalizeBaseUrl(value) {
  return String(value ?? '').trim().replace(/\/+$/, '');
}

function normalizeBlogLocale(value) {
  return String(value ?? '').trim().toLowerCase();
}

function isSupportedBlogLocale(locale) {
  return BLOG_LOCALES.includes(locale);
}

function getDefaultBlogLocale() {
  const configuredLocale = normalizeBlogLocale(process.env.SANITY_DEFAULT_LOCALE || 'tr');
  return isSupportedBlogLocale(configuredLocale) ? configuredLocale : 'tr';
}

function getSanityApiVersion() {
  return String(process.env.SANITY_API_VERSION || DEFAULT_SANITY_API_VERSION).trim() || DEFAULT_SANITY_API_VERSION;
}

function getSanityDocType() {
  const value = String(process.env.SANITY_BLOG_DOC_TYPE || DEFAULT_SANITY_DOC_TYPE).trim();
  const sanitized = value.replace(/[^a-zA-Z0-9_-]/g, '');
  return sanitized || DEFAULT_SANITY_DOC_TYPE;
}

function getSanityApiHost() {
  return truthy(process.env.SANITY_USE_CDN) ? 'apicdn.sanity.io' : 'api.sanity.io';
}

function resolveAbsoluteUrl(baseUrl, routePath) {
  const cleanBase = normalizeBaseUrl(baseUrl) || 'https://www.askqualy.com';
  const cleanPath = routePath.startsWith('/') ? routePath : `/${routePath}`;
  return `${cleanBase}${cleanPath}`;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function jsonString(value) {
  return `${JSON.stringify(value, null, 2).replace(/</g, '\\u003c')}\n`;
}

function serializeInlineJson(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

async function writeJson(filePath, value) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, jsonString(value), 'utf8');
}

async function writeText(filePath, value) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, value, 'utf8');
}

async function cleanGeneratedBlogArtifacts() {
  await fs.rm(POSTS_DIR, { recursive: true, force: true });
  await fs.rm(path.join(ROOT, 'blog'), { recursive: true, force: true });
  await fs.rm(path.join(ROOT, 'en', 'blog'), { recursive: true, force: true });
}

function getBlogIndexPath(locale) {
  return locale === 'en' ? '/en/blog' : '/blog';
}

function getBlogPostPath(locale, slug) {
  return `${getBlogIndexPath(locale)}/${slug}`;
}

function sortPostsByDate(posts) {
  return posts
    .slice()
    .sort((left, right) => String(right.publishedAt ?? '').localeCompare(String(left.publishedAt ?? '')));
}

function getAlternatesFromPaths(siteUrl, trPath, enPath) {
  return [
    { hrefLang: 'tr', href: resolveAbsoluteUrl(siteUrl, trPath) },
    { hrefLang: 'en', href: resolveAbsoluteUrl(siteUrl, enPath) },
    { hrefLang: 'x-default', href: resolveAbsoluteUrl(siteUrl, trPath) },
  ];
}

function renderJsonLd(jsonLd) {
  return `<script type="application/ld+json">${JSON.stringify(jsonLd, null, 2).replace(/</g, '\\u003c')}</script>`;
}

function renderEntryHtml({
  lang,
  title,
  description,
  canonicalUrl,
  robots,
  ogImage,
  ogLocale,
  alternates,
  jsonLd,
  appHtml = '',
  bootstrapData = null,
}) {
  const alternateLinks = alternates
    .map((alternate) => `  <link rel="alternate" hreflang="${alternate.hrefLang}" href="${alternate.href}" />`)
    .join('\n');
  const bootstrapScript = bootstrapData
    ? `  <script id="${BLOG_BOOTSTRAP_ELEMENT_ID}" type="application/json">${serializeInlineJson(bootstrapData)}</script>`
    : '';

  return `<!DOCTYPE html>
<html lang="${lang}" class="scroll-smooth">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <meta name="author" content="Qualy" />
  <meta name="robots" content="${robots}" />
  <meta name="theme-color" content="#0f172a" />
  <link rel="canonical" href="${canonicalUrl}" />
${alternateLinks}

  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Qualy" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:image" content="${ogImage}" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:locale" content="${ogLocale}" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image" content="${ogImage}" />

  <link rel="icon" href="/icon-black.svg" sizes="any" type="image/svg+xml" />
  <link rel="shortcut icon" href="/icon-black.svg" type="image/svg+xml" />
  <link rel="apple-touch-icon" href="/icon-black.svg" />
  <link rel="manifest" href="/site.webmanifest" />
  ${renderJsonLd(jsonLd)}
  <link rel="stylesheet" href="/index.css" />
</head>
<body class="bg-white text-slate-900">
  <div id="root">${appHtml}</div>
${bootstrapScript}
  <script type="module" src="/index.tsx"></script>
</body>
</html>
`;
}

function dedentSharedMarkdownIndentation(value) {
  const lines = String(value ?? '').split('\n');
  const indentationLevels = lines
    .filter((line) => line.trim())
    .map((line) => {
      const match = line.match(/^[ \t]+/);
      if (!match) return 0;
      return match[0].replace(/\t/g, '  ').length;
    })
    .filter((indentation) => indentation > 0);

  if (indentationLevels.length === 0) {
    return String(value ?? '');
  }

  const sharedIndentation = Math.min(...indentationLevels);
  if (sharedIndentation < 2) {
    return String(value ?? '');
  }

  return lines
    .map((line) => {
      if (!line.trim()) {
        return '';
      }

      let remaining = sharedIndentation;
      let index = 0;
      while (remaining > 0 && index < line.length) {
        if (line[index] === '\t') {
          remaining -= 2;
        } else if (line[index] === ' ') {
          remaining -= 1;
        } else {
          break;
        }
        index += 1;
      }

      return line.slice(index);
    })
    .join('\n');
}

function stripOuterMarkdownFence(value) {
  let normalized = String(value ?? '').trim();

  while (true) {
    let changed = false;
    const match = normalized.match(/^\s*```(?:markdown|md)?\s*\n([\s\S]*?)\n?```\s*$/i);
    if (match) {
      normalized = String(match[1] ?? '').trim();
      changed = true;
    }

    const lines = normalized.replace(/\r\n/g, '\n').split('\n');
    const firstContentIndex = lines.findIndex((line) => line.trim().length > 0);
    if (firstContentIndex >= 0 && /^```(?:markdown|md)?\s*$/i.test(lines[firstContentIndex].trim())) {
      lines.splice(firstContentIndex, 1);
      normalized = lines.join('\n').trim();
      changed = true;
    }

    const trailingLines = normalized.replace(/\r\n/g, '\n').split('\n');
    for (let index = trailingLines.length - 1; index >= 0; index -= 1) {
      const line = trailingLines[index].trim();
      if (!line) continue;
      if (/^```\s*$/.test(line)) {
        trailingLines.splice(index, 1);
        normalized = trailingLines.join('\n').trim();
        changed = true;
      }
      break;
    }

    if (!changed) {
      return normalized;
    }
  }
}

function normalizeMarkdownForRender(markdown) {
  return dedentSharedMarkdownIndentation(stripOuterMarkdownFence(markdown))
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => {
      if (!line.trim()) {
        return '';
      }

      if (/^[ \t]+(#{1,6}\s+|[-*+]\s+|\d+\.\s+|>\s+)/.test(line)) {
        return line.trimStart();
      }

      return line;
    })
    .join('\n')
    .trim();
}

function renderMarkdownToHtml(markdown) {
  const source = normalizeMarkdownForRender(markdown);
  if (!source) return '';
  return marked.parse(source);
}

let prerenderRendererPromise = null;

async function loadBlogPrerenderRenderer() {
  if (!prerenderRendererPromise) {
    prerenderRendererPromise = (async () => {
      const vite = await createServer({
        appType: 'custom',
        logLevel: 'error',
        server: {
          middlewareMode: true,
        },
      });

      try {
        const module = await vite.ssrLoadModule('/lib/blog-prerender.tsx');
        return {
          vite,
          renderBlogRouteApp: module.renderBlogRouteApp,
        };
      } catch (error) {
        await vite.close();
        throw error;
      }
    })();
  }

  return prerenderRendererPromise;
}

async function closeBlogPrerenderRenderer() {
  if (!prerenderRendererPromise) return;

  const { vite } = await prerenderRendererPromise;
  prerenderRendererPromise = null;
  await vite.close();
}

async function renderBlogRouteAppHtml(bootstrapData) {
  const renderer = await loadBlogPrerenderRenderer();
  return renderer.renderBlogRouteApp(bootstrapData);
}

function normalizeCategory(value, locale) {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const normalizedLocale = isSupportedBlogLocale(normalizeBlogLocale(locale)) ? normalizeBlogLocale(locale) : getDefaultBlogLocale();
  const normalizeCategoryKey = (entry) =>
    String(entry ?? '')
      .trim()
      .toLowerCase()
      .replace(/&/g, ' and ')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  const slugCandidate = normalizeCategoryKey(value.slug?.current ?? value.slug);
  const labelTr = String(value.labelTr ?? value.titleTr ?? value.title?.tr ?? '').trim();
  const labelEn = String(value.labelEn ?? value.titleEn ?? value.title?.en ?? '').trim();
  const fallbackLabel = String(value.label ?? value.title ?? value.name ?? '').trim();
  const labelCandidate = normalizeCategoryKey(fallbackLabel || labelEn || labelTr);
  const resolvedSlug = BLOG_CATEGORY_ALIAS_MAP[slugCandidate] || BLOG_CATEGORY_ALIAS_MAP[labelCandidate] || slugCandidate || labelCandidate;
  const labelSet = BLOG_CATEGORY_LABELS[resolvedSlug];

  if (!resolvedSlug && !fallbackLabel && !labelEn && !labelTr) {
    return null;
  }

  return {
    slug: labelSet ? resolvedSlug : resolvedSlug || 'practical-guide',
    label: labelSet ? labelSet[normalizedLocale] : fallbackLabel || (normalizedLocale === 'en' ? 'Practical Guide' : 'Pratik Rehber'),
  };
}

function normalizeCoverImage(value) {
  if (!value) return null;

  if (typeof value === 'string') {
    const url = value.trim();
    if (!url) return null;
    return {
      url: url.startsWith('http') ? url : resolveAbsoluteUrl(SITE_URL, url),
      alt: '',
    };
  }

  if (typeof value !== 'object') {
    return null;
  }

  const url = String(value.url ?? value.asset?.url ?? '').trim();
  const alt = String(value.alt ?? value.alternativeText ?? '').trim();

  if (!url) return null;

  return {
    url: url.startsWith('http') ? url : resolveAbsoluteUrl(SITE_URL, url),
    alt,
  };
}

function normalizeSanityPost(item) {
  const slug = String(item?.slug?.current ?? item?.slug ?? '').trim();
  const title = String(item?.title ?? '').trim();
  const locale = normalizeBlogLocale(item?.language ?? item?.locale) || getDefaultBlogLocale();
  const publishedAt = String(item?.publishedAt ?? item?._updatedAt ?? '').trim();

  if (!slug || !title || !publishedAt || !isSupportedBlogLocale(locale)) {
    return null;
  }

  const translationKey = String(item?.translationKey ?? item?.translationGroup ?? item?.documentId ?? item?._id ?? `${locale}:${slug}`).trim();
  const bodyMarkdown = normalizeMarkdownForRender(String(item?.bodyMarkdown ?? item?.contentMarkdown ?? item?.body ?? ''));
  const bodyHtml = String(item?.bodyHtml ?? item?.contentHtml ?? '').trim();
  const isWrappedMarkdownHtml = /^<pre>\s*<code[^>]*language-markdown/i.test(bodyHtml);
  const path = getBlogPostPath(locale, slug);

  return {
    id: String(item?._id ?? item?.id ?? `${translationKey}:${locale}`),
    translationKey,
    locale,
    slug,
    title,
    excerpt: String(item?.excerpt ?? '').trim(),
    content: bodyMarkdown,
    contentHtml: (isWrappedMarkdownHtml ? '' : bodyHtml) || renderMarkdownToHtml(bodyMarkdown),
    seoTitle: String(item?.seoTitle ?? title).trim(),
    seoDescription: String(item?.seoDescription ?? item?.excerpt ?? '').trim(),
    publishedAt,
    coverImage: normalizeCoverImage(item?.coverImage ?? item?.mainImage ?? item?.image),
    category: normalizeCategory(item?.category, locale),
    path,
    canonicalUrl: resolveAbsoluteUrl(SITE_URL, path),
    sharedAcrossLocales: false,
    localizations: [],
  };
}

function buildLocalizationEntry(post) {
  return {
    id: post.id,
    locale: post.locale,
    slug: post.slug,
    path: post.path,
    canonicalUrl: post.canonicalUrl,
    sharedAcrossLocales: false,
  };
}

function groupLocalizedPosts(posts) {
  const groupsByKey = new Map();

  for (const post of posts) {
    const key = String(post.translationKey || `${post.locale}:${post.slug}`);
    const group = groupsByKey.get(key) ?? [];
    group.push(post);
    groupsByKey.set(key, group);
  }

  return Array.from(groupsByKey.entries())
    .map(([key, groupPosts]) => ({
      key,
      posts: groupPosts.sort((left, right) => left.locale.localeCompare(right.locale, 'en') || left.slug.localeCompare(right.slug, 'en')),
    }))
    .sort((left, right) => {
      const leftDate = left.posts[0]?.publishedAt ?? '';
      const rightDate = right.posts[0]?.publishedAt ?? '';
      return String(rightDate).localeCompare(String(leftDate));
    });
}

function hydrateLocalizedPosts(posts) {
  return sortPostsByDate(
    groupLocalizedPosts(posts).flatMap((group) =>
      group.posts.map((post) => ({
        ...post,
        localizations: group.posts.filter((entry) => entry.id !== post.id).map(buildLocalizationEntry),
      }))
    )
  );
}

function normalizeSanityBlogResponse(payload) {
  const result = Array.isArray(payload?.result) ? payload.result : Array.isArray(payload?.data) ? payload.data : [];
  return hydrateLocalizedPosts(result.map(normalizeSanityPost).filter(Boolean));
}

function buildBlogPostManifestEntry(post) {
  return {
    id: post.id,
    translationKey: post.translationKey,
    locale: post.locale,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    publishedAt: post.publishedAt,
    path: post.path,
    canonicalUrl: post.canonicalUrl,
    seoTitle: post.seoTitle,
    seoDescription: post.seoDescription,
    coverImage: post.coverImage?.url ?? null,
    category: post.category ?? null,
    contentHtml: post.contentHtml ?? '',
    sharedAcrossLocales: false,
    localizations: (post.localizations ?? []).map((localization) => ({
      id: localization.id ?? null,
      locale: localization.locale,
      slug: localization.slug,
      path: localization.path,
      canonicalUrl: localization.canonicalUrl,
      sharedAcrossLocales: false,
    })),
  };
}

function buildBlogIndexBootstrapData(locale, posts) {
  return {
    route: 'index',
    path: getBlogIndexPath(locale),
    language: locale,
    posts: posts.map(buildBlogPostManifestEntry),
  };
}

function buildBlogPostBootstrapData(post) {
  return {
    route: 'post',
    path: post.path,
    language: post.locale,
    slug: post.slug,
    post: buildBlogPostManifestEntry(post),
  };
}

function restorePostFromCache(entry) {
  return {
    id: entry.id,
    translationKey: String(entry.translationKey ?? entry.id ?? `${entry.locale}:${entry.slug}`),
    locale: entry.locale,
    slug: entry.slug,
    title: entry.title,
    excerpt: entry.excerpt,
    content: '',
    contentHtml: entry.contentHtml ?? '',
    seoTitle: entry.seoTitle,
    seoDescription: entry.seoDescription,
    publishedAt: entry.publishedAt,
    coverImage: entry.coverImage
      ? {
          url: entry.coverImage,
          alt: '',
        }
      : null,
    category: entry.category ?? null,
    path: entry.path,
    canonicalUrl: entry.canonicalUrl,
    sharedAcrossLocales: false,
    localizations: Array.isArray(entry.localizations) ? entry.localizations : [],
  };
}

function buildBlogManifest({ enabled, posts }) {
  const indexRobots = enabled && posts.length > 0 ? CRAWLABLE_ROBOTS : NON_CRAWLABLE_ROBOTS;
  return {
    generatedAt: new Date().toISOString(),
    source: enabled ? 'sanity' : 'empty',
    enabled,
    siteUrl: SITE_URL,
    index: {
      tr: {
        path: getBlogIndexPath('tr'),
        title: INDEX_COPY.tr.title,
        description: INDEX_COPY.tr.description,
        robots: indexRobots,
      },
      en: {
        path: getBlogIndexPath('en'),
        title: INDEX_COPY.en.title,
        description: INDEX_COPY.en.description,
        robots: indexRobots,
      },
    },
    posts: posts.map(buildBlogPostManifestEntry),
    groups: groupLocalizedPosts(posts).map((group) => ({
      key: group.key,
      posts: group.posts.map(buildBlogPostManifestEntry),
    })),
  };
}

function getBlogPostSeo(post, group) {
  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt || post.title;
  const fallbackImage = post.coverImage?.url || resolveAbsoluteUrl(SITE_URL, INDEX_COPY[post.locale].image);
  const defaultAlternatePost =
    group.posts.find((item) => item.locale === 'tr') ??
    group.posts.find((item) => item.locale === getDefaultBlogLocale()) ??
    group.posts[0];
  const alternates = [
    ...group.posts.map((item) => ({
      hrefLang: item.locale,
      href: resolveAbsoluteUrl(SITE_URL, item.path),
    })),
    { hrefLang: 'x-default', href: resolveAbsoluteUrl(SITE_URL, defaultAlternatePost.path) },
  ];

  return {
    title,
    description,
    canonicalUrl: post.canonicalUrl,
    robots: CRAWLABLE_ROBOTS,
    alternates,
    og: {
      type: 'website',
      siteName: 'Qualy',
      title,
      description,
      url: post.canonicalUrl,
      image: fallbackImage,
      locale: INDEX_COPY[post.locale].locale,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      image: fallbackImage,
    },
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title,
        description,
        datePublished: post.publishedAt,
        inLanguage: post.locale,
        url: post.canonicalUrl,
        mainEntityOfPage: post.canonicalUrl,
        image: fallbackImage,
        articleSection: post.category?.label || undefined,
        publisher: {
          '@type': 'Organization',
          name: 'Qualy',
          url: SITE_URL,
          logo: resolveAbsoluteUrl(SITE_URL, '/icon-black.svg'),
        },
      },
    ],
  };
}

async function buildIndexHtml(locale, posts, { indexable = posts.length > 0 } = {}) {
  const copy = INDEX_COPY[locale];
  const path = getBlogIndexPath(locale);
  const bootstrapData = buildBlogIndexBootstrapData(locale, posts);
  const appHtml = await renderBlogRouteAppHtml(bootstrapData);
  return renderEntryHtml({
    lang: locale,
    title: copy.title,
    description: copy.description,
    canonicalUrl: resolveAbsoluteUrl(SITE_URL, path),
    robots: indexable ? CRAWLABLE_ROBOTS : NON_CRAWLABLE_ROBOTS,
    ogImage: resolveAbsoluteUrl(SITE_URL, copy.image),
    ogLocale: copy.locale,
    alternates: getAlternatesFromPaths(SITE_URL, '/blog', '/en/blog'),
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: copy.title,
        description: copy.description,
        inLanguage: locale,
        url: resolveAbsoluteUrl(SITE_URL, path),
        isPartOf: {
          '@type': 'WebSite',
          name: 'Qualy',
          url: SITE_URL,
        },
      },
    ],
    appHtml,
    bootstrapData,
  });
}

async function writeEmptyArtifacts() {
  await cleanGeneratedBlogArtifacts();
  await writeJson(MANIFEST_PATH, buildBlogManifest({ enabled: false, posts: [] }));
  await writeText(path.join(ROOT, 'blog', 'index.html'), await buildIndexHtml('tr', [], { indexable: false }));
  await writeText(path.join(ROOT, 'en', 'blog', 'index.html'), await buildIndexHtml('en', [], { indexable: false }));
}

async function writeCacheArtifacts(posts) {
  await writeJson(BLOG_CACHE_MANIFEST_PATH, buildBlogManifest({ enabled: true, posts }));
}

async function loadCachedPosts() {
  try {
    const raw = await fs.readFile(BLOG_CACHE_MANIFEST_PATH, 'utf8');
    const payload = JSON.parse(raw);
    const cachedPosts = Array.isArray(payload?.posts) ? payload.posts.map(restorePostFromCache).filter(Boolean) : [];
    return hydrateLocalizedPosts(cachedPosts);
  } catch {
    return [];
  }
}

async function writeArtifactsFromPosts(posts) {
  const sortedPosts = sortPostsByDate(posts);
  await cleanGeneratedBlogArtifacts();
  await writeJson(MANIFEST_PATH, buildBlogManifest({ enabled: true, posts: sortedPosts }));
  await writeText(path.join(ROOT, 'blog', 'index.html'), await buildIndexHtml('tr', sortedPosts));
  await writeText(path.join(ROOT, 'en', 'blog', 'index.html'), await buildIndexHtml('en', sortedPosts));
  await writePostArtifacts(sortedPosts);
}

async function writePostArtifacts(posts) {
  const groups = groupLocalizedPosts(posts);
  const groupById = new Map();

  for (const group of groups) {
    for (const post of group.posts) {
      groupById.set(String(post.id), group);
    }
  }

  for (const post of posts) {
    const group = groupById.get(String(post.id)) ?? { posts: [post] };
    const seo = getBlogPostSeo(post, group);
    const bootstrapData = buildBlogPostBootstrapData(post);
    const appHtml = await renderBlogRouteAppHtml(bootstrapData);
    const html = renderEntryHtml({
      lang: post.locale,
      title: seo.title,
      description: seo.description,
      canonicalUrl: seo.canonicalUrl,
      robots: seo.robots,
      ogImage: seo.og.image,
      ogLocale: seo.og.locale,
      alternates: seo.alternates,
      jsonLd: seo.jsonLd,
      appHtml,
      bootstrapData,
    });

    await writeText(path.join(ROOT, post.path, 'index.html'), html);
    await writeJson(path.join(POSTS_DIR, post.locale, `${post.slug}.json`), buildBlogPostManifestEntry(post));
  }
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchWithRetries(makeRequest) {
  let lastResponse = null;

  for (let attempt = 0; attempt < FETCH_RETRY_DELAYS_MS.length; attempt += 1) {
    const delayMs = FETCH_RETRY_DELAYS_MS[attempt];

    if (delayMs > 0) {
      await delay(delayMs);
    }

    try {
      lastResponse = await makeRequest();
    } catch (error) {
      if (attempt === FETCH_RETRY_DELAYS_MS.length - 1) {
        throw error;
      }
      continue;
    }

    if (lastResponse.status < 500) {
      return lastResponse;
    }
  }

  return lastResponse;
}

function buildSanityQuery(docType, defaultLocale) {
  return `*[_type == "${docType}" && defined(title) && defined(slug.current) && !(_id in path("drafts.**"))] | order(coalesce(publishedAt, _updatedAt) desc) {
    _id,
    "translationKey": coalesce(translationKey, _id),
    "language": coalesce(language, locale, "${defaultLocale}"),
    title,
    slug,
    excerpt,
    seoTitle,
    seoDescription,
    "publishedAt": coalesce(publishedAt, _updatedAt),
    bodyMarkdown,
    bodyHtml,
    body,
    "coverImage": select(
      defined(coverImage.asset) => {
        "url": coverImage.asset->url,
        "alt": coalesce(coverImage.alt, "")
      },
      null
    ),
    "category": category->{
      "slug": slug.current,
      "titleTr": coalesce(titleTr, title.tr, title, name),
      "titleEn": coalesce(titleEn, title.en, title, name)
    }
  }`;
}

async function fetchPostsFromSanity() {
  const projectId = String(process.env.SANITY_PROJECT_ID || '').trim();
  const dataset = String(process.env.SANITY_DATASET || '').trim();
  const token = String(process.env.SANITY_API_TOKEN || process.env.SANITY_API_KEY || '').trim();

  if (!projectId || !dataset) {
    return [];
  }

  const apiVersion = getSanityApiVersion();
  const docType = getSanityDocType();
  const defaultLocale = getDefaultBlogLocale();
  const apiHost = getSanityApiHost();
  const url = new URL(`https://${projectId}.${apiHost}/v${apiVersion}/data/query/${dataset}`);
  url.searchParams.set('query', buildSanityQuery(docType, defaultLocale));

  const makeRequest = async (bearerToken) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(new Error('Sanity blog fetch timed out')), FETCH_TIMEOUT_MS);

    try {
      return await fetch(url, {
        signal: controller.signal,
        headers: {
          ...(bearerToken ? { Authorization: `Bearer ${bearerToken}` } : {}),
          Accept: 'application/json',
        },
      });
    } finally {
      clearTimeout(timeoutId);
    }
  };

  let response = await fetchWithRetries(() => makeRequest(token));
  if (response.status === 401 && token) {
    response = await fetchWithRetries(() => makeRequest(''));
  }

  if (!response.ok) {
    throw new Error(`Sanity blog fetch failed at ${url.origin}${url.pathname} with ${response.status} ${response.statusText}`);
  }

  return normalizeSanityBlogResponse(await response.json());
}

const isRecoverableBlogFetchError = (error) => {
  const message = String(error?.message || '');
  const causeCode = String(error?.cause?.code || '');

  return (
    message.includes('Sanity blog fetch failed') ||
    message.includes('fetch failed') ||
    message.includes('aborted') ||
    ['ENOTFOUND', 'ECONNREFUSED', 'ECONNRESET', 'ETIMEDOUT'].includes(causeCode)
  );
};

async function main() {
  try {
    const enabledSettingRaw = String(process.env.SANITY_BLOG_ENABLED ?? '').trim();
    const hasExplicitEnableFlag = enabledSettingRaw.length > 0;
    const hasProjectId = Boolean(String(process.env.SANITY_PROJECT_ID || '').trim());
    const hasDataset = Boolean(String(process.env.SANITY_DATASET || '').trim());
    const hasRequiredConfig = hasProjectId && hasDataset;
    const enabled = hasExplicitEnableFlag ? truthy(enabledSettingRaw) : hasRequiredConfig;

    if (!enabled || !hasRequiredConfig) {
      const shouldRestoreFromCache = !hasRequiredConfig && (!hasExplicitEnableFlag || enabled);
      if (shouldRestoreFromCache) {
        const cachedPosts = await loadCachedPosts();
        if (cachedPosts.length > 0) {
          await writeArtifactsFromPosts(cachedPosts);
          console.log('Restored blog artifacts from cache because Sanity env is disabled or missing.');
          console.log(`Generated cached blog artifacts for ${cachedPosts.length} posts at ${MANIFEST_PATH}.`);
          return;
        }
      }

      if (enabled && !hasRequiredConfig) {
        console.log('SANITY_BLOG_ENABLED is set but SANITY_PROJECT_ID or SANITY_DATASET is missing. Writing empty blog artifacts.');
      }
      await writeEmptyArtifacts();
      console.log(`Generated empty blog artifacts at ${MANIFEST_PATH} and blog index routes.`);
      return;
    }

    let posts = [];
    try {
      posts = await fetchPostsFromSanity();
    } catch (error) {
      if (!isRecoverableBlogFetchError(error)) {
        throw error;
      }

      const cachedPosts = await loadCachedPosts();
      if (cachedPosts.length > 0) {
        await writeArtifactsFromPosts(cachedPosts);
        console.warn(`Sanity fetch failed; restored blog artifacts from cache: ${error.message}`);
        console.log(`Generated cached blog artifacts for ${cachedPosts.length} posts at ${MANIFEST_PATH}.`);
        return;
      }

      console.warn(`Falling back to empty blog artifacts: ${error.message}`);
      await writeEmptyArtifacts();
      console.log(`Generated empty blog artifacts at ${MANIFEST_PATH} and blog index routes.`);
      return;
    }

    await writeArtifactsFromPosts(posts);
    await writeCacheArtifacts(posts);

    console.log(`Generated blog artifacts for ${posts.length} posts at ${MANIFEST_PATH}.`);
  } finally {
    await closeBlogPrerenderRenderer();
  }
}

main().catch(async (error) => {
  try {
    await writeEmptyArtifacts();
  } catch {
    // Preserve the original failure if the fallback write also fails.
  } finally {
    await closeBlogPrerenderRenderer();
  }

  console.error(error);
  process.exit(1);
});
