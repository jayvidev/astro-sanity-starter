import type {StructureResolver} from 'sanity/structure'
import {
  HomeIcon,
  CogIcon,
} from '@sanity/icons'

/**
 * Custom Studio structure.
 * - "Pages" groups single-instance documents (singletons) like Home.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Pages')
        .child(
          S.list()
            .title('Pages')
            .items([
              S.listItem()
                .title('Home')
                .id('home')
                .icon(HomeIcon)
                .child(S.document().schemaType('home').documentId('home')),
            ]),
        ),
      S.divider(),
      S.listItem()
        .title('Site Settings')
        .id('siteSettings')
        .icon(CogIcon)
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
    ])
