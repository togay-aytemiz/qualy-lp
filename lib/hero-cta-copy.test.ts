import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

describe('hero cta and turkish copy', () => {
  it('renders primary + secondary hero ctas and includes demo modal flow', () => {
    const hero = readFileSync(path.join(process.cwd(), 'components', 'Hero.tsx'), 'utf8');

    expect(hero).toContain('{t.hero.ctaPrimary}');
    expect(hero).toContain('{t.hero.ctaSecondary}');
    expect(hero).not.toContain('t.hero.status');
    expect(hero).not.toContain('AUTH_URLS.login');
    expect(hero).toContain('const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);');
    expect(hero).toContain('const [demoFormData, setDemoFormData] = useState<DemoFormData>(');
    expect(hero).toContain('if (!trimmedFullName) {');
    expect(hero).toContain('if (!trimmedEmail && !trimmedPhone) {');
    expect(hero).toContain('const mailtoHref = `mailto:askqualy@gmail.com');
    expect(hero).toContain('window.location.href = mailtoHref;');
    expect(hero).toContain('role="dialog"');
    expect(hero).toContain('{t.hero.demoModal.title}');
    expect(hero).toContain('{t.hero.demoModal.contactHint}');
    expect(hero).toContain("const heroChannelLogos = [");
    expect(hero).toContain("logo: '/whatsapp.svg'");
    expect(hero).toContain("logo: '/instagram.svg'");
    expect(hero).toContain("logo: '/Telegram.svg'");
    expect(hero).toContain("logo: '/messenger.svg'");
    expect(hero).toContain('{t.hero.connects}');
    expect(hero).toContain('dangerouslySetInnerHTML={{ __html: t.hero.subheadline }}');
  });

  it('keeps Turkish hero copy free from mixed-language technical phrases', () => {
    const languageContext = readFileSync(path.join(process.cwd(), 'LanguageContext.tsx'), 'utf8');

    expect(languageContext).toContain('ctaSecondary: "Plan a Demo"');
    expect(languageContext).toContain('ctaSecondary: "Demo Planla"');
    expect(languageContext).toContain('title: "Plan a Demo"');
    expect(languageContext).toContain('title: "Demo Planla"');
    expect(languageContext).toContain('contactHint: "Email or phone (at least one is required)"');
    expect(languageContext).toContain('contactHint: "E-posta veya telefon (en az biri zorunlu)"');
    expect(languageContext).not.toContain('Yetenekler ve Bilgi Bankası');
    expect(languageContext).not.toContain('Skills + Bilgi Bankası');
    expect(languageContext).toContain('headline: "Herkese değil, doğru müşteriye odaklan."');
    expect(languageContext).toContain('mesajları otomatik yanıtlar</span>');
    expect(languageContext).toContain('>önceliklendirir</span>');
  });
});
