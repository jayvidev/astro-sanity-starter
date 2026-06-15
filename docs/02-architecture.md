# 02 — Architecture

## Folder map

```
src/
  components/
    icons/        # inline SVG .astro icons
    layout/       # Navbar, Footer
    seo/          # JsonLd.astro
    ui/           # reusable primitives: Button, RevealHeading, SmartLink, Icon
  layouts/
    Layout.astro  # <head>, SEO/OG, Lenis, view transitions, navbar/footer slot
  lib/
    sanity.ts          # raw client, GROQ projections, Sanity* types  ← data layer 1
    content.ts         # to*View mappers, get*View(), *View types      ← data layer 2
    structured-data.ts # schema.org JSON-LD from siteSettings
    smooth-scroll.ts    # Lenis init
    utils.ts            # cn() (clsx + tailwind-merge)
  pages/
    index.astro        # welcome page (standalone, no Sanity)
    sitemap.xml.ts
  config.ts            # env-only config (site URL)
  globals.css          # Tailwind v4 + design tokens

studio/                # separate Sanity workspace (own deps + lockfile)
  src/schemaTypes/
    singletons/   # home, siteSettings
    collections/  # custom orderable collections
    objects/      # reusable field groups (editorialBlock, seoFields, testimonial, ...)
    index.ts      # registers every type
  src/structure.ts     # custom Studio desk (Pages / collections / Site Settings)
  sanity.config.ts
```

## The data layer (read this twice)

**Layer 1 — `src/lib/sanity.ts`.** Owns the Sanity client, composable GROQ projections, and `Sanity*` interfaces matching the schema. Projections are built from shared fragments:

```ts
const imageProjection = `{ ..., alt, "width": asset->metadata.dimensions.width, ... }`
const seoProjection   = `seo{ metaTitle, metaDescription, ogImage ${imageProjection} }`
```

**Layer 2 — `src/lib/content.ts`.** `to*View` mappers flatten raw documents into `*View` shapes: image refs become CDN URLs (`img()`), `internalLink` objects become hrefs (`resolveLink()`), optional fields get defaults. `get*View()` is the only thing pages import.

```ts
const { editorialImages, seo } = await getHomeView()
```

**Why two layers:** the UI never knows it's talking to Sanity. Reshape a query, rename a field, or (in principle) swap the backend, and the blast radius stops at `content.ts`.

### Singleton caching

Singletons are fetched once per build via a memoized promise:

```ts
let homePromise: Promise<HomeView> | null = null
export function getHomeView() {
  if (!homePromise) homePromise = getHome().then(toHome)
  return homePromise
}
```

Several sections rendering the same singleton in one build share a single query. Follow this for any new singleton.

## Rendering & motion

- Static output: every page is prerendered. Only `src/pages/api/contact.ts` is dynamic (`export const prerender = false`).
- `Layout.astro` boots Lenis, GSAP `ScrollTrigger`, and Astro view transitions; it tears them down on `astro:before-swap` to avoid leaks across navigations.
- Section animations are colocated in each component's `<script>` and re-init on `astro:page-load`.

## SEO

- Per-page `seo` (title/description/ogImage) with `siteSettings.defaultSeo` fallback, assembled in `Layout.astro`.
- Organization JSON-LD built in `structured-data.ts` from `siteSettings` (name, contact, geo, address, hours, social) and injected by `JsonLd.astro`.

Next: [03 — Add a resource](./03-add-resource.md).
