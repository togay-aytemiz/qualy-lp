# Blog Category and CTA Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Switch the Sanity blog taxonomy to the respond.io-style category set and add a bottom CTA to blog articles that reuses the homepage hero actions without copying respond.io claims.

**Architecture:** Keep the current archive UI. Introduce a small category normalization layer so legacy category slugs still resolve into the new taxonomy during generation/rendering, then add a dedicated article CTA block with homepage-style primary and demo actions.

**Tech Stack:** React, TypeScript, Vitest, Tailwind CSS

---

### Task 1: Lock the desired taxonomy and article CTA behavior in tests

**Files:**
- Modify: `lib/blog-categories.test.ts`
- Modify: `lib/blog-layout-render.test.tsx`
- Modify: `lib/blog-index-page-content.test.tsx`
- Modify: `lib/blog-post-page-content.test.tsx`

**Step 1: Write the failing test**

Add assertions that require:
- the Sanity category seed definitions to match the new taxonomy
- mapped category labels to appear even when input posts use legacy slugs
- a bottom article CTA with primary and demo actions

**Step 2: Run test to verify it fails**

Run: `npm test -- lib/blog-layout-render.test.tsx lib/blog-index-page-content.test.tsx lib/blog-post-page-content.test.tsx`
Expected: FAIL because the current pages still render legacy category labels and do not include the article CTA.

**Step 3: Write minimal implementation**

Create the category mapping helper and add the new CTA section in the blog post page.

**Step 4: Run test to verify it passes**

Run: `npm test -- lib/blog-layout-render.test.tsx lib/blog-index-page-content.test.tsx lib/blog-post-page-content.test.tsx`
Expected: PASS

### Task 2: Implement the shared category mapping while keeping the current UI

**Files:**
- Create: `lib/blog-categories.ts`
- Modify: `scripts/sanity-blog-categories.mjs`
- Modify: `scripts/generate-blog-assets.mjs`
- Modify: `pages/BlogIndexPage.tsx`
- Modify: `pages/BlogPostPage.tsx`

**Step 1: Write the failing test**

Use the Task 1 tests to require the shared helper usage and new chip markup/classes.

**Step 2: Run test to verify it fails**

Run: `npm test -- lib/blog-layout-render.test.tsx lib/blog-index-page-content.test.tsx`
Expected: FAIL with missing mapped labels and missing chip layout markers.

**Step 3: Write minimal implementation**

Add a helper that:
- defines the new Sanity/display taxonomy
- maps legacy category slugs into the new buckets
- localizes labels for TR and EN
- keeps visible category ordering aligned with the new taxonomy

Update the Sanity seed file, generator, and blog pages to consume that helper consistently without redesigning the archive.

**Step 4: Run test to verify it passes**

Run: `npm test -- lib/blog-layout-render.test.tsx lib/blog-index-page-content.test.tsx`
Expected: PASS

### Task 3: Add the bottom article CTA

**Files:**
- Modify: `pages/BlogPostPage.tsx`

**Step 1: Write the failing test**

Require a rounded CTA block below article content that contains:
- a short headline
- a short subcopy
- the hero primary CTA linked to registration
- the hero secondary CTA opening the demo flow

**Step 2: Run test to verify it fails**

Run: `npm test -- lib/blog-layout-render.test.tsx lib/blog-post-page-content.test.tsx`
Expected: FAIL because the article CTA does not exist yet.

**Step 3: Write minimal implementation**

Add the CTA block and local demo-modal flow without changing unrelated hero behavior.

**Step 4: Run test to verify it passes**

Run: `npm test -- lib/blog-layout-render.test.tsx lib/blog-post-page-content.test.tsx`
Expected: PASS

### Task 4: Verify full project requirements

**Files:**
- Modify: `public/blog_manifest.json` and route assets only if generated output changes

**Step 1: Run focused tests**

Run: `npm test -- lib/blog-layout-render.test.tsx lib/blog-index-page-content.test.tsx lib/blog-post-page-content.test.tsx`
Expected: PASS

**Step 2: Run full test suite**

Run: `npm test`
Expected: PASS

**Step 3: Run required performance verification**

Run: `npm run verify:perf`
Expected: PASS
