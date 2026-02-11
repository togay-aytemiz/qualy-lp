import { resolveAbsoluteUrl } from './site-url';

export type SitemapEntry = {
  path: string;
  changefreq: 'daily' | 'weekly' | 'monthly' | 'yearly';
  priority: number;
};

const toPriority = (value: number) => value.toFixed(1);

export const buildSitemapXml = (baseUrl: string, entries: SitemapEntry[]) => {
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

