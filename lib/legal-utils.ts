export type ParsedLegalDoc = {
  id: string;
  slug: string;
  title: string;
  version: string;
  lastUpdated: string;
  body: string;
};

export const preferredLegalOrder = ['terms', 'privacy'];

const FRONTMATTER_REGEX = /^---\s*[\r\n]+([\s\S]*?)\r?\n---\s*[\r\n]*/;

const normalizeValue = (value: string) =>
  value.trim().replace(/^"+|"+$/g, '').replace(/^'+|'+$/g, '');

export const parseLegalFrontmatter = (raw: string, sourcePath = 'unknown.md'): ParsedLegalDoc => {
  const match = raw.match(FRONTMATTER_REGEX);
  if (!match) {
    throw new Error(`Missing frontmatter in ${sourcePath}.`);
  }

  const data = match[1]
    .split(/\r?\n/)
    .filter(Boolean)
    .reduce<Record<string, string>>((acc, line) => {
      const [key, ...rest] = line.split(':');
      if (!key || rest.length === 0) return acc;
      acc[key.trim()] = normalizeValue(rest.join(':'));
      return acc;
    }, {});

  const id = (data.id ?? '').trim();
  const version = (data.version ?? '').trim();
  const lastUpdated = (data.last_updated ?? '').trim();
  const title = (data.document_title ?? id).trim();

  if (!id) {
    throw new Error(`Missing "id" in frontmatter for ${sourcePath}.`);
  }
  if (!version) {
    throw new Error(`Missing "version" in frontmatter for ${sourcePath}.`);
  }
  if (!lastUpdated) {
    throw new Error(`Missing "last_updated" in frontmatter for ${sourcePath}.`);
  }

  let body = raw.slice(match[0].length).trimStart();
  body = body.replace(/^\s*# [^\n]+\s*\n+/, '').trimStart();

  return {
    id,
    slug: id,
    title,
    version,
    lastUpdated,
    body,
  };
};

export const sortLegalDocs = <T extends { slug: string; title: string }>(docs: T[]): T[] => {
  return [...docs].sort((a, b) => {
    const aIndex = preferredLegalOrder.indexOf(a.slug);
    const bIndex = preferredLegalOrder.indexOf(b.slug);

    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;

    return a.title.localeCompare(b.title, 'en');
  });
};

export const buildLegalVersionManifest = (docs: Array<{ slug: string; version: string; lastUpdated: string }>) => {
  return docs.reduce<Record<string, { version: string; last_updated: string }>>((acc, doc) => {
    acc[doc.slug] = {
      version: doc.version,
      last_updated: doc.lastUpdated,
    };
    return acc;
  }, {});
};
