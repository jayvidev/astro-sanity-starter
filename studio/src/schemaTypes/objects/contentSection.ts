import {defineField, defineType} from 'sanity'

/**
 * Reusable text section: a heading plus one or more paragraphs.
 * Mirrors BlogContentSection in the frontend TS data.
 */
export default defineType({
  name: 'contentSection',
  title: 'Content section',
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
  ],
  preview: {
    select: {title: 'title'},
  },
})
