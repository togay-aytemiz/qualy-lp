import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const OUTPUT_PATH = path.join(ROOT, 'public', 'sitemap.xml');
const LEGAL_MANIFEST_PATH = path.join(ROOT, 'public', 'legal_versions.json');

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

  const legalRoutes = Object.keys(legalManifest).map((slug) => ({
    path: `/${slug}`,
    changefreq: 'monthly',
    priority: 0.4,
  }));

  const entries = [
    { path: '/', changefreq: 'weekly', priority: 1.0 },
    { path: '/legal', changefreq: 'monthly', priority: 0.5 },
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

