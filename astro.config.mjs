import path from 'node:path'

import sanity from '@sanity/astro'
import vercel from '@astrojs/vercel'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import { loadEnv } from 'vite'

const {
  PUBLIC_SANITY_STUDIO_PROJECT_ID,
  PUBLIC_SANITY_STUDIO_DATASET,
  PUBLIC_SITE_URL,
  VERCEL_REVALIDATE_TOKEN,
} = loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), '')

const isValidProjectId = (id) => !!id && /^[a-z0-9-]+$/.test(id)
const projectId = isValidProjectId(PUBLIC_SANITY_STUDIO_PROJECT_ID)
  ? PUBLIC_SANITY_STUDIO_PROJECT_ID
  : '00000000'

const sanityIntegration = [
  sanity({
    projectId,
    dataset: PUBLIC_SANITY_STUDIO_DATASET || 'production',
    useCdn: false,
    apiVersion: '2026-06-01',
  }),
]

// @sanity/astro pre-bundles Studio-only deps via optimizeDeps.include. The Studio
// lives in the separate /studio workspace, so these aren't installed in the root
// and Vite logs "Failed to resolve dependency" warnings. Strip them — the public
// site only consumes sanity:client, not the Studio UI.
const stripStudioOptimizeDeps = () => ({
  name: 'strip-studio-optimize-deps',
  config(config) {
    const drop = [
      'react',
      'react-dom',
      'react-dom/client',
      'react-compiler-runtime',
      'react-is',
      'styled-components',
      'lodash/startCase.js',
    ]
    if (config.optimizeDeps?.include) {
      config.optimizeDeps.include = config.optimizeDeps.include.filter((dep) => !drop.includes(dep))
    }
  },
})

export default defineConfig({
  site: PUBLIC_SITE_URL || '',
  output: 'static',
  adapter: vercel({
    isr: {
      bypassToken: VERCEL_REVALIDATE_TOKEN,
      exclude: [/^\/api\/.+/],
    },
  }),
  integrations: [...sanityIntegration],
  vite: {
    plugins: [tailwindcss(), stripStudioOptimizeDeps()],
    resolve: {
      alias: {
        '@/': path.resolve('./src') + '/',
      },
    },
  },
})
