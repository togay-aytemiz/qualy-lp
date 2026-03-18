import { promises as fs } from 'node:fs';
import path from 'node:path';
import { marked } from 'marked';

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, 'public');
const MANIFEST_PATH = path.join(PUBLIC_DIR, 'blog_manifest.json');
const POSTS_DIR = path.join(PUBLIC_DIR, 'blog-posts');
const BLOG_CACHE_DIR = path.join(ROOT, 'data', 'blog-cache');
const BLOG_CACHE_MANIFEST_PATH = path.join(BLOG_CACHE_DIR, 'blog_manifest.json');
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
const BLOG_LOCALES = ['tr', 'en'];
const FETCH_RETRY_DELAYS_MS = [0, 2000, 5000, 10000, 15000];

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

function normalizeBlogLocale(value) {
  return String(value ?? '').trim().toLowerCase();
}

function isSupportedBlogLocale(locale) {
  return BLOG_LOCALES.includes(locale);
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
  const locale = normalizeBlogLocale(source.locale);

  if (!slug || !isSupportedBlogLocale(locale)) {
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

function renderQuoteBlock(block) {
  const quoteBody = String(block?.body ?? '').trim();
  const quoteTitle = String(block?.title ?? '').trim();

  if (!quoteBody) return '';

  return `<figure class="rounded-3xl border border-slate-200 bg-slate-50 px-6 py-5"><blockquote><p>${escapeHtml(quoteBody)}</p></blockquote>${quoteTitle ? `<figcaption class="mt-3 text-sm font-semibold text-slate-500">${escapeHtml(quoteTitle)}</figcaption>` : ''}</figure>`;
}

function collectMediaUrls(value, bucket) {
  if (!value) return;

  if (Array.isArray(value)) {
    for (const item of value) collectMediaUrls(item, bucket);
    return;
  }

  if (typeof value === 'object') {
    const url = String(value.url ?? '').trim();
    if (url && /\.(avif|gif|jpe?g|png|svg|webp)$/i.test(url)) {
      bucket.add(url.startsWith('http') ? url : resolveAbsoluteUrl(SITE_URL, url));
    }

    for (const nestedValue of Object.values(value)) {
      collectMediaUrls(nestedValue, bucket);
    }
  }
}

function renderBlocksToHtml(blocks) {
  if (!Array.isArray(blocks) || blocks.length === 0) {
    return '';
  }

  return blocks
    .map((block) => {
      const component = String(block?.__component ?? '').trim();
      const blockBody = String(block?.body ?? '').trim();

      if (component === 'shared.rich-text' && blockBody) {
        return marked.parse(blockBody);
      }

      if (component === 'shared.quote') {
        return renderQuoteBlock(block);
      }

      const mediaUrls = new Set();
      collectMediaUrls(block, mediaUrls);
      if (mediaUrls.size > 0) {
        return Array.from(mediaUrls)
          .map((mediaUrl) => `<figure class="overflow-hidden rounded-3xl border border-slate-200"><img src="${escapeHtml(mediaUrl)}" alt="" loading="lazy" /></figure>`)
          .join('\n');
      }

      if (blockBody) {
        return `<p>${escapeHtml(blockBody)}</p>`;
      }

      return '';
    })
    .filter(Boolean)
    .join('\n');
}

function buildPostVariant({ basePost, baseId, locale, localizations, sharedAcrossLocales }) {
  const path = getBlogPostPath(locale, basePost.slug);

  return {
    ...basePost,
    id: baseId,
    locale,
    path,
    canonicalUrl: resolveAbsoluteUrl(SITE_URL, path),
    localizations,
    sharedAcrossLocales,
  };
}

function normalizeCategory(source) {
  const categorySource =
    source.category?.data?.attributes ??
    source.category?.data ??
    source.category ??
    null;
  const categorySlug = String(categorySource?.slug ?? '').trim().toLowerCase();
  const categoryLabel = String(categorySource?.name ?? categorySource?.title ?? categorySlug).trim();

  if (!categorySlug && !categoryLabel) {
    return null;
  }

  return {
    slug: categorySlug || categoryLabel.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
    label: categoryLabel || 'General',
  };
}

function normalizePost(item) {
  const source = item?.attributes ?? item ?? {};
  const slug = String(source.slug ?? '').trim();
  const title = String(source.title ?? '').trim();
  const locale = normalizeBlogLocale(source.locale);
  const publishedAt = String(source.publishedAt ?? source.published_at ?? '').trim();

  if (!slug || !title || !publishedAt || !isSupportedBlogLocale(locale)) {
    return [];
  }

  const coverImageSource =
    source.cover?.data?.attributes ??
    source.cover?.data ??
    source.cover ??
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
  const contentHtml = renderBlocksToHtml(source.blocks);
  const baseId = item?.id ?? source.id ?? slug;
  const category = normalizeCategory(source);
  const basePost = {
    slug,
    title,
    excerpt: String(source.excerpt ?? source.description ?? '').trim(),
    content: String(source.content ?? source.body ?? '').trim(),
    contentHtml,
    seoTitle: String(source.seoTitle ?? title).trim(),
    seoDescription: String(source.seoDescription ?? source.excerpt ?? source.description ?? '').trim(),
    publishedAt,
    coverImage: coverImageUrl
      ? {
          url: coverImageUrl.startsWith('http') ? coverImageUrl : resolveAbsoluteUrl(SITE_URL, coverImageUrl),
          alt: coverImageAlt,
        }
      : null,
    category,
  };

  return [
    buildPostVariant({
      basePost,
      baseId,
      locale,
      localizations,
      sharedAcrossLocales: false,
    }),
  ];
}

function normalizeStrapiBlogResponse(payload) {
  const data = Array.isArray(payload?.data) ? payload.data : [];
  return data.flatMap(normalizePost).filter(Boolean);
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
    category: post.category ?? null,
    contentHtml: post.contentHtml ?? '',
    sharedAcrossLocales: Boolean(post.sharedAcrossLocales),
    localizations: (post.localizations ?? []).map((localization) => ({
      id: localization.id ?? null,
      locale: localization.locale,
      slug: localization.slug,
      path: localization.path,
      canonicalUrl: localization.canonicalUrl,
      sharedAcrossLocales: Boolean(localization.sharedAcrossLocales),
    })),
  };
}

function restorePostFromCache(entry) {
  return {
    id: entry.id,
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
    sharedAcrossLocales: Boolean(entry.sharedAcrossLocales),
    localizations: Array.isArray(entry.localizations) ? entry.localizations : [],
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
  await cleanGeneratedBlogArtifacts();
  await writeJson(MANIFEST_PATH, buildBlogManifest({ enabled: false, posts: [] }));
  await writeText(path.join(ROOT, 'blog', 'index.html'), buildIndexHtml('tr'));
  await writeText(path.join(ROOT, 'en', 'blog', 'index.html'), buildIndexHtml('en'));
}

async function writeCacheArtifacts(posts) {
  await writeJson(BLOG_CACHE_MANIFEST_PATH, buildBlogManifest({ enabled: true, posts }));
}

async function loadCachedPosts() {
  try {
    const raw = await fs.readFile(BLOG_CACHE_MANIFEST_PATH, 'utf8');
    const payload = JSON.parse(raw);
    const cachedPosts = Array.isArray(payload?.posts) ? payload.posts.map(restorePostFromCache).filter(Boolean) : [];
    return cachedPosts;
  } catch {
    return [];
  }
}

async function writeArtifactsFromPosts(posts) {
  await cleanGeneratedBlogArtifacts();
  await writeJson(MANIFEST_PATH, buildBlogManifest({ enabled: true, posts }));
  await writeText(path.join(ROOT, 'blog', 'index.html'), buildIndexHtml('tr'));
  await writeText(path.join(ROOT, 'en', 'blog', 'index.html'), buildIndexHtml('en'));
  await writePostArtifacts(posts);
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

async function fetchPostsFromStrapi() {
  const baseUrl = normalizeBaseUrl(process.env.STRAPI_BASE_URL || '');
  const token = String(process.env.STRAPI_API_TOKEN || '').trim();
  const collectionOverride = normalizeCollectionName(process.env.STRAPI_BLOG_COLLECTION || '');
  const endpointOverride = normalizeEndpointPath(process.env.STRAPI_BLOG_ENDPOINT || '');

  if (!baseUrl) {
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
    url.searchParams.set('locale', 'all');
    url.searchParams.set('publicationState', 'live');
    url.searchParams.set('sort[0]', 'publishedAt:desc');
    url.searchParams.set('populate', '*');
    attemptedUrls.push(url.toString());

    const makeRequest = (bearerToken) =>
      fetch(url, {
        headers: {
          ...(bearerToken ? { Authorization: `Bearer ${bearerToken}` } : {}),
          Accept: 'application/json',
        },
      });

    let response = await fetchWithRetries(() => makeRequest(token));
    if (response.status === 401 && token) {
      response = await fetchWithRetries(() => makeRequest(''));
    }

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
  const enabledSettingRaw = String(process.env.STRAPI_BLOG_ENABLED ?? '').trim();
  const enabled = truthy(enabledSettingRaw);
  const hasExplicitEnableFlag = enabledSettingRaw.length > 0;
  const hasBaseUrl = Boolean(String(process.env.STRAPI_BASE_URL || '').trim());

  if (!enabled || !hasBaseUrl) {
    const shouldRestoreFromCache = !hasBaseUrl && (!hasExplicitEnableFlag || enabled);
    if (shouldRestoreFromCache) {
      const cachedPosts = await loadCachedPosts();
      if (cachedPosts.length > 0) {
        await writeArtifactsFromPosts(cachedPosts);
        console.log('Restored blog artifacts from cache because Strapi env is disabled or missing.');
        console.log(`Generated cached blog artifacts for ${cachedPosts.length} posts at ${MANIFEST_PATH}.`);
        return;
      }
    }

    if (enabled && !hasBaseUrl) {
      console.log('STRAPI_BLOG_ENABLED is set but STRAPI_BASE_URL is missing. Writing empty blog artifacts.');
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

    const cachedPosts = await loadCachedPosts();
    if (cachedPosts.length > 0) {
      await writeArtifactsFromPosts(cachedPosts);
      console.warn(`Strapi fetch failed; restored blog artifacts from cache: ${error.message}`);
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
