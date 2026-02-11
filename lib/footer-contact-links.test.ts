import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

describe('footer contact links', () => {
  it('exposes clickable email and phone contact links', () => {
    const footer = readFileSync(path.join(process.cwd(), 'components', 'Footer.tsx'), 'utf8');

    expect(footer).toContain('mailto:askqualy@gmail.com');
    expect(footer).toContain('askqualy@gmail.com');
    expect(footer).toContain('tel:+905074699692');
    expect(footer).toContain('+90 507 469 9692');
  });
});
