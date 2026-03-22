import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const readEntry = (relativePath: string) =>
  readFileSync(path.join(process.cwd(), relativePath), 'utf8');

describe('static SEO entry pages', () => {
  it('defines route-level canonical tags for static entry pages and noindexes an empty blog index', () => {
    expect(readEntry('index.html')).toContain('<link rel="canonical" href="https://www.askqualy.com/" />');
    expect(readEntry('en/index.html')).toContain('<link rel="canonical" href="https://www.askqualy.com/en" />');
    expect(readEntry('pricing/index.html')).toContain('<link rel="canonical" href="https://www.askqualy.com/pricing" />');
    expect(readEntry('en/pricing/index.html')).toContain('<link rel="canonical" href="https://www.askqualy.com/en/pricing" />');
    expect(readEntry('about/index.html')).toContain('<link rel="canonical" href="https://www.askqualy.com/about" />');
    expect(readEntry('en/about/index.html')).toContain('<link rel="canonical" href="https://www.askqualy.com/en/about" />');
    expect(readEntry('data-deletion/index.html')).toContain('<link rel="canonical" href="https://www.askqualy.com/data-deletion" />');
    expect(readEntry('en/data-deletion/index.html')).toContain('<link rel="canonical" href="https://www.askqualy.com/en/data-deletion" />');
    expect(readEntry('faqs-directory/index.html')).toContain('<link rel="canonical" href="https://www.askqualy.com/faqs-directory" />');
    expect(readEntry('blog/index.html')).toContain('<link rel="canonical" href="https://www.askqualy.com/blog" />');
    expect(readEntry('blog/index.html')).toContain('<meta name="robots" content="noindex,follow" />');
    expect(readEntry('en/blog/index.html')).toContain('<link rel="canonical" href="https://www.askqualy.com/en/blog" />');
    expect(readEntry('en/blog/index.html')).toContain('<meta name="robots" content="noindex,follow" />');
    expect(readEntry('legal/index.html')).toContain('<link rel="canonical" href="https://www.askqualy.com/legal" />');
    expect(readEntry('en/legal/index.html')).toContain('<link rel="canonical" href="https://www.askqualy.com/en/legal" />');
    expect(readEntry('terms/index.html')).toContain('<link rel="canonical" href="https://www.askqualy.com/terms" />');
    expect(readEntry('en/terms/index.html')).toContain('<link rel="canonical" href="https://www.askqualy.com/en/terms" />');
    expect(readEntry('privacy/index.html')).toContain('<link rel="canonical" href="https://www.askqualy.com/privacy" />');
    expect(readEntry('en/privacy/index.html')).toContain('<link rel="canonical" href="https://www.askqualy.com/en/privacy" />');
    expect(readEntry('kvkk/index.html')).toContain('<link rel="canonical" href="https://www.askqualy.com/kvkk" />');
    expect(readEntry('en/kvkk/index.html')).toContain('<link rel="canonical" href="https://www.askqualy.com/en/kvkk" />');
    expect(readEntry('pre-information/index.html')).toContain(
      '<link rel="canonical" href="https://www.askqualy.com/pre-information" />'
    );
    expect(readEntry('en/pre-information/index.html')).toContain(
      '<link rel="canonical" href="https://www.askqualy.com/en/pre-information" />'
    );
    expect(readEntry('distance-sales-agreement/index.html')).toContain(
      '<link rel="canonical" href="https://www.askqualy.com/distance-sales-agreement" />'
    );
    expect(readEntry('en/distance-sales-agreement/index.html')).toContain(
      '<link rel="canonical" href="https://www.askqualy.com/en/distance-sales-agreement" />'
    );
    expect(readEntry('cancellation-refund/index.html')).toContain(
      '<link rel="canonical" href="https://www.askqualy.com/cancellation-refund" />'
    );
    expect(readEntry('en/cancellation-refund/index.html')).toContain(
      '<link rel="canonical" href="https://www.askqualy.com/en/cancellation-refund" />'
    );
    expect(readEntry('subscription-trial/index.html')).toContain(
      '<link rel="canonical" href="https://www.askqualy.com/subscription-trial" />'
    );
    expect(readEntry('en/subscription-trial/index.html')).toContain(
      '<link rel="canonical" href="https://www.askqualy.com/en/subscription-trial" />'
    );
  });

  it('includes trial-first pricing metadata copy in static pricing entry', () => {
    const pricing = readEntry('pricing/index.html');

    expect(pricing).toContain('14 gün ücretsiz dene');
    expect(pricing).toContain('Kredi kartı gerekmez');
  });

  it('exposes hreflang alternates for tr and en home variants', () => {
    const home = readEntry('index.html');
    const enHome = readEntry('en/index.html');

    expect(home).toContain('rel="alternate" hreflang="tr" href="https://www.askqualy.com/"');
    expect(home).toContain('rel="alternate" hreflang="en" href="https://www.askqualy.com/en"');
    expect(home).toContain('rel="alternate" hreflang="x-default" href="https://www.askqualy.com/"');

    expect(enHome).toContain('rel="alternate" hreflang="tr" href="https://www.askqualy.com/"');
    expect(enHome).toContain('rel="alternate" hreflang="en" href="https://www.askqualy.com/en"');
    expect(enHome).toContain('rel="alternate" hreflang="x-default" href="https://www.askqualy.com/"');
  });

  it('ships a dedicated 404 page with noindex robots', () => {
    const notFound = readEntry('404.html');

    expect(notFound).toContain('<meta name="robots" content="noindex,follow" />');
    expect(notFound).toContain('<title>Sayfa Bulunamadı | Qualy</title>');
  });
});
