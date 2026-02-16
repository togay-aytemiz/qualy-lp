import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const readEntry = (relativePath: string) =>
  readFileSync(path.join(process.cwd(), relativePath), 'utf8');

describe('static SEO entry pages', () => {
  it('defines route-level canonical tags for crawlable paths', () => {
    expect(readEntry('index.html')).toContain('<link rel="canonical" href="https://askqualy.com/" />');
    expect(readEntry('en/index.html')).toContain('<link rel="canonical" href="https://askqualy.com/en" />');
    expect(readEntry('pricing/index.html')).toContain('<link rel="canonical" href="https://askqualy.com/pricing" />');
    expect(readEntry('faqs-directory/index.html')).toContain('<link rel="canonical" href="https://askqualy.com/faqs-directory" />');
    expect(readEntry('legal/index.html')).toContain('<link rel="canonical" href="https://askqualy.com/legal" />');
    expect(readEntry('terms/index.html')).toContain('<link rel="canonical" href="https://askqualy.com/terms" />');
    expect(readEntry('privacy/index.html')).toContain('<link rel="canonical" href="https://askqualy.com/privacy" />');
  });

  it('includes trial-first pricing metadata copy in static pricing entry', () => {
    const pricing = readEntry('pricing/index.html');

    expect(pricing).toContain('14 gün ücretsiz dene');
    expect(pricing).toContain('Kredi kartı gerekmez');
  });

  it('exposes hreflang alternates for tr and en home variants', () => {
    const home = readEntry('index.html');
    const enHome = readEntry('en/index.html');

    expect(home).toContain('rel="alternate" hreflang="tr" href="https://askqualy.com/"');
    expect(home).toContain('rel="alternate" hreflang="en" href="https://askqualy.com/en"');
    expect(home).toContain('rel="alternate" hreflang="x-default" href="https://askqualy.com/"');

    expect(enHome).toContain('rel="alternate" hreflang="tr" href="https://askqualy.com/"');
    expect(enHome).toContain('rel="alternate" hreflang="en" href="https://askqualy.com/en"');
    expect(enHome).toContain('rel="alternate" hreflang="x-default" href="https://askqualy.com/"');
  });

  it('ships a dedicated 404 page with noindex robots', () => {
    const notFound = readEntry('404.html');

    expect(notFound).toContain('<meta name="robots" content="noindex,follow" />');
    expect(notFound).toContain('<title>Sayfa Bulunamadı | Qualy</title>');
  });
});
