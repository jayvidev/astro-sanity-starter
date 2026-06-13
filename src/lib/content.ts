/**
 * Content adapter: maps Sanity documents back into the legacy view shapes
 * the .astro components already expect (string image URLs, etc.), so swapping
 * the data source needs no changes in the rendering components.
 *
 * Migrated so far: projects, services, blog.
 */
import {
  getAbout,
  getBlogPost,
  getBlogPosts,
  getContact,
  getHome,
  getProject,
  getProjects,
  getService,
  getServices,
  getServicesPage,
  getSettings,
  type SanityAbout,
  type SanityBlogPost,
  type SanityContact,
  type SanityContentSection,
  type SanityHome,
  type SanityImage,
  type SanityInternalLink,
  type SanityMilestone,
  type SanityPageSeo,
  type SanityProject,
  type SanityService,
  type SanityServiceContentSection,
  type SanityServicesPage,
  type SanitySiteSettings,
  type SanityTeamMember,
  urlForImage,
} from '@/lib/sanity'

export function resolveLink(link: SanityInternalLink | string | undefined | null): string {
  if (!link) return '#'
  if (typeof link === 'string') return link

  return link.page || '/'
}

/** Resolve a Sanity image to an optimized, format-negotiated CDN URL. */
function img(source: SanityImage | undefined, width: number): string {
  if (!source?.asset) return ''
  return urlForImage(source).width(width).auto('format').url()
}

export type PageSeoView = {
  metaTitle?: string
  metaDescription?: string
  ogImage?: string
}

function toSeoView(seo: SanityPageSeo | undefined): PageSeoView {
  return {
    metaTitle: seo?.metaTitle,
    metaDescription: seo?.metaDescription,
    ogImage: seo?.ogImage ? img(seo.ogImage, 1200) : undefined,
  }
}

type ProjectBase = {
  id: string
  slug: string
  category: string
  title: string
  location: string
  image: string
  miniImage: string
  date?: string
  outcomeImages?: string[]
  beforeImage?: string
  afterImage?: string
}

export type ProjectView = ProjectBase & { seo: PageSeoView }

function toProject(p: SanityProject): ProjectView {
  return {
    id: p._id,
    slug: p.slug,
    category: p.category ?? '',
    title: p.title,
    location: p.location ?? '',
    image: img(p.image, 1600),
    miniImage: img(p.miniImage, 800),
    date: p.date,
    outcomeImages: p.outcomeImages?.map((i) => img(i, 1600)).filter(Boolean),
    beforeImage: p.beforeImage ? img(p.beforeImage, 1600) : undefined,
    afterImage: p.afterImage ? img(p.afterImage, 1600) : undefined,
    seo: toSeoView(p.seo),
  }
}

export async function getProjectViews(): Promise<ProjectView[]> {
  const projects = await getProjects()
  return projects.map(toProject)
}

export async function getProjectView(slug: string): Promise<ProjectView | undefined> {
  const project = await getProject(slug)
  return project ? toProject(project) : undefined
}

/** Filter categories for the projects grid, in document order, prefixed with 'All'. */
export async function getProjectCategories(): Promise<string[]> {
  const projects = await getProjectViews()
  return ['All', ...Array.from(new Set(projects.map((p) => p.category).filter(Boolean)))]
}

// ---- Services -------------------------------------------------------------

export type ServiceContentSectionView = {
  title?: string
  ctaLabel?: string
  ctaHref?: string
  image: string
  paragraphs: string[]
  additionalImages?: string[]
}

export type ServiceView = {
  id: string
  slug: string
  title: string
  image: string
  heroImage?: string
  description: string[]
  highlights: { title: string; description: string }[]
  showContentSection: boolean
  contentSection?: ServiceContentSectionView
  showGallery: boolean
  gallery?: string[]
  seo: PageSeoView
}

function toContentSection(
  cs: SanityServiceContentSection | undefined
): ServiceContentSectionView | undefined {
  if (!cs) return undefined
  return {
    title: cs.title,
    ctaLabel: cs.ctaLabel,
    ctaHref: resolveLink(cs.ctaHref),
    image: img(cs.image, 1600),
    paragraphs: cs.paragraphs ?? [],
    additionalImages: cs.additionalImages?.map((i) => img(i, 1600)).filter(Boolean),
  }
}

function toService(s: SanityService): ServiceView {
  const showContentSection = Boolean(s.showContentSection && s.contentSection)
  const showGallery = Boolean(s.showGallery && s.gallery?.length)
  return {
    id: s._id,
    slug: s.slug,
    title: s.title,
    image: img(s.image, 1200),
    heroImage: s.heroImage ? img(s.heroImage, 1600) : undefined,
    description: s.description ?? [],
    highlights: (s.highlights ?? []).map((h) => ({
      title: h.title ?? '',
      description: h.description ?? '',
    })),
    showContentSection,
    contentSection: showContentSection ? toContentSection(s.contentSection) : undefined,
    showGallery,
    gallery: showGallery ? s.gallery?.map((i) => img(i, 1600)).filter(Boolean) : undefined,
    seo: toSeoView(s.seo),
  }
}

export async function getServiceViews(): Promise<ServiceView[]> {
  const services = await getServices()
  return services.map(toService)
}

export async function getServiceView(slug: string): Promise<ServiceView | undefined> {
  const service = await getService(slug)
  return service ? toService(service) : undefined
}

// ---- Blog -----------------------------------------------------------------

export type BlogContentSectionView = {
  title: string
  paragraphs: string[]
}

export type BlogPostView = {
  id: string
  slug: string
  category: string
  date: string
  title: string
  excerpt: string
  image: string
  heroImage?: string
  galleryImages?: string[]
  contentSections?: BlogContentSectionView[]
  seo: PageSeoView
}

function toBlogSection(cs: SanityContentSection): BlogContentSectionView {
  return { title: cs.title ?? '', paragraphs: cs.paragraphs ?? [] }
}

function toBlogPost(b: SanityBlogPost): BlogPostView {
  return {
    id: b._id,
    slug: b.slug,
    category: b.category ?? '',
    date: b.date ?? '',
    title: b.title,
    excerpt: b.excerpt ?? '',
    image: img(b.image, 800),
    heroImage: b.heroImage ? img(b.heroImage, 1600) : undefined,
    galleryImages: b.galleryImages?.map((i) => img(i, 1600)).filter(Boolean),
    contentSections: b.contentSections?.map(toBlogSection),
    seo: toSeoView(b.seo),
  }
}

export async function getBlogPostViews(): Promise<BlogPostView[]> {
  const posts = await getBlogPosts()
  return posts.map(toBlogPost)
}

export async function getBlogPostView(slug: string): Promise<BlogPostView | undefined> {
  const post = await getBlogPost(slug)
  return post ? toBlogPost(post) : undefined
}

// ---- Home (singleton) -----------------------------------------------------

type ImageWithAlt = { src: string; alt: string }

export type EditorialBlockView = {
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
  titlePosition?: 'top' | 'side'
  src?: string
  alt?: string
  src1?: string
  alt1?: string
  src2?: string
  alt2?: string
}

export type HomeView = {
  hero: {
    title: string
    subtitle: string
    ctaText: string
    ctaLink: string
    backgroundImage: string
    backgroundVideo?: string
    features: { text: string; icon: string }[]
  }
  about: {
    title: string
    description: string
    bannerImage: ImageWithAlt
    leftImage: ImageWithAlt
    rightImage: ImageWithAlt
    leftImageDesc: string
    floatingBox: { value: string; label: string }
    stats: { icon: string; value: string; label: string }[]
  }
  editorialImages: EditorialBlockView[]
  documents: {
    title: string
    ctaText: string
    ctaLink: string
    items: { id: string; title: string; image: string; whatWeDo: string; expertise: string }[]
  }
  process: {
    title: string
    steps: { id: string; title: string; description: string; image: string }[]
  }
  testimonials: {
    title: string
    bgImage?: string
    testimonials: { id: number; role: string; name: string; quote: string; image: string }[]
  }
  seo: PageSeoView
}

const pad2 = (i: number) => String(i + 1).padStart(2, '0')

function imgAlt(source: SanityImage | undefined, width: number): ImageWithAlt {
  return { src: img(source, width), alt: source?.alt ?? '' }
}

/** Shared mapper for the editorialImages blocks reused by Home and About. */
type RawEditorialBlock = SanityHome['editorialImages'][number]

function toEditorialBlock(b: RawEditorialBlock): EditorialBlockView {
  return {
    variant: b.variant,
    label: b.label,
    caption: b.caption,
    title: b.title,
    text: b.text,
    note: b.note,
    index: b.index,
    reverse: b.reverse,
    paddingTop: b.paddingTop,
    paddingBottom: b.paddingBottom,
    aspectVariant: b.aspectVariant,
    maxWidth: b.maxWidth,
    bg: b.bg,
    src: b.image ? img(b.image, 1600) : undefined,
    alt: b.alt,
    src1: b.image1 ? img(b.image1, 1600) : undefined,
    alt1: b.alt1,
    src2: b.image2 ? img(b.image2, 1600) : undefined,
    alt2: b.alt2,
  }
}

function toHome(h: SanityHome): HomeView {
  return {
    hero: {
      title: h.hero.title,
      subtitle: h.hero.subtitle,
      ctaText: h.hero.ctaText,
      ctaLink: resolveLink(h.hero.ctaLink),
      backgroundImage: img(h.hero.backgroundImage, 2560),
      backgroundVideo: h.hero.backgroundVideo,
      features: h.hero.features ?? [],
    },
    about: {
      title: h.about.title,
      description: h.about.description,
      bannerImage: imgAlt(h.about.bannerImage, 1600),
      leftImage: imgAlt(h.about.leftImage, 1200),
      rightImage: imgAlt(h.about.rightImage, 1200),
      leftImageDesc: h.about.leftImageDesc,
      floatingBox: h.about.floatingBox,
      stats: h.about.stats ?? [],
    },
    editorialImages: (h.editorialImages ?? []).map(toEditorialBlock),
    documents: {
      title: h.documents.title,
      ctaText: h.documents.ctaText,
      ctaLink: resolveLink(h.documents.ctaLink),
      items: (h.documents.items ?? []).map((it, i) => ({
        id: pad2(i),
        title: it.title,
        image: img(it.image, 800),
        whatWeDo: it.whatWeDo,
        expertise: it.expertise,
      })),
    },
    process: {
      title: h.process.title,
      steps: (h.process.steps ?? []).map((st, i) => ({
        id: pad2(i),
        title: st.title,
        description: st.description,
        image: img(st.image, 1200),
      })),
    },
    testimonials: {
      title: h.testimonials.title,
      bgImage: h.testimonials.bgImage ? img(h.testimonials.bgImage, 1920) : undefined,
      testimonials: (h.testimonials.testimonials ?? []).map((t, i) => ({
        id: i + 1,
        role: t.role,
        name: t.name,
        quote: t.quote,
        image: img(t.image, 800),
      })),
    },
    seo: toSeoView(h.seo),
  }
}

// Cached so the multiple home sections built in one run share a single query.
let homePromise: Promise<HomeView> | null = null

export function getHomeView(): Promise<HomeView> {
  if (!homePromise) homePromise = getHome().then(toHome)
  return homePromise
}

// ---- About (singleton) ----------------------------------------------------

export type AboutView = {
  hero: {
    title: string
    ctaText: string
    ctaLink: string
    backgroundImage: string
  }
  intro: {
    title: string
    paragraphs: string[]
    philosophyTitle: string
    philosophyParagraphs: string[]
    features: { text: string; icon: string }[]
  }
  specializations: {
    title: string
    description: string
    image: string
    specializationsTitle: string
    specializations: string[]
  }
  milestones: {
    title: string
    description: string
    image: string
    buttonText: string
    buttonLink: string
    items: {
      id: string
      year: string
      text: string
      icon: string
      iconClass: string
      col: string
      row: string
    }[]
  }
  team: {
    title: string
    president: { name: string; role: string; email: string; image: string }
    members: { id: string; name: string; role: string; email: string; image: string }[]
    teamGalleryImages: string[]
  }
  stats: { value: string; label: string; icon: string }[]
  editorialImages: EditorialBlockView[]
  seo: PageSeoView
}

function toAboutView(about: SanityAbout): AboutView {
  return {
    hero: {
      title: about.hero.title,
      ctaText: about.hero.ctaText,
      ctaLink: resolveLink(about.hero.ctaLink),
      backgroundImage: img(about.hero.backgroundImage, 2560),
    },
    intro: {
      title: about.intro.title,
      paragraphs: about.intro.paragraphs ?? [],
      philosophyTitle: about.intro.philosophyTitle,
      philosophyParagraphs: about.intro.philosophyParagraphs ?? [],
      features: (about.intro.features ?? []).map((f) => ({
        text: f.text ?? '',
        icon: f.icon ?? '',
      })),
    },
    specializations: {
      title: about.specializations.title,
      description: about.specializations.description,
      image: img(about.specializations.image, 1600),
      specializationsTitle: about.specializations.specializationsTitle,
      specializations: about.specializations.specializations ?? [],
    },
    milestones: {
      title: about.milestones.title,
      description: about.milestones.description,
      image: img(about.milestones.image, 1600),
      buttonText: about.milestones.buttonText,
      buttonLink: resolveLink(about.milestones.buttonLink),
      items: (about.milestones.items ?? []).map((m: SanityMilestone) => ({
        id: m._id || m._key || '',
        year: m.year ?? '',
        text: m.text ?? '',
        icon: m.icon ?? '',
        iconClass: m.iconClass ?? '',
        col: m.col ?? '',
        row: m.row ?? '',
      })),
    },
    team: {
      title: about.team.title,
      president: {
        name: about.team.president?.name ?? '',
        role: about.team.president?.role ?? '',
        email: about.team.president?.email ?? '',
        image: img(about.team.president?.image, 1200),
      },
      members: (about.team.members ?? []).map((m: SanityTeamMember) => ({
        id: m._id || m._key || '',
        name: m.name ?? '',
        role: m.role ?? '',
        email: m.email ?? '',
        image: img(m.image, 800),
      })),
      teamGalleryImages: (about.team.teamGalleryImages ?? []).map((i) => img(i, 800)),
    },
    stats: (about.stats ?? []).map((s) => ({
      value: s.value ?? '',
      label: s.label ?? '',
      icon: s.icon ?? '',
    })),
    editorialImages: (about.editorialImages ?? []).map(toEditorialBlock),
    seo: toSeoView(about.seo),
  }
}

let aboutPromise: Promise<AboutView> | null = null

export function getAboutView(): Promise<AboutView> {
  if (!aboutPromise) {
    aboutPromise = getAbout().then((about) => {
      if (!about) throw new Error('About page not found in Sanity')
      return toAboutView(about)
    })
  }
  return aboutPromise
}

export type ContactView = {
  seo: PageSeoView
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
  editorialImage: EditorialBlockView
}

function toContactView(contact: SanityContact): ContactView {
  return {
    seo: toSeoView(contact.seo),
    form: {
      title: contact.form.title,
      messagePlaceholder: contact.form.messagePlaceholder,
      services: contact.form.services ?? [],
    },
    info: {
      title: contact.info.title,
      cardDescription: contact.info.cardDescription,
      phones: contact.info.phones ?? [],
      emails: contact.info.emails ?? [],
      address: contact.info.address,
      openingHours: contact.info.openingHours,
      mapUrl: contact.info.mapUrl,
    },
    editorialImage: {
      variant: contact.editorialImage.variant as 'split',
      caption: contact.editorialImage.caption,
      titlePosition: contact.editorialImage.titlePosition,
      paddingTop: contact.editorialImage.paddingTop,
      paddingBottom: contact.editorialImage.paddingBottom,
      aspectVariant: contact.editorialImage.aspectVariant,
      maxWidth: contact.editorialImage.maxWidth,
      bg: contact.editorialImage.bg,
      src1: img(contact.editorialImage.image1, 800),
      alt1: contact.editorialImage.alt1,
      src2: img(contact.editorialImage.image2, 800),
      alt2: contact.editorialImage.alt2,
    },
  }
}

let contactPromise: Promise<ContactView> | null = null

export function getContactView(): Promise<ContactView> {
  if (!contactPromise) {
    contactPromise = getContact().then((contact) => {
      if (!contact) throw new Error('Contact page not found in Sanity')
      return toContactView(contact)
    })
  }
  return contactPromise
}

export type SettingsView = {
  headerLogo?: string
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
  mainNavigation: { label: string; href: string }[]
  footerCol1: { label: string; href: string }[]
  footerCol2: { label: string; href: string }[]
  footerTopCards: { title: string; actionText: string; href: string }[]
  socialLinks: { network: string; url: string }[]
  defaultSeo: {
    metaTitle: string
    metaDescription: string
    ogImage?: string
  }
}

function toSettingsView(settings: SanitySiteSettings): SettingsView {
  return {
    ...settings,
    headerLogo: settings.headerLogo ? img(settings.headerLogo, 400) : undefined,
    mainNavigation: (settings.mainNavigation ?? []).map((n) => ({
      ...n,
      href: resolveLink(n.href),
    })),
    footerCol1: (settings.footerCol1 ?? []).map((n) => ({ ...n, href: resolveLink(n.href) })),
    footerCol2: (settings.footerCol2 ?? []).map((n) => ({ ...n, href: resolveLink(n.href) })),
    footerTopCards: (settings.footerTopCards ?? []).map((n) => ({
      ...n,
      href: resolveLink(n.href),
    })),
    socialLinks: settings.socialLinks ?? [],
    defaultSeo: {
      ...settings.defaultSeo,
      ogImage: settings.defaultSeo?.ogImage ? img(settings.defaultSeo.ogImage, 1200) : undefined,
    },
  }
}

let settingsPromise: Promise<SettingsView> | null = null

export function getSettingsView(): Promise<SettingsView> {
  if (!settingsPromise) {
    settingsPromise = getSettings().then((settings) => {
      if (!settings) throw new Error('Site settings not found in Sanity')
      return toSettingsView(settings)
    })
  }
  return settingsPromise
}

export type ServicesPageView = Omit<SanityServicesPage, 'faqs'> & {
  faqs: { id: string; question: string; answer: string }[]
}

let servicesPagePromise: Promise<ServicesPageView> | null = null

export function getServicesPageView(): Promise<ServicesPageView> {
  if (!servicesPagePromise) {
    servicesPagePromise = getServicesPage().then((page) => {
      if (!page) throw new Error('Services page not found in Sanity')
      return {
        ...page,
        faqs: (page.faqs || []).map((faq, i) => ({
          ...faq,
          id: String(i + 1).padStart(2, '0'),
        })),
      }
    })
  }
  return servicesPagePromise
}
