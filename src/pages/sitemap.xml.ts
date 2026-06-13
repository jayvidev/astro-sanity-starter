import type { APIRoute } from 'astro'

import { config } from '@/config'
import { getBlogPostViews, getProjectViews, getServiceViews } from '@/lib/content'

const BASE_URL = config.site.url

export const GET: APIRoute = async () => {
  const lastmod = new Date().toISOString()
  const projects = await getProjectViews()
  const services = await getServiceViews()
  const blogPosts = await getBlogPostViews()

  const staticRoutes = ['', '/about', '/services', '/projects', '/blog', '/contact'].map(
    (route) => ({
      url: `${BASE_URL}${route}`,
      changefreq: 'monthly',
      priority: route === '' ? '1.0' : '0.8',
    })
  )

  const serviceRoutes = services.map((s) => ({
    url: `${BASE_URL}/services/${s.slug}`,
    changefreq: 'monthly',
    priority: '0.7',
  }))

  const projectRoutes = projects.map((p) => ({
    url: `${BASE_URL}/projects/${p.slug}`,
    changefreq: 'monthly',
    priority: '0.7',
  }))

  const blogRoutes = blogPosts.map((b) => ({
    url: `${BASE_URL}/blog/${b.slug}`,
    changefreq: 'weekly',
    priority: '0.6',
  }))

  const all = [...staticRoutes, ...serviceRoutes, ...projectRoutes, ...blogRoutes]

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
