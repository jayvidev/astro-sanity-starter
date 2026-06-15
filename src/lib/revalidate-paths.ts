/**
 * Maps a changed Sanity document (from the webhook payload) to the site paths
 * that must be revalidated. This is intentionally project-specific: edit the
 * STATIC_PAGES list and the switch below to match the routes you actually build.
 *
 * The starter only ships `/` and `/sitemap.xml`, so only those are wired here.
 * Commented branches show the conventional mapping for custom schema types —
 * uncomment and adjust as you add your own pages.
 */

export interface WebhookPayload {
  _type?: string
  _id?: string
  slug?: string
}

const STATIC_PAGES = ['/', '/sitemap.xml']

export async function pathsForDocument(doc: WebhookPayload): Promise<string[]> {
  // const slug = doc.slug

  switch (doc._type) {
    case 'home':
      return ['/']

    // Singletons — map each to its page route once you build it:
    // case 'customSingleton':
    //   return ['/custom-page']

    // siteSettings is global (nav, SEO, footer…) → revalidate everything:
    case 'siteSettings':
      return allPaths()

    // Collections — detail page + index + sitemap:
    // case 'exampleCollection':
    //   return slug ? [`/collection/${slug}`, '/collection', '/sitemap.xml'] : ['/collection', '/sitemap.xml']

    default:
      return []
  }
}

/**
 * Every revalidatable path. Used when a global document (siteSettings) changes.
 * Extend with collection detail pages once you wire their content mappers, e.g.:
 *
 *   const [customDocs] = await Promise.all([getCustomViews()])
 *   return [...STATIC_PAGES, ...customDocs.map((p) => `/collection/${p.slug}`)]
 */
async function allPaths(): Promise<string[]> {
  return [...STATIC_PAGES]
}
