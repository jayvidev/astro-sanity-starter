/**
 * Builds schema.org JSON-LD from the editor-managed `siteSettings`. All identity
 * (name, contact, geo, address, hours, social) lives in Sanity; only the site URL
 * comes from env. Parts are omitted when empty so the markup never ships blanks.
 */
import { config } from '@/config'
import type { SettingsView } from '@/lib/content'

export function buildOrganizationSchema(settings: SettingsView) {
  const { url } = config.site

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: settings.companyName,
    ...(settings.defaultSeo?.ogImage && {
      image: new URL(settings.defaultSeo.ogImage, url).href,
    }),
    '@id': `${url}/#organization`,
    url,
  }
}
