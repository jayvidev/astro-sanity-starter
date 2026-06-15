import type { SanityImageSource } from '@sanity/image-url'
import { createImageUrlBuilder as imageUrlBuilder } from '@sanity/image-url'
import groq from 'groq'
import { sanityClient } from 'sanity:client'

const builder = imageUrlBuilder(sanityClient)

export function urlForImage(source: SanityImageSource) {
  return builder.image(source)
}

const projectId = import.meta.env.PUBLIC_SANITY_STUDIO_PROJECT_ID
const SANITY_CONFIGURED = !!projectId && /^[a-z0-9-]+$/.test(projectId) && projectId !== '00000000'

async function loadQuery<T>(
  query: string,
  params: Record<string, unknown> = {}
): Promise<T | null> {
  if (!SANITY_CONFIGURED) return null

  try {
    return await sanityClient.fetch<T>(query, params, {
      perspective: 'published',
      useCdn: false,
    })
  } catch (err) {
    console.error('Error fetching from Sanity:', err)
    return null
  }
}

const imageProjection = `{
  ...,
  alt,
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height,
  "lqip": asset->metadata.lqip
}`

export interface SanityImage {
  _type: 'image'
  asset?: { _ref: string; _type: 'reference' }
  alt?: string
  width?: number
  height?: number
  lqip?: string
}

export interface SanitySiteSettings {
  companyName: string
  defaultSeo?: {
    metaTitle?: string
    metaDescription?: string
    ogImage?: SanityImage
  }
}

const settingsProjection = `{
  companyName,
  defaultSeo{
    metaTitle,
    metaDescription,
    ogImage ${imageProjection}
  }
}`

export function getSettings() {
  return loadQuery<SanitySiteSettings>(groq`*[_type == "siteSettings"][0] ${settingsProjection}`)
}
