<div align="center">

# Astro + Sanity Starter

![Astro](https://img.shields.io/badge/Astro-16191f?style=flat&logo=astro&logoColor=white)
![Sanity](https://img.shields.io/badge/Sanity-0D0E12?style=flat&logo=sanity&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?logo=tailwindcss&logoColor=white&style=flat)
![GSAP](https://img.shields.io/badge/GSAP-0AE448?style=flat&logo=gsap&logoColor=white)

</div>

A statically-rendered, CMS-driven site starter: **Astro 6** frontend + a **Sanity** Studio for content. Ships a clean welcome page and a full **Sanity schema skeleton** (singletons + orderable collections + reusable objects) wired through a typed view-adapter data layer. Build your pages on top.

## What you get

- **Astro 6**, static output, Vercel adapter, TypeScript strict, Tailwind v4 (via `@tailwindcss/vite`), Onest font.
- **Welcome page** that boots with an empty `.env` — no Sanity required to see it run.
- **Sanity Studio** in [`/studio`](./studio) — its own pnpm workspace (separate deps + lockfile) so the static site stays lean. Singletons (Home, About, Contact, Services Page, Site Settings), orderable collections (Projects, Blog, Services), reusable objects — all a generic skeleton to fill in.
- **View-adapter data layer**: GROQ + raw types in [`src/lib/sanity.ts`](./src/lib/sanity.ts) → mapped "View" shapes in [`src/lib/content.ts`](./src/lib/content.ts) → components. **Components never touch Sanity** — swap the data source without touching the UI.
- Editor-managed **structured data** (schema.org JSON-LD) built in [`src/lib/structured-data.ts`](./src/lib/structured-data.ts) from `siteSettings`.
- Layout chrome (Navbar, Footer), smooth scroll (Lenis), view transitions, and scroll-reveal animations as scaffolding.

## Quickstart

```bash
pnpm install                 # frontend deps
pnpm --dir studio install    # studio deps (separate workspace)

pnpm dev                     # site → http://localhost:4321  (welcome page, no Sanity needed)
```

To wire the CMS, create a Sanity project and connect it:

```bash
cp .env.example .env.local   # fill PUBLIC_SANITY_STUDIO_PROJECT_ID
pnpm dev:studio              # studio → http://localhost:3333
```

See [docs/01-setup.md](./docs/01-setup.md).

## Build your site

The frontend ships only the welcome page. To build real pages:

1. Fill the schema skeleton in the Studio (each field has a description).
2. Read content with `get*View()` from [`src/lib/content.ts`](./src/lib/content.ts).
3. Compose pages in `src/pages/` using the `Layout`, chrome, and UI primitives.
4. Add a resource by following [docs/03-add-resource.md](./docs/03-add-resource.md).

> Note: pages that query Sanity need `PUBLIC_SANITY_STUDIO_PROJECT_ID` set to build.

## Scripts

| Script | What |
|--------|------|
| `pnpm dev` / `build` / `preview` | Astro frontend |
| `pnpm lint` / `lint:fix` / `format` | ESLint + Prettier |
| `pnpm dev:studio` / `build:studio` / `deploy:studio` | Sanity Studio |

## Docs

1. [00 — Overview](./docs/00-overview.md)
2. [01 — Setup](./docs/01-setup.md)
3. [02 — Architecture](./docs/02-architecture.md)
4. [03 — Add a resource](./docs/03-add-resource.md)
5. [04 — Sanity Studio](./docs/04-sanity-studio.md)
6. [05 — Deploy](./docs/05-deploy.md)

Conventions for AI coding agents: [CLAUDE.md](./CLAUDE.md).

## License

MIT
