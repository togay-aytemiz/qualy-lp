import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

describe('impact metrics section', () => {
  it('lazy loads the impact metrics section component', () => {
    const appSource = readFileSync(path.join(process.cwd(), 'App.tsx'), 'utf8');

    expect(appSource).toContain('lazy(() => import(\'./components/ImpactMetrics\'))');
  });

  it('renders impact metrics between challenges and features', () => {
    const appSource = readFileSync(path.join(process.cwd(), 'App.tsx'), 'utf8');

    const challengesIndex = appSource.indexOf('<Challenges />');
    const impactMetricsIndex = appSource.indexOf('<ImpactMetrics />');
    const featuresIndex = appSource.indexOf('<Features />');

    expect(challengesIndex).toBeGreaterThan(-1);
    expect(impactMetricsIndex).toBeGreaterThan(-1);
    expect(featuresIndex).toBeGreaterThan(-1);
    expect(challengesIndex).toBeLessThan(impactMetricsIndex);
    expect(impactMetricsIndex).toBeLessThan(featuresIndex);
  });

  it('renders in-wrapper conversion cta with primary + demo buttons and demo modal flow', () => {
    const impactMetricsSource = readFileSync(path.join(process.cwd(), 'components', 'ImpactMetrics.tsx'), 'utf8');
    const languageContextSource = readFileSync(path.join(process.cwd(), 'LanguageContext.tsx'), 'utf8');

    expect(impactMetricsSource).toContain('{t.impactMetrics.ctaText}');
    expect(impactMetricsSource).toContain('{t.impactMetrics.ctaPrimary}');
    expect(impactMetricsSource).toContain('{t.impactMetrics.disclaimer}');
    expect(impactMetricsSource).toContain('whitespace-pre-line');
    expect(impactMetricsSource).toContain('{t.hero.ctaSecondary}');
    expect(impactMetricsSource).toContain('href={AUTH_URLS.register}');
    expect(impactMetricsSource).toContain('const [isDemoModalOpen, setIsDemoModalOpen] = React.useState(false);');
    expect(impactMetricsSource).toContain('const [demoFormData, setDemoFormData] = React.useState<DemoFormData>(');
    expect(impactMetricsSource).toContain('if (!trimmedFullName) {');
    expect(impactMetricsSource).toContain('if (!trimmedEmail && !trimmedPhone) {');
    expect(impactMetricsSource).toContain('const mailtoHref = `mailto:askqualy@gmail.com');
    expect(impactMetricsSource).toContain('window.location.href = mailtoHref;');
    expect(impactMetricsSource).toContain('role="dialog"');
    expect(impactMetricsSource).toContain('{t.hero.demoModal.title}');
    expect(languageContextSource).toContain('ctaText: "Ready to grow your results with Qualy?"');
    expect(languageContextSource).toContain('ctaText: "Qualy ile sonuçlarını\\nbüyütmeye hazır mısın?"');
    expect(languageContextSource).toContain('ctaPrimary: "Start Free Trial"');
    expect(languageContextSource).toContain('ctaPrimary: "Ücretsiz denemeni başlat"');
    expect(languageContextSource).toContain('disclaimer: "These rates represent average improvements observed across businesses using Qualy; results may vary by workflow."');
    expect(languageContextSource).toContain('disclaimer: "Bu oranlar, Qualy kullanan işletmelerde gözlenen ortalama iyileşmeleri temsil eder; sonuçlar iş akışına göre değişebilir."');
  });

  it('uses person-first and sales-focused copy in impact metrics text', () => {
    const languageContextSource = readFileSync(path.join(process.cwd(), 'LanguageContext.tsx'), 'utf8');

    expect(languageContextSource).toContain('subtitle: "İlk yanıt hızından randevuya dönen kişi oranına kadar, daha çok müşteri kazanmanı sağlayan metrikleri birlikte yukarı taşırız."');
    expect(languageContextSource).toContain('label: "Daha fazla satın almaya hazır kişi"');
    expect(languageContextSource).toContain('detail: "Mesajlara saniyeler içinde dönüş yapıldığı için potansiyel müşteriler beklemeden ilerler."');
    expect(languageContextSource).toContain('detail: "Satın almaya en yakın kişiler öne çıkar, doğru kişiye doğru anda dönüş yaparsın."');
    expect(languageContextSource).toContain('detail: "Sık sorulan sorular otomatik yanıtlandığı için aynı şeyleri tekrar tekrar yazmazsın."');
    expect(languageContextSource).toContain('detail: "Düzenli takip, ilgisi yüksek kişilerin daha hızlı randevuya dönmesini sağlar."');
    expect(languageContextSource).toContain('subtitle: "From first-response speed to booked-appointment rate, Qualy improves the metrics that bring you more customers."');
    expect(languageContextSource).toContain('label: "More purchase-ready people"');
    expect(languageContextSource).toContain('detail: "Common questions are answered automatically, so you do not waste time repeating the same replies."');

    expect(languageContextSource).not.toContain('subtitle: "İlk yanıt hızından lead kalitesine kadar, dönüşümü ve ekip verimini etkileyen rakamları birlikte yukarı taşırız."');
    expect(languageContextSource).not.toContain('subtitle: "İlk yanıt hızından nitelikli kişi oranına kadar, SEO ve satış dönüşümünü etkileyen metrikleri birlikte yukarı taşırız."');
    expect(languageContextSource).not.toContain('subtitle: "İlk yanıt hızından nitelikli kişi oranına kadar, dönüşüm ve randevu oranını büyüten metrikleri birlikte yukarı taşırız."');
    expect(languageContextSource).not.toContain('label: "Daha fazla nitelikli lead"');
    expect(languageContextSource).not.toContain('label: "Daha fazla nitelikli kişi"');
    expect(languageContextSource).not.toContain('detail: "İlk seviye otomatik yanıtlar, ekip devralmadan önce bekleme süresini ciddi şekilde düşürür."');
    expect(languageContextSource).not.toContain('subtitle: "From first-response speed to lead quality, Qualy moves the numbers that directly affect revenue and workload."');
    expect(languageContextSource).not.toContain('subtitle: "From first-response speed to qualified-person rate, Qualy improves the SEO and sales metrics that directly affect revenue."');
    expect(languageContextSource).not.toContain('subtitle: "From first-response speed to qualified-person rate, Qualy improves the metrics that directly increase conversion and booked appointments."');
    expect(languageContextSource).not.toContain('label: "More qualified leads"');
    expect(languageContextSource).not.toContain('label: "More qualified people"');
    expect(languageContextSource).not.toContain('Yetenekler ve Bilgi Bankası');
    expect(languageContextSource).not.toContain('Intent scoring');
    expect(languageContextSource).not.toContain('Müşteri skoru');
  });

  it('keeps conversion headline lower to avoid overlap with background curve', () => {
    const impactMetricsSource = readFileSync(path.join(process.cwd(), 'components', 'ImpactMetrics.tsx'), 'utf8');

    expect(impactMetricsSource).toContain('className="mt-20 flex flex-col items-center text-center lg:mt-24 lg:ml-auto lg:items-end lg:text-right"');
    expect(impactMetricsSource).toContain('className="mt-6 flex w-full max-w-xl flex-col items-center justify-center gap-3 sm:flex-row lg:justify-end"');
  });
});
