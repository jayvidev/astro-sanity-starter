import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'aboutIntroFeature',
  title: 'Intro Feature',
  type: 'object',
  fields: [
    defineField({
      name: 'text',
      title: 'Text',
      type: 'string',
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
  preview: {
    select: {title: 'text'},
  },
})
