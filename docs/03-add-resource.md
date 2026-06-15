# 03 — Add a resource

Walkthrough for adding a new content type. Example: a **Testimonials page** collection of `caseStudy` documents. The same five steps cover singletons, collections, and embedded objects.

## Workflow: build the page first, wire Sanity later

You don't have to model Sanity before you design. The content layer (`content.ts`) is a **seam**: components depend on a `*View` _shape_, not on where the data comes from. Build in this order and the migration is almost free:

1. **Define the `*View` type** for what the section needs (`HomeHeroView`, etc.).
2. **Return a typed hardcoded fallback** from `get*View()` — real-looking copy, typed as the `*View`. The page now works with **zero Sanity**.
3. **Build the components** against `get*View()` + the `*View` type. Never hardcode copy inside the `.astro` markup.
4. **Later, add Sanity**: schema → projection → `to*View` mapper, then point `get*View()` at the mapped document instead of the fallback. **The components don't change.**

`fallbackSettings` + `getSettingsView()` in `content.ts` is the live reference: it serves typed data with no Sanity wired (the `SANITY_CONFIGURED` guard skips the query and falls back). Copy that shape per page/section.

> **Anti-pattern:** hardcoding copy inside `.astro` components and migrating it field-by-field later. That scatters content across the tree and turns the Sanity migration into a find-and-replace slog. Keep copy in `content.ts` from day one — one file to swap when you wire the CMS.

The five steps below are the "wire Sanity" half (step 4 above), shown end-to-end.

## 1. Schema (Studio)

Create `studio/src/schemaTypes/collections/caseStudy.ts`:

```ts
import {defineField, defineType} from 'sanity'
import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'

export default defineType({
  name: 'caseStudy',
  title: 'Case study',
  type: 'document',
  orderings: [orderRankOrdering],
  groups: [{name: 'seo', title: 'SEO'}],
  fields: [
    orderRankField({type: 'caseStudy'}),
    defineField({name: 'title', type: 'string', validation: (R) => R.required()}),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'image',
      type: 'image',
      options: {hotspot: true},
      fields: [{name: 'alt', title: 'Alt text', type: 'string'}],
      validation: (R) => R.required(),
    }),
    defineField({name: 'summary', type: 'text', rows: 3, validation: (R) => R.max(300)}),
    defineField({name: 'seo', type: 'seoFields', group: 'seo'}),
  ],
  preview: {select: {title: 'title', subtitle: 'slug.current', media: 'image'}},
})
```

Register it in `studio/src/schemaTypes/index.ts` (import + add to the `schemaTypes` array).

## 2. Studio structure

In `studio/src/structure.ts`, add it to the Pages list:

```ts
orderableDocumentListDeskItem({type: 'caseStudy', title: 'Case studies', icon: DocumentsIcon, S, context})
```

(For a **singleton** instead, add a fixed `documentId` list item and edit it as a document — see how `home`/`about` are wired.)

## 3. Raw layer — `src/lib/sanity.ts`

```ts
export interface SanityCaseStudy {
  _id: string
  title: string
  slug: string
  image: SanityImage
  summary?: string
  seo?: SanityPageSeo
}

const caseStudyProjection = `{
  _id, title, "slug": slug.current,
  image ${imageProjection}, summary, ${seoProjection}
}`

export function getCaseStudies() {
  return loadQuery<SanityCaseStudy[]>(
    groq`*[_type == "caseStudy" && defined(slug.current)] | order(orderRank) ${caseStudyProjection}`
  )
}
export function getCaseStudy(slug: string) {
  return loadQuery<SanityCaseStudy>(
    groq`*[_type == "caseStudy" && slug.current == $slug][0] ${caseStudyProjection}`,
    {slug}
  )
}
```

Reuse `imageProjection` / `seoProjection` / `linkProjection` — don't re-spell them.

## 4. View layer — `src/lib/content.ts`

```ts
export type CaseStudyView = {
  id: string
  slug: string
  title: string
  image: string
  summary: string
  seo: PageSeoView
}

function toCaseStudy(c: SanityCaseStudy): CaseStudyView {
  return {
    id: c._id,
    slug: c.slug,
    title: c.title,
    image: img(c.image, 1200),
    summary: c.summary ?? '',
    seo: toSeoView(c.seo),
  }
}

export async function getCaseStudyViews() {
  return (await getCaseStudies()).map(toCaseStudy)
}
export async function getCaseStudyView(slug: string) {
  const c = await getCaseStudy(slug)
  return c ? toCaseStudy(c) : undefined
}
```

For a **singleton**, follow the memoized-promise pattern (`let caseStudiesPromise …`).

## 5. Render

```astro
---
import Layout from '@/layouts/Layout.astro'
import { getCaseStudyViews } from '@/lib/content'
const items = await getCaseStudyViews()
---
<Layout title="Case studies">
  {items.map((c) => <a href={`/case-studies/${c.slug}`}>{c.title}</a>)}
</Layout>
```

Dynamic detail pages use `getStaticPaths()` returning one entry per slug. See `src/pages/projects/[slug].astro` for the canonical example.

## Checklist

- [ ] Schema defined + registered in `index.ts`
- [ ] Added to `structure.ts`
- [ ] `Sanity*` type + projection + `get*()` in `sanity.ts`
- [ ] `*View` type + `to*View` + `get*View()` in `content.ts`
- [ ] Page renders via `get*View()` only (no `sanity:client` import)

Next: [04 — Sanity Studio](./04-sanity-studio.md).
