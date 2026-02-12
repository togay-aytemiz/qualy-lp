import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

describe('pricing page ui', () => {
  it('does not render a badge chip above the main pricing hero title', () => {
    const pricingSource = readFileSync(path.join(process.cwd(), 'components', 'Pricing.tsx'), 'utf8');

    expect(pricingSource).not.toContain('{copy.badge}');
    expect(pricingSource).not.toContain('badge:');
  });

  it('removes legacy language-context pricing fields now that pricing copy is local to the page', () => {
    const languageContextSource = readFileSync(path.join(process.cwd(), 'LanguageContext.tsx'), 'utf8');

    expect(languageContextSource).not.toContain('priceMonthly:');
    expect(languageContextSource).not.toContain('priceYearly:');
    expect(languageContextSource).not.toContain('save: "Save 20%"');
    expect(languageContextSource).not.toContain('save: "%20 İndirim"');
  });
});
