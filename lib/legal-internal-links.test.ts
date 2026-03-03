import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

describe('legal markdown internal links', () => {
  it('does not hardcode askqualy host for internal legal routes', () => {
    const legalDir = path.join(process.cwd(), 'legal');
    const markdownFiles = readdirSync(legalDir).filter((file) => file.endsWith('.md') && file !== 'README.md');

    const forbiddenPattern = /https:\/\/askqualy\.com\/(terms|privacy|kvkk|pre-information|distance-sales-agreement|cancellation-refund|subscription-trial)\b/;

    for (const file of markdownFiles) {
      const source = readFileSync(path.join(legalDir, file), 'utf8');
      expect(source, `Found hardcoded internal host in ${file}`).not.toMatch(forbiddenPattern);
    }
  });
});
