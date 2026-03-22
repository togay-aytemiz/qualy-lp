import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

describe('blog navigation visibility', () => {
  it('renders blog routes in the navbar and footer', () => {
    const navbarSource = readFileSync(path.join(process.cwd(), 'components', 'Navbar.tsx'), 'utf8');
    const footerSource = readFileSync(path.join(process.cwd(), 'components', 'Footer.tsx'), 'utf8');

    expect(navbarSource).toContain('/blog');
    expect(navbarSource).toContain('/en/blog');
    expect(footerSource).toContain('/blog');
    expect(footerSource).toContain('/en/blog');
  });
});
