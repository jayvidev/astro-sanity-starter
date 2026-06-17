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
| `REVALIDATE_ORIGIN` | Vercel env | **Optional** — only when a proxy/CDN (e.g. Cloudflare) fronts the site. Overrides the host the revalidation `HEAD` requests target (defaults to `PUBLIC_SITE_URL`); point it at a non-proxied host that hits the same deployment. See [Behind a proxy/CDN](#behind-a-proxycdn-eg-cloudflare). |

The first guards the *front door* (who may ask for a revalidation); the second is the *key* that actually opens the cache. Both must be set or `/api/revalidate` returns `500`. The third is only needed in the proxy scenario described below.

### Gotcha: per-request cache reset

`get*View()` memoizes singletons in a module-level promise to dedupe queries within one render. Under SSR/ISR a **warm** serverless function reuses that module across requests, so the promise would pin the **first** request's data and serve it stale forever. [`src/middleware.ts`](../src/middleware.ts) calls `resetContentCache()` at the start of every request to prevent this — register each new singleton's promise in `resetContentCache()`.

### Wiring the webhook

Studio → **API → Webhooks → Create**:

- **URL**: `https://yourdomain.com/api/revalidate`
- **Trigger on**: Create, Update, Delete
- **Filter** (optional): the `_type`s you map
- **Projection**: `{ _type, _id, "slug": slug.current }`
- **Secret**: the same value as `SANITY_REVALIDATE_SECRET`

### Behind a proxy/CDN (e.g. Cloudflare)

**Skip this whole section if Vercel serves your domain directly** — it only applies when you put a reverse proxy/CDN (Cloudflare, etc.) in front of Vercel. With no proxy, revalidation works out of the box.

#### The problem

When a proxy fronts your domain, on-demand revalidation silently breaks even though the Sanity webhook still returns HTTP `200`:

- `/api/revalidate` fetches each path with `x-prerender-revalidate` to trigger the rebuild. That request comes from **Vercel's egress IPs**, which the proxy's bot protection (Cloudflare **Bot Fight Mode**, managed rules, browser-integrity check) rejects with `403` — so the page never regenerates.

The webhook's `resultBody` makes this visible: the affected paths show up under `failed` (not `revalidated`). A telltale symptom is that the live page only updates after a full redeploy.

> The route checks each response's `.ok` status, so a `403` is correctly reported as `failed`. If you see `revalidated: []` with the paths under `failed`, the proxy is blocking the call.

#### Why not just revalidate the deployment URL (or the bare subdomain)

You might try fetching the `*.vercel.app` deployment URL to dodge the proxy. Don't:

- Deployment URLs are protected by **Vercel Deployment Protection** → `401`.
- Even with a *Protection Bypass for Automation* header, the bypassed request renders a **one-off copy that never lands in the cache** the production domain serves — so the live site stays stale.

The same trap applies to a separate non-proxied subdomain: **Vercel's ISR cache is keyed per host**. Revalidating `origin.yourdomain.com` only refreshes *its* cache, never `yourdomain.com`'s. So the request must carry the **public host** (`Host` + SNI = `yourdomain.com`) to invalidate the cache visitors actually read — it just needs to *reach Vercel without going through the proxy*. Both options below achieve that.

#### Option A — disable the bot protection that blocks the call

Simplest. On Cloudflare **Free**, WAF "skip" custom rules **cannot** bypass Bot Fight Mode (that toggle ignores them; the skippable *Super Bot Fight Mode* is Pro+ only), so the only lever is to turn it off:

- Cloudflare → Security → **Bots** → turn **Bot Fight Mode** off.

Leave `REVALIDATE_ORIGIN` unset; the route connects to the public domain directly. You keep Cloudflare's always-on DDoS protection, SSL, CDN and DNS — you only lose the automated-bot challenge.

#### Option B — pin the connection to Vercel via a DNS-only subdomain (keeps all protection on)

Keep Bot Fight Mode (and everything else) on. Add a subdomain that resolves **straight to Vercel** (grey cloud) and use it only to find Vercel's IP; the revalidation request connects to that IP but still presents the **public host**, so it bypasses Cloudflare *and* refreshes the public host's ISR cache.

1. **Vercel** → Project → Settings → **Domains** → add `origin.yourdomain.com`. With Cloudflare-managed DNS, use **Auto configure** — Vercel adds the verification `TXT` and the `CNAME` to Cloudflare as **DNS only (grey cloud)**, which is exactly what's needed.
2. Confirm the subdomain's `CNAME` is **DNS only (grey cloud)**, *not* proxied (orange). Wait for Vercel to issue its SSL (**Valid Configuration**).
3. **Vercel** → env var (Production), then redeploy:

   ```
   REVALIDATE_ORIGIN=https://origin.yourdomain.com
   ```

   The route ([`src/pages/api/revalidate.ts`](../src/pages/api/revalidate.ts)) resolves this host to Vercel's IP and **pins the revalidation connection to it**, while sending `Host`/SNI = `PUBLIC_SITE_URL`. The subdomain is plumbing only — nobody visits it, and its own per-host cache going stale is harmless.
4. Verify the subdomain bypasses the proxy — it should report Vercel directly, with no `cf-ray`:

   ```bash
   curl -sI https://origin.yourdomain.com/ | grep -iE 'server|cf-ray'
   # server: Vercel   (and no cf-ray header)
   ```

   **Hiding the subdomain from visitors.** Left alone, `origin.yourdomain.com` serves the whole site (duplicate content, and a way around the proxy). Add a **redirect** from it to the canonical domain — simplest is a Vercel domain redirect (Project → Settings → Domains → set `origin.yourdomain.com` to redirect to `yourdomain.com`). This is safe: revalidation requests carry the **public** `Host` (not the subdomain's), so the redirect never touches them. Canonical tags already point at `PUBLIC_SITE_URL`, so search engines won't index the subdomain either. (If you'd rather keep it in code, a middleware guard that 301s any request whose `Host` equals the `REVALIDATE_ORIGIN` host works the same way.)

Both options: also keep the proxy from serving stale HTML — Cloudflare → Caching → **Browser Cache TTL** = *Respect Existing Headers*, **Always Online** off, and no "Cache Everything" rule on HTML.

Verify either way: edit a field in Sanity, publish, and the page updates within seconds with no redeploy. The webhook `resultBody` should show the paths under `revalidated`, `failed: []`.

## Studio → Sanity

```bash
pnpm deploy:studio        # from repo root, or: cd studio && pnpm deploy
```

Deploys to `https://<project>.sanity.studio`. First deploy asks for a studio hostname. Add the production domain to **CORS origins** (manage.sanity.io → API → CORS) so the Studio can read/write.

## Pre-deploy checklist

- [ ] `pnpm build` succeeds locally
- [ ] `pnpm lint` clean
- [ ] All required singletons published in Sanity (Site Settings, Home, etc.)
- [ ] `PUBLIC_SITE_URL` set to the real domain (used by canonical URLs, OG tags, sitemap, JSON-LD)
- [ ] Content freshness handled: **either** a deploy webhook (full rebuild on publish) **or** on-demand revalidation (`VERCEL_REVALIDATE_TOKEN` + `SANITY_REVALIDATE_SECRET` set, webhook → `/api/revalidate`)
- [ ] If a proxy/CDN (e.g. Cloudflare) fronts the domain: pick Option A (disable Bot Fight Mode) or Option B (`REVALIDATE_ORIGIN` → DNS-only subdomain) + cache hygiene (see [Behind a proxy/CDN](#behind-a-proxycdn-eg-cloudflare))
