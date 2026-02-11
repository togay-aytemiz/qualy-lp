# Legal markdown source

This directory contains canonical legal documents rendered on the website.

## Required frontmatter

Every markdown file must include:

```yaml
---
id: "terms"
locale: "en"
version: "v1.0"
last_updated: "2026-02-10"
document_title: "Terms of Service"
---
```

## Notes

- `id` becomes the public route slug (`/terms`, `/privacy`).
- `locale` is optional (`en` default). Use `tr` for Turkish variants of the same `id`.
- `version` is surfaced in the UI and in `public/legal_versions.json`.
- `last_updated` should be ISO-like date `YYYY-MM-DD`.
- Run `npm run legal:generate` after legal markdown changes.
