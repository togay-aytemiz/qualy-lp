import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

describe('mobile accessibility regression guards', () => {
  it('gives navbar mobile menu toggle a programmatic name and expanded state', () => {
    const navbar = readFileSync(path.join(process.cwd(), 'components', 'Navbar.tsx'), 'utf8');

    expect(navbar).toContain('aria-label={isMobileMenuOpen ? t.navbar.closeMenu : t.navbar.openMenu}');
    expect(navbar).toContain('aria-expanded={isMobileMenuOpen}');
    expect(navbar).toContain('aria-controls="mobile-navigation-menu"');
    expect(navbar).toContain('id="mobile-navigation-menu"');
  });

  it('keeps hero chat participant label out of heading hierarchy', () => {
    const hero = readFileSync(path.join(process.cwd(), 'components', 'Hero.tsx'), 'utf8');

    expect(hero).toContain('<p className="font-bold text-slate-900 text-sm">{activeScenario?.name}</p>');
    expect(hero).not.toContain('<h3 className="font-bold text-slate-900 text-sm">{activeScenario?.name}</h3>');
  });

  it('uses stronger contrast tokens for the day chip and footer locale links', () => {
    const hero = readFileSync(path.join(process.cwd(), 'components', 'Hero.tsx'), 'utf8');
    const footer = readFileSync(path.join(process.cwd(), 'components', 'Footer.tsx'), 'utf8');

    expect(hero).toContain('text-[10px] font-bold text-gray-700 uppercase tracking-wider bg-gray-100');
    expect(hero).not.toContain('text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-100');

    expect(footer).toContain("language === 'en' ? 'text-black' : 'text-slate-600 hover:text-slate-900'");
    expect(footer).toContain("language === 'tr' ? 'text-black' : 'text-slate-600 hover:text-slate-900'");
    expect(footer).toContain("aria-current={language === 'en' ? 'page' : undefined}");
    expect(footer).toContain("aria-current={language === 'tr' ? 'page' : undefined}");
  });
});
