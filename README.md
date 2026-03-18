<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1TY5GCsjTnxkO2_hfl_8OVmdR9OcTwN1D

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Sanity Blog Setup

This project generates the hidden blog statically during `predev` and `prebuild`.

Sanity Studio lives in `/sanity-studio`.

Useful commands:

- `npm run sanity:dev`
- `npm run sanity:build`
- `npm run sanity:seed`
- `npm run sanity:seed:categories`

Required env vars for blog generation:

- `SANITY_BLOG_ENABLED=true`
- `SANITY_PROJECT_ID=<sanity-project-id>`
- `SANITY_DATASET=<dataset-name>`

Optional env vars:

- `SANITY_API_TOKEN=<read-token-for-private-datasets>`
- `SANITY_API_VERSION=2026-03-01`
- `SANITY_DEFAULT_LOCALE=tr`

Recommended Sanity fields for each `post` document:

- `language`
- `translationKey`
- `title`
- `slug`
- `excerpt`
- `seoTitle`
- `seoDescription`
- `publishedAt`
- `bodyMarkdown`
- `coverImage`
- `category`

Recommended Sanity fields for each `category` document:

- `titleTr`
- `titleEn`
- `slug`
- `descriptionTr`
- `descriptionEn`

The included seed script creates:

- `category.product-updates`
- one Turkish `post`
- one English `post`

TR and EN siblings share the same `translationKey`, so the site can group them as localized versions of the same article.
