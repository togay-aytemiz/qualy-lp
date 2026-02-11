import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

describe('media loading strategy', () => {
  it('marks challenge images as lazy + async', () => {
    const source = readFileSync(path.join(process.cwd(), 'components', 'Challenges.tsx'), 'utf8');

    expect(source).toContain('loading="lazy"');
    expect(source).toContain('decoding="async"');
    expect(source).toContain('fetchPriority="low"');
  });
});

