import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

describe('hero trust strip', () => {
  it('renders a trust strip above the hero headline with meta + verified copy', () => {
    const heroSource = readFileSync(path.join(process.cwd(), 'components', 'Hero.tsx'), 'utf8');

    expect(heroSource).toContain("import { RiMetaFill } from 'react-icons/ri';");
    expect(heroSource).toContain('t.hero.trust.metaProvider');
    expect(heroSource).toContain('t.hero.trust.verifiedIntegration');
    expect(heroSource).toContain('<RiMetaFill');
    expect(heroSource).not.toContain('<Lock');
  });

  it('defines localized trust-strip copy for both Turkish and English', () => {
    const languageContextSource = readFileSync(path.join(process.cwd(), 'LanguageContext.tsx'), 'utf8');

    expect(languageContextSource).toContain('metaProvider: "Official Meta Tech Provider"');
    expect(languageContextSource).toContain('verifiedIntegration: "Verified Integration"');
    expect(languageContextSource).toContain('secureConnection: "Secure connection via official Meta APIs — no channel passwords required"');

    expect(languageContextSource).toContain('metaProvider: "Resmi Meta Tech Provider"');
    expect(languageContextSource).toContain('verifiedIntegration: "Doğrulanmış Entegrasyon"');
    expect(languageContextSource).toContain('secureConnection: "Resmi Meta API akışıyla güvenli bağlantı — kanal şifresi gerekmez"');
  });
});
