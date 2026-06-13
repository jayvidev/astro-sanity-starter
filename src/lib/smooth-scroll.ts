import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

export function initSmoothScroll() {
  gsap.registerPlugin(ScrollTrigger)
  ScrollTrigger.config({ limitCallbacks: true })

  if (window.appLenis) {
    window.appLenis.destroy()
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

  window.appLenis = lenis

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
}
