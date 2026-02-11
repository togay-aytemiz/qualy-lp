import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

describe('motion performance guards', () => {
  it('uses reduced motion hook in heavy animated sections', () => {
    const hero = readFileSync(path.join(process.cwd(), 'components', 'Hero.tsx'), 'utf8');
    const cta = readFileSync(path.join(process.cwd(), 'components', 'CTA.tsx'), 'utf8');
    const stories = readFileSync(path.join(process.cwd(), 'components', 'SuccessStories.tsx'), 'utf8');

    expect(hero).toContain('useReducedMotion');
    expect(cta).toContain('useReducedMotion');
    expect(stories).toContain('useReducedMotion');
  });
});

