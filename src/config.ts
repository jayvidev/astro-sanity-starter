/**
 * Env-derived runtime config. Editor-facing content lives in Sanity
 * `siteSettings` — read it via `getSettingsView()`.
 */
export const config = {
  site: {
    url: import.meta.env.PUBLIC_SITE_URL || '',
  },
} as const
