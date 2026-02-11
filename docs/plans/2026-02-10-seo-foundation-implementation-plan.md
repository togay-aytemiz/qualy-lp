# SEO Foundation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Strengthen indexability, crawlability, and SERP/share quality for the landing and legal routes without breaking current product messaging or existing legal markdown flows.

**Architecture:** Add a route-aware SEO layer (title, description, canonical, OG/Twitter, JSON-LD), generate crawl assets (`sitemap.xml`, `robots.txt`) at build-time, and remove technical blockers that hurt discoverability. Keep current SPA route structure for this phase; introduce locale URL expansion as a follow-up track.

**Tech Stack:** React + Vite + TypeScript + Vitest + Node build scripts (`scripts/*.mjs`).

---

### Task 1: Add SEO data model with TDD

**Files:**
- Create: `/Users/togay/Desktop/Qualy-lp/lib/seo.ts`
- Create: `/Users/togay/Desktop/Qualy-lp/lib/seo.test.ts`

**Step 1: Write the failing test**
- Add tests for:
- `resolveAbsoluteUrl(baseUrl, path)` with trailing slash normalization.
- Route metadata resolution for `/`, `/legal`, `/terms`, `/privacy`.
- Locale-aware copy fallback (`en` default, `tr` when selected).

**Step 2: Run test to verify it fails**
- Run: `npm test -- lib/seo.test.ts`
- Expected: FAIL because `lib/seo.ts` does not exist.

**Step 3: Write minimal implementation**
- Implement typed SEO config and helpers:
- `type SeoRouteKey = 'home' | 'legalIndex' | 'terms' | 'privacy' | 'notFound'`
- `getSeoByRoute(path, language)`
- `resolveAbsoluteUrl(baseUrl, path)`
- `getCanonicalPath(path)` (strip trailing slash; keep root as `/`)

**Step 4: Run test to verify it passes**
- Run: `npm test -- lib/seo.test.ts`
- Expected: PASS.

---

### Task 2: Add DOM SEO applier (meta + canonical + OG/Twitter + JSON-LD)

**Files:**
- Create: `/Users/togay/Desktop/Qualy-lp/lib/seo-dom.ts`
- Create: `/Users/togay/Desktop/Qualy-lp/lib/seo-dom.test.ts`

**Step 1: Write the failing test**
- Add tests that mount a minimal document and verify:
- `<title>` update.
- `meta[name="description"]`, `meta[name="robots"]`.
- `link[rel="canonical"]`.
- `meta[property="og:*"]` and `meta[name="twitter:*"]`.
- JSON-LD script injection/update by stable id (`id="seo-jsonld"`).

**Step 2: Run test to verify it fails**
- Run: `npm test -- lib/seo-dom.test.ts`
- Expected: FAIL because SEO DOM applier module is missing.

**Step 3: Write minimal implementation**
- Implement:
- `upsertMeta(selector, attrs)`
- `upsertCanonical(href)`
- `upsertJsonLd(json)`
- `applySeoToDocument(seoPayload)`
- Ensure idempotent behavior across route changes.

**Step 4: Run test to verify it passes**
- Run: `npm test -- lib/seo-dom.test.ts`
- Expected: PASS.

---

### Task 3: Wire route-aware SEO into app runtime

**Files:**
- Modify: `/Users/togay/Desktop/Qualy-lp/App.tsx`
- Modify: `/Users/togay/Desktop/Qualy-lp/LanguageContext.tsx`
- Modify: `/Users/togay/Desktop/Qualy-lp/pages/LegalPage.tsx`
- Modify: `/Users/togay/Desktop/Qualy-lp/pages/LegalIndexPage.tsx`
- Test: `/Users/togay/Desktop/Qualy-lp/lib/seo-dom.test.ts`

**Step 1: Add failing integration assertions**
- Extend tests to confirm language-aware metadata updates when:
- route changes (`/` -> `/terms` -> `/privacy`).
- language toggles (`en` <-> `tr`).

**Step 2: Run test to verify it fails**
- Run: `npm test -- lib/seo-dom.test.ts`
- Expected: FAIL until app wiring is complete.

**Step 3: Implement wiring**
- In `App.tsx`, derive SEO route key from `path`.
- Read current language from context and call `applySeoToDocument` in `useEffect`.
- Update `document.documentElement.lang` based on language (`en`/`tr`).
- Keep legal page rendering logic unchanged functionally.

**Step 4: Run tests**
- Run: `npm test -- lib/seo-dom.test.ts`
- Expected: PASS.

**Step 5: Commit**
- `git add App.tsx LanguageContext.tsx pages/LegalPage.tsx pages/LegalIndexPage.tsx lib/seo.ts lib/seo.test.ts lib/seo-dom.ts lib/seo-dom.test.ts`
- `git commit -m "feat(seo): add route-aware metadata and locale-aware DOM SEO updates"`

---

### Task 4: Clean baseline static head and absolute URL strategy

**Files:**
- Modify: `/Users/togay/Desktop/Qualy-lp/index.html`
- Create: `/Users/togay/Desktop/Qualy-lp/lib/site-url.ts`
- Create: `/Users/togay/Desktop/Qualy-lp/lib/site-url.test.ts`

**Step 1: Write failing tests**
- Add tests for site URL resolution:
- `VITE_SITE_URL` when provided.
- fallback to production default.
- local dev fallback to `http://localhost:3000` only in non-prod context.

**Step 2: Run test to verify it fails**
- Run: `npm test -- lib/site-url.test.ts`
- Expected: FAIL before helper exists.

**Step 3: Implement helper + head cleanup**
- Create `getSiteUrl()` helper.
- In `index.html` keep minimal, valid defaults only:
- neutral title/description.
- canonical placeholder that runtime will override.
- remove `meta[name="keywords"]`.
- ensure OG/Twitter defaults are absolute-ready.
- keep JSON-LD fallback minimal and runtime-overridable.

**Step 4: Run tests**
- Run: `npm test -- lib/site-url.test.ts`
- Expected: PASS.

---

### Task 5: Generate sitemap.xml from route inventory

**Files:**
- Create: `/Users/togay/Desktop/Qualy-lp/scripts/generate-sitemap.mjs`
- Create: `/Users/togay/Desktop/Qualy-lp/public/sitemap.xml` (generated)
- Modify: `/Users/togay/Desktop/Qualy-lp/package.json`
- Create: `/Users/togay/Desktop/Qualy-lp/lib/sitemap.test.ts`

**Step 1: Write failing test**
- Add tests verifying generated XML contains:
- `/`
- `/legal`
- `/terms`
- `/privacy`
- absolute `<loc>` URLs.

**Step 2: Run test to verify it fails**
- Run: `npm test -- lib/sitemap.test.ts`
- Expected: FAIL because script/helper does not exist.

**Step 3: Implement generator**
- Read site URL via env/default.
- Build deterministic XML with `<urlset>`.
- Set sensible `changefreq`/`priority`:
- Home: weekly, 1.0
- Legal pages: monthly, 0.4-0.5

**Step 4: Wire build lifecycle**
- Add scripts:
- `"seo:generate:sitemap": "node scripts/generate-sitemap.mjs"`
- Include in `prebuild` sequence after legal asset generation.

**Step 5: Verify**
- Run: `npm run seo:generate:sitemap`
- Run: `cat public/sitemap.xml`
- Expected: valid XML with absolute URLs.

---

### Task 6: Improve robots.txt with sitemap declaration

**Files:**
- Create: `/Users/togay/Desktop/Qualy-lp/scripts/generate-robots.mjs`
- Modify: `/Users/togay/Desktop/Qualy-lp/public/robots.txt` (generated)
- Modify: `/Users/togay/Desktop/Qualy-lp/package.json`
- Create: `/Users/togay/Desktop/Qualy-lp/lib/robots.test.ts`

**Step 1: Write failing test**
- Add assertions:
- `User-agent: *`
- `Allow: /`
- `Sitemap: <absolute-url>/sitemap.xml`

**Step 2: Run test to verify it fails**
- Run: `npm test -- lib/robots.test.ts`
- Expected: FAIL until generator exists.

**Step 3: Implement generator and prebuild integration**
- Add script to write deterministic robots content.
- Add script:
- `"seo:generate:robots": "node scripts/generate-robots.mjs"`
- Include in `prebuild` sequence.

**Step 4: Verify output**
- Run: `npm run seo:generate:robots`
- Run: `cat public/robots.txt`
- Expected: robots includes sitemap line.

---

### Task 7: Upgrade structured data and social preview quality

**Files:**
- Create: `/Users/togay/Desktop/Qualy-lp/public/og/qualy-default.png` (1200x630)
- Modify: `/Users/togay/Desktop/Qualy-lp/index.html`
- Modify: `/Users/togay/Desktop/Qualy-lp/lib/seo.ts`
- Test: `/Users/togay/Desktop/Qualy-lp/lib/seo.test.ts`

**Step 1: Write failing test**
- Extend SEO tests for JSON-LD payload shape:
- `Organization`
- `WebSite`
- `SoftwareApplication`
- route-level title/description alignment.

**Step 2: Run test to verify it fails**
- Run: `npm test -- lib/seo.test.ts`
- Expected: FAIL until schema payloads are added.

**Step 3: Implement minimal schema set**
- Add reusable schema builders in `lib/seo.ts`.
- Reference canonical absolute URL and new OG image.
- Keep claims conservative and PRD-aligned.

**Step 4: Verify**
- Run: `npm test -- lib/seo.test.ts`
- Expected: PASS.

---

### Task 8: Remove SEO-harming first paint blocker

**Files:**
- Modify: `/Users/togay/Desktop/Qualy-lp/App.tsx`
- Modify: `/Users/togay/Desktop/Qualy-lp/components/Loader.tsx`
- Create: `/Users/togay/Desktop/Qualy-lp/lib/rendering.test.ts`

**Step 1: Write failing test**
- Add test ensuring home route content is not hard-blocked by a fixed 2.5s timer.

**Step 2: Run test to verify it fails**
- Run: `npm test -- lib/rendering.test.ts`
- Expected: FAIL because loader timer currently gates initial content.

**Step 3: Implement minimal fix**
- Remove forced 2500ms gate on home route.
- Option A: disable loader for first render.
- Option B: keep micro-transition (<=150ms) without hiding primary content.

**Step 4: Verify**
- Run: `npm test -- lib/rendering.test.ts`
- Expected: PASS.

---

### Task 9: Verification + documentation

**Files:**
- Modify: `/Users/togay/Desktop/Qualy-lp/docs/plans/2026-02-10-seo-foundation-implementation-plan.md` (checkbox/status updates only)
- Optional Modify: `/Users/togay/Desktop/leadqualifier/docs/ROADMAP.md`
- Optional Modify: `/Users/togay/Desktop/leadqualifier/docs/PRD.md`

**Step 1: Full test run**
- Run: `npm test`
- Expected: PASS.

**Step 2: Build verification**
- Run: `npm run build`
- Expected: PASS with generated `public/sitemap.xml` and updated `public/robots.txt`.

**Step 3: Manual SEO spot-check**
- Open local preview and verify per-route:
- `title`, description, canonical, og:url, og:title, og:description
- JSON-LD script existence and route consistency
- HTML `lang` toggles with EN/TR selection.

**Step 4: Commit**
- `git add .`
- `git commit -m "feat(seo): establish route-aware metadata, crawl assets, and indexing foundations"`

---

## Scope Guardrails

- Do **not** migrate to full SSR in this plan.
- Do **not** introduce new marketing pages/routes beyond existing legal/home set.
- Do **not** add third-party SEO SaaS dependencies.

## Open Decisions (Resolve before implementation starts)

1. Canonical production domain: `https://askqualy.com` (confirm).
2. Locale indexing strategy:
- Phase A (this plan): single URL + runtime language switch.
- Phase B (future): separate locale URLs (`/tr`, `/tr/legal`, etc.) + `hreflang`.
3. Social preview image source: provide final brand-safe 1200x630 PNG.

