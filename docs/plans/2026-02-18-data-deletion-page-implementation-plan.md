# Data Deletion Page Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a public `/data-deletion` page with simple bilingual (TR + EN) instructions and full static/runtime SEO wiring.

**Architecture:** Add a dedicated React route component for runtime rendering, and a static route entry HTML for crawlability. Extend SEO route mapping and sitemap generation so canonical/meta and discovery stay consistent with existing route conventions.

**Tech Stack:** React, TypeScript, Vite multi-input static entries, Vitest, Node sitemap script.

---

### Task 1: Write Failing Tests First

**Files:**
- Modify: `lib/seo.test.ts`
- Modify: `lib/seo-static-entry-pages.test.ts`
- Modify: `lib/sitemap.test.ts`
- Create: `lib/data-deletion-route.test.ts`

1. Add expectations for `/data-deletion` route key mapping in SEO tests.
2. Add canonical URL assertion for `data-deletion/index.html` in static entry SEO test.
3. Add sitemap location assertion for `/data-deletion`.
4. Add route rendering assertion in `App.tsx` source inspection test.
5. Run `npm test` and confirm failures reference missing route/page additions.

### Task 2: Implement Runtime Route and Page

**Files:**
- Create: `pages/DataDeletionPage.tsx`
- Modify: `App.tsx`

1. Build a simple, easy-to-read page component with Turkish and English sections.
2. Add `/data-deletion` route condition in `App.tsx` and render the new page with existing navbar/footer layout.

### Task 3: Implement Static SEO Entry and Route Wiring

**Files:**
- Create: `data-deletion/index.html`
- Modify: `lib/seo.ts`
- Modify: `scripts/generate-sitemap.mjs`
- Modify: `vite.config.ts`

1. Add static route entry HTML with unique title, description, canonical, OG, Twitter, and JSON-LD.
2. Extend `SeoRouteKey`, `SEO_COPY` (TR + EN), `ROUTE_PATHS`, and `getSeoRouteKeyByPath`.
3. Add `/data-deletion` to sitemap script entries.
4. Add `data-deletion/index.html` to Vite multi-input build.

### Task 4: Verify End-to-End

**Files:**
- No code changes expected

1. Run `npm test`.
2. Run `npm run verify:perf`.
3. Resolve any regressions and rerun verification commands until green.
