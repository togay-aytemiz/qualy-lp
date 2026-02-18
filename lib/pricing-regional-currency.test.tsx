import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

const mockedLanguage = vi.hoisted(() => ({ value: 'en' as 'en' | 'tr' }));
const mockedCurrency = vi.hoisted(() => ({ value: 'USD' as 'TRY' | 'USD' }));

vi.mock('../LanguageContext', () => ({
  useLanguage: () => ({ language: mockedLanguage.value }),
}));

vi.mock('../lib/pricing-currency', () => ({
  resolvePricingCurrencyFromBrowser: () => mockedCurrency.value,
}));

import Pricing from '../components/Pricing';

describe('pricing regional currency', () => {
  it('shows USD values for non-TR regions', () => {
    mockedLanguage.value = 'en';
    mockedCurrency.value = 'USD';
    const html = renderToStaticMarkup(<Pricing />);

    expect(html).toContain('USD / month');
    expect(html).toContain('>9.99<');
    expect(html).toContain('>26.99<');
    expect(html).not.toContain('TRY / month');
  });

  it('keeps TRY values for TR regions', () => {
    mockedLanguage.value = 'en';
    mockedCurrency.value = 'TRY';
    const html = renderToStaticMarkup(<Pricing />);

    expect(html).toContain('TRY / month');
    expect(html).toContain('>349<');
    expect(html).toContain('>949<');
    expect(html).not.toContain('USD / month');
  });

  it('uses currency independent from UI language', () => {
    mockedLanguage.value = 'tr';
    mockedCurrency.value = 'USD';
    const html = renderToStaticMarkup(<Pricing />);

    expect(html).toContain('USD / ay');
    expect(html).toContain('>9.99<');
    expect(html).toContain('kredi / ay');
  });
});
