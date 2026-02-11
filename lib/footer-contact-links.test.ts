import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

describe('footer contact links', () => {
  it('exposes clickable email and phone contact links', () => {
    const footer = readFileSync(path.join(process.cwd(), 'components', 'Footer.tsx'), 'utf8');

    expect(footer).toContain('mailto:askqualy@gmail.com');
    expect(footer).toContain('tel:+905074699692');
    expect(footer).toContain('inline-flex h-9 w-9 items-center justify-center rounded-full');
    expect(footer).toContain('<Mail className="h-3.5 w-3.5 text-slate-500" />');
    expect(footer).toContain('<Phone className="h-3.5 w-3.5 text-slate-500" />');
    expect(footer).not.toContain('<span>askqualy@gmail.com</span>');
    expect(footer).not.toContain('<span>+90 507 469 9692</span>');
  });
});
