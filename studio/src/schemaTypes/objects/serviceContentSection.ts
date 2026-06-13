import {defineField, defineType} from 'sanity'

/**
 * Rich service section: heading, paragraphs, an image, optional CTA and extra images.
 * Mirrors ServiceContentSection in the frontend TS data.
 */
export default defineType({
  name: 'serviceContentSection',
  title: 'Service section',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'paragraphs',
      title: 'Paragraphs',
      type: 'array',
      of: [{type: 'text', rows: 4}],
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'additionalImages',
      title: 'Additional images',
      type: 'array',
      of: [{type: 'image', options: {hotspot: true}}],
    }),
    defineField({
      name: 'ctaLabel',
      title: 'CTA label',
      type: 'string',
    }),
    defineField({
      name: 'ctaHref',
      title: 'CTA link',
      type: 'internalLink',
    }),
  ],
  preview: {
    select: {title: 'title', media: 'image'},
  },
})
