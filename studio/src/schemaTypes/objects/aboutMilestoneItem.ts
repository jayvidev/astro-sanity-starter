import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'milestone',
  title: 'Milestone',
  type: 'object',
  fields: [
    defineField({
      name: 'year',
      title: 'Year',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'text',
      title: 'Text',
      type: 'string',
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'image',
      options: {accept: 'image/svg+xml'},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'iconClass',
      title: 'Icon CSS Class',
      type: 'string',
      description: 'e.g. "w-[clamp(2rem,4vw,2.5rem)] h-auto text-neutral-dark"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'col',
      title: 'Grid Column Class',
      type: 'string',
      description: 'e.g. "col-start-2"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'row',
      title: 'Grid Row Class',
      type: 'string',
      description: 'e.g. "row-start-1"',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {title: 'year', subtitle: 'text'},
  },
})
