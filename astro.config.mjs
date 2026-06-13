import path from 'node:path'

import sanity from '@sanity/astro'
import vercel from '@astrojs/vercel'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import { loadEnv } from 'vite'

const { PUBLIC_SANITY_STUDIO_PROJECT_ID, PUBLIC_SANITY_STUDIO_DATASET, PUBLIC_SITE_URL } = loadEnv(
  process.env.NODE_ENV ?? 'development',
  process.cwd(),
  ''
)

// Only enable Sanity when a real project id is set. A valid Sanity projectId is
// lowercase a-z, 0-9 and dashes — so the `.env.example` placeholder (or an empty
// value) is ignored and the welcome page boots without a Sanity project.
const hasValidProjectId = /^[a-z0-9-]+$/.test(PUBLIC_SANITY_STUDIO_PROJECT_ID ?? '')

const sanityIntegration = hasValidProjectId
  ? [
      sanity({
        projectId: PUBLIC_SANITY_STUDIO_PROJECT_ID,
        dataset: PUBLIC_SANITY_STUDIO_DATASET || 'production',
        useCdn: false,
        apiVersion: '2026-06-01',
      }),
    ]
  : []

export default defineConfig({
  site: PUBLIC_SITE_URL || '',
  output: 'static',
  adapter: vercel(),
  integrations: [...sanityIntegration],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@/': path.resolve('./src') + '/',
      },
    },
  },
})
