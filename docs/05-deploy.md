# 05 — Deploy

Two independent deploys: the **site** (Vercel) and the **Studio** (Sanity hosting).

## Frontend → Vercel

The project uses `@astrojs/vercel` with static output.

1. Import the repo in Vercel.
2. **Root directory**: repo root (not `/studio`).
3. Build command `pnpm build`, output handled by the adapter.
4. Environment variables (Production + Preview):

   ```
   PUBLIC_SITE_URL=https://yourdomain.com
   PUBLIC_SANITY_STUDIO_PROJECT_ID=...
   PUBLIC_SANITY_STUDIO_DATASET=production

   # Only if you enable on-demand revalidation (see below)
   VERCEL_REVALIDATE_TOKEN=...
   SANITY_REVALIDATE_SECRET=...
   ```

5. Use Node 24 (Project Settings → Node.js Version).

> By default the site is built **statically**, so content changes in Sanity require a redeploy to appear. Either wire a [Sanity → Vercel deploy webhook](https://www.sanity.io/docs/webhooks) to auto-rebuild on publish, **or** use the granular **on-demand revalidation** below.

## On-demand revalidation (ISR)

Instead of rebuilding the whole site on every edit, individual pages can refresh themselves seconds after an editor hits *Publish* — no redeploy.

### How it works in Astro

Astro has no ISR of its own; it delegates to the adapter. With `output: 'static'` + `@astrojs/vercel`:

- Pages are **prerendered to static HTML at build time** by default (classic SSG).
- A page that exports `export const prerender = false` is instead built as a **serverless function** and served through Vercel's **ISR cache**: the first request renders and caches it; later requests get the cached copy until it's revalidated. That's the "ISR" — SSG output that can be re-rendered on demand without a full build.
- The `isr.bypassToken` in `astro.config.mjs` is the key that lets a request **bypass the cache and trigger a fresh render** whose result replaces the cached copy.

So: keep marketing/static pages prerendered; mark Sanity-backed pages `prerender = false`.

### The flow

1. Editor publishes in the Studio.
2. Sanity fires a webhook (GROQ-projected payload with `_type` and `slug`) to `POST /api/revalidate`.
3. [`src/pages/api/revalidate.ts`](../src/pages/api/revalidate.ts) verifies the signature, then asks [`src/lib/revalidate-paths.ts`](../src/lib/revalidate-paths.ts) which paths the changed document affects.
4. For each path it sends a `HEAD` request carrying `x-prerender-revalidate: <bypassToken>`, which makes Vercel regenerate and re-cache that page.

`revalidate-paths.ts` is the one project-specific file — map each `_type` to the routes it appears on.

### The two tokens

| Env var | Lives where | Purpose |
| --- | --- | --- |
| `SANITY_REVALIDATE_SECRET` | Sanity webhook config **and** Vercel env | **Authenticity** — proves the incoming request is really from your Sanity webhook (HMAC signature check). Without it, anyone could hit `/api/revalidate`. |
| `VERCEL_REVALIDATE_TOKEN` | Vercel env (build + runtime) | **Authorization** — the ISR `bypassToken`. Sent on the internal `HEAD` request so Vercel agrees to bypass the cache and regenerate the page. |

The first guards the *front door* (who may ask for a revalidation); the second is the *key* that actually opens the cache. Both must be set or `/api/revalidate` returns `500`.

### Gotcha: per-request cache reset

`get*View()` memoizes singletons in a module-level promise to dedupe queries within one render. Under SSR/ISR a **warm** serverless function reuses that module across requests, so the promise would pin the **first** request's data and serve it stale forever. [`src/middleware.ts`](../src/middleware.ts) calls `resetContentCache()` at the start of every request to prevent this — register each new singleton's promise in `resetContentCache()`.

### Wiring the webhook

Studio → **API → Webhooks → Create**:

- **URL**: `https://yourdomain.com/api/revalidate`
- **Trigger on**: Create, Update, Delete
- **Filter** (optional): the `_type`s you map
- **Projection**: `{ _type, _id, "slug": slug.current }`
- **Secret**: the same value as `SANITY_REVALIDATE_SECRET`

## Studio → Sanity

```bash
pnpm deploy:studio        # from repo root, or: cd studio && pnpm deploy
```

Deploys to `https://<project>.sanity.studio`. First deploy asks for a studio hostname. Add the production domain to **CORS origins** (manage.sanity.io → API → CORS) so the Studio can read/write.

## Pre-deploy checklist

- [ ] `pnpm build` succeeds locally
- [ ] `pnpm lint` clean
- [ ] All required singletons published in Sanity (Site Settings, Home, About, Contact, Services Page)
- [ ] `PUBLIC_SITE_URL` set to the real domain (used by canonical URLs, OG tags, sitemap, JSON-LD)
- [ ] Content freshness handled: **either** a deploy webhook (full rebuild on publish) **or** on-demand revalidation (`VERCEL_REVALIDATE_TOKEN` + `SANITY_REVALIDATE_SECRET` set, webhook → `/api/revalidate`)
