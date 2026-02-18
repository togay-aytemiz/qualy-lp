import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

describe('initial render strategy', () => {
  it('uses lazy loading for below-the-fold sections', () => {
    const appSource = readFileSync(path.join(process.cwd(), 'App.tsx'), 'utf8');

    expect(appSource).toContain('lazy(() => import(\'./components/SuccessStories\'))');
    expect(appSource).toContain('lazy(() => import(\'./components/CTA\'))');
    expect(appSource).toContain('<Suspense fallback=');
  });

  it('lazy loads non-home route pages to keep home bundle lean', () => {
    const appSource = readFileSync(path.join(process.cwd(), 'App.tsx'), 'utf8');

    expect(appSource).toContain("lazy(() => import('./pages/LegalPage'))");
    expect(appSource).toContain("lazy(() => import('./pages/LegalIndexPage'))");
    expect(appSource).toContain("lazy(() => import('./pages/LlmFaqDirectoryPage'))");
  });
});
