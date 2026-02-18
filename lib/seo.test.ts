import { describe, expect, it } from 'vitest';
import { getSeoByRoute, getSeoRouteKeyByPath, normalizeRoutePath } from './seo';

describe('normalizeRoutePath', () => {
  it('normalizes root and strips trailing slash', () => {
    expect(normalizeRoutePath('/')).toBe('/');
    expect(normalizeRoutePath('/privacy/')).toBe('/privacy');
  });
});

describe('getSeoRouteKeyByPath', () => {
  it('maps known routes', () => {
    expect(getSeoRouteKeyByPath('/')).toBe('home');
    expect(getSeoRouteKeyByPath('/en')).toBe('home');
    expect(getSeoRouteKeyByPath('/pricing')).toBe('pricing');
    expect(getSeoRouteKeyByPath('/en/pricing')).toBe('pricing');
    expect(getSeoRouteKeyByPath('/data-deletion')).toBe('dataDeletion');
    expect(getSeoRouteKeyByPath('/en/data-deletion')).toBe('dataDeletion');
    expect(getSeoRouteKeyByPath('/legal')).toBe('legalIndex');
    expect(getSeoRouteKeyByPath('/en/legal')).toBe('legalIndex');
    expect(getSeoRouteKeyByPath('/terms')).toBe('terms');
    expect(getSeoRouteKeyByPath('/en/terms')).toBe('terms');
    expect(getSeoRouteKeyByPath('/privacy')).toBe('privacy');
    expect(getSeoRouteKeyByPath('/en/privacy')).toBe('privacy');
    expect(getSeoRouteKeyByPath('/faqs-directory')).toBe('faqDirectory');
  });

  it('falls back to home for unknown paths', () => {
    expect(getSeoRouteKeyByPath('/unknown')).toBe('home');
  });
});

describe('getSeoByRoute', () => {
  it('returns absolute canonical and og url', () => {
    const seo = getSeoByRoute('terms', 'en', { siteUrl: 'https://askqualy.com' });
    const pricingSeo = getSeoByRoute('pricing', 'en', { siteUrl: 'https://askqualy.com' });
    const dataDeletionSeo = getSeoByRoute('dataDeletion', 'en', { siteUrl: 'https://askqualy.com' });
    const faqDirectorySeo = getSeoByRoute('faqDirectory', 'en', { siteUrl: 'https://askqualy.com' });
    const enHomeSeo = getSeoByRoute('home', 'en', { siteUrl: 'https://askqualy.com' });
    const trHomeSeo = getSeoByRoute('home', 'tr', { siteUrl: 'https://askqualy.com' });

    expect(seo.canonicalUrl).toBe('https://askqualy.com/en/terms');
    expect(seo.og.url).toBe('https://askqualy.com/en/terms');
    expect(seo.og.image).toBe('https://askqualy.com/og/qualy-default.png');
    expect(pricingSeo.canonicalUrl).toBe('https://askqualy.com/en/pricing');
    expect(pricingSeo.og.url).toBe('https://askqualy.com/en/pricing');
    expect(dataDeletionSeo.canonicalUrl).toBe('https://askqualy.com/en/data-deletion');
    expect(dataDeletionSeo.og.url).toBe('https://askqualy.com/en/data-deletion');
    expect(faqDirectorySeo.canonicalUrl).toBe('https://askqualy.com/faqs-directory');
    expect(faqDirectorySeo.og.url).toBe('https://askqualy.com/faqs-directory');
    expect(enHomeSeo.canonicalUrl).toBe('https://askqualy.com/en');
    expect(enHomeSeo.og.url).toBe('https://askqualy.com/en');
    expect(trHomeSeo.canonicalUrl).toBe('https://askqualy.com/');
    expect(trHomeSeo.og.url).toBe('https://askqualy.com/');
  });

  it('returns Turkish copy for Turkish locale', () => {
    const seo = getSeoByRoute('privacy', 'tr', { siteUrl: 'https://askqualy.com' });

    expect(seo.title).toContain('Gizlilik Politikası');
    expect(seo.description).toContain('kişisel verileri');
    expect(seo.og.locale).toBe('tr_TR');
  });

  it('uses trial-first pricing messaging for both locales', () => {
    const pricingEn = getSeoByRoute('pricing', 'en', { siteUrl: 'https://askqualy.com' });
    const pricingTr = getSeoByRoute('pricing', 'tr', { siteUrl: 'https://askqualy.com' });

    expect(pricingEn.description).toContain('14-day free trial');
    expect(pricingEn.description).toContain('No credit card required');
    expect(pricingTr.description).toContain('14 gün ücretsiz dene');
    expect(pricingTr.description).toContain('Kredi kartı gerekmez');
  });

  it('builds schema payloads for home route', () => {
    const seo = getSeoByRoute('home', 'en', { siteUrl: 'https://askqualy.com' });
    const schemaTypes = seo.jsonLd.map((item) => item['@type']);

    expect(schemaTypes).toContain('Organization');
    expect(schemaTypes).toContain('WebSite');
    expect(schemaTypes).toContain('SoftwareApplication');
  });

  it('returns hreflang alternates for localized home routes', () => {
    const trHomeSeo = getSeoByRoute('home', 'tr', { siteUrl: 'https://askqualy.com' });
    const enHomeSeo = getSeoByRoute('home', 'en', { siteUrl: 'https://askqualy.com' });

    expect(trHomeSeo.alternates).toEqual([
      { hrefLang: 'tr', href: 'https://askqualy.com/' },
      { hrefLang: 'en', href: 'https://askqualy.com/en' },
      { hrefLang: 'x-default', href: 'https://askqualy.com/' },
    ]);

    expect(enHomeSeo.alternates).toEqual([
      { hrefLang: 'tr', href: 'https://askqualy.com/' },
      { hrefLang: 'en', href: 'https://askqualy.com/en' },
      { hrefLang: 'x-default', href: 'https://askqualy.com/' },
    ]);
  });

  it('returns hreflang alternates for localized non-home routes', () => {
    const pricingTrSeo = getSeoByRoute('pricing', 'tr', { siteUrl: 'https://askqualy.com' });
    const pricingEnSeo = getSeoByRoute('pricing', 'en', { siteUrl: 'https://askqualy.com' });

    expect(pricingTrSeo.alternates).toEqual([
      { hrefLang: 'tr', href: 'https://askqualy.com/pricing' },
      { hrefLang: 'en', href: 'https://askqualy.com/en/pricing' },
      { hrefLang: 'x-default', href: 'https://askqualy.com/pricing' },
    ]);

    expect(pricingEnSeo.alternates).toEqual([
      { hrefLang: 'tr', href: 'https://askqualy.com/pricing' },
      { hrefLang: 'en', href: 'https://askqualy.com/en/pricing' },
      { hrefLang: 'x-default', href: 'https://askqualy.com/pricing' },
    ]);
  });
});
