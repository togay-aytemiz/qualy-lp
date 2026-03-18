# Hidden Strapi Blog Integration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add direct-access blog routes at `/blog`, `/en/blog`, `/blog/:slug`, and `/en/blog/:slug` backed by Strapi, without adding navbar/footer links and without allowing Google indexing yet.

**Architecture:** Fetch published blog content from Strapi during prebuild, generate real static route entry HTML files for the blog index and each post slug, and write JSON artifacts for the React pages to render at runtime. Keep blog URLs out of the sitemap and ship `noindex,follow` on both index and post pages until launch; use runtime SEO only for routes whose metadata can be computed safely without overwriting generated post-level tags.

**Tech Stack:** React, TypeScript, Vite multi-input static entries, Node build scripts, Vitest, Strapi REST API.

---

### Task 1: Lock Hidden Blog Constraints in Tests

**Files:**
- Create: `lib/blog-route.test.ts`
- Create: `lib/blog-navigation-visibility.test.ts`
- Create: `lib/blog-build.test.ts`
- Create: `lib/blog-index-page-content.test.tsx`
- Create: `lib/blog-post-page-content.test.tsx`
- Modify: `lib/seo.test.ts`
- Modify: `lib/seo-dom.test.ts`
- Modify: `lib/seo-static-entry-pages.test.ts`
- Modify: `lib/font-delivery.test.ts`
- Modify: `lib/sitemap.test.ts`

1. Add a source-inspection route test that asserts `App.tsx` recognizes `/blog`, `/en/blog`, `/blog/:slug`, and `/en/blog/:slug`, and renders `<BlogIndexPage />` plus `<BlogPostPage />`.
2. Add a navigation visibility regression test that asserts `components/Navbar.tsx` and `components/Footer.tsx` do not contain `/blog` or `/en/blog`.
3. Extend `lib/seo.test.ts` to cover `blogIndex` route mapping, blog index canonical paths, and blog index `noindex,follow` robots behavior.
4. Extend `lib/seo-dom.test.ts` to verify a blog SEO payload replaces the robots tag with `noindex,follow` and preserves canonical plus alternates.
5. Add pure helper tests in `lib/blog-build.test.ts` for Strapi payload normalization, duplicate slug handling, localized route generation, and `noindex` HTML rendering.
6. Add React content tests for `pages/BlogIndexPage.tsx` and `pages/BlogPostPage.tsx` using fixture props instead of live fetches.
7. Extend `lib/seo-static-entry-pages.test.ts` and `lib/font-delivery.test.ts` for `blog/index.html` and `en/blog/index.html`.
8. Extend `lib/sitemap.test.ts` to assert blog URLs stay absent while the hidden phase is active.
9. Run `npm test` and confirm failures point to missing blog route, SEO, page, and generator pieces.
10. Commit:

```bash
git add lib/blog-route.test.ts lib/blog-navigation-visibility.test.ts lib/blog-build.test.ts lib/blog-index-page-content.test.tsx lib/blog-post-page-content.test.tsx lib/seo.test.ts lib/seo-dom.test.ts lib/seo-static-entry-pages.test.ts lib/font-delivery.test.ts lib/sitemap.test.ts
git commit -m "test: lock hidden strapi blog behavior"
```

### Task 2: Define the Blog Data Contract and Build Helpers

**Files:**
- Create: `lib/blog.ts`
- Create: `lib/blog-build.ts`
- Test: `lib/blog-build.test.ts`

1. Define exact blog types in `lib/blog.ts`:
   `BlogLocale`, `BlogPostSummary`, `BlogPostRecord`, `BlogManifest`, `BlogIndexCopy`, and route helper types.
2. Define the required Strapi fields in one place:
   `title`, `slug`, `excerpt`, `content`, `seoTitle`, `seoDescription`, `publishedAt`, `coverImage`, `locale`, and `localizations`.
3. In `lib/blog-build.ts`, add pure helpers for:
   `normalizeStrapiBlogResponse`, `groupLocalizedPosts`, `buildBlogManifest`, `getBlogIndexPath`, `getBlogPostPath`, `renderBlogEntryHtml`, and `getBlogPostSeo`.
4. Make `renderBlogEntryHtml` emit the full static head needed by this repo:
   `title`, `description`, `canonical`, `og:*`, `twitter:*`, JSON-LD, self-hosted font CSS link, and `meta name="robots" content="noindex,follow"`.
5. Make the build helpers reject duplicate localized slugs and reject missing `slug`, `title`, or `publishedAt` once Strapi mode is enabled.
6. Keep localized index labels page-local later, but keep path/SEO helpers shared here.
7. Run `npm test -- lib/blog-build.test.ts -v` and confirm the pure helper layer passes before touching scripts or pages.
8. Commit:

```bash
git add lib/blog.ts lib/blog-build.ts lib/blog-build.test.ts
git commit -m "feat: add blog data and build helpers"
```

### Task 3: Implement a Fail-Soft Strapi Prebuild Generator

**Files:**
- Create: `scripts/generate-blog-assets.mjs`
- Modify: `package.json`
- Modify: `AGENTS.md`

1. Add a dedicated generator script that fetches published posts from Strapi with server-only env vars:
   `STRAPI_BASE_URL`, `STRAPI_API_TOKEN`, and optional `STRAPI_BLOG_ENABLED`.
2. Use a concrete REST query shape in the script, for example:
   `/api/blog-posts?publicationState=live&locale=all&sort[0]=publishedAt:desc&populate[coverImage]=*&populate[localizations]=*`
3. Make the script fail soft when keys are not ready:
   if `STRAPI_BLOG_ENABLED` is false or required env vars are missing, generate empty hidden blog index pages plus an empty manifest and exit successfully.
4. Make the script fail hard when Strapi mode is explicitly enabled but fetch or payload validation fails.
5. Generate these artifacts:
   `public/blog_manifest.json`,
   `public/blog-posts/tr/<slug>.json`,
   `public/blog-posts/en/<slug>.json`,
   `blog/index.html`,
   `en/blog/index.html`,
   `blog/<slug>/index.html`,
   `en/blog/<slug>/index.html`.
6. Update `package.json` so build-time ordering is:
   `blog:generate` -> `legal:generate` -> `seo:generate` -> `vite build`.
7. Add a safe local workflow entry:
   either `predev: npm run blog:generate` or document `npm run blog:generate` as the first local step before opening `/blog`.
8. Update `AGENTS.md` to document the exception for intentionally hidden routes:
   routes marked `noindex` and intentionally absent from navigation must not be added to the sitemap until launch.
9. Run:

```bash
npm run blog:generate
```

Expected:
- exit code `0`
- `blog/index.html` and `en/blog/index.html` exist
- `public/blog_manifest.json` exists even with no API keys

10. Commit:

```bash
git add scripts/generate-blog-assets.mjs package.json AGENTS.md
git commit -m "feat: add fail-soft strapi blog generator"
```

### Task 4: Implement Runtime Blog Pages and Route Handling

**Files:**
- Create: `pages/BlogIndexPage.tsx`
- Create: `pages/BlogPostPage.tsx`
- Modify: `App.tsx`
- Test: `lib/blog-route.test.ts`
- Test: `lib/blog-index-page-content.test.tsx`
- Test: `lib/blog-post-page-content.test.tsx`

1. Build `pages/BlogIndexPage.tsx` as a self-contained page that:
   accepts optional `initialPosts` for tests,
   falls back to `fetch('/blog_manifest.json')` at runtime,
   filters by locale,
   renders an empty state when no posts exist,
   and does not add any header/footer links.
2. Build `pages/BlogPostPage.tsx` as a self-contained page that:
   accepts `slug` plus optional `initialPost` for tests,
   fetches `/blog-posts/<locale>/<slug>.json` at runtime,
   renders a not-found state when the JSON is missing,
   and applies post SEO only after post data has loaded.
3. Update `App.tsx` with:
   lazy imports for `BlogIndexPage` and `BlogPostPage`,
   route booleans for `/blog` and `/en/blog`,
   post-route parsing for `/blog/:slug` and `/en/blog/:slug`,
   standard `Navbar` + `Footer` shell rendering for both blog page types.
4. Make the top-level SEO effect skip post-route fallback behavior so direct entry does not replace correct static post tags with home SEO during hydration.
5. Keep `components/Navbar.tsx` and `components/Footer.tsx` unchanged.
6. Run:

```bash
npm test -- lib/blog-route.test.ts lib/blog-index-page-content.test.tsx lib/blog-post-page-content.test.tsx -v
```

Expected:
- blog route source test passes
- content tests pass with fixtures

7. Commit:

```bash
git add pages/BlogIndexPage.tsx pages/BlogPostPage.tsx App.tsx
git commit -m "feat: add hidden blog pages and route handling"
```

### Task 5: Wire Static SEO, Vite Inputs, and Hidden Launch Rules

**Files:**
- Create: `blog/index.html`
- Create: `en/blog/index.html`
- Modify: `lib/seo.ts`
- Modify: `vite.config.ts`
- Modify: `scripts/generate-sitemap.mjs`
- Test: `lib/seo.test.ts`
- Test: `lib/seo-dom.test.ts`
- Test: `lib/seo-static-entry-pages.test.ts`
- Test: `lib/font-delivery.test.ts`
- Test: `lib/sitemap.test.ts`

1. Add `blogIndex` to `SeoRouteKey`.
2. Extend `SEO_COPY`, `ROUTE_PATHS`, and `getSeoRouteKeyByPath()` for `/blog` and `/en/blog`.
3. Add route-aware robots behavior in `lib/seo.ts` so `blogIndex` returns `noindex,follow` while existing public pages keep their current indexable default.
4. Add a separate helper for dynamic post SEO instead of forcing post routes into the static route-key model.
5. Create checked-in static entry files for `blog/index.html` and `en/blog/index.html` so the route exists before post generation and stays covered by static entry tests.
6. Update `vite.config.ts` to:
   keep the existing explicit inputs,
   add `blog/index.html` and `en/blog/index.html`,
   and dynamically discover generated `blog/**/index.html` and `en/blog/**/index.html` post inputs before build.
7. Keep `scripts/generate-sitemap.mjs` blog-aware but launch-hidden:
   default behavior must omit `/blog`, `/en/blog`, and post URLs while the blog is non-indexable.
8. Do not add a `/blog` disallow rule to `robots.txt`; rely on page-level `noindex` so crawlers can actually see the directive.
9. Run:

```bash
npm test -- lib/seo.test.ts lib/seo-dom.test.ts lib/seo-static-entry-pages.test.ts lib/font-delivery.test.ts lib/sitemap.test.ts -v
```

Expected:
- blog index SEO tests pass
- static entry tests pass for the fixed index routes
- sitemap tests confirm blog omission

10. Commit:

```bash
git add blog/index.html en/blog/index.html lib/seo.ts vite.config.ts scripts/generate-sitemap.mjs
git commit -m "feat: add hidden blog seo and static entry wiring"
```

### Task 6: Full Verification and Manual Route Checks

**Files:**
- No code changes expected

1. Run the full suite:

```bash
npm test
npm run verify:perf
```

2. If either command fails, fix only the specific regressions and rerun both commands until green.
3. Run a local smoke check:

```bash
npm run blog:generate
npm run dev
```

4. Manually verify:
   `/blog` loads,
   `/en/blog` loads,
   one generated `/blog/<slug>` route loads when Strapi data exists,
   navbar and footer still contain no blog entry,
   view-source for blog routes shows `noindex,follow`,
   `public/sitemap.xml` contains no blog URLs.
5. Commit:

```bash
git add .
git commit -m "chore: verify hidden strapi blog integration"
```

### Implementation Notes

- Keep the first cut lean: no blog category filters, no search, no pagination, no related posts, and no CMS-driven navbar/footer links.
- Prefer Strapi-to-static generation at build time over client-side Strapi fetching; it matches the repo’s `404` fallback and prevents broken direct slug access.
- Do not switch `public/_redirects` back to a `200` SPA fallback.
- When the blog is ready for indexing later, the launch diff should only need:
  `robots` from `noindex,follow` to `index,follow`,
  sitemap inclusion enabled,
  optional navigation exposure,
  and updated AGENTS guidance if the hidden exception is removed.
