import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

describe('netlify SPA redirects', () => {
  it('has catch-all redirect to index.html for client-side routes', () => {
    const redirectsPath = path.join(process.cwd(), 'public', '_redirects');
    const content = readFileSync(redirectsPath, 'utf8');

    expect(content).toMatch(/^\/\*\s+\/index\.html\s+200$/m);
  });
});
