import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'internalLink',
  title: 'Internal Link',
  type: 'object',
  fields: [
    defineField({
      name: 'page',
      title: 'Page Route',
      type: 'string',
      options: {
        list: [
          {title: 'Home', value: '/#home'},
          {title: 'About', value: '/about'},
          {title: 'Blog', value: '/blog'},
          {title: 'Contact', value: '/contact'},
          {title: 'Projects', value: '/projects'},
          {title: 'Services', value: '/services'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
})
