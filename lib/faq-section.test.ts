import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

describe('faq section', () => {
  it('lazy loads FAQ and renders it before CTA on the home page', () => {
    const appSource = readFileSync(path.join(process.cwd(), 'App.tsx'), 'utf8');

    expect(appSource).toContain("lazy(() => import('./components/FAQ'))");

    const faqRenderIndex = appSource.indexOf('<FAQ />');
    const ctaRenderIndex = appSource.indexOf('<CTA />');

    expect(faqRenderIndex).toBeGreaterThan(-1);
    expect(ctaRenderIndex).toBeGreaterThan(-1);
    expect(faqRenderIndex).toBeLessThan(ctaRenderIndex);
  });

  it('defines FAQ copy in both locales and includes trial/contact actions', () => {
    const languageContext = readFileSync(path.join(process.cwd(), 'LanguageContext.tsx'), 'utf8');
    const faqSource = readFileSync(path.join(process.cwd(), 'components', 'FAQ.tsx'), 'utf8');

    expect(languageContext).toContain('faq: {');
    expect(languageContext).toContain('title: "Frequently Asked Questions"');
    expect(languageContext).toContain('title: "Sıkça Sorulan Sorular"');
    expect(languageContext).toContain('question: "What exactly does this platform do?"');
    expect(languageContext).toContain('question: "Bu platform tam olarak ne yapar?"');
    expect(languageContext).toContain('secondary: "Bize Ulaş"');
    expect(languageContext).toContain('question: "Aday puanlaması nasıl çalışır?"');
    expect(languageContext).not.toContain('question: "Lead skorlama nasıl çalışır?"');
    expect(languageContext).not.toContain('MVP\'de WhatsApp, Instagram ve Telegram');

    expect(faqSource).toContain('href={AUTH_URLS.register}');
    expect(faqSource).toContain('mailto:askqualy@gmail.com');
    expect(faqSource).toContain('t.faq.items.map');
    expect(faqSource).toContain('SectionWithHeader');
    expect(faqSource).not.toContain('t.faq.eyebrow');
    expect(faqSource).toContain('rounded-full bg-slate-900');
    expect(faqSource).toContain('shadow-[0_10px_24px_rgba(15,23,42,0.18)]');
    expect(faqSource).toContain('rounded-full border border-slate-300');
    expect(faqSource).not.toContain('rounded-xl bg-slate-900');

    const buttonsIndex = faqSource.indexOf('href={AUTH_URLS.register}');
    const cardIndex = faqSource.indexOf('overflow-hidden rounded-3xl border border-slate-200 bg-white');
    expect(buttonsIndex).toBeGreaterThan(-1);
    expect(cardIndex).toBeGreaterThan(-1);
    expect(buttonsIndex).toBeLessThan(cardIndex);
  });
});
