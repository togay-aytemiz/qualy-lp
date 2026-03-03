import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

describe('about route', () => {
  it('renders dedicated about page for /about and /en/about', () => {
    const appSource = readFileSync(path.join(process.cwd(), 'App.tsx'), 'utf8');

    expect(appSource).toContain("path === '/about'");
    expect(appSource).toContain("path === '/en/about'");
    expect(appSource).toContain('<AboutPage />');
  });
});
