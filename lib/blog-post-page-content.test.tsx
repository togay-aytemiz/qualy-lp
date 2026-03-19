import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

describe('blog post page content', () => {
  it('accepts initialPost and fetches a localized post payload', () => {
    const source = readFileSync(path.join(process.cwd(), 'pages', 'BlogPostPage.tsx'), 'utf8');

    expect(source).toContain('initialPost');
    expect(source).toContain('/blog-posts/');
    expect(source).toContain('/blog_manifest.json');
    expect(source).toContain('relatedPosts');
    expect(source).toContain('applySeoToDocument');
    expect(source).toContain('blog-article-content');
    expect(source).toContain('mx-auto w-full max-w-3xl');
    expect(source).toContain('border-t border-slate-200/80');
    expect(source).toContain('Related articles');
    expect(source).toContain('post.locale === language');
    expect(source).toContain('back to blog');
    expect(source).not.toContain('inline-flex rounded-full border border-slate-200 bg-white px-3 py-1');
    expect(source).not.toContain('text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500');
    expect(source).toContain('text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400');
    expect(source).not.toContain('lg:grid-cols-12');
    expect(source).not.toContain('Shared article');
    expect(source).not.toContain('Ortak yayin');
    expect(source).toContain('BlogPostPage');
  });
});
