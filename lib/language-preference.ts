import {
  homePathByLanguage,
  resolveHomePathByRegion,
  type SupportedHomePath,
  type SupportedLanguage,
} from './region-language';

export const LANGUAGE_PREFERENCE_STORAGE_KEY = 'qualy:preferred-language';

type ReadableStorage = Pick<Storage, 'getItem'>;
type WritableStorage = Pick<Storage, 'setItem'>;

const isSupportedLanguage = (value: string | null): value is SupportedLanguage =>
  value === 'en' || value === 'tr';

export const readStoredLanguagePreference = (
  storage?: ReadableStorage | null,
): SupportedLanguage | null => {
  if (!storage) return null;

  try {
    const value = storage.getItem(LANGUAGE_PREFERENCE_STORAGE_KEY);
    return isSupportedLanguage(value) ? value : null;
  } catch {
    return null;
  }
};

export const writeStoredLanguagePreference = (
  language: SupportedLanguage,
  storage?: WritableStorage | null,
): void => {
  if (!storage) return;

  try {
    storage.setItem(LANGUAGE_PREFERENCE_STORAGE_KEY, language);
  } catch {
    // Intentionally ignore storage errors (private mode, blocked storage, etc.).
  }
};

type ResolvePreferredHomePathInput = {
  currentPath: SupportedHomePath;
  storedLanguage: SupportedLanguage | null;
  locales: readonly string[];
  timeZone?: string;
};

export const resolvePreferredHomePath = ({
  currentPath,
  storedLanguage,
  locales,
  timeZone,
}: ResolvePreferredHomePathInput): SupportedHomePath | null => {
  if (storedLanguage) {
    return homePathByLanguage(storedLanguage);
  }

  if (currentPath === '/en') {
    return null;
  }

  return resolveHomePathByRegion(locales, timeZone);
};
