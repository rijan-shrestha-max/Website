import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { gsap } from '@/utils/gsap-register'
import SplitText from '@/components/ui/SplitText'
import { ChevronDown } from 'lucide-react'

const roles = ['Motion Designer', 'Visual Storyteller', 'Creative Designer']

export function Hero() {
  const containerRef = useRef(null)
  const contentRef = useRef(null)
  const [activeRole, setActiveRole] = useState(0)
  
  // Role cycler effect
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveRole(prev => (prev + 1) % roles.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  // GSAP animations on mount
  useEffect(() => {
    if (!contentRef.current) return
    
    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' }
    })

    // Eyebrow: fade in up
    tl.to('.hero-eyebrow', {
      opacity: 1,
      y: 0,
      duration: 0.8,
    }, 0)

    // Name characters: staggered reveal with clipPath
    const nameChars = contentRef.current.querySelectorAll('.hero-name .char')
    nameChars.forEach((char, i) => {
      gsap.set(char, { 
        clipPath: 'inset(0 100% 0 0)',
        y: 20,
        opacity: 0
      })
      
      tl.to(char, {
        clipPath: 'inset(0 0% 0 0)',
        y: 0,
        opacity: 1,
        duration: 0.6,
      }, 0.1 + i * 0.08)
    })

    // Tagline: fade in up
    tl.to('.hero-tagline', {
      opacity: 1,
      y: 0,
      duration: 0.8,
    }, 0.4)

    // Meta info: fade in up
    tl.to('.hero-meta', {
      opacity: 1,
      y: 0,
      duration: 0.8,
    }, 0.6)

    // Scroll indicator: pulse animation
    gsap.to('.hero-scroll-indicator', {
      opacity: 0.5,
      y: 10,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      delay: 2,
    })
  }, [])

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-bg-primary via-bg-primary to-bg-surface flex items-center justify-center"
    >
      {/* Background animated blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent rounded-full mix-blend-screen opacity-10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-accent rounded-full mix-blend-screen opacity-5 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 max-w-4xl px-8 text-center space-y-8"
      >
        {/* Eyebrow */}
        <div
          className="hero-eyebrow text-sm font-medium text-accent opacity-0 tracking-widest uppercase"
          style={{ y: 20 }}
        >
          Portfolio 2025
        </div>

        {/* Name */}
        <h1 className="hero-name text-6xl md:text-7xl lg:text-8xl font-display font-bold text-text-primary leading-tight">
          <SplitText text="Rijan Shrestha" type="chars" className="inline-block" />
        </h1>

        {/* Role Cycler */}
        <div className="h-12 md:h-16 flex items-center justify-center">
          <motion.div
            key={activeRole}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="text-xl md:text-2xl text-accent font-medium"
          >
            {roles[activeRole]}
          </motion.div>
        </div>

        {/* Tagline */}
        <p
          className="hero-tagline text-lg md:text-xl text-text-secondary max-w-2xl mx-auto opacity-0 leading-relaxed"
          style={{ y: 20 }}
        >
          Crafting visuals that move people — frame by frame.
        </p>

        {/* Meta Info */}
        <div
          className="hero-meta flex flex-col md:flex-row gap-6 md:gap-12 justify-center text-sm text-text-muted opacity-0 pt-4"
          style={{ y: 20 }}
        >
          <div>📍 Based in Kathmandu, Nepal</div>
          <div>✨ Available for freelance</div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="hero-scroll-indicator flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
          <span className="text-xs text-text-muted uppercase tracking-widest">Scroll</span>
          <ChevronDown className="w-5 h-5 text-accent" strokeWidth={1.5} />
        </div>
      </div>
    </section>
  )
}

export default Hero
