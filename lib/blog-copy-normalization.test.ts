import { describe, expect, it } from 'vitest';
import { normalizeLocalizedBlogCopy } from './blog-copy-normalization.mjs';

describe('blog copy normalization', () => {
  it('localizes generic English product anchors inside Turkish HTML content', () => {
    const source = '<p>Daha fazlası için <a href="https://www.askqualy.com">Our Product</a> sayfamızı ziyaret edin.</p>';

    expect(normalizeLocalizedBlogCopy(source, 'tr')).toBe(
      '<p>Daha fazlası için <a href="https://www.askqualy.com">ürün</a> sayfamızı ziyaret edin.</p>'
    );
  });

  it('localizes generic English product anchors inside Turkish markdown content', () => {
    const source = 'Daha fazlası için [Our Product](https://www.askqualy.com) sayfamızı ziyaret edin.';

    expect(normalizeLocalizedBlogCopy(source, 'tr')).toBe(
      'Daha fazlası için [ürün](https://www.askqualy.com) sayfamızı ziyaret edin.'
    );
  });

  it('localizes generic Turkish homepage anchors inside English content', () => {
    const source = 'For more information, visit <a href="https://www.askqualy.com">resmi web sitemizi</a>.';

    expect(normalizeLocalizedBlogCopy(source, 'en')).toBe(
      'For more information, visit <a href="https://www.askqualy.com">Qualy\'s official website</a>.'
    );
  });
});
