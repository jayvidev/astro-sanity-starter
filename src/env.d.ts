/* eslint-disable no-unused-vars */
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="@sanity/astro/module" />

declare global {
  interface Window {
    vtActive?: boolean
    lenis?: import('lenis').default
    lenisTicker?: (_time: number) => void
  }
}

export {}
