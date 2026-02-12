import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

describe('pricing navigation links', () => {
  it('routes pricing links to /pricing instead of home hash sections', () => {
    const navbarSource = readFileSync(path.join(process.cwd(), 'components', 'Navbar.tsx'), 'utf8');
    const footerSource = readFileSync(path.join(process.cwd(), 'components', 'Footer.tsx'), 'utf8');

    expect(navbarSource).toContain('href="/pricing"');
    expect(navbarSource).not.toContain('href="#pricing"');

    expect(footerSource).toContain('PRICING_PAGE_HREF');
    expect(footerSource).not.toContain("buildHomeSectionHref('pricing')");
  });

  it('uses a home link for the navbar logo instead of scroll-only behavior', () => {
    const navbarSource = readFileSync(path.join(process.cwd(), 'components', 'Navbar.tsx'), 'utf8');

    expect(navbarSource).toContain('<a href="/"');
    expect(navbarSource).not.toContain("window.scrollTo({ top: 0, behavior: 'smooth' })");
  });
});
