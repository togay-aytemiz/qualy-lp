import { describe, expect, it } from 'vitest';
import { AUTH_URLS } from './auth-links';
import { languageFromLocale, resolveLanguageByRegion } from './region-language';

describe('AUTH_URLS', () => {
  it('uses app.askqualy.com login and register endpoints', () => {
    expect(AUTH_URLS.login).toBe('https://app.askqualy.com/login');
    expect(AUTH_URLS.register).toBe('https://app.askqualy.com/register');
  });
});

describe('languageFromLocale', () => {
  it('returns Turkish for Turkish locale values', () => {
    expect(languageFromLocale('tr')).toBe('tr');
    expect(languageFromLocale('tr-TR')).toBe('tr');
    expect(languageFromLocale('en-TR')).toBe('tr');
  });

  it('defaults to English for non-Turkish locales', () => {
    expect(languageFromLocale('en-US')).toBe('en');
    expect(languageFromLocale('de-DE')).toBe('en');
  });
});

describe('resolveLanguageByRegion', () => {
  it('picks Turkish when locale list includes Turkey', () => {
    expect(resolveLanguageByRegion(['en-US', 'tr-TR'], 'America/New_York')).toBe('tr');
  });

  it('falls back to Turkish for Istanbul timezone', () => {
    expect(resolveLanguageByRegion(['en-US'], 'Europe/Istanbul')).toBe('tr');
  });

  it('defaults to English when no Turkish signal exists', () => {
    expect(resolveLanguageByRegion(['en-US'], 'America/New_York')).toBe('en');
    expect(resolveLanguageByRegion([], '')).toBe('en');
  });
});
