import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

describe('blog navigation visibility', () => {
  it('keeps blog routes out of the navbar and footer', () => {
    const navbarSource = readFileSync(path.join(process.cwd(), 'components', 'Navbar.tsx'), 'utf8');
    const footerSource = readFileSync(path.join(process.cwd(), 'components', 'Footer.tsx'), 'utf8');

    expect(navbarSource).not.toContain('/blog');
    expect(navbarSource).not.toContain('/en/blog');
    expect(footerSource).not.toContain('/blog');
    expect(footerSource).not.toContain('/en/blog');
  });
});
