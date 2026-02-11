import { marked } from 'marked';
import {
  buildLegalVersionManifest,
  parseLegalFrontmatter,
  sortLegalDocs,
  type LegalLocale,
  type ParsedLegalDoc,
} from './legal-utils';

export type LegalDoc = ParsedLegalDoc & {
  html: string;
};

marked.setOptions({
  gfm: true,
  breaks: false,
});

const rawDocs = import.meta.glob('../legal/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

const allDocs: LegalDoc[] = Object.entries(rawDocs)
  .filter(([path]) => !path.endsWith('README.md'))
  .map(([path, raw]) => {
    const doc = parseLegalFrontmatter(raw as string, path);
    return {
      ...doc,
      html: marked.parse(doc.body) as string,
    };
  });

const docsBySlug = allDocs.reduce<Map<string, Partial<Record<LegalLocale, LegalDoc>>>>((acc, doc) => {
  const current = acc.get(doc.slug) ?? {};
  current[doc.locale] = doc;
  acc.set(doc.slug, current);
  return acc;
}, new Map());

const isDefined = <T>(value: T | undefined): value is T => value !== undefined;

const pickLocalizedDoc = (slug: string, locale: LegalLocale) => {
  const docSet = docsBySlug.get(slug);
  if (!docSet) return undefined;
  return docSet[locale] ?? docSet.en ?? docSet.tr;
};

export const legalDocSlugs = new Set(docsBySlug.keys());

export const getLegalDoc = (slug: string, locale: LegalLocale = 'en') => pickLocalizedDoc(slug, locale);

export const getLegalDocs = (locale: LegalLocale = 'en') =>
  sortLegalDocs(Array.from(docsBySlug.keys()).map((slug) => pickLocalizedDoc(slug, locale)).filter(isDefined));

// Backward-compatible default export used by list views that do not pass locale.
export const legalDocs = getLegalDocs('en');

const manifestDocs = getLegalDocs('en');
export const legalManifest = buildLegalVersionManifest(manifestDocs);
