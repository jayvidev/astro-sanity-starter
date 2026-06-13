import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'aboutStat',
  title: 'Stat',
  type: 'object',
  fields: [
    defineField({
      name: 'value',
      title: 'Value',
      type: 'string',
      description: 'e.g. "1,000+", "20+". Animated count-up uses the number part.',
      validation: (Rule) => Rule.required().max(10),
    }),
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (Rule) => Rule.required().max(50),
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'image',
      options: {accept: 'image/svg+xml'},
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {select: {title: 'value', subtitle: 'label'}},
})
