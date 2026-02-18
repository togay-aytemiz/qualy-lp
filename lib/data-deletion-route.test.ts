import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

describe('data deletion route', () => {
  it('renders dedicated data deletion page for /data-deletion and /en/data-deletion', () => {
    const appSource = readFileSync(path.join(process.cwd(), 'App.tsx'), 'utf8');

    expect(appSource).toContain("path === '/data-deletion'");
    expect(appSource).toContain("path === '/en/data-deletion'");
    expect(appSource).toContain('<DataDeletionPage />');
  });
});
