import { describe, expect, it } from 'vitest';
import { buildSitemapXml } from './sitemap';

describe('buildSitemapXml', () => {
  it('builds sitemap with absolute urls', () => {
    const xml = buildSitemapXml('https://askqualy.com', [
      { path: '/', changefreq: 'weekly', priority: 1.0 },
      { path: '/en', changefreq: 'weekly', priority: 0.9 },
      { path: '/pricing', changefreq: 'weekly', priority: 0.8 },
      { path: '/en/pricing', changefreq: 'weekly', priority: 0.7 },
      { path: '/about', changefreq: 'monthly', priority: 0.6 },
      { path: '/en/about', changefreq: 'monthly', priority: 0.5 },
      { path: '/data-deletion', changefreq: 'monthly', priority: 0.6 },
      { path: '/en/data-deletion', changefreq: 'monthly', priority: 0.5 },
      { path: '/faqs-directory', changefreq: 'monthly', priority: 0.7 },
      { path: '/legal', changefreq: 'monthly', priority: 0.5 },
      { path: '/en/legal', changefreq: 'monthly', priority: 0.4 },
      { path: '/terms', changefreq: 'monthly', priority: 0.4 },
      { path: '/en/terms', changefreq: 'monthly', priority: 0.4 },
      { path: '/privacy', changefreq: 'monthly', priority: 0.4 },
      { path: '/en/privacy', changefreq: 'monthly', priority: 0.4 },
      { path: '/kvkk', changefreq: 'monthly', priority: 0.4 },
      { path: '/en/kvkk', changefreq: 'monthly', priority: 0.4 },
      { path: '/pre-information', changefreq: 'monthly', priority: 0.4 },
      { path: '/en/pre-information', changefreq: 'monthly', priority: 0.4 },
      { path: '/distance-sales-agreement', changefreq: 'monthly', priority: 0.4 },
      { path: '/en/distance-sales-agreement', changefreq: 'monthly', priority: 0.4 },
      { path: '/cancellation-refund', changefreq: 'monthly', priority: 0.4 },
      { path: '/en/cancellation-refund', changefreq: 'monthly', priority: 0.4 },
      { path: '/subscription-trial', changefreq: 'monthly', priority: 0.4 },
      { path: '/en/subscription-trial', changefreq: 'monthly', priority: 0.4 },
    ]);

    expect(xml).toContain('<loc>https://askqualy.com/</loc>');
    expect(xml).toContain('<loc>https://askqualy.com/en</loc>');
    expect(xml).toContain('<loc>https://askqualy.com/pricing</loc>');
    expect(xml).toContain('<loc>https://askqualy.com/en/pricing</loc>');
    expect(xml).not.toContain('/blog');
    expect(xml).not.toContain('/en/blog');
    expect(xml).toContain('<loc>https://askqualy.com/about</loc>');
    expect(xml).toContain('<loc>https://askqualy.com/en/about</loc>');
    expect(xml).toContain('<loc>https://askqualy.com/data-deletion</loc>');
    expect(xml).toContain('<loc>https://askqualy.com/en/data-deletion</loc>');
    expect(xml).toContain('<loc>https://askqualy.com/faqs-directory</loc>');
    expect(xml).toContain('<loc>https://askqualy.com/legal</loc>');
    expect(xml).toContain('<loc>https://askqualy.com/en/legal</loc>');
    expect(xml).toContain('<loc>https://askqualy.com/terms</loc>');
    expect(xml).toContain('<loc>https://askqualy.com/en/terms</loc>');
    expect(xml).toContain('<loc>https://askqualy.com/privacy</loc>');
    expect(xml).toContain('<loc>https://askqualy.com/en/privacy</loc>');
    expect(xml).toContain('<loc>https://askqualy.com/kvkk</loc>');
    expect(xml).toContain('<loc>https://askqualy.com/en/kvkk</loc>');
    expect(xml).toContain('<loc>https://askqualy.com/pre-information</loc>');
    expect(xml).toContain('<loc>https://askqualy.com/en/pre-information</loc>');
    expect(xml).toContain('<loc>https://askqualy.com/distance-sales-agreement</loc>');
    expect(xml).toContain('<loc>https://askqualy.com/en/distance-sales-agreement</loc>');
    expect(xml).toContain('<loc>https://askqualy.com/cancellation-refund</loc>');
    expect(xml).toContain('<loc>https://askqualy.com/en/cancellation-refund</loc>');
    expect(xml).toContain('<loc>https://askqualy.com/subscription-trial</loc>');
    expect(xml).toContain('<loc>https://askqualy.com/en/subscription-trial</loc>');
  });
});
