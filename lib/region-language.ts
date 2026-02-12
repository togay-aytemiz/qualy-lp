export type SupportedLanguage = 'en' | 'tr';
export type SupportedHomePath = '/' | '/en';

const TURKEY_REGION = 'tr';
const ISTANBUL_TIMEZONE_SEGMENT = '/istanbul';

const getLocaleRegion = (locale?: string) => {
  if (!locale) return '';

  const normalized = locale.toLowerCase().replace('_', '-');
  const [, region = ''] = normalized.split('-').filter(Boolean);
  return region;
};

export function languageFromLocale(locale?: string): SupportedLanguage {
  if (getLocaleRegion(locale) === TURKEY_REGION) {
    return 'tr';
  }

  return 'en';
}

export function resolveLanguageByRegion(
  locales: readonly string[] = [],
  timeZone?: string
): SupportedLanguage {
  for (const locale of locales) {
    if (languageFromLocale(locale) === 'tr') {
      return 'tr';
    }
  }

  const normalizedTimeZone = timeZone?.toLowerCase();
  if (normalizedTimeZone?.endsWith(ISTANBUL_TIMEZONE_SEGMENT)) {
    return 'tr';
  }

  return 'en';
}

export const homePathByLanguage = (language: SupportedLanguage): SupportedHomePath =>
  language === 'tr' ? '/' : '/en';

export const resolveHomePathByRegion = (
  locales: readonly string[] = [],
  timeZone?: string,
): SupportedHomePath => homePathByLanguage(resolveLanguageByRegion(locales, timeZone));
