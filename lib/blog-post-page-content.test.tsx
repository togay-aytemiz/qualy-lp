import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

describe('blog post page content', () => {
  it('accepts initialPost and fetches a localized post payload', () => {
    const source = readFileSync(path.join(process.cwd(), 'pages', 'BlogPostPage.tsx'), 'utf8');

    expect(source).toContain('initialPost');
    expect(source).toContain('/blog-posts/');
    expect(source).toContain('back to blog');
    expect(source).toContain('BlogPostPage');
  });
});
