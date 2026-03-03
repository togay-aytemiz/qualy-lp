import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

describe('footer payment band', () => {
  it('renders iyzico payment band asset in footer', () => {
    const footerSource = readFileSync(path.join(process.cwd(), 'components', 'Footer.tsx'), 'utf8');

    expect(footerSource).toContain('data-payment-band="iyzico"');
    expect(footerSource).toContain('/payment-logos/iyzico/footer/iyzico-payment-band-colored.svg');
  });
});
