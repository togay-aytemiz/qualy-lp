import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

describe('footer trust link', () => {
  it('does not include a security and trust link in legal links', () => {
    const footerSource = readFileSync(path.join(process.cwd(), 'components', 'Footer.tsx'), 'utf8');

    expect(footerSource).not.toContain('t.footer.securityTrust');
  });
});
