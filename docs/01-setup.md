# 01 — Setup

## Prerequisites

- Node 24 (Vercel runtime; Node 25 builds locally but warns).
- pnpm.
- A Sanity account + project — **optional to start** (see Quick start).

## Quick start — no Sanity needed

You can develop the whole UI before touching Sanity. With an empty or placeholder
env the content layer serves **typed fallbacks** (you'll see a one-line
`[sanity] query failed — using fallback content` warning, which is expected):

```bash
pnpm install
pnpm dev          # runs at http://localhost:4321 with fallback content
```

Build pages against `get*View()` + the `*View` types (see
[03 — Add a resource](./03-add-resource.md), "build the page first"). When you're
ready, set `PUBLIC_SANITY_STUDIO_PROJECT_ID` to a real id and the data lights up —
no code change. The full setup below is for when you reach that point.

## 1. Install

The frontend and the Studio are independent workspaces:

```bash
pnpm install                 # frontend (repo root)
pnpm --dir studio install    # studio
```

## 2. Sanity project

If you don't have one yet, create it from the Studio folder:

```bash
cd studio
npx sanity@latest init --env   # creates a project + writes studio/.env.local
```

Note the **projectId** and **dataset** (usually `production`).

## 3. Environment variables

Frontend — copy and fill `.env.local` at the repo root:

```bash
cp .env.example .env.local
```

```dotenv
PUBLIC_SITE_URL=http://localhost:4321          # prod: https://yourdomain.com

PUBLIC_SANITY_STUDIO_PROJECT_ID=your_project_id
PUBLIC_SANITY_STUDIO_DATASET=production
```

Studio uses its own `studio/.env.local` (`SANITY_STUDIO_PROJECT_ID`, `SANITY_STUDIO_DATASET`) — written by `sanity init`, or copy `studio/.env.example`.

## 4. Run

```bash
pnpm dev          # site  → http://localhost:4321
pnpm dev:studio   # studio → http://localhost:3333
```

## 5. Seed content

The site renders from Sanity, so empty singletons will produce empty (or build-erroring) pages. In the Studio, fill at least: **Site Settings**, **Home**, **About**, **Contact**, **Services Page**, and create a few Projects/Services/Blog posts. New `siteSettings` business fields ship with sensible `initialValue` defaults.

Next: [02 — Architecture](./02-architecture.md).
