import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

describe('navbar mobile cta stack', () => {
  it('places get started and demo buttons as pills, with login at the bottom', () => {
    const navbarSource = readFileSync(path.join(process.cwd(), 'components', 'Navbar.tsx'), 'utf8');

    expect(navbarSource).toContain('{t.hero.ctaSecondary}');
    expect(navbarSource).toContain('openDemoModalFromMobileMenu');
    expect(navbarSource).toContain('rounded-full bg-slate-900');
    expect(navbarSource).toContain('rounded-full border border-slate-300 bg-white');

    const getStartedIndex = navbarSource.lastIndexOf('{t.navbar.getStarted}');
    const demoIndex = navbarSource.lastIndexOf('{t.hero.ctaSecondary}');
    const loginIndex = navbarSource.lastIndexOf('{t.navbar.login}');

    expect(getStartedIndex).toBeGreaterThan(-1);
    expect(demoIndex).toBeGreaterThan(getStartedIndex);
    expect(loginIndex).toBeGreaterThan(demoIndex);
  });
});
