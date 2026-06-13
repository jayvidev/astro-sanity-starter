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

const projectId = PUBLIC_SANITY_STUDIO_PROJECT_ID || '00000000'

const sanityIntegration = [
  sanity({
    projectId,
    dataset: PUBLIC_SANITY_STUDIO_DATASET || 'production',
    useCdn: false,
    apiVersion: '2026-06-01',
  }),
]

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
