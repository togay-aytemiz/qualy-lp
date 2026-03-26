import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

const readEntry = (relativePath: string) => readFileSync(path.join(process.cwd(), relativePath), 'utf8');

describe('blog prerendered entry pages', () => {
  it('ships the blog index as prerendered HTML with bootstrap data for live posts', () => {
    const blogIndex = readEntry('blog/index.html');

    expect(blogIndex).not.toContain('<div id="root"></div>');
    expect(blogIndex).toContain('id="__BLOG_BOOTSTRAP__"');
    expect(blogIndex).toContain('index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1');
    expect(blogIndex).toContain('https://www.askqualy.com/blog/');
    expect(blogIndex).toContain('"route":"index"');
    expect(blogIndex).not.toContain('"posts":[]');
  });

  it('publishes prerendered blog detail entry pages for crawlers', () => {
    const blogDir = path.join(process.cwd(), 'blog');
    const postDirectories = readdirSync(blogDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);
    expect(postDirectories.length).toBeGreaterThan(0);

    const postEntryPath = path.join(blogDir, postDirectories[0], 'index.html');
    expect(existsSync(postEntryPath)).toBe(true);
    expect(readFileSync(postEntryPath, 'utf8')).toContain(
      `https://www.askqualy.com/blog/${postDirectories[0]}/`
    );
  });
});
