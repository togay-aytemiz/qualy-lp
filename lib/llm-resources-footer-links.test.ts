import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

describe('llm resources footer links', () => {
  it('exposes llm resources in collapsed desktop and mobile blocks', () => {
    const footerSource = readFileSync(path.join(process.cwd(), 'components', 'Footer.tsx'), 'utf8');

    expect(footerSource).toContain("summaryId: 'llm-resources-desktop-summary'");
    expect(footerSource).toContain("summaryId: 'llm-resources-mobile-summary'");
    expect(footerSource).toContain('hidden md:block');
    expect(footerSource).toContain('md:hidden');

    expect(footerSource).toContain("href: '/llms.txt'");
    expect(footerSource).toContain("href: '/llms-full.txt'");
    expect(footerSource).toContain("href: '/faqs.md'");
    expect(footerSource).toContain("href: '/faqs-directory'");

    expect(footerSource).not.toContain('Column 3: LLM Resources');

    const legalIndex = footerSource.indexOf('Column 2: Legal');
    const mobileLlmIndex = footerSource.indexOf("summaryId: 'llm-resources-mobile-summary'");
    const bigTextIndex = footerSource.indexOf('Big Text Background');

    expect(legalIndex).toBeGreaterThan(-1);
    expect(mobileLlmIndex).toBeGreaterThan(legalIndex);
    expect(bigTextIndex).toBeGreaterThan(mobileLlmIndex);
  });
});
