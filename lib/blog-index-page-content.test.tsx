import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

describe('blog index page content', () => {
  it('accepts initialPosts and fetches the manifest for direct access rendering', () => {
    const source = readFileSync(path.join(process.cwd(), 'pages', 'BlogIndexPage.tsx'), 'utf8');

    expect(source).toContain('initialPosts');
    expect(source).toContain("/blog_manifest.json");
    expect(source).toContain('activeCategory');
    expect(source).toContain('latestPosts');
    expect(source).toContain('categorySections');
    expect(source).toContain('scrollIntoView');
    expect(source).toContain('applySeoToDocument');
    expect(source).toContain('Read article');
    expect(source).toContain('Yazıyı oku');
    expect(source).toContain('Latest');
    expect(source).toContain('En son');
    expect(source).toContain('Tüm kategoriler');
    expect(source).toContain('blog-section-');
    expect(source).not.toContain('bg-sky-500/15');
    expect(source).toContain('overflow-x-auto pb-2');
    expect(source).toContain('empty state');
    expect(source).not.toContain('Subscribe to our Newsletter');
    expect(source).not.toContain('Qualy Team');
    expect(source).not.toContain('Qualy Ekibi');
    expect(source).not.toContain('Shared article');
    expect(source).not.toContain('Ortak yayin');
    expect(source).not.toContain('featuredPost');
    expect(source).not.toContain('remainingPosts');
    expect(source).not.toContain('bg-slate-950/55');
    expect(source).toContain('BlogIndexPage');
  });
});
