import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT_DIR = process.cwd();
const ENV_FILES = ['.env', '.env.local'];
const DEFAULT_API_VERSION = '2026-03-01';

async function loadEnvironmentFiles() {
  for (const fileName of ENV_FILES) {
    const filePath = path.join(ROOT_DIR, fileName);

    try {
      const raw = await fs.readFile(filePath, 'utf8');
      for (const line of raw.split(/\r?\n/)) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;

        const separatorIndex = trimmed.indexOf('=');
        if (separatorIndex === -1) continue;

        const key = trimmed.slice(0, separatorIndex).trim();
        const value = trimmed.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, '');

        if (key && process.env[key] === undefined) {
          process.env[key] = value;
        }
      }
    } catch (error) {
      if (error?.code !== 'ENOENT') {
        throw error;
      }
    }
  }
}

function getConfig() {
  const projectId = String(process.env.SANITY_PROJECT_ID || '').trim();
  const dataset = String(process.env.SANITY_DATASET || '').trim();
  const token = String(process.env.SANITY_API_TOKEN || process.env.SANITY_API_KEY || '').trim();
  const apiVersion = String(process.env.SANITY_API_VERSION || DEFAULT_API_VERSION).trim() || DEFAULT_API_VERSION;

  if (!projectId || !dataset || !token) {
    throw new Error('SANITY_PROJECT_ID, SANITY_DATASET, and SANITY_API_TOKEN or SANITY_API_KEY are required.');
  }

  return {projectId, dataset, token, apiVersion};
}

function buildSeedDocuments() {
  const publishedAt = '2026-03-18T12:00:00.000Z';
  const categoryId = 'category.product-updates';
  const translationKey = 'qualy-blog-launch-post';

  return [
    {
      _id: categoryId,
      _type: 'category',
      title: 'Product Updates',
      slug: {_type: 'slug', current: 'product-updates'},
      description: 'Launch notes, roadmap updates, and practical rollout stories.',
    },
    {
      _id: 'post.qualy-blog-launch-post.tr',
      _type: 'post',
      language: 'tr',
      translationKey,
      title: "Qualy blog'u yayina alirken neleri optimize ettik",
      slug: {_type: 'slug', current: 'qualy-blog-yayin-optimizasyonu'},
      excerpt: "Qualy blog'unu hiz, teknik SEO ve dogru ic link yapisiyla nasil yayina aldigimizi ozetliyoruz.",
      seoTitle: "Qualy blog yayin optimizasyonu",
      seoDescription: "Qualy blog'unun performans, teknik SEO ve ic link kurgusunu nasil kurdugumuzu inceleyin.",
      publishedAt,
      bodyMarkdown: [
        '# Blog yayin notlari',
        '',
        "Qualy blog'unu, landing page ile ayni statik mimariyi koruyarak yayinladik.",
        '',
        '## Neleri duzelttik?',
        '',
        '- Blog index ve detay sayfalari artik statik olarak uretiliyor.',
        '- Teknik SEO alanlari her yazi icin build sirasinda yaziliyor.',
        '- Ic linkler landing page ve diger blog yazilarina dogrudan baglaniyor.',
        '',
        'Daha fazla detay icin [fiyatlandirma](/pricing) sayfasina ve [blog arsivi](/blog) sayfasina bakabilirsiniz.',
      ].join('\n'),
      category: {_type: 'reference', _ref: categoryId},
    },
    {
      _id: 'post.qualy-blog-launch-post.en',
      _type: 'post',
      language: 'en',
      translationKey,
      title: 'How we launched the Qualy blog without hurting performance',
      slug: {_type: 'slug', current: 'qualy-blog-launch-performance'},
      excerpt: 'A quick look at the static routing, technical SEO, and internal linking decisions behind the Qualy blog launch.',
      seoTitle: 'Launching the Qualy blog without hurting performance',
      seoDescription: 'See how the Qualy blog launch used static routes, technical SEO, and internal links to support growth.',
      publishedAt,
      bodyMarkdown: [
        '# Launch notes',
        '',
        'We launched the Qualy blog on top of the existing landing page architecture instead of adding a separate app.',
        '',
        '## What changed?',
        '',
        '- Blog index and post pages are generated as static routes.',
        '- SEO metadata is generated per article during the build.',
        '- Internal links now point to landing pages and related blog entries.',
        '',
        'You can continue with [pricing](/en/pricing) or browse the [English blog feed](/en/blog).',
      ].join('\n'),
      category: {_type: 'reference', _ref: categoryId},
    },
  ];
}

async function mutateDocuments({projectId, dataset, token, apiVersion}, documents) {
  const url = `https://${projectId}.api.sanity.io/v${apiVersion}/data/mutate/${dataset}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      mutations: documents.map((document) => ({createOrReplace: document})),
      returnIds: true,
      returnDocuments: false,
      visibility: 'sync',
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Sanity seed failed with ${response.status} ${response.statusText}: ${errorText}`);
  }

  return response.json();
}

async function main() {
  await loadEnvironmentFiles();
  const config = getConfig();
  const documents = buildSeedDocuments();
  const result = await mutateDocuments(config, documents);
  const ids = Array.isArray(result?.results) ? result.results.map((entry) => entry.id).filter(Boolean) : [];

  console.log(`Seeded ${documents.length} Sanity documents into ${config.projectId}/${config.dataset}.`);
  if (ids.length > 0) {
    console.log(`Document IDs: ${ids.join(', ')}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
