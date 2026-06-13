# 04 — Sanity Studio

The Studio lives in [`/studio`](../studio) as an independent pnpm workspace.

## Schema organization

```
studio/src/schemaTypes/
  singletons/   # one-of documents, edited via fixed list items
    home, about, contact, servicesPage, siteSettings
  collections/  # many documents, drag-and-drop orderable
    project, blogPost, service
  objects/      # reusable embedded field groups (no standalone documents)
    seoFields, editorialBlock, testimonial, processStep, teamMember,
    heroFeature, documentItem, internalLink, ...
  index.ts      # imports + registers EVERY type (required)
```

- **Singletons** can't be created/deleted — only edited. They're pinned in `structure.ts` with a fixed `documentId`.
- **Collections** use `orderRankField` + `orderableDocumentListDeskItem` so editors control display order by dragging.
- **Objects** are shared field bundles. `seoFields` and `editorialBlock` are reused across many documents — change them once, applies everywhere.

## Custom desk — `structure.ts`

```
Content
  ├─ Pages
  │   ├─ Home / About / Contact / Services Page   (singletons, with icons)
  │   ├─ ───
  │   ├─ Projects / Blog posts / Services          (orderable collections)
  └─ Site Settings                                  (singleton)
```

Each item carries an `@sanity/icons` icon for quick visual scanning.

## Conventions for editor UX

- **Group long documents** with `groups: [...]` + `group: 'name'` per field (see `home.ts`, `siteSettings.ts`). Tabs beat one endless scroll.
- **Validate** with `Rule.required()` and `.max(n)` on text fields so layouts don't break from over-long copy.
- **`description`** on a field is the editor's only inline guidance — add it wherever the field's purpose isn't obvious from the title. (Current coverage is thin on the `home`/`about` singletons; worth a pass when onboarding a non-technical client.)
- **`preview`** with `media` on collection items gives a thumbnail list instead of opaque rows.
- **Image alt text**: the `imageWithAlt` helper (in `home.ts`) attaches an `alt` field — prefer it for content images (a11y + SEO).

## Settings vs. structured data

- `siteSettings` → **Company Info** group: display values (name, flat address, phone, email).
- `siteSettings` → **Business / Structured Data** group: `businessType`, `geo`, `structuredAddress`, `openingHours` — these feed schema.org JSON-LD only.

> Note: `contact.info.openingHours` (a display string) and `siteSettings.openingHours` (structured, for JSON-LD) coexist on purpose — one is for humans on the page, one is for search engines.

## Scripts (`/studio`)

| Script | What |
|--------|------|
| `pnpm dev` | Local Studio at `:3333` |
| `pnpm build` | Build the Studio |
| `pnpm deploy` | Deploy to `<project>.sanity.studio` |

## One-off scripts & data migrations

Sanity is schemaless on the backend, so adding/removing schema fields needs **no migration** to deploy. But `initialValue` only applies to *new* documents — existing ones (singletons already in production) won't get the new fields. To backfill them, write a one-off patch script in `studio/scripts/`:

```bash
npx sanity exec scripts/<file>.ts --with-user-token
```

Use `.setIfMissing()` (never blind `.set()`) so you don't clobber values an editor already entered. `seed-business-info.ts` is the reference example.

**Convention: run → verify → delete.** These scripts are tied to one moment in the data's life; kept around they rot and mislead. Run it, confirm in the Studio, delete it — git history preserves it if you ever need it back. The same goes for `cleanup-settings.ts` and `upload-branding.ts`.

> When extracting the **starter**, don't ship client-specific seed/upload scripts. Leave at most one documented, generic example.

Next: [05 — Deploy](./05-deploy.md).
