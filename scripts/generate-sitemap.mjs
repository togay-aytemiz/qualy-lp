import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const OUTPUT_PATH = path.join(ROOT, 'public', 'sitemap.xml');
const LEGAL_MANIFEST_PATH = path.join(ROOT, 'public', 'legal_versions.json');
const BLOG_MANIFEST_PATH = path.join(ROOT, 'public', 'blog_manifest.json');

const normalizeBaseUrl = (url) => String(url || '').trim().replace(/\/+$/, '');
const resolveAbsoluteUrl = (baseUrl, routePath) => {
  const cleanBase = normalizeBaseUrl(baseUrl) || 'https://askqualy.com';
  const cleanPath = routePath.startsWith('/') ? routePath : `/${routePath}`;
  return `${cleanBase}${cleanPath}`;
};

const toPriority = (value) => Number(value).toFixed(1);

const buildSitemapXml = (baseUrl, entries) => {
  const urls = entries
    .map((entry) => {
      const loc = resolveAbsoluteUrl(baseUrl, entry.path);
      return [
        '  <url>',
        `    <loc>${loc}</loc>`,
        `    <changefreq>${entry.changefreq}</changefreq>`,
        `    <priority>${toPriority(entry.priority)}</priority>`,
        '  </url>',
      ].join('\n');
    })
    .join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    '</urlset>',
    '',
  ].join('\n');
};

const main = async () => {
  const siteUrl = normalizeBaseUrl(process.env.VITE_SITE_URL || 'https://askqualy.com');

  let legalManifest = {};
  try {
    legalManifest = JSON.parse(await fs.readFile(LEGAL_MANIFEST_PATH, 'utf8'));
  } catch (error) {
    throw new Error(`Could not read ${LEGAL_MANIFEST_PATH}. Run legal:generate first.\n${error}`);
  }

  let blogManifest = {};
  try {
    blogManifest = JSON.parse(await fs.readFile(BLOG_MANIFEST_PATH, 'utf8'));
  } catch (error) {
    throw new Error(`Could not read ${BLOG_MANIFEST_PATH}. Run blog:generate first.\n${error}`);
  }

  const legalRoutes = Object.keys(legalManifest).flatMap((slug) => [
    {
      path: `/${slug}`,
      changefreq: 'monthly',
      priority: 0.4,
    },
    {
      path: `/en/${slug}`,
      changefreq: 'monthly',
      priority: 0.4,
    },
  ]);
  const blogPosts = Array.isArray(blogManifest?.posts) ? blogManifest.posts : [];
  const blogEnabled = Boolean(blogManifest?.enabled) && blogPosts.length > 0;
  const blogPostRoutes = blogEnabled
    ? Array.from(
        new Map(
          blogPosts
            .map((post) => String(post?.path || '').trim())
            .filter(Boolean)
            .map((routePath) => [
              routePath,
              {
                path: routePath,
                changefreq: 'monthly',
                priority: routePath.startsWith('/en/') ? 0.5 : 0.6,
              },
            ])
        ).values()
      )
    : [];
  const blogIndexRoutes = blogEnabled
    ? [
        { path: '/blog', changefreq: 'weekly', priority: 0.8 },
        { path: '/en/blog', changefreq: 'weekly', priority: 0.7 },
      ]
    : [];

  const entries = [
    { path: '/', changefreq: 'weekly', priority: 1.0 },
    { path: '/en', changefreq: 'weekly', priority: 0.9 },
    ...blogIndexRoutes,
    { path: '/pricing', changefreq: 'weekly', priority: 0.8 },
    { path: '/en/pricing', changefreq: 'weekly', priority: 0.7 },
    { path: '/about', changefreq: 'monthly', priority: 0.6 },
    { path: '/en/about', changefreq: 'monthly', priority: 0.5 },
    { path: '/data-deletion', changefreq: 'monthly', priority: 0.6 },
    { path: '/en/data-deletion', changefreq: 'monthly', priority: 0.5 },
    { path: '/faqs-directory', changefreq: 'monthly', priority: 0.7 },
    { path: '/legal', changefreq: 'monthly', priority: 0.5 },
    { path: '/en/legal', changefreq: 'monthly', priority: 0.4 },
    ...blogPostRoutes,
    ...legalRoutes,
  ];

  const sitemap = buildSitemapXml(siteUrl, entries);
  await fs.writeFile(OUTPUT_PATH, sitemap, 'utf8');
  console.log(`Generated ${OUTPUT_PATH}`);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
