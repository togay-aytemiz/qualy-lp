import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

describe('font delivery', () => {
  it('keeps a single Google Fonts request with display swap', () => {
    const html = readFileSync(path.join(process.cwd(), 'index.html'), 'utf8');
    const matches = html.match(/fonts\.googleapis\.com\/css2\?/g) ?? [];

    expect(matches).toHaveLength(1);
    expect(html).toContain('display=swap');
  });

  it('keeps fallback font stack in css', () => {
    const css = readFileSync(path.join(process.cwd(), 'index.css'), 'utf8');
    expect(css).toContain("font-family: 'Plus Jakarta Sans', Inter, 'Segoe UI', system-ui, sans-serif;");
  });
});

