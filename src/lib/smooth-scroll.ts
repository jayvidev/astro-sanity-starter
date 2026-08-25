import Lenis from 'lenis'

import 'lenis/dist/lenis.css'

export function destroySmoothScroll() {
  if (window.appLenis) {
    window.appLenis.destroy()
    window.appLenis = undefined
  }
  if (window.lenisRafId) {
    cancelAnimationFrame(window.lenisRafId)
    window.lenisRafId = undefined
  }
}

export function initSmoothScroll() {
  destroySmoothScroll()

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const lenis = new Lenis({
    lerp: 0.1,
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1.0,
    touchMultiplier: 1.5,
  })

  window.appLenis = lenis

  function raf(time: number) {
    lenis.raf(time)
    window.lenisRafId = requestAnimationFrame(raf)
  }
  window.lenisRafId = requestAnimationFrame(raf)
}
