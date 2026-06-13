import {defineField, defineType} from 'sanity'

/**
 * A single editorial image block on the home page. The `variant` controls the
 * layout; some fields only apply to certain variants (see hidden rules).
 * Rendered by src/components/ui/EditorialImage.astro (EditorialBlockView).
 */
export default defineType({
  name: 'editorialBlock',
  title: 'Editorial block',
  type: 'object',
  fields: [
    defineField({
      name: 'variant',
      title: 'Variant',
      type: 'string',
      options: {
        list: [
          {title: 'Statement', value: 'statement'},
          {title: 'Feature', value: 'feature'},
          {title: 'Showcase', value: 'showcase'},
          {title: 'Split (two images)', value: 'split'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    // Single-image variants (statement / feature / showcase)
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      hidden: ({parent}) => parent?.variant === 'split',
    }),
    defineField({
      name: 'alt',
      title: 'Alt text',
      type: 'string',
      hidden: ({parent}) => parent?.variant === 'split',
    }),
    // Split variant (two images)
    defineField({
      name: 'image1',
      title: 'Image 1 (split)',
      type: 'image',
      options: {hotspot: true},
      hidden: ({parent}) => parent?.variant !== 'split',
    }),
    defineField({
      name: 'alt1',
      title: 'Alt 1 (split)',
      type: 'string',
      hidden: ({parent}) => parent?.variant !== 'split',
    }),
    defineField({
      name: 'image2',
      title: 'Image 2 (split)',
      type: 'image',
      options: {hotspot: true},
      hidden: ({parent}) => parent?.variant !== 'split',
    }),
    defineField({
      name: 'alt2',
      title: 'Alt 2 (split)',
      type: 'string',
      hidden: ({parent}) => parent?.variant !== 'split',
    }),
    defineField({
      name: 'titlePosition',
      title: 'Title Position (split)',
      type: 'string',
      options: {list: ['top', 'side']},
      hidden: ({parent}) => parent?.variant !== 'split',
    }),
    // Shared text fields (used by different variants)
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
      hidden: ({parent}) => parent?.variant === 'feature',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      hidden: ({parent}) => parent?.variant !== 'feature',
    }),
    defineField({
      name: 'text',
      title: 'Text',
      type: 'text',
      rows: 3,
      hidden: ({parent}) => parent?.variant === 'statement' || parent?.variant === 'showcase',
    }),
    defineField({
      name: 'note',
      title: 'Note',
      type: 'text',
      rows: 2,
      hidden: ({parent}) => parent?.variant !== 'showcase',
    }),
    defineField({
      name: 'index',
      title: 'Index label',
      type: 'string',
      description: 'Small number/label, e.g. "01" (feature variant).',
      hidden: ({parent}) => parent?.variant !== 'feature',
    }),
    defineField({
      name: 'reverse',
      title: 'Reverse layout',
      type: 'boolean',
      initialValue: false,
      hidden: ({parent}) => parent?.variant === 'statement',
    }),
    defineField({
      name: 'paddingTop',
      title: 'Padding Top',
      type: 'string',
      options: {
        list: [
          {title: 'None', value: 'none'},
          {title: 'Small', value: 'sm'},
          {title: 'Medium', value: 'md'},
          {title: 'Large', value: 'lg'},
        ],
        layout: 'dropdown',
      },
    }),
    defineField({
      name: 'paddingBottom',
      title: 'Padding Bottom',
      type: 'string',
      options: {
        list: [
          {title: 'None', value: 'none'},
          {title: 'Small', value: 'sm'},
          {title: 'Medium', value: 'md'},
          {title: 'Large', value: 'lg'},
        ],
        layout: 'dropdown',
      },
    }),
    defineField({
      name: 'aspectVariant',
      title: 'Aspect Ratio',
      type: 'string',
      options: {
        list: [
          {title: 'Default', value: 'default'},
          {title: 'Tall Banner', value: 'tall'},
        ],
      },
      hidden: ({parent}) => parent?.variant !== 'statement',
    }),
    defineField({
      name: 'maxWidth',
      title: 'Max Width',
      type: 'string',
      options: {
        list: [
          {title: 'Default', value: 'default'},
          {title: 'Narrow', value: 'narrow'},
        ],
      },
    }),
    defineField({
      name: 'bg',
      title: 'Background color',
      type: 'string',
      description: 'CSS color, e.g. "#EDEDED".',
    }),
  ],
  preview: {
    select: {title: 'caption', subtitle: 'variant', media: 'image'},
    prepare({title, subtitle, media}) {
      return {title: title || subtitle, subtitle, media}
    },
  },
})
