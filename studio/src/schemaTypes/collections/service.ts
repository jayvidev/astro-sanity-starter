import {defineField, defineType} from 'sanity'
import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'

/**
 * Service. Rendered through src/lib/content.ts (ServiceView).
 */
export default defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  orderings: [orderRankOrdering],
  groups: [{name: 'seo', title: 'SEO'}],
  fields: [
    orderRankField({type: 'service'}),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Card image',
      type: 'image',
      options: {hotspot: true},
      fields: [{name: 'alt', title: 'Alternative text', type: 'string'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero image',
      type: 'image',
      options: {hotspot: true},
      fields: [{name: 'alt', title: 'Alternative text', type: 'string'}],
    }),
    defineField({
      name: 'description',
      title: 'Description paragraphs',
      type: 'array',
      of: [{type: 'text', rows: 3}],
    }),
    defineField({
      name: 'highlights',
      title: 'Highlights',
      type: 'array',
      of: [{type: 'serviceHighlight'}],
    }),
    defineField({
      name: 'showContentSection',
      title: 'Show content section',
      type: 'boolean',
      description: 'Enable the editorial content block below the hero for this service.',
      initialValue: false,
    }),
    defineField({
      name: 'contentSection',
      title: 'Content section',
      type: 'serviceContentSection',
      hidden: ({parent}) => !parent?.showContentSection,
    }),
    defineField({
      name: 'showGallery',
      title: 'Show gallery',
      type: 'boolean',
      description: 'Enable the image gallery below the hero for this service.',
      initialValue: false,
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [{type: 'image', options: {hotspot: true}}],
      hidden: ({parent}) => !parent?.showGallery,
    }),
    defineField({name: 'seo', title: 'SEO', type: 'seoFields', group: 'seo'}),
  ],
  preview: {
    select: {title: 'title', media: 'image'},
  },
})
