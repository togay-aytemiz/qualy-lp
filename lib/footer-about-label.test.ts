import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

describe('footer about label', () => {
  it('uses Hakkimizda label in Turkish footer copy', () => {
    const languageContext = readFileSync(path.join(process.cwd(), 'LanguageContext.tsx'), 'utf8');

    expect(languageContext).toContain('about: "Hakkımızda"');
    expect(languageContext).not.toContain('about: "Hakkında"');
  });
});
