import { isValidSignature, SIGNATURE_HEADER_NAME } from '@sanity/webhook'
import type { APIRoute } from 'astro'

import { config } from '@/config'
import { pathsForDocument, type WebhookPayload } from '@/lib/revalidate-paths'

export const prerender = false

const json = (data: unknown, status: number) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export const POST: APIRoute = async ({ request }) => {
  const { sanitySecret, vercelBypassToken } = config.revalidation

  if (!sanitySecret || !vercelBypassToken) {
    return json({ error: 'Revalidation not configured (missing env vars)' }, 500)
  }

  const signature = request.headers.get(SIGNATURE_HEADER_NAME)
  const body = await request.text()

  if (!signature || !(await isValidSignature(body, signature, sanitySecret))) {
    return json({ error: 'Invalid signature' }, 401)
  }

  let payload: WebhookPayload
  try {
    payload = JSON.parse(body)
  } catch {
    return json({ error: 'Invalid JSON body' }, 400)
  }

  const paths = [...new Set(await pathsForDocument(payload))]

  if (paths.length === 0) {
    return json({ revalidated: false, reason: `Unmapped _type: ${payload._type}`, paths: [] }, 200)
  }

  const origin = new URL(request.url).origin
  const results = await Promise.allSettled(
    paths.map((path) =>
      fetch(new URL(path, origin), {
        method: 'HEAD',
        headers: { 'x-prerender-revalidate': vercelBypassToken },
      })
    )
  )

  const revalidated = paths.filter((_, i) => results[i].status === 'fulfilled')
  const failed = paths.filter((_, i) => results[i].status === 'rejected')

  return json({ revalidated, failed, type: payload._type, id: payload._id }, 200)
}
