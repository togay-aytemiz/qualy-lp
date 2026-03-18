import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, 'public');
const MANIFEST_PATH = path.join(PUBLIC_DIR, 'blog_manifest.json');
const POSTS_DIR = path.join(PUBLIC_DIR, 'blog-posts');
const SITE_URL = normalizeBaseUrl(process.env.VITE_SITE_URL || 'https://askqualy.com');

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

const DEFAULT_STRAPI_BLOG_ENDPOINTS = [
  '/api/blog-posts',
  '/api/blogs',
  '/api/articles',
];

const truthy = (value) => /^(1|true|yes|on)$/i.test(String(value ?? '').trim());

function normalizeBaseUrl(value) {
  return String(value ?? '').trim().replace(/\/+$/, '');
}

function normalizeEndpointPath(value) {
  const trimmed = String(value ?? '').trim();
  if (!trimmed) return '';
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
}

function normalizeCollectionName(value) {
  return String(value ?? '').trim().replace(/^\/+|\/+$/g, '');
}

function resolveAbsoluteUrl(baseUrl, routePath) {
  const cleanBase = normalizeBaseUrl(baseUrl) || 'https://askqualy.com';
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

async function writeJson(filePath, value) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, jsonString(value), 'utf8');
}

async function writeText(filePath, value) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, value, 'utf8');
}

function getBlogIndexPath(locale) {
  return locale === 'en' ? '/en/blog' : '/blog';
}

function getBlogPostPath(locale, slug) {
  return `${getBlogIndexPath(locale)}/${slug}`;
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
}) {
  const alternateLinks = alternates
    .map((alternate) => `  <link rel="alternate" hreflang="${alternate.hrefLang}" href="${alternate.href}" />`)
    .join('\n');

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
  <div id="root"></div>
  <script type="module" src="/index.tsx"></script>
</body>
</html>
`;
}

function normalizeLocalization(raw) {
  const source = raw?.attributes ?? raw ?? {};
  const slug = String(source.slug ?? '').trim();
  const locale = String(source.locale ?? '').trim().toLowerCase();

  if (!slug || (locale !== 'tr' && locale !== 'en')) {
    return null;
  }

  return {
    id: raw?.id ?? source.id ?? null,
    locale,
    slug,
    path: getBlogPostPath(locale, slug),
    canonicalUrl: resolveAbsoluteUrl(SITE_URL, getBlogPostPath(locale, slug)),
  };
}

function normalizePost(item) {
  const source = item?.attributes ?? item ?? {};
  const slug = String(source.slug ?? '').trim();
  const title = String(source.title ?? '').trim();
  const locale = String(source.locale ?? '').trim().toLowerCase();
  const publishedAt = String(source.publishedAt ?? source.published_at ?? '').trim();

  if (!slug || !title || !publishedAt || (locale !== 'tr' && locale !== 'en')) {
    return null;
  }

  const coverImageSource =
    source.coverImage?.data?.attributes ??
    source.coverImage?.data ??
    source.coverImage ??
    null;
  const coverImageUrl = String(coverImageSource?.url ?? '').trim();
  const coverImageAlt = String(coverImageSource?.alternativeText ?? coverImageSource?.alt ?? '').trim();

  const localizations = Array.isArray(source.localizations?.data)
    ? source.localizations.data.map(normalizeLocalization).filter(Boolean)
    : Array.isArray(source.localizations)
      ? source.localizations.map(normalizeLocalization).filter(Boolean)
      : [];

  const path = getBlogPostPath(locale, slug);
  const canonicalUrl = resolveAbsoluteUrl(SITE_URL, path);

  return {
    id: item?.id ?? source.id ?? slug,
    locale,
    slug,
    title,
    excerpt: String(source.excerpt ?? source.description ?? '').trim(),
    content: String(source.content ?? source.body ?? '').trim(),
    seoTitle: String(source.seoTitle ?? title).trim(),
    seoDescription: String(source.seoDescription ?? source.excerpt ?? source.description ?? '').trim(),
    publishedAt,
    coverImage: coverImageUrl
      ? {
          url: coverImageUrl.startsWith('http') ? coverImageUrl : resolveAbsoluteUrl(SITE_URL, coverImageUrl),
          alt: coverImageAlt,
        }
      : null,
    path,
    canonicalUrl,
    localizations,
  };
}

function normalizeStrapiBlogResponse(payload) {
  const data = Array.isArray(payload?.data) ? payload.data : [];
  return data.map(normalizePost).filter(Boolean);
}

function groupLocalizedPosts(posts) {
  const byId = new Map(posts.map((post) => [String(post.id), post]));
  const visited = new Set();
  const groups = [];

  const collect = (post, group) => {
    const key = String(post.id);
    if (visited.has(key)) return;
    visited.add(key);
    group.push(post);

    for (const localization of post.localizations ?? []) {
      const related = localization?.id != null ? byId.get(String(localization.id)) : null;
      if (related) collect(related, group);
    }
  };

  for (const post of posts) {
    const key = String(post.id);
    if (visited.has(key)) continue;

    const group = [];
    collect(post, group);
    groups.push({
      key: group
        .map((item) => `${item.locale}:${item.slug}`)
        .sort((a, b) => a.localeCompare(b, 'en'))
        .join('|'),
      posts: group.sort((a, b) => a.locale.localeCompare(b.locale, 'en') || a.slug.localeCompare(b.slug, 'en')),
    });
  }

  return groups;
}

function buildBlogPostManifestEntry(post) {
  return {
    id: post.id,
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
    localizations: (post.localizations ?? []).map((localization) => ({
      id: localization.id ?? null,
      locale: localization.locale,
      slug: localization.slug,
      path: localization.path,
      canonicalUrl: localization.canonicalUrl,
    })),
  };
}

function buildBlogManifest({ enabled, posts }) {
  return {
    generatedAt: new Date().toISOString(),
    source: enabled ? 'strapi' : 'empty',
    enabled,
    siteUrl: SITE_URL,
    index: {
      tr: {
        path: getBlogIndexPath('tr'),
        title: INDEX_COPY.tr.title,
        description: INDEX_COPY.tr.description,
        robots: 'noindex,follow',
      },
      en: {
        path: getBlogIndexPath('en'),
        title: INDEX_COPY.en.title,
        description: INDEX_COPY.en.description,
        robots: 'noindex,follow',
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
  const alternates = [
    ...group.posts.map((item) => ({
      hrefLang: item.locale,
      href: resolveAbsoluteUrl(SITE_URL, item.path),
    })),
    { hrefLang: 'x-default', href: resolveAbsoluteUrl(SITE_URL, group.posts[0].path) },
  ];

  return {
    title,
    description,
    canonicalUrl: post.canonicalUrl,
    robots: 'noindex,follow',
    alternates,
    og: {
      type: 'website',
      siteName: 'Qualy',
      title,
      description,
      url: post.canonicalUrl,
      image: post.coverImage?.url || resolveAbsoluteUrl(SITE_URL, INDEX_COPY[post.locale].image),
      locale: INDEX_COPY[post.locale].locale,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      image: post.coverImage?.url || resolveAbsoluteUrl(SITE_URL, INDEX_COPY[post.locale].image),
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
      },
    ],
  };
}

function buildIndexHtml(locale) {
  const copy = INDEX_COPY[locale];
  const path = getBlogIndexPath(locale);
  return renderEntryHtml({
    lang: locale,
    title: copy.title,
    description: copy.description,
    canonicalUrl: resolveAbsoluteUrl(SITE_URL, path),
    robots: 'noindex,follow',
    ogImage: resolveAbsoluteUrl(SITE_URL, copy.image),
    ogLocale: copy.locale,
    alternates: getAlternatesFromPaths(SITE_URL, '/blog', '/en/blog'),
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
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
  });
}

async function writeEmptyArtifacts() {
  await writeJson(MANIFEST_PATH, buildBlogManifest({ enabled: false, posts: [] }));
  await writeText(path.join(ROOT, 'blog', 'index.html'), buildIndexHtml('tr'));
  await writeText(path.join(ROOT, 'en', 'blog', 'index.html'), buildIndexHtml('en'));
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
    });

    await writeText(path.join(ROOT, post.path, 'index.html'), html);
    await writeJson(path.join(POSTS_DIR, post.locale, `${post.slug}.json`), buildBlogPostManifestEntry(post));
  }
}

async function fetchPostsFromStrapi() {
  const baseUrl = normalizeBaseUrl(process.env.STRAPI_BASE_URL || '');
  const token = String(process.env.STRAPI_API_TOKEN || '').trim();
  const collectionOverride = normalizeCollectionName(process.env.STRAPI_BLOG_COLLECTION || '');
  const endpointOverride = normalizeEndpointPath(process.env.STRAPI_BLOG_ENDPOINT || '');

  if (!baseUrl || !token) {
    return [];
  }

  const candidateEndpoints = endpointOverride
    ? [endpointOverride]
    : collectionOverride
      ? [`/api/${collectionOverride}`]
      : DEFAULT_STRAPI_BLOG_ENDPOINTS;
  const attemptedUrls = [];
  const errors = [];

  for (const endpoint of candidateEndpoints) {
    const url = new URL(endpoint, `${baseUrl}/`);
    url.searchParams.set('publicationState', 'live');
    url.searchParams.set('locale', 'all');
    url.searchParams.set('sort[0]', 'publishedAt:desc');
    url.searchParams.set('populate[coverImage]', '*');
    url.searchParams.set('populate[localizations]', '*');
    attemptedUrls.push(url.toString());

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    if (response.ok) {
      return normalizeStrapiBlogResponse(await response.json());
    }

    if (response.status === 404 && !endpointOverride) {
      errors.push(`404 ${url.pathname}`);
      continue;
    }

    if (response.status >= 500 && !endpointOverride) {
      errors.push(`${response.status} ${url.pathname}`);
      continue;
    }

    throw new Error(`Strapi blog fetch failed at ${url.pathname} with ${response.status} ${response.statusText}`);
  }

  throw new Error(
    `Strapi blog fetch failed. Tried endpoints: ${attemptedUrls.join(', ')}. Responses: ${errors.join(', ') || 'none'}. Set STRAPI_BLOG_COLLECTION or STRAPI_BLOG_ENDPOINT if your collection route uses a different path.`
  );
}

const isRecoverableBlogFetchError = (error) => {
  const message = String(error?.message || '');
  return message.includes('Strapi blog fetch failed');
};

async function main() {
  const enabled = truthy(process.env.STRAPI_BLOG_ENABLED);
  const hasCredentials = Boolean(String(process.env.STRAPI_BASE_URL || '').trim() && String(process.env.STRAPI_API_TOKEN || '').trim());

  if (!enabled || !hasCredentials) {
    if (enabled && !hasCredentials) {
      console.log('STRAPI_BLOG_ENABLED is set but blog credentials are missing. Writing empty blog artifacts.');
    }
    await writeEmptyArtifacts();
    console.log(`Generated empty blog artifacts at ${MANIFEST_PATH} and blog index routes.`);
    return;
  }

  let posts = [];
  try {
    posts = await fetchPostsFromStrapi();
  } catch (error) {
    if (!isRecoverableBlogFetchError(error)) {
      throw error;
    }

    console.warn(`Falling back to empty blog artifacts: ${error.message}`);
    await writeEmptyArtifacts();
    console.log(`Generated empty blog artifacts at ${MANIFEST_PATH} and blog index routes.`);
    return;
  }

  await writeJson(MANIFEST_PATH, buildBlogManifest({ enabled: true, posts }));
  await writeText(path.join(ROOT, 'blog', 'index.html'), buildIndexHtml('tr'));
  await writeText(path.join(ROOT, 'en', 'blog', 'index.html'), buildIndexHtml('en'));
  await writePostArtifacts(posts);

  console.log(`Generated blog artifacts for ${posts.length} posts at ${MANIFEST_PATH}.`);
}

main().catch(async (error) => {
  try {
    await writeEmptyArtifacts();
  } catch {
    // Preserve the original failure if the fallback write also fails.
  }

  console.error(error);
  process.exit(1);
});
