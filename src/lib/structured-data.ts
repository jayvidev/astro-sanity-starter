/**
 * Builds schema.org JSON-LD from the editor-managed `siteSettings`. All identity
 * (name, contact, geo, address, hours, social) lives in Sanity; only the site URL
 * comes from env. Parts are omitted when empty so the markup never ships blanks.
 */
import { config } from '@/config'
import type { SettingsView } from '@/lib/content'

export function buildOrganizationSchema(settings: SettingsView) {
  const { url } = config.site
  const phone = settings.companyPhone?.replace(/[^\d+]/g, '')
  const addr = settings.structuredAddress
  const geo = settings.geo
  const hours = settings.openingHours
  const sameAs = settings.socialLinks.map((s) => s.url).filter(Boolean)

  return {
    '@context': 'https://schema.org',
    '@type': settings.businessType || 'Organization',
    name: settings.companyName,
    ...(settings.defaultSeo?.ogImage && {
      image: new URL(settings.defaultSeo.ogImage, url).href,
    }),
    '@id': `${url}/#organization`,
    url,
    ...(phone && { telephone: phone }),
    ...(settings.companyEmail && { email: settings.companyEmail }),
    ...(addr?.streetAddress && {
      address: { '@type': 'PostalAddress', ...addr },
    }),
    ...(geo?.latitude != null &&
      geo?.longitude != null && {
        geo: {
          '@type': 'GeoCoordinates',
          latitude: geo.latitude,
          longitude: geo.longitude,
        },
      }),
    ...(hours?.days?.length && {
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: hours.days,
        ...(hours.opens && { opens: hours.opens }),
        ...(hours.closes && { closes: hours.closes }),
      },
    }),
    ...(sameAs.length && { sameAs }),
  }
}
