import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

describe('blog generator markdown normalization', () => {
  it('normalizes markdown before rendering Sanity bodyMarkdown into HTML', () => {
    const source = readFileSync(path.join(process.cwd(), 'scripts', 'generate-blog-assets.mjs'), 'utf8');

    expect(source).toContain('function normalizeMarkdownForRender');
    expect(source).toContain('function stripOuterMarkdownFence');
    expect(source).toContain('const bodyMarkdown = normalizeMarkdownForRender');
    expect(source).toContain('const source = normalizeMarkdownForRender(markdown);');
    expect(source).toContain('isWrappedMarkdownHtml');
  });
});
