import type { APIRoute } from 'astro'

import { config } from '@/config'

const BASE_URL = config.site.url

export const GET: APIRoute = async () => {
  const lastmod = new Date().toISOString()

  const staticRoutes = [''].map((route) => ({
    url: `${BASE_URL}${route}`,
    changefreq: 'monthly',
    priority: '1.0',
  }))

  const all = [...staticRoutes]

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${all
  .map(
    (entry) => `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml' },
  })
}
