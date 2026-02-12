import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

describe('pricing page ui', () => {
  it('does not render a badge chip above the main pricing hero title', () => {
    const pricingSource = readFileSync(path.join(process.cwd(), 'components', 'Pricing.tsx'), 'utf8');

    expect(pricingSource).not.toContain('{copy.badge}');
    expect(pricingSource).not.toContain('badge:');
  });
});
