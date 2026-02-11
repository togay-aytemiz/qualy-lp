import { describe, expect, it } from 'vitest';
import { getSiteUrl, normalizeBaseUrl, resolveAbsoluteUrl } from './site-url';

describe('normalizeBaseUrl', () => {
  it('trims trailing slash', () => {
    expect(normalizeBaseUrl('https://askqualy.com/')).toBe('https://askqualy.com');
  });

  it('keeps clean urls unchanged', () => {
    expect(normalizeBaseUrl('https://askqualy.com')).toBe('https://askqualy.com');
  });
});

describe('getSiteUrl', () => {
  it('prioritizes configured env site url', () => {
    expect(getSiteUrl({ envSiteUrl: 'https://lp.askqualy.com/' })).toBe('https://lp.askqualy.com');
  });

  it('falls back to production default in production mode', () => {
    expect(getSiteUrl({ mode: 'production', envSiteUrl: '' })).toBe('https://askqualy.com');
  });

  it('falls back to localhost in non-production mode', () => {
    expect(getSiteUrl({ mode: 'development', envSiteUrl: '' })).toBe('http://localhost:3000');
  });
});

describe('resolveAbsoluteUrl', () => {
  it('builds absolute urls from base and path', () => {
    expect(resolveAbsoluteUrl('https://askqualy.com/', '/terms')).toBe('https://askqualy.com/terms');
  });

  it('normalizes missing leading slash on path', () => {
    expect(resolveAbsoluteUrl('https://askqualy.com', 'privacy')).toBe('https://askqualy.com/privacy');
  });
});

