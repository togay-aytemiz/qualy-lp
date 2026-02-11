import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

describe('features section content and layout', () => {
  it('uses a five-feature grid and adds the profile extraction block', () => {
    const featuresSource = readFileSync(path.join(process.cwd(), 'components', 'Features.tsx'), 'utf8');

    expect(featuresSource).toContain('title={t.features.feat1_title}');
    expect(featuresSource).toContain('title={t.features.feat2_title}');
    expect(featuresSource).toContain('title={t.features.feat3_title}');
    expect(featuresSource).toContain('title={t.features.feat4_title}');
    expect(featuresSource).toContain('t.features.feat5_title');
    expect(featuresSource).toContain('t.features.feat5_desc');
    expect(featuresSource).toContain('lg:col-span-6');
  });

  it('uses customer-focused Turkish copy in features intro', () => {
    const languageContext = readFileSync(path.join(process.cwd(), 'LanguageContext.tsx'), 'utf8');

    expect(languageContext).toContain('yalnızca doğru konuşmalara odaklanmanızı sağlar');
    expect(languageContext).toContain('feat5_title');
    expect(languageContext).not.toContain('MVP için yerleşik kontrol katmanı');
  });
});
