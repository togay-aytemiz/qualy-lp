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
    expect(source).toContain('empty state');
    expect(source).toContain('BlogIndexPage');
  });
});
