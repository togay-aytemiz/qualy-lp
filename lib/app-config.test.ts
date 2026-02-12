import { describe, expect, it } from 'vitest';
import { AUTH_URLS } from './auth-links';
import { languageFromLocale, resolveHomePathByRegion, resolveLanguageByRegion } from './region-language';

describe('AUTH_URLS', () => {
  it('uses app.askqualy.com login and register endpoints', () => {
    expect(AUTH_URLS.login).toBe('https://app.askqualy.com/login');
    expect(AUTH_URLS.register).toBe('https://app.askqualy.com/register');
  });
});

describe('languageFromLocale', () => {
  it('returns Turkish only when locale has Turkish region', () => {
    expect(languageFromLocale('tr')).toBe('en');
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
    expect(resolveLanguageByRegion(['tr'], 'America/New_York')).toBe('en');
  });
});

describe('resolveHomePathByRegion', () => {
  it('maps Turkish regions to root home path', () => {
    expect(resolveHomePathByRegion(['tr-TR'], 'America/New_York')).toBe('/');
    expect(resolveHomePathByRegion(['en-US'], 'Europe/Istanbul')).toBe('/');
  });

  it('maps non-Turkish regions to /en', () => {
    expect(resolveHomePathByRegion(['en-US'], 'America/New_York')).toBe('/en');
    expect(resolveHomePathByRegion(['tr'], 'America/New_York')).toBe('/en');
  });
});
