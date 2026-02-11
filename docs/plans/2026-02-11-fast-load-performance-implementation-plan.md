# Fast Load Performance Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make the landing site open visibly faster by reducing render-blocking work, shrinking initial execution cost, and deferring non-critical content.

**Architecture:** Move styling/runtime work from browser-time to build-time, keep only above-the-fold content on initial render, and generate lightweight performance guards (budget checks) that fail early in CI/local runs. Prioritize practical wins: remove blocking scripts, defer below-fold sections, optimize heavy media, and enforce bundle thresholds.

**Tech Stack:** React + Vite + TypeScript + Vitest + Tailwind (build-time) + Node build scripts.

---

### Task 1: Establish repeatable performance baseline + budget checks

**Files:**
- Create: `/Users/togay/Desktop/Qualy-lp/scripts/check-performance-budget.mjs`
- Create: `/Users/togay/Desktop/Qualy-lp/lib/performance-budget.test.ts`
- Modify: `/Users/togay/Desktop/Qualy-lp/package.json`

**Step 1: Write the failing test**
- Add tests that expect:
- budget checker parses `dist/assets/index-*.js` + gzip size.
- failure when JS gzip exceeds configured threshold.

**Step 2: Run test to verify it fails**
- Run: `npm test -- lib/performance-budget.test.ts`
- Expected: FAIL because budget script/helper does not exist.

**Step 3: Write minimal implementation**
- Implement script that:
- finds primary JS/CSS build assets.
- computes raw + gzip sizes.
- exits non-zero when budgets are exceeded (initial target: JS gzip <= 120KB).

**Step 4: Run test to verify it passes**
- Run: `npm test -- lib/performance-budget.test.ts`
- Expected: PASS.

**Step 5: Add script command**
- Add to `package.json`:
- `"perf:budget": "node scripts/check-performance-budget.mjs"`

---

### Task 2: Remove render-blocking runtime Tailwind and dead importmap path

**Files:**
- Create: `/Users/togay/Desktop/Qualy-lp/tailwind.config.ts`
- Create: `/Users/togay/Desktop/Qualy-lp/postcss.config.cjs`
- Modify: `/Users/togay/Desktop/Qualy-lp/index.css`
- Modify: `/Users/togay/Desktop/Qualy-lp/index.html`
- Modify: `/Users/togay/Desktop/Qualy-lp/package.json`
- Create: `/Users/togay/Desktop/Qualy-lp/lib/html-critical-path.test.ts`

**Step 1: Write the failing test**
- Add assertions that `index.html` does **not** include:
- `https://cdn.tailwindcss.com`
- `type="importmap"` block

**Step 2: Run test to verify it fails**
- Run: `npm test -- lib/html-critical-path.test.ts`
- Expected: FAIL with current blocking scripts present.

**Step 3: Write minimal implementation**
- Install/configure build-time Tailwind (content globs for `components`, `pages`, `App.tsx`, `LanguageContext.tsx`).
- Move inline Tailwind extension (keyframes/animations/colors/fonts) to `tailwind.config.ts`.
- Replace runtime Tailwind script path with generated CSS pipeline.
- Remove `importmap` block from `index.html`.

**Step 4: Run tests**
- Run: `npm test -- lib/html-critical-path.test.ts`
- Expected: PASS.

**Step 5: Verify app style integrity**
- Run: `npm run build`
- Expected: PASS with non-trivial compiled CSS and no runtime Tailwind dependency.

---

### Task 3: Defer below-the-fold sections with lazy loading + lightweight fallback

**Files:**
- Modify: `/Users/togay/Desktop/Qualy-lp/App.tsx`
- Create: `/Users/togay/Desktop/Qualy-lp/components/SectionSkeleton.tsx`
- Create: `/Users/togay/Desktop/Qualy-lp/lib/initial-render.test.ts`

**Step 1: Write the failing test**
- Add test asserting initial home render contains `Hero` immediately and defers at least one below-fold section module import.

**Step 2: Run test to verify it fails**
- Run: `npm test -- lib/initial-render.test.ts`
- Expected: FAIL with current eager import/render.

**Step 3: Write minimal implementation**
- Use `React.lazy` + `Suspense` for:
- `SuccessStories`
- `Challenges`
- `Features`
- `HowItWorks`
- `Pricing`
- `CTA`
- Keep `Navbar`, `Hero`, `Footer` eager.
- Use simple static skeleton placeholders (no heavy animations) while loading.

**Step 4: Run tests**
- Run: `npm test -- lib/initial-render.test.ts`
- Expected: PASS.

**Step 5: Verify build**
- Run: `npm run build`
- Expected: multiple route/component chunks and reduced entry chunk weight.

---

### Task 4: Optimize heavy media loading behavior

**Files:**
- Modify: `/Users/togay/Desktop/Qualy-lp/components/Challenges.tsx`
- Modify: `/Users/togay/Desktop/Qualy-lp/components/Hero.tsx`
- Create: `/Users/togay/Desktop/Qualy-lp/lib/media-loading.test.ts`

**Step 1: Write the failing test**
- Add checks for non-critical images:
- `loading="lazy"`
- `decoding="async"`
- no high `fetchpriority` on below-fold media.

**Step 2: Run test to verify it fails**
- Run: `npm test -- lib/media-loading.test.ts`
- Expected: FAIL for current `Challenges` image tags.

**Step 3: Write minimal implementation**
- Add proper lazy-loading attributes for `Challenges` images.
- Keep hero-critical visuals prioritized only if image-based (currently mostly CSS + text).
- Ensure remote images don’t block initial render.

**Step 4: Run tests**
- Run: `npm test -- lib/media-loading.test.ts`
- Expected: PASS.

---

### Task 5: Reduce startup animation work on first paint

**Files:**
- Modify: `/Users/togay/Desktop/Qualy-lp/components/Hero.tsx`
- Modify: `/Users/togay/Desktop/Qualy-lp/components/CTA.tsx`
- Modify: `/Users/togay/Desktop/Qualy-lp/components/SuccessStories.tsx`
- Create: `/Users/togay/Desktop/Qualy-lp/lib/motion-guard.test.ts`

**Step 1: Write the failing test**
- Add test asserting first-screen animation strategy:
- no large delayed entry chain before textual hero is readable.
- respect reduced-motion signals.

**Step 2: Run test to verify it fails**
- Run: `npm test -- lib/motion-guard.test.ts`
- Expected: FAIL with current aggressive initial animation timings.

**Step 3: Write minimal implementation**
- Reduce entrance durations/delays above the fold.
- Gate non-essential continuous animations behind viewport or reduced-motion checks.
- Keep visual style, remove startup jank.

**Step 4: Run tests**
- Run: `npm test -- lib/motion-guard.test.ts`
- Expected: PASS.

---

### Task 6: Font delivery hardening for faster text paint

**Files:**
- Modify: `/Users/togay/Desktop/Qualy-lp/index.html`
- Modify: `/Users/togay/Desktop/Qualy-lp/index.css`
- Create: `/Users/togay/Desktop/Qualy-lp/lib/font-delivery.test.ts`

**Step 1: Write the failing test**
- Assert:
- `display=swap` remains enabled.
- no duplicate font stylesheet requests.
- robust fallback stack is present.

**Step 2: Run test to verify it fails**
- Run: `npm test -- lib/font-delivery.test.ts`
- Expected: FAIL until fallback stack and cleanup are finalized.

**Step 3: Write minimal implementation**
- Keep one font stylesheet request.
- Ensure fallback font stack in CSS for quick text render.
- Preserve current brand typography.

**Step 4: Run tests**
- Run: `npm test -- lib/font-delivery.test.ts`
- Expected: PASS.

---

### Task 7: Add Netlify caching headers for static assets

**Files:**
- Create: `/Users/togay/Desktop/Qualy-lp/public/_headers`
- Create: `/Users/togay/Desktop/Qualy-lp/lib/netlify-headers.test.ts`

**Step 1: Write the failing test**
- Add test asserting `_headers` includes:
- long cache for hashed assets under `/assets/*`
- conservative cache for HTML and legal JSON.

**Step 2: Run test to verify it fails**
- Run: `npm test -- lib/netlify-headers.test.ts`
- Expected: FAIL because `_headers` does not exist.

**Step 3: Write minimal implementation**
- Add cache rules:
- `/assets/*` -> `Cache-Control: public, max-age=31536000, immutable`
- `/` and `/*.html` -> short/no-cache revalidation
- `/legal_versions.json` -> short TTL + revalidate policy

**Step 4: Run tests**
- Run: `npm test -- lib/netlify-headers.test.ts`
- Expected: PASS.

---

### Task 8: Verify end-to-end and lock budgets into build flow

**Files:**
- Modify: `/Users/togay/Desktop/Qualy-lp/package.json`
- Modify: `/Users/togay/Desktop/Qualy-lp/docs/plans/2026-02-11-fast-load-performance-implementation-plan.md` (status only)

**Step 1: Add perf budget in build verification chain**
- Add script:
- `"verify:perf": "npm run build && npm run perf:budget"`

**Step 2: Run full verification**
- Run: `npm test`
- Run: `npm run verify:perf`
- Expected: PASS.

**Step 3: Manual smoke check**
- Run: `npm run preview`
- Validate:
- first content appears immediately.
- no visual breakage from Tailwind runtime removal.
- no console errors.

**Step 4: Commit**
- `git add .`
- `git commit -m "perf: improve first-load speed with build-time styling, deferred sections, and cache/budget guards"`

---

## Scope Guardrails

- Do **not** rewrite to SSR/Next.js in this phase.
- Do **not** change product copy/UX flow beyond performance-driven defer/animation limits.
- Do **not** introduce paid external optimization services.

## Baseline Notes (Current)

- Current build output reports main JS around `~407KB` raw and `~132KB` gzip.
- `index.html` currently contains runtime Tailwind and legacy importmap scaffolding that should be removed in this phase.

