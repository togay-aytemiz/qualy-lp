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

  it('uses self-hosted Plus Jakarta font-face with swap and fallback stack', () => {
    const css = readFileSync(path.join(process.cwd(), 'index.css'), 'utf8');
    expect(css).toContain("font-family: 'Plus Jakarta Sans';");
    expect(css).toContain("src: local('Plus Jakarta Sans'), url('/fonts/plus-jakarta/PlusJakartaSans-VariableFont_wght.ttf') format('truetype-variations');");
    expect(css).toContain("src: local('Plus Jakarta Sans Italic'), url('/fonts/plus-jakarta/PlusJakartaSans-Italic-VariableFont_wght.ttf') format('truetype-variations');");
    expect(css).toContain('font-display: swap;');
    expect(css).toContain("font-family: 'Plus Jakarta Sans', Inter, 'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif;");
  });
});
