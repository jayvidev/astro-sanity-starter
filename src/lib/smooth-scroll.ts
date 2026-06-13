import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

const MIN_DURATION = 0.6
const MAX_DURATION = 2.0
const SECONDS_PER_PX = 0.0012
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

function getHeaderOffset() {
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--header-height').trim()
  if (raw.endsWith('rem')) return parseFloat(raw) * 16
  if (raw.endsWith('px')) return parseFloat(raw)
  return parseFloat(raw) || 100
}

let globalClickListener: EventListener | null = null

export function initSmoothScroll() {
  gsap.registerPlugin(ScrollTrigger)
  ScrollTrigger.config({ limitCallbacks: true })

  if (window.lenis) {
    window.lenis.destroy()
  }
  if (window.lenisTicker) {
    gsap.ticker.remove(window.lenisTicker)
  }

  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1.0,
    touchMultiplier: 1.5,
  })

  window.lenis = lenis

  lenis.on('scroll', ScrollTrigger.update)

  const tickerCallback = (time: number) => {
    lenis.raf(time * 1000)
  }
  window.lenisTicker = tickerCallback
  gsap.ticker.add(tickerCallback)
  gsap.ticker.lagSmoothing(0)

  const refresh = () => ScrollTrigger.refresh()
  window.addEventListener('load', refresh)
  if (document.fonts?.ready) document.fonts.ready.then(refresh)
  setTimeout(refresh, 1000)

  if (globalClickListener) {
    document.removeEventListener('click', globalClickListener, true)
  }

  globalClickListener = (e: Event) => {
    const mouseEvent = e as MouseEvent
    if (
      mouseEvent.defaultPrevented ||
      mouseEvent.button !== 0 ||
      mouseEvent.metaKey ||
      mouseEvent.ctrlKey ||
      mouseEvent.shiftKey
    )
      return
    const target = mouseEvent.target as HTMLElement | null
    const anchor = target?.closest('a[href*="#"]') as HTMLAnchorElement | null
    if (!anchor) return
    const url = new URL(anchor.href, window.location.href)
    if (url.pathname !== window.location.pathname || !url.hash) return
    const el = document.getElementById(decodeURIComponent(url.hash.slice(1)))
    if (!el) return

    mouseEvent.preventDefault()
    mouseEvent.stopPropagation()

    const y = el.getBoundingClientRect().top + window.scrollY - getHeaderOffset()
    const distance = Math.abs(y - window.scrollY)
    const duration = Math.max(MIN_DURATION, Math.min(MAX_DURATION, distance * SECONDS_PER_PX))

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      window.scrollTo(0, y)
    } else {
      lenis.scrollTo(y, { duration, easing: easeInOutCubic })
    }
    history.replaceState(null, '', url.hash)
  }

  document.addEventListener('click', globalClickListener, true)
}
