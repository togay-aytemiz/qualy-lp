import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

describe('llm resources footer links', () => {
  it('keeps llm resources in the right-side utility panel alongside language controls', () => {
    const footerSource = readFileSync(path.join(process.cwd(), 'components', 'Footer.tsx'), 'utf8');

    expect(footerSource).toContain("summaryId: 'llm-resources-desktop-summary'");
    expect(footerSource).not.toContain("summaryId: 'llm-resources-mobile-summary'");
    expect(footerSource).toContain('Footer Utilities');
    expect(footerSource).toContain('group w-full sm:w-auto');
    expect(footerSource).toContain('Language Switcher');

    expect(footerSource).toContain("href: '/llms.txt'");
    expect(footerSource).toContain("href: '/llms-full.txt'");
    expect(footerSource).toContain("href: '/faqs.md'");
    expect(footerSource).toContain("href: '/faqs-directory'");

    expect(footerSource).not.toContain('Column 3: LLM Resources');

    const legalIndex = footerSource.indexOf('Column 2: Legal');
    const desktopLlmIndex = footerSource.indexOf("summaryId: 'llm-resources-desktop-summary'");
    const bigTextIndex = footerSource.indexOf('Big Text Background');

    expect(legalIndex).toBeGreaterThan(-1);
    expect(desktopLlmIndex).toBeGreaterThan(legalIndex);
    expect(bigTextIndex).toBeGreaterThan(desktopLlmIndex);
  });
});
