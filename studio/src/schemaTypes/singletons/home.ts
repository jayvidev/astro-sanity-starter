import {defineField, defineType} from 'sanity'

const imageWithAlt = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: 'image',
    options: {hotspot: true},
    fields: [{name: 'alt', title: 'Alt text', type: 'string'}],
    validation: (Rule) => Rule.required(),
  })

/**
 * Home page — a singleton holding every section of `/`.
 * Rendered through src/lib/content.ts (HomeView). Edited via the "Pages" group in the
 * Studio structure (cannot be created or deleted, only edited).
 */
export default defineType({
  name: 'home',
  title: 'Home page',
  type: 'document',
  groups: [
    {name: 'hero', title: 'Hero'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    // ---- Hero ----
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'object',
      group: 'hero',
      fields: [
        defineField({
          name: 'title',
          type: 'string',
          validation: (Rule) => Rule.required().max(100),
        }),
        defineField({
          name: 'subtitle',
          type: 'text',
          rows: 3,
          validation: (Rule) => Rule.required().max(200),
        }),
        defineField({
          name: 'ctaText',
          title: 'CTA text',
          type: 'string',
          validation: (Rule) => Rule.required().max(30),
        }),
        defineField({
          name: 'ctaLink',
          title: 'CTA link',
          type: 'internalLink',
          validation: (Rule) => Rule.required(),
        }),
        imageWithAlt('backgroundImage', 'Background image'),
      ],
    }),

    defineField({name: 'seo', title: 'SEO', type: 'seoFields', group: 'seo'}),
  ],
  preview: {
    prepare: () => ({title: 'Home page'}),
  },
})
