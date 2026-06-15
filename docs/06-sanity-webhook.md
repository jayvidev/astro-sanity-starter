# Sanity Webhook → On-demand Revalidation

How to wire the Sanity webhook that revalidates static pages when content is published. The site is `output: 'static'` with ISR, so publishing in the Studio fires a webhook to `/api/revalidate`, which regenerates only the affected pages.

- Endpoint: [`src/pages/api/revalidate.ts`](../src/pages/api/revalidate.ts)
- Type → route map: [`src/lib/revalidate-paths.ts`](../src/lib/revalidate-paths.ts)

## Where to create it

https://www.sanity.io/manage → select the project → **API → Webhooks → Create**.

## Webhook config

| Field | Value |
|---|---|
| **Name** | `revalidate` (any label) |
| **Description** | "Revalidates ISR pages on publish" (optional) |
| **URL** | `https://YOUR_DOMAIN/api/revalidate` |
| **Dataset** | `production` |
| **Trigger on** | ✅ Create &nbsp; ✅ Update &nbsp; ✅ Delete |
| **Filter** | see below (optional but recommended) |
| **Projection** | `{ _type, _id, "slug": slug.current }` |
| **Status** | ✅ Enable webhook |
| **HTTP method** | `POST` |
| **HTTP headers** | none |
| **API version** | `v2021-03-25` (default) |
| **Drafts** | off |
| **Versions** | off |
| **Secret** | same value as env `SANITY_REVALIDATE_SECRET` |

### Filter (GROQ)

Only trigger on the document types the code actually maps:

```groq
_type in ["home", "about", "contact", "servicesPage", "siteSettings", "project", "blogPost", "service"]
```

Empty filter also works — unmapped types just return `{ revalidated: false }` — but the explicit list cuts noise.

### Projection (GROQ)

```groq
{ _type, _id, "slug": slug.current }
```

The endpoint reads `_type` and `slug` to decide which paths to revalidate.

## Required env vars (set in Vercel)

Both must be set or `/api/revalidate` returns `500`.

| Env var | Set in | Purpose |
|---|---|---|
| `SANITY_REVALIDATE_SECRET` | Sanity webhook **Secret** + Vercel env | HMAC signature check — proves the request is really from your webhook (front door). |
| `VERCEL_REVALIDATE_TOKEN` | Vercel env (build + runtime) | ISR `bypassToken` — sent on the internal `HEAD` request so Vercel regenerates the cached page. |

## Type → route map

What each `_type` revalidates (from [`revalidate-paths.ts`](../src/lib/revalidate-paths.ts)):

| `_type` | Revalidates |
|---|---|
| `home` | `/` |
| `about` | `/about` |
| `contact` | `/contact` |
| `servicesPage` | `/services` |
| `siteSettings` | **all paths** (static pages + every project/service/blog slug) |
| `project` | `/projects/{slug}`, `/projects`, `/sitemap.xml` |
| `blogPost` | `/blog/{slug}`, `/blog`, `/sitemap.xml` |
| `service` | `/services/{slug}`, `/services`, `/sitemap.xml` |

Added a new collection type? Add a `case` in `pathsForDocument()` and append the `_type` to the webhook filter.

## Flow

```
Edit in Studio → Publish
  → Sanity webhook POSTs { _type, _id, slug } to /api/revalidate
  → endpoint verifies HMAC signature (SANITY_REVALIDATE_SECRET)
  → pathsForDocument() maps _type → affected routes
  → HEAD request per path with x-prerender-revalidate token
  → Vercel regenerates + re-caches those pages
```

## Verify

After saving, edit + publish a document. Sanity → API → Webhooks → the webhook → **Attempts** log should show `200`. A `401` means the Secret mismatches `SANITY_REVALIDATE_SECRET`; a `500` means an env var is missing.
