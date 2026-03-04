import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

describe('footer column layout', () => {
  it('uses evenly spaced Product, Legal, and Contact columns with right-side utility controls', () => {
    const footerSource = readFileSync(path.join(process.cwd(), 'components', 'Footer.tsx'), 'utf8');

    expect(footerSource).toContain('sm:grid-cols-3');
    expect(footerSource).toContain('sm:gap-x-12');
    expect(footerSource).toContain('sm:flex-row sm:items-start sm:justify-between');
    expect(footerSource).not.toContain('sm:ml-auto');
    expect(footerSource).toContain('Column 2: Legal');
    expect(footerSource).toContain('Column 3: Contact');
    expect(footerSource).toContain('{t.footer.contact}');
    expect(footerSource).toContain('Footer Utilities');

    const productIndex = footerSource.indexOf('Column 1: Product');
    const legalIndex = footerSource.indexOf('Column 2: Legal');
    const contactIndex = footerSource.indexOf('Column 3: Contact');

    expect(productIndex).toBeGreaterThan(-1);
    expect(legalIndex).toBeGreaterThan(productIndex);
    expect(contactIndex).toBeGreaterThan(legalIndex);

    const alignedColumnClassOccurrences =
      footerSource.match(/className=\"flex w-full flex-col items-start space-y-4\"/g)?.length ?? 0;

    expect(alignedColumnClassOccurrences).toBeGreaterThanOrEqual(3);
  });
});
