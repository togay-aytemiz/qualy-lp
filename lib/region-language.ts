export type SupportedLanguage = 'en' | 'tr';

const TURKEY_REGION = 'tr';
const ISTANBUL_TIMEZONE_SEGMENT = '/istanbul';

export function languageFromLocale(locale?: string): SupportedLanguage {
  if (!locale) {
    return 'en';
  }

  const normalized = locale.toLowerCase().replace('_', '-');
  const parts = normalized.split('-').filter(Boolean);

  if (parts[0] === TURKEY_REGION || parts[1] === TURKEY_REGION) {
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
