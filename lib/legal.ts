import { marked } from 'marked';
import {
  buildLegalVersionManifest,
  parseLegalFrontmatter,
  sortLegalDocs,
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

const parsedDocs: LegalDoc[] = sortLegalDocs(
  Object.entries(rawDocs)
    .filter(([path]) => !path.endsWith('README.md'))
    .map(([path, raw]) => {
      const doc = parseLegalFrontmatter(raw as string, path);
      return {
        ...doc,
        html: marked.parse(doc.body) as string,
      };
    })
);

export const legalDocs = parsedDocs;
export const legalDocSlugs = new Set(parsedDocs.map((doc) => doc.slug));
export const legalManifest = buildLegalVersionManifest(parsedDocs);

export const getLegalDoc = (slug: string) => parsedDocs.find((doc) => doc.slug === slug);
