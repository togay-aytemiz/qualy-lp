import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

describe('index.html critical path', () => {
  it('does not include runtime tailwind CDN script', () => {
    const html = readFileSync(path.join(process.cwd(), 'index.html'), 'utf8');
    expect(html).not.toContain('https://cdn.tailwindcss.com');
  });

  it('does not include legacy importmap block', () => {
    const html = readFileSync(path.join(process.cwd(), 'index.html'), 'utf8');
    expect(html).not.toContain('type="importmap"');
  });
});

