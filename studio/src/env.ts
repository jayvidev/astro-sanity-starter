/**
 * Centralized Studio environment config.
 * Single place that reads process.env — everything else imports from here.
 * Values come from studio/.env.local (SANITY_STUDIO_* are injected by the
 * Sanity CLI/bundler at build time).
 */
export const projectId = process.env.SANITY_STUDIO_PROJECT_ID || ''
export const dataset = process.env.SANITY_STUDIO_DATASET || 'production'
export const previewUrl = process.env.SANITY_STUDIO_PREVIEW_URL || 'http://localhost:4321'
export const studioHost = process.env.SANITY_STUDIO_STUDIO_HOST || ''

if (!projectId) {
  console.warn(
    '[studio] SANITY_STUDIO_PROJECT_ID is not set. Copy .env.example to .env.local and fill it in.',
  )
}
