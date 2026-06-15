/*
import {defineField, defineType} from 'sanity'
import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'

/**
 * Example of a collection (multiple documents of the same type)
 * Uncomment this file and import it in `index.ts` to use it.
 * You also need to add it to `structure.ts` to show it in the Sanity menu.
 *\/
export default defineType({
  name: 'exampleCollection',
  title: 'Example Collection',
  type: 'document',
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({type: 'exampleCollection'}),
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
  ],
})
*/
