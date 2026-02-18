import { describe, expect, it } from 'vitest';
import {
  resolvePricingCurrencyByRegionSignals,
  type PricingCurrency,
} from './pricing-currency';

const expectCurrency = (
  locales: readonly string[],
  timeZone: string | undefined,
  expected: PricingCurrency,
) => {
  expect(resolvePricingCurrencyByRegionSignals({ locales, timeZone })).toBe(expected);
};

describe('resolvePricingCurrencyByRegionSignals', () => {
  it('returns TRY only for Turkey timezone signal', () => {
    expectCurrency(['en-US'], 'Europe/Istanbul', 'TRY');
  });

  it('returns USD for non-Turkey timezone even with Turkish locale', () => {
    expectCurrency(['tr-TR'], 'America/New_York', 'USD');
    expectCurrency(['en-US'], 'America/New_York', 'USD');
    expectCurrency(['de-DE'], 'Europe/Berlin', 'USD');
    expectCurrency([], undefined, 'USD');
  });
});
