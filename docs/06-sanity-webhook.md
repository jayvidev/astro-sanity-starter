# Sanity Webhook → On-demand Revalidation

How to wire the Sanity webhook that revalidates static pages when content is published. In an Astro project using `output: 'static'` with Vercel ISR, publishing in the Studio fires a webhook to `/api/revalidate`, which regenerates only the affected pages.

- Endpoint: [`src/pages/api/revalidate.ts`](../src/pages/api/revalidate.ts)
- Type → route map: [`src/lib/revalidate-paths.ts`](../src/lib/revalidate-paths.ts)

## Where to create it

https://www.sanity.io/manage → select the project → **API → Webhooks → Create**.

## Webhook config

| Field | Value |
|---|---|
| **Name** | `Astro ISR` (any label) |
| **Description** | "Revalidates ISR pages on publish" (optional) |
| **URL** | `https://YOUR_DOMAIN/api/revalidate` |
| **Dataset** | `production` (or your target dataset) |
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

Only trigger on the document types the code actually maps. To find which types to include, check the `pathsForDocument()` function in `src/lib/revalidate-paths.ts` and add all the `case` values to this list.

For example, depending on your Sanity schema structure:
```groq
_type in ["page", "post", "project", "siteSettings"]
```

An empty filter also works — unmapped types just return `{ revalidated: false }` — but the explicit list cuts down on unnecessary API calls.

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

The exact mapping of which `_type` revalidates which routes is defined in [`revalidate-paths.ts`](../src/lib/revalidate-paths.ts). 

Depending on your specific Sanity schema, you should map your document types to their corresponding front-end routes.

**How to configure the route mapping:**
Whenever you have a collection or document type in Sanity that has a frontend page, make sure to:
1. Open `src/lib/revalidate-paths.ts`.
2. Add a `case` for your `_type` inside the `pathsForDocument()` function, returning the array of paths that need to be revalidated when that document changes.
3. Make sure that same `_type` is included in your webhook **Filter** in the Sanity dashboard.

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
