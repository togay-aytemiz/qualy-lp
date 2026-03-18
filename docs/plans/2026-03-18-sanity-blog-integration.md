# Sanity Blog Integration

## Goal

Replace the fail-soft Strapi blog generator with a Sanity-backed static blog pipeline that keeps:

- hidden launch state for `/blog` and `/en/blog`
- build-time generated blog detail routes
- runtime manifest loading from `public/blog_manifest.json`
- locale-specific TR and EN URLs

The content system should also be easy for an external writer tool to push into programmatically.

## Chosen CMS Model

Use Sanity with explicit language fields instead of plugin-managed localization metadata.

Recommended fields on each `post` document:

- `language`: `'tr' | 'en'`
- `translationKey`: string shared by translated siblings
- `title`: string
- `slug`: slug
- `excerpt`: text
- `seoTitle`: string
- `seoDescription`: text
- `publishedAt`: datetime
- `coverImage`: image with `alt`
- `bodyMarkdown`: text
- `category`: reference to `category`

Recommended fields on each `category` document:

- `title`: string
- `slug`: slug

Why this model:

- easiest write path for AI/writer tooling
- no dependency on Sanity-specific localization internals
- deterministic TR/EN pairing through `translationKey`
- clean grouping for `hreflang` alternates during static generation

## Repo Integration

The static blog generator now reads Sanity through the query API and writes:

- `public/blog_manifest.json`
- `public/blog-posts/<locale>/<slug>.json`
- `blog/<slug>/index.html`
- `en/blog/<slug>/index.html`

Required env vars for the site:

- `SANITY_BLOG_ENABLED=true`
- `SANITY_PROJECT_ID=<project id>`
- `SANITY_DATASET=<dataset>`

Optional env vars:

- `SANITY_API_TOKEN=<read token for private dataset>`
- `SANITY_API_KEY=<same purpose as SANITY_API_TOKEN, accepted as alias>`
- `SANITY_API_VERSION=2026-03-01`
- `SANITY_DEFAULT_LOCALE=tr`

Netlify production env vars for this site:

- `SANITY_BLOG_ENABLED=true`
- `SANITY_PROJECT_ID=n55lf918`
- `SANITY_DATASET=production`
- `SANITY_API_KEY=<read token>`

Legacy Strapi env vars should stay removed:

- `STRAPI_API_TOKEN`
- `STRAPI_BASE_URL`
- `STRAPI_BLOG_COLLECTION`
- `STRAPI_BLOG_ENABLED`

## Sanity Setup Steps

1. Create or open the Sanity project.
2. Use a dataset for production content, typically `production`.
3. Add a `post` schema with the fields listed above.
4. Add a `category` schema with `title` and `slug`.
5. Keep `bodyMarkdown` as the canonical body field for the writer tool.
6. If the dataset is private, create a read token for the landing page build.
7. Create a separate write token for the writer tool.
8. Add a Sanity webhook that triggers the Netlify build hook on publish/unpublish.
9. Set the Sanity env vars in Netlify.
10. Publish at least one TR post before expecting `/blog` to render content.

## Writer Tool Contract

For easiest automation, the writer tool should write one document per language while reusing the same `translationKey`.

Recommended upsert flow:

1. Ensure the target `category` exists, keyed by slug.
2. Create or patch the TR document with `_type: 'post'`, `language: 'tr'`, and a stable `translationKey`.
3. Create or patch the EN sibling with the same `translationKey` and `language: 'en'`.
4. Publish both documents after validation.
5. Let the Sanity webhook trigger the Netlify rebuild.

Recommended uniqueness rules in the writer tool:

- `translationKey` must be stable across TR and EN siblings
- `slug` must be unique per document
- `title` should remain locale-specific
- `publishedAt` should be an ISO datetime string
- `bodyMarkdown` should be the canonical long-form body field
- `category` should reference an existing Sanity category document
- `coverImage` is optional for the writer tool, but improves list and detail layouts

Example:

```json
{
  "translationKey": "qualy-ai-memory-guide",
  "language": "tr",
  "title": "Yapay zeka hafizasi nasil yonetilir",
  "slug": "yapay-zeka-hafizasi-nasil-yonetilir",
  "excerpt": "Kalici hafiza ve baglam penceresi arasindaki farklari anlatiyoruz.",
  "seoTitle": "Yapay zeka hafizasi nasil yonetilir | Qualy",
  "seoDescription": "Kalici hafiza, baglam penceresi ve daha iyi AI deneyimi icin pratik bir rehber.",
  "publishedAt": "2026-03-18T12:00:00.000Z",
  "bodyMarkdown": "## Giris\n\nIcerik...",
  "category": {
    "_type": "reference",
    "_ref": "category-ai"
  }
}
```

The EN variant should reuse the same `translationKey` and switch:

- `language` -> `en`
- `slug`
- `title`
- `excerpt`
- `seoTitle`
- `seoDescription`
- `bodyMarkdown`

Suggested mutation payload shape for the writer tool:

```json
{
  "_type": "post",
  "language": "en",
  "translationKey": "qualy-ai-memory-guide",
  "title": "How to manage AI memory",
  "slug": {
    "_type": "slug",
    "current": "how-to-manage-ai-memory"
  },
  "excerpt": "A practical guide to persistent memory, context windows, and better AI workflows.",
  "seoTitle": "How to manage AI memory | Qualy",
  "seoDescription": "Learn the difference between persistent memory and context windows in modern AI systems.",
  "publishedAt": "2026-03-19T09:00:00.000Z",
  "bodyMarkdown": "## Introduction\n\nContent...",
  "category": {
    "_type": "reference",
    "_ref": "category-ai"
  }
}
```

Internal linking guidance for the writer tool:

- Generate links to site URLs, not Sanity document IDs
- Prefer localized links, for example `/blog/...` inside TR content and `/en/blog/...` inside EN content
- Use recent published posts as retrieval context before generating a new article
- Keep the actual links inline inside `bodyMarkdown`
- Optionally store a secondary list of related post slugs in the tool layer if you want to suggest sidebar links later

## Query Model

The build expects published `post` documents with:

- `language`
- `translationKey`
- `slug.current`
- `title`
- `excerpt`
- `seoTitle`
- `seoDescription`
- `publishedAt`
- `bodyMarkdown`
- `coverImage.asset->url`
- `category->{title, slug.current}`

## Current Launch State

The blog remains hidden-launch by design:

- no navbar link
- no footer link
- `noindex,follow` on blog index and posts
- excluded from sitemap

When the blog is ready to contribute to SEO, the launch diff should:

1. switch blog pages from `noindex,follow` to `index,follow`
2. add blog index and detail routes to sitemap generation
3. surface latest blog posts on the landing page
