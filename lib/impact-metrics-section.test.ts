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

  it('renders in-wrapper conversion cta with only a primary button', () => {
    const impactMetricsSource = readFileSync(path.join(process.cwd(), 'components', 'ImpactMetrics.tsx'), 'utf8');
    const languageContextSource = readFileSync(path.join(process.cwd(), 'LanguageContext.tsx'), 'utf8');

    expect(impactMetricsSource).toContain('{t.impactMetrics.ctaText}');
    expect(impactMetricsSource).toContain('{t.impactMetrics.ctaPrimary}');
    expect(impactMetricsSource).toContain('href={AUTH_URLS.register}');
    expect(impactMetricsSource).not.toContain('t.impactMetrics.ctaSecondary');
    expect(languageContextSource).toContain('ctaText: "Ready to grow your results with Qualy?"');
    expect(languageContextSource).toContain('ctaText: "Qualy ile sonuçlarını büyütmeye hazır mısın?"');
    expect(languageContextSource).toContain('ctaPrimary: "Start Free Trial"');
    expect(languageContextSource).toContain('ctaPrimary: "Ücretsiz denemeni başlat"');
  });
});
