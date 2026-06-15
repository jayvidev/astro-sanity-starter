/**
 * Maps a changed Sanity document (from the webhook payload) to the site paths
 * that must be revalidated. This is intentionally project-specific: edit the
 * STATIC_PAGES list and the switch below to match the routes you actually build.
 *
 * The starter only ships `/` and `/sitemap.xml`, so only those are wired here.
 * Commented branches show the conventional mapping for the other schema types —
 * uncomment and adjust as you add their pages.
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
    // case 'about':
    //   return ['/about']
    // case 'contact':
    //   return ['/contact']
    // case 'servicesPage':
    //   return ['/services']

    // siteSettings is global (nav, SEO, footer…) → revalidate everything:
    case 'siteSettings':
      return allPaths()

    // Collections — detail page + index + sitemap:
    // case 'project':
    //   return slug ? [`/projects/${slug}`, '/projects', '/sitemap.xml'] : ['/projects', '/sitemap.xml']
    // case 'service':
    //   return slug ? [`/services/${slug}`, '/services', '/sitemap.xml'] : ['/services', '/sitemap.xml']
    // case 'blogPost':
    //   return slug ? [`/blog/${slug}`, '/blog', '/sitemap.xml'] : ['/blog', '/sitemap.xml']

    default:
      return []
  }
}

/**
 * Every revalidatable path. Used when a global document (siteSettings) changes.
 * Extend with collection detail pages once you wire their content mappers, e.g.:
 *
 *   const [projects] = await Promise.all([getProjectViews()])
 *   return [...STATIC_PAGES, ...projects.map((p) => `/projects/${p.slug}`)]
 */
async function allPaths(): Promise<string[]> {
  return [...STATIC_PAGES]
}
