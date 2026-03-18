import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

describe('blog index page content', () => {
  it('accepts initialPosts and fetches the manifest for direct access rendering', () => {
    const source = readFileSync(path.join(process.cwd(), 'pages', 'BlogIndexPage.tsx'), 'utf8');

    expect(source).toContain('initialPosts');
    expect(source).toContain("/blog_manifest.json");
    expect(source).toContain('featuredPost');
    expect(source).toContain('remainingPosts');
    expect(source).toContain('activeCategory');
    expect(source).toContain('categoryFilters');
    expect(source).toContain('Read article');
    expect(source).toContain('Yazıyı oku');
    expect(source).toContain('Tümü');
    expect(source).toContain('overflow-x-auto px-1 pb-4');
    expect(source).toContain('empty state');
    expect(source).not.toContain('Subscribe to our Newsletter');
    expect(source).not.toContain('Qualy Team');
    expect(source).not.toContain('Qualy Ekibi');
    expect(source).not.toContain('Shared article');
    expect(source).not.toContain('Ortak yayin');
    expect(source).toContain('BlogIndexPage');
  });
});
