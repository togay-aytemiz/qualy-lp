import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

describe('blog build helpers', () => {
  it('defines the Sanity blog build contract in lib/blog-build.ts', () => {
    const source = readFileSync(path.join(process.cwd(), 'lib', 'blog-build.ts'), 'utf8');

    expect(source).toContain('normalizeSanityBlogResponse');
    expect(source).toContain('groupLocalizedPosts');
    expect(source).toContain('buildBlogManifest');
    expect(source).toContain('getBlogPostSeo');
    expect(source).toContain('renderBlogEntryHtml');
    expect(source).toContain('noindex,follow');
  });
});
