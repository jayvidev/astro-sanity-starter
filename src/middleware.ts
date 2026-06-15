import type { MiddlewareHandler } from 'astro'

import { resetContentCache } from '@/lib/content'

export const onRequest: MiddlewareHandler = (_context, next) => {
  resetContentCache()
  return next()
}
