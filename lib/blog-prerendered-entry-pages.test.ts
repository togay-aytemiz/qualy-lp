import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const readEntry = (relativePath: string) => readFileSync(path.join(process.cwd(), relativePath), 'utf8');

describe('blog prerendered entry pages', () => {
  it('ships the blog index as prerendered HTML with empty-state bootstrap data when no posts exist', () => {
    const blogIndex = readEntry('blog/index.html');

    expect(blogIndex).not.toContain('<div id="root"></div>');
    expect(blogIndex).toContain('id="__BLOG_BOOTSTRAP__"');
    expect(blogIndex).toContain('noindex,follow');
    expect(blogIndex).toContain('Tümü');
    expect(blogIndex).toContain('Henüz blog yazısı yok.');
    expect(blogIndex).toContain('"posts":[]');
  });

  it('removes prerendered blog detail entry pages when no posts exist', () => {
    const postEntryPath = path.join(process.cwd(), 'blog', 'qualy-blog-yayin-optimizasyonu', 'index.html');

    expect(existsSync(postEntryPath)).toBe(false);
  });
});
