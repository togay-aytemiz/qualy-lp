import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

describe('navbar mobile trust badge', () => {
  it('renders the Meta trust badge inside the mobile menu overlay in title case', () => {
    const navbarSource = readFileSync(path.join(process.cwd(), 'components', 'Navbar.tsx'), 'utf8');

    expect(navbarSource).toContain('{/* Mobile Trust Badge */}');
    expect(navbarSource).toContain('mx-auto inline-flex items-center rounded-full border border-slate-200');
    expect(navbarSource).toContain('text-[18px] font-semibold tracking-[-0.01em] text-slate-800');
    expect(navbarSource).toContain('text-[11px] font-semibold tracking-[0.08em] text-slate-500');
    expect(navbarSource).toContain('Tech Provider');
  });
});
