import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { getBlogPostSeo } from './blog-build';
import type { BlogPostRecord } from './blog';

describe('blog build helpers', () => {
  it('defines the Sanity blog build contract in lib/blog-build.ts', () => {
    const source = readFileSync(path.join(process.cwd(), 'lib', 'blog-build.ts'), 'utf8');

    expect(source).toContain('normalizeSanityBlogResponse');
    expect(source).toContain('groupLocalizedPosts');
    expect(source).toContain('buildBlogManifest');
    expect(source).toContain('getBlogPostSeo');
    expect(source).toContain('renderBlogEntryHtml');
    expect(source).toContain('index,follow');
  });

  it('uses locale-specific existing OG assets for blog posts without cover images', () => {
    const basePost = {
      slug: 'sample-post',
      title: 'Sample Post',
      excerpt: 'Sample excerpt',
      publishedAt: '2026-04-12T00:00:00.000Z',
      content: 'Body',
      coverImage: null,
    };

    const trSeo = getBlogPostSeo(
      { ...basePost, locale: 'tr' } satisfies BlogPostRecord,
      { siteUrl: 'https://www.askqualy.com' }
    );
    const enSeo = getBlogPostSeo(
      { ...basePost, locale: 'en' } satisfies BlogPostRecord,
      { siteUrl: 'https://www.askqualy.com' }
    );

    expect(trSeo.image).toBe('https://www.askqualy.com/og/qualy-og-tr.png');
    expect(enSeo.image).toBe('https://www.askqualy.com/og/qualy-og-en.png');
  });
});
