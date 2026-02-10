import { describe, expect, it } from 'vitest';
import { buildLegalVersionManifest, parseLegalFrontmatter, sortLegalDocs } from './legal-utils';

describe('parseLegalFrontmatter', () => {
  it('parses required fields and strips title heading from body', () => {
    const raw = `---\nid: "terms"\nversion: "v1.2"\nlast_updated: "2026-02-10"\ndocument_title: "Terms of Service"\n---\n# Terms of Service\n\nLine one.`;

    const doc = parseLegalFrontmatter(raw, 'terms.md');

    expect(doc.id).toBe('terms');
    expect(doc.slug).toBe('terms');
    expect(doc.version).toBe('v1.2');
    expect(doc.lastUpdated).toBe('2026-02-10');
    expect(doc.title).toBe('Terms of Service');
    expect(doc.body.startsWith('Line one.')).toBe(true);
  });

  it('throws when id is missing', () => {
    const raw = `---\nversion: "v1.0"\nlast_updated: "2026-02-10"\n---\nBody`;

    expect(() => parseLegalFrontmatter(raw, 'privacy.md')).toThrow(/Missing "id"/);
  });
});

describe('sortLegalDocs', () => {
  it('puts preferred legal docs first', () => {
    const sorted = sortLegalDocs([
      { id: 'z-custom', slug: 'z-custom', title: 'Z Custom', version: 'v1.0', lastUpdated: '2026-02-10', body: 'a' },
      { id: 'privacy', slug: 'privacy', title: 'Privacy Policy', version: 'v1.0', lastUpdated: '2026-02-10', body: 'a' },
      { id: 'terms', slug: 'terms', title: 'Terms of Service', version: 'v1.0', lastUpdated: '2026-02-10', body: 'a' },
    ]);

    expect(sorted.map((doc) => doc.slug)).toEqual(['terms', 'privacy', 'z-custom']);
  });
});

describe('buildLegalVersionManifest', () => {
  it('creates public manifest keyed by slug', () => {
    const manifest = buildLegalVersionManifest([
      { id: 'terms', slug: 'terms', title: 'Terms', version: 'v1.0', lastUpdated: '2026-02-10', body: '' },
      { id: 'privacy', slug: 'privacy', title: 'Privacy', version: 'v1.1', lastUpdated: '2026-02-11', body: '' },
    ]);

    expect(manifest).toEqual({
      terms: { version: 'v1.0', last_updated: '2026-02-10' },
      privacy: { version: 'v1.1', last_updated: '2026-02-11' },
    });
  });
});
