import home from './singletons/home'
import siteSettings from './singletons/siteSettings'
import seoFields from './objects/seoFields'
import internalLink from './objects/internalLink'
// import exampleObject from './objects/exampleObject'

// All schema types registered in the Studio.
// https://www.sanity.io/docs/schema-types
export const schemaTypes = [
  // singletons (pages)
  home,
  siteSettings,
  // objects
  seoFields,
  internalLink,
  // exampleObject,
]
