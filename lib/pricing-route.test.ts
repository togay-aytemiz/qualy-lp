import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

describe('pricing page route', () => {
  it('renders a dedicated pricing page for /pricing', () => {
    const appSource = readFileSync(path.join(process.cwd(), 'App.tsx'), 'utf8');

    expect(appSource).toContain("path === '/pricing'");
    expect(appSource).toContain('<PricingPage />');
    expect(appSource).not.toContain('<Pricing />');
  });
});
