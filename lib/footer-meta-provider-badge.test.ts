import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

describe('footer meta provider badge', () => {
  it('renders the same two-line Meta Tech Provider badge used in the header', () => {
    const footerSource = readFileSync(path.join(process.cwd(), 'components', 'Footer.tsx'), 'utf8');

    expect(footerSource).toContain("import { RiMetaFill } from 'react-icons/ri';");
    expect(footerSource).toContain('<RiMetaFill className="h-5 w-5 text-[#0866FF]" aria-hidden="true" />');
    expect(footerSource).toContain('<span className="text-[15px] font-semibold tracking-[-0.01em] text-slate-800">Meta</span>');
    expect(footerSource).toContain('<span className="text-[10px] font-semibold tracking-[0.08em] text-slate-500">Tech Provider</span>');
  });
});
