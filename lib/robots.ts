import { resolveAbsoluteUrl } from './site-url';

export const buildRobotsTxt = (baseUrl: string) => {
  const sitemapUrl = resolveAbsoluteUrl(baseUrl, '/sitemap.xml');
  return `User-agent: *\nAllow: /\n\nSitemap: ${sitemapUrl}\n`;
};

