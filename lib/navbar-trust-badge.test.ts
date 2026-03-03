import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

describe('navbar trust badge', () => {
  it('renders a larger two-line Meta trust badge next to the logo and hides it on mobile', () => {
    const navbarSource = readFileSync(path.join(process.cwd(), 'components', 'Navbar.tsx'), 'utf8');

    expect(navbarSource).toContain("import { RiMetaFill } from 'react-icons/ri';");
    expect(navbarSource).toContain('<RiMetaFill');
    expect(navbarSource).toContain('<span className="ml-1.5 flex flex-col leading-none">');
    expect(navbarSource).toContain('>Meta</span>');
    expect(navbarSource).toContain('>Tech Provider</span>');
    expect(navbarSource).toContain('text-[10px] font-semibold tracking-[0.08em] text-slate-500');
    expect(navbarSource).not.toContain('text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-500');
    expect(navbarSource).toContain('hidden md:flex');
  });
});
