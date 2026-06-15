import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  groups: [
    {name: 'branding', title: 'Branding'},
    {name: 'company', title: 'Company Info'},
    {name: 'business', title: 'Business / Structured Data'},
    {name: 'navigation', title: 'Navigation'},
    {name: 'footer', title: 'Footer'},
    {name: 'social', title: 'Social Links'},
    {name: 'seo', title: 'Default SEO'},
  ],
  fields: [
    // --- Branding ---
    defineField({
      name: 'headerLogo',
      title: 'Header Logo',
      type: 'image',
      group: 'branding',
      options: {hotspot: true},
    }),
    // --- Company Info ---
    defineField({
      name: 'companyName',
      title: 'Company Name',
      type: 'string',
      group: 'company',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'companyAddress',
      title: 'Company Address',
      type: 'string',
      group: 'company',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'companyPhone',
      title: 'Company Phone',
      type: 'string',
      group: 'company',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'companyEmail',
      title: 'Company Email',
      type: 'string',
      group: 'company',
      validation: (Rule) => Rule.required(),
    }),

    // --- Business / Structured Data (feeds schema.org JSON-LD + footer) ---
    defineField({
      name: 'businessType',
      title: 'Business Type (schema.org)',
      description: 'schema.org @type, e.g. ProfessionalService, LocalBusiness, Organization.',
      type: 'string',
      group: 'business',
      initialValue: 'ProfessionalService',
    }),
    defineField({
      name: 'geo',
      title: 'Geo Coordinates',
      type: 'object',
      group: 'business',
      options: {collapsible: true, collapsed: true},
      fields: [
        defineField({name: 'latitude', type: 'number'}),
        defineField({name: 'longitude', type: 'number'}),
      ],
    }),
    defineField({
      name: 'structuredAddress',
      title: 'Structured Address',
      description:
        'Postal parts used by JSON-LD (the flat "Company Address" above is display-only).',
      type: 'object',
      group: 'business',
      options: {collapsible: true, collapsed: true},
      fields: [
        defineField({name: 'streetAddress', type: 'string'}),
        defineField({name: 'addressLocality', title: 'City', type: 'string'}),
        defineField({name: 'addressRegion', title: 'State', type: 'string'}),
        defineField({name: 'postalCode', type: 'string'}),
        defineField({name: 'addressCountry', title: 'Country (ISO)', type: 'string'}),
      ],
    }),
    defineField({
      name: 'openingHours',
      title: 'Opening Hours',
      type: 'object',
      group: 'business',
      options: {collapsible: true, collapsed: true},
      fields: [
        defineField({
          name: 'days',
          type: 'array',
          of: [{type: 'string'}],
          options: {
            list: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          },
          initialValue: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        }),
        defineField({name: 'opens', type: 'string', initialValue: '09:00'}),
        defineField({name: 'closes', type: 'string', initialValue: '18:00'}),
      ],
    }),

    // --- Navigation ---
    defineField({
      name: 'mainNavigation',
      title: 'Main Navigation',
      description:
        'Links for the top header menu. The Projects link automatically displays the dropdown.',
      type: 'array',
      group: 'navigation',
      of: [
        {
          type: 'object',
          fields: [
            defineField({name: 'label', type: 'string', validation: (Rule) => Rule.required()}),
            defineField({
              name: 'href',
              type: 'internalLink',
              validation: (Rule) => Rule.required(),
            }),
          ],
        },
      ],
    }),

    // --- Footer ---
    defineField({
      name: 'footerCol1',
      title: 'Footer Column 1',
      type: 'array',
      group: 'footer',
      of: [
        {
          type: 'object',
          fields: [
            defineField({name: 'label', type: 'string', validation: (Rule) => Rule.required()}),
            defineField({
              name: 'href',
              type: 'internalLink',
              validation: (Rule) => Rule.required(),
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'footerCol2',
      title: 'Footer Column 2',
      type: 'array',
      group: 'footer',
      of: [
        {
          type: 'object',
          fields: [
            defineField({name: 'label', type: 'string', validation: (Rule) => Rule.required()}),
            defineField({
              name: 'href',
              type: 'internalLink',
              validation: (Rule) => Rule.required(),
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'footerTopCards',
      title: 'Footer Top Cards',
      description: 'The two large call to action blocks on top of the footer',
      type: 'array',
      group: 'footer',
      validation: (Rule) => Rule.max(2),
      of: [
        {
          type: 'object',
          fields: [
            defineField({name: 'title', type: 'string', validation: (Rule) => Rule.required()}),
            defineField({
              name: 'actionText',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'href',
              type: 'internalLink',
              validation: (Rule) => Rule.required(),
            }),
          ],
        },
      ],
    }),

    // --- Social Links ---
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      group: 'social',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'network',
              type: 'string',
              options: {list: ['Instagram', 'Facebook', 'Pinterest', 'LinkedIn', 'X']},
              validation: (Rule) => Rule.required(),
            }),
            defineField({name: 'url', type: 'url', validation: (Rule) => Rule.required()}),
          ],
          preview: {
            select: {title: 'network', subtitle: 'url'},
          },
        },
      ],
    }),

    // --- SEO ---
    defineField({
      name: 'defaultSeo',
      title: 'Default SEO',
      type: 'object',
      group: 'seo',
      fields: [
        defineField({name: 'metaTitle', type: 'string', validation: (Rule) => Rule.required()}),
        defineField({
          name: 'metaDescription',
          type: 'text',
          rows: 3,
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'ogImage',
          title: 'Open Graph Image',
          type: 'image',
          options: {hotspot: true},
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Global Site Settings',
      }
    },
  },
})
