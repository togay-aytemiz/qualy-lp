import { describe, expect, it } from 'vitest';
import { getLegalDoc, getLegalDocs, legalDocSlugs } from './legal';

describe('localized legal docs', () => {
  it('returns Turkish terms when locale is tr', () => {
    const doc = getLegalDoc('terms', 'tr');

    expect(doc?.title).toBe('Hizmet Şartları');
    expect(doc?.body).toMatch(/Bu Hizmet Şartları/);
  });

  it('returns English privacy when locale is en', () => {
    const doc = getLegalDoc('privacy', 'en');

    expect(doc?.title).toBe('Privacy Policy');
    expect(doc?.body).toMatch(/This Privacy Policy explains/);
  });

  it('returns one doc per slug in index list', () => {
    const docs = getLegalDocs('tr');

    expect(docs.map((doc) => doc.slug)).toEqual(['terms', 'privacy']);
    expect(legalDocSlugs.has('terms')).toBe(true);
    expect(legalDocSlugs.has('privacy')).toBe(true);
  });
});
