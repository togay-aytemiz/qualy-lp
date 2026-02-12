import { describe, expect, it } from 'vitest';
import { buildSitemapXml } from './sitemap';

describe('buildSitemapXml', () => {
  it('builds sitemap with absolute urls', () => {
    const xml = buildSitemapXml('https://askqualy.com', [
      { path: '/', changefreq: 'weekly', priority: 1.0 },
      { path: '/en', changefreq: 'weekly', priority: 0.9 },
      { path: '/pricing', changefreq: 'weekly', priority: 0.8 },
      { path: '/faqs-directory', changefreq: 'monthly', priority: 0.7 },
      { path: '/legal', changefreq: 'monthly', priority: 0.5 },
      { path: '/terms', changefreq: 'monthly', priority: 0.4 },
      { path: '/privacy', changefreq: 'monthly', priority: 0.4 },
    ]);

    expect(xml).toContain('<loc>https://askqualy.com/</loc>');
    expect(xml).toContain('<loc>https://askqualy.com/en</loc>');
    expect(xml).toContain('<loc>https://askqualy.com/pricing</loc>');
    expect(xml).toContain('<loc>https://askqualy.com/faqs-directory</loc>');
    expect(xml).toContain('<loc>https://askqualy.com/legal</loc>');
    expect(xml).toContain('<loc>https://askqualy.com/terms</loc>');
    expect(xml).toContain('<loc>https://askqualy.com/privacy</loc>');
  });
});
