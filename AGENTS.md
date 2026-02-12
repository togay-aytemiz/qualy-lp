# SEO Maintenance Guardrails

This project uses static route entry pages plus runtime SEO updates.  
When adding or changing routes, keep this checklist updated and follow it before merge.

## Route SEO Checklist

1. Create or update a static entry page:
   - `<route>/index.html` (or `index.html` for home)
   - Set unique `title`, `meta description`, `canonical`, `og:*`, `twitter:*`, and JSON-LD.

2. Keep localized home alternates correct:
   - `hreflang="tr"` -> `https://askqualy.com/`
   - `hreflang="en"` -> `https://askqualy.com/en`
   - `hreflang="x-default"` -> `https://askqualy.com/`

3. Update route SEO mapping in `/lib/seo.ts`:
   - `SeoRouteKey`
   - `SEO_COPY` (TR + EN)
   - `ROUTE_PATHS`
   - `getSeoRouteKeyByPath`

4. Ensure alternate-link DOM logic still works in `/lib/seo-dom.ts`.

5. Add the route to sitemap generation in `/scripts/generate-sitemap.mjs`.

6. Keep fallback behavior safe:
   - `/public/_redirects` must stay `/* /404.html 404`
   - Do not switch back to catch-all `200` fallback.

7. If a new static entry HTML is added, include it in Vite multi-input build:
   - `/vite.config.ts` -> `build.rollupOptions.input`

## Required Verification

Run both before claiming completion:

- `npm test`
- `npm run verify:perf`
