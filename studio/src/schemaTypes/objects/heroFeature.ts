import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'heroFeature',
  title: 'Hero feature',
  type: 'object',
  fields: [
    defineField({
      name: 'text',
      title: 'Text',
      type: 'text',
      rows: 2,
      description: 'Use a line break to control wrapping.',
      validation: (Rule) => Rule.required().max(40),
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'image',
      options: {accept: 'image/svg+xml'},
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {select: {title: 'text'}},
})
