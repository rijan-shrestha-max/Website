import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Observer } from 'gsap/Observer'

gsap.registerPlugin(ScrollTrigger, Observer)

// Global GSAP defaults
gsap.defaults({ ease: 'power3.out', duration: 0.8 })

// Prefers reduced motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

if (prefersReducedMotion) {
  gsap.globalTimeline.timeScale(0.01)
}

export { gsap, ScrollTrigger, Observer, prefersReducedMotion }
