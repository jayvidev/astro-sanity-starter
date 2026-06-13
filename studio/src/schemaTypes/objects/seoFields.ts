import {defineField, defineType} from 'sanity'

/**
 * Reutilizable SEO object — embed with { name: 'seo', type: 'seoFields' }
 * in any document schema.
 */
export default defineType({
  name: 'seoFields',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      description: 'Overrides the default title. Keep under 70 characters.',
      validation: (Rule) => Rule.max(70),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      description: 'Overrides the default description. Keep under 160 characters.',
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
      description: 'Social share image (1200×630 recommended). Falls back to the site default.',
      options: {hotspot: true},
    }),
  ],
})
