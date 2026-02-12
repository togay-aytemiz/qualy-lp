import { describe, expect, it } from 'vitest';
import {
  readStoredLanguagePreference,
  resolvePreferredHomePath,
  writeStoredLanguagePreference,
} from './language-preference';

describe('readStoredLanguagePreference', () => {
  it('returns stored language when value is supported', () => {
    const storage = {
      getItem: () => 'tr',
    };

    expect(readStoredLanguagePreference(storage)).toBe('tr');
  });

  it('returns null for unsupported values', () => {
    const storage = {
      getItem: () => 'de',
    };

    expect(readStoredLanguagePreference(storage)).toBeNull();
  });
});

describe('writeStoredLanguagePreference', () => {
  it('writes language choice to storage', () => {
    let storedValue = '';
    const storage = {
      setItem: (_key: string, value: string) => {
        storedValue = value;
      },
    };

    writeStoredLanguagePreference('en', storage);
    expect(storedValue).toBe('en');
  });
});

describe('resolvePreferredHomePath', () => {
  it('prefers explicit stored language over region detection', () => {
    expect(
      resolvePreferredHomePath({
        currentPath: '/',
        storedLanguage: 'tr',
        locales: ['en-US'],
        timeZone: 'America/New_York',
      }),
    ).toBe('/');
  });

  it('keeps explicit /en route when no stored language exists', () => {
    expect(
      resolvePreferredHomePath({
        currentPath: '/en',
        storedLanguage: null,
        locales: ['tr-TR'],
        timeZone: 'Europe/Istanbul',
      }),
    ).toBeNull();
  });

  it('uses region fallback from root route when no stored language exists', () => {
    expect(
      resolvePreferredHomePath({
        currentPath: '/',
        storedLanguage: null,
        locales: ['en-US'],
        timeZone: 'America/New_York',
      }),
    ).toBe('/en');
  });
});
