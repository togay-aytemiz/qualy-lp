import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

describe('challenges copy and cta', () => {
  it('keeps auto-rotating role progress with reset on click and no challenges cta button', () => {
    const challengesSource = readFileSync(path.join(process.cwd(), 'components', 'Challenges.tsx'), 'utf8');

    expect(challengesSource).toContain('const AUTO_ROTATE_INTERVAL_MS = 8000;');
    expect(challengesSource).toContain("const [progressKey, setProgressKey] = useState(0);");
    expect(challengesSource).toContain('setProgressKey((prev) => prev + 1);');
    expect(challengesSource).toContain('window.setTimeout(() => {');
    expect(challengesSource).toContain('key={`challenge-progress-${activeIndex}-${progressKey}`}');
    expect(challengesSource).toContain('transition={{ duration: AUTO_ROTATE_INTERVAL_MS / 1000, ease: \'linear\' }}');
    expect(challengesSource).not.toContain('href={AUTH_URLS.register}');
    expect(challengesSource).not.toContain('{t.challenges.ctaPrimary}');
  });

  it('uses trial-conversion-focused challenge copy in Turkish', () => {
    const languageContext = readFileSync(path.join(process.cwd(), 'LanguageContext.tsx'), 'utf8');

    expect(languageContext).toContain('title_part2: "Qualy farkını canlı gör"');
    expect(languageContext).toContain('Kendi iş akışına en yakın rolü aç ve Qualy\'nin mesaj yükünü nasıl azaltıp daha çok sonuç ürettiğini gör.');
    expect(languageContext).toContain('Daha az mesaj, daha net fırsat.');
    expect(languageContext).toContain("ctaHint: \"Rolünü seç, Qualy'nin daha çok randevu getiren akışını gör ve ücretsiz denemeyi başlat.\"");
    expect(languageContext).toContain('ctaPrimary: "Ücretsiz dene"');
  });
});
