import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const LEGAL_DIR = path.join(ROOT, 'legal');
const OUTPUT_PATH = path.join(ROOT, 'public', 'legal_versions.json');
const PREFERRED_ORDER = ['terms', 'privacy'];
const FRONTMATTER_REGEX = /^---\s*[\r\n]+([\s\S]*?)\r?\n---\s*[\r\n]*/;

const normalizeValue = (value) =>
  String(value).trim().replace(/^"+|"+$/g, '').replace(/^'+|'+$/g, '');

const parseFrontmatter = (raw, file) => {
  const match = raw.match(FRONTMATTER_REGEX);
  if (!match) {
    throw new Error(`Missing frontmatter in ${file}.`);
  }

  const data = match[1]
    .split(/\r?\n/)
    .filter(Boolean)
    .reduce((acc, line) => {
      const [key, ...rest] = line.split(':');
      if (!key || rest.length === 0) return acc;
      acc[key.trim()] = normalizeValue(rest.join(':'));
      return acc;
    }, {});

  const id = (data.id ?? '').trim();
  const version = (data.version ?? '').trim();
  const lastUpdated = (data.last_updated ?? '').trim();
  const locale = (data.locale ?? 'en').trim().toLowerCase();

  if (!id || !version || !lastUpdated) {
    throw new Error(`Missing required frontmatter fields in ${file}. Needed: id, version, last_updated.`);
  }
  if (locale !== 'en' && locale !== 'tr') {
    throw new Error(`Invalid locale in ${file}. Expected "en" or "tr".`);
  }

  return { id, locale, version, last_updated: lastUpdated };
};

const sortDocs = (docs) => {
  return [...docs].sort((a, b) => {
    const aIndex = PREFERRED_ORDER.indexOf(a.id);
    const bIndex = PREFERRED_ORDER.indexOf(b.id);

    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;

    return a.id.localeCompare(b.id, 'en');
  });
};

const buildManifest = (docs) =>
  docs.reduce((acc, doc) => {
    acc[doc.id] = { version: doc.version, last_updated: doc.last_updated };
    return acc;
  }, {});

const main = async () => {
  const entries = await fs.readdir(LEGAL_DIR);
  const markdownFiles = entries.filter((file) => file.endsWith('.md') && file !== 'README.md');

  const docs = [];

  for (const file of markdownFiles) {
    const raw = await fs.readFile(path.join(LEGAL_DIR, file), 'utf8');
    const parsed = parseFrontmatter(raw, file);
    if (parsed.locale === 'en') {
      docs.push(parsed);
    }
  }

  const manifest = buildManifest(sortDocs(docs));

  await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await fs.writeFile(OUTPUT_PATH, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  console.log(`Generated ${OUTPUT_PATH}`);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
