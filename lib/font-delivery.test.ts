import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

describe('font delivery', () => {
  it('removes render-blocking Google Fonts dependencies from all static entries', () => {
    const staticEntries = [
      'index.html',
      'en/index.html',
      'pricing/index.html',
      'en/pricing/index.html',
      'data-deletion/index.html',
      'en/data-deletion/index.html',
      'faqs-directory/index.html',
      'legal/index.html',
      'en/legal/index.html',
      'terms/index.html',
      'en/terms/index.html',
      'privacy/index.html',
      'en/privacy/index.html',
      '404.html',
    ];

    for (const entry of staticEntries) {
      const html = readFileSync(path.join(process.cwd(), entry), 'utf8');
      expect(html).not.toContain('fonts.googleapis.com');
      expect(html).not.toContain('fonts.gstatic.com');
    }
  });

  it('uses a local-first system font stack in css', () => {
    const css = readFileSync(path.join(process.cwd(), 'index.css'), 'utf8');
    expect(css).toContain("font-family: Inter, 'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif;");
  });
});
