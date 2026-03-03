import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

describe('data deletion password copy', () => {
  it('uses explicit Qualy account password wording', () => {
    const source = readFileSync(path.join(process.cwd(), 'pages', 'DataDeletionPage.tsx'), 'utf8');

    expect(source).toContain("'Enter your Qualy account password and confirm with Delete now.'");
    expect(source).toContain("'Qualy hesap sifreni gir ve Simdi sil ile onayla.'");
    expect(source).not.toContain("'Enter your password and confirm with Delete now.'");
  });
});
