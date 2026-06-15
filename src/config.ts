export const config = {
  site: {
    url: import.meta.env.PUBLIC_SITE_URL || '',
  },
  revalidation: {
    sanitySecret: process.env.SANITY_REVALIDATE_SECRET || '',
    vercelBypassToken: process.env.VERCEL_REVALIDATE_TOKEN || '',
  },
} as const
