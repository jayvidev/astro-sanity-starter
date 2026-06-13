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
    {name: 'about', title: 'About'},
    {name: 'editorial', title: 'Editorial images'},
    {name: 'documents', title: 'Documents'},
    {name: 'process', title: 'Process'},
    {name: 'testimonials', title: 'Testimonials'},
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
        defineField({
          name: 'backgroundVideo',
          title: 'Background Video',
          type: 'file',
          options: {accept: 'video/*'},
          description: 'Optional. Upload a looping background video (MP4).',
        }),
        defineField({
          name: 'features',
          title: 'Features',
          type: 'array',
          of: [{type: 'heroFeature'}],
          validation: (Rule) => Rule.required().min(1).max(6),
        }),
      ],
    }),

    // ---- About ----
    defineField({
      name: 'about',
      title: 'About',
      type: 'object',
      group: 'about',
      fields: [
        defineField({
          name: 'title',
          type: 'string',
          validation: (Rule) => Rule.required().max(60),
        }),
        defineField({
          name: 'description',
          type: 'text',
          rows: 4,
          validation: (Rule) => Rule.required().max(300),
        }),
        imageWithAlt('bannerImage', 'Banner image'),
        imageWithAlt('leftImage', 'Left image'),
        imageWithAlt('rightImage', 'Right image'),
        defineField({
          name: 'leftImageDesc',
          title: 'Left image description',
          type: 'text',
          rows: 4,
          validation: (Rule) => Rule.required().max(300),
        }),
        defineField({
          name: 'floatingBox',
          title: 'Floating box',
          type: 'object',
          fields: [
            defineField({
              name: 'value',
              type: 'string',
              validation: (Rule) => Rule.required().max(10),
            }),
            defineField({
              name: 'label',
              type: 'string',
              validation: (Rule) => Rule.required().max(30),
            }),
          ],
        }),
        defineField({
          name: 'stats',
          title: 'Stats',
          type: 'array',
          of: [{type: 'aboutStat'}],
          validation: (Rule) => Rule.required().min(2).max(4),
        }),
      ],
    }),

    // ---- Editorial images ----
    defineField({
      name: 'editorialImages',
      title: 'Editorial images',
      type: 'array',
      group: 'editorial',
      of: [{type: 'editorialBlock'}],
    }),

    // ---- Documents ----
    defineField({
      name: 'documents',
      title: 'Documents',
      type: 'object',
      group: 'documents',
      fields: [
        defineField({
          name: 'title',
          type: 'string',
          validation: (Rule) => Rule.required().max(80),
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
        defineField({
          name: 'items',
          title: 'Items',
          type: 'array',
          of: [{type: 'documentItem'}],
          validation: (Rule) => Rule.required().min(1).max(10),
        }),
      ],
    }),

    // ---- Process ----
    defineField({
      name: 'process',
      title: 'Process',
      type: 'object',
      group: 'process',
      fields: [
        defineField({
          name: 'title',
          type: 'string',
          validation: (Rule) => Rule.required().max(80),
        }),
        defineField({
          name: 'steps',
          title: 'Steps',
          type: 'array',
          of: [{type: 'processStep'}],
          validation: (Rule) => Rule.required().min(1).max(8),
        }),
      ],
    }),

    // ---- Testimonials ----
    defineField({
      name: 'testimonials',
      title: 'Testimonials',
      type: 'object',
      group: 'testimonials',
      fields: [
        defineField({
          name: 'title',
          type: 'string',
          validation: (Rule) => Rule.required().max(80),
        }),
        defineField({
          name: 'bgImage',
          title: 'Background Image',
          type: 'image',
          options: {hotspot: true},
        }),
        defineField({
          name: 'testimonials',
          title: 'Testimonials',
          type: 'array',
          of: [{type: 'testimonial'}],
          validation: (Rule) => Rule.required().min(1).max(5),
        }),
      ],
    }),
    defineField({name: 'seo', title: 'SEO', type: 'seoFields', group: 'seo'}),
  ],
  preview: {
    prepare: () => ({title: 'Home page'}),
  },
})
