import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

describe('netlify cache headers', () => {
  it('sets immutable caching for hashed asset paths', () => {
    const headers = readFileSync(path.join(process.cwd(), 'public', '_headers'), 'utf8');
    expect(headers).toContain('/assets/*');
    expect(headers).toContain('immutable');
  });

  it('keeps html and legal manifest revalidatable', () => {
    const headers = readFileSync(path.join(process.cwd(), 'public', '_headers'), 'utf8');
    expect(headers).toContain('/*.html');
    expect(headers).toContain('/legal_versions.json');
    expect(headers).toContain('must-revalidate');
  });
});

