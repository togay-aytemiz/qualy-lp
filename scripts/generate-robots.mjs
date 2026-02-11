import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const OUTPUT_PATH = path.join(ROOT, 'public', 'robots.txt');

const normalizeBaseUrl = (url) => String(url || '').trim().replace(/\/+$/, '');
const resolveAbsoluteUrl = (baseUrl, routePath) => {
  const cleanBase = normalizeBaseUrl(baseUrl) || 'https://askqualy.com';
  const cleanPath = routePath.startsWith('/') ? routePath : `/${routePath}`;
  return `${cleanBase}${cleanPath}`;
};

const buildRobots = (baseUrl) => {
  const sitemapUrl = resolveAbsoluteUrl(baseUrl, '/sitemap.xml');
  return `User-agent: *\nAllow: /\n\nSitemap: ${sitemapUrl}\n`;
};

const main = async () => {
  const siteUrl = normalizeBaseUrl(process.env.VITE_SITE_URL || 'https://askqualy.com');
  const content = buildRobots(siteUrl);
  await fs.writeFile(OUTPUT_PATH, content, 'utf8');
  console.log(`Generated ${OUTPUT_PATH}`);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

