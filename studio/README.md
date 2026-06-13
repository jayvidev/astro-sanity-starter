# Sanity Studio

Content backend (CMS) for the Astro frontend. Lives in the same repo (`/studio`)
but installs and deploys independently. The public site stays 100% static and
queries Sanity only at build time.

```
your-site/
├── src/            # Astro frontend (deploys to Vercel)
└── studio/         # Sanity Studio (this folder, deploys to sanity.studio)
    └── src/schemaTypes/   # content models (singletons, collections, objects)
```

## 1. Create the Sanity project (once)

From this `studio/` folder:

```bash
pnpm install
pnpm dlx sanity@latest login           # log in (Google / GitHub / email)
pnpm dlx sanity@latest init --env      # create project + dataset, writes .env.local
```

`init --env` creates a project, a `production` dataset, and writes
`SANITY_STUDIO_PROJECT_ID` into `.env.local`. Or copy `.env.example` → `.env.local`
and fill it manually (grab the ID from https://www.sanity.io/manage).

## 2. Run the Studio locally

```bash
pnpm dev      # http://localhost:3333
```

## 3. Fill the content

The schema ships as a skeleton — open each singleton (Site Settings, Home, About,
Contact, Services Page) and the collections (Projects, Blog, Services) and fill in
your own content. Field descriptions explain what each one is for.

## 4. Deploy the Studio

```bash
pnpm deploy   # publishes to https://<host>.sanity.studio
```

## Connecting the frontend

In the **repo root** `.env.local`, point Astro at the same project:

```
PUBLIC_SANITY_STUDIO_PROJECT_ID=<your project ID>
PUBLIC_SANITY_STUDIO_DATASET=production
```

The frontend reads content through `src/lib/sanity.ts` (raw queries) and
`src/lib/content.ts` (mapped view models). See the root `docs/` for the full flow.

## Rebuild-on-edit (webhook)

Because the site is static, publishing in the Studio must trigger a Vercel rebuild:

1. Vercel → Project → Settings → Git → **Deploy Hooks** → create one, copy URL.
2. Sanity → https://www.sanity.io/manage → API → **Webhooks** → add the Vercel
   Deploy Hook URL, trigger on create/update/delete for the `production` dataset.
