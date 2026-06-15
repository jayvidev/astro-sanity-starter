# CLAUDE.md

Conventions for AI coding agents working on this starter (and projects derived from it).

## Stack & invariants

- **Astro 6**, static output (`output: 'static'`), Vercel adapter. TypeScript strict. Tailwind v4 via `@tailwindcss/vite` (no `tailwind.config` — utilities live in `src/globals.css`).
- **pnpm only.** The Studio is a **separate workspace** in `/studio` with its own `package.json` + lockfile. Install/run it independently (`pnpm --dir studio …`). Don't hoist Studio deps into the root.
- Path alias: `@/*` → `src/*` (set in both `tsconfig.json` and `astro.config.mjs`).

## Data flow — the one rule that matters

Sanity is reached through a **two-layer adapter**. Never break this:

1. `src/lib/sanity.ts` — raw Sanity client, GROQ queries, reusable projections (`imageProjection`, `seoProjection`, `linkProjection`), and `Sanity*` interfaces that mirror the schema 1:1.
2. `src/lib/content.ts` — `to*View` mappers that turn raw documents into flat **`*View`** shapes (resolved image URLs, resolved links, defaults applied). Exposes `get*View()` functions.
3. `.astro` components/pages import **only** `get*View` and the `*View` types.

**Components must never import from `src/lib/sanity.ts` or `sanity:client` directly.** If a component needs a new field, add it to the projection + `Sanity*` type in `sanity.ts`, then surface it through the `*View` in `content.ts`.

**Building a new page/section? Follow the design-first workflow in [docs/03-add-resource.md](./docs/03-add-resource.md):** define the `*View` type → return a typed hardcoded fallback from `get*View()` → build components against it → wire Sanity last. Never hardcode copy inside `.astro` markup — keep it in `content.ts` so the Sanity migration is one file, not a find-and-replace across the tree.

- Singletons (`home`, `siteSettings`) are **request-cached** via a module-level promise (`let homePromise …`). Reuse that pattern for new singletons so multiple sections share one query per build.
- Images: always go through `img(source, width)` in `content.ts` (calls `urlForImage().width().auto('format')`). Don't hand-build CDN URLs.
- Internal links: resolve with `resolveLink()`; never render a raw `internalLink` object.

## Config & secrets

- `src/config.ts` holds **env-derived values only** (site URL, SMTP secrets). Everything editor-facing (company name, contact, social, navigation, SEO, geo/address/hours) lives in Sanity `siteSettings` — read via `getSettingsView()`.
- **Never put secrets in Sanity.** SMTP credentials are env vars. Only the lead *recipient* address is editor-managed (`contact.leadRecipientEmail`).
- Structured-data JSON-LD is assembled in `src/lib/structured-data.ts` from `siteSettings` and rendered via `src/components/seo/JsonLd.astro`. Don't inline schema.org blobs in pages.
- The footer copyright + agency credit are **intentionally hardcoded** in `Footer.astro` (not editor-editable) so clients can't remove attribution.

## Adding a CMS resource

Full walkthrough: [docs/03-add-resource.md](./docs/03-add-resource.md). Short version:

1. `studio/src/schemaTypes/` — define the type (singleton, collection, or object) and register it in `index.ts`.
2. Collections: add `orderRankField` + register in `studio/src/structure.ts` via `orderableDocumentListDeskItem`. Singletons: add a fixed `documentId` list item.
3. `src/lib/sanity.ts` — `Sanity<Name>` interface + projection + `get<Name>()`.
4. `src/lib/content.ts` — `<Name>View` type + `to<Name>View` mapper + `get<Name>View()`.
5. Render in a page/section using `get<Name>View()`.

## Don'ts

- Don't import `sanity:client` or `urlForImage` inside components — go through `content.ts`.
- Don't add a `tailwind.config.*` — this is Tailwind v4, configured in CSS.
- Don't store secrets, API tokens, or SMTP passwords in Sanity documents.
- Don't hardcode company identity in components — read `getSettingsView()` (except the deliberate footer attribution).
- Don't create `src/data/*` — that legacy static layer was replaced by the Sanity adapter.
