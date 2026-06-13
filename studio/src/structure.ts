import type {StructureResolver} from 'sanity/structure'
import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'
import {
  HomeIcon,
  UsersIcon,
  EnvelopeIcon,
  DocumentsIcon,
  ImagesIcon,
  ProjectsIcon,
  CogIcon,
} from '@sanity/icons'

/**
 * Custom Studio structure.
 * - "Pages" groups single-instance documents (singletons) like Home.
 * - Collections use orderable (drag-and-drop) lists so editors control the
 *   order shown on the site.
 */
export const structure: StructureResolver = (S, context) =>
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
              S.listItem()
                .title('About')
                .id('about')
                .icon(UsersIcon)
                .child(S.document().schemaType('about').documentId('about')),
              S.listItem()
                .title('Contact')
                .id('contact')
                .icon(EnvelopeIcon)
                .child(S.document().schemaType('contact').documentId('contact')),
              S.listItem()
                .title('Services Page')
                .id('servicesPage')
                .icon(DocumentsIcon)
                .child(S.document().schemaType('servicesPage').documentId('servicesPage')),
              S.divider(),
              orderableDocumentListDeskItem({
                type: 'project',
                title: 'Projects',
                icon: ProjectsIcon,
                S,
                context,
              }),
              orderableDocumentListDeskItem({
                type: 'blogPost',
                title: 'Blog posts',
                icon: DocumentsIcon,
                S,
                context,
              }),
              orderableDocumentListDeskItem({
                type: 'service',
                title: 'Services',
                icon: ImagesIcon,
                S,
                context,
              }),
            ]),
        ),
      S.divider(),
      S.listItem()
        .title('Site Settings')
        .id('siteSettings')
        .icon(CogIcon)
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
    ])
