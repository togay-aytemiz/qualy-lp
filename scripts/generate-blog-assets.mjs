import { existsSync, readFileSync, promises as fs } from 'node:fs';
import path from 'node:path';
import { marked } from 'marked';

const ROOT = process.cwd();
loadEnvironmentFiles();

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

const BLOG_LOCALES = ['tr', 'en'];
const FETCH_RETRY_DELAYS_MS = [0, 2000, 5000, 10000, 15000];
const DEFAULT_SANITY_API_VERSION = '2026-03-01';
const DEFAULT_SANITY_DOC_TYPE = 'post';

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

function renderMarkdownToHtml(markdown) {
  const source = String(markdown ?? '').trim();
  if (!source) return '';
  return marked.parse(source);
}

function normalizeCategory(value) {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const slug = String(value.slug?.current ?? value.slug ?? '').trim().toLowerCase();
  const label = String(value.label ?? value.title ?? value.name ?? slug).trim();

  if (!slug && !label) {
    return null;
  }

  return {
    slug: slug || label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
    label: label || 'General',
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
  const bodyMarkdown = String(item?.bodyMarkdown ?? item?.contentMarkdown ?? item?.body ?? '').trim();
  const bodyHtml = String(item?.bodyHtml ?? item?.contentHtml ?? '').trim();
  const path = getBlogPostPath(locale, slug);

  return {
    id: String(item?._id ?? item?.id ?? `${translationKey}:${locale}`),
    translationKey,
    locale,
    slug,
    title,
    excerpt: String(item?.excerpt ?? '').trim(),
    content: bodyMarkdown,
    contentHtml: bodyHtml || renderMarkdownToHtml(bodyMarkdown),
    seoTitle: String(item?.seoTitle ?? title).trim(),
    seoDescription: String(item?.seoDescription ?? item?.excerpt ?? '').trim(),
    publishedAt,
    coverImage: normalizeCoverImage(item?.coverImage ?? item?.mainImage ?? item?.image),
    category: normalizeCategory(item?.category),
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
    return hydrateLocalizedPosts(cachedPosts);
  } catch {
    return [];
  }
}

async function writeArtifactsFromPosts(posts) {
  const sortedPosts = sortPostsByDate(posts);
  await cleanGeneratedBlogArtifacts();
  await writeJson(MANIFEST_PATH, buildBlogManifest({ enabled: true, posts: sortedPosts }));
  await writeText(path.join(ROOT, 'blog', 'index.html'), buildIndexHtml('tr'));
  await writeText(path.join(ROOT, 'en', 'blog', 'index.html'), buildIndexHtml('en'));
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
      "label": coalesce(title, name)
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

  if (!response.ok) {
    throw new Error(`Sanity blog fetch failed at ${url.origin}${url.pathname} with ${response.status} ${response.statusText}`);
  }

  return normalizeSanityBlogResponse(await response.json());
}

const isRecoverableBlogFetchError = (error) => {
  const message = String(error?.message || '');
  return message.includes('Sanity blog fetch failed');
};

async function main() {
  const enabledSettingRaw = String(process.env.SANITY_BLOG_ENABLED ?? '').trim();
  const enabled = truthy(enabledSettingRaw);
  const hasExplicitEnableFlag = enabledSettingRaw.length > 0;
  const hasProjectId = Boolean(String(process.env.SANITY_PROJECT_ID || '').trim());
  const hasDataset = Boolean(String(process.env.SANITY_DATASET || '').trim());
  const hasRequiredConfig = hasProjectId && hasDataset;

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
