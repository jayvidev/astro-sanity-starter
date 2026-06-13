import type { SanityImageSource } from '@sanity/image-url'
import { createImageUrlBuilder as imageUrlBuilder } from '@sanity/image-url'
import groq from 'groq'
import { sanityClient } from 'sanity:client'

const builder = imageUrlBuilder(sanityClient)

export function urlForImage(source: SanityImageSource) {
  return builder.image(source)
}

async function loadQuery<T>(query: string, params: Record<string, unknown> = {}): Promise<T> {
  return sanityClient.fetch<T>(query, params, {
    perspective: 'published',
    useCdn: false,
  })
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

export interface SanityPageSeo {
  metaTitle?: string
  metaDescription?: string
  ogImage?: SanityImage
}

const seoProjection = `seo{
  metaTitle,
  metaDescription,
  ogImage ${imageProjection}
}`

export interface SanityInternalLink {
  _type: 'internalLink'
  page: string
}

const linkProjection = `{ page }`

// ---- Projects -------------------------------------------------------------

export interface SanityProject {
  _id: string
  title: string
  slug: string
  category?: string
  location?: string
  date?: string
  image: SanityImage
  miniImage?: SanityImage
  outcomeImages?: SanityImage[]
  beforeImage?: SanityImage
  afterImage?: SanityImage
  seo?: SanityPageSeo
}

const projectProjection = `{
  _id,
  title,
  "slug": slug.current,
  category,
  location,
  date,
  image ${imageProjection},
  miniImage ${imageProjection},
  outcomeImages[] ${imageProjection},
  beforeImage ${imageProjection},
  afterImage ${imageProjection},
  ${seoProjection}
}`

export function getProjects() {
  return loadQuery<SanityProject[]>(
    groq`*[_type == "project" && defined(slug.current)] | order(orderRank) ${projectProjection}`
  )
}

export function getProject(slug: string) {
  return loadQuery<SanityProject>(
    groq`*[_type == "project" && slug.current == $slug][0] ${projectProjection}`,
    { slug }
  )
}

// ---- Blog -----------------------------------------------------------------

export interface SanityContentSection {
  title?: string
  paragraphs?: string[]
}

export interface SanityBlogPost {
  _id: string
  title: string
  slug: string
  category?: string
  date?: string
  excerpt?: string
  image: SanityImage
  heroImage?: SanityImage
  galleryImages?: SanityImage[]
  contentSections?: SanityContentSection[]
  seo?: SanityPageSeo
}

const blogProjection = `{
  _id,
  title,
  "slug": slug.current,
  category,
  date,
  excerpt,
  image ${imageProjection},
  heroImage ${imageProjection},
  galleryImages[] ${imageProjection},
  contentSections[]{ title, paragraphs },
  ${seoProjection}
}`

export function getBlogPosts() {
  return loadQuery<SanityBlogPost[]>(
    groq`*[_type == "blogPost" && defined(slug.current)] | order(orderRank) ${blogProjection}`
  )
}

export function getBlogPost(slug: string) {
  return loadQuery<SanityBlogPost>(
    groq`*[_type == "blogPost" && slug.current == $slug][0] ${blogProjection}`,
    { slug }
  )
}

// ---- Services -------------------------------------------------------------

export interface SanityServiceHighlight {
  title?: string
  description?: string
}

export interface SanityServiceContentSection {
  title?: string
  paragraphs?: string[]
  image?: SanityImage
  additionalImages?: SanityImage[]
  ctaLabel?: string
  ctaHref?: SanityInternalLink
}

export interface SanityService {
  _id: string
  title: string
  slug: string
  image: SanityImage
  heroImage?: SanityImage
  description?: string[]
  highlights?: SanityServiceHighlight[]
  showContentSection?: boolean
  contentSection?: SanityServiceContentSection
  showGallery?: boolean
  gallery?: SanityImage[]
  seo?: SanityPageSeo
}

const serviceProjection = `{
  _id,
  title,
  "slug": slug.current,
  image ${imageProjection},
  heroImage ${imageProjection},
  description,
  highlights[]{ title, description },
  showContentSection,
  contentSection{
    title,
    paragraphs,
    ctaLabel,
    ctaHref ${linkProjection},
    image ${imageProjection},
    additionalImages[] ${imageProjection}
  },
  showGallery,
  gallery[] ${imageProjection},
  ${seoProjection}
}`

export function getServices() {
  return loadQuery<SanityService[]>(
    groq`*[_type == "service" && defined(slug.current)] | order(orderRank) ${serviceProjection}`
  )
}

export function getService(slug: string) {
  return loadQuery<SanityService>(
    groq`*[_type == "service" && slug.current == $slug][0] ${serviceProjection}`,
    { slug }
  )
}

// ---- Home (singleton) -----------------------------------------------------

export interface SanityHome {
  hero: {
    title: string
    subtitle: string
    ctaText: string
    ctaLink: SanityInternalLink
    backgroundImage: SanityImage
    backgroundVideo?: string
    features: { text: string; icon: string }[]
  }
  about: {
    title: string
    description: string
    bannerImage: SanityImage
    leftImage: SanityImage
    rightImage: SanityImage
    leftImageDesc: string
    floatingBox: { value: string; label: string }
    stats: { icon: string; value: string; label: string }[]
  }
  editorialImages: {
    variant: 'statement' | 'feature' | 'showcase' | 'split'
    label?: string
    caption?: string
    title?: string
    text?: string
    note?: string
    index?: string
    reverse?: boolean
    paddingTop?: 'none' | 'sm' | 'md' | 'lg'
    paddingBottom?: 'none' | 'sm' | 'md' | 'lg'
    aspectVariant?: 'default' | 'tall'
    maxWidth?: 'default' | 'narrow'
    bg?: string
    image?: SanityImage
    alt?: string
    image1?: SanityImage
    alt1?: string
    image2?: SanityImage
    alt2?: string
  }[]
  documents: {
    title: string
    ctaText: string
    ctaLink: SanityInternalLink
    items: { title: string; whatWeDo: string; expertise: string; image: SanityImage }[]
  }
  process: {
    title: string
    steps: { title: string; description: string; image: SanityImage }[]
  }
  testimonials: {
    title: string
    bgImage?: SanityImage
    testimonials: { name: string; role: string; quote: string; image: SanityImage }[]
  }
  seo?: SanityPageSeo
}

const homeProjection = `{
  hero{
    title, subtitle, ctaText, ctaLink ${linkProjection},
    backgroundImage ${imageProjection},
    "backgroundVideo": backgroundVideo.asset->url,
    features[]{ text, "icon": icon.asset->url }
  },
  about{
    title, description,
    bannerImage ${imageProjection},
    leftImage ${imageProjection},
    rightImage ${imageProjection},
    leftImageDesc,
    floatingBox{ value, label },
    stats[]{ "icon": icon.asset->url, value, label }
  },
  editorialImages[]{
    variant, label, caption, title, text, note, index, reverse, bg,
    paddingTop, paddingBottom, aspectVariant, maxWidth,
    image ${imageProjection}, alt,
    image1 ${imageProjection}, alt1,
    image2 ${imageProjection}, alt2
  },
  documents{
    title, ctaText, ctaLink ${linkProjection},
    items[]{ title, whatWeDo, expertise, image ${imageProjection} }
  },
  process{
    title,
    steps[]{ title, description, image ${imageProjection} }
  },
  testimonials{
    title,
    bgImage ${imageProjection},
    testimonials[]{ name, role, quote, image ${imageProjection} }
  },
  ${seoProjection}
}`

export function getHome() {
  return loadQuery<SanityHome>(groq`*[_type == "home"][0] ${homeProjection}`)
}

// ---- About (singleton) + Collections --------------------------------------

export interface SanityAboutIntroFeature {
  text?: string
  icon?: string
}

export interface SanityMilestone {
  _id?: string
  _key?: string
  year?: string
  text?: string
  icon?: string
  iconClass?: string
  col?: string
  row?: string
}

export interface SanityTeamMember {
  _id?: string
  _key?: string
  name?: string
  role?: string
  email?: string
  image?: SanityImage
}

export interface SanityAboutStat {
  value?: string
  label?: string
  icon?: string
}

export interface SanityAbout {
  hero: {
    title: string
    ctaText: string
    ctaLink: SanityInternalLink
    backgroundImage: SanityImage
  }
  intro: {
    title: string
    paragraphs: string[]
    philosophyTitle: string
    philosophyParagraphs: string[]
    features: SanityAboutIntroFeature[]
  }
  specializations: {
    title: string
    description: string
    image: SanityImage
    specializationsTitle: string
    specializations: string[]
  }
  milestones: {
    title: string
    description: string
    image: SanityImage
    buttonText: string
    buttonLink: SanityInternalLink
    items?: SanityMilestone[]
  }
  team: {
    title: string
    president: { name: string; role: string; email: string; image: SanityImage }
    teamGalleryImages: SanityImage[]
    members?: SanityTeamMember[]
  }
  stats: SanityAboutStat[]
  editorialImages: {
    variant: 'statement' | 'feature' | 'showcase' | 'split'
    label?: string
    caption?: string
    title?: string
    text?: string
    note?: string
    index?: string
    reverse?: boolean
    paddingTop?: 'none' | 'sm' | 'md' | 'lg'
    paddingBottom?: 'none' | 'sm' | 'md' | 'lg'
    aspectVariant?: 'default' | 'tall'
    maxWidth?: 'default' | 'narrow'
    bg?: string
    image?: SanityImage
    alt?: string
    image1?: SanityImage
    alt1?: string
    image2?: SanityImage
    alt2?: string
  }[]
  seo?: SanityPageSeo
}

const aboutProjection = `{
  hero{
    title, ctaText, ctaLink ${linkProjection},
    backgroundImage ${imageProjection}
  },
  intro{
    title, paragraphs, philosophyTitle, philosophyParagraphs,
    features[]{ text, "icon": icon.asset->url }
  },
  specializations{
    title, description, image ${imageProjection}, specializationsTitle, specializations
  },
  milestones {
    title,
    description,
    image ${imageProjection},
    buttonText,
    buttonLink ${linkProjection},
    items[] {
      _key,
      year,
      text,
      "icon": icon.asset->url,
      iconClass,
      col,
      row
    }
  },
  team {
    title,
    president {
      name,
      role,
      email,
      image ${imageProjection}
    },
    teamGalleryImages[] ${imageProjection},
    members[] {
      _key,
      name,
      role,
      email,
      image ${imageProjection}
    }
  },
  stats[]{ value, label, "icon": icon.asset->url },
  editorialImages[]{
    variant, label, caption, title, text, note, index, reverse, bg,
    paddingTop, paddingBottom, aspectVariant, maxWidth,
    image ${imageProjection}, alt,
    image1 ${imageProjection}, alt1,
    image2 ${imageProjection}, alt2
  },
  ${seoProjection}
}`

export function getAbout() {
  return loadQuery<SanityAbout>(groq`*[_type == "about"][0] ${aboutProjection}`)
}

export interface SanityContact {
  seo?: SanityPageSeo
  form: {
    title: string
    messagePlaceholder: string
    services: string[]
  }
  info: {
    title: string
    cardDescription: string
    phones: string[]
    emails: string[]
    address: {
      line1: string
      line2: string
    }
    openingHours: string
    mapUrl: string
  }
  editorialImage: {
    variant: string
    caption?: string
    titlePosition?: 'top' | 'side'
    paddingTop?: 'none' | 'sm' | 'md' | 'lg'
    paddingBottom?: 'none' | 'sm' | 'md' | 'lg'
    aspectVariant?: 'default' | 'tall'
    maxWidth?: 'default' | 'narrow'
    bg?: string
    image1?: SanityImage
    alt1?: string
    image2?: SanityImage
    alt2?: string
  }
}

const contactProjection = `{
  ${seoProjection},
  form,
  info,
  editorialImage{
    variant, caption, titlePosition, bg,
    paddingTop, paddingBottom, aspectVariant, maxWidth,
    image1 ${imageProjection}, alt1,
    image2 ${imageProjection}, alt2
  }
}`

export function getContact() {
  return loadQuery<SanityContact>(groq`*[_type == "contact"][0] ${contactProjection}`)
}

export interface SanitySiteSettings {
  headerLogo?: SanityImage
  companyName: string
  companyAddress: string
  companyPhone: string
  companyEmail: string
  businessType?: string
  geo?: { latitude?: number; longitude?: number }
  structuredAddress?: {
    streetAddress?: string
    addressLocality?: string
    addressRegion?: string
    postalCode?: string
    addressCountry?: string
  }
  openingHours?: { days?: string[]; opens?: string; closes?: string }
  mainNavigation: { label: string; href: SanityInternalLink }[]
  footerCol1: { label: string; href: SanityInternalLink }[]
  footerCol2: { label: string; href: SanityInternalLink }[]
  footerTopCards: { title: string; actionText: string; href: SanityInternalLink }[]
  socialLinks: { network: string; url: string }[]
  defaultSeo: {
    metaTitle: string
    metaDescription: string
    ogImage?: SanityImage
  }
}

const settingsProjection = `{
  headerLogo ${imageProjection},
  companyName,
  companyAddress,
  companyPhone,
  companyEmail,
  businessType,
  geo{ latitude, longitude },
  structuredAddress{ streetAddress, addressLocality, addressRegion, postalCode, addressCountry },
  openingHours{ days, opens, closes },
  mainNavigation[]{ label, href ${linkProjection} },
  footerCol1[]{ label, href ${linkProjection} },
  footerCol2[]{ label, href ${linkProjection} },
  footerTopCards[]{ title, actionText, href ${linkProjection} },
  socialLinks[]{ network, url },
  defaultSeo{
    metaTitle,
    metaDescription,
    ogImage ${imageProjection}
  }
}`

export function getSettings() {
  return loadQuery<SanitySiteSettings>(groq`*[_type == "siteSettings"][0] ${settingsProjection}`)
}

export interface SanityServicesPage {
  title: string
  description: string
  faqs: { question: string; answer: string }[]
}

const servicesPageProjection = `{
  title,
  description,
  faqs[]{ question, answer }
}`

export function getServicesPage() {
  return loadQuery<SanityServicesPage>(
    groq`*[_type == "servicesPage"][0] ${servicesPageProjection}`
  )
}
