import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

describe('blog generator config', () => {
  it('supports collection-based and endpoint-based Strapi configuration with fallback routes', () => {
    const source = readFileSync(path.join(process.cwd(), 'scripts', 'generate-blog-assets.mjs'), 'utf8');

    expect(source).toContain('STRAPI_BLOG_COLLECTION');
    expect(source).toContain('STRAPI_BLOG_ENDPOINT');
    expect(source).toContain('/api/blog-posts');
    expect(source).toContain('/api/blogs');
    expect(source).toContain('/api/articles');
    expect(source).toContain('Falling back to empty blog artifacts');
  });
});
