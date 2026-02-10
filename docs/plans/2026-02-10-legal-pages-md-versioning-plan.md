# Legal Pages + Markdown Versioning Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build Privacy Policy and Terms of Service as markdown-backed, versioned legal pages with a legal center index and generated `legal_versions.json` manifest.

**Architecture:** Keep legal documents as source-of-truth in `legal/*.md` with strict frontmatter (`id`, `version`, `last_updated`, `document_title`). Parse at runtime for web rendering and at build-time for public manifest generation. Route handling remains SPA-based in `App.tsx` with path detection for `/legal`, `/terms`, `/privacy`.

**Tech Stack:** React + Vite + TypeScript + Vitest + `marked` markdown renderer.

---

### Task 1: Define TDD coverage for legal parsing and manifest behavior

**Files:**
- Create: `/Users/togay/Desktop/Qualy-lp/lib/legal.test.ts`
- Create: `/Users/togay/Desktop/Qualy-lp/lib/legal-utils.ts`

**Step 1: Write the failing test**
- Add tests for frontmatter parse, preferred ordering, and manifest output.

**Step 2: Run test to verify it fails**
- Run: `npm test -- lib/legal.test.ts`
- Expected: FAIL due missing `legal-utils` module.

**Step 3: Write minimal implementation**
- Implement `parseLegalFrontmatter`, `sortLegalDocs`, `buildLegalVersionManifest`.

**Step 4: Run test to verify it passes**
- Run: `npm test -- lib/legal.test.ts`
- Expected: PASS.

### Task 2: Implement legal runtime loader and legal pages

**Files:**
- Create: `/Users/togay/Desktop/Qualy-lp/lib/legal.ts`
- Create: `/Users/togay/Desktop/Qualy-lp/pages/LegalPage.tsx`
- Create: `/Users/togay/Desktop/Qualy-lp/pages/LegalIndexPage.tsx`
- Modify: `/Users/togay/Desktop/Qualy-lp/App.tsx`
- Modify: `/Users/togay/Desktop/Qualy-lp/components/Footer.tsx`
- Modify: `/Users/togay/Desktop/Qualy-lp/index.css`

**Step 1: Wire markdown import pipeline**
- `import.meta.glob('../legal/*.md', { query: '?raw', import: 'default', eager: true })`
- Parse with shared `legal-utils` and render via `marked`.

**Step 2: Add legal center + single-document pages**
- `/legal` lists all available legal docs.
- `/{slug}` renders `terms` or `privacy` details with last_updated/version display.

**Step 3: Route in App**
- Add path-based route switching for `/`, `/legal`, and known legal slugs.

**Step 4: Update footer links**
- Link Privacy and Terms to `/privacy` and `/terms`.

### Task 3: Add markdown source files and build-time version manifest generation

**Files:**
- Create: `/Users/togay/Desktop/Qualy-lp/legal/README.md`
- Create: `/Users/togay/Desktop/Qualy-lp/legal/terms.md`
- Create: `/Users/togay/Desktop/Qualy-lp/legal/privacy.md`
- Create: `/Users/togay/Desktop/Qualy-lp/scripts/generate-legal-assets.mjs`
- Modify: `/Users/togay/Desktop/Qualy-lp/package.json`
- Generate: `/Users/togay/Desktop/Qualy-lp/public/legal_versions.json`

**Step 1: Add legal markdown contracts**
- Frontmatter fields required in each markdown.

**Step 2: Build manifest script**
- Read `legal/*.md`, validate frontmatter, generate `public/legal_versions.json`.

**Step 3: Bind to build lifecycle**
- Add `legal:generate` and `prebuild` script entries.

### Task 4: Documentation updates and verification

**Files:**
- Modify: `/Users/togay/Desktop/leadqualifier/docs/ROADMAP.md`
- Modify: `/Users/togay/Desktop/leadqualifier/docs/PRD.md`
- Modify: `/Users/togay/Desktop/leadqualifier/docs/RELEASE.md`

**Step 1: Update roadmap / PRD / release notes**
- Record new legal pages + version manifest infrastructure.

**Step 2: Verify commands**
- `npm test -- lib/legal.test.ts`
- `npm run legal:generate`
- `npm run build`

**Step 3: Validate outputs**
- Confirm `/Users/togay/Desktop/Qualy-lp/public/legal_versions.json` contains `terms` and `privacy` with correct version/date.

