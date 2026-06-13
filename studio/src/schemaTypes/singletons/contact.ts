import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'contact',
  title: 'Contact page',
  type: 'document',
  groups: [
    {name: 'seo', title: 'SEO'},
    {name: 'form', title: 'Form'},
    {name: 'info', title: 'Info'},
    {name: 'editorial', title: 'Editorial Image'},
  ],
  fields: [
    // ---- SEO ----
    defineField({name: 'seo', title: 'SEO', type: 'seoFields', group: 'seo'}),

    // ---- Form ----
    defineField({
      name: 'form',
      title: 'Contact Form',
      type: 'object',
      group: 'form',
      fields: [
        defineField({
          name: 'title',
          type: 'string',
          validation: (Rule) => Rule.required().max(100),
        }),
        defineField({
          name: 'messagePlaceholder',
          title: 'Message Placeholder',
          type: 'text',
          rows: 2,
          validation: (Rule) => Rule.required().max(200),
        }),
        defineField({
          name: 'services',
          title: 'Services Options',
          description: 'Dropdown options for the services field in the form',
          type: 'array',
          of: [{type: 'string'}],
          validation: (Rule) => Rule.required().min(1),
        }),
      ],
    }),

    // ---- Info ----
    defineField({
      name: 'info',
      title: 'Contact Info',
      type: 'object',
      group: 'info',
      fields: [
        defineField({
          name: 'title',
          type: 'string',
          validation: (Rule) => Rule.required().max(100),
        }),
        defineField({
          name: 'cardDescription',
          title: 'Card Description',
          type: 'text',
          rows: 2,
          validation: (Rule) => Rule.required().max(200),
        }),
        defineField({
          name: 'phones',
          title: 'Phones',
          type: 'array',
          of: [{type: 'string'}],
          validation: (Rule) => Rule.required().min(1),
        }),
        defineField({
          name: 'emails',
          title: 'Emails',
          type: 'array',
          of: [{type: 'string'}],
          validation: (Rule) => Rule.required().min(1),
        }),
        defineField({
          name: 'address',
          title: 'Address',
          type: 'object',
          fields: [
            defineField({name: 'line1', type: 'string', validation: (Rule) => Rule.required()}),
            defineField({name: 'line2', type: 'string', validation: (Rule) => Rule.required()}),
          ],
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'openingHours',
          title: 'Opening Hours',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'mapUrl',
          title: 'Google Maps Embed URL',
          type: 'url',
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),

    // ---- Editorial Image ----
    defineField({
      name: 'editorialImage',
      title: 'Editorial Image (Split Variant)',
      type: 'editorialBlock',
      group: 'editorial',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    prepare: () => ({title: 'Contact page'}),
  },
})
