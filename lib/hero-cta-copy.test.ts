import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

describe('hero cta and turkish copy', () => {
  it('renders only the primary cta and removes top status chip from Hero', () => {
    const hero = readFileSync(path.join(process.cwd(), 'components', 'Hero.tsx'), 'utf8');

    expect(hero).toContain('{t.hero.ctaPrimary}');
    expect(hero).not.toContain('t.hero.ctaSecondary');
    expect(hero).not.toContain('t.hero.status');
    expect(hero).not.toContain('AUTH_URLS.login');
  });

  it('uses "Yetenekler" wording in Turkish hero copy', () => {
    const languageContext = readFileSync(path.join(process.cwd(), 'LanguageContext.tsx'), 'utf8');

    expect(languageContext).toContain('Yetenekler + Bilgi Bankası');
    expect(languageContext).not.toContain('Skills + Bilgi Bankası');
  });
});
