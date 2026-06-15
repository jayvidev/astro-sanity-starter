# 00 — Overview

A starter template for a statically-built marketing site (Astro 6) whose content lives entirely in a Sanity Studio. Two halves:

- **Frontend** (repo root) — Astro pages compiled to static HTML, deployed to Vercel. Fetches all content from Sanity at build time.
- **Studio** (`/studio`) — the Sanity editing app. Its own pnpm workspace, deployed separately to `*.sanity.studio`.

## Mental model

```
Sanity content  ──GROQ──▶  src/lib/sanity.ts   (raw types)
                                  │
                            to*View mappers
                                  ▼
                         src/lib/content.ts     (View types: flat, URL-resolved)
                                  │
                            get*View()
                                  ▼
                          .astro pages/components (render only)
```

The **View layer** is the contract. Components depend on `*View` types, not on Sanity. This is what makes the project swappable and keeps the UI free of CMS details.

## Pages

The frontend ships only a standalone **welcome page** (`/`) plus `sitemap.xml`. Everything else is a **schema skeleton** ready in Sanity — wire each page as you build (see [03 — Add a resource](./03-add-resource.md)).



## Cross-cutting

- **Layout** ([`src/layouts/Layout.astro`](../src/layouts/Layout.astro)) — `<head>` SEO/OG tags, Lenis smooth scroll, view transitions, navbar/footer.
- **SEO** — per-page `seo` field (title/description/og) with `siteSettings.defaultSeo` fallback. Structured data via `lib/structured-data.ts`.
- **Settings** — global nav, footer, social, branding, business info in the `siteSettings` singleton.

Next: [01 — Setup](./01-setup.md).
