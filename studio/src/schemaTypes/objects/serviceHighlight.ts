import {defineField, defineType} from 'sanity'

/**
 * A single service highlight: short title + description.
 * Mirrors ServiceHighlight in the frontend TS data.
 */
export default defineType({
  name: 'serviceHighlight',
  title: 'Highlight',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'description'},
  },
})
