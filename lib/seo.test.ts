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
    expect(getSeoRouteKeyByPath('/en/')).toBe('home');
    expect(getSeoRouteKeyByPath('/blog')).toBe('blogIndex');
    expect(getSeoRouteKeyByPath('/en/blog')).toBe('blogIndex');
    expect(getSeoRouteKeyByPath('/pricing')).toBe('pricing');
    expect(getSeoRouteKeyByPath('/en/pricing')).toBe('pricing');
    expect(getSeoRouteKeyByPath('/about')).toBe('about');
    expect(getSeoRouteKeyByPath('/en/about')).toBe('about');
    expect(getSeoRouteKeyByPath('/en/about/')).toBe('about');
    expect(getSeoRouteKeyByPath('/data-deletion')).toBe('dataDeletion');
    expect(getSeoRouteKeyByPath('/en/data-deletion')).toBe('dataDeletion');
    expect(getSeoRouteKeyByPath('/legal')).toBe('legalIndex');
    expect(getSeoRouteKeyByPath('/en/legal')).toBe('legalIndex');
    expect(getSeoRouteKeyByPath('/terms')).toBe('terms');
    expect(getSeoRouteKeyByPath('/en/terms')).toBe('terms');
    expect(getSeoRouteKeyByPath('/privacy')).toBe('privacy');
    expect(getSeoRouteKeyByPath('/en/privacy')).toBe('privacy');
    expect(getSeoRouteKeyByPath('/kvkk')).toBe('kvkk');
    expect(getSeoRouteKeyByPath('/en/kvkk')).toBe('kvkk');
    expect(getSeoRouteKeyByPath('/pre-information')).toBe('preInformation');
    expect(getSeoRouteKeyByPath('/en/pre-information')).toBe('preInformation');
    expect(getSeoRouteKeyByPath('/distance-sales-agreement')).toBe('distanceSalesAgreement');
    expect(getSeoRouteKeyByPath('/en/distance-sales-agreement')).toBe('distanceSalesAgreement');
    expect(getSeoRouteKeyByPath('/cancellation-refund')).toBe('cancellationRefund');
    expect(getSeoRouteKeyByPath('/en/cancellation-refund')).toBe('cancellationRefund');
    expect(getSeoRouteKeyByPath('/subscription-trial')).toBe('subscriptionTrial');
    expect(getSeoRouteKeyByPath('/en/subscription-trial')).toBe('subscriptionTrial');
    expect(getSeoRouteKeyByPath('/faqs-directory')).toBe('faqDirectory');
  });

  it('falls back to home for unknown paths', () => {
    expect(getSeoRouteKeyByPath('/unknown')).toBe('home');
  });
});

describe('getSeoByRoute', () => {
  it('returns absolute canonical and og url', () => {
    const seo = getSeoByRoute('terms', 'en', { siteUrl: 'https://www.askqualy.com' });
    const blogSeo = getSeoByRoute('blogIndex' as never, 'en', { siteUrl: 'https://www.askqualy.com' });
    const pricingSeo = getSeoByRoute('pricing', 'en', { siteUrl: 'https://www.askqualy.com' });
    const aboutSeo = getSeoByRoute('about', 'en', { siteUrl: 'https://www.askqualy.com' });
    const dataDeletionSeo = getSeoByRoute('dataDeletion', 'en', { siteUrl: 'https://www.askqualy.com' });
    const faqDirectorySeo = getSeoByRoute('faqDirectory', 'en', { siteUrl: 'https://www.askqualy.com' });
    const enHomeSeo = getSeoByRoute('home', 'en', { siteUrl: 'https://www.askqualy.com' });
    const trHomeSeo = getSeoByRoute('home', 'tr', { siteUrl: 'https://www.askqualy.com' });

    expect(seo.canonicalUrl).toBe('https://www.askqualy.com/en/terms/');
    expect(seo.og.url).toBe('https://www.askqualy.com/en/terms/');
    expect(seo.og.image).toBe('https://www.askqualy.com/og/qualy-default.png');
    expect(blogSeo.canonicalUrl).toBe('https://www.askqualy.com/en/blog/');
    expect(blogSeo.robots).toBe('index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1');
    expect(blogSeo.og.url).toBe('https://www.askqualy.com/en/blog/');
    expect(pricingSeo.canonicalUrl).toBe('https://www.askqualy.com/en/pricing/');
    expect(pricingSeo.og.url).toBe('https://www.askqualy.com/en/pricing/');
    expect(aboutSeo.canonicalUrl).toBe('https://www.askqualy.com/en/about/');
    expect(aboutSeo.og.url).toBe('https://www.askqualy.com/en/about/');
    expect(dataDeletionSeo.canonicalUrl).toBe('https://www.askqualy.com/en/data-deletion/');
    expect(dataDeletionSeo.og.url).toBe('https://www.askqualy.com/en/data-deletion/');
    expect(faqDirectorySeo.canonicalUrl).toBe('https://www.askqualy.com/faqs-directory/');
    expect(faqDirectorySeo.og.url).toBe('https://www.askqualy.com/faqs-directory/');
    expect(getSeoByRoute('kvkk', 'en', { siteUrl: 'https://www.askqualy.com' }).canonicalUrl).toBe(
      'https://www.askqualy.com/en/kvkk/'
    );
    expect(
      getSeoByRoute('distanceSalesAgreement', 'tr', { siteUrl: 'https://www.askqualy.com' }).canonicalUrl
    ).toBe('https://www.askqualy.com/distance-sales-agreement/');
    expect(
      getSeoByRoute('subscriptionTrial', 'en', { siteUrl: 'https://www.askqualy.com' }).canonicalUrl
    ).toBe('https://www.askqualy.com/en/subscription-trial/');
    expect(enHomeSeo.canonicalUrl).toBe('https://www.askqualy.com/en/');
    expect(enHomeSeo.og.url).toBe('https://www.askqualy.com/en/');
    expect(trHomeSeo.canonicalUrl).toBe('https://www.askqualy.com/');
    expect(trHomeSeo.og.url).toBe('https://www.askqualy.com/');
  });

  it('returns Turkish copy for Turkish locale', () => {
    const seo = getSeoByRoute('privacy', 'tr', { siteUrl: 'https://www.askqualy.com' });

    expect(seo.title).toContain('Gizlilik Politikası');
    expect(seo.description).toContain('kişisel verileri');
    expect(seo.og.locale).toBe('tr_TR');
  });

  it('uses trial-first pricing messaging for both locales', () => {
    const pricingEn = getSeoByRoute('pricing', 'en', { siteUrl: 'https://www.askqualy.com' });
    const pricingTr = getSeoByRoute('pricing', 'tr', { siteUrl: 'https://www.askqualy.com' });

    expect(pricingEn.description).toContain('14-day free trial');
    expect(pricingEn.description).toContain('No card required');
    expect(pricingEn.description).toContain('monthly usage allowance');
    expect(pricingEn.description).not.toContain('credits');
    expect(pricingTr.description).toContain('14 gün ücretsiz dene');
    expect(pricingTr.description).toContain('Kart bilgisi gerekmez');
    expect(pricingTr.description).toContain('aylık kullanım hakkı');
    expect(pricingTr.description).not.toContain('kredi');
  });

  it('builds schema payloads for home route', () => {
    const seo = getSeoByRoute('home', 'en', { siteUrl: 'https://www.askqualy.com' });
    const schemaTypes = seo.jsonLd.map((item) => item['@type']);

    expect(schemaTypes).toContain('Organization');
    expect(schemaTypes).toContain('WebSite');
    expect(schemaTypes).toContain('SoftwareApplication');
  });

  it('returns hreflang alternates for localized home routes', () => {
    const trHomeSeo = getSeoByRoute('home', 'tr', { siteUrl: 'https://www.askqualy.com' });
    const enHomeSeo = getSeoByRoute('home', 'en', { siteUrl: 'https://www.askqualy.com' });

    expect(trHomeSeo.alternates).toEqual([
      { hrefLang: 'tr', href: 'https://www.askqualy.com/' },
      { hrefLang: 'en', href: 'https://www.askqualy.com/en/' },
      { hrefLang: 'x-default', href: 'https://www.askqualy.com/' },
    ]);

    expect(enHomeSeo.alternates).toEqual([
      { hrefLang: 'tr', href: 'https://www.askqualy.com/' },
      { hrefLang: 'en', href: 'https://www.askqualy.com/en/' },
      { hrefLang: 'x-default', href: 'https://www.askqualy.com/' },
    ]);
  });

  it('returns hreflang alternates for localized non-home routes', () => {
    const pricingTrSeo = getSeoByRoute('pricing', 'tr', { siteUrl: 'https://www.askqualy.com' });
    const pricingEnSeo = getSeoByRoute('pricing', 'en', { siteUrl: 'https://www.askqualy.com' });
    const blogTrSeo = getSeoByRoute('blogIndex' as never, 'tr', { siteUrl: 'https://www.askqualy.com' });
    const blogEnSeo = getSeoByRoute('blogIndex' as never, 'en', { siteUrl: 'https://www.askqualy.com' });

    expect(pricingTrSeo.alternates).toEqual([
      { hrefLang: 'tr', href: 'https://www.askqualy.com/pricing/' },
      { hrefLang: 'en', href: 'https://www.askqualy.com/en/pricing/' },
      { hrefLang: 'x-default', href: 'https://www.askqualy.com/pricing/' },
    ]);

    expect(pricingEnSeo.alternates).toEqual([
      { hrefLang: 'tr', href: 'https://www.askqualy.com/pricing/' },
      { hrefLang: 'en', href: 'https://www.askqualy.com/en/pricing/' },
      { hrefLang: 'x-default', href: 'https://www.askqualy.com/pricing/' },
    ]);

    expect(blogTrSeo.alternates).toEqual([
      { hrefLang: 'tr', href: 'https://www.askqualy.com/blog/' },
      { hrefLang: 'en', href: 'https://www.askqualy.com/en/blog/' },
      { hrefLang: 'x-default', href: 'https://www.askqualy.com/blog/' },
    ]);

    expect(blogEnSeo.alternates).toEqual([
      { hrefLang: 'tr', href: 'https://www.askqualy.com/blog/' },
      { hrefLang: 'en', href: 'https://www.askqualy.com/en/blog/' },
      { hrefLang: 'x-default', href: 'https://www.askqualy.com/blog/' },
    ]);
  });
});
