import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/utils/gsap-register'

const steps = [
  { number: '01', title: 'Discover', description: 'Understanding goals, audience, and creative direction through research and planning.' },
  { number: '02', title: 'Concept', description: 'Developing visual concepts, storyboards, and motion ideas aligned with the vision.' },
  { number: '03', title: 'Design', description: 'Creating detailed designs, color palettes, and typography that define the visual language.' },
  { number: '04', title: 'Animate', description: 'Bringing designs to life with smooth animations, transitions, and interactive elements.' },
  { number: '05', title: 'Refine', description: 'Iterating, polishing, and optimizing until every frame is pixel-perfect and purposeful.' }
]

export function Process() {
  const containerRef = useRef(null)
  const progressLineRef = useRef(null)

  useEffect(() => {
    if (!progressLineRef.current) return

    gsap.registerPlugin(ScrollTrigger)

    // Animate progress line on scroll
    gsap.to(progressLineRef.current, {
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top center',
        end: 'bottom center',
        scrub: 1,
      },
      scaleX: 1,
      transformOrigin: 'left center',
      ease: 'none',
    })

    // Stagger step animations
    const stepElements = containerRef.current.querySelectorAll('.process-step')
    stepElements.forEach((step, i) => {
      gsap.from(step, {
        scrollTrigger: {
          trigger: step,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        delay: i * 0.1,
        ease: 'power3.out',
      })
    })
  }, [])

  return (
    <section
      ref={containerRef}
      id="process"
      className="relative min-h-screen w-full bg-bg-surface py-24 px-8"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-24 space-y-4">
          <div className="text-sm font-medium text-accent tracking-widest uppercase">My Process</div>
          <h2 className="text-5xl md:text-6xl font-display font-bold text-text-primary leading-tight">
            How I Work
          </h2>
        </div>

        {/* Timeline */}
        <div className="space-y-12 relative">
          {/* Progress line background */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-bg-elevated"></div>
          {/* Progress line animated */}
          <div
            ref={progressLineRef}
            className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent via-accent to-accent/30 scaleX-0"
          ></div>

          {/* Steps */}
          <div className="space-y-16 pl-24">
            {steps.map((step, i) => (
              <div key={i} className="process-step group">
                {/* Step marker */}
                <div className="absolute left-0 w-16 h-16 -ml-8 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-bg-elevated group-hover:bg-accent/20 transition-colors duration-300 flex items-center justify-center border-2 border-bg-primary group-hover:border-accent transition-colors">
                    <span className="text-sm font-bold text-accent">{step.number}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <h3 className="text-2xl font-display font-bold text-text-primary">{step.title}</h3>
                  <p className="text-text-secondary leading-relaxed max-w-xl">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Process
