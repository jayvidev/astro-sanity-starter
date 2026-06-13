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
   ```

5. Use Node 24 (Project Settings → Node.js Version).

> The site is built **statically**, so content changes in Sanity require a redeploy to appear. Wire a [Sanity → Vercel deploy webhook](https://www.sanity.io/docs/webhooks) (Studio: API → Webhooks → Vercel Deploy Hook URL) to auto-rebuild on publish.

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
- [ ] Deploy webhook connected for auto-rebuild on publish
