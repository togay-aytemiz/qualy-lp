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
    expect(getSeoRouteKeyByPath('/legal')).toBe('legalIndex');
    expect(getSeoRouteKeyByPath('/terms')).toBe('terms');
    expect(getSeoRouteKeyByPath('/privacy')).toBe('privacy');
  });

  it('falls back to home for unknown paths', () => {
    expect(getSeoRouteKeyByPath('/unknown')).toBe('home');
  });
});

describe('getSeoByRoute', () => {
  it('returns absolute canonical and og url', () => {
    const seo = getSeoByRoute('terms', 'en', { siteUrl: 'https://askqualy.com' });

    expect(seo.canonicalUrl).toBe('https://askqualy.com/terms');
    expect(seo.og.url).toBe('https://askqualy.com/terms');
    expect(seo.og.image).toBe('https://askqualy.com/og/qualy-default.png');
  });

  it('returns Turkish copy for Turkish locale', () => {
    const seo = getSeoByRoute('privacy', 'tr', { siteUrl: 'https://askqualy.com' });

    expect(seo.title).toContain('Gizlilik Politikası');
    expect(seo.description).toContain('kişisel verileri');
    expect(seo.og.locale).toBe('tr_TR');
  });

  it('builds schema payloads for home route', () => {
    const seo = getSeoByRoute('home', 'en', { siteUrl: 'https://askqualy.com' });
    const schemaTypes = seo.jsonLd.map((item) => item['@type']);

    expect(schemaTypes).toContain('Organization');
    expect(schemaTypes).toContain('WebSite');
    expect(schemaTypes).toContain('SoftwareApplication');
  });
});

