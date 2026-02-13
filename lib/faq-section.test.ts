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

  it('defines FAQ copy in both locales and includes trial/demo actions', () => {
    const languageContext = readFileSync(path.join(process.cwd(), 'LanguageContext.tsx'), 'utf8');
    const faqSource = readFileSync(path.join(process.cwd(), 'components', 'FAQ.tsx'), 'utf8');
    const trStart = languageContext.indexOf('tr: {');
    const trFaqStart = languageContext.indexOf('faq: {', trStart);
    const trFaqEnd = languageContext.indexOf('footer: {', trFaqStart);
    const trFaqBlock = languageContext.slice(trFaqStart, trFaqEnd);

    expect(languageContext).toContain('faq: {');
    expect(languageContext).toContain('title: "Frequently Asked Questions"');
    expect(languageContext).toContain('title: "Sıkça Sorulan Sorular"');
    expect(languageContext).toContain('question: "What exactly does Qualy do?"');
    expect(languageContext).toContain('question: "Qualy tam olarak ne yapıyor?"');
    expect(languageContext).toContain('en sık sorulan soruları burada bulabilirsin');
    expect(languageContext).toContain('secondary: "Plan a Demo"');
    expect(languageContext).toContain('secondary: "Demo Planla"');
    expect(languageContext).toContain('question: "Qualy müşterileri nasıl puanlıyor ve önceliklendiriyor?"');
    expect(languageContext).toContain("question: \"Qualy'i kullanmaya başlamak için teknik bilgi gerekiyor mu?\"");
    expect(languageContext).toContain('yüklediğin bilgileri kullanarak');
    expect(trFaqBlock).not.toContain('lead');
    expect(trFaqBlock).not.toContain('Lead');
    expect(trFaqBlock).not.toContain('MVP');
    expect(trFaqBlock).not.toContain('roadmap');
    expect(trFaqBlock).not.toContain('Roadmap');
    expect(trFaqBlock).not.toContain('aday');
    expect(trFaqBlock).not.toContain('Aday');

    expect(faqSource).toContain('href={AUTH_URLS.register}');
    expect(faqSource).toContain('{t.hero.ctaSecondary}');
    expect(faqSource).toContain('const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);');
    expect(faqSource).toContain('const [demoFormData, setDemoFormData] = useState<DemoFormData>(');
    expect(faqSource).toContain('if (!trimmedFullName) {');
    expect(faqSource).toContain('if (!trimmedEmail && !trimmedPhone) {');
    expect(faqSource).toContain('const mailtoHref = `mailto:askqualy@gmail.com');
    expect(faqSource).toContain('window.location.href = mailtoHref;');
    expect(faqSource).toContain('role="dialog"');
    expect(faqSource).toContain('{t.hero.demoModal.title}');
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
