export type PricingCurrency = 'TRY' | 'USD';

type PricingRegionSignals = {
  locales?: readonly string[];
  timeZone?: string;
};

const ISTANBUL_TIMEZONE_SEGMENT = '/istanbul';

export const resolvePricingCurrencyByRegionSignals = ({
  locales: _locales = [],
  timeZone,
}: PricingRegionSignals): PricingCurrency => {
  const normalizedTimeZone = timeZone?.toLowerCase();
  if (normalizedTimeZone?.endsWith(ISTANBUL_TIMEZONE_SEGMENT)) {
    return 'TRY';
  }

  return 'USD';
};

export const resolvePricingCurrencyFromBrowser = (): PricingCurrency => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return 'USD';
  }

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return resolvePricingCurrencyByRegionSignals({ timeZone });
};
