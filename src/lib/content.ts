import { getSettings, type SanityImage, type SanitySiteSettings, urlForImage } from '@/lib/sanity'

function img(source: SanityImage | undefined, width: number): string | undefined {
  if (!source?.asset) return undefined
  return urlForImage(source).width(width).auto('format').url()
}

export type SettingsView = {
  companyName: string
  defaultSeo: {
    metaTitle?: string
    metaDescription?: string
    ogImage?: string
  }
}

function toSettingsView(settings: SanitySiteSettings): SettingsView {
  return {
    companyName: settings.companyName,
    defaultSeo: {
      metaTitle: settings.defaultSeo?.metaTitle,
      metaDescription: settings.defaultSeo?.metaDescription,
      ogImage: settings.defaultSeo?.ogImage ? img(settings.defaultSeo.ogImage, 1200) : undefined,
    },
  }
}

const fallbackSettings: SettingsView = {
  companyName: 'Astro + Sanity Starter',
  defaultSeo: {
    metaTitle: 'Astro + Sanity Starter',
    metaDescription: 'A clean starter template with Astro and Sanity.',
  },
}

let settingsPromise: Promise<SettingsView> | null = null

export function getSettingsView(): Promise<SettingsView> {
  if (!settingsPromise) {
    settingsPromise = getSettings()
      .then((settings) => {
        if (!settings) return fallbackSettings
        return toSettingsView(settings)
      })
      .catch((err) => {
        console.error('Failed to load settings from Sanity, using fallback:', err)
        return fallbackSettings
      })
  }
  return settingsPromise
}
