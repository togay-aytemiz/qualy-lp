import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

describe('netlify redirects', () => {
  it('returns 404 page for unknown routes instead of forcing SPA 200 fallback', () => {
    const redirectsPath = path.join(process.cwd(), 'public', '_redirects');
    const content = readFileSync(redirectsPath, 'utf8');

    expect(content).toMatch(/^\/\*\s+\/404\.html\s+404$/m);
    expect(content).not.toMatch(/^\/\*\s+\/index\.html\s+200$/m);
  });
});
