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

export default defineType({
  name: 'about',
  title: 'About page',
  type: 'document',
  groups: [
    {name: 'hero', title: 'Hero'},
    {name: 'intro', title: 'Intro'},
    {name: 'specializations', title: 'Specializations'},
    {name: 'milestones', title: 'Milestones'},
    {name: 'team', title: 'Team'},
    {name: 'stats', title: 'Stats'},
    {name: 'editorial', title: 'Editorial images'},
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
        imageWithAlt('backgroundImage', 'Background image'),
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
      ],
    }),

    // ---- Intro ----
    defineField({
      name: 'intro',
      title: 'Intro',
      type: 'object',
      group: 'intro',
      fields: [
        defineField({
          name: 'title',
          type: 'string',
          validation: (Rule) => Rule.required().max(100),
        }),
        defineField({
          name: 'paragraphs',
          title: 'Paragraphs',
          type: 'array',
          of: [{type: 'string'}],
          validation: (Rule) => Rule.required().min(1),
        }),
        defineField({
          name: 'philosophyTitle',
          title: 'Philosophy Title',
          type: 'string',
          validation: (Rule) => Rule.required().max(100),
        }),
        defineField({
          name: 'philosophyParagraphs',
          title: 'Philosophy Paragraphs',
          type: 'array',
          of: [{type: 'string'}],
          validation: (Rule) => Rule.required().min(1),
        }),
        defineField({
          name: 'features',
          title: 'Features',
          type: 'array',
          of: [{type: 'aboutIntroFeature'}],
          validation: (Rule) => Rule.required().min(1).max(6),
        }),
      ],
    }),

    // ---- Specializations ----
    defineField({
      name: 'specializations',
      title: 'Specializations',
      type: 'object',
      group: 'specializations',
      fields: [
        defineField({
          name: 'title',
          type: 'string',
          validation: (Rule) => Rule.required().max(100),
        }),
        defineField({
          name: 'description',
          type: 'text',
          rows: 4,
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'image',
          title: 'Image',
          type: 'image',
          options: {hotspot: true},
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'specializationsTitle',
          title: 'Specializations Title',
          type: 'string',
          validation: (Rule) => Rule.required().max(60),
        }),
        defineField({
          name: 'specializations',
          title: 'Specializations',
          type: 'array',
          of: [{type: 'string'}],
          validation: (Rule) => Rule.required().min(1),
        }),
      ],
    }),

    // ---- Milestones ----
    defineField({
      name: 'milestones',
      title: 'Milestones',
      type: 'object',
      group: 'milestones',
      fields: [
        defineField({
          name: 'title',
          type: 'string',
          validation: (Rule) => Rule.required().max(100),
        }),
        defineField({
          name: 'description',
          type: 'text',
          rows: 3,
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'image',
          title: 'Image',
          type: 'image',
          options: {hotspot: true},
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'buttonText',
          title: 'Button Text',
          type: 'string',
          validation: (Rule) => Rule.required().max(30),
        }),
        defineField({
          name: 'buttonLink',
          title: 'Button Link',
          type: 'internalLink',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'items',
          title: 'Milestone Items',
          type: 'array',
          of: [{type: 'milestone'}],
        }),
      ],
    }),

    // ---- Team ----
    defineField({
      name: 'team',
      title: 'Team',
      type: 'object',
      group: 'team',
      fields: [
        defineField({
          name: 'title',
          type: 'string',
          validation: (Rule) => Rule.required().max(100),
        }),
        defineField({
          name: 'president',
          title: 'President',
          type: 'teamMember',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'teamGalleryImages',
          title: 'Team Gallery Images',
          type: 'array',
          of: [{type: 'image', options: {hotspot: true}}],
          validation: (Rule) => Rule.required().min(2).max(2),
        }),
        defineField({
          name: 'members',
          title: 'Team Members',
          type: 'array',
          of: [{type: 'teamMember'}],
        }),
      ],
    }),

    // ---- Stats ----
    defineField({
      name: 'stats',
      title: 'Stats',
      type: 'array',
      group: 'stats',
      of: [{type: 'aboutStat'}],
      validation: (Rule) => Rule.required().min(2).max(6),
    }),

    // ---- Editorial images ----
    defineField({
      name: 'editorialImages',
      title: 'Editorial images',
      type: 'array',
      group: 'editorial',
      of: [{type: 'editorialBlock'}],
    }),
    defineField({name: 'seo', title: 'SEO', type: 'seoFields', group: 'seo'}),
  ],
  preview: {
    prepare: () => ({title: 'About page'}),
  },
})
