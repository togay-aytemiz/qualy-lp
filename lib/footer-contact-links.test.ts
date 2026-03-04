import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

describe('footer contact links', () => {
  it('renders contact heading with email and phone on separate rows', () => {
    const footer = readFileSync(path.join(process.cwd(), 'components', 'Footer.tsx'), 'utf8');

    expect(footer).toContain('{t.footer.contact}');
    expect(footer).toContain('mailto:askqualy@gmail.com');
    expect(footer).toContain('tel:+905074699692');
    expect(footer).toContain('askqualy@gmail.com');
    expect(footer).toContain('+90 507 469 9692');
    expect(footer).toContain('<Mail className="h-4 w-4 text-slate-500" />');
    expect(footer).toContain('<Phone className="h-4 w-4 text-slate-500" />');
    expect(footer).toContain('className="flex items-center gap-2 transition-colors hover:text-slate-900"');
  });
});
