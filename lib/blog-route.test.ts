import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

describe('blog route', () => {
  it('renders dedicated blog index and post routes in App.tsx', () => {
    const appSource = readFileSync(path.join(process.cwd(), 'App.tsx'), 'utf8');

    expect(appSource).toContain("normalizedPath === '/blog'");
    expect(appSource).toContain("normalizedPath === '/en/blog'");
    expect(appSource).toContain("normalizedPath.startsWith('/blog/')");
    expect(appSource).toContain("normalizedPath.startsWith('/en/blog/')");
    expect(appSource).toContain('<BlogIndexPage />');
    expect(appSource).toContain('<BlogPostPage />');
  });
});
