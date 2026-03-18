import { describe, expect, it } from 'vitest';
import {
  buildHomeSectionHref,
  getLocalizedPathname,
  getProductFooterSectionId,
  isHomePath,
  PRICING_PAGE_HREF,
  resolveLocalizedPathname,
} from './footer-links';

describe('getProductFooterSectionId', () => {
  it('maps product links to existing home sections', () => {
    expect(getProductFooterSectionId('features')).toBe('features');
    expect(getProductFooterSectionId('faq')).toBe('faq');
    expect(getProductFooterSectionId('leadScoring')).toBe('testimonials');
    expect(getProductFooterSectionId('updates')).toBe('how-it-works');
  });
});

describe('buildHomeSectionHref', () => {
  it('builds hash routes pointing to home sections', () => {
    expect(buildHomeSectionHref('features')).toBe('/#features');
    expect(buildHomeSectionHref('how-it-works')).toBe('/#how-it-works');
    expect(buildHomeSectionHref('features', '/en')).toBe('/en#features');
  });
});

describe('PRICING_PAGE_HREF', () => {
  it('uses dedicated pricing route', () => {
    expect(PRICING_PAGE_HREF).toBe('/pricing');
  });
});

describe('isHomePath', () => {
  it('accepts root path and rejects nested routes', () => {
    expect(isHomePath('/')).toBe(true);
    expect(isHomePath('/en')).toBe(true);
    expect(isHomePath('/en/')).toBe(true);
    expect(isHomePath('')).toBe(true);
    expect(isHomePath('/terms')).toBe(false);
    expect(isHomePath('/legal')).toBe(false);
  });
});

describe('getLocalizedPathname', () => {
  it('maps localized static routes between tr and en', () => {
    expect(getLocalizedPathname('/blog', 'en')).toBe('/en/blog');
    expect(getLocalizedPathname('/en/blog', 'tr')).toBe('/blog');
    expect(getLocalizedPathname('/pricing', 'en')).toBe('/en/pricing');
    expect(getLocalizedPathname('/en/about', 'tr')).toBe('/about');
  });

  it('uses blog manifest localizations for detail routes when slugs differ', () => {
    expect(
      getLocalizedPathname('/blog/qualy-blog-yayin-optimizasyonu', 'en', [
        {
          path: '/blog/qualy-blog-yayin-optimizasyonu',
          locale: 'tr',
          localizations: [{ locale: 'en', path: '/en/blog/qualy-blog-launch-performance' }],
        },
      ]),
    ).toBe('/en/blog/qualy-blog-launch-performance');
  });
});

describe('resolveLocalizedPathname', () => {
  it('loads manifest localizations for blog detail routes', async () => {
    const fetcher = async () =>
      new Response(
        JSON.stringify({
          posts: [
            {
              path: '/blog/qualy-blog-yayin-optimizasyonu',
              locale: 'tr',
              localizations: [{ locale: 'en', path: '/en/blog/qualy-blog-launch-performance' }],
            },
          ],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      );

    await expect(resolveLocalizedPathname('/blog/qualy-blog-yayin-optimizasyonu', 'en', fetcher)).resolves.toBe(
      '/en/blog/qualy-blog-launch-performance',
    );
  });
});
