import home from './singletons/home'
import about from './singletons/about'
import contact from './singletons/contact'
import siteSettings from './singletons/siteSettings'
import servicesPage from './singletons/servicesPage'
import project from './collections/project'
import blogPost from './collections/blogPost'
import service from './collections/service'
import seoFields from './objects/seoFields'
import contentSection from './objects/contentSection'
import serviceContentSection from './objects/serviceContentSection'
import serviceHighlight from './objects/serviceHighlight'
import heroFeature from './objects/heroFeature'
import aboutIntroFeature from './objects/aboutIntroFeature'
import aboutMilestoneItem from './objects/aboutMilestoneItem'
import teamMember from './objects/teamMember'
import aboutStat from './objects/aboutStat'
import editorialBlock from './objects/editorialBlock'
import documentItem from './objects/documentItem'
import processStep from './objects/processStep'
import testimonial from './objects/testimonial'
import internalLink from './objects/internalLink'

// All schema types registered in the Studio.
// https://www.sanity.io/docs/schema-types
export const schemaTypes = [
  // singletons (pages)
  home,
  about,
  contact,
  siteSettings,
  servicesPage,
  // documents
  project,
  blogPost,
  service,
  // objects
  seoFields,
  contentSection,
  serviceContentSection,
  serviceHighlight,
  heroFeature,
  aboutIntroFeature,
  aboutMilestoneItem,
  teamMember,
  aboutStat,
  editorialBlock,
  documentItem,
  processStep,
  testimonial,
  internalLink,
]
