import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

describe('home rendering behavior', () => {
  it('does not gate home content behind fixed 2500ms timeout', () => {
    const appPath = path.join(process.cwd(), 'App.tsx');
    const source = readFileSync(appPath, 'utf8');

    expect(source).not.toContain('2500');
    expect(source).not.toContain('setTimeout');
  });
});

