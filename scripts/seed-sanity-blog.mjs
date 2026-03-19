import fs from 'node:fs/promises';
import path from 'node:path';
import {buildCategoryDocuments, categoryDefinitions} from './sanity-blog-categories.mjs';

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
  const categoryDocuments = buildCategoryDocuments();
  const getCategoryIdBySlug = (slug) => {
    const category = categoryDefinitions.find((entry) => entry.slug === slug);

    if (!category) {
      throw new Error(`Missing Sanity category definition for slug: ${slug}`);
    }

    return category.id;
  };

  const seedPosts = [
    {
      translationKey: 'qualy-ready-replies-knowledge-base',
      categorySlug: 'practical-guide',
      entries: [
        {
          id: 'post.qualy-ready-replies-knowledge-base.tr',
          language: 'tr',
          title: 'Hazir yanitlar ve bilgi tabani ile cevap kalitesini nasil sabitledik',
          slug: 'hazir-yanitlar-bilgi-tabani-cevap-kalitesi',
          excerpt: 'Hazir yanitlar, bilgi tabani dokumanlari ve net takip kurallari ile daha tutarli musteri cevaplarini nasil elde ettigimizi anlatiyoruz.',
          seoTitle: 'Hazir yanitlar ve bilgi tabani ile cevap kalitesi | Qualy',
          seoDescription: 'Hazir yanitlar, bilgi tabani ve takip akislari ile daha tutarli musteri cevaplari olusturmanin pratik yolunu inceleyin.',
          publishedAt: '2026-03-19T09:00:00.000Z',
          bodyMarkdown: [
            '# Neden bu akisi kurduk?',
            '',
            "Qualy'de buyume hizlandikca ayni musteri sorusu farkli kisilerden farkli kalitede cevap almaya basladi. Bunu azaltmak icin hazir yanitlari, bilgi tabani dokumanlarini ve takip kurallarini tek bir cevap katmaninda birlestirdik.",
            '',
            '## Neyi degistirdik?',
            '',
            '- Sik gelen sorular icin hazir yanitlari tek yerde topladik.',
            '- Hizmet, fiyatlama ve surec detaylarini bilgi tabani dokumanlarina tasidik.',
            "- AI'nin eksik bilgi gordugu noktalarda kisa takip sorulari sormasini sagladik.",
            '',
            '## Sonuc ne oldu?',
            '',
            '- Ilk yanit daha hizli cikmaya basladi.',
            '- Ekipler ayni dilde kaldi.',
            '- Insan devralmasi gerektiren gorusmeler daha net ayristi.',
            '',
            'Daha fazla baglam icin [ozellikler](/#features) ve [fiyatlandirma](/pricing) sayfalarina bakabilirsiniz.',
          ].join('\n'),
        },
        {
          id: 'post.qualy-ready-replies-knowledge-base.en',
          language: 'en',
          title: 'How we stabilized response quality with ready replies and a knowledge base',
          slug: 'ready-replies-knowledge-base-response-quality',
          excerpt: 'A practical look at how ready replies, knowledge base documents, and follow-up rules helped us keep customer answers more consistent.',
          seoTitle: 'Ready replies and knowledge base response quality | Qualy',
          seoDescription: 'Learn how Qualy combines ready replies, knowledge base documents, and follow-up rules to keep customer responses more consistent.',
          publishedAt: '2026-03-19T09:00:00.000Z',
          bodyMarkdown: [
            '# Why we set this up',
            '',
            'As the product grew, the same customer question could receive different quality depending on who answered it. We reduced that drift by combining ready replies, knowledge base documents, and follow-up rules in one response layer.',
            '',
            '## What changed?',
            '',
            '- We grouped recurring questions into reusable ready replies.',
            '- We moved service, pricing, and process details into a structured knowledge base.',
            '- We let the AI ask short follow-up questions when key context was missing.',
            '',
            '## What improved?',
            '',
            '- The first answer now goes out faster.',
            '- Teams stay closer to the same tone.',
            '- Human takeover is easier to spot when the conversation needs it.',
            '',
            'You can continue with [features](/en/#features) and [pricing](/en/pricing) for more context.',
          ].join('\n'),
        },
      ],
    },
    {
      translationKey: 'qualy-blog-launch-post',
      categorySlug: 'platform-release',
      entries: [
        {
          id: 'post.qualy-blog-launch-post.tr',
          language: 'tr',
          title: "Qualy blog'u yayina alirken neleri optimize ettik",
          slug: 'qualy-blog-yayin-optimizasyonu',
          excerpt: "Qualy blog'unu hiz, teknik SEO ve dogru ic link yapisiyla nasil yayina aldigimizi ozetliyoruz.",
          seoTitle: 'Qualy blog yayin optimizasyonu',
          seoDescription: "Qualy blog'unun performans, teknik SEO ve ic link kurgusunu nasil kurdugumuzu inceleyin.",
          publishedAt: '2026-03-18T12:00:00.000Z',
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
        },
        {
          id: 'post.qualy-blog-launch-post.en',
          language: 'en',
          title: 'How we launched the Qualy blog without hurting performance',
          slug: 'qualy-blog-launch-performance',
          excerpt: 'A quick look at the static routing, technical SEO, and internal linking decisions behind the Qualy blog launch.',
          seoTitle: 'Launching the Qualy blog without hurting performance',
          seoDescription: 'See how the Qualy blog launch used static routes, technical SEO, and internal links to support growth.',
          publishedAt: '2026-03-18T12:00:00.000Z',
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
        },
      ],
    },
  ];

  return [
    ...categoryDocuments,
    ...seedPosts.flatMap((postGroup) =>
      postGroup.entries.map((entry) => ({
        _id: entry.id,
        _type: 'post',
        language: entry.language,
        translationKey: postGroup.translationKey,
        title: entry.title,
        slug: {_type: 'slug', current: entry.slug},
        excerpt: entry.excerpt,
        seoTitle: entry.seoTitle,
        seoDescription: entry.seoDescription,
        publishedAt: entry.publishedAt,
        bodyMarkdown: entry.bodyMarkdown,
        category: {_type: 'reference', _ref: getCategoryIdBySlug(postGroup.categorySlug)},
      }))
    ),
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
