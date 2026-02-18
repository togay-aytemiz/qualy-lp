import { describe, expect, it } from 'vitest';
import { buildSitemapXml } from './sitemap';

describe('buildSitemapXml', () => {
  it('builds sitemap with absolute urls', () => {
    const xml = buildSitemapXml('https://askqualy.com', [
      { path: '/', changefreq: 'weekly', priority: 1.0 },
      { path: '/en', changefreq: 'weekly', priority: 0.9 },
      { path: '/pricing', changefreq: 'weekly', priority: 0.8 },
      { path: '/en/pricing', changefreq: 'weekly', priority: 0.7 },
      { path: '/data-deletion', changefreq: 'monthly', priority: 0.6 },
      { path: '/en/data-deletion', changefreq: 'monthly', priority: 0.5 },
      { path: '/faqs-directory', changefreq: 'monthly', priority: 0.7 },
      { path: '/legal', changefreq: 'monthly', priority: 0.5 },
      { path: '/en/legal', changefreq: 'monthly', priority: 0.4 },
      { path: '/terms', changefreq: 'monthly', priority: 0.4 },
      { path: '/en/terms', changefreq: 'monthly', priority: 0.4 },
      { path: '/privacy', changefreq: 'monthly', priority: 0.4 },
      { path: '/en/privacy', changefreq: 'monthly', priority: 0.4 },
    ]);

    expect(xml).toContain('<loc>https://askqualy.com/</loc>');
    expect(xml).toContain('<loc>https://askqualy.com/en</loc>');
    expect(xml).toContain('<loc>https://askqualy.com/pricing</loc>');
    expect(xml).toContain('<loc>https://askqualy.com/en/pricing</loc>');
    expect(xml).toContain('<loc>https://askqualy.com/data-deletion</loc>');
    expect(xml).toContain('<loc>https://askqualy.com/en/data-deletion</loc>');
    expect(xml).toContain('<loc>https://askqualy.com/faqs-directory</loc>');
    expect(xml).toContain('<loc>https://askqualy.com/legal</loc>');
    expect(xml).toContain('<loc>https://askqualy.com/en/legal</loc>');
    expect(xml).toContain('<loc>https://askqualy.com/terms</loc>');
    expect(xml).toContain('<loc>https://askqualy.com/en/terms</loc>');
    expect(xml).toContain('<loc>https://askqualy.com/privacy</loc>');
    expect(xml).toContain('<loc>https://askqualy.com/en/privacy</loc>');
  });
});
