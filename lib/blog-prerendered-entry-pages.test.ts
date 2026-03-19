import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const readEntry = (relativePath: string) => readFileSync(path.join(process.cwd(), relativePath), 'utf8');

describe('blog prerendered entry pages', () => {
  it('ships the blog index as prerendered HTML with bootstrap data', () => {
    const blogIndex = readEntry('blog/index.html');

    expect(blogIndex).not.toContain('<div id="root"></div>');
    expect(blogIndex).toContain('id="__BLOG_BOOTSTRAP__"');
    expect(blogIndex).toContain('id="blog-latest"');
    expect(blogIndex).toContain('Tüm kategoriler');
  });

  it('ships blog detail pages with article markup in the initial HTML', () => {
    const postEntry = readEntry('blog/qualy-blog-yayin-optimizasyonu/index.html');

    expect(postEntry).not.toContain('<div id="root"></div>');
    expect(postEntry).toContain('id="__BLOG_BOOTSTRAP__"');
    expect(postEntry).toContain('blog-article-content');
    expect(postEntry).toContain('Qualy blog');
  });
});
