// @vitest-environment jsdom

import { beforeEach, describe, expect, it } from 'vitest';
import { applySeoToDocument } from './seo-dom';
import { getSeoByRoute } from './seo';

describe('applySeoToDocument', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
    document.title = '';
  });

  it('updates title, canonical and key meta tags', () => {
    const seo = getSeoByRoute('home', 'en', { siteUrl: 'https://askqualy.com' });

    applySeoToDocument(document, seo);

    expect(document.title).toBe(seo.title);
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(seo.canonicalUrl);
    expect(document.querySelector('meta[name="description"]')?.getAttribute('content')).toBe(seo.description);
    expect(document.querySelector('meta[property="og:url"]')?.getAttribute('content')).toBe(seo.og.url);
    expect(document.querySelector('meta[name="twitter:title"]')?.getAttribute('content')).toBe(seo.twitter.title);
  });

  it('keeps one canonical/meta node and updates content on route change', () => {
    const homeSeo = getSeoByRoute('home', 'en', { siteUrl: 'https://askqualy.com' });
    const termsSeo = getSeoByRoute('terms', 'en', { siteUrl: 'https://askqualy.com' });

    applySeoToDocument(document, homeSeo);
    applySeoToDocument(document, termsSeo);

    expect(document.querySelectorAll('link[rel="canonical"]').length).toBe(1);
    expect(document.querySelectorAll('meta[name="description"]').length).toBe(1);
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe('https://askqualy.com/terms');
    expect(document.querySelector('meta[name="description"]')?.getAttribute('content')).toBe(termsSeo.description);
  });

  it('writes structured data into a stable seo-jsonld script tag', () => {
    const seo = getSeoByRoute('home', 'en', { siteUrl: 'https://askqualy.com' });

    applySeoToDocument(document, seo);
    applySeoToDocument(document, seo);

    const script = document.querySelector('#seo-jsonld');
    expect(script).not.toBeNull();
    expect(document.querySelectorAll('#seo-jsonld').length).toBe(1);
    expect(script?.textContent || '').toContain('SoftwareApplication');
  });
});

