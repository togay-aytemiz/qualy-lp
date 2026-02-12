import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

describe('faq navigation links', () => {
  it('exposes FAQ anchor links in navbar and footer', () => {
    const navbarSource = readFileSync(path.join(process.cwd(), 'components', 'Navbar.tsx'), 'utf8');
    const footerSource = readFileSync(path.join(process.cwd(), 'components', 'Footer.tsx'), 'utf8');

    expect(navbarSource).toContain("href=\"#faq\"");
    expect(navbarSource).toContain("scrollToSection(e, 'faq')");

    expect(footerSource).toContain("buildHomeSectionHref('faq')");
    expect(footerSource).toContain("scrollToHomeSection(e, 'faq')");
  });
});
