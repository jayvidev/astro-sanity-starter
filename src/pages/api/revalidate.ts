import { isValidSignature, SIGNATURE_HEADER_NAME } from '@sanity/webhook'
import type { APIRoute } from 'astro'
import { lookup as dnsLookup } from 'node:dns/promises'
import https from 'node:https'

import { config } from '@/config'
import { pathsForDocument, type WebhookPayload } from '@/lib/revalidate-paths'

export const prerender = false

const json = (data: unknown, status: number) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  })

// Fire one ISR revalidation HEAD request. `connectIp`, when given, pins the TCP
// connection to that address while still presenting the URL's host as SNI + Host
// header — so the request reaches Vercel directly (bypassing a proxy/CDN) yet
// revalidates the public host's per-host ISR cache. Resolves to true on a 2xx.
const revalidatePath = (url: URL, token: string, connectIp?: string) =>
  new Promise<boolean>((resolve) => {
    const req = https.request(
      {
        host: connectIp ?? url.hostname,
        servername: url.hostname,
        path: url.pathname + url.search,
        method: 'HEAD',
        headers: { host: url.hostname, 'x-prerender-revalidate': token },
      },
      (res) => {
        res.resume()
        const status = res.statusCode ?? 0
        resolve(status >= 200 && status < 300)
      }
    )
    req.on('error', () => resolve(false))
    req.end()
  })

export const POST: APIRoute = async ({ request }) => {
  const { sanitySecret, vercelBypassToken, origin: revalidationOrigin } = config.revalidation

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

  // Always revalidate the public site host so we hit its per-host ISR cache.
  // When `revalidationOrigin` is set (a non-proxied DNS-only host pointing at the
  // same deploy), resolve it and pin the connection to that IP — the request
  // then bypasses the proxy/CDN while still revalidating the public host.
  const origin = config.site.url || new URL(request.url).origin
  let connectIp: string | undefined
  if (revalidationOrigin) {
    try {
      connectIp = (await dnsLookup(new URL(revalidationOrigin).hostname)).address
    } catch {
      connectIp = undefined
    }
  }

  const oks = await Promise.all(
    paths.map((path) => revalidatePath(new URL(path, origin), vercelBypassToken, connectIp))
  )
  const revalidated = paths.filter((_, i) => oks[i])
  const failed = paths.filter((_, i) => !oks[i])

  return json({ revalidated, failed, type: payload._type, id: payload._id }, 200)
}
